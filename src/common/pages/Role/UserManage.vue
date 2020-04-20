<template>
    <el-dialog title="人员管理" :close-on-click-modal="false" :visible.sync="isDaologShow">
        <div>
            <el-row>
                <el-transfer v-model="selectedUserID" filterable :titles="['未分配人员', '已分配人员']" :filter-method="filterMethod" filter-placeholder="请输入用户名称" :data="userlist" />
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
    // import { transfer } from 'utils/validate';
    export default {
        name: 'UserManage',
        components: {},
        data() {
            return {
                filterMethod(query, item) {
                    return item.screncon.indexOf(query) > -1;
                },
                roleID: '',
                userlist: [],
                selectedUserID: [],
                type: true,
                isDaologShow: false
            };
        },
        computed: {},
        methods: {
            init(id) {
                this.roleID = id;
                COMMON_API.USER_DROPDOWN_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptId: id
                }).then(({ data }) => {
                    if (data.code === 200) {
                        console.log('list')
                        console.log(data)
                        const finalData = this.transfer(data.data)
                        this.userlist = finalData.res;
                        this.selectedUserID = finalData.selectedID;
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.isDaologShow = true;
                });
            },
            transfer(data) {
                const res = [];
                const selectedID = [];
                data.forEach(item => {
                    if (item.selected === 1) {
                        selectedID.push(item.id);
                    }
                    res.push({
                        label: item.realName,
                        key: item.id,
                        screncon: item.realName
                    });
                });
                return {
                    res: res,
                    selectedID: selectedID
                };
            },
            updataUserList() {
                if (this.type) {
                    this.type = false;
                    COMMON_API.ROLE_USER_INSERT_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        roleId: this.roleID,
                        userId: this.selectedUserID
                    }).then(({ data }) => {
                        console.log('update')
                        console.log(data)
                        if (data.code === 200) {
                            this.$successToast('操作成功');
                            this.type = true;
                            this.isDaologShow = false;
                            this.$emit('refreshDataList');
                        } else {
                            this.$errorToast(data.msg);
                        }
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
