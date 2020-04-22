<template>
    <el-col>
        <div class="main">
            <el-card>
                <div class="clearfix">
                    <el-row style="float: right;">
                        <el-form :inline="true" :model="form" size="small" label-width="68px" class="topforms2" @keyup.enter.native="getList(true)" @submit.native.prevent>
                            <el-form-item>
                                <el-input v-model="form.materialCode" placeholder="物料" suffix-icon="el-icon-search" />
                            </el-form-item>
                            <el-form-item>
                                <el-button v-if="isAuth('sys:spec:listSpec')" type="primary" size="small" @click="getList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('sys:spec:listSpec')" type="primary" size="small" @click="visible1 = true">
                                    高级查询
                                </el-button>
                                <el-button v-if="isAuth('sys:spec:saveSpec')" type="primary" size="small" @click="addOrupdate()">
                                    新增
                                </el-button>
                                <el-button v-if="isAuth('sys:spec:delSpec')" type="danger" size="small" @click="remove()">
                                    批量删除
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </div>
                <el-row>
                    <el-table ref="table1" class="orderTable" border header-row-class-name="tableHead" :data="SpecificationList" tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="34" />
                        <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                        <el-table-column width="230" label="工厂" :show-overflow-tooltip="true" prop="factoryName" />
                        <el-table-column label="物料" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode }} {{ scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="brand" label="品牌" width="80" :show-overflow-tooltip="true" />
                        <el-table-column prop="largeClassName" label="大类" width="80" :show-overflow-tooltip="true" />
                        <el-table-column prop="boxSpec" width="70" label="箱规格" :show-overflow-tooltip="true" />
                        <el-table-column prop="boxSpecUnitName" label="单位" width="70" :show-overflow-tooltip="true" />
                        <el-table-column prop="productSpec" width="70" label="瓶规格" :show-overflow-tooltip="true" />
                        <el-table-column prop="productSpecUnitName" label="单位" width="70" :show-overflow-tooltip="true" />
                        <el-table-column prop="changer" label="维护人" width="120" :show-overflow-tooltip="true" />
                        <el-table-column width="60" label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:spec:updateSpec')" style="padding: 0;" type="text" @click="addOrupdate(scope.row)">
                                    编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <specification-add-or-update v-if="visible" ref="SpecificationAddOrUpdate" :serch-sap-list="SerchSapList" @refreshDataList="getList" />
        <el-dialog title="高级查询" :close-on-click-modal="false" :visible.sync="visible1">
            <div class="formdata">
                <el-form :model="form" size="small" label-width="110px" class="orderdialog" @keyup.enter.native="getList(true)">
                    <el-form-item label="工厂：">
                        <el-select v-model="form.factory">
                            <el-option label="" value="">
                                请选择
                            </el-option>
                            <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物料：">
                        <el-input v-model="form.materialCode" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <el-input v-model="form.brand" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="箱规格：">
                        <el-input v-model="form.boxSpec" placeholder="手工录入" />
                    </el-form-item>
                    <el-form-item label="瓶规格：">
                        <el-input v-model="form.productSpec" placeholder="手工录入" />
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible1 = false">取消</el-button>
                <el-button type="primary" @click="getList(true)">确定</el-button>
            </span>
        </el-dialog>
    </el-col>
</template>

<script>
    import { BASICDATA_API } from '@/api/api';
    import SpecificationAddOrUpdate from './SpecificationAddOrUpdate';
    export default {
        name: 'SpecificationManage',
        components: {
            SpecificationAddOrUpdate
        },
        data() {
            return {
                lodingS: false,
                SerchSapList: [],
                SpecificationList: [],
                multipleSelection: [],
                factory: [],
                visible: false,
                visible1: false,
                form: {
                    factory: '',
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
            this.Getdeptcode();
            this.getList();
            // 物料下拉
            this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', { params: '' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.SerchSapList = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        methods: {
            // 获取工厂
            Getdeptcode() {
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.factory = data.typeList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            getList(st) {
                this.lodingS = true;
                if (st) {
                    this.currPage = 1;
                }
                this.$http(`${BASICDATA_API.SPECLIST_API}`, 'POST', {
                    factory: this.form.factory,
                    brand: this.form.brand,
                    materialCode: this.form.materialCode,
                    boxSpec: this.form.boxSpec,
                    productSpec: this.form.productSpec,
                    currPage: JSON.stringify(this.currPage),
                    pageSize: JSON.stringify(this.pageSize)
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.SpecificationList = data.page.list;
                        this.currPage = data.page.currPage;
                        this.pageSize = data.page.pageSize;
                        this.totalCount = data.page.totalCount;
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.visible = false;
                    this.lodingS = false;
                    this.visible1 = false;
                });
            },
            // 新增  修改
            addOrupdate(data) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.SpecificationAddOrUpdate.init(data);
                });
            },
            // 删除
            remove() {
                if (this.multipleSelection.length === 0) {
                    this.$warningToast('请选择要删除的规格');
                } else {
                    this.$confirm('确认删除规格, 是否继续?', '删除规格', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.$http(`${BASICDATA_API.SPECDEL_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                                if (data.code === 0) {
                                    this.$successToast('删除成功!');
                                    this.multipleSelection = [];
                                    this.$nextTick(() => {
                                        this.getList();
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
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.currPage = val;
                this.getList();
            }
        }
    };
</script>

<style scoped></style>
