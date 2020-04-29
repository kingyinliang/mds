<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @keyup.enter.native="getVagueItemList(true)" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="form.deptName" placeholder="车间" suffix-icon="el-icon-search" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" :disabled="form.deptName.trim() === ''" @click="getVagueItemList(true)">
                                    查询
                                </el-button>
                                <el-button type="primary" size="small" @click="isAdvanceSearchDailogShow = true">
                                    高级查询
                                </el-button>
                                <el-button type="primary" size="small" @click="addItem()">
                                    新增
                                </el-button>
                                <el-button type="danger" size="small" :disabled="itemList.length === 0" @click="removeItems()">
                                    批量删除
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="table1" header-row-class-name="tableHead" :data="itemList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange" @row-dblclick="updateItem">
                        <el-table-column type="selection" width="34" />
                        <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                        <el-table-column prop="id" width="120" :show-overflow-tooltip="true" label="工厂" />
                        <el-table-column prop="deptName" width="120" :show-overflow-tooltip="true" label="车间" />
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
                        <el-table-column prop="materialUse" width="84" label="发料/入库" />
                        <el-table-column width="84" label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" @click="updateItem(scope.row)">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row v-if="itemList.length !== 0">
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="isAdvanceSearchDailogShow">
            <el-form :model="form" size="small" label-width="110px" class="locationdialog">
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
                <el-button @click="isAdvanceSearchDailogShow = false">
                    取消
                </el-button>
                <el-button type="primary" @click="getItemList(true)">
                    确定
                </el-button>
            </span>
        </el-dialog>
        <location-add v-if="isAddOrUpdateDailogShow" ref="locationAdd" :work-shop="workShop" :material-list="materialList" @refreshDataList="getItemList()" />
    </el-col>
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
                isAdvanceSearchDailogShow: false,
                isAddOrUpdateDailogShow: false,
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
        computed: {},
        mounted() {
            this.getItemList();
            this.Getdeptbyid();
            this.getMaterial();
        },
        methods: {
            // 获取库位列表
            getItemList(st) {
                if (st) {
                    this.currPage = 1;
                }
                if (this.currentQueryStatus === 0) {
                    COMMON_API.STORAGE_QUERY_API({
                        factory: '0FBAFB40ECA8AD58FF',
                        deptId: this.form.deptId,
                        deptName: this.form.deptName,
                        materialType: this.form.materialTypeCode,
                        storageLocation: this.form.storageLocation,
                        size: this.pageSize,
                        current: this.currPage
                    }).then(({ data }) => {
                        this.isAddOrUpdateDailogShow = false;
                        this.isAdvanceSearchDailogShow = false;
                        this.currentQueryStatus = 0;
                        if (data.code === 200) {
                            this.multipleSelection = [];
                            this.itemList = data.data.records;
                            this.currPage = data.data.current;
                            this.pageSize = data.data.size;
                            this.totalCount = data.data.total;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    this.getVagueItemList();
                }
            },
            //模糊查询
            getVagueItemList(st) {
                if (st) {
                    this.currPage = 1;
                }
                COMMON_API.STORAGE_VAGUEQUERY_API({
                    factory: '0FBAFB40ECA8AD58FF',
                    deptId: this.form.deptId,
                    deptName: this.form.deptName,
                    materialType: this.form.materialTypeCode,
                    storageLocation: this.form.storageLocation,
                    size: this.pageSize,
                    current: this.currPage
                }).then(({ data }) => {
                    this.isAddOrUpdateDailogShow = false;
                    this.isAdvanceSearchDailogShow = false;
                    this.currentQueryStatus = 1;
                    if (data.code === 200) {
                        this.multipleSelection = [];
                        this.itemList = data.data.records;
                        this.currPage = data.data.current;
                        this.pageSize = data.data.size;
                        this.totalCount = data.data.total;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
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
                        if (data.code === 200) {
                            this.$successToast('删除成功!');
                            this.multipleSelection = [];
                            this.$nextTick(() => {
                                alert(this.currentQueryStatus);
                            });
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
                });
            },
            // 新增库位
            addItem() {
                this.isAddOrUpdateDailogShow = true;
                this.$nextTick(() => {
                    this.$refs.locationAdd.init();
                });
            },
            // 修改库位
            updateItem(row) {
                this.isAddOrUpdateDailogShow = true;
                this.$nextTick(() => {
                    this.$refs.locationAdd.init(row);
                });
            },
            //获取车间
            Getdeptbyid() {
                COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: '0FBAFB40ECA8AD58FF',
                    deptType: 'workshop'
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.workShop = data.data;
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            },
            // 获取物料
            getMaterial() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_MATERIAL_TYPE'
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.materialList = data.data;
                    } else {
                        this.$errorTost(data.msg);
                    }
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
