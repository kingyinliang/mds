<template>
    <div class="header_main">
        <mds-card :title="title" :name="'org'" :pack-up="false" style="background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card">
                        <h4 class="org-card_title">
                            <span>参数类型</span>
                            <el-button type="text" icon="el-icon-plus" style="margin-right: 10px; color: #fff; font-weight: 800;" @click="addOrUpdateItem('type')" />
                        </h4>
                        <div class="search-bar">
                            <el-select v-model="factoryForSearch" size="small" clearable placeholder="请选择" @clear="stringForSearch===''?getParentItemsList(true):false">
                                <el-option v-for="sole in factoryList" :key="sole.id" :label="sole.deptName" :value="sole.id" />
                            </el-select>
                            <el-input v-model="stringForSearch" size="small" placeholder="请输入" suffix-icon="el-icon-search" clearable @clear="getParentItemsList(true)" @blur="factoryForSearch===''&&stringForSearch===''? getParentItemsList(true):false" />
                            <el-button type="primary" size="small" :disabled="stringForSearch.trim()==='' && factoryForSearch===''" @click="getParentItemsList(true)">
                                查询
                            </el-button>
                        </div>
                        <div style="padding: 10px;">
                            <el-table
                                ref="targetInfoList"
                                header-row-class-name="tableHead"
                                row-key="index"
                                :data="targetInfoList"
                                :height="mainClientHeight - 62 - 94 - 20 - 47"
                                highlight-current-row
                                border
                                tooltip-effect="dark"
                                class="newTable"
                                size="small"
                                @row-click="getChildItemList"
                            >
                                <el-table-column type="index" width="50" label="序号" fixed />
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
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card">
                        <h4 class="org-card_title">
                            <span>参数</span>
                        </h4>
                        <h5>
                            <span><i class="title-icon" style="background: #487bff;" />详细参数</span>
                            <el-button v-if="isFocusChild" size="small" type="primary" @click="addOrUpdateItem('param',tempParentRow)">
                                新增
                            </el-button>
                        </h5>
                        <div style="padding: 10px;">
                            <el-table ref="targetParameterList" header-row-class-name="tableHead" :data="targetParameterList" :height="mainClientHeight - 62 - 94 - 20 - 47" border tooltip-effect="dark" class="newTable" size="small">
                                <el-table-column type="index" width="50" label="序号" fixed />
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
                            <el-pagination v-if="targetParameterList.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalCount" @size-change="handlePageSizeChange" @current-change="handleCurrentPageChange" />
                        </div>
                    </div>
                </el-col>
            </el-row>
        </mds-card>
        <parameter-add-or-update v-if="isDialogShow" ref="addOrUpdateItem" :factory-list="factoryList" @refreshParentDataList="getreParentItemsList" @refreshChildDataList="getreChildItemList(arguments)" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ParameterAddOrUpdate from './ParameterAddorUpdate.vue';
import { COMMON_API } from 'common/api/api';

@Component({
    name: 'ParameterManage',
    components: {
        ParameterAddOrUpdate
    }
})


export default class Index extends Vue {
    get mainClientHeight() {
        return this.$store.state.common.mainClientHeight;
    }

    title='数据字典'

    isDialogShow= false
    targetInfoList: object[] = []
    targetParameterList: object[] = []
    factoryList: object[] = []
    factory? = ''
    stringForSearch = ''
    factoryForSearch =''
    totalCountFromParent = 1
    currPageFromParent = 1
    pageSizeFromParent = 10
    totalCount = 1
    currPage = 1
    pageSize = 10
    tempParentRow: TempParentRowObject = {}
    preDaraArray = {}
    isFocusParent = true
    isFocusChild = false
    currentFocusChildRow = ''
    $refs: {addOrUpdateItem: HTMLFormElement}

    mounted() {
        this.getParentItemsList(true);
        this.getFactoryList();
    }

    // 获取类型
    getParentItemsList(haveParas: boolean): void {
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
    }

