<template>
    <div ref="stockTableData" class="stock-table-data-content">
        <el-table :data="tableDataList" border tooltip-effect="dark" class="newTable stock-table" size="mini">
            <el-table-column type="index" label="序号" width="55" fixed align="center" />
            <el-table-column label="物料" :show-overflow-tooltip="true" width="180" align="center">
                <template slot-scope="scope">
                    {{ scope.row.materialName +' '+ scope.row.materialCode }}
                </template>
            </el-table-column>
            <el-table-column label="批次" width="120" :show-overflow-tooltip="true" prop="batch" align="center" />
            <el-table-column label="厂家" width="120" :show-overflow-tooltip="true" prop="supplier" align="center" />
            <el-table-column label="入库日期" width="160" :show-overflow-tooltip="true" prop="inStorageDate" align="center" :formatter="formatterProductDate" />
            <el-table-column label="生产日期" width="160" :show-overflow-tooltip="true" prop="productDate" align="center" :formatter="formatterProductDate" />
            <el-table-column v-if="!isHistoryPage" label="存储天数" :show-overflow-tooltip="true" prop="days" align="center" :formatter="formatterSaveDays" />
            <el-table-column label="入库数量(KG)" width="140" :show-overflow-tooltip="true" prop="inStorageAmount" align="right">
                <template slot-scope="scope">
                    {{ scope.row.inStorageAmount ? scope.row.inStorageAmount.toLocaleString() : '' }}
                </template>
            </el-table-column>
            <el-table-column label="当前数量(KG)" width="140" :show-overflow-tooltip="true" prop="currentAmount" align="right">
                <template slot-scope="scope">
                    {{ scope.row.currentAmount ? scope.row.currentAmount.toLocaleString(): '' }}
                </template>
            </el-table-column>
            <el-table-column v-if="stockType!=='Y158'" label="杂质率" :show-overflow-tooltip="true" prop="impurityRate" align="center" />
            <el-table-column label="操作" width="140" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="iconfont factory-fangdajing-copy" @click="btnCheckStock(scope.row, true)">
                        查询
                    </el-button>
                    <div v-if="!isHistoryPage" class="table-divider__vertical" />
                    <el-button v-if="!isHistoryPage" size="mini" type="text" icon="iconfont factory-banshou" @click="btnHandleStock(scope.row, true)">
                        调整
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row v-if="tableDataList.length > 0 && !isHistoryPage">
            <el-pagination :current-page="tablePage" :page-sizes="[10, 20, 50]" :page-size="tableSize" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal" @size-change="handleSizeChange" @current-change="handlePageChange" />
        </el-row>
        <stock-edit-dialog ref="stockEditDialog" title="盘点调整" :stock-type="stockType" @refreshTableList="getStockDetailList" />
        <stock-check-dialog ref="stockCheckDialog" :stock-type="stockType" title="移动明细" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';
    import { getDateDiff, getNewDate, dateFormat } from 'utils/utils';

    import StockEditDialog from './StockEditDialog.vue';
    import StockCheckDialog from './StockCheckDialog.vue';

    @Component({
        name: 'StockTableData',
        components: {
            StockEditDialog,
            StockCheckDialog
        }
    })
    export default class StockTableData extends Vue {
        @Prop({
            default: {
                workShop: '',
                wareHouseNo: '',
                materialLocation: '',
                wareHouse: '',
                location: ''
            }
        }) workShopInfo: WorkShopInfo;

        @Prop({ default: false }) isHistoryPage: boolean;
        @Prop({ default: false }) stockType: string;

        $refs: {
            stockTableData: HTMLFormElement;
            stockEditDialog: HTMLFormElement;
            stockCheckDialog: HTMLFormElement;
        };

        mounted() {
            this.getStockDetailList();
        }

        // 表格分页
        private tableSize = 10;
        private tablePage = 1;
        private tableTotal = 0;
        // 表格数据
        private tableDataList: object[] = [];

        private formatterProductDate(row, column, cellValue) {
            return dateFormat(new Date(cellValue), 'yyyy-MM-dd')
        }

        private formatterSaveDays(row) {
            return parseInt(getDateDiff(row.productDate, getNewDate(), 'day'), 10)
        }

        // 获取表格明细数据
        getStockDetailList() {
            const queryObj = {
                current: this.tablePage,
                // factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                size: this.tableSize,
                workShop: this.workShopInfo.workShop,
                wareHouseNo: this.workShopInfo.wareHouseNo,
                materialLocation: this.workShopInfo.materialLocation
            };
            if (!this.isHistoryPage) {
                KOJI_API[`KOJI_STOCK_${this.stockType}_DETAIL_CUR_LIST_API`](queryObj).then(({ data }) => {
                    if (data.code === 200) {
                        this.tableDataList = data.data.records || [];
                        this.tableTotal = data.data.total || 0;
                    } else {
                        this.tableDataList = [];
                        this.tableTotal = 0;
                    }
                });
            }

            if (this.isHistoryPage) {
                KOJI_API[`KOJI_STOCK_${this.stockType}_DETAIL_HISTORY_LIST_API`](queryObj).then(({ data }) => {
                    if (data.code === 200) {
                        this.tableDataList = data.data.records || [];
                        this.tableTotal = data.data.total || 0;
                    } else {
                        this.tableDataList = [];
                        this.tableTotal = 0;
                    }
                })
            }
        }

        // 分页事件
        private handleSizeChange(param: number) {
            this.tableSize = param;
            this.getStockDetailList();
        }

        private handlePageChange(param: number) {
            this.tablePage = param;
            this.getStockDetailList();
        }

        // 调整按钮
        private btnHandleStock(row) {
            this.$refs.stockEditDialog.init(row, []);
        }

        // 查询按钮
        private btnCheckStock(row) {
            this.$refs.stockCheckDialog.init(row, []);
        }
    }

    interface WorkShopInfo {
        workShop?: string;
        wareHouseNo?: string;
        materialLocation?: string;
        wareHouse?: string;
        location?: string;
    }
</script>
<style lang="scss" scoped>
    .table-divider__vertical {
        position: relative;
        display: inline-block;
        width: 1px;
        height: 1em;
        margin: 0 8px;
        vertical-align: middle;
        background: #e9e9e9;
    }
</style>

<style>
.stock-table .iconfont {
    font-size: 12px;
}
</style>
