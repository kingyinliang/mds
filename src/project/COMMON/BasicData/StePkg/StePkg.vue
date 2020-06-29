<template>
    <div class="header_main">
        <mds-card title="对应列表" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model.trim="queryForm.material" size="small" placeholder="领用物料" suffix-icon="el-icon-search" style="width: 160px; margin-right: 10px;" />
                    <el-button type="primary" size="small" style="margin-right: 10px;" @click="GetDate()">
                        查询
                    </el-button>
                    <el-popover
                        placement="bottom"
                        width="320"
                        trigger="click"
                    >
                        <el-form :inline="true" size="small" :model="queryForm" label-width="100px">
                            <el-form-item label="杀菌车间：">
                                <el-input v-model.trim="queryForm.material" style="width: 180px;" clearable />
                            </el-form-item>
                            <el-form-item label="杀菌锅：">
                                <el-input v-model.trim="queryForm.material" style="width: 180px;" clearable />
                            </el-form-item>
                            <el-form-item label="包装车间：">
                                <el-input v-model.trim="queryForm.material" style="width: 180px;" clearable />
                            </el-form-item>
                            <el-form-item label="包装产线：">
                                <el-input v-model.trim="queryForm.material" style="width: 180px;" clearable />
                            </el-form-item>
                        </el-form>
                        <el-button slot="reference" type="primary" size="small" @click="AddDate()">
                            高级查询
                        </el-button>
                    </el-popover>
                    <el-button type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                        新增
                    </el-button>
                    <el-button type="danger" size="small" @click="remove">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 72 - 47" :data="tableData" border tooltip-effect="dark">
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="杀菌车间" prop="classType" />
                <el-table-column label="杀菌锅号" prop="classType" />
                <el-table-column label="包装车间" prop="classType" />
                <el-table-column label="包装产线" prop="classType" />
                <el-table-column label="备注" prop="classType" />
                <el-table-column label="操作人" prop="classType" />
                <el-table-column label="操作时间" prop="classType" />
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="ra_btn" type="primary" round size="mini" @click="redact(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <ste-pkg-add-or-update />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import StePkgAddOrUpdate from './StePkgAddOrUpdate.vue'

    @Component({
        name: 'StePkg',
        components: {
            StePkgAddOrUpdate
        }
    })
    export default class StePkg extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        currPage = 1;
        currPage = 10;
        totalCount = 0;
        queryForm = {
            material: ''
        };

        tableData = [];

        remove() {
            console.log(1);
        }

        GetDate() {
            console.log(1);
        }

        AddDate() {
            console.log(1);
        }

        redact() {
            console.log(1);
        }
    }
</script>

<style scoped>

</style>
