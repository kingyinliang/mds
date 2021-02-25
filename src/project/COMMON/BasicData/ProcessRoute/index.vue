<!-- 工艺路线 -->
<template>
    <div class="header_main">
        <mds-card title="工艺路线" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-select v-model="queryForm.productMaterialCode" placeholder="请选择生产物料" size="small" filterable tyle="width: 160px;" suffix-icon="el-icon-search" clearable>
                        <el-option v-for="(sole, index) in productMaterialList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                    <el-button v-if="isAuth('')" type="primary" size="small" style="margin: 0 10px;" @click="() => { queryForm.current = 1; queryType = 1; getData() }">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('')" type="primary" size="small" @click="highSearch()">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('')" type="primary" size="small" style="margin-left: 10px;" @click="addOrUpdateHandler('add')">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('')" type="danger" size="small" @click="remove">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 72 - 47" :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column type="index" :index="index => index + 1 + (Number(queryForm.current) - 1) * (Number(queryForm.size))" label="序号" width="50px" fixed />
                <el-table-column label="生产车间" prop="workShopName" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="生产物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.productMaterialName }} {{ scope.row.productMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="任务清单类型" prop="taskInventoryType" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="任务清单组码" prop="unitName" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.taskInventoryCode }}
                    </template>
                </el-table-column>
                <el-table-column label="组计数器" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.groupCounter }}
                    </template>
                </el-table-column>
                <el-table-column label="生产版本" prop="produceVersion" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="操作人" prop="changer" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="changed" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('')" class="ra_btn" type="text" round size="mini" @click="addOrUpdateHandler('edit', scope.row)">
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
                <el-form-item label="生产车间：">
                    <el-select v-model="queryForm.workShop" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(sole, index) in workShopList" :key="index" :value="sole.id" :label="`${sole.deptName}`" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select v-model="queryForm.productMaterialCode2" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(sole, index) in productMaterialList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                </el-form-item>
                <el-form-item label="任务清单组码：">
                    <!-- <el-select v-model="queryForm.useMaterial" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(sole, index) in productMaterialList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select> -->
                    <el-input v-model="queryForm.taskInventoryCode" placeholder="请输入" filterable style="width: 283px;" />
                </el-form-item>
                <el-form-item label="组计数器：">
                    <el-input v-model="queryForm.groupCounter" placeholder="请输入" filterable style="width: 283px;" />
                </el-form-item>
                <el-form-item label="生产版本：">
                    <el-input v-model="queryForm.produceVersion" placeholder="请输入" filterable style="width: 283px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleHightLevelQuery = false">取消</el-button>
                <el-button type="primary" @click="() => { queryForm.current = 1; queryType = 2; getData() }">确定</el-button>
            </span>
        </el-dialog>
        <add-or-update ref="addOrUpdate" :work-shop-list="workShopList" :product-material-list="productMaterialList" @refreshDataList="refreshDataList" />
    </div>
</template>

<script lang="ts">
    import { BASIC_API, COMMON_API } from 'src/common/api/api';
    import { dateFormat, getUserNameNumber } from 'src/utils/utils';
    import { Vue, Component } from 'vue-property-decorator';
    import AddOrUpdate from './addOrUpdate.vue';

    @Component({
        name: 'ProcessRoute',
        components: {
            'add-or-update': AddOrUpdate
        }
    })
    export default class ProcessRoute extends Vue {

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        $refs: {
            addOrUpdate: HTMLFormElement;
        }

        tableData = [];
        workShopList = [];
        productMaterialList = [];
        multipleSelection: string[] = [];
        queryType = 1;
        queryForm = {
            current: 1,
            size: 10,
            total: 0,
            workShop: '',
            productMaterialCode: '',
            productMaterialCode2: ''
        };

        visibleHightLevelQuery = false;

        mounted() {
            this.getData()
            this.getWorkShopList()
            this.getProductMaterialList()
        }

        getWorkShopList() {
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '车间'
            }).then(({ data }) => {
                this.workShopList = data.data;
            })
        }

        getProductMaterialList() {
            // // 走发酵信息的生产物料
            // BASIC_API.FERINFO_LIST_API({
            //     current: 1,
            //     size: 999999
            // })
            COMMON_API.SEARCH_MATERIAL_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                materialType: 'ZHAL'
            })
            .then(({ data }) => {
                this.productMaterialList = data.data
            })
        }

        highSearch() {
            this.queryForm.productMaterialCode2 = this.queryForm.productMaterialCode;
            this.visibleHightLevelQuery = true;
        }

        getData() {
            let params;
            if (this.queryType === 1) {
                params = {
                    productMaterialCode: this.queryForm.productMaterialCode,
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.total
                }
            } else if (this.queryType === 2) {
                params = {
                    ...this.queryForm,
                    productMaterialCode: this.queryForm.productMaterialCode2
                }
            }
            BASIC_API.FER_CRAFT_PAGE_QUERY_API(params).then(({ data }) => {
                this.visibleHightLevelQuery = false;
                this.$refs.addOrUpdate.visible = false;
                if (data.data.current === 1 && data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
                this.tableData = data.data.records;
                this.queryForm.current = data.data.current;
                this.queryForm.size = data.data.size;
                this.queryForm.total = data.data.total;
            });
        }

        refreshDataList() {
            this.getData()
        }

        addOrUpdateHandler(type, row) {
            if (type === 'add') {
                this.$refs.addOrUpdate.dataForm = {
                    taskInventoryType: 'N',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                };
            } else {
                this.$refs.addOrUpdate.dataForm = { ...row };
            }
            this.$refs.addOrUpdate.visible = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.$refs.addForm.clearValidate();
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
                    BASIC_API.FER_CRAFT_DELETE_API(this.multipleSelection).then(() => {
                        this.$successToast('删除成功!');
                        this.multipleSelection = [];
                        this.getData()
                    })
                }).catch()
            }
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
            this.getData()
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.queryForm.current = val;
            this.getData()
        }
    }
</script>

<style lang="scss">
</style>
