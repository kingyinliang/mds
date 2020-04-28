<template>
    <el-col>
        <div class="main">
            <el-card>
                <el-row class="clearfix">
                    <div style="float: right;">
                        <el-form :inline="true" :model="condition" size="small" label-width="68px" class="topforms2">
                            <el-form-item>
                                <el-input v-model="condition.param" placeholder="用户名/工号" suffix-icon="el-icon-search" clearable @clear="getItemsList()" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" :disabled="condition.param.trim()===''" @click="getItemsList(true)">
                                    查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-row>
                <el-row type="flex" :gutter="20">
                    <el-col :span="8">
                        <el-card>
                            <div slot="header" class="clearfix">
                                <span>组织架构</span>
                            </div>
                            <el-tree :data="orgTree" node-key="id" :default-expanded-keys="arrList" :expand-on-click-node="false" :props="{label: 'deptName',children:'children'}" @node-click="showOrgDetail" />
                        </el-card>
                    </el-col>
                    <el-col :span="16">
                        <el-card>
                            <div slot="header" class="clearfix">
                                人员
                            </div>
                            <div>
                                <el-button type="danger" style="float: right; margin: 0 20px 20px 0;" size="small" :disabled="targetInfoList.length===0" @click="removeItems()">
                                    批量删除
                                </el-button>
                                <el-button type="primary" style="float: right; margin: 0 20px 20px 0;" size="small" @click="addOrUpdateItem()">
                                    增加
                                </el-button>
                                <el-table ref="targetInfoList" :data="targetInfoList" header-row-class-name="tableHead" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                                    <el-table-column v-if="targetInfoList.length!==0" type="selection" width="50" />
                                    <el-table-column type="index" :index="indexMethod" width="40" />
                                    <el-table-column prop="workNum" label="人员工号" width="100" />
                                    <el-table-column prop="workNumTemp" label="虚拟工号" width="110" />
                                    <el-table-column prop="realName" label="人员姓名" width="87" />
                                    <el-table-column prop="deptName" label="所属部门" width="87" :show-overflow-tooltip="true" />
                                    <el-table-column prop="post" label="职务" :show-overflow-tooltip="true" width="150" />
                                    <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true" width="250" />
                                    <el-table-column prop="mobile" label="手机号" :show-overflow-tooltip="true" width="112" />
                                    <el-table-column prop="created" label="创建日期" width="160" />
                                    <el-table-column label="操作" fixed="right" width="65">
                                        <template slot-scope="scope">
                                            <el-button style="padding: 0;" type="text" @click="addOrUpdateItem(scope.row.id)">
                                                编辑
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <el-row v-if="targetInfoList.length!==0">
                                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <user-add-or-update v-if="isDialogShow" ref="addOrUpdateItem" :org-tree="orgTree" @refreshDataList="getItemsList" />
    </el-col>
</template>

<script>
import { COMMON_API } from 'common/api/api';
import UserAddOrUpdate from './UserAddOrUpdate';
export default {
    name: 'UserManages',
    components: {
        UserAddOrUpdate
    },
    data() {
        return {
            condition: {
                param: ''
            },
            isDialogShow: false,
            deptID: '',
            deptName: '',
            orgTree: [],
            targetInfoList: [],
            multipleSelection: [],
            multipleSelectionTemp: [],
            totalCount: 1,
            currPage: 1,
            arrList: [],
            pageSize: 10
        };
    },
    computed: {},
    mounted() {
        this.getTree();
    },
    methods: {
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        },
        // 获取组织结构树
        getTree() {
            COMMON_API.ORGSTRUCTURE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.orgTree = data.data;
                    this.arrList = this.orgTree[0].children.length !== 0 ? [this.orgTree[0].children[0].id] : [];
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 根据deptId查询用户
        showOrgDetail(data) {
            this.deptID = data.id;
            this.deptName = data.deptName;
            this.getItemsList();
        },
        // 获取列表
        getItemsList(haveParas) {
            if (haveParas) {
                this.currPage = 1;
            }
            if (!this.deptID) {
                this.$notify.error({ title: '错误', message: '请选择组织层级' });
                return;
            }
            COMMON_API.USER_ROLE_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.deptID,
                realName: this.condition.param,
                current: JSON.stringify(this.currPage),
                size: JSON.stringify(this.pageSize)
            }).then(({ data }) => {
                if (data.code === 200) {
                    if (haveParas && data.data.records.length === 0) {
                            this.$infoToast('该搜寻条件无任何资料！');
                    }
                    this.multipleSelection = [];
                    this.targetInfoList = data.data.records;
                    this.currPage = data.data.current;
                    this.pageSize = data.data.size;
                    this.totalCount = data.data.total;
                } else {
                    this.$errorToast(data.msg);
                }
                this.isDialogShow = false;
            });
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelectionTemp = val;
        },
        // 新增  修改
        addOrUpdateItem(id) {
            if (this.deptID) {
                this.isDialogShow = true;
                this.$nextTick(() => {
                    this.$refs.addOrUpdateItem.init(this.deptID, this.deptName, id);
                });
            } else {
                this.$notify.error({ title: '错误', message: '请先选择部门' });
            }
        },
        // 删除
        removeItems() {
            this.multipleSelection = [];
                this.multipleSelectionTemp.forEach(item => {
                    this.multipleSelection.push(item.id);
                });
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的用户');
            } else {
                const roleName = [];
                const userID = [];
                this.multipleSelection.forEach(item => {
                    if (item.roles) {
                        item.roles.forEach(subItem => {
                            roleName.push(subItem.roleName);
                        })
                    }
                    userID.push(item.id);
                });
                if (roleName.length) {
                    this.$confirm(`有 ${roleName.join(',')}权限，不能删除，请联系IT`, '删除用户', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    //    then
                    }).catch(() => {
                        // this.$infoToast('已取消删除');
                    });
                } else {
                    this.$confirm('此用户无权限，是否删除?', '删除用户', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            COMMON_API.USER_DELETE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                ids: userID
                            }).then(({ data }) => {
                                if (data.code === 200) {
                                    this.$successToast('删除成功!');
                                    this.multipleSelection = [];
                                    this.getItemsList();
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            });
                        })
                        .catch(() => {
                        //    catch
                        });
                }
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getItemsList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getItemsList();
        }
    }
};
</script>

<style scoped></style>
