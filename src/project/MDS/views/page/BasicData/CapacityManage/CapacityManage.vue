<template>
    <div class="header_main">
        <mds-card title="产能管理" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织架构一览
                        </div>
                        <div class="filter-input">
                            <el-input v-model="filterText" placeholder="部门名称" size="small">
                                <em slot="prefix" class="el-input__icon el-icon-search" />
                            </el-input>
                        </div>
                        <div class="tree-main SelfScrollbar">
                            <el-tree ref="tree2" :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="GetList" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            产能列表
                        </div>
                        <div class="detail-main SelfScrollbar clearfix">
                            <div class="view-btn" style="float: right; margin-bottom: 10px;">
                                <el-input v-model="capacity.capacity" placeholder="物料" size="small" suffix-icon="el-icon-search" clearable style="width: 180px; margin-right: 16px;" />
                                <el-button v-if="isAuth('sys:capacity:listCapa')" type="primary" size="small" @click="GetList(false, true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('sys:capacity:saveOrUpdateCapa')" type="primary" size="small" @click="addOrupdate()">
                                    增加
                                </el-button>
                                <el-button v-if="isAuth('sys:capacity:deleteCapa')" type="danger" size="small" @click="remove()">
                                    批量删除
                                </el-button>
                            </div>
                            <el-table ref="table1" class="newTable" :data="CapacityList" :height="mainClientHeight - 52 - 155" header-row-class-name="tableHead" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50" fixed="left" />
                                <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                                <el-table-column prop="workNum" :show-overflow-tooltip="true" label="物料">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="basicCapacity" label="标准产能" :show-overflow-tooltip="true" width="87" />
                                <el-table-column prop="designCapacity" label="设计产能" :show-overflow-tooltip="true" width="87" />
                                <el-table-column prop="effecCapacity" label="有效产能" :show-overflow-tooltip="true" width="87" />
                                <el-table-column prop="basicCapacityUnitName" label="单位" width="50" :show-overflow-tooltip="true" />
                                <el-table-column prop="standardOfMan" label="标配人力" width="80" :show-overflow-tooltip="true" />
                                <el-table-column prop="effecStartDate" label="有效开始日期" width="110" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.effecStartDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="effecEndDate" label="有效结束日期" width="110" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        {{ scope.row.effecEndDate }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="changer" label="操作人" width="87" :show-overflow-tooltip="true" />
                                <el-table-column prop="changed" label="操作时间" width="120" :show-overflow-tooltip="true" />
                                <el-table-column label="操作" width="50" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('sys:capacity:saveOrUpdateCapa')" style="padding: 0;" type="text" @click="addOrupdate(scope.row)">
                                            编辑
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-row>
                                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                            </el-row>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </mds-card>
        <capacity-add-or-update v-if="visible" ref="capaaddupdate" :serch-sap-list="SerchSapList" @refreshDataList="GetList" />
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import CapacityAddOrUpdate from './CapacityAddOrUpdate';
export default {
    name: 'CapacityManage',
    components: {
        CapacityAddOrUpdate
    },
    data() {
        return {
            filterText: '',
            loginstatus: false,
            visible: false,
            capacity: {
                capacity: ''
            },
            SerchSapList: [],
            deptId: '',
            OrgTree: [],
            CapacityList: [],
            arrList: [],
            multipleSelection: [],
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
        },
        siteContentViewHeight: {
            get() {
                const height = this.mainClientHeight - 54;
                return { height: height + 'px' };
            }
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree2.filter(val);
        }
    },
    mounted() {
        this.getTree();
        this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', { params: '' }, false, false, false).then(({ data }) => {
            if (data.code === 0) {
                this.SerchSapList = data.list;
            } else {
                this.$errorToast(data.msg);
            }
        });
    },
    methods: {
        // 搜索
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 获取组织结构树
        getTree() {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({ data }) => {
                if (data.code === 0) {
                    this.OrgTree = data.deptList;
                    this.arrList = [this.OrgTree[0].children[0].deptId];
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取产能列表
        GetList(paras, st) {
            this.loginstatus = true;
            if (paras) {
                this.deptId = paras.deptId;
            }
            if (st) {
                this.currPage = 1;
            }
            this.$http(`${BASICDATA_API.CAPALIST_API}`, 'POST', {
                deptId: this.deptId,
                materialCode: this.capacity.capacity,
                currPage: JSON.stringify(this.currPage),
                pageSize: JSON.stringify(this.pageSize)
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.multipleSelection = [];
                    this.CapacityList = data.page.list;
                    this.currPage = data.page.currPage;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.visible = false;
                this.loginstatus = false;
            });
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.id);
            });
        },
        // 新增  修改
        addOrupdate(data) {
            if (this.deptId) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.capaaddupdate.init(this.deptId, data);
                });
            } else {
                this.$warningToast('请先选择部门');
            }
        },
        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的产能');
            } else {
                this.$confirm('确认删除该物料产能, 是否继续?', '删除产能', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$http(`${BASICDATA_API.CAPADEL_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('删除成功!');
                                this.multipleSelection = [];
                                this.GetList();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    })
                    .catch();
            }
        },
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.GetList();
        }
    }
};
</script>

<style scoped lang="scss">
    .org-card {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 500px;
        overflow: hidden;
        border: 1px solid rgba(232, 232, 232, 1);
        border-radius: 4px;
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.09);

        ::v-deep .el-tree-node__expand-icon { /* stylelint-disable-line */
            color: #487bff;
        }
        ::v-deep .el-tree-node__expand-icon.is-leaf { /* stylelint-disable-line */
            color: transparent;
        }

        .org-card_title {
            height: 40px;
            padding-left: 10px;
            color: white;
            line-height: 40px;
            background: rgba(72, 123, 255, 1);
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
            overflow-y: scroll;
        }
    }
</style>
<style scoped></style>
