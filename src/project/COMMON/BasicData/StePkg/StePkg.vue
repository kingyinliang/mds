<template>
    <div class="header_main">
        <mds-card title="对应列表" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-select v-model="queryForm.stePotId" size="small" filterable placeholder="杀菌锅" style="width: 160px; margin-right: 10px;" clearable>
                        <el-option v-for="(item, index) in holderList" :key="index" :label="item.holderName" :value="item.id" />
                    </el-select>
                    <el-button v-if="isAuth('stePkgQuery')" type="primary" size="small" style="margin-right: 10px;" @click="() => { queryForm.current = 1; queryType = 1; GetData() }">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('stePkgQuery')" type="primary" size="small" @click="visibleHightLevelQuery = true">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('stePkgInsert')" type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('stePkgDel')" type="danger" size="small" @click="remove">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 72 - 47" :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="杀菌车间" prop="steWorkShopName" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="杀菌锅号" prop="stePotNo" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="包装车间" prop="pkgWorkShopName" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="包装产线" prop="pkgLineName" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="操作人" prop="changer" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="changed" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('stePkgEdit')" class="ra_btn" type="text" round size="mini" @click="redact(scope.row)">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="queryForm.current" :page-sizes="[10, 20, 50]" :page-size="queryForm.size" layout="total, sizes, prev, pager, next, jumper" :total="queryForm.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog width="500px" title="高级查询" :close-on-click-modal="false" :visible.sync="visibleHightLevelQuery">
            <el-form :inline="true" size="small" :model="queryForm" label-width="100px">
                <el-form-item label="杀菌车间：">
                    <el-select v-model="queryForm.steWorkShop" placeholder="请选择" style="width: 180px;" clearable>
                        <el-option v-for="(item, index) in steWorkShop" :key="index" :label="item.deptName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="包装车间：">
                    <el-select v-model="queryForm.pkgWorkShop" placeholder="请选择" style="width: 180px;" clearable @change="getPkgLine">
                        <el-option v-for="(item, index) in pkgWorkShop" :key="index" :label="item.deptName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="包装产线：">
                    <el-select v-model="queryForm.pkgLine" placeholder="请选择" style="width: 180px;" clearable>
                        <el-option v-for="(item, index) in pkgLine" :key="index" :label="item.deptName" :value="item.id" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleHightLevelQuery = false">取消</el-button>
                <el-button type="primary" @click="() => { queryForm.current = 1; queryType = 2; GetData() }">确定</el-button>
            </span>
        </el-dialog>
        <ste-pkg-add-or-update v-if="addOrUpdate" ref="addOrUpdate" :ste-work-shop="steWorkShop" :pkg-work-shop="pkgWorkShop" :holder-list="holderList" @refreshDataList="GetData" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, BASIC_API } from 'common/api/api';
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

        $refs: {
            addOrUpdate: HTMLFormElement;
        };

        queryType = 1;
        queryForm = {
            current: 1,
            size: 10,
            total: 0,
            stePotId: '',
            steWorkShop: '',
            pkgWorkShop: '',
            pkgLine: ''
        };

        visibleHightLevelQuery = false;
        addOrUpdate = false;
        steWorkShop = [];
        pkgWorkShop = [];
        pkgLine = [];
        holderList = [];
        tableData = [];
        multipleSelection: string[] = [];

        mounted() {
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '包装'
            }).then(({ data }) => {
                this.pkgWorkShop = data.data
            });
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '杀菌'
            }).then(({ data }) => {
                this.steWorkShop = data.data
            });
            COMMON_API.HOLDER_QUERY_API({
                current: 1,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                holderType: '014',
                size: 999
            }).then(({ data }) => {
                this.holderList = data.data.records
            })
            this.GetData()
        }

        getPkgLine(n) {
            COMMON_API.ORG_QUERY_CHILDREN_API({
                parentId: n,
                deptType: 'PRODUCT_LINE'
            }).then(({ data }) => {
                this.pkgLine = data.data
            })
        }

        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的数据');
            } else {
                this.$confirm('确认删除, 是否继续?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    BASIC_API.STEPKG_DEL_API({
                        ids: this.multipleSelection
                    }).then(() => {
                        this.$successToast('删除成功!');
                        this.multipleSelection = [];
                        this.GetData();
                    })
                }).catch()
            }
        }

        GetData() {
            let params;
            if (this.queryType === 1) {
                params = {
                    stePotId: this.queryForm.stePotId,
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.total
                }
            } else if (this.queryType === 2) {
                params = {
                    steWorkShop: this.queryForm.steWorkShop,
                    pkgWorkShop: this.queryForm.pkgWorkShop,
                    pkgLine: this.queryForm.pkgLine,
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.total
                }
            }
            BASIC_API.STEPKG_LIST_API(params).then(({ data }) => {
                this.visibleHightLevelQuery = false;
                this.addOrUpdate = false;
                if (data.data.current === 1 && data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
                this.tableData = data.data.records;
                this.queryForm.current = data.data.current;
                this.queryForm.size = data.data.size;
                this.queryForm.total = data.data.total;
            });
        }

        AddDate() {
            this.addOrUpdate = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init();
            });
        }

        redact(row) {
            this.addOrUpdate = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(row);
            });
        }

        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.queryForm.size = val;
            this.GetData();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.queryForm.current = val;
            this.GetData();
        }
    }
</script>

<style scoped>

</style>
