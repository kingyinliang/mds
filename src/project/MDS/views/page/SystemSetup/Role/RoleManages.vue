<template>
    <el-col>
        <div class="main">
            <el-card>
                <el-row type="flex">
                    <el-col>
                        <el-form :inline="true" :model="form" size="small" label-width="85px" class="topforms" @keyup.enter.native="GetRoleList(true)">
                            <el-form-item label="角色名称：">
                                <el-input v-model="form.username" placeholder="角色名称" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col style="width: 200px;">
                        <el-button v-if="isAuth('sys:role:list')" type="primary" size="small" @click="GetRoleList(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('sys:role:save')" type="primary" size="small" @click="roleAddOrUpdate()">
                            新增
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-table ref="userlist" header-row-class-name="tableHead" :data="role" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column type="selection" width="34" />
                        <el-table-column type="index" :index="indexMethod" width="55" />
                        <el-table-column prop="roleName" label="角色名称" :show-overflow-tooltip="true" width="" />
                        <el-table-column label="操作" width="320">
                            <template slot-scope="scope">
                                <a v-if="isAuth('sys:role:updateuser')" @click="userManage(scope.row.roleId)">人员管理</a>
                                <a v-if="isAuth('sys:role:updatemenu')" @click="fnManage(scope.row.roleId)">功能分配</a>
                                <a v-if="isAuth('sys:role:updatedept')" @click="roleDept(scope.row.roleId)">部门分配</a>
                                <a v-if="isAuth('sys:role:update')" @click="roleAddOrUpdate(scope.row)">修改角色</a>
                                <a v-if="isAuth('sys:role:delete')" @click="removes(scope.row.roleId)">删除角色</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creator" label="创建人" :show-overflow-tooltip="true" width="" />
                        <el-table-column prop="created" label="创建时间" width="160" />
                        <el-table-column prop="changer" label="修改人" :show-overflow-tooltip="true" width="" />
                        <el-table-column prop="changed" label="修改时间" width="160" />
                    </el-table>
                </el-row>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <role-add v-if="addOrUpdateVisible1" ref="addOrUpdate" @refreshDataList="GetRoleList()" />
        <user-manage v-if="addOrUpdateVisible2" ref="usermanage" @refreshDataList="GetRoleList()" />
        <role-dept v-if="addOrUpdateVisible3" ref="roleDept" @refreshDataList="GetRoleList()" />
        <role-add-or-update v-if="addOrUpdateVisible4" ref="roleaddorupdate" @refreshDataList="GetRoleList()" />
    </el-col>
</template>

<script>
import RoleAdd from './RoleAdd';
import UserManage from './UserManage';
import RoleDept from './RoleDept';
import RoleAddOrUpdate from './AddRole';
import { SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'RoleManages',
    components: {
        RoleAdd,
        UserManage,
        RoleDept,
        RoleAddOrUpdate
    },
    data() {
        return {
            addOrUpdateVisible1: false,
            addOrUpdateVisible2: false,
            addOrUpdateVisible3: false,
            addOrUpdateVisible4: false,
            form: {
                username: ''
            },
            menuList: [],
            currPage: 1,
            pageSize: 10,
            totalCount: 1,
            role: []
        };
    },
    computed: {},
    mounted() {
        this.GetRoleList();
    },
    methods: {
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        },
        // 获取角色列表
        GetRoleList(st) {
            if (st) {
                this.currPage = 1;
            }
            this.$http(`${SYSTEMSETUP_API.ROLELIST_API}`, 'POST', {
                roleName: this.form.username,
                currPage: JSON.stringify(this.currPage),
                pageSize: JSON.stringify(this.pageSize)
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.role = data.page.list;
                    this.currPage = data.page.currPage;
                    this.pageSize = data.page.pageSize;
                    this.totalCount = data.page.totalCount;
                } else {
                    this.$errorTost(data.msg);
                }
                this.addOrUpdateVisible1 = false;
                this.addOrUpdateVisible2 = false;
                this.addOrUpdateVisible3 = false;
                this.addOrUpdateVisible4 = false;
            });
        },
        // 人员管理
        userManage(id) {
            this.addOrUpdateVisible2 = true;
            this.$nextTick(() => {
                this.$refs.usermanage.init(id);
            });
        },
        // 功能管理
        fnManage(id) {
            this.addOrUpdateVisible1 = true;
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(id);
            });
        },
        // 部门管理
        roleDept(id) {
            this.addOrUpdateVisible3 = true;
            this.$nextTick(() => {
                this.$refs.roleDept.init(id);
            });
        },
        // 新增 修改
        roleAddOrUpdate(id) {
            this.addOrUpdateVisible4 = true;
            this.$nextTick(() => {
                this.$refs.roleaddorupdate.init(id);
            });
        },
        // 删除角色
        removes(id) {
            this.$confirm('确认删除该角色, 是否继续?', '删除角色', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$http(`${SYSTEMSETUP_API.ROLEDEL_API}`, 'POST', {
                        roleId: id
                    }).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successTost('删除成功!');
                            this.GetRoleList();
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
                })
                .catch(() => {
                //    catch
                });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.GetRoleList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.GetRoleList();
        }
    }
};
</script>

<style scoped></style>
