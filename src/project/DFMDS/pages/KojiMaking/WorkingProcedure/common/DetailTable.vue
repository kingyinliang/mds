<template>
    <div
        ref="stockDetailTable"
        class="stock-detail-table-content"
    >
        <el-table height="120" :data="currentData" border tooltip-effect="dark" class="newTable" size="mini">
            <el-table-column label="物料" :show-overflow-tooltip="true" prop="material" width="60" align="center" />
            <el-table-column label="日期" align="center">
                <template slot-scope="scope">
                    {{ scope.row.productDate }}
                </template>
            </el-table-column>
            <el-table-column label="数量" :show-overflow-tooltip="true" prop="currentAmount" width="60" align="center" />
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
