<template>
    <div class="header_main">
        <mds-card title="数据字典" :name="'org'" :pack-up="false" style="background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card">
                        <h4 class="org-card_title">
                            <span>参数类型</span>
                            <el-button v-if="isAuth('sys:dict:save')" type="text" icon="el-icon-plus" style="margin-right: 10px; color: #fff; font-weight: 800;" @click="addorupdate('type')" />
                        </h4>
                        <div class="search-bar">
                            <el-select v-model="factory" size="small" clearable placeholder="请选择">
                                <el-option label="请选择" value="" />
                                <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                            </el-select>
                            <el-input v-model="searchType" size="small" placeholder="请输入" suffix-icon="el-icon-search" />
                            <el-button type="primary" size="small" @click="getdictList">
                                查询
                            </el-button>
                        </div>
                        <div style="padding: 10px;">
                            <el-table
                                header-row-class-name="tableHead"
                                class="newTable"
                                size="small"
                                :data="parameterType"
                                row-key="index"
                                :height="mainClientHeight - 62 - 97 - 20 - 47"
                                highlight-current-row
                                border
                                tooltip-effect="dark"
                                style="width: 100%;"
                                @row-click="setTypeDetail"
                            >
                                <el-table-column type="index" width="50" label="序号" fixed />
                                <el-table-column :show-overflow-tooltip="true" label="工厂" prop="factoryName" />
                                <el-table-column prop="type" :show-overflow-tooltip="true" label="参数类型编码" width="110" />
                                <el-table-column prop="name" :show-overflow-tooltip="true" label="参数类型名称" width="110" />
                            </el-table>
                            <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
                            <el-button v-if="isAuth('sys:dict:save')" size="small" type="primary" @click="addorupdate('param', false, true)">
                                新增
                            </el-button>
                        </h5>
                        <div style="padding: 10px;">
                            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="parameter" :height="mainClientHeight - 62 - 97 - 20" border tooltip-effect="dark" style="width: 100%;">
                                <el-table-column type="index" width="50" label="序号" fixed />
                                <el-table-column :show-overflow-tooltip="true" label="工厂" prop="factoryName" width="100" />
                                <el-table-column prop="type" :show-overflow-tooltip="true" label="参数类型编码" />
                                <el-table-column prop="name" :show-overflow-tooltip="true" label="参数类型名称" />
                                <el-table-column prop="code" :show-overflow-tooltip="true" label="参数编码" />
                                <el-table-column prop="value" :show-overflow-tooltip="true" label="参数名称" />
                                <el-table-column width="96" label="操作">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('sys:dict:delete')" type="text" @click="remove(scope.row)">
                                            删除
                                        </el-button>
                                        <el-button v-if="isAuth('sys:dict:update')" type="text" @click="addorupdate('param', scope.row)">
                                            编辑
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </mds-card>
        <add-or-update v-if="visible" ref="addOrupdate" :factory-list="factoryList" @refreshDataList="getList()" />
    </div>
</template>

<script>
import addOrUpdate from './ParameterAddorUpdate';
import { SYSTEMSETUP_API, BASICDATA_API } from '@/api/api';
export default {
    name: 'ParameterManage',
    components: {
        addOrUpdate
    },
    data() {
        return {
            visible: false,
            activeItem: {},
            parameterType: [],
            parameter: [],
            adds: {},
            factoryList: [],
            factory: '',
            searchType: '',
            totalCount: 1,
            currPage: 1,
            pageSize: 10
        };
    },
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            }
        }
    },
    mounted() {
        this.getdictList();
        this.getFactoryList();
    },
    methods: {
        // 获取类型
        getdictList() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERTYPE_API}`, 'POST', {
                factory: this.factory,
                type: this.searchType,
                totalCount: String(this.totalCount),
                currPage: String(this.currPage),
                pageSize: String(this.pageSize)
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.parameterType = data.list.list;
                    this.totalCount = data.list.totalCount;
                    this.currPage = data.list.currPage;
                    this.pageSize = data.list.pageSize;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 表格删除
        remove(row) {
            this.$confirm('确认删除参数, 是否继续?', '删除参数', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${SYSTEMSETUP_API.PARAMETERDEL_API}`, 'POST', [row.id]).then(({ data }) => {
                    if (data.code === 0) {
                        this.$successToast('删除成功!');
                        this.getList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        //  设置类型详情
        setTypeDetail(row) {
            this.activeItem = row;
            this.adds = {};
            this.adds.name = row.name;
            this.adds.type = row.type;
            this.adds.factory = row.factory;
            this.adds.deptName = row.deptName;
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: row.factory,
                type: row.type
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.parameter = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 更新列表
        getList() {
            this.getdictList();
            this.setTypeDetail(this.activeItem);
        },
        // 新增  修改
        addorupdate(str, id, adds) {
            this.visible = true;
            this.$nextTick(() => {
                if (adds) {
                    this.$refs.addOrupdate.init(str, id, this.adds);
                } else {
                    this.$refs.addOrupdate.init(str, id);
                }
            });
        },
        // 获取工厂
        getFactoryList() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(res => {
                if (res.data.code === 0) {
                    this.factoryList = res.data.typeList;
                    // if (!this.plantList.factoryid) {
                    //   this.plantList.factoryid = res.data.typeList[0].deptId
                    // }
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getdictList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getdictList();
        }
    }
};
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
