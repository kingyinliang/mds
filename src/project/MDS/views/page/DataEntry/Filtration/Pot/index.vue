<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :inline="true" size="small" :model="formHeader" label-width="70px" class="topform marbottom sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="罐号：">
                    <el-select v-model="formHeader.holderId" filterable placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(sole, index) in PotList" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('filter:holder:list')" type="primary" size="small" style="float: right;" @click="GetDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card v-show="fastS" title="成品罐区" name="potTotal" :pack-up="false" style="margin-top: 10px;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px; line-height: 32px;">
                    <em v-if="isAuth('ste:semi:reportForm')"><a style="color: #487bff; font-size: 14px;" @click="goPot">杀菌罐区库存情况>></a></em>
                </div>
            </template>
            <div>
                <el-row class="potList" :gutter="10" style="min-height: 150px;">
                    <el-col v-for="(item, index) in dataList" :key="index" :span="4">
                        <div class="box">
                            <div class="box_title">
                                {{ item.holderNo }}-{{ item.holderStatus === '0' ? '空罐' : item.holderStatus === '1' ? '入库中' : item.holderStatus === '2' ? '满罐' : item.holderStatus === '3' ? '领用中' : item.holderStatus === '4' ? '领用完' : '' }}
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
                                                class="pot_water_sole"
                                                :style="{'height': (item.holderStatus === '0' ? 0 : item.amount < 0 ? 0 : ((item.amount * 1) / (item.holderHold * 1)) * 100) + '%', 'background': '#AD592D'}"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="box_content_itemButton buttonCss">
                                    <el-button type="primary" size="small" @click="clearPot(item)">
                                        清罐
                                    </el-button>
                                    <el-button type="primary" size="small" @click="JBSdialog(item)">
                                        JBS出库
                                    </el-button>
                                    <el-button type="primary" size="small" @click="TurnSavedialog(item)">
                                        转储
                                    </el-button>
                                </div>
                            </div>
                            <div class="box_bottom" style="height: 90px;">
                                <div v-if="item.holderStatus !== '0'">
                                    <div class="box_bottom_sole">
                                        {{ item.batch || '' }}
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ item.timeLength || '' }}H
                                    </div>
                                    <div class="box_bottom_sole">
                                        {{ (item.amount * 10) / 10000 || '' }}方
                                    </div>
                                    <div class="box_bottom_sole" />
                                    <div style="width: 100%; overflow: hidden; white-space: nowrap;">
                                        {{ (item.materialName || '') + ' ' + (item.materialCode || '') }}
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
                                    <div class="box_bottom_sole colorGray" />
                                    <div class="colorGray" style="width: 100%;">
                                        暂无数据
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </mds-card>
        <el-dialog width="400px" title="JBS出库" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="JBSVisible">
            <el-form ref="JBSdataForm" :model="JBSdataForm" :rules="JBSdataRule" label-width="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="JBS()" @submit.native.prevent>
                <el-form-item label="领用罐号：" prop="receiveHolderId">
                    <p>{{ JBSdataForm.holderName }}</p>
                </el-form-item>
                <el-form-item label="物料：" prop="materialCode">
                    <p>
                        {{ JBSdataForm.materialName + ' ' + JBSdataForm.materialCode }}
                    </p>
                </el-form-item>
                <el-form-item label="批次：" prop="batch">
                    <p>{{ JBSdataForm.batch }}</p>
                </el-form-item>
                <el-form-item label="领用量(方)：" prop="receiveAmount">
                    <el-input v-model="JBSdataForm.receiveAmount" size="small" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="打入罐类别：" prop="inHolderType">
                    <el-select v-model="JBSdataForm.inHolderType" filterable placeholder="请选择" @change="GetHolderType(JBSdataForm.inHolderType)">
                        <el-option v-for="(sole, index) in InHolderType" :key="index" :value="sole.code" :label="sole.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="打入罐号：" prop="inHolderId">
                    <el-select v-model="JBSdataForm.inHolderId" filterable placeholder="请选择">
                        <el-option v-for="(sole, index) in Holder" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否满罐：">
                    <el-select v-model="JBSdataForm.isFull" filterable placeholder="请选择" style="width: 100%;">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="满罐日期：">
                    <el-date-picker v-model="JBSdataForm.fullDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="请选择日期" style="width: 190px;" />
                </el-form-item>
                <el-form-item label="操作时间：">
                    <p>{{ JBSdataForm.changed }}</p>
                </el-form-item>
                <el-form-item label="操作人：">
                    <p>
                        {{ (JBSdataForm.changer = $store.state.user.realName + '（' + this.$store.state.user.name + '）') }}
                    </p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="JBSVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="JBS()">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog width="400px" title="转储" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="TurnSaveVisible">
            <el-form ref="TurnSavedataForm" :model="TurnSavedataForm" :rules="TurnSavedataRule" label-width="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="TurnSave()" @submit.native.prevent>
                <el-form-item label="领用罐号：" prop="receiveHolderId">
                    <p>{{ TurnSavedataForm.holderName }}</p>
                </el-form-item>
                <el-form-item label="物料：" prop="materialCode">
                    <p>
                        {{ TurnSavedataForm.materialName + ' ' + TurnSavedataForm.materialCode }}
                    </p>
                </el-form-item>
                <el-form-item label="批次：" prop="batch">
                    <p>{{ TurnSavedataForm.batch }}</p>
                </el-form-item>
                <el-form-item label="领用量(方)：" prop="receiveAmount">
                    <el-input v-model="TurnSavedataForm.receiveAmount" size="small" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="打入罐类别：" prop="inHolderType">
                    <el-select v-model="TurnSavedataForm.inHolderType" filterable placeholder="请选择" @change="GetHolderType1(TurnSavedataForm)">
                        <el-option value="006" label="半成品罐" />
                        <el-option value="007" label="成品罐" />
                    </el-select>
                </el-form-item>
                <el-form-item label="打入罐号：" prop="inHolderId">
                    <el-select v-model="TurnSavedataForm.inHolderId" filterable placeholder="请选择">
                        <el-option v-for="(sole, index) in Holder" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否满罐：">
                    <el-select v-model="TurnSavedataForm.isFull" filterable placeholder="请选择" style="width: 100%;">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="满罐日期：">
                    <el-date-picker v-model="TurnSavedataForm.fullDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="请选择日期" style="width: 190px;" />
                </el-form-item>
                <el-form-item label="操作时间：">
                    <p>{{ TurnSavedataForm.changed }}</p>
                </el-form-item>
                <el-form-item label="操作人：">
                    <p>
                        {{ (TurnSavedataForm.changer = $store.state.user.realName + '（' + this.$store.state.user.name + '）') }}
                    </p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="TurnSaveVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="TurnSave()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getFactory, getWorkshop, dateFormat } from '@/net/validate';
