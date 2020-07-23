<template>
    <div class="header_main">
        <mds-card title="设备管理" :name="'device'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织架构一览
                        </div>
                        <div class="filter-input">
                            <el-input v-model="filterText" placeholder="部门名称" size="small">
                                <i slot="prefix" class="el-input__icon el-icon-search" />
                            </el-input>
                        </div>
                        <div class="tree-main SelfScrollbar">
                            <el-tree ref="treeList" :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="setdetail" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织详细信息
                        </div>
                        <div class="detail-main SelfScrollbar">
                            <div class="view-btn" style="float: right; margin-bottom: 10px;">
                                <el-input v-model="param.param" placeholder="设备编号" size="small" suffix-icon="el-icon-search" clearable style="width: 180px; margin-right: 16px;" />
                                <el-button v-if="isAuth('sys:device:checkList')" type="primary" size="small" @click="getList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('sys:device:save')" type="primary" size="small" @click="addOrupdate(deptId)">
                                    新增
                                </el-button>
                                <el-button v-if="isAuth('sys:device:delete')" type="danger" size="small" @click="remove()">
                                    批量删除
                                </el-button>
                            </div>
                            <el-table ref="table1" class="newTable" :height="mainClientHeight - 52 - 155" border header-row-class-name="tableHead" :data="deviceList" tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50" fixed />
                                <el-table-column type="index" :index="indexMethod" label="序号" width="55" fixed />
                                <el-table-column prop="deviceNo" width="120" :show-overflow-tooltip="true" label="设备编号" />
                                <el-table-column prop="deviceName" label="设备描述" :show-overflow-tooltip="true" />
                                <el-table-column fixed="right" label="操作" width="65">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('sys:device:update')" type="text" @click="addOrupdate(deptId, scope.row)">
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
        <add-orupdate v-if="visible" ref="addOrupdate" @refreshDataList="getList()" />
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
import AddOrupdate from './DeviceAddorUpdate';
export default {
    name: 'DeviceManage',
    components: {
        AddOrupdate
    },
    data() {
        return {
            filterText: '',
            arrList: [],
            deptId: 0,
            visible: false,
            OrgTree: [],
            param: {
                param: ''
            },
            deviceList: [],
            multipleSelection: [],
            totalCount: 0,
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
                    this.deptId = this.OrgTree[0]['deptId'];
                    this.$nextTick(() => {
                        this.$refs.treeList.setCurrentKey(this.deptId);
                    })
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取设备列表
        setdetail(data) {
            this.deptId = data.deptId;
            this.getList();
        },
        // 获取列表
        getList(st) {
            if (st) {
                this.currPage = 1;
            }
            this.$http(`${BASICDATA_API.DEVICELIST1_API}`, 'POST', {
                param: this.param.param,
                deptId: this.deptId,
                currPage: JSON.stringify(this.currPage),
                pageSize: JSON.stringify(this.pageSize)
            }).then(({ data }) => {
                this.visible = false;
                if (data.code === 0) {
                    this.deviceList = data.list.list;
                    this.pageSize = data.list.pageSize;
                    this.totalCount = data.list.totalCount;
                    this.currPage = data.list.currPage;
                } else {
                    this.$errorToast(data.msg);
                }
                this.multipleSelection = [];
            });
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item.deviceId);
            });
        },
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        },
        // 添加和编辑
        addOrupdate(deptId, id) {
            if (deptId === 0) {
                this.$warningToast('请选择部门后新增');
            } else {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.addOrupdate.init(deptId, id);
                });
            }
        },
        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的设备');
            } else {
                this.$confirm('确认删除设备, 是否继续?', '删除设备', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$http(`${BASICDATA_API.DEVICEDEL_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('删除成功!');
                                this.multipleSelection = [];
                                this.getList();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    })
                    .catch();
            }
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
