<template>
    <div
        class="stock-detail-table-content"
    >
        <el-table height="120" :data="currentData" border tooltip-effect="dark" class="newTable" size="mini">
            <el-table-column label="物料" :show-overflow-tooltip="true" prop="material" width="60" align="center" />
            <el-table-column label="日期" align="center" :formatter="formatterProductDate" />
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="currentAmount" width="60" align="right">
                <template slot-scope="scope">
                    {{ scope.row.currentAmount ? scope.row.currentAmount.toLocaleString()+' '+ scope.row.unit : '' }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat } from 'utils/utils';
    @Component({
        name: 'StockDetailTable',
        components: {}
    })
    export default class StockDetailTable extends Vue {
        @Prop({ default: [] }) currentData: object[];

        private formatterProductDate(row, column, cellValue) {
            return dateFormat(new Date(cellValue), 'yyyy-MM-dd')
        }
    }
</script>
