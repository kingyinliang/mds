<template>
    <div class="header_main">
        <el-card class="searchCard ferCard">
            <el-form :inline="true" :model="formHeader" size="small" labelWidth="75px" class="topform sole_row">
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
                <el-form-item label="罐号：" labelWidth="50px">
                    <el-select v-model="formHeader.holderNo" placeholder="请选择" multiple filterable allowCreate defaultFirstOp style="width: 140px;">
                        <el-option v-for="(sole, index) in guanList" :key="index" :value="sole.holderNo" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="类别：" labelWidth="50px">
                    <el-select v-model="formHeader.halfType" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in halfList" :key="index" :label="item.value" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" labelWidth="50px">
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
        <el-card v-show="fastS" class="searchCard  newCard ferCard" style="margin-top: 5px; overflow: initial;">
            <h3 class="cardTit">
                <i class="iconfont factory-shujuzonglan" style=" margin-right: 10px; color: #666;" />发酵情况总览
                <i class="gotop" @click="gotop"><span>收起</span><i class="el-icon-caret-top" /></i>
            </h3>
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
        </el-card>
        <el-card v-show="fastS" class="searchCard  newCard ferCard" style="margin-top: 5px;">
            <h3 style=" margin-bottom: 8px; color: black; line-height: 20px;">
                <i class="iconfont factory-liebiao" style=" margin-right: 10px; color: #666;" />发酵罐列表
                <i v-if="isAuth('report:production:fermentation')" class="gotop" @click="goSummary()"><a href="#/DataEntry-Fermentation-Fermenter-summary">发酵罐一览表>></a></i>
            </h3>
            <el-row class="dataList" :gutter="10" style="min-height: 150px;">
                <el-col v-for="(item, index) in dataList" :key="index" :span="4">
                    <el-card class="dataList_item">
                        <h3 class="dataList_item_tit">
                            <!--{{item.holderName}}-->
                            {{ item.holderNo }}
                            <span style="color: #333; font-weight: 400; font-size: 14px;">
                                -{{ item.holderStatus === '0' ? '空罐' : item.holderStatus === '1' ? '投料中' : item.holderStatus === '2' ? '发酵中' : item.holderStatus === '3' ? '发酵中' : item.holderStatus === '4' ? '领用中' : item.holderStatus === '5' ? '待清洗' : '' }}
                            </span>
                            <span v-if="isAuth('fer:holderManage:detail')" class="dataList_item_a" style="font-size: 14px;" @click="godetails(item)">详情>></span>
                        </h3>
                        <div class="dataList_item_pot clearfix" style="position: relative;">
                            <img v-if="item.ferOrderNo.slice(0, 4) === RDorder" src="@/assets/img/RD.png" alt="" style="position: absolute; top: 10px; left: 10px;">
                            <div class="dataList_item_pot_box">
                                <div class="dataList_item_pot_box1">
                                    <div v-if="item.holderStatus !== '4'" class="dataList_item_pot_box_item1" :style="`height:${item.reWorkAmount ? (item.reWorkAmount / item.holderAmout) * 100 : 0}%`" />
                                    <div
                                        v-if="item.holderAmout"
                                        class="dataList_item_pot_box_item2"
                                        :class="`${item.holderStatus === '4' ? 'dataList_item_pot_box_item2s' : item.reWorkAmount ? 'dataList_item_pot_box_item2' : 'dataList_item_pot_box_item2s'}`"
                                        :style="
                                            `height:${
                                                item.holderStatus === '4' ? (item.sumAmout / item.holderAmout) * 100 : item.holderStatus === '3' ? (item.sumAmout / item.holderAmout) * 100 : item.halfAmount ? (item.halfAmount / item.holderAmout) * 100 : (item.ferAmount / item.holderAmout) * 100
                                            }%`"
                                    />
                                    <div v-if="item.sumAmout" class="dataList_item_pot_box_detail">
                                        <p>{{ item.ferOrderNo }}</p>
                                        <p>
                                            {{ item.halfTypeName ? item.halfTypeName : item.ferMaterialName }}
                                        </p>
                                        <p>{{ item.ferDays }}天</p>
                                        <p> {{ (item.sumAmout / 1000).toFixed(2) }}方 </p>
                                        <p v-if="item.holderStatus === '3'">
                                            已入库
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-row class="dataList_item_btn">
                            <el-col :span="6" class="dataList_item_btn_item">
                                <p @click="toRouter('1', item)">
                                    发料
                                </p>
                            </el-col>
                            <el-col
                                :span="6"
                                class="dataList_item_btn_item"
                            >
                                <p @click="toRouter('2', item)">
                                    判定
                                </p>
                            </el-col>
                            <el-col
                                :span="6"
                                class="dataList_item_btn_item"
                            >
                                <p @click="toRouter('3', item)">
                                    入库
                                </p>
                            </el-col>
                            <el-col
                                :span="6"
                                class="dataList_item_btn_item"
                            >
                                <p @click="toRouter('4', item)">
                                    清洗
                                </p>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
            <el-row>
                <el-pagination :currentPage="formHeader.currPage" :pageSizes="[40, 60, 80]" :pageSize="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </el-card>
        <el-dialog width="450px" class="ShinHoDialog" :title="dialogData.holderName + '清洗'" :closeOnClickModal="false" :visible.sync="visible">
            <div style="display: flex;">
                <el-form labelWidth="100px" class="topform marbottom" style="margin: auto;">
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
                    ptext: '0个月',
                    middleText: '空罐',
                    holderStatus: '0',
                    num: '0'
                },
                {
                    color: '#D6D2C4FF',
                    startColor: '#E9E9E9FF',
                    endColor: '#D6D2C4FF',
                    text: '1',
                    ptext: '1个月',
                    middleText: '酿造',
                    search: '1',
                    num: '0'
                },
                {
                    color: '#CDA786FF',
                    startColor: '#D6D2C4FF',
                    endColor: '#CDA786FF',
                    text: '2',
                    ptext: '2个月',
                    middleText: '酿造',
                    search: '2',
                    num: '0'
                },
                {
                    color: '#B58150FF',
                    startColor: '#CDA786FF',
                    endColor: '#B58150FF',
                    text: '3',
                    ptext: '3个月',
                    middleText: '酿造',
                    search: '3',
                    num: '0'
                },
                {
                    color: '#C67C5AFF',
                    startColor: '#B58150FF',
                    endColor: '#C67C5AFF',
                    text: '4',
                    ptext: '4个月',
                    middleText: '酿造',
                    search: '4',
                    num: '0'
                },
                {
                    color: '#AD592DFF',
                    startColor: '#C67C5AFF',
                    endColor: '#AD592DFF',
                    text: '5',
                    ptext: '5个月',
                    middleText: '酿造',
                    search: '5',
                    num: '0'
                },
                {
                    color: '#8A391BFF',
                    startColor: '#8A391BFF',
                    endColor: '#8A391BFF',
                    text: '6',
                    ptext: '6个月',
                    middleText: '酿造',
                    search: '6',
                    num: '0'
                },
                {
                    color: '#C70909FF',
                    startColor: '#8A391BFF',
                    endColor: '#C70909FF',
                    text: '超',
                    ptext: '6个月以上',
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
                    middleText: '压榨',
                    holderStatus: '4',
                    num: '0'
                },
                {
                    color: '',
                    startColor: '#999999FF',
                    endColor: '#999999FF',
                    text: '',
                    ptext: '0个月',
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
        /* eslint-enable no-invalid-this*/
        gotop() {
            const $ = this.$;
            $('.sumbox').stop();
            const hei = $('.sumbox .topBox').height();
            if ($('.sumbox').height()) {
                $('.sumbox').css({ overflow: 'hidden' });
                $('.gotop span').text('展开');
                $('.gotop i').attr('class', 'el-icon-caret-bottom');
                $('.sumbox').animate({ height: 0 }, 300);
            } else {
                $('.gotop span').text('收起');
                $('.gotop i').attr('class', 'el-icon-caret-top');
                $('.sumbox').animate({ height: `${hei + 35}px` }, 300, function() {
                    $('.sumbox').css({ overflow: 'initial' });
                });
            }
        },
        // 总览点击
        topClick(item) {
            if (!this.formHeader.factory) {
                this.$warningTost('请选择工厂');
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
                    this.topBox[9].wdm = data.overView.emptyCount;
                } else {
                    this.$error_SHINHO(data.msg);
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
                    this.$error_SHINHO(data.msg);
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
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 获取研发字典
        GetRDorder(id) {
            if (id) {
                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: id, type: 'order_type', value: '研发订单' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.RDorder = data.dicList[0].code;
                    } else {
                        this.$error_SHINHO(data.msg);
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
                        this.$error_SHINHO(data.msg);
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
                        this.$error_SHINHO(data.msg);
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
                    this.$warningTost('该罐不是未清洗状态');
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
                    this.$error_SHINHO(data.msg);
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

    .gotop {
        float: right;
        color: #1890ff;
        font-size: 14px;
        cursor: pointer;

        i {
            ::before {
                color: #1890ff;
            }
        }
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

.dataList {
    margin-top: 10px;

    &_item {
        margin-bottom: 10px;

        &_tit {
            padding: 0 10px;
            color: black;
            font-weight: 600;
            font-size: 16px;
            line-height: 45px;
            border-bottom: 1px solid #e8e8e8;
        }

        &_a {
            float: right;
            color: #1890ff;
            cursor: pointer;
        }

        &_pot {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 17px 10px 10px;
            overflow: hidden;

            &_box1 {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                width: 102px;
                height: 197px;
                overflow: hidden;
            }

            &_box {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                float: left;
                width: 120px;
                min-width: 120px;
                height: 229px;
                padding: 25px 9px 9px;
                overflow: hidden;
                color: white;
                background: url("~@/assets/img/ferPot.png") no-repeat;
                background-size: contain;

                &_detail {
                    position: absolute;
                    top: 70px;
                    left: 3px;
                    width: 100%;
                    color: black;
                    font-size: 14px;
                }

                &_item1,
                &_item2 {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    font-size: 14px;
                }

                &_item2s,
                &_item1 {
                    position: relative;
                    height: 50px;
                    overflow: hidden;
                    background: #69c0ff;

                    &::before,
                    &::after {
                        position: absolute;
                        left: 50%;
                        min-width: 175px;
                        min-height: 165px;
                        background: #fff;
                        animation: roateTwo 10s linear infinite;
                        content: "";
                    }

                    &::before {
                        top: -158px;
                        border-radius: 45%;
                    }

                    &::after {
                        top: -152px;
                        border-radius: 47%;
                        opacity: 0.5;
                    }
                }

                &_item2 {
                    height: 100px;
                    background: #1890ff;
                }

                &:hover &_item1::before,
                &:hover &_item1::after,
                &:hover &_item2s::before,
                &:hover &_item2s::after {
                    animation: roateOne 10s linear infinite;
                }
            }

            &_detail {
                float: left;
                max-width: 112px;
                height: auto;
                margin-top: 25px;
                margin-left: 10px;
                padding: 5px;
                color: #333;
                font-size: 14px;
                line-height: 18px;
                border: 1px solid #1890ff;
                border-radius: 4px;
            }
        }
    }
}

@keyframes roateOne {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }

    50% {
        transform: translate(-50%, -1%) rotateZ(180deg);
    }

    100% {
        transform: translate(-50%, -0%) rotateZ(360deg);
    }
}

@keyframes roateTwo {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }

    50% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }

    100% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
}
</style>
