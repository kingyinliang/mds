<template>
    <div class="material-get-content">
        <mds-card title="物料领用">
            <el-row class="home_card__main" :gutter="10">
                <el-col v-for="(item, opIndex) in stockInfoList" :key="opIndex" :span="6">
                    <div class="card-stock">
                        <div class="card-stock__head">
                            <span>{{ `${item.workShopName}${item.wareHouseName? '：' + item.wareHouseName: ''}` }}</span>
                            <el-button class="floatr" type="text" :disabled="!isRedact" @click="addRow(item)">
                                领用
                            </el-button>
                        </div>
                        <wash-bean-material-detail-list :material-detail-data="item" />
                    </div>
                </el-col>
            </el-row>
            <div class="semi">
                <el-table header-row-class-name="tableHead" class="newTable semi__pot_table" :data="materialTableList" :height="materialTableList.length > 4 ? '' : '196'" border tooltip-effect="dark" @row-dblclick="EditRow">
                    <el-table-column :index="index => getIndexMethod(index, materialTableList)" type="index" label="序号" width="50px" fixed />
                    <el-table-column label="领用库位" min-width="100" :show-overflow-tooltip="true" :formatter="materialLocationOrhouseNo" />
                    <el-table-column label="BOM物料" min-width="100" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="batch" label="领用批次" min-width="110" :show-overflow-tooltip="true" />
                    <el-table-column label="领用物料" min-width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="stockAmount" label="库存量" width="90" :show-overflow-tooltip="true" />
                    <el-table-column prop="amount" label="领用数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="smallBeanAmount" label="小豆数量" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="unit" label="单位" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="supplier" label="大豆厂家" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="remark" label="备注" min-width="100" :show-overflow-tooltip="true" />
                    <el-table-column label="操作人" prop="changer" width="140" />
                    <el-table-column label="操作时间" prop="changed" width="180" />
                    <el-table-column width="70" label="操作" fixed="right">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'C' && scope.row.status !== 'D' && scope.row.status !== 'P')" @click="removeDataRow(scope.row, scope.$index)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div>
                <div class="material-get-content_addTotal">
                    大豆数量合计：{{ getMaterialTotalNum }} 千克
                </div>
                <div class="material-get-content_addTotal">
                    原豆数量合计：{{ getSmallTotalNum || 0 }} 千克
                </div>
            </div>
        </mds-card>
        <audit-log :table-data="auditList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <wash-bean-material-apply-dialog v-if="visible" ref="washBeanMaterialApplyDialog" :form-header="formHeader" @success="handleCallback" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { AUDIT_API, KOJI_API } from 'common/api/api';
    import WashBeanMaterialApplyDialog from './WashBeanMaterialApplyDialog.vue';
    import WashBeanMaterialDetailList from './WashBeanMaterialDetailList.vue';

    @Component({
        name: 'WashBeanMaterialApply',
        components: {
            WashBeanMaterialApplyDialog,
            WashBeanMaterialDetailList
        }
    })
    export default class WashBeanMaterialApply extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: 0 }) sieveTotalNum: number | string;

        $refs: { washBeanMaterialApplyDialog: HTMLFormElement };

        formHeader: SemiObj = {};
        visible = false;
        // 物料list
        stockInfoList: object[] = [];
        // 领用记录list
        materialTableList: SemiObj[] = [];
        // 审核记录list
        auditList = [];

        // 领用库位
        materialLocationOrhouseNo(row) {
            return row.wareHouseNo || row.materialLocation;
        }

        init(formHeader) {
            this.formHeader = formHeader;
            this.warehouseQuery();
            this.materialGetList();
            this.getAuditList();
        }

        // 查询领用仓库list
        warehouseQuery() {
            KOJI_API.KOJI_STORAGE_BEAN_CURRENT_PARTICULARS_API({}).then(({ data }) => {
                this.stockInfoList = data.data || [];
            });
        }

        // 物料领用记录查询
        materialGetList() {
            KOJI_API.KOJI_MATERIAL_GET_QUERY_API({
                kojiOrderNo: this.formHeader.kojiOrderNo,
                materialType: 'BEAN',
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                this.$emit('setMaterialTable', data.data || [])
                this.materialTableList = data.data || [];
            });
        }

        // 查询最新审核记录
        getAuditList() {
            AUDIT_API.AUDIT_LOG_LIST_API({ orderNo: this.formHeader.orderNo, verifyType: 'MATERIAL' }).then(({ data }) => {
                this.auditList = data.data;
            });
        }

        addRow(item) {
            this.visible = true;
            this.$nextTick(() => {
                this.$refs.washBeanMaterialApplyDialog.init({
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
                this.$refs.washBeanMaterialApplyDialog.init({
                    ...row,
                    orderNo: this.formHeader.orderNo,
                    kojiOrderNo: this.formHeader.kojiOrderNo
                }, this.formHeader, 'edit');
            });
        }

        handleCallback() {
            this.materialGetList();
            this.warehouseQuery();
            this.getAuditList();
            this.visible = false;
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteRow(row);
            });
        }

        deleteRow(row) {
            KOJI_API.KOJI_MATERIAL_DELETE_QUERY_API({
                deleteDto: [row.id]
            }).then(() => {
                this.materialGetList();
                this.warehouseQuery();
                this.getAuditList();
            });
        }

        // 计算领用总数
        get getMaterialTotalNum() {
            let num = 0;
            this.materialTableList.map(item => {
                if (item.amount) {
                    num += item.amount;
                }
            });

            return num;
        }

        // 计算原豆总数
        get getSmallTotalNum() {
            let num = 0;
            this.materialTableList.map(item => {
                if (item.amount) {
                    num += item.amount;
                }
                if (item.smallBeanAmount) {
                    num += Number(item.smallBeanAmount);
                }
            });
            num = num - Number(this.sieveTotalNum);
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
