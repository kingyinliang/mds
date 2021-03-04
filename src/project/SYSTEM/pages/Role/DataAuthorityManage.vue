<template>
    <el-dialog title="数据权限" :close-on-click-modal="false" :visible.sync="isDialogShow">
        <div style="max-height: 53vh; overflow: auto;">
            <el-tree
                ref="deptListTree"
                :data="orgTree"
                :props="{
                    label: 'deptName',
                }"
                node-key="id"
                :default-expand-all="true"
                show-checkbox
            />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogShow = false">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';
export default {
    name: 'DataAuthorityManage',
    components: {},
    data() {
        return {
            roleID: '',
            isDialogShow: false,
            orgTree: []
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        // 获取组织结构树
        init(id) {
            this.roleID = id;
            COMMON_API.ORGSTRUCTURE_API({
                factory: 'common'
            })
                .then(({ data }) => {
                    this.orgTree = data.data;
                    this.isDialogShow = true;
                })
                .then(() => {
                    COMMON_API.ROLE_ALLOT_QUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        roleId: id
                    }).then(({ data }) => {
                        this.$refs.deptListTree.setCheckedKeys(data.data);
                    });
                });
        },
        // 提交
        submitDataForm() {
            COMMON_API.ROLE_ALLOT_INSERT_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                roleId: this.roleID,
                deptId: [].concat(this.$refs.deptListTree.getCheckedKeys()).concat(this.$refs.deptListTree.getHalfCheckedKeys())
            }).then(() => {
                this.$emit('refreshDataList');
                this.isDialogShow = false;
            });
        }
    }
};
</script>

<style scoped></style>
