<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="75px">
                <el-form-item label="生产工厂：">
                    <el-tooltip class="item" effect="dark" :content="formHeader.FACTORYNAME" placement="top-start">
                        <p class="input_bottom">
                            {{ formHeader.FACTORYNAME }}
                        </p>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <p class="input_bottom">
                        {{ formHeader.WORK_SHOPNAME }}
                    </p>
                </el-form-item>
                <el-form-item :label="typeString + '单号：'">
                    <p class="input_bottom">
                        {{ formHeader.ORDER_NO }}
                    </p>
                </el-form-item>
                <el-form-item label="杀菌物料：">
                    <el-tooltip class="item" effect="dark" :content="formHeader.MATERIAL_NAME + `${formHeader.MATERIAL_CODE}`" placement="top-start">
                        <p class="input_bottom">
                            {{ formHeader.MATERIAL_NAME }}{{ formHeader.MATERIAL_CODE }}
                        </p>
                    </el-tooltip>
                </el-form-item>
                <el-form-item>
                    <span v-if="typeString === '调配'" style=" float: left; margin-left: 5px; color: #606266;">计划BL原汁总量（L）：</span>
                    <span v-else style=" float: left; margin-left: 5px; color: #606266;">原汁总量（L）：</span>
                    <p style="float: left;" class="input_bottom">
                        {{ formHeader.PLAN_AMOUNT }}
                    </p>
                </el-form-item>
                <el-form-item v-if="typeString === '调配'" :label="typeString + '罐号：'">
                    <p class="input_bottom">
                        {{ formHeader.HOLDER_ID }}
                    </p>
                </el-form-item>
                <el-form-item :label="typeString + '日期：'">
                    <p class="input_bottom">
                        {{ formHeader.ALLOCATE_DATE }}
                    </p>
                </el-form-item>
                <el-form-item label="订单状态：">
                    <p class="input_bottom">
                        {{ formHeader.STATUS }}
                    </p>
                </el-form-item>
                <el-form-item label="提交人员：">
                    <p class="input_bottom">
                        {{ formHeader.CREATOR }}
                    </p>
                </el-form-item>
                <el-form-item label="提交日期：">
                    <p class="input_bottom">
                        {{ formHeader.CREATED }}
                    </p>
                </el-form-item>
            </el-form>
        </el-card>
        <el-tabs v-if="typeString === '调配'" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages noPane" type="border-card" style="margin-top: 10px;">
            <el-tab-pane label="调配" name="调配" />
            <el-tab-pane label="辅料" name="辅料" />
        </el-tabs>
        <div class="pane">
            <mds-card v-if="typeString === '调配' && activeName === '调配'" title="调配物料详情" :pack-up="false" name="materialVisible1">
                <template slot="titleBtn">
                    <div style="float: right;">
                        <span style="color: red;">*</span><span>调配顺序：</span>
                        <el-input v-model="formHeader.ALLOCATE_SEQUENCE" :disabled="!isRedact" type="number" size="small" placeholder="调配顺序" style="width: 160px;" />
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
                    <!--<el-table-column label="领用批次" prop="batch" />-->
                    <el-table-column label="原汁类别" prop="category" />
                    <!--<el-table-column label="订单领料" prop="planAmount" />-->
                    <el-table-column label="实际调配量" prop="distributeAmount">
                        <template slot="header">
                            <span style="color: red;">*</span>
                            <span>实际调配量</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.distributeAmount" :disabled="!isRedact" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!isRedact" size="small" />
                        </template>
                    </el-table-column>
                </el-table>
            </mds-card>
            <mds-card v-if="typeString === '调配' && activeName === '调配'" title="调配备料详情" :pack-up="false" name="materialVisible2">
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
            <mds-card v-if="typeString === '分配' || activeName === '辅料'" title="调配物料详情" :pack-up="false" name="materialVisible3">
                <template slot="titleBtn">
                    <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="printAccessories">
                        打印
                    </el-button>
                </template>
                <el-table :data="accessoriesList" border class="newTable" header-row-class-name="tableHead">
                    <el-table-column v-for="(item, index) in accessoriesHead" :key="item" :label="item" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row[index] }}
                        </template>
                    </el-table-column>
                </el-table>
                <print-component ref="printAccessories" :form-header="formHeader" :accessories-head="printHead" :accessories-list="printData" />
            </mds-card>
        </div>
        <redact-box>
            <template slot="button">
                <el-button v-if="isAuth('ste:allocate:allocateOrderSave')" type="primary" size="small" :disabled="formHeader.STATUS !== '已保存' && formHeader.STATUS !== ''" @click="isRedact = !isRedact">
                    {{ isRedact === false ? '编辑' : '取消' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button v-if="typeString !== '分配'" type="primary" size="small" @click="savedForm(true)">
                        保存
                    </el-button>
                    <el-button v-if="revocation === 1" type="primary" size="small" @click="CreateOrder(true)">
                        生成
                    </el-button>
                </template>
                <el-button v-if="revocation !== 1" type="primary" size="small" @click="ReCall(true)">
                    撤回
                </el-button>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { STERILIZED_API } from '@/api/api';
import printComponent from './printComponent'

export default {
    name: 'DoDeploymentDetail',
    components: {
        printComponent
    },
    data() {
        return {
            isRedact: false,
            activeName: '调配',
            typeString: this.$store.state.common.sterilizedDoDeploymentDetail.typeString || '调配',
            revocation: this.$store.state.common.sterilizedDoDeploymentDetail.revocation || 0,
            orderArray: this.$store.state.common.sterilizedDoDeploymentDetail.orderArray || [],
            orderList: this.$store.state.common.sterilizedDoDeploymentDetail.orderList || [],
            remark: this.$store.state.common.sterilizedDoDeploymentDetail.remark || '',
            formHeader: this.$store.state.common.sterilizedDoDeploymentDetail,
            materialList: [],
            prepareMaterialList: [],
            accessoriesHead: [],
            printHead: [],
            printData: [],
            accessoriesList: []
        }
    },
    mounted() {
        if (this.formHeader.ID) {
            this.GetInfo(this.formHeader.ID)
        }
        this.getDeployment()
    },
    methods: {
        // 获取调配和辅料
        getDeployment() {
            this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_MATERIAL_LIST_API}`, 'POST', {
                factory: this.formHeader.FACTORY,
                orderNoList: this.orderArray
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.materialList = []
                    this.prepareMaterialList = []
                    data.data.forEach(it => {
                        if (it.type === 'BL') {
                            if (it.distributeAmount === '' || it.distributeAmount === null) {
                                it.distributeAmount = it.planAmount
                            }
                            this.materialList.push(it)
                        } else {
                            this.prepareMaterialList.push(it)
                        }
                    })
                    if (data.accessories && data.accessories.length) {
                        this.accessoriesHead = data.accessories[0]
                        this.accessoriesList = data.accessories.splice(1, data.accessories.length)
                        this.printHead = JSON.parse(JSON.stringify(this.accessoriesHead))
                        this.printData = JSON.parse(JSON.stringify(this.accessoriesList))
                        this.printHead.splice(0, 0, '序号')
                        this.printHead.splice(3, 0, '批次')
                        this.printData.forEach((it, index) => {
                            it.splice(0, 0, index + 1)
                            it.splice(3, 0, '')
                        })
                        console.log(this.printHead);
                        console.log(this.printData);
                    }
                } else {
                    this.$warningToast(data.msg);
                }
            })
        },
        // 获取表头
        GetInfo(id) {
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLOCATELIST}`, 'POST', {
                orderNo: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.orderArray = [];
                    this.formHeader = data.allocateInfo;
                    this.revocation = data.revocation;
                    this.remark = this.formHeader.REMARK;
                    this.orderList = data.allocateInfo.orderInfo;
                    data.allocateInfo.orderInfo.map(item => {
                        this.orderArray.push(item.orderNo);
                    });

                    const detail = {
                        ...this.formHeader,
                        orderArray: this.orderArray,
                        orderList: this.orderList,
                        typeString: this.typeString,
                        revocation: this.revocation
                    }
                    this.$store.commit('common/updateSterilizedDoDeploymentDetail', detail);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 打印
        printAccessories() {
            this.$refs.printAccessories.printAccessories()
        },
        savedForm() {
            const steAllocateOrders = this.orderList.map(it => {
                return {
                    orderId: it.orderNo,
                    remark: it.remark
                }
            })
            this.$http(`${STERILIZED_API.NEW_WAITDEPLOYMENT_MATERIAL_SAVE_API}`, 'POST', {
                steAllocate: {
                    allocateDate: this.formHeader.ALLOCATE_DATE,
                    allocateSequence: this.formHeader.ALLOCATE_SEQUENCE,
                    factory: this.formHeader.FACTORY,
                    workShop: this.formHeader.WORK_SHOP,
                    id: this.formHeader.ID,
                    materialCode: this.formHeader.MATERIAL_CODE,
                    materialName: this.formHeader.MATERIAL_NAME,
                    orderNo: this.formHeader.ORDER_NO,
                    planAmount: this.formHeader.PLAN_AMOUNT,
                    remark: this.remark,
                    type: this.typeString === '分配' ? 'LY' : 'BL',
                    unit: this.orderList[0].outputUnit
                },
                steAllocateMaterials: this.materialList,
                steAllocateOrders: steAllocateOrders
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({ title: '成功', message: '保存成功', type: 'success' });
                    this.isRedact = false;
                    this.GetInfo(data.allocateId);
                } else {
                    this.$errorToast(data.msg);
                }
            })
        },
        // 撤回
        ReCall() {
            this.$http(`${STERILIZED_API.DODEPLOYMENTALLREVOCATION}`, 'POST', {
                id: this.formHeader.ID
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.GetInfo(this.formHeader.ID);
                } else {
                    this.$warningToast(data.msg);
                }
            });
        },
        // 生成
        CreateOrder() {
            if (this.typeString !== '分配' && !this.formHeader.ALLOCATE_SEQUENCE) {
                this.$warningToast('请填写必填项')
                return
            }
            for (const item of this.materialList) {
                console.log(item.distributeAmount)
                if (item.distributeAmount === '' || item.distributeAmount === null) {
                    this.$warningToast('请填写必填项')
                    return
                }
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
                        allocateDate: this.formHeader.ALLOCATE_DATE,
                        allocateSequence: this.formHeader.ALLOCATE_SEQUENCE,
                        factory: this.formHeader.FACTORY,
                        workShop: this.formHeader.WORK_SHOP,
                        id: this.formHeader.ID,
                        materialCode: this.formHeader.MATERIAL_CODE,
                        materialName: this.formHeader.MATERIAL_NAME,
                        orderNo: this.formHeader.ORDER_NO,
                        planAmount: this.formHeader.PLAN_AMOUNT,
                        remark: this.remark,
                        type: this.typeString === '分配' ? 'LY' : 'BL',
                        unit: this.orderList[0].outputUnit
                    },
                    steAllocateMaterials: this.materialList,
                    steAllocateOrders,
                    type: this.typeString === '分配' ? 'LY' : 'BL'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({ title: '成功', message: '生成成功', type: 'success' });
                        this.isRedact = false;
                        this.GetInfo(data.allocateId);
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            })
        }
    }
};
</script>

<style lang="scss" scoped>
    .noPane {
        min-height: 0 !important;
        ::v-deep .el-tabs__content { /* stylelint-disable-line */
            display: none;
        }
    }
    .pane {
        padding: 16px 10px;
        background: white;
        border-radius: 0 8px 0 0;
        box-shadow: 3px 3px 5px 0 rgb(0 0 0 / 10%);
    }
</style>
