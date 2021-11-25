<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="生产工厂：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.factory" placement="top-start">
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
        <el-dialog :close-on-click-modal="false" :visible.sync="materialVisible" width="900px">
            <div slot="title">
                调配详情
            </div>
            <mds-card title="调配物料详情" :pack-up="false" name="materialVisible1">
                <template slot="titleBtn">
                    <div style="float: right;">
                        <span style="color: red;">*</span>
                        <span>调配顺序：</span>
                        <el-input v-model="formHeaders.ALLOCATE_SEQUENCE" type="number" size="small" placeholder="调配顺序" style="width: 160px;" />
                    </div>
                </template>
                <el-table :data="materialList" border class="newTable" header-row-class-name="tableHead">
                    <el-table-column label="调配物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}{{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料单位" prop="unit" />
                    <el-table-column label="计划领料" prop="planAmount" />
                    <el-table-column label="领用批次" prop="batch" />
                    <el-table-column label="原汁类别" prop="category" />
                    <el-table-column label="订单领料" prop="planAmount" />
                    <el-table-column label="实际调配量" prop="distributeAmount">
                        <template slot="header">
                            <span style="color: red;">*</span>
                            <span>实际调配量</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.distributeAmount" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" size="small" />
                        </template>
                    </el-table-column>
                </el-table>
            </mds-card>
            <mds-card title="调配备料详情" :pack-up="false" name="materialVisible2">
                <el-table :data="prepareMaterialList" border class="newTable" header-row-class-name="tableHead">
                    <el-table-column label="准备物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}{{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料单位" prop="unit" />
                    <el-table-column label="数量" prop="planAmount" />
                    <el-table-column label="订单备注" prop="orderRemark" />
                    <el-table-column label="备注" prop="category" />
                </el-table>
            </mds-card>
            <div class="clearfix">
                <div style="float: right; margin-bottom: 10px;">
                    <el-button size="small" @click="materialVisible = false">
                        取 消
                    </el-button>
                    <el-button type="primary" size="small" @click="determine()">
                        确 定
                    </el-button>
                </div>
            </div>
        </el-dialog>
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
                <!--                <el-button type="primary" size="small" :disabled="revocation === 1" @click="ReCall(true)">-->
                <!--                    撤回-->
                <!--                </el-button>-->
                <!--                <template v-if="isRedact">-->
                <!--                    <el-button type="primary" size="small" @click="CreateOrder(true)">-->
                <!--                        生成-->
                <!--                    </el-button>-->
                <!--                </template>-->
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
                materialName: this.$store.state.common.Sterilized.materialName,
                allocateSequence: ''
            },
            formHeaders: {
                ID: '',
                ALLOCATE_SEQUENCE: '',
                ALLOCATE_DATE: '',
                ORDER_NO: '',
                HOLDER_ID: '',
                FACTORYNAME: this.$store.state.common.Sterilized.factory,
                FACTORY: this.$store.state.common.Sterilized.factoryId,
                WORK_SHOPNAME: this.$store.state.common.Sterilized.workshop,
                WORK_SHOP: this.$store.state.common.Sterilized.workshopId,
                MATERIAL_NAME: this.$store.state.common.Sterilized.materialName,
                MATERIAL_CODE: this.$store.state.common.Sterilized.materialCode,
                STATUS: ''
            },
            isRedact: false,
            materialVisible: false,
            materialList: [],
            prepareMaterialList: [],
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
        if (this.$store.state.common.Sterilized.isRedact === true) {
            this.isRedact = this.$store.state.common.Sterilized.isRedact
        }
    },
    methods: {
        materialDetail() {
            if (!this.orderList.length) {
                this.$warningToast('请添加订单后进入详情');
                return
            }
            const steAllocateOrders = this.orderList.map(it => {
                return it.orderNo
            })
            this.$http(`${STERILIZED_API.ORDER_CREATED}`, 'POST', steAllocateOrders).then(({ data }) => {
                if (data.code === 0) {
                    const detail = {
                        ...this.formHeaders,
                        ID: this.allocateId,
                        PLAN_AMOUNT: this.planOutputTotal,
                        remark: this.remark,
                        orderArray: this.orderArray,
                        orderList: this.orderList,
                        typeString: this.typeString,
                        revocation: this.revocation
                    }
                    this.$store.commit('common/updateSterilizedDoDeploymentDetail', detail);
                    this.mainTabs = this.mainTabs.filter(item => item.name !== 'MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeploymentDetail');
                    setTimeout(() => {
                        this.$router.push({
                            name: `MDS-views-page-DataEntry-Sterilized-WaitDeploymentList-doDeploymentDetail`
                        });
                    }, 100);
                } else {
                    this.$warningToast(data.msg);
                }
            })
            // this.materialVisible = true
            // this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_MATERIAL_LIST_API}`, 'POST', {
            //     factory: this.formHeaders.FACTORY,
            //     orderNoList: this.orderArray
            // }).then(({ data }) => {
            //     if (data.code === 0) {
            //         this.materialList = []
            //         this.prepareMaterialList = []
            //         data.data.forEach(it => {
            //             if (it.type === 'BL') {
            //                 if (it.distributeAmount === '' || it.distributeAmount === null) {
            //                     it.distributeAmount = it.planAmount
            //                 }
            //                 this.materialList.push(it)
            //             } else {
            //                 this.prepareMaterialList.push(it)
            //             }
            //         })
            //     } else {
            //         this.$warningToast(data.msg);
            //     }
            // })
        },
        determine() {
            if (!this.formHeaders.ALLOCATE_SEQUENCE) {
                this.$warningToast('请填写必填项')
                return
            }
            console.log(this.materialList)
            for (const item of this.materialList) {
                console.log(item.distributeAmount)
                if (item.distributeAmount === '' || item.distributeAmount === null) {
                    this.$warningToast('请填写必填项')
                    return
                }
            }
            const steAllocateOrders = this.orderList.map(it => {
                return {
                    orderId: it.orderNo,
                    remark: it.remark
                }
            })
            this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_MATERIAL_SAVE_API}`, 'POST', {
                steAllocate: {
                    allocateDate: this.formHeaders.ALLOCATE_DATE,
                    allocateSequence: this.formHeaders.ALLOCATE_SEQUENCE,
                    factory: this.formHeaders.FACTORY,
                    workShop: this.formHeaders.WORK_SHOP,
                    id: this.formHeaders.ID,
                    materialCode: this.formHeaders.MATERIAL_CODE,
                    materialName: this.formHeaders.MATERIAL_NAME,
                    orderNo: this.formHeaders.ORDER_NO,
                    planAmount: this.planOutputTotal,
                    remark: this.remark,
                    type: this.$store.state.common.Sterilized.type,
                    unit: this.orderList[0].outputUnit
                },
                steAllocateMaterials: this.materialList,
                steAllocateOrders: steAllocateOrders
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.materialVisible = false
                    this.allocateId = data.allocateId
                    this.GetInfoList(this.allocateId);
                    this.isRedact = false;
                    this.Sterilized = {
                        orderNoList: [],
                        type: this.$store.state.common.Sterilized.type,
                        orderNo: this.allocateId
                    };
                } else {
                    this.$errorToast(data.msg);
                }
            })
        },
        GetInfoList(orderNo) {
            this.orderArray = [];
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {
                orderNo: orderNo
            }).then(({ data }) => {
                if (data.code === 0) {
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
        // 生成
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
                const steAllocateOrders = this.orderList.map(it => {
                    return {
                        orderId: it.orderNo,
                        remark: it.remark
                    }
                })
                this.$http(`${STERILIZED_API.NEW_JUICEDEPLOYMENTCREATE}`, 'POST', {
                    steAllocate: {
                        allocateDate: this.formHeaders.ALLOCATE_DATE,
                        allocateSequence: this.formHeaders.ALLOCATE_SEQUENCE,
                        factory: this.formHeaders.FACTORY,
                        workShop: this.formHeaders.WORK_SHOP,
                        id: this.formHeaders.ID,
                        materialCode: this.formHeaders.MATERIAL_CODE,
                        materialName: this.formHeaders.MATERIAL_NAME,
                        orderNo: this.formHeaders.ORDER_NO,
                        planAmount: this.planOutputTotal,
                        remark: this.remark,
                        type: this.$store.state.common.Sterilized.type,
                        unit: this.orderList[0].outputUnit
                    },
                    steAllocateOrders: steAllocateOrders,
                    type: this.typeString === '分配' ? 'LY' : 'BL'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({ title: '成功', message: '生成成功', type: 'success' });
                        this.isRedact = false;
                        this.allocateId = data.allocateId
                        this.GetInfoList(this.allocateId);
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            })
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
