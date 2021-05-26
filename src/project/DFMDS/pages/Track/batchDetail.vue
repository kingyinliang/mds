<template>
    <div class="header_main">
        <el-dialog title="批次详情" :close-on-click-modal="false" :visible.sync="visible" width="800px">
            <div class="inner-area">
                <div class="inner-area__title">
                    <el-form :model="formModel" inline size="small" label-suffix="：">
                        <el-form-item label="物料描述">
                            <el-tooltip effect="dark" :content="formModel.materialName" placement="top">
                                <el-input :value="formModel.materialName" disabled />
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="批次">
                            <el-input :value="formModel.batch" disabled />
                        </el-form-item>
                    </el-form>
                </div>
                <div class="inner-area__body">
                    <el-table ref="reportDataRef" class="table-style-light data-table newTable" :data="tableData" header-row-class-name="tableHead" size="mini" border style="width: 100%;" height="300">
                        <el-table-column type="index" label="序号" width="50" align="center" fixed />
                        <el-table-column prop="workShop" label="车间" :show-overflow-tooltip="true" />
                        <el-table-column prop="orderNo" label="订单" :show-overflow-tooltip="true" />
                        <el-table-column prop="entryQnt" label="入库数量" :show-overflow-tooltip="true" />
                        <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" />
                    </el-table>
                    <!-- <el-pagination
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="size"
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total"
                        style="padding-bottom: 20px;"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                    /> -->
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { TRACK_API } from 'common/api/api';
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class BatchDetail extends Vue {
    formModel: FormModelType = {};

    tableData: TableDataType[] = [];

    visible = false;

    currentPage = 1;

    size = 10;

    total = 0;

    init(row) {
        this.formModel = row
        this.getData()
    }

    getData() {
        const { materialCode, batch, werks } = this.formModel
        TRACK_API.TRACK_BACK_BATCH_DETAIL({
            materialCode,
            batch,
            werks
        }).then(res => {
            this.visible = true
            this.tableData = res.data.data
        })
    }

    // 分页
    handleSizeChange(val) {
        this.size = val;
        this.getData()
    }

    handleCurrentChange(val) {
        this.currentPage = val;
        this.getData()
    }
}

interface FormModelType {
    werks?: string;
    materialCode?: string;
    batch?: string;
}

interface TableDataType {
    id?: string;
    workShop?: string;
    orderNo?: string;
    materialCode?: string;
    materialName?: string;
    batch?: string;
    entryQnt?: string;
    productDate?: string;
}
</script>

<style scoped>
.inner-area__body {
    padding-bottom: 20px;
}
</style>
