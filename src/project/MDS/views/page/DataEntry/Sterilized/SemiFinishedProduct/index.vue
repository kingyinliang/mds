<template>
    <div class="header_main">
        <el-card class="searchCard  newCard ferCard">
            <el-form :inline="true" :model="formHeader" size="small" label-width="70px" class="topform sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="半成品罐：">
                    <el-select v-model="formHeader.holderId" filterable>
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in HolderList" :key="index" :value="item.holderId" :label="item.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态：" label-width="50px">
                    <el-select v-model="formHeader.holderStatus" placeholder="请选择" style="width: 140px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in holderStatusList" :key="index" :label="item.name" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('ste:semi:list')" type="primary" size="small" @click="GetList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card v-show="fastS" title="半成品罐列表" name="SemiFinishedProduct" :pack-up="false" style="margin-top: 10px;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px; line-height: 32px;">
                    <em v-if="isAuth('ste:semi:reportForm')" @click="goPot"><a style="color: #487bff; font-size: 14px;">杀菌罐区库存情况>></a></em>
                </div>
            </template>
            <div>
                <el-row class="potList" :gutter="10" style="min-height: 150px;">
                    <el-col v-for="(item, index) in DataList" :key="index" :span="4">
                        <div class="box">
                            <div class="box_title">
                                {{ item.holderNo }}-{{ item.holderStatus === '1' ? '入库中' : item.holderStatus === '0' ? '空罐' : item.holderStatus === '2' ? '满罐' : item.holderStatus === '3' ? '领用中' : item.holderStatus === '4' ? '领用完' : '' }}
                                <a v-if="isAuth('filter:holder:list')" @click="godetails(item)">详情>></a>
                            </div>
                            <div class="box_content">
                                <img v-if="item.isRdSign === '1'" src="@/assets/img/RD.png" alt="" style="position: absolute; top: 0; left: 10px; z-index: 101;">
                                <img v-if="item.exportMaterial !== ''" src="@/assets/img/CK.png" alt="" style="position: absolute; top: 28px; left: 10px; z-index: 101;">
                                <div class="box_content_itemPot">
                                    <div class="pot_border">
                                        <div class="pot" />
                                        <div class="pot_water">
                                            <div
                                                v-if="item.holderStatus === '1' || item.holderStatus === '3' || item.holderStatus === '4'"
                                                class="pot_water_sole"
                                                :style="{'height': (item.amount <= 0 ? '0' : item.amount / item.holderHold > 1 ? '100' : (item.amount / item.holderHold) * 100) + '%', 'background': '#AD592D'}"
                                            />
                                            <div
                                                v-if="item.holderStatus === '2'"
                                                class="pot_water_sole"
                                                :style="{'height': '100%', 'background': '#AD592D'}"
                                            />
                                            <div
                                                v-else
                                                class="pot_water_sole"
                                                :style="{'height': '0%', 'background': '#AD592D'}"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="box_content_itemButton buttonCss">
                                    <el-button type="primary" size="small" :disabled="!isAuth('ste:semi:cleanSteHolder') || item.holderStatus !== '4'" @click="ClearPot(item)">
                                        清罐
                                    </el-button>
                                    <el-button type="primary" size="small" :disabled="!isAuth('ste:gn:save') || item.holderStatus !== '2'" @click="GnProp(item)">
                                        GN搅罐
                                    </el-button>
                                    <el-button type="primary" size="small" :disabled="!isAuth('ste:gn:save') || item.holderStatus === '0' || item.holderStatus === '1'" @click="JsbProp(item)">
                                        JBS出库
                                    </el-button>
                                    <el-button type="primary" size="small" :disabled="!isAuth('ste:semi:dumpSemiMaterial') || item.holderStatus === '0' || item.holderStatus === '1'" @click="ZcProp(item)">
                                        转储
                                    </el-button>
                                </div>
                            </div>
                            <div class="box_bottom" style="height: 90px;">
                                <div v-if="item.holderStatus === '1' || item.holderStatus === '2' || item.holderStatus === '3' || item.holderStatus === '4'">
                                    <div class="box_bottom_sole">
                                        {{ item.materialName }}
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ item.batch }}
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ item.timeLength }}<span v-if="item.timeLength !== '' && item.timeLength !== null">H</span>
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ (item.amount / 1000).toFixed(3) }}方
                                    </div>
                                    <div style="width: 100%;">
                                        {{ item.gnEndTime }}
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
                    <el-pagination :current-page="formHeader.currPage" :page-sizes="[18, 24, 30]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </div>
        </mds-card>
        <el-dialog :close-on-click-modal="false" :visible.sync="GnDialogTableVisible" width="500px" custom-class="dialog__class">
            <div slot="title">
                GN搅罐
            </div>
            <div>
                <el-form ref="Gnstar" size="small" :model="formGn" :rules="Gnrulestar" label-width="150px">
                    <el-form-item label="罐号：">
                        {{ formGn.holderName }}
                    </el-form-item>
                    <el-form-item label="搅罐开始时间：" prop="gnStartTime">
                        <el-date-picker v-model="formGn.gnStartTime" type="datetime" placeholder="请选择" style="width: 200px;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
                    </el-form-item>
                    <el-form-item label="搅罐结束时间：" prop="gnEndTime">
                        <el-date-picker v-model="formGn.gnEndTime" type="datetime" placeholder="请选择" style="width: 200px;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formGn.remark" style="width: 200px;" />
                    </el-form-item>
                    <el-form-item label="操作人：" prop="operator">
                        <el-select v-model="formGn.operator">
                            <el-option v-for="(item, index) in PeopleList" :key="index" :label="item.realName + `(${item.userName})`" :value="item.realName + `(${item.userName})`" />
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="GnDialogTableVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="GnSave('Gnstar')">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="JsbDialogTableVisible" width="500px" custom-class="dialog__class">
            <div slot="title">
                JSB出库
            </div>
            <div>
                <el-form ref="Jsbstar" size="small" :model="formJsb" :rules="Jsbrulestar" label-width="150px">
                    <el-form-item label="领用罐号：">
                        {{ formJsb.holderName }}
                    </el-form-item>
                    <el-form-item label="物料：">
                        {{ formJsb.materialName }} {{ formJsb.materialCode }}
                    </el-form-item>
                    <el-form-item label="批次：">
                        {{ formJsb.batch }}
                    </el-form-item>
                    <el-form-item label="领用量（方）：" prop="receiveAmount">
                        <el-input v-model="formJsb.receiveAmount" style="width: 200px;" />
                    </el-form-item>
                    <el-form-item label="打入罐类别：" prop="inHolderType">
                        <el-select v-model="formJsb.inHolderType" filterable>
                            <el-option v-for="(item, index) in typeList" :key="index" :value="item.code" :label="item.code + ` ${item.name}`" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="打入罐号：" prop="inHolderId">
                        <el-select v-model="formJsb.inHolderId" filterable>
                            <el-option v-for="(item, index) in thrwHolderList" :key="index" :value="item.holderId" :label="item.holderName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否满灌：">
                        <el-select v-model="formJsb.isFull" filterable>
                            <el-option v-for="(item, index) in isFullList" :key="index" :value="item.value" :label="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="满灌时间：">
                        <el-date-picker v-model="formJsb.fullDate" type="datetime" placeholder="请选择" style="width: 200px;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formJsb.remark" style="width: 200px;" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="JsbDialogTableVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="JsbSave('Jsbstar')">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" :visible.sync="ZcDialogTableVisible" width="500px" custom-class="dialog__class">
            <div slot="title">
                转储
            </div>
            <div>
                <el-form ref="Zcstar" size="small" :model="formZc" :rules="Zcrulestar" label-width="150px">
                    <el-form-item label="领用罐号：">
                        {{ formZc.holderName }}
                    </el-form-item>
                    <el-form-item label="物料：">
                        {{ formZc.materialName }} {{ formZc.materialCode }}
                    </el-form-item>
                    <el-form-item label="批次：">
                        {{ formZc.batch }}
                    </el-form-item>
                    <el-form-item label="领用量（方）：" prop="receiveAmount">
                        <el-input v-model="formZc.receiveAmount" style="width: 200px;" />
                    </el-form-item>
                    <el-form-item label="打入罐类别：" prop="inHolderType">
                        <el-select v-model="formZc.inHolderType" filterable @change="GetZhuanPot($event, formZc)">
                            <el-option v-for="(item, index) in typeZcList" :key="index" :value="item.code" :label="item.code + ` ${item.name}`" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="打入罐号：" prop="inHolderId">
                        <el-select v-model="formZc.inHolderId" filterable>
                            <el-option v-for="(item, index) in zhuanHolderList" :key="index" :value="item.holderId" :label="item.holderName" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否满灌：">
                        <el-select v-model="formZc.isFull" filterable>
                            <el-option v-for="(item, index) in isFullList" :key="index" :value="item.value" :label="item.name" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="满灌时间：">
                        <el-date-picker v-model="formZc.fullDate" type="datetime" placeholder="请选择" style="width: 200px;" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
                    </el-form-item>
                    <el-form-item label="备注：">
                        <el-input v-model="formZc.remark" style="width: 200px;" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="ZcDialogTableVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="ZcSave('Zcstar')">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { BASICDATA_API, STERILIZED_API, FILTRATION_API } from '@/api/api';
    export default {
        name: 'Index',
        components: {},
        data() {
            return {
                formHeader: {
                    factory: '',
                    workShop: '',
                    holderId: '',
                    currPage: 1,
                    pageSize: 18,
                    totalCount: 0,
                    holderStatus: ''
                },
                holderStatusList: [
                    {
                        name: '空罐',
                        value: '0'
                    },
                    {
                        name: '入库中',
                        value: '1'
                    },
                    {
                        name: '满罐',
                        value: '2'
                    },
                    {
                        name: '领用中',
                        value: '3'
                    },
                    {
                        name: '领用完',
                        value: '4'
                    }
                ],
                HolderList: [],
                DataList: [],
                GnDialogTableVisible: false,
                formGn: {},
                Gnrulestar: {
                    gnStartTime: [{ required: true, message: '请选择搅罐开始时间', trigger: 'change' }],
                    gnEndTime: [{ required: true, message: '请选择搅罐结束时间', trigger: 'change' }],
                    operator: [{ required: true, message: '请选择操作人', trigger: 'blur' }]
                },
                JsbDialogTableVisible: false,
                formJsb: {},
                Jsbrulestar: {
                    receiveAmount: [{ required: true, message: '请填写领用量', trigger: 'blur' }],
                    inHolderType: [{ required: true, message: '请选择打入罐类别', trigger: 'blur' }],
                    inHolderId: [{ required: true, message: '请填写打入罐号', trigger: 'blur' }]
                },
                ZcDialogTableVisible: false,
                formZc: {},
                Zcrulestar: {
                    receiveAmount: [{ required: true, message: '请填写领用量', trigger: 'blur' }],
                    inHolderType: [{ required: true, message: '请选择打入罐类别', trigger: 'blur' }],
                    inHolderId: [{ required: true, message: '请填写打入罐号', trigger: 'blur' }]
                },
                fastS: false,
                factory: [],
                workshop: [],
                typeList: [],
                thrwHolderList: [],
                PeopleList: [],
                isFullList: [
                    {
                        name: '是',
                        value: '1'
                    },
                    {
                        name: '否',
                        value: '0'
                    }
                ],
                typeZcList: [
                    {
                        code: '006',
                        name: '半成品罐'
                    },
                    {
                        code: '007',
                        name: '成品罐'
                    }
                ],
                zhuanHolderList: []
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
                this.Getdeptbyid(n);
            },
            'formHeader.workShop'(n) {
                this.GetHolder(n);
                this.GetPeople(n);
            },
            'formJsb.inHolderType'(n) {
                this.getPot(n);
            }
            // 'formZc.inHolderType' (n, o) {
            //   this.getPot(n)
            // }
        },
        mounted() {
            this.Getdeptcode();
        },
        methods: {
            goPot() {
                this.$store.state.common.PotReportForms.factory = this.formHeader.factory;
                this.$store.state.common.PotReportForms.workShop = this.formHeader.workShop;
                this.$store.state.common.PotReportForms.type = 'steHolder';
                this.$store.state.common.mainTabs = this.$store.state.common.mainTabs.filter(item => item.name !== 'DataEntry-PotReportForms-index');
                setTimeout(() => {
                    this.$router.push({ name: `DataEntry-PotReportForms-index` });
                }, 100);
            },
            // 去详情
            godetails(item) {
                this.$store.state.common.sterilized.holderId = item.holderId;
                this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'DataEntry-Sterilized-SemiFinishedProduct-detail');
                setTimeout(() => {
                    this.$router.push({ name: `DataEntry-Sterilized-SemiFinishedProduct-detail` });
                }, 100);
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
                    this.DataList = [];
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '杀菌' }, false, false, false).then(({ data }) => {
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
            // 罐
            GetHolder(id) {
                this.formHeader.holderId = '';
                this.DataList = [];
                if (id) {
                    this.$http(`${BASICDATA_API.DROPDOWN_HOLDER_LIST}`, 'POST', { factory: this.formHeader.factory, workShop: id, holderType: '006' }).then(({ data }) => {
                        if (data.code === 0) {
                            this.HolderList = data.list;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }
            },
            GetList(st) {
                if (!this.formHeader.factory) {
                    this.$warningToast('请选择工厂');
                    return false;
                }
                if (!this.formHeader.workShop) {
                    this.$warningToast('请选择车间');
                    return false;
                }
                if (st) {
                    this.formHeader.currPage = 1;
                }
                this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTLIST}`, 'POST', this.formHeader).then(({ data }) => {
                    if (data.code === 0) {
                        this.DataList = data.list.list;
                        this.formHeader.totalCount = data.list.totalCount;
                        this.fastS = true;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.formHeader.pageSize = val;
                this.GetList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.formHeader.currPage = val;
                this.GetList();
            },
            GnProp(row) {
                if (row.holderStatus === '1' || row.holderStatus === '2') {
                    this.formGn = {
                        holderName: row.holderName,
                        holderId: row.holderId,
                        holderNo: row.holderNo,
                        gnStartTime: '',
                        gnEndTime: '',
                        remark: ''
                    };
                    this.GnDialogTableVisible = true;
                } else {
                    this.$warningToast('当前状态不能搅罐');
                }
            },
            GnSave(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTGNSAVE}`, 'POST', this.formGn).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('保存成功');
                                this.GnDialogTableVisible = false;
                                this.GetList();
                                this.$refs[formName].resetFields();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            // 打入罐类别
            GetInHolderType() {
                this.$http(`${FILTRATION_API.FILTER_INHOLDERTYPE_LIST_API}`, 'POST', { factory: this.formHeader.factory }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.typeList = data.list;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            // JBS 打入罐下拉
            getPot(id) {
                this.$http(`${BASICDATA_API.DROPDOWN_HOLDER_LIST}`, 'POST', { factory: this.formHeader.factory, holderType: id }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.thrwHolderList = data.list;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            // 转储打入罐下拉
            GetZhuanPot(event, item) {
                this.formZc.inHolderId = '';
                this.$http(`${STERILIZED_API.SEMIFINIS_DROPDOWN_LIST}`, 'POST', { factory: this.formHeader.factory, code: event, materialCode: item.materialCode, batch: item.batch, holderId: item.holderId }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.zhuanHolderList = data.list;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            JsbProp(row) {
                // 领用中 满灌 入库中
                if (row.holderStatus === '1' || row.holderStatus === '2' || row.holderStatus === '3' || row.holderStatus === '4') {
                    this.typeList = [];
                    this.GetInHolderType();
                    this.formJsb = {
                        amount: row.amount,
                        holderId: row.holderId,
                        holderName: row.holderName,
                        receiveHolderId: row.holderId,
                        materialName: row.materialName,
                        materialCode: row.materialCode,
                        batch: row.batch,
                        receiveAmount: '',
                        inHolderType: '',
                        inHolderId: '',
                        isFull: '0',
                        fullDate: '',
                        remark: ''
                    };
                    this.JsbDialogTableVisible = true;
                } else {
                    this.$warningToast('当前状态不能JBS出库');
                }
            },
            ZcProp(row) {
                if (row.holderStatus === '1' || row.holderStatus === '2' || row.holderStatus === '3') {
                    this.typeList = [];
                    this.GetInHolderType();
                    this.formZc = {
                        amount: row.amount,
                        holderId: row.holderId,
                        holderName: row.holderName,
                        receiveHolderId: row.holderId,
                        materialName: row.materialName,
                        materialCode: row.materialCode,
                        batch: row.batch,
                        receiveAmount: '',
                        inHolderType: '',
                        inHolderId: '',
                        isFull: '0',
                        fullDate: '',
                        remark: ''
                    };
                    this.ZcDialogTableVisible = true;
                } else {
                    this.$warningToast('当前状态不能转储');
                }
            },
            JsbSave(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.formJsb.receiveAmount * 1000 > this.formJsb.amount) {
                            this.$warningToast('领用量不能大于库存');
                            return false;
                        }
                        if (this.formJsb.isFull === '1' && (this.formJsb.fullDate === '' || !this.formJsb.fullDate)) {
                            this.$warningToast('满灌时请选择满罐时间');
                            return false;
                        }
                        this.formJsb.factory = this.formHeader.factory;
                        this.formJsb.workShop = this.formHeader.workShop;
                        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTJSBSAVE}`, 'POST', this.formJsb).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('保存成功');
                                this.JsbDialogTableVisible = false;
                                this.GetList();
                                this.$refs[formName].resetFields();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            ZcSave(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        if (this.formZc.receiveAmount * 1000 > this.formZc.amount) {
                            this.$warningToast('领用量不能大于库存');
                            return false;
                        }
                        if (this.formZc.isFull === '1' && (this.formZc.fullDate === '' || !this.formZc.fullDate)) {
                            this.$warningToast('满灌时请选择满罐时间');
                            return false;
                        }
                        this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTZCSAVE}`, 'POST', this.formZc).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('保存成功');
                                this.ZcDialogTableVisible = false;
                                this.GetList();
                                this.$refs[formName].resetFields();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            GetPeople(id) {
                this.PeopleList = [];
                if (id) {
                    this.$http(`${STERILIZED_API.SEMIFINISHEDPRODUCTUSERLIST}`, 'POST', { deptId: id }).then(({ data }) => {
                        if (data.code === 0) {
                            this.PeopleList = data.list;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }
            },
            // 清罐
            ClearPot(item) {
                if (item.holderStatus !== '4') {
                    this.$warningToast('未领用完不能清罐')
                    return false
                }
                this.$confirm('清罐后，账务将清零，请确认实物已空！', '清罐确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(`${STERILIZED_API.SEMIFINISH_CLEAN_HOLDER}`, 'POST', item).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast('操作成功');
                            this.GetList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
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
            border-bottom: 1px solid #e9e9e9;
        }
        .gotop {
            float: right;
            color: #1890ff;
            font-size: 14px;
            cursor: pointer;
            em {
                &::before {
                    color: #1890ff;
                }
            }
        }
    }
    .buttonCss .el-button--primary {
        width: 57px;
        padding: 9px 0;
        text-align: center;
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
