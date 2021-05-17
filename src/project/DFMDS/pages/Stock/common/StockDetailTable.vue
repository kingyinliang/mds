<template>
    <div
        ref="stockDetailTable"
        class="stock-detail-table-content"
    >
        <el-table height="185" :data="currentData" border tooltip-effect="dark" class="newTable" size="mini">
            <el-table-column type="index" label="序号" width="45" fixed align="center" />
            <el-table-column label="物料" :show-overflow-tooltip="true" align="center">
                <template slot-scope="scope">
                    <span class="click-class" @click="toDetail(scope.row)">{{ scope.row.materialName +' '+ scope.row.materialCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="70" :show-overflow-tooltip="true" prop="currentAmount" align="center">
                <template slot-scope="scope">
                    {{ scope.row.currentAmount }}
                </template>
            </el-table-column>
            <el-table-column label="单位" width="50" prop="materialUnitName" align="center" />
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
        @Prop({ default: '' }) currentLocationCode: string;

        private formatterProductDate(row, column, cellValue) {
            return dateFormat(new Date(cellValue), 'yyyy-MM-dd')
        }

        private formatterSaveDays(row) {
            return parseInt(getDateDiff(row.productDate, getNewDate(), 'day'), 10)
        }

        toDetail(row) {
            console.log(row, '=========')
            // 保存当前点击的对象信息
            this.$store.commit('stock/updateStockInfo', { ...row, packageMaterialLocationCode: this.currentLocationCode });
            this.$store.commit(
                'common/updateMainTabs',
                this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Stock-PackingStockManage-detail')
            );
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Stock-PackingStockManage-detail`
                });
            }, 100);
        }
    }
</script>
<style lang="scss" scoped>
.click-class {
    color: #409eff;
    cursor: pointer;
}
</style>
