<template>
    <div
        ref="stockDetailTable"
        class="stock-detail-table-content"
    >
        <el-table max-height="185" :data="currentData" border tooltip-effect="dark" class="newTable" size="mini">
            <el-table-column type="index" label="序号" width="55" fixed align="center" />
            <el-table-column label="物料" :show-overflow-tooltip="true" prop="material" width="60" align="center" />
            <el-table-column label="批次" :show-overflow-tooltip="true" prop="batch" width="100" align="center" />
            <el-table-column label="数量(L)" :show-overflow-tooltip="true" prop="currentAmount" width="60" align="center" />
            <el-table-column label="生产日期" width="120" align="center">
                <template slot-scope="scope">
                    {{ scope.row.productDate }}
                </template>
            </el-table-column>
            <el-table-column label="存储天数" :show-overflow-tooltip="true" prop="days" align="center" />
        </el-table>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    @Component({
        name: 'StockDetailTable',
        components: {}
    })
    export default class StockDetailTable extends Vue {
        @Prop({ default: [] }) currentData: object[];
    }
</script>
