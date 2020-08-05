<template>
    <div class="header_main">
        <mds-card title="角色信息列表" :name="'role'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <div style="float: right; height: 32px; margin-bottom: 10px;">
                    <el-input v-model="controllableForm.username" placeholder="角色名称" size="small" clearable style="width: 180px; margin-right: 16px;" @clear="getItemsList()" />
                    <el-button v-if="isAuth('roleQuery')" type="primary" size="small" :disabled="controllableForm.username.trim()===''" @click="getItemsList(true,controllableForm.username)">
                        查询
                    </el-button>
                    <el-button v-if="isAuth('roleInsert')" type="primary" size="small" @click="addOrUpdateItem()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table ref="targetInfoList" class="newTable" header-row-class-name="tableHead" :data="targetInfoList" :height="mainClientHeight - 62 - 47" border tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center" fixed />
                <el-table-column prop="roleName" label="角色名称" :show-overflow-tooltip="true" min-width="300" />
                <el-table-column prop="creator" label="创建人" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="created" label="创建时间" width="180" />
                <el-table-column prop="changer" label="修改人" :show-overflow-tooltip="true" width="150" />
                <el-table-column prop="changed" label="修改时间" width="180" />
                <el-table-column label="操作" min-width="360" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('roleUserCfg')" type="text" class="role__btn" @click="manageUser(scope.row.id)">
                            人员管理
                        </el-button>
                        <el-button v-if="isAuth('roleDeptCfg')" type="text" class="role__btn" @click="manageDepartment(scope.row.id)">
                            部门分配
                        </el-button>
                        <el-button v-if="isAuth('roleMenuCfg')" type="text" class="role__btn" @click="manageFunction(scope.row.id)">
                            功能分配
                        </el-button>
                        <el-button v-if="isAuth('roleEdit')" type="text" class="role__btn" @click="addOrUpdateItem(scope.row)">
                            修改角色
                        </el-button>
                        <el-button v-if="isAuth('roleDel')" type="text" class="role__btn" @click="removeItems(scope.row.id)">
                            删除角色
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <function-manage v-if="isFunctionManageShow" ref="functionManage" @refreshDataList="getItemsList()" />
        <user-manage v-if="isUserManageShow" ref="manageUser" @refreshDataList="getItemsList()" />
        <department-manage v-if="isDepartmentManageShow" ref="manageDepartment" @refreshDataList="getItemsList()" />
        <role-add-or-update v-if="isRoleAddOrUpdateShow" ref="addOrUpdateItem" @refreshDataList="getItemsList()" />
    </div>
</template>

<script>
    import FunctionManage from './FunctionManage';
    import UserManage from './UserManage';
    import DepartmentManage from './DepartmentManage';
    import RoleAddOrUpdate from './RoleAddAndUpdate';
    import { COMMON_API } from 'common/api/api';
    // import { SYSTEMSETUP_API } from '@/api/api';
    export default {
        name: 'RoleManages',
        components: {
            FunctionManage,
            UserManage,
            DepartmentManage,
            RoleAddOrUpdate
        },
        data() {
            return {
                factoryID: sessionStorage.getItem('factory').id, // 工厂名称
                isFunctionManageShow: false,
                isUserManageShow: false,
                isDepartmentManageShow: false,
                isRoleAddOrUpdateShow: false,
                controllableForm: {
                    username: ''
                },
                menuList: [],
                currPage: 1,
                pageSize: 10,
                totalCount: 1,
                targetInfoList: [],
                currentComponent: ''
            };
        },
        computed: {
            mainClientHeight() {
                return this.$store.state.common.mainClientHeight;
            }
        },
        mounted() {
            this.getItemsList();
        },
        methods: {
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.currPage) - 1) * Number(this.pageSize);
            },
            // 获取角色列表
            getItemsList(haveParas, searchWord = '') {
                if (haveParas) {
                    this.currPage = 1;
                }
                COMMON_API.ROLE_QUERY_API({
                    factory: this.factoryID,
                    current: JSON.stringify(this.currPage),
                    size: JSON.stringify(this.pageSize),
                    roleName: searchWord.trim()
                }).then(({ data }) => {
                    if (haveParas && data.data.records.length === 0) {
                        this.$infoToast('暂无任何内容');
                    }
                    // this.controllableForm.username = '';
                    this.targetInfoList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                    this.isFunctionManageShow = false;
                    this.isUserManageShow = false;
                    this.isDepartmentManageShow = false;
                    this.isRoleAddOrUpdateShow = false;
                });
            },
            // 人员管理
            manageUser(id) {
                this.isUserManageShow = true;
                this.$nextTick(() => {
                    this.$refs.manageUser.init(id);
                });
            },
            // 功能管理
            manageFunction(id) {
                this.isFunctionManageShow = true;
                this.$nextTick(() => {
                    this.$refs.functionManage.init(id);
                });
            },
            // 部门管理
            manageDepartment(id) {
                this.isDepartmentManageShow = true;
                this.$nextTick(() => {
                    this.$refs.manageDepartment.init(id);
                });
            },
            // 新增或修改
            addOrUpdateItem(obj) {
                this.isRoleAddOrUpdateShow = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdateItem.init(obj);
                });
            },
            // 删除角色
            removeItems(id) {
                this.$confirm('确认删除该角色, 是否继续?', '删除角色', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        COMMON_API.ROLE_REMOVE_API({ id: id }).then(() => {
                            this.getItemsList();
                        }).catch((err) => {
                            if (err.data.code === 201) {
                                this.$errorToast(err.data.msg);
                            }
                        })
                    })
                    .catch(() => {
                        //
                    });
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.pageSize = val;
                this.getItemsList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.currPage = val;
                this.getItemsList();
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
