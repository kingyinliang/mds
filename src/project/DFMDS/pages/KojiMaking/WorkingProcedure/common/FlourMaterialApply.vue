<template>
    <div class="material-get-content">
        <mds-card title="Y158领用">
            <template slot="titleBtn">
                <el-form :inline="true" label-width="115px">
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="addY158DataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <div class="semi">
                <el-table header-row-class-name="tableHead" class="newTable semi__pot_table" :data="materialY158TableList" :height="materialY158TableList.length > 4 ? '' : '196'" border tooltip-effect="dark" @row-dblclick="EditY158Row">
                    <el-table-column :index="index => getIndexMethod(index, materialY158TableList)" type="index" label="序号" width="50px" fixed />
                    <el-table-column :formatter="materialLocationOrhouseNoY158" label="领用库位" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="领用物料" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="batch" label="领用批次" min-width="110" :show-overflow-tooltip="true" />
                    <el-table-column prop="stockAmount" label="库存数量" width="90" :show-overflow-tooltip="true" />
                    <el-table-column prop="amount" label="领用数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="unit" label="单位" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="operationMans" label="添加人" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="remark" label="备注" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="操作人" prop="changer" width="140" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column width="70" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeDataRow(scope.row, 'Y158')">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <div class="material-get-content_addTotal">
                    Y158合计：{{ getY158MaterialTotalNum }} 盒
                </div>
            </div>
        </mds-card>
        <mds-card title="面粉领用">
            <el-row class="home_card__main" :gutter="10">
                <el-col v-for="(item, opIndex) in stockInfoList" :key="opIndex" :span="6">
                    <div class="card-stock">
                        <div class="card-stock__head">
                            <span>{{ `${item.workShopName}${item.wareHouseName ? '：'+ item.wareHouseName : ''}` }}</span>
                            <el-button class="floatr" type="text" :disabled="!isRedact" @click="addRow(item)">
                                领用
                            </el-button>
                        </div>
                        <flour-material-detail-list :material-detail-data="item" />
                    </div>
                </el-col>
            </el-row>
            <div class="semi">
                <el-table header-row-class-name="tableHead" class="newTable semi__pot_table" :data="materialTableList" :height="materialTableList.length > 4 ? '' : '196'" border tooltip-effect="dark" @row-dblclick="EditRow">
                    <el-table-column :index="index => getIndexMethod(index, materialTableList)" type="index" label="序号" width="50px" fixed />
                    <el-table-column :formatter="materialLocationOrhouseNoFlour" label="领用库位" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="BOM物料" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用物料" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="batch" label="领用批次" min-width="110" :show-overflow-tooltip="true" />
                    <el-table-column prop="stockAmount" label="库存数量" min-width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="amount" label="领用数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="unitName" label="单位" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.unitName || scope.row.unit }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="supplier" label="面粉厂家" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="operationMans" label="上面人" min-width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="impurityAmount" label="杂质数量(千克)" min-width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="remark" label="备注" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="操作人" prop="changer" width="140" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column width="70" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <div class="material-get-content_addTotal">
                    面粉量合计：{{ getMaterialTotalNum }} 千克
                </div>
            </div>
        </mds-card>
        <audit-log :table-data="auditList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <flour-material-apply-dialog v-if="visible" ref="flourMaterialApplyDialog" :form-header="formHeader" @success="handleCallback" />
        <flour-y158-apply-dialog v-if="Y158Visible" ref="flourY158ApplyDialog" :form-header="formHeader" @success="handleY158Callback" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { AUDIT_API, KOJI_API } from 'common/api/api';
    import FlourMaterialApplyDialog from './FlourMaterialApplyDialog.vue'
    import FlourY158ApplyDialog from './FlourY158ApplyDialog.vue'
    import FlourMaterialDetailList from './FlourMaterialDetailList.vue'

    @Component({
        name: 'FlourMaterialApply',
        components: {
            FlourMaterialApplyDialog,
            FlourY158ApplyDialog,
            FlourMaterialDetailList
        }
    })
    export default class FlourMaterialApply extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: 0 }) sieveTotalNum: number | string;

        $refs: {
            flourMaterialApplyDialog: HTMLFormElement;
            flourY158ApplyDialog: HTMLFormElement;
        };

        formHeader: SemiObj = {};

        Y158Visible = false;
        visible = false;

        stockY158InfoList: StockInfoList[] = [];
        // 物料list
        stockInfoList: StockInfoList[] = [];
        // Y158领用记录
        materialY158TableList: SemiObj[] = [];
        // 面粉领用记录list
        materialTableList: SemiObj[] = [];
        // 审核记录list
        auditList = [];

        init(formHeader) {
            this.formHeader = formHeader;
            // 查询 物料仓列表 面粉记录 Y158记录 审核记录
            this.warehouseQuery();
            this.warehouseY158Query();
            this.materialY158GetList();
            this.materialGetList();
            this.getAuditList();
        }

        ruleSubmit() {
            if (!(this.materialY158TableList.length > 0)) {
                this.$warningToast('Y158物料领用记录为空,无法提交');
                return false
            }

            if (!(this.materialTableList.length > 0)) {
                this.$warningToast('面粉物料领用记录为空,无法提交');
                return false
            }

            return true
        }

        // Y158领用库位
        materialLocationOrhouseNoY158(row) {
            if (!row.wareHouseNo) {
                row.tempLocation = this.formHeader.workShopName
                return row.tempLocation
            }
            row.tempLocation = this.stockY158InfoList.filter(item => item.wareHouseNo === row.wareHouseNo)[0].wareHouseName
            return row.tempLocation
        }


        // 面粉领用库位
        materialLocationOrhouseNoFlour(row) {
            if (!row.wareHouseNo) {
                return this.formHeader.workShopName
            }
            return this.stockInfoList.filter(item => item.wareHouseNo === row.wareHouseNo)[0].wareHouseName
        }

        // 查询领用Y158仓库list
        warehouseY158Query() {
            KOJI_API.KOJI_STORAGE_Y158_STRAIN_CURRENT_PARTICULARS_API({}).then(({ data }) => {
                console.log('查询领用Y158仓库list')
                console.log(data)
                this.stockY158InfoList = data.data || [];
            });
        }

        // 查询领用仓库list
        warehouseQuery() {
            KOJI_API.KOJI_STORAGE_WHEAT_CURRENT_PARTICULARS_API({}).then(({ data }) => {
                console.log('查询领用仓库list')
                console.log(data)
                this.stockInfoList = data.data || [];
            });
        }

        // Y158物料领用记录查询
        materialY158GetList() {
            KOJI_API.KOJI_MATERIAL_GET_QUERY_API({ // /kojiMaterial/query
                kojiOrderNo: this.formHeader.kojiOrderNo,
                materialType: 'Y158'
            }).then(({ data }) => {
                console.log('Y158物料领用记录查询')
                console.log(data)
                this.materialY158TableList = data.data || [];
            });
        }

        // 物料领用记录查询
        materialGetList() {
            KOJI_API.KOJI_MATERIAL_GET_QUERY_API({
                kojiOrderNo: this.formHeader.kojiOrderNo,
                materialType: 'FLOUR'
            }).then(({ data }) => {
                console.log('物料领用记录查询')
                console.log(data)
                this.materialTableList = data.data || [];
            });
        }

        // 查询最新审核记录
        getAuditList() {
            // AUDIT_API.AUDIT_LOG_LIST_API({ orderNo: this.formHeader.orderNo, verifyType: 'MATERIAL' }).then(({ data }) => {
            //     this.auditList = data.data;
            // });
            AUDIT_API.STE_AUDIT_LOG_API({ orderNo: this.formHeader.orderNo, splitOrderNo: this.formHeader.kojiOrderNo, verifyType: ['SF_MATERIAL', 'MATERIAL'] }).then(({ data }) => {
                this.auditList = data.data;
            });
        }

        // 获取 所有物料领用数据汇总
        getSavedOrSubmitData() {
            const Y158AllList = this.materialY158TableList.map(item => {
                item.materialType = 'Y158';
                return item;
            })

            const FlourAllList = this.materialTableList.map(item => {
                item.materialType = 'FLOUR';
                return item;
            })

            return [
                ...Y158AllList,
                ...FlourAllList
            ]
        }

        addY158DataRow() {
            this.Y158Visible = true;
            this.$nextTick(() => {
                this.$refs.flourY158ApplyDialog.init({
                    orderNo: this.formHeader.orderNo
                }, 'add');
            });
        }

        EditY158Row(row) {
            if (!this.isRedact) {
                return false;
            }
            this.Y158Visible = true;
            this.$nextTick(() => {
                this.$refs.flourY158ApplyDialog.init(row, 'edit');
            });
        }

        addRow(item) {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.flourMaterialApplyDialog.init({
                    ...item,
                    orderNo: this.formHeader.orderNo,
                    kojiOrderNo: this.formHeader.kojiOrderNo
                }, this.formHeader, 'add');
            });
        }

        EditRow(row) {
            if (!this.isRedact) {
                return false;
            }
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.flourMaterialApplyDialog.init({
                    ...row,
                    orderNo: this.formHeader.orderNo,
                    kojiOrderNo: this.formHeader.kojiOrderNo
                }, this.formHeader, 'edit');
            });
        }

        handleY158Callback() {
            this.materialY158GetList();
            this.getAuditList();
            this.Y158Visible = false;
        }

        handleCallback() {
            this.materialGetList();
            this.warehouseY158Query();
            this.warehouseQuery();
            this.getAuditList();
            this.visible = false;
        }

        removeDataRow(row, type) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (type === 'Y158') {
                    this.deleteY158Row(row);
                } else {
                    this.deleteRow(row);
                }
            });
        }

        deleteY158Row(row) {
            KOJI_API.KOJI_MATERIAL_DELETE_QUERY_API({
                deleteDto: [row.id]
            }).then(() => {
                this.materialY158GetList();
                this.getAuditList();
            });
        }

        deleteRow(row) {
            KOJI_API.KOJI_MATERIAL_DELETE_QUERY_API({
                deleteDto: [row.id]
            }).then(() => {
                this.materialGetList();
                this.warehouseY158Query();
                this.warehouseQuery();
                this.getAuditList();
            });
        }

        // Y158领用总数
        get getY158MaterialTotalNum() {
            let num = 0;
            this.materialY158TableList.map(item => {
                if (item.amount) {
                    num += item.amount;
                }
            });
            return num;
        }

        // 计算面粉领用总数
        get getMaterialTotalNum() {
            let num = 0;
            this.materialTableList.map(item => {
                if (item.amount) {
                    num += item.amount;
                }
            });
            return num;
        }
    }
    interface SemiObj {
        kojiOrderNo?: string;
        kojiHouseNo?: string;
        delFlag?: number;
        modifiedId?: number;
        orderId?: string;
        factory?: string;
        orderNo?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        amount?: number;
        batch?: string;
        changed?: string;
        changer?: string;
        id?: string;
        materialCode?: string;
        materialLocation?: string;
        materialName?: string;
        operationMans?: string;
        remark?: string;
        status?: string;
        statusName?: string;
        stockAmount?: number;
        unit?: string;
        smallBeanAmount?: string;
        workShop?: string;
        workShopName?: string;
        materialType?: string;
        tempLocation?: string;
    }
    interface DetailsList {
        batch: string;
        changed: string;
        changer: string;
        currentAmount: number;
        id: string;
        impurityRate: number;
        inStorageAmount: number;
        inStorageDate: string;
        materialCode: string;
        materialLocation: string;
        materialName: string;
        productDate: string;
        remark: string;
        supplier: string;
        unit: string;
        unitName: string;
        wareHouseId: string;
        wareHouseName: string;
        wareHouseNo: string;
    }

    interface StockInfoList {
        detailsList: DetailsList[];
        materialLocation: string;
        reduceCurrentAmount: number;
        wareHouseName: string;
        wareHouseNo: string;
        workShop: string;
        workShopName: string;
    }
