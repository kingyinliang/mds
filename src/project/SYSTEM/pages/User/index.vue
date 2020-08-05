<template>
    <div class="header_main">
        <mds-card title="用户列表" :name="'user'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <el-form :model="dataForm" size="small" label-width="110px" style="float: right; height: 32px; margin-bottom: 10px;" @keyup.enter.native="GetList(true)" @submit.native.prevent>
                    <el-form-item>
                        <el-input v-model="dataForm.workNum" placeholder="用户名" class="input-with-select" size="small" style="width: 280px; margin-right: 16px;">
                            <el-select slot="prepend" v-model="dataForm.authorized" placeholder="请选择" style="width: 90px;">
                                <el-option label="有权限" :value="1" />
                                <el-option label="无权限" :value="0" />
                            </el-select>
                        </el-input>
                        <el-button v-if="isAuth('userQuery')" type="primary" size="small" @click="GetList(true)">
                            查询
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table ref="table1" class="newTable" :height="mainClientHeight - 72 - 47" border header-row-class-name="tableHead" :data="UserList" tooltip-effect="dark" style="width: 100%;">
                <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                <el-table-column label="用户名" width="200" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ `${scope.row.realName}（${scope.row.workNum}）` }}
                    </template>
                </el-table-column>
                <el-table-column label="角色名称" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button style="padding: 0;" type="text" @click="updateRole(scope.row)">
                            <span v-for="(item, index) in scope.row.roles" :key="index">{{ item.roleName + ' ' }}</span>
                            <span v-if="scope.row.roles.length === 0">点击分配角色</span>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column width="80" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('userReset')" style="padding: 0;" type="text" @click="PasswordReset(scope.row.id)">
                            重置密码
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination :current-page="dataForm.current" :page-sizes="[10, 20, 50]" :page-size="dataForm.size" layout="total, sizes, prev, pager, next, jumper" :total="dataForm.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
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
                        key: 'id',
                        label: 'roleName',
                    }"
                />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="UpdateUserRole">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';

    @Component({
        name: 'User',
        components: {
        }
    })
    export default class User extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        filterMethod = (query, item) => {
            return item.roleName.indexOf(query) > -1;
        };

        dataForm = {
            factory: 'common',
            workNum: '',
            authorized: 1,
            current: 1,
            size: 10,
            totalCount: 0
        };

        UserList: UserObj[] = [];
        RoleList: RoleObj[] = [];

        visible = false;
        selctUser: UserObj = {};
        selctRoleId: string[] = [];

        mounted() {
            this.GetList()
            this.getRoleList()
        }

        // 获取人员列表-查询
        GetList(flag?) {
            if (flag) {
                this.dataForm.current = 1;
            }
            COMMON_API.USER_ROLE_QUERY_API(this.dataForm).then(({ data }) => {
                if (flag && data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
                this.UserList = data.data.records;
                this.dataForm.current = data.data.current
                this.dataForm.size = data.data.size
                this.dataForm.totalCount = data.data.total
            });
        }

        // 获取角色列表
        getRoleList() {
            COMMON_API.USER_ROLE_DROPDOWN_API({}).then(({ data }) => {
                this.RoleList = data.data
            })
        }

        // 重置密码
        PasswordReset(id) {
            this.$confirm('确认重置密码, 是否继续?', '重置密码', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                COMMON_API.USER_PASSWORD_RESET_API({
                    id: id
                }).then(({ data }) => {
                    this.$successToast(data.msg)
                })
            })
        }

        // 修改人员的角色弹窗
        updateRole(row) {
            this.selctUser = row;
            this.selctRoleId = [];
            row.roles.forEach(item => {
                this.selctRoleId.push(item.id);
            });
            this.visible = true;
        }

        // 修改人员的角色信息
        UpdateUserRole() {
            COMMON_API.USER_ROLE_UPDATA_API({
                userId: this.selctUser.id,
                roleId: this.selctRoleId
            }).then(({ data }) => {
                this.$successToast(data.msg)
                this.visible = false;
                this.GetList()
            })
        }

        // 角色穿梭框查询
        indexMethod(index) {
            return index + 1 + (this.dataForm.current - 1) * (Number(this.dataForm.size));
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.dataForm.size = val;
            this.GetList();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.dataForm.current = val;
            this.GetList();
        }
    }

    interface UserObj {
        id?: string;
        workNum?: string;
        userName?: string;
        realName?: string;
        roles?: RoleObj[];
    }
    interface RoleObj {
        id?: string;
        roleName?: string;
    }
</script>

<style lang="scss" scoped>
    .uaer-detail {
        ::v-deep .el-transfer-panel {/* stylelint-disable-line */
            width: 300px;
        }
    }
</style>
