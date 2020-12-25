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
                    <el-row style=" margin-bottom: 10px; padding: 0 20px; line-height: 40px; background: #f5f7fa;">
                        <el-checkbox v-model="checkedOfUser" @change="checkedAll('userListTree')" /> 未分配人员
                    </el-row>
                    <el-input v-model="filterText" size="small" placeholder="搜索人员" style="padding-bottom: 10px;" />
                    <el-tree ref="userListTree" :filter-node-method="filterNode1" node-key="label" :data="userList" show-checkbox :props="userListTreeProps" :expand-on-click-node="false" @node-click="treeNodeClick" @check-change="userTree" />
                </el-card>
            </el-col>
            <el-col style="width: 50px; padding: 70px 5px;">
                <el-button type="primary" icon="el-icon-arrow-left" circle style="margin-bottom: 50px;" :disabled="!isItemToLeft" @click="delSelcted()" />
                <el-button type="primary" icon="el-icon-arrow-right" circle style="margin-left: 0;" :disabled="!isItemToRight" @click="addSelcted()" />
            </el-col>
            <el-col style="width: 250px;">
                <el-card style="height: 303px; overflow-y: scroll;">
                    <el-row style=" margin-bottom: 10px; padding: 0 20px; line-height: 40px; background: #f5f7fa;">
                        <el-checkbox v-model="checkedOfSelected" @change="checkedAll('userListTree1')" /> 已分配人员
                    </el-row>
                    <el-input v-model="filterTextOfSelected" size="small" placeholder="搜索人员" style="padding-bottom: 10px;" />
                    <el-tree ref="userListTree1" :filter-node-method="filterNode1" node-key="label" :data="selectIdList" show-checkbox :props="selectListTreeProps" :expand-on-click-node="false" @node-click="treeNodeClick1" @check-change="userTree1" />
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
    },
    data() {
        return {
            userTypeName: '', // 此弹窗 title
            visible: false, // 此弹窗显示
            filterText: '',
            filterTextOfSelected: '',
            userList: [], // 可选
            selectIdList: [], // 已选
            isItemToRight: false,
            isItemToLeft: false,
            userListTreeProps: {
                label: function(data) {
                    // return data.realName + '（' + (data.workNum !== null && data.workNum !== '' ? data.workNum : data.workNumTemp) + '）';
                    return data.label;
                },
                children: ''
            },
            selectListTreeProps: {
                label: function(data) {
                    return data.label;
                },
                children: ''
            },
            orgTree: [],
            arrList: [],
            checkedOfUser: false,
            checkedOfSelected: false
        };
    },
    computed: {},
    watch: {
        filterText(val) {
            this.$refs.userListTree.filter(val);
        },
        filterTextOfSelected(val) {
            this.$refs.userListTree1.filter(val);
        }
    },
    mounted() {
        this.getTree();
    },
    methods: {
        init(userId, userTypeName) {
            this.userTypeName = userTypeName;
            this.visible = true;
            this.selectIdList = [];
            this.userList = [];
            if (userId && userId.length > 0) {
                userId.forEach((item) => {
                    this.selectIdList.push({ label: item });
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
                this.userList = data.data;
                if (this.userList) {
                    this.userList.map(item => {
                        item.label = item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）';
                    })
                }
                this.userList = this.userListFilter(this.userList, this.selectIdList)
                this.isItemToRight = false;
            });
        },
        // 过滤掉已选人员
        userListFilter(userList, selectList) {
            return selectList.length !== 0 ? userList.filter(item => !selectList.some(element => element.label === item.label)) : userList;
        },

        // 部门下树节点点击
        treeNodeClick(data) {
            if (JSON.stringify(this.$refs.userListTree.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
                const arr = this.$refs.userListTree.getCheckedNodes();
                arr.push(data);
                this.$refs.userListTree.setCheckedNodes(arr);
            }
        },
        // 选中树节点点击
        treeNodeClick1(data) {
            if (JSON.stringify(this.$refs.userListTree1.getCheckedNodes()).indexOf(JSON.stringify(data)) === -1) {
                const arr = this.$refs.userListTree1.getCheckedNodes();
                arr.push(data);
                this.$refs.userListTree1.setCheckedNodes(arr);
            }
        },
        // 往左
        delSelcted() {
            this.$refs.userListTree1.getCheckedNodes().forEach((item) => {
                this.selectIdList.splice(this.selectIdList.indexOf(item), 1);
                if (this.userList.findIndex(items => items.label === item.label) === -1) {
                    this.userList.push({
                        label: item.label
                    })
                }
            });
            // this.userList.sort((a, b) => {
            //     return Number(a.label.split('（')[1].slice(0, -1)) - Number(b.label.split('（')[1].slice(0, -1));
            // });
            this.isItemToLeft = false;
        },
        // 往右
        addSelcted() {
            this.$refs.userListTree.getCheckedNodes().forEach((item) => {
                const obj = {};
                obj.label = item.label;
                // obj.label = item.realName + '（' + (item.workNum !== null && item.workNum !== '' ? item.workNum : item.workNumTemp) + '）';
                if (JSON.stringify(this.selectIdList).indexOf(JSON.stringify(obj)) === -1) {
                    this.selectIdList.push(obj);
                }
                this.userList.splice(this.userList.findIndex(items => items.label === item.label), 1);
            });
        },
        // 部门搜索人员
        // filterNode(value, data) {
        //     if (!value) return true;
        //     // 如果没有workNum, 使用workNumTemp
        //     const workNum = data.workNum ? data.workNum : data.workNumTemp;
        //     return data.realName.indexOf(value) !== -1 || workNum.indexOf(value) !== -1;
        // },
        // 选中搜索人员
        filterNode1(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 部门下树节点选中状态监听
        userTree() {
            if (this.$refs.userListTree.getCheckedNodes().length > 0) {
                this.isItemToRight = true;
            } else {
                this.isItemToRight = false;
            }
        },
        // 选中树节点选中状态监听
        userTree1() {
            if (this.$refs.userListTree1.getCheckedNodes().length > 0) {
                this.isItemToLeft = true;
            } else {
                this.isItemToLeft = false;
            }
        },
        // 确定人员
        updateUser() {
            this.visible = false;
            const row = [];
            this.selectIdList.forEach(item => {
                row.push(item.label);
            });
            this.$emit('changeUser', row);
        },
        checkedAll(node) {
            if (node === 'userListTree') {
                if (this.checkedOfUser) {
                    this.$refs.userListTree.setCheckedNodes(this.userList);
                } else {
                    this.$refs.userListTree.setCheckedKeys([]);
                }
            } else {
                // eslint-disable-next-line
                if (this.checkedOfSelected) {
                    this.$refs.userListTree1.setCheckedNodes(this.selectIdList);
                } else {
                    this.$refs.userListTree1.setCheckedKeys([]);
                }
            }
        }
    }
};
</script>

<style scoped></style>
