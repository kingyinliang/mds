<template>
    <el-dialog title="部门分配" :close-on-click-modal="false" :visible.sync="isDialogShow" class="dialog">
        <h3>角色名称-{{ roleName }}</h3>
        <div style="max-height: 53vh; overflow: auto;">
            <div v-for="(item,index) in topicList" :key="index">
                <h4 @click="controlShow(index)">
                    <span class="el-icon-document" />
                    {{ item.topic }}
                </h4>
                <el-tree
                    v-show="!item.hide"
                    :ref="item.ref"
                    :data="item.orgTree"
                    :props="{
                        label: 'privilegeIdentityName',
                        children: 'children'
                    }"
                    node-key="id"
                    :default-expand-all="false"
                    :render-after-expand="false"
                    show-checkbox
                    children="list"
                    style="margin-left: 20px;"
                />
            </div>
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
            roleName: '',
            isDialogShow: false,
            topicList: []
        };
    },
    computed: {},
    mounted() {
    //    mounted
    },
    methods: {
        // 获取组织结构树
        init(row) {
            console.log('row')
            console.log(row)
            this.roleID = row.id;
            this.roleName = row.roleName;
            this.topicList = [];

            SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_ASSIGNMENT_QUERY_API({
            }).then(({ data }) => {
                data.data.forEach((item, index) => {
                    this.topicList.push({
                        topic: item.propertyName,
                        orgTree: treeDataTranslate(item.list),
                        hide: true,
                        ref: `deptListTree${index + 1}`
                    })
                })
                this.isDialogShow = true;
            }).then(() => {
                SYSTEM_API.SYS_PERMISSION_ATTRIBUTE_ROLE_ASSIGNMENT_QUERY_BY_ID_API({
                    roleId: this.roleID
                }).then(({ data: res }) => {
                    this.$nextTick(() => {
                        for (let i = 1; i <= this.topicList.length; i++) {
                            this.$refs[`deptListTree${i}`][0].setCheckedKeys(res.data);
                        }
                    })
                });
            })
        },
        // 提交
        submitDataForm() {
            let checkList = []
                 for (let i = 1; i <= this.topicList.length; i++) {
                    checkList = checkList.concat(this.$refs[`deptListTree${i}`][0].getCheckedKeys()).concat(this.$refs[`deptListTree${i}`][0].getHalfCheckedKeys())
                }
            const listTemp = [];

            checkList.forEach(item => {
                     listTemp.push({
                    privilegeId: item
                    // privilegeIdentity: 1
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
        },
        controlShow(index) {
            this.topicList[index].hide = !this.topicList[index].hide;
        }
    }
};
</script>

<style lang="scss" scoped>
.el-tree-node__expand-icon {
    display: none;
}
.dialog {
    h3 {
        position: relative;
        margin: 5px 10px 15px;
    }
    h3::before {
        position: absolute;
        top: 2px;
        bottom: 0;
        left: -9px;
        width: 4px;
        height: 12px;
        background: #487bff;
        border-radius: 2px;
        content: "";
    }
    h4 {
        position: relative;
        margin: 5px 20px 10px;
    }

    // h4::before {
    //     position: absolute;
    //     top: 4px;
    //     bottom: 0;
    //     left: -11px;
    //     width: 0;
    //     height: 0;
    //     border-color: transparent transparent transparent #454545;
    //     border-style: solid;
    //     border-width: 4px 0 4px 6px;
    //     content: "";
    // }
}

</style>
