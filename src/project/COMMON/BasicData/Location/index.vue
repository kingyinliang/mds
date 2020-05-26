<template>
    <div>
        <div class="header_main">
            <mds-card title="库位列表" :name="'location'" :pack-up="false" style="background: #fff;">
                <template slot="titleBtn">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="form.deptName" placeholder="车间" suffix-icon="el-icon-search" clearable @clear="getQueryItemList()" @keyup.enter.native="getQueryItemList()" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" :disabled="form.deptName.trim() === ''" @click="getQueryItemList()">
                                    查询
                                </el-button>
                                <el-button type="primary" size="small" @click="isAdvanceSearchDialogShow = true">
                                    高级查询
                                </el-button>
                                <el-button type="primary" size="small" @click="addOrUpdateItem()">
                                    新增
                                </el-button>
                                <el-button type="danger" size="small" :disabled="itemList.length === 0 || multipleSelection.length === 0" @click="removeItems()">
                                    批量删除
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </template>
                <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :height="documentClientHeight - 32 - 40 - 75 - 100 - 47" :data="itemList" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange" @row-dblclick="addOrUpdateItem">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" align="center" />
                    <el-table-column prop="deptName" width="160" :show-overflow-tooltip="true" label="车间" />
                    <el-table-column :show-overflow-tooltip="true" label="物料类型">
                        <template slot-scope="scope">
                            {{ scope.row.materialTypeCode + ' ' + scope.row.materialTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column :show-overflow-tooltip="true" label="物料编码">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column width="80" prop="storageLocation" label="库位" />
                    <el-table-column width="91" label="是否样品库">
                        <template slot-scope="scope">
                            {{ scope.row.sampleFlag === 0 ? '否' : '是' }}
                        </template>
                    </el-table-column>
                    <el-table-column width="84" label="发料/入库">
                        <template slot-scope="scope">
                            {{ scope.row.materialUse === 'F' ? '发料' : '入库' }}
                        </template>
                    </el-table-column>
                    <el-table-column width="54" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="addOrUpdateItem(scope.row)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="itemList.length !== 0">
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </mds-card>
        </div>
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="isAdvanceSearchDialogShow" @close="closeSearchDialog()">
            <el-form ref="searchDialog" :model="form" size="small" label-width="110px" class="locationdialog">
                <el-form-item label="车间：" prop="orderNo1">
                    <el-select v-model="form.deptId" placeholder="请选择">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in workShop" :key="index" :label="item.deptName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="物料类型：" prop="orderNo2">
                    <el-select v-model="form.materialTypeCode" placeholder="请选择">
                        <el-option label="" value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in materialList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="库位：">
                    <el-input v-model="form.storageLocation" placeholder="手工录入" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isAdvanceSearchDialogShow = false">
                    取消
                </el-button>
                <el-button type="primary" @click="getAdvanceQueryItemList()">
                    确定
                </el-button>
            </span>
        </el-dialog>
        <location-add v-if="isAddOrUpdateDialogShow" ref="locationAdd" :work-shop="workShop" :material-list="materialList" @refreshDataList="getItemList()" />
    </div>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    import LocationAdd from './LocationAdd';
    export default {
        name: 'LocationManage',
        components: {
            LocationAdd
        },
        data() {
            return {
                isAdvanceSearchDialogShow: false,
                isAddOrUpdateDialogShow: false,
                isClickSearchDialogConfirm: false,
                form: {
                    deptId: '',
                    deptName: '',
                    //物料类型编码
                    materialTypeCode: '',
                    //库位
                    storageLocation: ''
                },
                itemList: [],
                workShop: [],
                materialList: [],
                //选中要删除的数据源
                multipleSelection: [],
                currPage: 1,
                pageSize: 10,
                totalCount: 0,
                currentQueryStatus: 0
            };
        },
        computed: {
            documentClientHeight() {
                return this.$store.state.common.documentClientHeight;
            }
        },
        mounted() {
            this.getItemList();
            this.getDeptByFactoryId();
            this.getMaterial();
        },
        methods: {
            // 获取库位列表
            getItemList(st) {
                if (st) {
                    this.currPage = 1;
                }
                COMMON_API.STORAGE_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptId: this.form.deptId,
                    deptName: this.form.deptName,
                    materialType: this.form.materialTypeCode,
                    storageLocation: this.form.storageLocation,
                    size: this.pageSize,
                    current: this.currPage
                }).then(({ data }) => {
                    this.isAddOrUpdateDialogShow = false;
                    this.isAdvanceSearchDialogShow = false;
                    if (st && data.data.records.length === 0) {
                            this.$infoToast('该搜寻条件无任何库位数据！');
                        }
                    this.multipleSelection = [];
                    this.itemList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                });
            },
            //模糊查询
            getQueryItemList() {
                this.form.deptId = '';
                this.form.materialTypeCode = '';
                this.form.storageLocation = '';
                this.getItemList(true);
            },
            //高级查询
            getAdvanceQueryItemList() {
                this.form.deptName = '';
                this.isClickSearchDialogConfirm = true;
                this.getItemList(true);
            },
            //关闭高级查询对话框
            closeSearchDialog() {
                if (this.isClickSearchDialogConfirm === false) {
                    this.form.deptId = '';
                    this.form.materialTypeCode = '';
                    this.form.storageLocation = '';
                }
            },
            // 批量删除
            removeItems() {
                this.$confirm('确认删除库位, 是否继续?', '删除库位', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    COMMON_API.STORAGE_REMOVE_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        ids: this.multipleSelection
                    }).then(({ data }) => {
                        this.$successToast((data.msg));
                        this.multipleSelection = [];
                        this.$nextTick(() => {
                            this.getItemList()
                        });
                    });
                });
            },
            //编辑或新增库位
            addOrUpdateItem(data) {
                this.isAddOrUpdateDialogShow = true;
                this.$nextTick(() => {
                    this.$refs.locationAdd.init(data);
                });
            },
            //获取车间
            getDeptByFactoryId() {
                COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptType: ['WORK_SHOP']
                }).then(({ data }) => {
                    this.workShop = data.data;
                });
            },
            // 获取物料
            getMaterial() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_MATERIAL_TYPE'
                }).then(({ data }) => {
                    this.materialList = data.data;
                });
            },
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelection = [];
                val.forEach(item => {
                    this.multipleSelection.push(item.id);
                });
            },
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getItemList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.currPage = val;
                this.getItemList();
            }
        }
    };
</script>

<style scoped></style>
