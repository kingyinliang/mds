<template>
    <el-col>
        <div class="main main-header">
            <el-card>
                <el-row style="margin-bottom: 10px;">
                    <el-select v-model="factoryForSearch" clearable placeholder="请选择" style="width: 300px;">
                        <el-option v-for="sole in factoryList" :key="sole.id" :label="sole.deptName" :value="sole.id" />
                    </el-select>
                    <el-input v-model="stringForSearch" placeholder="请输入" suffix-icon="el-icon-search" clearable style="width: 200px; margin: 0 10px;" @clear="getParentItemsList(true)" @blur="factoryForSearch===''&&stringForSearch===''? getParentItemsList(true):false" />
                    <el-button type="primary" :disabled="stringForSearch.trim()==='' && factoryForSearch===''" @click="getParentItemsList(true)">
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
                                <el-table ref="targetInfoList" header-row-class-name="tableHead" row-key="index" :data="targetInfoList" highlight-current-row border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @row-click="getChildItemList">
                                    <el-table-column type="index" width="50" label="序号" />
                                    <el-table-column :show-overflow-tooltip="true" label="工厂" prop="factoryName" />
                                    <el-table-column prop="dictType" :show-overflow-tooltip="true" label="参数类型编码" width="110" />
                                    <el-table-column prop="dictName" :show-overflow-tooltip="true" label="参数类型名称" width="110" />
                                    <el-table-column width="96" label="操作" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="removeItems(scope.row)">
                                                删除
                                            </el-button>
                                            <el-button type="text" @click="addOrUpdateItem('type', scope.row)">
                                                编辑
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination v-if="targetInfoList.length!==0" :current-page="currPageFromParent" :page-sizes="[10, 20, 50]" :page-size="pageSizeFromParent" layout="total, prev, pager, next, jumper" :total="totalCountFromParent" @size-change="handlePageSizeChangeFromMain" @current-change="handleCurrentPageChangeFromMain" />
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="16">
                        <el-card>
                            <div slot="header" class="clearfix">
                                <span style="float: left; line-height: 40px;">参数</span>
                                <el-button v-if="isFocusChild" type="text" icon="el-icon-plus" style="display: inline-block; float: right; padding: 12px;" @click="addOrUpdateItem('param',tempParentRow)" />
                            </div>
                            <div>
                                <el-table ref="targetParameterList" header-row-class-name="tableHead" :data="targetParameterList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                                    <el-table-column type="index" width="50" label="序号" />
                                    <el-table-column prop="factoryName" :show-overflow-tooltip="true" label="工厂" width="100" />
                                    <el-table-column prop="dictType" :show-overflow-tooltip="true" label="参数类型编码">
                                        <template>
                                            {{ tempParentRow.dictType }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="dictName" :show-overflow-tooltip="true" label="参数类型名称">
                                        <template>
                                            {{ tempParentRow.dictName }}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="dictCode" :show-overflow-tooltip="true" label="参数编码" />
                                    <el-table-column prop="dictValue" :show-overflow-tooltip="true" label="参数名称" />
                                    <el-table-column v-if="targetParameterList.length!==0" width="96" label="操作" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="removeItems(scope.row)">
                                                删除
                                            </el-button>
                                            <el-button type="text" @click="addOrUpdateItem('param', tempParentRow, scope.row)">
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
        <parameter-add-or-update v-if="isDialogShow" ref="addOrUpdateItem" :factory-list="factoryList" @refreshParentDataList="getreParentItemsList" @refreshChildDataList="getreChildItemList(arguments)" />
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
            targetInfoList: [],
            targetParameterList: [],
            factoryList: [],
            factory: '',
            stringForSearch: '',
            factoryForSearch: '',
            totalCountFromParent: 1,
            currPageFromParent: 1,
            pageSizeFromParent: 10,
            totalCount: 1,
            currPage: 1,
            pageSize: 10,
            tempParentRow: {},
            preDaraArray: {},
            isFocusParent: true,
            isFocusChild: false,
            currentFocusChildRow: ''
        };
    },
    computed: {},
    mounted() {
        this.getParentItemsList(true);
        this.getFactoryList();
    },
    methods: {
        // 获取类型
        getParentItemsList(haveParas) {
            if (haveParas) {
                this.currPageFromParent = 1;
            }
            const parasObj = {
                factory: this.factoryForSearch,
                typeOrName: this.stringForSearch,
                current: this.currPageFromParent,
                size: this.pageSizeFromParent
            }
            COMMON_API.DICTIONARY_QUERY_API(parasObj).then(({ data }) => {
                this.isFocusChild = false; // 判断左右边 focus
                this.targetInfoList = data.data.records; // parent table data
                this.targetParameterList = []; // child table data
                // this.preDaraArray = parasObj;
                this.totalCountFromParent = data.data.total;
                this.currPageFromParent = data.data.current;
                this.pageSizeFromParent = data.data.size;

            });
        },
        // 获取类型
        getreParentItemsList() {
            this.currPageFromParent = 1;
            const parasObj = {
                factory: '',
                typeOrName: this.stringForSearch,
                current: this.currPageFromParent,
                size: this.pageSizeFromParent
            }
            COMMON_API.DICTIONARY_QUERY_API(parasObj).then(({ data }) => {
                this.isFocusChild = false; // 判断左右边 focus
                this.targetInfoList = data.data.records; // parent table data
                this.targetParameterList = []; // child table data
                // this.preDaraArray = parasObj;
                this.totalCountFromParent = data.data.total;
                this.currPageFromParent = data.data.current;
                this.pageSizeFromParent = data.data.size;
            });

        },
        // 参数类型删除
        removeItems(row) {
            console.log('删除')
            console.log(row)
            if (!row.dictId) { // 删除参数类型
                this.$confirm('确认删除参数类型, 是否继续?', '删除参数类型', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    COMMON_API.DICTIONARY_DELETE_API({
                        factory: this.factory,
                        ids: [row.id]
                    }).then(() => {
                        this.getParentItemsList(true);
                    });

                }).catch(() => {
                    // this.$infoTost('已取消删除');
                });
            } else {
                this.$confirm('确认删除参数, 是否继续?', '删除参数', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    COMMON_API.DICTIONARY_ITEM_DELETE_API({
                        factory: this.factory,
                        ids: [row.id]
                    }).then(() => {
                        this.getreChildItemList(); //需确认
                    });

                }).catch(() => {
                    // this.$infoTost('已取消删除');
                });
            }


        },
        //  设置类型參數
        getChildItemList(row, col) {
            if (row) {
                this.currPage = 1;
            }
            if (col.label !== '操作') { //  操作栏位点击无用
                if (this.currentFocusChildRow !== row.id) { // 避免同 row 重复点击
                    if (row) {
                        this.tempParentRow = {};
                        this.tempParentRow = row;
                    }
                    this.factoryList.forEach(item => {
                        if (item.deptName === row.factoryName) {
                            this.factory = item.id
                        }
                    })
                    COMMON_API.DICTIONARY_ITEM_QUERY_API({
                        factory: this.tempParentRow.factory,
                        dictId: this.tempParentRow.id,
                        size: this.pageSize,
                        current: this.currPage
                    }).then(({ data }) => {
                        this.isFocusChild = true;
                        this.currentFocusChildRow = row.id;
                        console.log('我是清单回传值')
                        if (data.data.records.length !== 0) {
                            this.targetParameterList = data.data.records;
                        } else {
                            this.targetParameterList = [];
                        }
                        this.totalCount = data.data.total;
                        this.currPage = data.data.current;
                        this.pageSize = data.data.size;
                    });
                }
            }


        },
        getreChildItemList() {
            this.currPage = 1;
            this.currentFocusChildRow = ''
            COMMON_API.DICTIONARY_ITEM_QUERY_API({
                factory: this.tempParentRow.factory,
                dictId: this.tempParentRow.id,
                size: this.pageSize,
                current: this.currPage
            }).then(({ data }) => {
                this.isFocusChild = true;
                if (data.data.records.length !== 0) {
                    this.targetParameterList = data.data.records;
                } else {
                    this.targetParameterList = [];
                }
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
                this.factoryList = data.data;
                this.factoryList.push({
                    deptCode: 'common',
                    deptName: '共用字段',
                    deptShort: '共用字段',
                    deptType: 'FACTORY',
                    id: 'common'
                })
            });
        },
        // 改变每页条数
        handlePageSizeChangeFromMain(val) {
            this.pageSizeFromParent = val;
            this.getParentItemsList();
        },
        // 跳转页数
        handleCurrentPageChangeFromMain(val) {
            this.currPageFromParent = val;
            this.getParentItemsList();
        },
        // 改变每页条数
        handlePageSizeChange(val) {
            this.pageSize = val;
            this.getChildItemList();
        },
        // 跳转页数
        handleCurrentPageChange(val) {
            this.currPage = val;
            this.getChildItemList();
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
