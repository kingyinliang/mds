<template>
    <el-dialog width="748px" :title="title" :close-on-click-modal="false" :visible.sync="isShowCurrentDialog" destroy-on-close custom-class="stock-dialog-custom">
        <el-table :data="tableDataList" border tooltip-effect="dark" class="newTable stock-table" size="mini">
            <el-table-column type="index" label="序号" width="55" fixed align="center" />
            <el-table-column label="物料" :show-overflow-tooltip="true" width="180" prop="material" align="center">
                <template slot-scope="scope">
                    {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                </template>
            </el-table-column>
            <el-table-column label="批次" width="100" :show-overflow-tooltip="true" prop="batch" align="center" />
            <el-table-column label="移动类型" width="100" :show-overflow-tooltip="true" prop="moveTypeName" align="center" />
            <el-table-column label="数量(KG)" width="100" :show-overflow-tooltip="true" prop="moveAmount" align="right" />
            <el-table-column label="领用订单" width="100" :show-overflow-tooltip="true" prop="orderNo" align="center" />
            <el-table-column label="调整说明" width="100" :show-overflow-tooltip="true" prop="adjustInfo" align="center" />
            <el-table-column label="操作人" width="100" :show-overflow-tooltip="true" prop="changer" align="center" />
            <el-table-column label="操作时间" width="160" align="center">
                <template slot-scope="scope">
                    {{ scope.row.changed }}
                </template>
            </el-table-column>
        </el-table>
        <el-row v-if="tableDataList.length > 0">
            <el-pagination :current-page="tablePage" :page-sizes="[10, 20, 50]" :page-size="tableSize" layout="total, sizes, prev, pager, next, jumper" :total="tableTotal" @size-change="handleSizeChange" @current-change="handlePageChange" />
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="small" @click="btnHandleCancel">
                关闭
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';

    @Component({
        name: 'StockCheckDialog',
        components: {}
    })
    export default class StockCheckDialog extends Vue {
        @Prop({ default: '' }) title: string;
        // 库存类型
        @Prop({ default: '' }) stockType: string;

        // 表格分页
        private tableSize = 10;
        private tablePage = 1;
        private tableTotal = 0;
        // 表格数据
        private tableDataList = [];
        // 弹窗
        isShowCurrentDialog = false;

        // 操作的数据行
        currentRowData: CurrentData = {};

        init(rowData) {
            // 弹窗打开
            this.isShowCurrentDialog = true;
            // 存储当前操作行数据
            this.currentRowData = {
                ...rowData
            };
            // 触发查询调整记录
            this.queryAdjustList();
        }

        // 查询记录
        private queryAdjustList() {
            KOJI_API.KOJI_STOCK_Y158_DETAIL_ADJUST_LIST_API({
                current: this.tablePage,
                size: this.tableSize,
                stockType: this.stockType,
                materialCode: this.currentRowData.materialCode
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.tableDataList = data.data.records || [];
                    this.tableTotal = data.data.total || 0;
                    if (this.tableTotal === 0) {
                        this.$infoToast('暂无任何内容');
                    }
                } else {
                    this.tableDataList = [];
                    this.tableTotal = 0;
                }
            });
        }

        // 分页查询
        private handleSizeChange(param: number) {
            this.tableSize = param;
            this.queryAdjustList();
        }

        private handlePageChange(param: number) {
            this.tablePage = param;
            this.queryAdjustList();
        }

        // 弹窗关闭
        btnHandleCancel() {
            this.isShowCurrentDialog = false;
            this.tableSize = 10;
            this.tablePage = 1;
            this.tableTotal = 0;
            // 表格数据
            this.tableDataList = [];
        }
    }
    interface CurrentData {
        materialCode?: number|string;
    }
</script>
<style>
    .stock-dialog-custom .el-dialog__body {
        padding: 25px 20px 40px;
    }
</style>
