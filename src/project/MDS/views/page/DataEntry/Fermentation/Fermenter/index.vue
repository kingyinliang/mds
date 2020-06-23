<template>
    <div class="header_main">
        <el-card class="searchCard ferCard">
            <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="topform sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="罐号：" label-width="50px">
                    <el-select v-model="formHeader.holderNo" placeholder="请选择" multiple filterable allow-create default-first-op style="width: 140px;">
                        <el-option v-for="(sole, index) in guanList" :key="index" :value="sole.holderNo" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类别：" label-width="50px">
                    <el-select v-model="formHeader.halfType" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in halfList" :key="index" :label="item.value" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" label-width="50px">
                    <el-select v-model="formHeader.holderStatus" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <template v-for="(item, index) in holderStatusList">
                            <el-option v-if="item.code !== '2' && item.code !== '3'" :key="index" :label="item.value" :value="item.code" />
                        </template>
                        <template v-for="(item, index) in holderStatusList">
                            <el-option v-if="item.code === '2'" :key="index" label="发酵中" value="2,3" />
                        </template>
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right; margin-right: 0;">
                    <el-button v-if="isAuth('fer:holderManage:list')" type="primary" size="small" style="float: right;" @click="GetDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card v-show="fastS" :title="'发酵情况总览'" :name="'fermenterTotal'" style="margin-top: 10px; overflow: initial;">
            <div class="sumbox">
                <div class="topBox clearfix">
                    <div v-for="(item, index) in topBox" :key="index" class="clearfix" style="float: left;">
                        <div class="topBox_boxItem" @click="topClick(item)">
                            <div style="overflow: hidden;">
                                <div class="topBox_boxItem_bar">
                                    <div
                                        class="topBox_boxItem_bar_box"
                                        :style="{ background: `linear-gradient(to right,${item.startColor} 0%,${item.startColor} 10%,${item.startColor})`}"
                                    />
                                </div>
                                <div style="float: left; width: 32px; font-size: 14px; line-height: 30px; text-align: center;">
                                    {{ item.middleText }}
                                </div>
                                <div class="topBox_boxItem_bar">
                                    <div
                                        class="topBox_boxItem_bar_box"
                                        :style="{
                                            background: `linear-gradient(to right,${item.endColor} 0%,${item.endColor} 10%,${item.endColor})`,
                                        }"
                                    />
                                </div>
                            </div>
                            <p class="topBox_boxItem_tit">
                                {{ item.ptext }}
                            </p>
                            <p class="topBox_boxItem_detail">
                                总计: <span>{{ item.num }}</span> 罐
                            </p>
                            <div v-if="index > 0 && index < 7" class="topBox_boxItem_popover">
                                <p class="">
                                    <i class="dot" style="background: #1890ff;" />味极鲜<span style="float: right;">{{ item.wdm }} 罐</span>
                                </p>
                                <p class="">
                                    <i class="dot" style="background: #ffbf00;" />六月鲜<span style="float: right;">{{ item.lyx }} 罐</span>
                                </p>
                                <i class="topBox_boxItem_popover_ar" />
                            </div>
                        </div>
                        <div v-if="item.color" class="topBox_circle" :style="{ background: item.color }">
                            {{ item.text }}
                        </div>
                    </div>
                </div>
            </div>
        </mds-card>
        <div v-show="fastS" class="box-card">
            <div class="box-card-title clearfix">
                <h3> <i class="title-icon" style="background: #ffbf00;" />发酵罐列表 </h3>
                <i v-if="isAuth('report:production:fermentation')" class="floatR" @click="goSummary()">
                    <a href="#/DataEntry-Fermentation-Fermenter-summary">发酵罐一览表>></a>
                </i>
            </div>
            <div>
                <el-row class="potList" :gutter="10" style="min-height: 150px;">
                    <el-col v-for="(item, index) in dataList" :key="index" :span="4">
                        <div class="box">
                            <div class="box_title">
                                {{ item.holderNo }}-{{ item.holderStatus === '0' ? '空罐' : item.holderStatus === '1' ? '投料中' : item.holderStatus === '2' ? '发酵中' : item.holderStatus === '3' ? '已入库' : item.holderStatus === '4' ? '领用中' : item.holderStatus === '5' ? '待清洗' : '' }}
                                <a v-if="isAuth('fer:holderManage:detail')" @click="godetails(item)">详情>></a>
                            </div>
                            <div class="box_content">
                                <img v-if="item.ferOrderNo.slice(0, 4) === RDorder" src="@/assets/img/RD.png" alt="" style="position: absolute; top: 10px; left: 10px;">
                                <div class="box_content_itemPot">
                                    <div class="pot_border">
                                        <div class="pot" />
                                        <div class="pot_water">
                                            <div
                                                class="pot_water_sole"
                                                :style="{'height': (item.holderStatus === '4' ? (item.sumAmout / item.holderAmout) * 100 : item.holderStatus === '3' ? (item.sumAmout / item.holderAmout) * 100 : item.halfAmount ? (item.halfAmount / item.holderAmout) * 100 : (item.ferAmount / item.holderAmout) * 100) + '%', 'background': item.potColor}"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="box_content_itemButton buttonCss">
                                    <el-button type="primary" size="small" @click="toRouter('1', item)">
                                        发料
                                    </el-button>
                                    <el-button type="primary" size="small" @click="toRouter('2', item)">
                                        判定
                                    </el-button>
                                    <el-button type="primary" size="small" @click="toRouter('3', item)">
                                        入库
                                    </el-button>
                                    <el-button type="primary" size="small" @click="toRouter('4', item)">
                                        清洗
                                    </el-button>
                                </div>
                            </div>
                            <div class="box_bottom">
                                <div v-if="item.sumAmout">
                                    <div class="box_bottom_sole">
                                        {{ item.halfTypeName ? item.halfTypeName : item.ferMaterialName }}
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ item.ferDays }}天
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ item.ferOrderNo }}
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ (item.sumAmout / 1000).toFixed(2) }}方
                                    </div>
                                </div>
                                <div v-else>
                                    <div class="box_bottom_sole colorGray">
                                        暂无数据
                                    </div>
                                    <div class="box_bottom_sole colorGray">
                                        暂无数据
                                    </div>
                                    <div class="box_bottom_sole colorGray">
                                        暂无数据
                                    </div>
                                    <div class="box_bottom_sole colorGray">
                                        暂无数据
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-pagination :current-page="formHeader.currPage" :page-sizes="[40, 60, 80]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </div>
        </div>
        <el-dialog width="450px" class="ShinHoDialog" :title="dialogData.holderName + '清洗'" :close-on-click-modal="false" :visible.sync="visible">
            <div style="display: flex;">
                <el-form label-width="100px" class="topform marbottom" style="margin: auto;">
                    <el-form-item label="罐号：">
                        <p>{{ dialogData.holderNo }}</p>
                    </el-form-item>
                    <el-form-item label="状态：">
                        <p>待清洗</p>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox-group v-model="a">
                            <el-checkbox label="清洗完成" name="type" :disabled="true" />
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="dialogData.remark" size="small" placeholder="手工录入" style="width: 260px;" />
                    </el-form-item>
                    <el-form-item label="录入人员：">
                        {{ $store.state.user.realName + '（' + this.$store.state.user.name + '）' }}
                    </el-form-item>
                    <el-form-item label="录入时间：">
                        {{ newData }}
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="rinse()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { SYSTEMSETUP_API, BASICDATA_API, FERMENTATION_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            newData: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            fastS: false,
            visible: false,
            dialogData: {},
            a: true,
            RDorder: '',
            topBox: [
                {
                    color: '#999999FF',
                    startColor: '#999999FF',
                    endColor: '#999999FF',
                    text: '空',
                    ptext: '',
                    numNew: 0,
                    potColor: '#FFF',
                    middleText: '空罐',
                    holderStatus: '0',
                    num: '0'
                },
                {
                    color: '#D6D2C4FF',
                    startColor: '#E9E9E9FF',
                    endColor: '#D6D2C4FF',
                    text: '1',
                    ptext: '30天',
                    numNew: 30,
                    potColor: '#999999',
                    middleText: '酿造',
                    search: '1',
                    num: '0'
                },
                {
                    color: '#CDA786FF',
                    startColor: '#D6D2C4FF',
                    endColor: '#CDA786FF',
                    text: '2',
                    ptext: '60天',
                    numNew: 60,
                    potColor: '#D6D2C4',
                    middleText: '酿造',
                    search: '2',
                    num: '0'
                },
                {
                    color: '#B58150FF',
                    startColor: '#CDA786FF',
                    endColor: '#B58150FF',
                    text: '3',
                    ptext: '90天',
                    numNew: 90,
                    potColor: '#CDA786',
                    middleText: '酿造',
                    search: '3',
                    num: '0'
                },
                {
                    color: '#C67C5AFF',
                    startColor: '#B58150FF',
                    endColor: '#C67C5AFF',
                    text: '4',
                    ptext: '120天',
                    numNew: 120,
                    potColor: '#B58150',
                    middleText: '酿造',
                    search: '4',
                    num: '0'
                },
                {
                    color: '#AD592DFF',
                    startColor: '#C67C5AFF',
                    endColor: '#AD592DFF',
                    text: '5',
                    ptext: '150天',
                    numNew: 150,
                    potColor: '#C67C5A',
                    middleText: '酿造',
                    search: '5',
                    num: '0'
                },
                {
                    color: '#8A391BFF',
                    startColor: '#8A391BFF',
                    endColor: '#8A391BFF',
                    text: '6',
                    ptext: '180天',
                    numNew: 180,
                    potColor: '#AD592D',
                    middleText: '酿造',
                    search: '6',
                    num: '0'
                },
                {
                    color: '#C70909FF',
                    startColor: '#8A391BFF',
                    endColor: '#C70909FF',
                    text: '超',
                    ptext: '180天以上',
                    numNew: 9999999999999,
                    potColor: '#8A391B',
                    middleText: '超期',
                    search: '7',
                    num: '0'
                },
                {
                    color: '#8BC34AFF',
                    startColor: '#C70909FF',
                    endColor: '#8BC34AFF',
                    text: '压',
                    ptext: ' ',
                    numNew: 0,
                    potColor: '#C70909',
                    middleText: '压榨',
                    holderStatus: '4',
                    num: '0'
                },
                {
                    color: '',
                    startColor: '#999999FF',
                    endColor: '#999999FF',
                    text: '',
                    ptext: '',
                    numNew: 0,
                    potColor: '#FFF',
                    middleText: '空罐',
                    holderStatus: '0',
                    num: '0'
                }
            ],
            formHeader: {
                factory: '',
                workShop: '',
                holderNo: [],
                halfType: '',
                holderStatus: '',
                dateFlag: '',
                currPage: 1,
                pageSize: 42,
                totalCount: 0
            },
            factory: [],
            workshop: [],
            guanList: [],
            halfList: [],
            holderStatusList: [],
            dataList: []
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            this.formHeader.holderStatus = '';
            this.Getdeptbyid(n);
            this.GetRDorder(n);
            this.GetHolderStatusList(n);
        },
        'formHeader.workShop'(n) {
            this.formHeader.holderNo = [];
            this.formHeader.halfType = '';
            this.GetHalfList(n);
            this.HolderList(n);
        }
    },
    mounted() {
        this.Getdeptcode();
        this.ani();
    },
    methods: {
        /* eslint-disable no-invalid-this*/
        ani() {
            const $ = this.$;
            this.$('.topBox_boxItem').hover(
                function() {
                    $(this)
                        .find('.topBox_boxItem_popover')
                        .stop();
                    $(this)
                        .find('.topBox_boxItem_bar_box')
                        .stop();
                    $(this)
                        .find('.topBox_boxItem_popover')
                        .show(500);
                    $(this)
                        .find('.topBox_boxItem_bar_box')
                        .css({ width: 0 });
                    $(this)
                        .find('.topBox_boxItem_tit')
                        .css({ color: '#1890FF' });
                    $(this)
                        .find('.topBox_boxItem_bar_box')
                        .animate({ width: '100%' }, 500);
                    $(this)
                        .parent()
                        .find('.topBox_circle')
                        .css({ transform: 'scale(1.2)' });
                    $(this)
                        .parent()
                        .prev()
                        .find('.topBox_circle')
                        .css({ transform: 'scale(1.2)' });
                },
                function() {
                    $(this)
                        .find('.topBox_boxItem_tit')
                        .css({ color: 'black' });
                    $(this)
                        .find('.topBox_boxItem_popover')
                        .hide(500);
                    $(this)
                        .parent()
                        .find('.topBox_circle')
                        .css({ transform: 'scale(1.0)' });
                    $(this)
                        .parent()
                        .prev()
                        .find('.topBox_circle')
                        .css({ transform: 'scale(1.0)' });
                }
            );
        },
        // 总览点击
        topClick(item) {
            if (!this.formHeader.factory) {
                this.$warningToast('请选择工厂');
                return;
            }
            this.formHeader.currPage = 1;
            this.formHeader.holderNo = [];
            this.formHeader.halfType = '';
            this.formHeader.dateFlag = '';
            this.formHeader.holderStatus = '';
            if (item.search) {
                this.formHeader.dateFlag = item.search;
            } else {
                this.formHeader.holderStatus = item.holderStatus;
            }
            this.GetDataList('top');
        },
        // 查询
        GetDataList(ty) {
            if (ty) {
                this.formHeader.currPage = 1;
                if (ty === true) {
                    this.formHeader.dateFlag = '';
                }
            }
            const obj = JSON.parse(JSON.stringify(this.formHeader));
            obj.currPage = String(obj.currPage);
            obj.pageSize = String(obj.pageSize);
            obj.totalCount = String(obj.totalCount);
            // if (obj.holdNo.length > 1) {
            //   obj.holdNo.splice(0, 1)
            //   obj.holdNo = obj.holdNo.join(',')
            // } else {
            //   obj.holdNo = obj.holdNo.join(',')
            // }
            obj.holderNo = obj.holderNo.join(',');
            this.$http(`${FERMENTATION_API.FER_LIST_API}`, 'POST', obj).then(({ data }) => {
                if (data.code === 0) {
                    this.fastS = true;
                    this.dataList = data.orderPage.list;
                    this.dataList.map((item) => {
                        // item.ferDays
                        item.potColor = this.topBox.find(sole => item.ferDays < sole.numNew).potColor
                    })
                    this.formHeader.currPage = data.orderPage.currPage;
                    this.formHeader.totalCount = data.orderPage.totalCount;
                    this.formHeader.pageSize = data.orderPage.pageSize;
                    this.topBox[0].num = data.overView.emptyCount;
                    this.topBox[1].num = data.overView.oneMonthCount;
                    this.topBox[1].wdm = data.overView.wdmOneMonthCount;
                    this.topBox[1].lyx = data.overView.lyxOneMonthCount;
                    this.topBox[2].num = data.overView.twoMonthCount;
                    this.topBox[2].wdm = data.overView.wdmTwoMonthCount;
                    this.topBox[2].lyx = data.overView.lyxTwoMonthCount;
                    this.topBox[3].num = data.overView.threeMonthCount;
                    this.topBox[3].wdm = data.overView.wdmThreeMonthCount;
                    this.topBox[3].lyx = data.overView.lyxThreeMonthCount;
                    this.topBox[4].num = data.overView.fourMonthCount;
                    this.topBox[4].wdm = data.overView.wdmFourMonthCount;
                    this.topBox[4].lyx = data.overView.lyxFourMonthCount;
                    this.topBox[5].num = data.overView.fiveMonthCount;
                    this.topBox[5].wdm = data.overView.wdmFiveMonthCount;
                    this.topBox[5].lyx = data.overView.lyxFiveMonthCount;
                    this.topBox[6].num = data.overView.sixMonthCount;
                    this.topBox[6].wdm = data.overView.wdmSixMonthCount;
                    this.topBox[6].lyx = data.overView.lyxSixMonthCount;
                    this.topBox[7].num = data.overView.outCount;
                    this.topBox[8].num = data.overView.useCount;
                    this.topBox[9].num = data.overView.emptyCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '发酵' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 获取研发字典
        GetRDorder(id) {
            if (id) {
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: id, type: 'order_type', valueS: '研发订单' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.RDorder = data.dicList[0].code;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 罐号
        HolderList() {
            this.$http(
                `${BASICDATA_API.BASEHOLDERLIST_API}`,
                'POST',
                {
                    factory: this.formHeader.factory,
                    workShop: this.formHeader.workShop
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.guanList = data.holderList;
            });
        },
        // 获取半成品
        GetHalfList(id) {
            if (id) {
                this.$http(`${FERMENTATION_API.FER_HALF_LIST_API}`, 'POST', { factory: this.formHeader.factory, workShop: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.halfList = data.halfList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 获取发酵罐状态
        GetHolderStatusList(id) {
            if (id) {
                this.$http(`${FERMENTATION_API.FER_HOLDER_STATUS_API}`, 'POST', { factory: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.holderStatusList = data.statusList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 去详请
        godetails(row) {
            this.$store.state.common.Fermentation.details = row;
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Fermentation-Fermenter-details');
            setTimeout(() => {
                this.$router.push({
                    name: `DataEntry-Fermentation-Fermenter-details`
                });
            }, 100);
        },
        // 发酵罐一览表
        goSummary() {
            this.$store.state.common.Fermentation.workShop = this.formHeader.workShop;
            this.$store.state.common.Fermentation.factory = this.formHeader.factory;
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'DataEntry-Fermentation-Fermenter-summary');
            setTimeout(() => {
                this.$router.push({
                    name: `DataEntry-Fermentation-Fermenter-summary`
                });
            }, 100);
        },
        toRouter(str, row) {
            let url = '';
            if (str === '1') {
                this.$store.state.common.Fermentation.materia.factory = row.factory;
                this.$store.state.common.Fermentation.materia.workShop = row.workShop;
                this.$store.state.common.Fermentation.materia.ferMaterialCode = '';
                this.$store.state.common.Fermentation.materia.holderIds = [row.holderId];
                this.$store.state.common.Fermentation.materia.ferOrderNos = [row.ferOrderNo];
                this.$store.state.common.Fermentation.materia.approveStatus = '';
                this.$store.state.common.Fermentation.materia.productDateOne = '';
                this.$store.state.common.Fermentation.materia.productDateTwo = '';
                url = 'DataEntry-Fermentation-MaterialManage-index';
            } else if (str === '2') {
                this.$store.state.common.Fermentation.category.factory = row.factory;
                this.$store.state.common.Fermentation.category.workShop = row.workShop;
                this.$store.state.common.Fermentation.category.holderId = row.holderId;
                this.$store.state.common.Fermentation.category.orderNo = row.ferOrderNo;
                this.$store.state.common.Fermentation.category.materialCode = row.ferMaterialCode;
                this.$store.state.common.Fermentation.category.ferDays = row.ferDays === null ? '' : String(row.ferDays);
                this.$store.state.common.Fermentation.category.halfId = row.halfType;
                this.$store.state.common.Fermentation.category.currPage = 1;
                this.$store.state.common.Fermentation.category.pageSize = 10;
                this.$store.state.common.Fermentation.category.totalCount = 10;
                this.$store.state.common.Fermentation.category.isJudged = 0;
                url = 'DataEntry-Fermentation-CategoryJudgement-index';
            } else if (str === '3') {
                this.$store.state.common.FerInStockManage.factoryId = row.factory;
                this.$store.state.common.FerInStockManage.workshopId = row.workShop;
                this.$store.state.common.FerInStockManage.startDate = '';
                this.$store.state.common.FerInStockManage.endDate = '';
                this.$store.state.common.FerInStockManage.holderList = [row.holderId];
                this.$store.state.common.FerInStockManage.orderList = [row.ferOrderNo];
                url = 'DataEntry-Fermentation-InStockManage-index';
            } else if (str === '4') {
                url = '';
                if (row.holderStatus === '5') {
                    this.dialogData = row;
                    this.visible = true;
                } else {
                    this.$warningToast('该罐不是未清洗状态');
                }
                return;
            }
            this.mainTabs = this.mainTabs.filter(item => item.name !== url);
            setTimeout(() => {
                this.$router.push({ name: url });
            }, 100);
        },
        rinse() {
            this.$http(`${FERMENTATION_API.FER_RINSE_API}`, 'POST', this.dialogData).then(({ data }) => {
                if (data.code === 0) {
                    this.dialogData.holderStatus = '0';
                    this.visible = false;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.GetDataList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.GetDataList();
        }
    }
};
</script>

<style lang="scss" scoped>
.ferCard {
    .el-card__body {
        padding: 7px;
    }
    .cardTit {
        padding-bottom: 10px;
        color: black;
        font-weight: 400;
        font-size: 16px;
    }
}
.topBox {
    width: 1260px;
    margin: auto;
    padding: 10px 0;
    &_boxItem {
        position: relative;
        // width: 102px;
        float: left;
        cursor: pointer;
        &_bar {
            float: left;
            width: 30px;
            height: 2px;
            margin: 15px 0 0;
            background: #f2f2f2;
            &_box {
                height: 2px;
            }
        }
        &_tit {
            height: 32px;
            color: black;
            font-size: 14px;
            line-height: 32px;
            // margin-top: 10px;
            text-align: center;
        }
        &_detail {
            color: #666;
            font-size: 14px;
            text-align: center;
            span {
                color: black;
                font-size: 16px;
            }
        }
        &_popover {
            position: absolute;
            top: -60px;
            z-index: 999999;
            display: none;
            min-width: 150px;
            min-height: 52px;
            padding: 10px 16px;
            font-size: 13px;
            line-height: 18px;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
            .dot {
                float: left;
                width: 6px;
                height: 6px;
                margin: 4px 5px 0 0;
                border-radius: 50%;
            }
            &_ar {
                position: absolute;
                bottom: -12px;
                width: 0;
                height: 0;
                border-color: #fff transparent transparent;
                border-style: solid;
                border-width: 6px;
            }
        }
    }
    &_circle {
        float: left;
        width: 32px;
        height: 32px;
        margin: 0 2px;
        color: white;
        line-height: 32px;
        text-align: center;
        background: #999;
        border-radius: 50%;
        transition: all 0.5s;
    }
}
.buttonCss .el-button--primary:first-child {
    color: #000;
    background-color: #fff;
    border-color: #d9d9d9;
}
.buttonCss .el-button--primary:hover {
    color: #fff;
    background-color: #1890ff;
}
</style>
