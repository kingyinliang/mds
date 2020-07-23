<template>
    <div class="header_main">
        <mds-card title="人员管理" :name="'org'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
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
                            <el-tree ref="tree2" :data="OrgTree" node-key="deptId" :default-expanded-keys="arrList" :filter-node-method="filterNode" :expand-on-click-node="false" @node-click="setdetail" />
                        </div>
                    </div>
                </el-col>
                <el-col :span="16">
                    <div class="org-card" :style="siteContentViewHeight">
                        <div class="org-card_title">
                            组织详细信息
                        </div>
                        <div class="detail-main SelfScrollbar clearfix">
                            <div class="view-btn" style="float: right; margin-bottom: 10px;">
                                <el-input v-model="condition.param" placeholder="工号/姓名" size="small" suffix-icon="el-icon-search" clearable style="width: 180px; margin-right: 16px;" />
                                <el-button type="primary" size="small" @click="getList(true)">
                                    查询
                                </el-button>
                                <el-button v-if="isAuth('sys:user:save')" type="primary" size="small" @click="addOrupdate()">
                                    增加
                                </el-button>
                                <el-button v-if="isAuth('sys:user:delete')" type="danger" size="small" @click="remove()">
                                    批量删除
                                </el-button>
                            </div>
                            <el-table ref="table1" class="newTable" :data="userArr" :height="mainClientHeight - 52 - 155" header-row-class-name="tableHead" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="50" fixed />
                                <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                                <el-table-column prop="workNum" label="人员工号" width="87" />
                                <el-table-column prop="workNumTemp" label="虚拟工号" width="110" />
                                <el-table-column prop="realName" label="人员姓名" width="87" />
                                <el-table-column prop="deptName" label="所属部门" width="87" :show-overflow-tooltip="true" />
                                <el-table-column prop="post" label="职务" :show-overflow-tooltip="true" width="150" />
                                <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true" width="250" />
                                <el-table-column prop="mobile" label="手机号" :show-overflow-tooltip="true" width="112" />
                                <el-table-column prop="created" label="创建日期" width="160" />
                                <el-table-column label="操作" fixed="right" width="65">
                                    <template slot-scope="scope">
                                        <el-button v-if="isAuth('sys:user:update') && isAuth('sys:user:info')" style="padding: 0;" type="text" @click="addOrupdate(scope.row.userId)">
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
        <user-add-or-update v-if="visible" ref="addOrupdate" :org-tree="OrgTree" @refreshDataList="getList" />
    </div>
</template>

<script>
import UserAddOrUpdate from './UserAddOrUpdate';
import { BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'UserManages',
    components: {
        UserAddOrUpdate
    },
    data() {
        return {
            filterText: '',
            condition: {
                param: ''
            },
            visible: false,
            deptId: '',
            deptName: '',
            OrgTree: [],
            userArr: [],
            multipleSelection: [],
            totalCount: 1,
            currPage: 1,
            arrList: [],
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
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
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
        // 根据deptId查询用户
        setdetail(data) {
            this.deptId = data.deptId;
            this.deptName = data.deptName;
            this.getList();
        },
        // 获取列表
        getList(st) {
            if (st) {
                this.currPage = 1;
            }
            if (!this.deptId) {
                this.$notify.error({ title: '错误', message: '请选择组织层级' });
                return;
            }
            this.$http(`${SYSTEMSETUP_API.USERLIST1_API}`, 'POST', {
                deptId: this.deptId,
                param: this.condition.param,
                currPage: JSON.stringify(this.currPage),
                pageSize: JSON.stringify(this.pageSize)
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.multipleSelection = [];
                    this.userArr = data.page.list;
                    this.currPage = data.page.currPage;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.visible = false;
            });
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 新增  修改
        addOrupdate(id) {
            if (this.deptId) {
                this.visible = true;
                this.$nextTick(() => {
                    this.$refs.addOrupdate.init(this.deptId, this.deptName, id);
                });
            } else {
                this.$notify.error({ title: '错误', message: '请先选择部门' });
            }
        },
        // 删除
        remove() {
            if (this.multipleSelection.length === 0) {
                this.$notify.error({
                    title: '错误',
                    message: '请选择要删除的用户'
                });
            } else {
                const roleName = [];
                const userId = [];
                this.multipleSelection.forEach(item => {
                    if (item.roleName) {
                        roleName.push(item.roleName);
                    }
                    userId.push(item.userId);
                });
                if (roleName.length) {
                    this.$confirm(`有 ${roleName.join(',')}权限，不能删除，请联系IT`, '删除用户', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    //    then
                    }).catch(() => {
                        // this.$infoToast('已取消删除');
                    });
                } else {
                    this.$confirm('此用户无权限，是否删除?', '删除用户', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.$http(`${SYSTEMSETUP_API.USERDEL_API}`, 'POST', userId).then(({ data }) => {
                                if (data.code === 0) {
                                    this.$successToast('删除成功!');
                                    this.multipleSelection = [];
                                    this.getList();
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            });
                        })
                        .catch(() => {
                        //    catch
                        });
                }
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
<style scoped></style>
