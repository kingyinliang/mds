<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="生产工厂：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.factory" placement="top-start">
                                <p class="input_bottom">
                                    {{ formHeader.factory }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <p class="input_bottom">
                                {{ formHeader.workshop }}
                            </p>
                        </el-form-item>
                        <el-form-item :label="typeString + '单号：'">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.ORDER_NO }}
                            </p>
                        </el-form-item>
                        <el-form-item v-if="typeString === '调配'" :label="typeString + '罐号：'">
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
                        <el-form-item :label="typeString + '日期：'">
                            <el-date-picker v-model="formHeaders.ALLOCATE_DATE" type="date" :disabled="!isRedact" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" style="width: 145px;" />
                        </el-form-item>
                        <el-form-item label="杀菌物料：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.materialCode + `${formHeader.materialName}`" placement="top-start">
                                <p class="input_bottom">
                                    {{ formHeader.materialCode }}{{ formHeader.materialName }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="订单状态：">
                            <p class="input_bottom">
                                &nbsp;{{ formHeaders.STATUS }}
                            </p>
                        </el-form-item>
                        <el-form-item>
                            <span v-if="typeString === '调配'" style=" float: left; margin-left: 5px; color: #606266;">
                                计划BL原汁总量（L）：
                            </span>
                            <span v-else style=" float: left; margin-left: 5px; color: #606266;">
                                原汁总量（L）：
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
        <mds-card title="调配/分配" name="deployment" style="margin-top: 10px;">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="AddOrderNo">
                    新增
                </el-button>
            </template>
            <el-table :data="orderList" border class="newTable" header-row-class-name="tableHead">
                <el-table-column label="序号" type="index" width="50" fixed />
                <el-table-column label="订单号" prop="orderNo" />
                <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode }}{{ scope.row.materialName }}
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
                        {{ scope.row.materialCode }}
                        {{ scope.row.materialName }}
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
                <el-button type="primary" size="small" :disabled="revocation === 1" @click="ReCall(true)">
                    撤回
                </el-button>
                <template v-if="isRedact">
                    <el-button type="primary" size="small" @click="SaveOrderNo(true)">
                        保存
                    </el-button>
                    <el-button type="primary" size="small" @click="CreateOrder(true)">
                        生成
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { headanimation } from '@/net/validate';
import { STERILIZED_API } from '@/api/api';
export default {
    name: 'DoDeployment',
    data() {
        return {
            typeString: '调配',
            allocateId: '',
            formHeader: {
                factory: this.$store.state.common.Sterilized.factory,
                workshop: this.$store.state.common.Sterilized.workshop,
                factoryId: this.$store.state.common.Sterilized.factoryId,
                workshopId: this.$store.state.common.Sterilized.workshopId,
                materialCode: this.$store.state.common.Sterilized.materialCode,
                materialName: this.$store.state.common.Sterilized.materialName
            },
            formHeaders: {
                STATUS: ''
            },
            isRedact: false,
            dialogTableVisible: false,
            orderArray: this.$store.state.common.Sterilized.orderNoList,
            planOutputTotal: this.$store.state.common.Sterilized.planOutputTotal,
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
        headanimation(this.$);
        if (this.$store.state.common.Sterilized.type === 'LY') {
            this.typeString = '分配';
        }
        if (this.$store.state.common.Sterilized.orderNo !== '') {
            this.allocateId = this.$store.state.common.Sterilized.orderNo;
            this.GetInfoList(this.$store.state.common.Sterilized.orderNo);
        } else {
            this.GetorderNo(this.orderArray);
        }
        // this.GetInfoList('C57A2AE171024496AD26B0BEE8B0ACAD')
    },
    methods: {
        GetInfoList(orderNo) {
            this.orderArray = [];
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {
                orderNo: orderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formHeaders = data.allocateInfo;
                    this.revocation = data.revocation;
                    this.formHeader.factory = this.formHeaders.FACTORYNAME;
                    this.formHeader.workshop = this.formHeaders.WORK_SHOPNAME;
                    this.formHeader.factoryId = this.formHeaders.FACTORY;
                    this.formHeader.workshopId = this.formHeaders.WORK_SHOP;
                    this.formHeader.materialCode = this.formHeaders.MATERIAL_CODE;
                    this.formHeader.materialName = this.formHeaders.MATERIAL_NAME;
                    this.planOutputTotal = this.formHeaders.PLAN_AMOUNT;
                    this.remark = this.formHeaders.REMARK;
                    this.orderList = data.allocateInfo.orderInfo;
                    data.allocateInfo.orderInfo.map(item => {
                        this.orderArray.push(item.orderNo);
                    });
                    // this.GetorderNo(this.orderArray)
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 拉取订单
        GetorderNo(orderArray) {
            const params = {
                factory: this.formHeader.factoryId,
                workShop: this.formHeader.workshopId,
                materialCode: this.formHeader.materialCode,
                orderNo: orderArray,
                currPage: '1',
                pageSize: '9000',
                type: this.$store.state.common.Sterilized.type
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
                factory: this.formHeader.factoryId,
                workShop: this.formHeader.workshopId,
                materialCode: this.formHeader.materialCode,
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
        // handleSizeChange (val) {
        //   this.pagesForm.pageSize = val
        //   this.orderPropList = this.DataProcessing()
        // },
        // handleCurrentChange (val) {
        //   this.pagesForm.currPage = val
        //   this.orderPropList = this.DataProcessing()
        // },
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
        },
        /* eslint-disable no-shadow */
        SaveOrderNo() {
            if (this.orderList.length === 0) {
                this.$warningToast('请添加订单');
            } else {
                if (this.orderList.filter(item => item.orderNo.slice(0, 4) === this.orderList[0].orderNo.slice(0, 4)).length !== this.orderList.length) {
                    this.$warningToast('请选择相同的订单类型的订单！');
                    return false;
                }
                const params = {
                    factory: this.$store.state.common.Sterilized.factoryId,
                    workShop: this.$store.state.common.Sterilized.workshopId,
                    materialCode: this.orderList[0].materialCode,
                    materialName: this.orderList[0].materialName,
                    planAmount: this.planOutputTotal,
                    unit: this.orderList[0].outputUnit,
                    remark: this.remark,
                    id: this.allocateId,
                    type: this.$store.state.common.Sterilized.type,
                    allocateDate: this.formHeaders.ALLOCATE_DATE
                };
                this.$http(`${STERILIZED_API.DODEPLOYMENTHEADERSAVE}`, 'POST', params).then(({ data }) => {
                    if (data.code === 0) {
                        this.allocateId = data.allocateId;
                        this.orderList.map(item => {
                            item.allocateId = data.allocateId;
                            item.remark = this.remark;
                            item.orderId = item.orderNo;
                        });
                        this.$http(`${STERILIZED_API.DODEPLOYMENTLISTSAVE}`, 'POST', this.orderList).then(({ data }) => {
                            if (data.code === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.GetInfoList(this.allocateId);
                                this.isRedact = false;
                                this.Sterilized = {
                                    orderNoList: [],
                                    orderNo: this.allocateId
                                };
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        CreateOrder() {
            if (this.orderList.length === 0) {
                this.$warningToast('请添加订单');
                return false;
            }
            if (this.orderList.filter(item => item.orderNo.slice(0, 4) === this.orderList[0].orderNo.slice(0, 4)).length !== this.orderList.length) {
                this.$warningToast('请选择相同的订单类型的订单！');
                return false;
            }
            this.$confirm('确认生成调配单吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.allocateId === '') {
                    const params = {
                        factory: this.$store.state.common.Sterilized.factoryId,
                        workShop: this.$store.state.common.Sterilized.workshopId,
                        materialCode: this.orderList[0].materialCode,
                        materialName: this.orderList[0].materialName,
                        planAmount: this.planOutputTotal,
                        unit: this.orderList[0].outputUnit,
                        remark: this.remark,
                        id: this.allocateId,
                        type: this.$store.state.common.Sterilized.type
                    };
                    this.$http(`${STERILIZED_API.DODEPLOYMENTHEADERSAVE}`, 'POST', params).then(({ data }) => {
                        if (data.code === 0) {
                            this.allocateId = data.allocateId;
                            this.orderList.map(item => {
                                item.allocateId = data.allocateId;
                                item.remark = this.remark;
                                item.orderId = item.orderNo;
                            });
                            this.$http(`${STERILIZED_API.DODEPLOYMENTLISTSAVE}`, 'POST', this.orderList).then(({ data }) => {
                                if (data.code === 0) {
                                    this.formHeaders.id = this.allocateId;
                                    const paras = [this.formHeaders];
                                    this.$http(`${STERILIZED_API.JUICEDEPLOYMENTCREATE}`, 'POST', paras).then(({ data }) => {
                                        if (data.code === 0) {
                                            this.$notify({
                                                title: '成功',
                                                message: '生成成功',
                                                type: 'success'
                                            });
                                            this.GetInfoList(this.allocateId);
                                            this.isRedact = false;
                                            this.Sterilized = {
                                                orderNoList: [],
                                                orderNo: this.allocateId
                                            };
                                        } else {
                                            this.$errorToast(data.msg);
                                        }
                                    });
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            });
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    this.orderList.map(item => {
                        item.allocateId = this.allocateId;
                        item.remark = this.remark;
                        item.orderId = item.orderNo;
                    });
                    this.$http(`${STERILIZED_API.DODEPLOYMENTLISTSAVE}`, 'POST', this.orderList).then(({ data }) => {
                        if (data.code === 0) {
                            this.formHeaders.id = this.formHeaders.ID;
                            this.formHeaders.remark = this.remark;
                            const params = [this.formHeaders];
                            this.$http(`${STERILIZED_API.JUICEDEPLOYMENTCREATE}`, 'POST', params).then(({ data }) => {
                                if (data.code === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '生成成功',
                                        type: 'success'
                                    });
                                    this.isRedact = false;
                                    this.GetInfoList(this.allocateId);
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            });
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        /* eslint-enable no-shadow */
        // 撤回
        ReCall() {
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLREVOCATION}`, 'POST', {
                id: this.allocateId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.GetInfoList(this.allocateId);
                } else {
                    this.$warningToast(data.msg);
                }
            });
        },
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
