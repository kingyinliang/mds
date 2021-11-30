<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="生产工厂：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.FACTORYNAME" placement="top-start">
                                <p class="input_bottom">
                                    {{ formHeaders.FACTORYNAME }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <p class="input_bottom">
                                {{ formHeaders.WORK_SHOPNAME }}
                            </p>
                        </el-form-item>
                        <el-form-item label="备料单号：">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.ORDER_NO }}
                            </p>
                        </el-form-item>
                        <el-form-item label="调配罐号：">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.HOLDER_ID }}
                            </p>
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.CREATOR }}
                            </p>
                        </el-form-item>
                        <el-form-item label="提交日期：">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.CREATED }}
                            </p>
                        </el-form-item>
                        <el-form-item label="备料日期：">
                            <el-date-picker v-model="formHeaders.ALLOCATE_DATE" type="date" :disabled="!isRedact" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 145px;" />
                        </el-form-item>
                        <el-form-item label="杀菌物料：">
                            <el-tooltip class="item" effect="dark" :content="formHeaders.MATERIAL_NAME + `${formHeaders.MATERIAL_CODE}`" placement="top-start">
                                <p class="input_bottom">
                                    {{ formHeaders.MATERIAL_NAME }}{{ formHeaders.MATERIAL_CODE }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.STATUS }}
                            </p>
                        </el-form-item>
                        <el-form-item>
                            <span style=" float: left; margin-left: 5px; color: #606266;">
                                计划原汁数量：
                            </span>
                            <p style="float: left;" class="input_bottom">
                                {{ planOutputTotal }}
                            </p>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <textarea v-model="remark" :disabled="!isRedact" style="width: 850px; height: 50px; background: rgba(255, 255, 255, 1); border: 1px solid rgba(217, 217, 217, 1); border-radius: 4px;" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <mds-card title="备料" name="deployment" style="margin-top: 10px;">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="AddOrderNo">
                    新增
                </el-button>
                <el-button type="primary" size="small" style="float: right; margin-right: 20px;" @click="materialDetail">
                    备料详情
                </el-button>
            </template>
            <el-table :data="orderList" border class="newTable" header-row-class-name="tableHead">
                <el-table-column label="序号" type="index" width="50" fixed />
                <el-table-column label="订单号" prop="orderNo" />
                <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}{{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="订单数量" prop="planOutput" width="80" />
                <el-table-column label="订单单位" prop="outputUnit" width="80" />
                <el-table-column label="订单开始日期" prop="productDate" />
                <el-table-column label="生产调度员" prop="dispatchMan" />
                <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="DelOrderNo(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <el-dialog :close-on-click-modal="false" :visible.sync="dialogTableVisible" width="1000px" custom-class="dialog__class">
            <div slot="title">
                订单分配
            </div>
            <el-table ref="multipleTable" :data="orderPropList" :row-key="getRowKeys" border header-row-class-name="tableHead" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" :reserve-selection="true" prop="orderNo" />
                <el-table-column label="订单号" prop="orderNo" width="120" />
                <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialName }}
                        {{ scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="订单数量" prop="planOutput" width="80" />
                <el-table-column label="订单单位" prop="outputUnit" width="80" />
                <el-table-column label="订单开始日期" prop="productDate" width="120" />
                <el-table-column label="生产调度员" prop="dispatchMan" width="120" />
                <el-table-column label="订单备注" prop="remark" :show-overflow-tooltip="true" />
            </el-table>
            <el-row style="position: relative;">
                <el-col :span="20" style="text-align: center;">
                    <el-pagination style="float: left; width: 960px; text-align: center;" background layout="prev, pager, next" :current-page.sync="pagesForm.currPage" :page-size="pagesForm.pageSize" :total="pagesForm.totalCount" />
                </el-col>
                <el-col :span="4" style="float: right; margin-top: 13px; text-align: right;">
                    <el-button size="small" @click="dialogTableVisible = false">
                        取 消
                    </el-button>
                    <el-button type="primary" size="small" @click="SaveOderNo()">
                        确 定
                    </el-button>
                </el-col>
            </el-row>
        </el-dialog>
        <redact-box>
            <template slot="button">
                <el-button v-if="isAuth('ste:allocate:allocateOrderSave')" type="primary" size="small" :disabled="formHeaders.STATUS !== '已保存' && formHeaders.STATUS !== ''" @click="isRedact = !isRedact">
                    {{ isRedact === false ? '编辑' : '取消' }}
                </el-button>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { STERILIZED_API } from '@/api/api';
export default {
    name: 'DoDeployment',
    data() {
        return {
            formHeader: {
                factory: this.$store.state.common.Sterilized.factory,
                workshop: this.$store.state.common.Sterilized.workshop,
                factoryId: this.$store.state.common.Sterilized.factoryId,
                workshopId: this.$store.state.common.Sterilized.workshopId,
                materialCode: this.$store.state.common.Sterilized.materialCode,
                materialName: this.$store.state.common.Sterilized.materialName,
                allocateSequence: ''
            },
            isRedact: false,
            allocateId: this.$store.state.common.Sterilized.ID,
            formHeaders: this.$store.state.common.Sterilized,
            planOutputTotal: this.$store.state.common.Sterilized.planOutputTotal,
            orderArray: this.$store.state.common.Sterilized.orderNoList,
            dialogTableVisible: false,
            remark: '',
            orderList: [],
            orderPropAllList: [],
            orderPropList: [],
            multipleSelection: [],
            pagesForm: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            revocation: 0
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
        },
        Sterilized: {
            get() {
                return this.$store.state.common.Sterilized;
            },
            set(val) {
                this.$store.commit('common/updateSterilized', val);
            }
        }
    },
    watch: {
        'pagesForm.currPage': {
            handler() {
                this.orderPropList = this.DataProcessing();
            }
        }
    },
    mounted() {
        if (this.formHeaders.ID !== '') {
            this.GetInfoList(this.formHeaders.ID);
        } else {
            this.GetorderNo(this.formHeaders.orderNoList);
        }
    },
    methods: {
        materialDetail() {
            if (!this.orderList.length) {
                this.$warningToast('请添加订单后进入详情');
                return
            }
            const detail = {
                ...this.formHeaders,
                ID: this.allocateId,
                PLAN_AMOUNT: this.planOutputTotal,
                remark: this.remark,
                orderArray: this.orderArray,
                orderList: this.orderList,
                revocation: this.revocation
            }
            this.$store.commit('common/updateSterilizedDoDeploymentDetail', detail);
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeploymentDetail');
            this.mainTabs = this.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeployment');
            setTimeout(() => {
                this.$router.push({
                    name: `MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeploymentDetail`
                });
            }, 100);
        },
        GetInfoList(id) {
            this.orderArray = [];
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {
                orderNo: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.$store.state.common.Sterilized = { ID: id }
                    this.formHeaders = data.allocateInfo;
                    this.revocation = data.revocation;
                    this.planOutputTotal = this.formHeaders.PLAN_AMOUNT;
                    this.remark = this.formHeaders.REMARK;
                    this.orderList = data.allocateInfo.orderInfo;
                    data.allocateInfo.orderInfo.map(item => {
                        this.orderArray.push(item.orderNo);
                    });
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 拉取订单
        GetorderNo(orderArray) {
            const params = {
                factory: this.formHeaders.FACTORY,
                workShop: this.formHeaders.WORK_SHOP,
                materialCode: this.formHeaders.MATERIAL_CODE,
                orderNo: orderArray,
                currPage: '1',
                pageSize: '9000'
            };
            this.$http(`${STERILIZED_API.WAITDEPLOYMENTLIST_API}`, 'POST', params).then(({ data }) => {
                if (data.code === 0) {
                    this.orderList = data.orderInfo.list;
                    this.revocation = data.revocation;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 新增订单
        AddOrderNo() {
            const params = {
                factory: this.formHeaders.FACTORY,
                workShop: this.formHeaders.WORK_SHOP,
                materialCode: this.formHeaders.MATERIAL_CODE,
                orderNo: this.orderArray
            };
            this.$http(`${STERILIZED_API.DODEPLOYMENTORDERLIST_API}`, 'POST', params).then(({ data }) => {
                if (data.code === 0) {
                    this.orderPropAllList = data.orderAddInfo;
                    this.orderPropList = this.DataProcessing();
                    this.pagesForm.totalCount = this.orderPropAllList.length;
                    this.dialogTableVisible = true;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        DataProcessing() {
            return this.orderPropAllList.slice((this.pagesForm.currPage - 1) * this.pagesForm.pageSize, Number((this.pagesForm.currPage - 1) * this.pagesForm.pageSize) + Number(this.pagesForm.pageSize));
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 新增订单
        SaveOderNo() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请勾选订单');
            } else {
                let materialCode;
                let dispatchMan;
                if (this.orderList.length === 0) {
                    materialCode = this.multipleSelection[0].materialCode;
                    dispatchMan = this.multipleSelection[0].dispatchMan;
                } else {
                    materialCode = this.orderList[0].materialCode;
                    dispatchMan = this.orderList[0].dispatchMan;
                }
                for (const item of this.multipleSelection) {
                    if (materialCode !== item.materialCode) {
                        this.$warningToast('物料冲突，请重新选择订单！');
                        return false;
                    }
                    if (dispatchMan !== item.dispatchMan) {
                        this.$warningToast('调度人员冲突，请重新选择订单！');
                        return false;
                    }
                }
                this.multipleSelection.map(item => {
                    this.orderArray.push(item.orderNo);
                    this.orderList.push(item);
                });
                this.$refs.multipleTable.clearSelection();
                this.dialogTableVisible = false;
                this.planOutputTotal = 0;
                this.orderList.map(item => {
                    this.planOutputTotal = this.planOutputTotal + item.planOutput;
                });
                if (this.allocateId) {
                    this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_MATERIAL_UPDATE_API}`, 'GET', {
                        allocateId: this.allocateId
                    }).then(({ data }) => {
                        console.log(data)
                    })
                }
            }
        },
        // 删除
        DelOrderNo(row) {
            this.orderList.splice(this.orderList.indexOf(row), 1);
            this.orderArray.splice(this.orderArray.indexOf(row.orderNo), 1);
            this.planOutputTotal = 0;
            this.orderList.map(item => {
                this.planOutputTotal = this.planOutputTotal + item.planOutput;
            });
            if (this.allocateId) {
                this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_MATERIAL_UPDATE_API}`, 'GET', {
                    allocateId: this.allocateId
                }).then(({ data }) => {
                    console.log(data)
                })
            }
        },
        /* eslint-enable no-shadow */
        getRowKeys(row) {
            return row.orderNo;
        }
    }
};
</script>

<style lang="scss">
.input_bottom {
    width: 150px;
    height: 33px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid rgba(216, 216, 216, 1);
}
.dialog__class {
    border-radius: 6px !important;
    .el-dialog__header {
        height: 59px;
        color: #fff;
        font-size: 20px;
        background: rgba(24, 144, 255, 1);
        border-radius: 6px 6px 0 0;
        .el-dialog__headerbtn .el-dialog__close {
            color: #fff;
        }
    }
}
</style>
<style lang="scss" scoped>
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 8px !important;
}
</style>
