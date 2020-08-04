<template>
    <div class="header_main">
        <mds-card title="角色信息列表" :name="'role'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="form.username" placeholder="角色名称" size="small" clearable style="width: 180px; margin-right: 16px;" />
                    <el-button v-if="isAuth('sys:role:list')" type="primary" size="small" @click="GetRoleList(true)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('sys:role:save')" type="primary" size="small" @click="roleAddOrUpdate()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table ref="userlist" class="newTable" header-row-class-name="tableHead" :data="role" :height="mainClientHeight - 62 - 47" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="selection" width="50" fixed />
                <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                <el-table-column prop="roleName" label="角色名称" :show-overflow-tooltip="true" min-width="300" />
                <el-table-column prop="creator" label="创建人" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="created" label="创建时间" width="180" />
                <el-table-column prop="changer" label="修改人" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="changed" label="修改时间" width="180" />
                <el-table-column label="操作" min-width="360" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('sys:role:updateuser')" type="text" class="role__btn" @click="userManage(scope.row.roleId)">
                            人员管理
                        </el-button>
                        <el-button v-if="isAuth('sys:role:updatemenu')" type="text" class="role__btn" @click="fnManage(scope.row.roleId)">
                            功能分配
                        </el-button>
                        <el-button v-if="isAuth('sys:role:updatedept')" type="text" class="role__btn" @click="roleDept(scope.row.roleId)">
                            部门分配
                        </el-button>
                        <el-button v-if="isAuth('sys:role:update')" type="text" class="role__btn" @click="roleAddOrUpdate(scope.row)">
                            修改角色
                        </el-button>
                        <el-button v-if="isAuth('sys:role:delete')" type="text" class="role__btn" @click="removes(scope.row.roleId)">
                            删除角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <role-add v-if="addOrUpdateVisible1" ref="addOrUpdate" @refreshDataList="GetRoleList()" />
        <user-manage v-if="addOrUpdateVisible2" ref="usermanage" @refreshDataList="GetRoleList()" />
        <role-dept v-if="addOrUpdateVisible3" ref="roleDept" @refreshDataList="GetRoleList()" />
        <role-add-or-update v-if="addOrUpdateVisible4" ref="roleaddorupdate" @refreshDataList="GetRoleList()" />
    </div>
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
    computed: {
        mainClientHeight: {
            get() {
                return this.$store.state.common.mainClientHeight;
            },
            set(val) {
                this.$store.commit('common/updateMainClientHeight', val);
            }
        }
    },
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
                    this.$errorToast(data.msg);
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
                            this.$successToast('删除成功!');
                            this.GetRoleList();
                        } else {
                            this.$errorToast(data.msg);
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
