<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="controllableForm" size="small" label-width="68px" class="topforms2" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="controllableForm.materialCode" placeholder="物料" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="controllableForm.materialCode===''?getItemsList():false" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" :disabled="controllableForm.materialCode.trim()===''" @click="getItemsList(true,'normal')">
                                    查询
                                </el-button>
                                <el-button type="primary" size="small" @click="isAdvanceSearchDailogShow = true">
                                    高级查询
                                </el-button>
                                <el-button type="primary" size="small" @click="addOrupdateItem()">
                                    新增
                                </el-button>
                                <el-button type="danger" size="small" :disabled="targetInfoList.length===0" @click="removeItems()">
                                    批量删除
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="targetInfoList" class="orderTable" border header-row-class-name="tableHead" :data="targetInfoList" tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                        <el-table-column v-if="targetInfoList.length!==0" type="selection" width="50" />
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
                                <el-button style="padding: 0;" type="text" @click="addOrupdateItem(scope.row)">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row v-if="targetInfoList.length!==0">
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <specification-add-or-update v-if="isAddOrUpdateDailogShow" ref="SpecificationAddOrUpdate" :large-class="largeClass" :unit-class="unitClass" :serch-spec-list="serchSpecList" @refreshDataList="getItemsList" />
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="isAdvanceSearchDailogShow" @close="closeDialog">
            <div class="formdata">
                <el-form :model="controllableForm" size="small" label-width="110px" class="orderdialog" :rules="checkRules">
                    <el-form-item label="物料：">
                        <el-input v-model="controllableForm.materialCode" placeholder="手工录入" clearable />
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <el-input v-model="controllableForm.brand" placeholder="手工录入" clearable />
                    </el-form-item>
                    <el-form-item label="箱规格：" prop="boxSpec">
                        <el-input v-model="controllableForm.boxSpec" placeholder="手工录入" oninput="value=value.replace(/\D*/g,'')" clearable />
                    </el-form-item>
                    <el-form-item label="瓶规格：" prop="productSpec">
                        <el-input v-model="controllableForm.productSpec" placeholder="手工录入" oninput="value=value.replace(/\D*/g,'')" clearable />
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDialog">
                    取消
                </el-button>
                <el-button type="primary" @click="getItemsList(true,'Advance')">
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
                targetInfoList: [],
                multipleSelection: [],
                isAddOrUpdateDailogShow: false,
                isAdvanceSearchDailogShow: false,
                controllableForm: {
                    brand: '',
                    materialCode: '',
                    boxSpec: '',
                    productSpec: ''
                },
                currPage: 1,
                pageSize: 10,
                totalCount: 1,
                checkRules: {
                    productSpec: [{ pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }
                    ],
                    boxSpec: [{ pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }
                    ]
                }
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
            closeDialog() {
                this.isAdvanceSearchDailogShow = false;
                this.controllableForm.brand = '';
                this.controllableForm.boxSpec = '';
                this.controllableForm.productSpec = '';
            },
            getItemsList(haveParas, type = 'normal') {
                if (haveParas) {
                    this.currPage = 1;
                }
                if (type === 'normal') {
                    this.controllableForm.brand = '';
                    this.controllableForm.boxSpec = '';
                    this.controllableForm.productSpec = '';
                }


                COMMON_API.SPECS_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    boxSpec: this.controllableForm.boxSpec.trim(),
                    bottleSpec: this.controllableForm.productSpec.trim(),
                    brand: this.controllableForm.brand.trim(),
                    material: this.controllableForm.materialCode.trim(),
                    current: JSON.stringify(this.currPage),
                    size: JSON.stringify(this.pageSize)
                }).then(({ data }) => {
                    if (haveParas && data.data.records.length === 0) {
                            this.$infoToast('该搜寻条件无任何资料！');
                    }
                    this.targetInfoList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
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
                            }).then(() => {
                                this.multipleSelection = [];
                                this.$nextTick(() => {
                                    this.getItemsList();
                                });
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
                            this.serchSpecList = data.data;
                        });
                // }
            },
            // 大类下拉
            getLargeClass() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_CATEGORY'
                    }).then(({ data }) => {
                        this.largeClass = data.data;
                        this.largeClass.forEach(item => {
                            this.largeClassObject[item.dictCode] = item.dictValue
                        })
                    });
            },
            // 单位下拉
            getUnit() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_SPEC_UNIT'
                    }).then(({ data }) => {
                        this.unitClass = data.data;
                        this.unitClass.forEach(item => {
                        this.unitClassObject[item.dictCode] = item.dictValue
                        })
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
