<template>
    <el-dialog title="部门分配" :close-on-click-modal="false" :visible.sync="isDialogShow">
        <h3>角色名称</h3>
        <div style="max-height: 53vh; overflow: auto;">
            <el-tree
                ref="deptListTree"
                :data="orgTree"
                :props="{
                    label: 'propertyName',
                }"
                node-key="id"
                :default-expand-all="true"
                show-checkbox
                children="list"
            />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isDialogShow = false">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { SYSTEM_API } from 'common/api/api';
import { treeDataTranslate } from '@/net/validate';
export default {
    name: 'DepartmentManage',
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
            console.log('id')
            console.log(id)
            this.roleID = id;
            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY_API({
            }).then(({ data }) => {
                console.log('22222222data')
                console.log(data)
                // this.orgTree = data.data;
                this.orgTree = treeDataTranslate(data.data);
                console.log('this.orgTree')
                console.log(this.orgTree)
                this.isDialogShow = true;
            })


            // COMMON_API.ORGSTRUCTURE_API({
            //     factory: 'common'
            // })
            //     .then(({ data }) => {
            //         this.orgTree = data.data;
            //         this.isDialogShow = true;
            //     })
            //     .then(() => {
            //         COMMON_API.ROLE_ALLOT_QUERY_API({
            //             factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //             roleId: id
            //         }).then(({ data }) => {
            //             this.$refs.deptListTree.setCheckedKeys(data.data);
            //         });
            //     });

            // SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID_API({
            //     roleId: id
            // }).then(({ data }) => {
            //     console.log('11111111data')
            //     console.log(data)
            //     // this.$refs.deptListTree.setCheckedKeys(data.data);
            // });
        },
        // 提交
        submitDataForm() {
            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_SAVE_API({
                // factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                roleId: this.roleID,
                list: []
                // deptId: [].concat(this.$refs.deptListTree.getCheckedKeys()).concat(this.$refs.deptListTree.getHalfCheckedKeys())
            }).then(() => {
                this.$emit('refreshDataList');
                this.isDialogShow = false;
            });
        }
    }
};
</script>

<style scoped>
h3 {
    position: relative;
    margin-left: 5px 10px;
}
h3::before {
    position: absolute;
    top: 2px;
    bottom: 0;
    left: -7px;
    width: 4px;
    height: 12px;
    background: #487bff;
    border-radius: 2px;
    content: "";
}
</style>
