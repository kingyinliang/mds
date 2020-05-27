<template>
    <el-dialog title="人员管理" width="540px" :close-on-click-modal="false" :visible.sync="isDaologShow">
        <div>
            <el-row>
                <el-transfer v-model="selectedUserID" filterable :titles="['未分配人员', '已分配人员']" :filter-method="filterMethod" filter-placeholder="请输入用户名称" :data="userList" />
            </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDaologShow = false">取消</el-button>
            <el-button type="primary" @click="updataUserList">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    export default {
        name: 'UserManage',
        components: {},
        data() {
            return {
                filterMethod(query, item) {
                    return item.screncon.indexOf(query) > -1;
                },
                roleID: '',
                userList: [],
                selectedUserID: [],
                selectedUserIDTemp: [],
                isDaologShow: false
            };
        },
        computed: {},
        methods: {
            init(id) {
                this.roleID = id;
                COMMON_API.ROLE_USER_LIST_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    roleId: id
                }).then(({ data }) => {
                    const finalData = this.transfer(data.data)
                    this.userList = finalData.res;
                    this.selectedUserID = finalData.selectedID;
                    this.selectedUserIDTemp = finalData.selectedID;
                    this.isDaologShow = true;
                });
            },
            transfer(data) {
                const res = [];
                const selectedID = [];
                data.forEach(item => {
                    if (item.selection === '1') {
                        selectedID.push(item.userId);
                    }
                    res.push({
                        label: item.userName + '(' + item.workNum + ')',
                        key: item.userId,
                        screncon: item.userName + ' ' + item.workNum
                    });
                });
                return {
                    res: res,
                    selectedID: selectedID
                };
            },
            updataUserList() {
                if (this.selectedUserID !== this.selectedUserIDTemp) {
                    COMMON_API.ROLE_USER_INSERT_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        roleId: this.roleID,
                        userId: this.selectedUserID
                    }).then(() => {
                        this.$emit('refreshDataList');
                        this.isDaologShow = false;
                    }).catch(() => {
                         //
                    });
                } else {
                    this.$notify.error({ title: '错误', message: '请分配人员' });
                }
            }
        }
    };
</script>

<style scoped></style>
