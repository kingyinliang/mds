<template>
    <el-col>
        <div class="main">
            <el-card>
                <el-row>
                    <el-form :inline="true" :model="dataForm" size="small" label-width="68px">
                        <el-form-item>
                            <el-input v-model="dataForm.workNum" placeholder="用户名" class="input-with-select">
                                <el-select slot="prepend" v-model="dataForm.isPermis" placeholder="请选择" style="width: 90px;">
                                    <el-option label="有权限" value="0" />
                                    <el-option label="无权限" value="1" />
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button v-if="isAuth('sys:user:userManagementList')" type="primary" size="small" @click="GetList(true)">
                                查询
                            </el-button>
                            <el-button type="primary" size="small" @click="outPut()">
                                导出
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row>
                    <el-table ref="table1" class="orderTable" border header-row-class-name="tableHead" :data="UserList" tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                        <el-table-column label="用户名" width="200" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ `${scope.row.realName}（${scope.row.workNum}）` }}
                            </template>
                        </el-table-column>
                        <el-table-column label="角色名称" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:user:userManagementList')" style="padding: 0;" type="text" @click="updateRole(scope.row)">
                                    <span v-for="(item, index) in scope.row.roleName" :key="index">{{ item.roleName + ' ' }}</span>
                                    <span v-if="scope.row.roleName.length === 0">点击分配角色</span>
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column width="80" label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:user:reset')" style="padding: 0;" type="text" @click="PasswordReset(scope.row.userId)">
                                    重置密码
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
        <el-dialog :title="`${selctUser.realName}（${selctUser.workNum}）角色选择`" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="visible" width="740px">
            <div class="uaer-detail">
                <el-transfer
                    v-model="selctRoleId"
                    filterable
                    :titles="['未分配角色', '已分配角色']"
                    :filter-method="filterMethod"
                    filter-placeholder="请输入角色名称"
                    :data="RoleList"
                    :props="{
                        key: 'roleId',
                        label: 'roleName',
                    }"
                />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="UpdateUserRole">确定</el-button>
            </span>
        </el-dialog>
    </el-col>
</template>

<script>
import { SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'UserExport',
    components: {},
    data() {
        return {
            filterMethod(query, item) {
                return item.roleName.indexOf(query) > -1;
            },
            lodings: false,
            visible: false,
            dataForm: {
                workNum: '',
                isPermis: '0'
            },
            UserListArr: [],
            UserList: [],
            selctUser: {},
            selctRoleId: [],
            RoleList: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 1
        };
    },
    computed: {},
    mounted() {
        this.GetList();
        this.getRoleList();
    },
    methods: {
        outPut() {
            this.$notify.error({ title: '错误', message: '敬请期待' });
            return false;
            // let that = this
            // exportFile(`${REP_API.REPOUT_API}`, '用户表导出', that)
        },
        updateRole(row) {
            this.selctUser = row;
            this.selctRoleId = [];
            row.roleName.forEach(item => {
                this.selctRoleId.push(item.roleId);
            });
            this.visible = true;
        },
        getRoleList() {
            this.$http(`${SYSTEMSETUP_API.ROLELIST_API}`, 'POST', {
                roleName: '',
                currPage: '1',
                pageSize: '1000'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.RoleList = data.page.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        UpdateUserRole() {
            this.$http(`${SYSTEMSETUP_API.USER_UPDATE_ROLE_API}`, 'POST', {
                userId: this.selctUser.userId,
                roleId: this.selctRoleId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.visible = false;
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success'
                    });
                    this.GetList();
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        PasswordReset(id) {
            this.$confirm('确认重置密码, 是否继续?', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${SYSTEMSETUP_API.PASSWORDRESET_API}`, 'POST', {
                    userId: id
                }).then(({ data }) => {
                    this.lodings = false;
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '重置成功',
                            type: 'success'
                        });
                        this.GetList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        dataPro(num) {
            this.UserList = this.UserListArr.slice((num - 1) * this.pageSize, num * this.pageSize);
            this.totalCount = this.UserListArr.length;
            this.currPage = num;
        },
        GetList(st) {
            if (st) {
                this.currPage = 1;
            }
            this.lodings = true;
            this.$http(`${SYSTEMSETUP_API.USERLISTPASS_API}`, 'POST', {
                workNum: this.dataForm.workNum,
                isPermis: this.dataForm.isPermis
            }).then(({ data }) => {
                this.lodings = false;
                if (data.code === 0) {
                    this.UserListArr = data.page;
                    this.dataPro(this.currPage);
                } else {
                    this.$errorToast(data.msg);
                }
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
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.GetList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.dataPro(val);
        }
    }
};
</script>

<style lang="scss">
.uaer-detail {
    .el-transfer-panel {
        width: 300px;
    }
}
</style>
<style scoped></style>