import { FILTRATION_API, BASICDATA_API, STERILIZED_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            fastS: false,
            JBSVisible: false,
            TurnSaveVisible: false,
            formHeader: {
                factory: '',
                workShop: '',
                holderId: ''
            },
            factory: [],
            workshop: [],
            PotList: [],
            InHolderType: [],
            Holder: [],
            dataList: [],
            JBSdataForm: {},
            JBSdataRule: {
                receiveHolderId: [
                    {
                        required: true,
                        message: '领用罐号不能为空',
                        trigger: 'blur'
                    }
                ],
                materialCode: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                batch: [{ required: true, message: '批次不能为空', trigger: 'blur' }],
                receiveAmount: [
                    {
                        required: true,
                        message: '领用量不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderType: [
                    {
                        required: true,
                        message: '打入罐类别不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderId: [
                    {
                        required: true,
                        message: '打入罐号不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            TurnSavedataForm: {},
            TurnSavedataRule: {
                receiveHolderId: [
                    {
                        required: true,
                        message: '领用罐号不能为空',
                        trigger: 'blur'
                    }
                ],
                materialCode: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                batch: [{ required: true, message: '批次不能为空', trigger: 'blur' }],
                receiveAmount: [
                    {
                        required: true,
                        message: '领用量不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderType: [
                    {
                        required: true,
                        message: '打入罐类别不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderId: [
                    {
                        required: true,
                        message: '打入罐号不能为空',
                        trigger: 'blur'
                    }
                ]
            }
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
            getWorkshop(this, n, '过滤');
            this.GetInHolderType(n);
        },
        'formHeader.workShop'(n) {
            this.formHeader.holderId = '';
            if (n) {
                this.getPot(n);
            }
        }
    },
    mounted() {
        getFactory(this);
    },
    methods: {
        goPot() {
            this.$store.state.common.PotReportForms.factory = this.formHeader.factory;
            this.$store.state.common.PotReportForms.workShop = this.formHeader.workShop;
            this.$store.state.common.PotReportForms.type = 'filterHolder';
            this.$store.state.common.mainTabs = this.$store.state.common.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-PotReportForms-index');
            setTimeout(() => {
                this.$router.push({ name: `MDS-views-page-DataEntry-PotReportForms-index` });
            }, 100);
        },
        // 查询
        GetDataList() {
            if (!this.formHeader.factory) {
                this.$warningToast('工厂必填');
                return false;
            }
            this.$http(`${FILTRATION_API.FILTER_POT_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.fastS = true;
                    this.dataList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 去详情
        godetails(item) {
            this.$store.state.common.filtrationPot = item;
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'MDS-views-page-DataEntry-Filtration-Pot-detail');
            setTimeout(() => {
                this.$router.push({ name: `MDS-views-page-DataEntry-Filtration-Pot-detail` });
            }, 100);
        },
        // 清罐
        clearPot(item) {
            if (!this.isAuth('filter:holder:cleanProHolder')) {
                this.$warningToast('无权限操作');
                return false;
            }
            if (item.holderStatus === '0') {
                this.$warningToast('该罐暂不可进行清罐操作');
                return false;
            }
            if (item.holderStatus !== '4') {
                this.$warningToast('未领用完不能清罐');
                return false;
            }
            this.$confirm('清罐后，账务将清零，请确认实物已空！', '清罐确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${FILTRATION_API.FILTER_POT_CLEAN_API}`, 'POST', item).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.GetDataList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // JBS弹窗
        JBSdialog(item) {
            if (!this.isAuth('filter:holder:jbsOut')) {
                this.$notify.error({ title: '错误', message: '无权限操作' });
                return false;
            }
            this.JBSVisible = true;
            this.Holder = [];
            this.JBSdataForm = {
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop,
                receiveHolderId: item.holderId,
                holderName: item.holderName,
                materialCode: item.materialCode,
                materialName: item.materialName,
                batch: item.batch,
                receiveAmount: '',
                unit: '',
                inHolderType: '',
                inHolderId: '',
                isFull: '0',
                fullDate: '',
                remark: '',
                changer: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            };
        },
        // 转储弹窗
        TurnSavedialog(item) {
            if (!this.isAuth('filter:holder:dumpMaterial')) {
                this.$notify.error({ title: '错误', message: '无权限操作' });
                return false;
            }
            this.TurnSaveVisible = true;
            this.Holder = [];
            this.TurnSavedataForm = {
                receiveHolderId: item.holderId,
                holderName: item.holderName,
                materialCode: item.materialCode,
                materialName: item.materialName,
                batch: item.batch,
                receiveAmount: '',
                unit: '',
                inHolderType: '',
                inHolderId: '',
                isFull: '0',
                fullDate: '',
                remark: '',
                changer: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            };
        },
        // JBS确认
        JBS() {
            if (this.JBSdataForm.isFull === '1') {
                if (!this.JBSdataForm.fullDate) {
                    this.$warningToast('满罐时间必填');
                    return;
                }
            }
            this.$refs.JBSdataForm.validate(valid => {
                if (valid) {
                    this.$http(`${FILTRATION_API.FILTER_JBS_API}`, 'POST', this.JBSdataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.JBSVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetDataList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }
            });
        },
        // 转储确认
        TurnSave() {
            if (this.TurnSavedataForm.isFull === '1') {
                if (!this.TurnSavedataForm.fullDate) {
                    this.$warningToast('满罐时间必填');
                    return;
                }
            }
            this.$refs.TurnSavedataForm.validate(valid => {
                if (valid) {
                    this.$http(`${FILTRATION_API.FILTER_TURNSAVE_API}`, 'POST', this.TurnSavedataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.TurnSaveVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetDataList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }
            });
        },
        // 获取罐号
        GetHolderType(holderType) {
            this.$http(`${FILTRATION_API.FILTER_HOLDER_LIST_API}`, 'POST', { factory: this.formHeader.factory, holderType: holderType }, false, false, false).then(({ data }) => {
                this.Holder = data.list;
            });
        },
        GetHolderType1(row) {
            this.$http(
                `${STERILIZED_API.SEMIFINIS_DROPDOWN_LIST}`,
                'POST',
                {
                    factory: this.formHeader.factory,
                    materialCode: row.materialCode,
                    batch: row.batch,
                    code: row.inHolderType,
                    holderId: row.receiveHolderId
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.Holder = data.list;
            });
        },
        // 打入罐类别
        GetInHolderType() {
            this.$http(`${FILTRATION_API.FILTER_INHOLDERTYPE_LIST_API}`, 'POST', { factory: this.formHeader.factory }, false, false, false).then(({ data }) => {
                this.InHolderType = data.list;
            });
        },
        // 罐下拉
        getPot() {
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
                this.PotList = data.holderList;
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