    // 获取类型
    getreParentItemsList(): void {
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

    }

    // 参数类型删除
    removeItems(row): void {
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


    }

    //  设置类型參數
    getChildItemListFromChange(): void {

                COMMON_API.DICTIONARY_ITEM_QUERY_API({
                    // factory: this.tempParentRow.factory,
                    dictId: this.tempParentRow.id,
                    size: this.pageSize,
                    current: this.currPage
                }).then(({ data }) => {
                    this.isFocusChild = true;
                    // this.currentFocusChildRow = row.id;
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

    getChildItemList(row, col): void {
        if (row) {
            this.currPage = 1;
        }
        if (col.label !== '操作') { //  操作栏位点击无用
            if (this.currentFocusChildRow !== row.id) { // 避免同 row 重复点击
                if (row) {
                    this.tempParentRow = {};
                    this.tempParentRow = row;
                }
                this.factoryList.forEach((item: FactoryListObject) => {
                    if (item.deptName === row.factoryName) {
                        this.factory = item.id
                    }
                })
                COMMON_API.DICTIONARY_ITEM_QUERY_API({
                    // factory: this.tempParentRow.factory,
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
    }

    getreChildItemList(): void {
        this.currPage = 1;
        this.currentFocusChildRow = ''
        COMMON_API.DICTIONARY_ITEM_QUERY_API({
            // factory: this.tempParentRow.factory,
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
    }

    // 新增  修改
    addOrUpdateItem(parasLevel, parentItem = {}, targetItem = {}): void {
        this.isDialogShow = true;
        this.$nextTick(() => {
            this.$refs.addOrUpdateItem.init(parasLevel, parentItem, targetItem);
        });
    }

    // 获取工厂
    getFactoryList(): void {
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
    }

    // 改变每页条数
    handlePageSizeChangeFromMain(val: number): void {
        this.pageSizeFromParent = val;
        this.getParentItemsList(false);
    }

    // 跳转页数
    handleCurrentPageChangeFromMain(val: number): void {
        this.currPageFromParent = val;
        this.getParentItemsList(false);
    }

    // 改变每页条数
    handlePageSizeChange(val: number): void {
        this.pageSize = val;
        this.getChildItemListFromChange();
    }

    // 跳转页数
    handleCurrentPageChange(val: number): void {
        this.currPage = val;
        this.getChildItemListFromChange();
    }
}

interface TempParentRowObject {
    dictName?: string;
    dictType?: string;
    factoryName?: string;
    id?: string;
}


interface FactoryListObject {
    deptCode?: string;
    deptName?: string;
    deptShort?: string;
    deptType?: string;
    id?: string;
}
</script>

<style scoped lang="scss">
    .org-card {
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(232, 232, 232, 1);
        border-radius: 4px;
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.09);

        ::v-deep .el-tree-node__expand-icon { /* stylelint-disable-line */
            color: #487bff;
        }

        .org-card_title {
            display: inline-flex;
            flex-direction: row;
            justify-content: space-between;
            height: 40px;
            padding-left: 10px;
            color: white;
            line-height: 40px;
            background: rgba(72, 123, 255, 1);
        }
        .search-bar {
            display: inline-grid;
            grid-column-gap: 10px;
            grid-template-columns: 1fr 1fr 64px;
            padding: 10px;
        }
        h5 {
            position: relative;
            display: inline-flex;
            flex-direction: row;
            justify-content: space-between;
            margin: 10px;
            padding-left: 10px;
            font-weight: bold;
            font-size: 14px !important;
            line-height: 32px;
            &::before {
                position: absolute;
                top: 34%;
                left: 2px;
                width: 4px;
                height: 12px;
                background: #487bff;
                border-radius: 2px;
                content: "";
            }
        }
        .filter-input {
            padding: 6px 10px;
        }

        .tree-main {
            flex: 1;
            overflow-y: scroll;
        }
        .detail-main {
            padding: 16px 10px 0 10px;
        }
    }
</style>
