<template>
    <div
        ref="stockDetailTable"
        class="stock-detail-table-content"
    >
        <el-table height="185" :data="currentData" border tooltip-effect="dark" class="newTable" size="mini">
            <el-table-column type="index" label="序号" width="55" fixed align="center" />
            <el-table-column label="物料" :show-overflow-tooltip="true" align="center">
                <template slot-scope="scope">
                    {{ scope.row.materialName +' '+ scope.row.materialCode }}
                </template>
            </el-table-column>
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="currentAmount" align="center">
                <template slot-scope="scope">
                    {{ scope.row.currentAmount }}
                </template>
            </el-table-column>
            <el-table-column label="单位" prop="materialUnitName" align="center" />
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
