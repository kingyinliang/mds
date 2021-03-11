<template>
    <div class="header_main">
        <mds-card title="发酵信息" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-select v-model="queryForm.productMaterial1" size="small" placeholder="请选择" suffix-icon="el-icon-search" clearable filterable style="width: 160px; margin-right: 10px;">
                        <el-option v-for="(sole, index) in material" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                    <el-button v-if="isAuth('craftQuery')" type="primary" size="small" style="margin-right: 10px;" @click="() => { queryForm.current = 1; queryType = 1; GetData() }">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('craftQuery')" type="primary" size="small" @click="visibleHightLevelQuery = true">
                        高级查询
                    </el-button>
                    <el-button v-if="isAuth('craftInsert')" type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                        新增
                    </el-button>
                    <el-button v-if="isAuth('craftDel')" type="danger" size="small" @click="remove">
                        批量删除
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :height="mainClientHeight - 72 - 47" :data="tableData" border tooltip-effect="dark" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50" fixed="left" align="center" />
                <el-table-column type="index" :index="index => index + 1 + (Number(queryForm.current) - 1) * (Number(queryForm.size))" label="序号" width="50px" fixed />
                <el-table-column label="工序段" prop="productProcessName" min-width="80" :show-overflow-tooltip="true" />
                <el-table-column label="生产物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.productMaterialName }} {{ scope.row.productMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="领用物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.useMaterialName }} {{ scope.row.useMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="订单天数" prop="orderDays" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="报工成熟天数" prop="jobDays" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="发酵成熟天数" prop="matureDays" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="发酵超期天数" prop="overdueDays" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="报工标识" prop="jobBookingFlagName" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="组织名称" prop="deptName" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="数量倍数" prop="multiple" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
                <el-table-column label="操作人" prop="changer" :show-overflow-tooltip="true" />
                <el-table-column label="操作时间" prop="changed" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('craftEdit')" class="ra_btn" type="text" round size="mini" @click="redact(scope.row)">
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
                <el-form-item label="工序段：">
                    <el-select v-model="queryForm.productProcess" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(sole, index) in processList" :key="index" :value="sole.dictCode" :label="sole.dictValue" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select v-model="queryForm.productMaterial" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(sole, index) in material" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                </el-form-item>
                <el-form-item label="领用物料：">
                    <el-select v-model="queryForm.useMaterial" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(sole, index) in material" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单天数：">
                    <el-input v-model="queryForm.orderDays" style="width: 283px;" clearable />
                </el-form-item>
                <el-form-item label="报工成熟天数：">
                    <el-input v-model="queryForm.jobDays" style="width: 283px;" clearable />
                </el-form-item>
                <el-form-item label="发酵成熟天数：">
                    <el-input v-model="queryForm.matureDays" style="width: 283px;" clearable />
                </el-form-item>
                <el-form-item label="发酵超期天数：">
                    <el-input v-model="queryForm.overdueDays" style="width: 283px;" clearable />
                </el-form-item>
                <el-form-item label="报工标识：">
                    <el-select v-model="queryForm.jobBookingFlag" placeholder="请选择" filterable style="width: 283px;" clearable>
                        <el-option v-for="(iteam, index) in hoursList" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleHightLevelQuery = false">取消</el-button>
                <el-button type="primary" @click="() => { queryForm.current = 1; queryType = 2; GetData() }">确定</el-button>
            </span>
        </el-dialog>
        <ferinfo-add-or-update v-if="addOrUpdate" ref="addOrUpdate" :process-list="processList" :material="material" :hours-list="hoursList" :organization-list="organizationList" @refreshDataList="GetData" />
    </div>
</template>

<script  lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, BASIC_API } from 'common/api/api';
    import ferinfoAddOrUpdate from './ferinfoAddOrUpdate.vue';

    @Component({
        name: 'FermentationInfo',
        components: {
            ferinfoAddOrUpdate
        }
    })
    export default class FermentationInfo extends Vue {
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
            productMaterial1: '',
            productMaterial: '',
            useMaterial: '',
            jobBookingFlag: '',
            jobDays: '',
            matureDays: '',
            orderDays: '',
            overdueDays: '',
            productProcess: ''
        };

        visibleHightLevelQuery = false;
        addOrUpdate = false;
        tableData = [];
        processList = [];
        material = [];
        hoursList = [];
        organizationList = [];
        multipleSelection: string[] = [];

        mounted() {
            this.getMaterial()
            this.getOption()
        }

        getMaterial() {
            COMMON_API.SEARCH_MATERIAL_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                materialType: 'ZHAL'
            }).then(({ data }) => {
                this.material = data.data
            })
        }

        getOption() {
            COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'FER_PROCESS_STAGE'
            }).then(({ data }) => {
                this.processList = data.data
            });
            COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'FER_TIME_SHEET_END'
            }).then(({ data }) => {
                this.hoursList = data.data
            });
            COMMON_API.SYS_CHILDTYPE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['PROCESS'],
                deptName: '发酵'
            }).then(({ data }) => {
                this.organizationList = data.data
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
                    BASIC_API.FERINFO_DEL_API(this.multipleSelection).then(() => {
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
                    productMaterial: this.queryForm.productMaterial1,
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.current
                }
            } else if (this.queryType === 2) {
                params = {
                    current: this.queryForm.current,
                    size: this.queryForm.size,
                    total: this.queryForm.current,
                    useMaterial: this.queryForm.useMaterial,
                    productMaterial: this.queryForm.productMaterial,
                    jobBookingFlag: this.queryForm.jobBookingFlag,
                    jobDays: this.queryForm.jobDays,
                    matureDays: this.queryForm.matureDays,
                    orderDays: this.queryForm.orderDays,
                    productProcess: this.queryForm.productProcess,
                    overdueDays: this.queryForm.overdueDays
                }
            }
            BASIC_API.FERINFO_LIST_API(params).then(({ data }) => {
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
