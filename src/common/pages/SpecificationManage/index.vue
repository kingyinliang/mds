<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="searchForm" size="small" label-width="68px" class="topforms2" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="searchForm.materialCode" placeholder="物料" suffix-icon="el-icon-search" />
                            </el-form-item>
                            <el-form-item>
                                <el-button v-if="isAuth('sys:spec:listSpec')" type="primary" size="small" @click="getItemsList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('sys:spec:listSpec')" type="primary" size="small" @click="isAdvanceSearchDailogShow = true">
                                    高级查询
                                </el-button>
                                <el-button v-if="isAuth('sys:spec:saveSpec')" type="primary" size="small" @click="addOrupdateItem()">
                                    新增
                                </el-button>
                                <el-button v-if="isAuth('sys:spec:delSpec')" type="danger" size="small" @click="removeItems()">
                                    批量删除
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="table1" class="orderTable" border header-row-class-name="tableHead" :data="specificationList" tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="34" />
                        <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                        <el-table-column label="物料" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode }} {{ scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="brand" label="品牌" width="80" :show-overflow-tooltip="true" />
                        <el-table-column label="大类" width="80" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ largeClassObject[scope.row.largeClass] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="boxSpec" width="70" label="箱规格" :show-overflow-tooltip="true" />
                        <el-table-column label="单位" width="70" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ unitClassObject[scope.row.boxSpecUnit] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="bottleSpec" width="70" label="瓶规格" :show-overflow-tooltip="true" />
                        <el-table-column label="单位" width="70" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ unitClassObject[scope.row.bottleSpecUnit] }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="changer" label="维护人" width="120" :show-overflow-tooltip="true" />
                        <el-table-column width="60" label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:spec:updateSpec')" style="padding: 0;" type="text" @click="addOrupdateItem(scope.row)">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row v-if="specificationList.length!==0">
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <specification-add-or-update v-if="isAddOrUpdateDailogShow" ref="SpecificationAddOrUpdate" :large-class="largeClass" :unit-class="unitClass" :serch-spec-list="serchSpecList" @refreshDataList="getItemsList" />
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="isAdvanceSearchDailogShow">
            <div class="formdata">
                <el-form :model="searchForm" size="small" label-width="110px" class="orderdialog">
                    <el-form-item label="物料：">
                        <el-input v-model="searchForm.materialCode" placeholder="手工录入" clearable />
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <el-input v-model="searchForm.brand" placeholder="手工录入" clearable />
                    </el-form-item>
                    <el-form-item label="箱规格：">
                        <el-input v-model="searchForm.boxSpec" placeholder="手工录入" clearable />
                    </el-form-item>
                    <el-form-item label="瓶规格：">
                        <el-input v-model="searchForm.productSpec" placeholder="手工录入" clearable />
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isAdvanceSearchDailogShow = false">
                    取消
                </el-button>
                <el-button type="primary" @click="getItemsList(true)">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </el-col>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    import SpecificationAddOrUpdate from './SpecificationAddOrUpdate';
    export default {
        name: 'SpecificationManage',
        components: {
            SpecificationAddOrUpdate
        },
        data() {
            return {
                serchSpecList: [], // 物料缓存
                serchSpecListObject: {},
                unitClass: [], // 单位缓存
                unitClassObject: {},
                largeClass: [], // 大类缓存
                largeClassObject: {},
                specificationList: [],
                multipleSelection: [],
                isAddOrUpdateDailogShow: false,
                isAdvanceSearchDailogShow: false,
                searchForm: {
                    brand: '',
                    materialCode: '',
                    boxSpec: '',
                    productSpec: ''
                },
                currPage: 1,
                pageSize: 10,
                totalCount: 1
            };
        },
        computed: {},
        mounted() {
            this.getItemsList();
            this.getLargeClass();
            this.getUnit();
            this.getMaterial();
        },
        methods: {
            // isAuth() {
            //     return true
            // },
            getItemsList(haveParas) {
                if (haveParas) {
                    this.currPage = 1;
                }
                COMMON_API.SPECS_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    boxSpec: this.searchForm.boxSpec.trim(),
                    bottleSpec: this.searchForm.productSpec.trim(),
                    brand: this.searchForm.brand.trim(),
                    material: this.searchForm.materialCode.trim(),
                    current: JSON.stringify(this.currPage),
                    size: JSON.stringify(this.pageSize)
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.specificationList = data.data.records;
                        this.currPage = data.data.current;
                        this.pageSize = data.data.size;
                        this.totalCount = data.data.total;
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.isAddOrUpdateDailogShow = false;
                    this.isAdvanceSearchDailogShow = false;
                });
            },
            // 新增  修改
            addOrupdateItem(data) {
                this.isAddOrUpdateDailogShow = true;
                this.$nextTick(() => {
                    this.$refs.SpecificationAddOrUpdate.init(data);
                });
            },
            // 删除
            removeItems() {
                if (this.multipleSelection.length === 0) {
                    this.$warningTost('请选择要删除的规格');
                } else {
                    this.$confirm('确认删除规格, 是否继续?', '删除规格', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            COMMON_API.SPECS_REMOVE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                ids: this.multipleSelection
                            }).then(({ data }) => {
                                if (data.code === 200) {
                                    this.$successToast('删除成功!');
                                    this.multipleSelection = [];
                                    this.$nextTick(() => {
                                        this.getItemsList();
                                    });
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            });
                        })
                        .catch();
                }
            },
            // 表格选中
            handleSelectionChange(val) {
                this.multipleSelection = [];
                val.forEach((item) => {
                    this.multipleSelection.push(item.id);
                });
            },
            // 物料下拉
            getMaterial() {
                // if (this.serchSpecList.length === 0) {
                    COMMON_API.ALLMATERIAL_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        }).then(({ data }) => {
                            if (data.code === 200) {
                                this.serchSpecList = data.data;
                            } else {
                                this.$errorTost(data.msg);
                            }
                        });
                // }
            },
            // 大类下拉
            getLargeClass() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_CATEGORY'
                    }).then(({ data }) => {
                        if (data.code === 200) {
                            this.largeClass = data.data;
                            this.largeClass.forEach(item => {
                                this.largeClassObject[item.dictCode] = item.dictValue
                            })
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
            },
            // 单位下拉
            getUnit() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_SPEC_UNIT'
                    }).then(({ data }) => {
                        if (data.code === 200) {
                            this.unitClass = data.data;
                            this.unitClass.forEach(item => {
                            this.unitClassObject[item.dictCode] = item.dictValue
                            })
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
            },
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getItemsList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.currPage = val;
                this.getItemsList();
            }
        }
    };
</script>

<style scoped></style>
