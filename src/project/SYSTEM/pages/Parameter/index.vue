<template>
    <el-col>
        <div class="main main-header">
            <el-card>
                <el-row style="margin-bottom: 10px;">
                    <el-select v-model="factory" clearable placeholder="请选择">
                        <el-option v-for="sole in factoryList" :key="sole.id" :label="sole.deptName" :value="sole.id" />
                    </el-select>
                    <el-input v-model="searchString" placeholder="请输入" suffix-icon="el-icon-search" clearable style="width: 200px; margin: 0 10px;" @clear="getItemsList()" />
                    <el-button type="primary" :disabled="searchString.trim()==='' && factory===''" @click="getItemsList">
                        查询
                    </el-button>
                </el-row>
                <el-row type="flex" :gutter="10">
                    <el-col :span="8" style="min-width: 400px;">
                        <el-card>
                            <div slot="header" class="clearfix">
                                <div slot="header" class="clearfix">
                                    <span style="float: left; line-height: 40px;">参数类型</span>
                                    <el-button type="text" icon="el-icon-plus" style="display: inline-block; float: right; padding: 12px;" @click="addOrUpdateItem('type')" />
                                </div>
                            </div>
                            <div>
                                <el-table header-row-class-name="tableHead" :data="targetInfoList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @row-click="getTypeDetail">
                                    <el-table-column type="index" width="50" label="序号" />
                                    <el-table-column :show-overflow-tooltip="true" label="工厂" prop="factory" />
                                    <el-table-column prop="dictType" :show-overflow-tooltip="true" label="参数类型编码" width="110" />
                                    <el-table-column prop="dictName" :show-overflow-tooltip="true" label="参数类型名称" width="110" />
                                </el-table>
                                <el-pagination v-if="targetInfoList.length!==0" :current-page="currPageFromMainTable" :page-sizes="[10, 20, 50]" :page-size="pageSizeFromMainTable" layout="total, prev, pager, next, jumper" :total="totalCountFromMainTable" @size-change="handlePageSizeChangeFromMain" @current-change="handleCurrentPageChangeFromMain" />
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="16">
                        <el-card>
                            <div slot="header" class="clearfix">
                                <span style="float: left; line-height: 40px;">参数</span>
                                <el-button v-if="targetParameterList.length!==0" type="text" icon="el-icon-plus" style="display: inline-block; float: right; padding: 12px;" @click="addOrUpdateItem('param',tempTargetRow)" />
                            </div>
                            <div>
                                <el-table ref="table1" header-row-class-name="tableHead" :data="targetParameterList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                                    <el-table-column type="index" width="50" label="序号" />
                                    <el-table-column prop="factory" :show-overflow-tooltip="true" label="工厂" width="100" />
                                    <el-table-column prop="dictType" :show-overflow-tooltip="true" label="参数类型编码" />
                                    <el-table-column prop="dictName" :show-overflow-tooltip="true" label="参数类型名称" />
                                    <el-table-column prop="dictCode" :show-overflow-tooltip="true" label="参数编码" />
                                    <el-table-column prop="dictValue" :show-overflow-tooltip="true" label="参数名称" />
                                    <el-table-column width="96" label="操作">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="removeItems(scope.row)">
                                                删除
                                            </el-button>
                                            <el-button type="text" @click="addOrUpdateItem('param', tempTargetRow, scope.row)">
                                                编辑
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <el-pagination v-if="targetParameterList.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalCount" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" />
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <parameter-add-or-update v-if="isDialogShow" ref="addOrUpdateItem" :factory-list="factoryList" @refreshDataList="getItemsList" />
    </el-col>
</template>

<script>
import ParameterAddOrUpdate from './ParameterAddorUpdate';
import { COMMON_API } from 'common/api/api';
export default {
    name: 'ParameterManage',
    components: {
        ParameterAddOrUpdate
    },
    data() {
        return {
            isDialogShow: false,
            activeItem: {},
            targetInfoList: [],
            targetParameterList: [],
            adds: {},
            factoryList: [],
            factory: '',
            searchString: '',
            totalCountFromMainTable: 1,
            currPageFromMainTable: 1,
            pageSizeFromMainTable: 10,
            totalCount: 1,
            currPage: 1,
            pageSize: 10,
            tempTargetRow: {}
        };
    },
    computed: {},
    mounted() {
        this.getItemsList();
        this.getFactoryList();
    },
    methods: {
        // 获取类型
        getItemsList() {
            COMMON_API.DICTIONARY_QUERY_API({
                // factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                factory: this.factory,
                typeOrName: this.searchString,
                current: this.currPageFromMainTable,
                size: this.pageSizeFromMainTable
            }).then(({ data }) => {
                console.log(data)
                this.targetParameterList = [];
                this.targetInfoList = data.data.records;
                this.totalCountFromMainTable = data.data.total;
                this.currPageFromMainTable = data.data.current;
                this.pageSizeFromMainTable = data.data.size;

            });
        },
        // 表格删除
        removeItems(row) {
            this.$confirm('确认删除参数, 是否继续?', '删除参数', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row)
                COMMON_API.DICTIONARY_ITEM_DELETE_API({
                    factory: this.tempTargetRow.factory,
                    ids: [row.id]
                }).then(() => {
                    this.$successToast('删除成功!');
                    this.getTypeDetail();
                });
            }).catch(() => {
                // this.$infoTost('已取消删除');
            });
        },
        //  设置类型參數
        getTypeDetail(row) {
            if (row) {
                this.tempTargetRow = {};
                this.tempTargetRow = row;
            }
            COMMON_API.DICTIONARY_ITEM_QUERY_API({
                factory: this.tempTargetRow.factory,
                dictId: this.tempTargetRow.id,
                size: this.pageSize,
                current: this.currPage
            }).then(({ data }) => {
                this.targetParameterList = data.data.records;
                this.targetParameterList.forEach(item => {
                    item.factory = this.tempTargetRow.factory;
                    item.dictType = this.tempTargetRow.dictType;
                    item.dictName = this.tempTargetRow.dictName;
                })
                this.totalCount = data.data.total;
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
            });
        },
        // 新增  修改
        addOrUpdateItem(parasLevel, parentItem = {}, targetItem = {}) {
            this.isDialogShow = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdateItem.init(parasLevel, parentItem, targetItem);
            });
        },
        // 获取工厂
        getFactoryList() {
            COMMON_API.ORG_QUERY_WORKSHOP_API({ deptType: ['factory'] }).then(({ data }) => {
                if (data.code === 200) {
                    this.factoryList = data.data;
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 改变每页条数
        handlePageSizeChangeFromMain(val) {
            this.pageSizeFromMainTable = val;
            this.getItemsList();
        },
        // 跳转页数
        handleCurrentPageChangeFromMain(val) {
            this.currPageFromMainTable = val;
            this.getItemsList();
        },
        // 改变每页条数
        handlePageSizeChange(val) {
            this.pageSize = val;
            this.getTypeDetail();
        },
        // 跳转页数
        handleCurrentPageChange(val) {
            this.currPage = val;
            this.getTypeDetail();
        }

    }
};
</script>

<style lang="scss">
.el-card__header {
    padding: 13px 15px;
}
.main-header .el-card__header {
    padding: 0 15px !important;
}
</style>
<style scoped>
.el-button[type="text"] {
    padding: 0;
}
</style>
