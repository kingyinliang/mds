<template>
    <el-col>
        <div class="main">
            <el-card>
                <el-row type="flex">
                    <el-col>
                        <el-form :inline="true" :model="form" size="small" label-width="85px" class="topforms" @keyup.enter.native="getRoleList(true)">
                            <el-form-item label="角色名称：">
                                <el-input v-model="form.username" placeholder="角色名称" />
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col style="width: 200px;">
                        <el-button v-if="isAuth('sys:role:list')" type="primary" size="small" @click="getRoleList(true,form.username)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('sys:role:save')" type="primary" size="small" @click="roleAddOrUpdate({style:'add',info:{}})">
                            新增
                        </el-button>
                    </el-col>
                </el-row>
                <el-row>
                    <el-table ref="userlist" header-row-class-name="tableHead" :data="roleList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column type="selection" width="40" />
                        <el-table-column type="index" :index="indexMethod" width="50" align="right" />
                        <el-table-column prop="roleName" label="角色名称" :show-overflow-tooltip="true" width="" />
                        <el-table-column label="操作" width="">
                            <template slot-scope="scope">
                                <a v-if="isAuth('sys:role:updateuser')" style="margin-right: 0.3em;" @click="userManage(scope.row.id)">人员管理</a>|
                                <a v-if="isAuth('sys:role:updatemenu')" style="margin-right: 0.3em;" @click="fnManage(scope.row.id)">功能分配</a>|
                                <a v-if="isAuth('sys:role:updatedept')" style="margin-right: 0.3em;" @click="roleDept(scope.row.id)">部门分配</a>|
                                <a v-if="isAuth('sys:role:update')" style="margin-right: 0.3em;" @click="roleAddOrUpdate({style:'modify',info:scope.row})">修改角色</a>|
                                <a v-if="isAuth('sys:role:delete')" @click="roleRemove(scope.row.id)">删除角色</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="creator" label="创建人" :show-overflow-tooltip="true" width="150" />
                        <el-table-column prop="created" label="创建时间" width="100" />
                        <el-table-column prop="changer" label="修改人" :show-overflow-tooltip="true" width="150" />
                        <el-table-column prop="changed" label="修改时间" width="100" />
                    </el-table>
                </el-row>
                <el-row>
                    <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                </el-row>
            </el-card>
        </div>
        <function-manage v-if="addOrUpdateVisible1" ref="functionManage" @refreshDataList="getRoleList()" />
        <user-manage v-if="addOrUpdateVisible2" ref="usermanage" @refreshDataList="getRoleList()" />
        <!-- <role-dept v-if="addOrUpdateVisible3" ref="roleDept" @refreshDataList="getRoleList()" /> -->
        <role-add-or-update v-if="addOrUpdateVisible4" ref="roleaddorupdate" @refreshDataList="getRoleList()" />
        <!-- <component :is="currentComponent" /> -->
    </el-col>
</template>

<script>
    import FunctionManage from './FunctionManage';
    import UserManage from './UserManage';
    // import RoleDept from './RoleDept';
    import RoleAddOrUpdate from './AddAndUpdateRole';
    import { COMMON_API } from 'common/api/api';
    // import { SYSTEMSETUP_API } from '@/api/api';
    export default {
        name: 'RoleManages',
        components: {
            FunctionManage,
            UserManage,
            // RoleDept,
            RoleAddOrUpdate
        },
        data() {
            return {
                factoryID: sessionStorage.getItem('factory').id, // 工厂名称
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
                roleList: [],
                currentComponent: ''
            };
        },
        computed: {},
        mounted() {
            this.getRoleList();
        },
        methods: {
            isAuth() {
                return true
            },
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 获取角色列表
            getRoleList(st, searchWord = '') {
                if (st) {
                    this.currPage = 1;
                }
                COMMON_API.ROLE_QUERY_API({
                    factory: this.factoryID,
                    current: JSON.stringify(this.currPage),
                    size: JSON.stringify(this.pageSize),
                    roleName: searchWord
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.form.username = '';
                        this.roleList = data.data.records;
                        this.currPage = data.data.current;
                        this.pageSize = data.data.size;
                        this.totalCount = data.data.total;
                    } else {
                        console.log(data.msg)
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
                    this.$refs.functionManage.init(id);
                });
            },
            // 部门管理
            roleDept(id) {
                this.addOrUpdateVisible3 = true;
                this.$nextTick(() => {
                    this.$refs.roleDept.init(id);
                });
            },
            // 新增或修改
            roleAddOrUpdate(styleInfo) {
                this.addOrUpdateVisible4 = true;
                this.$nextTick(() => {
                    this.$refs.roleaddorupdate.init({
                        roleStyle: styleInfo.style,
                        roleInfo: styleInfo.info
                    });
                });
            },
            // 删除角色
            roleRemove(id) {
                this.$confirm('确认删除该角色, 是否继续?', '删除角色', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        COMMON_API.ROLE_REMOVE_API({ id: id }).then(({ data }) => {
                            if (data.code === 200) {
                                this.$successToast('删除成功!');
                                this.getRoleList();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        }).catch(() => {
                            //
                        });
                    })
                    .catch(() => {
                        //
                    });
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getRoleList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.currPage = val;
                this.getRoleList();
            }
        }
    };
</script>

<style scoped>
</style>
