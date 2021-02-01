<template>
    <el-dialog width="850px" :title="userTypeName" :close-on-click-modal="false" :visible.sync="visible">
        <div class="orgStaff">
            <el-card style="width: 30%; max-height: 305px; margin-right: 30px; overflow-y: scroll;">
                <el-row class="orgHead">
                    <span>组织架构</span>
                </el-row>
                <el-tree ref="orgtree" :data="orgTree" node-key="id" :highlight-current="true" :default-expand-all="openOrgTree" :default-expanded-keys="arrList" :expand-on-click-node="false" @node-click="setdetail" />
            </el-card>
            <el-transfer
                v-model="selctId"
                filterable
                filter-placeholder="请输入用户名称"
                :titles="['未分配人员', '已分配人员']"
                :format="{
                    noChecked: '${total}',
                    hasChecked: '${checked}/${total}'
                }"
                :data="userlist"
                @change="test"
            />
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button size="small" type="primary" @click="updateUser">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';
export default {
    name: 'LoanedPersonnelV1',
    components: {},
    props: {
        orgTree: {
            type: Array,
            default: function() { return [[]] }
        },
        arrList: {
            type: Array,
            default: function() { return {} }
        }
    },
    data() {
        return {
            openOrgTree: false,
            userTypeName: '', // 标题名称
            visible: false,
            userlist: [],
            selctId: []
        };
    },
    computed: {},
    methods: {
        test() {
            console.log(this.selctId)
        },
        handleCheckAllChange() {
            this.openOrgTree = !this.openOrgTree
        },
        init(userId, userTypeName) {
            let userIdTemp = []
            if (userId !== '') {
                userIdTemp = userId.split(',')
            }

            this.userTypeName = userTypeName;
            this.visible = true;
            this.selctId = userIdTemp; // 已选
            this.userlist = []; // 可选

            // 预设选取该车间
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '发酵'
            }).then((res) => {
                res.data.data.forEach(item => {
                    const name = item.deptCode === this.arrList[0] ? item.deptName : '';
                    if (name !== '') {
                        const tempNode = document.querySelectorAll('.el-tree-node__label')
                        tempNode.forEach(element => {
                            console.log(element.innerText)
                            if (element.innerText === name) {
                                // element.parentNode.parentNode.classList.add('is-current')
                                element.parentNode.parentNode.click();
                            }
                        })
                    }
                })
            })
        },
        // 根据组织架构查人
        setdetail(dataObj) {
            COMMON_API.USER_ROLE_ALL_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: dataObj.id
            }).then(({ data }) => {
                this.userlist = []
                data.data.forEach(item => {
                    this.userlist.push({
                        key: item.realName + '(' + item.workNum + ')',
                        label: item.realName + '(' + item.workNum + ')'
                    })
                })
            });
        },
        updateUser() {
            this.visible = false;
            const row = [];
            this.selctId.forEach(item => {
                row.push(item);
            });
            this.$emit('changeUser', row);
        }
    }
};
</script>

<style scoped>
.orgStaff {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
}
.orgHead {
    height: 40px;
    margin: 0;
    padding-left: 20px;
    color: #000;
    font-size: 14px;
    line-height: 40px;
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
}

.orgStaff >>> .el-card__body {
    padding: 0;
}
.orgStaff >>> .el-transfer-panel .el-transfer-panel__header .el-checkbox .el-checkbox__label {
    color: #303133;
    font-weight: 400;
    font-size: 14px;
}
</style>
