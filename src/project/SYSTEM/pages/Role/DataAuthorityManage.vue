<template>
    <el-dialog title="部门分配" :close-on-click-modal="false" :visible.sync="isDialogShow">
        <h3>角色名称</h3>
        <div style="max-height: 53vh; overflow: auto;">
            <el-tree
                ref="deptListTree"
                :data="orgTree"
                :props="{
                    label: 'privilegeIdentityName',
                    children: 'children'
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
            orgTree: [],
            dataListForMapping: []
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
            this.orgTree = [];
            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY_API({
            }).then(({ data }) => {
                console.log('22222222data')
                console.log(data)
                data.data.forEach(item => {
                    this.dataListForMapping.push({
                        privilegeId: item.id,
                        privilegeIdentity: item.propertyName
                        }
                    )
                    this.orgTree.push({
                        id: item.id,
                        privilegeIdentityName: item.propertyName,
                        children: treeDataTranslate(item.list)
                    })
                })
                this.isDialogShow = true;
            }).then(() => {
                SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID_API({
                    roleId: id
                }).then(({ data: res }) => {
                    console.log('11111111data')
                    console.log(res)
                    this.$refs.deptListTree.setCheckedKeys(res.data);
                });
                console.log('this.orgTree')
                console.log(this.orgTree)
                this.isDialogShow = true;
            })

        },
        // 提交
        submitDataForm() {
            const checkList = [].concat(this.$refs.deptListTree.getCheckedKeys()).concat(this.$refs.deptListTree.getHalfCheckedKeys())
            const listTemp = [];

            checkList.forEach(item => {
                     listTemp.push({
                    privilegeId: item,
                    privilegeIdentity: 1
                })
            })


            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_SAVE_API({
                // factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                roleId: this.roleID,
                list: listTemp
            }).then(() => {
                this.$successToast('设置成功');
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