</script>

<style lang="scss" scoped>
    .material-get-content {
        .semi {
            display: flex;
            &__pot_box {
                min-width: 150px;
                max-width: 250px;
                height: 196px;
                margin-right: 5px;
                padding-bottom: 10px;
                background: #f5f5f5;
                border-radius: 8px;
                &__main {
                    width: 122px;
                    margin: auto;
                    img {
                        display: block;
                        margin: 10px auto;
                    }
                }
            }
            &___table {
                display: flex;
                flex: 1;
            }
        }
        .home_card__main {
            .card-stock {
                margin-bottom: 20px;
                background: #fff;
                border: 1px solid rgba(0, 0, 0, 0.09);
                border-radius: 4px;
                -webkit-box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.09);
                box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.09);
                .card-stock__head {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    box-sizing: border-box;
                    padding: 10px;
                    font-size: 14px;
                    border-bottom: 1px #e8e8e8 solid;
                    .el-button {
                        font-weight: 400;
                        font-size: 14px;
                    }
                }
            }
        }
        .material-get-content_addTotal {
            display: inline-block;
            height: 32px;
            padding: 10px 0;
            padding-right: 20px;
            color: #333;
            font-weight: 400;
            font-size: 14px;
            line-height: 22px;
        }
        .cleanMarginBottom {
            margin-bottom: 10px;
        }
    }
</style>
