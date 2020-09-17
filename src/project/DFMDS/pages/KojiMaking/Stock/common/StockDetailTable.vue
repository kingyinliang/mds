<template>
    <div
        ref="stockDetailTable"
        class="stock-detail-table-content"
    >
        <el-table height="185" :data="currentData" border tooltip-effect="dark" class="newTable" size="mini">
            <el-table-column type="index" label="序号" width="55" fixed align="center" />
            <el-table-column label="物料" :show-overflow-tooltip="true" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.materialName +' '+ scope.row.materialCode }}
                </template>
            </el-table-column>
            <el-table-column label="批次" :show-overflow-tooltip="true" prop="batch" width="100" align="center" />
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="currentAmount" width="120" align="right">
                <template slot-scope="scope">
                    {{ scope.row.currentAmount ? scope.row.currentAmount.toLocaleString()+' '+ scope.row.unit : '' }}
                </template>
            </el-table-column>
            <el-table-column label="生产日期" width="160" prop="productDate" align="center" :formatter="formatterProductDate" />
            <el-table-column label="存储天数" :show-overflow-tooltip="true" align="center" :formatter="formatterSaveDays" />
        </el-table>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { getDateDiff, getNewDate, dateFormat } from 'utils/utils';
    @Component({
        name: 'StockDetailTable',
        components: {}
    })
    export default class StockDetailTable extends Vue {
        @Prop({ default: [] }) currentData: object[];

        private formatterProductDate(row, column, cellValue) {
            return dateFormat(new Date(cellValue), 'yyyy-MM-dd')
        }

        private formatterSaveDays(row) {
            return parseInt(getDateDiff(row.productDate, getNewDate(), 'day'), 10)
        }
    }
</script>
