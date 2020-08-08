<template>
    <el-dialog width="850px" :title="userTypeName" :close-on-click-modal="false" :visible.sync="visible">
        <el-row>
            <el-col style="width: 250px;">
                <el-card style="height: 303px; overflow-y: scroll;">
                    <el-row style=" margin-bottom: 10px; color: black; font-size: 16px;">
                        组织架构
                    </el-row>
                    <el-tree ref="orgtree" :data="orgTree" highlight-current node-key="id" :default-expanded-keys="arrList" :expand-on-click-node="false" @node-click="setdetail" />
                </el-card>
            </el-col>
            <el-col style="width: 250px;">
                <el-card style="height: 303px; overflow-y: scroll;">
                    <el-input v-model="filterText" size="small" placeholder="搜索人员" />
                    <el-tree ref="userlistTree" :filter-node-method="filterNode" node-key="id" :data="userlist" show-checkbox :props="userListTreeProps" :expand-on-click-node="false" @node-click="treeNodeClick" @check-change="userTree" />
                </el-card>
            </el-col>
            <el-col style="width: 50px; padding: 70px 5px;">
                <el-button type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px;" :disabled="!tree2Status" @click="delSelcted()" />
                <el-button type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0;" :disabled="!tree1Status" @click="addSelcted()" />
            </el-col>
            <el-col style="width: 250px;">
                <el-card style="height: 303px; overflow-y: scroll;">
                    <el-input v-model="filterText1" size="small" placeholder="搜索人员" />
                    <el-tree ref="userlistTree1" :filter-node-method="filterNode1" node-key="id" :data="selctId" show-checkbox :props="selctListTreeProps" :expand-on-click-node="false" @node-click="treeNodeClick1" @check-change="userTree1" />
                </el-card>
            </el-col>
        </el-row>
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
    name: 'LoanedPersonnel',
    components: {},
    props: {
        // orgTree: {
        //     type: Array,
        //     default: function() { return [[]] }
        // },
        // arrList: {
        //     type: Array,
        //     default: function() { return {} }
        // }
    },
    data() {
        return {
            userTypeName: '',
            visible: false,
            filterText: '',
            userlist: [],
            tree1Status: false,
            filterText1: '',
            selctId: [],
            tree2Status: false,
            userListTreeProps: {
                label: function(data) {
                    return data.realName + '（' + (data.workNum !== null && data.workNum !== '' ? data.workNum : data.workNumTemp) + '）';
                },
                children: ''
            },
            selctListTreeProps: {
                label: function(data) {
                    return data.label;
                },
                children: ''
            },
            orgTree: [],
            arrList: []
        };
    },
    computed: {},
    watch: {
        filterText(val) {
            this.$refs.userlistTree.filter(val);
        },
        filterText1(val) {
            this.$refs.userlistTree1.filter(val);
        }
    },
    mounted() {
        this.getTree();
    },
    methods: {
        init(userId, userTypeName) {
            this.userTypeName = userTypeName;
            this.visible = true;
            this.selctId = [];
            this.userlist = [];
            if (userId && userId.length > 0) {
                userId.forEach((item) => {
                    this.selctId.push({ label: item });
                });
            }
            if (this.orgTree.length !== 0) {
                this.setdetail(this.orgTree[0], true);
                // this.$refs.orgtree.setCurrentKey(1);
            }
        },
        getTree() {
            COMMON_API.ORGSTRUCTURE_ALL_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                this.orgTree = data.data;
                this.arrList = [this.orgTree[0].children[0].id];
                this.setdetail(this.orgTree[0], true);
                // this.$nextTick(() => {
                //     this.$refs.orgtree.setCurrentKey(1);
                // })
            });
        },
        // 根据组织架构查人
        setdetail(dataObj, inits = false) {
            if (inits) {
                this.$nextTick(() => {
                    this.$refs.orgtree.setCurrentKey(dataObj['id']);
                })
            }
            COMMON_API.USER_ROLE_ALL_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: dataObj.id
            }).then(({ data }) => {
                this.userlist = data.data;
                this.tree1Status = false;
            });
            // this.$http(`${SYSTEMSETUP_API.USERLIST_API}`, 'POST', {
            //     deptId: dataObj.deptId,
            //     param: '',
            //     currPage: '1',
            //     pageSize: '1000'
            // }).then(({ data }) => {
            //     if (data.code === 0) {
            //         this.userlist = data.page.list;
            //         this.tree1Status = false;
            //     } else {
            //         this.$notify.error({ title: '错误', message: data.msg });
            //     }
            // });
        },
        // 部门下树节点点击
        treeNodeClick(data) {
            if (JSON.stringify(this.$refs.userlistTree.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
                const arr = this.$refs.userlistTree.getCheckedNodes();
                arr.push(data);
                this.$refs.userlistTree.setCheckedNodes(arr);
            }
        },
        // 选中树节点点击
        treeNodeClick1(data) {
            if (JSON.stringify(this.$refs.userlistTree1.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
                const arr = this.$refs.userlistTree1.getCheckedNodes();
                arr.push(data);
                this.$refs.userlistTree1.setCheckedNodes(arr);
            }
        },
        // 往左
        delSelcted() {
            this.$refs.userlistTree1.getCheckedNodes().forEach((item) => {
                this.selctId.splice(this.selctId.indexOf(item), 1);
            });
            this.tree2Status = false;
        },
        // 往右
        addSelcted() {
            this.$refs.userlistTree.getCheckedNodes().forEach((item) => {
                const obj = {};
                obj.label = item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）';
                if (JSON.stringify(this.selctId).indexOf(JSON.stringify(obj)) === -1) {
                    this.selctId.push(obj);
                }
            });
        },
        // 部门搜索人员
        filterNode(value, data) {
            if (!value) return true;
            // 如果没有workNum, 使用workNumTemp
            const workNum = data.workNum ? data.workNum : data.workNumTemp;
            return data.realName.indexOf(value) !== -1 || workNum.indexOf(value) !== -1;
        },
        // 选中搜索人员
        filterNode1(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 部门下树节点选中状态监听
        userTree() {
            if (this.$refs.userlistTree.getCheckedNodes().length > 0) {
                this.tree1Status = true;
            } else {
                this.tree1Status = false;
            }
        },
        // 选中树节点选中状态监听
        userTree1() {
            if (this.$refs.userlistTree1.getCheckedNodes().length > 0) {
                this.tree2Status = true;
            } else {
                this.tree2Status = false;
            }
        },
        // 确定人员
        updateUser() {
            this.visible = false;
            const row = [];
            this.selctId.forEach(item => {
                row.push(item.label);
            });
            this.$emit('changeUser', row);
        }
    }
};
</script>

<style scoped></style>
