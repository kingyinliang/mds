<template>
    <div>
        <org-view
            ref="orgView"
            :title="'人员管理'"
            :right-tile="'人员'"
            :type="'table'"
            @treeNodeClick="showOrgDetail"
        >
            <template slot="view" style="padding-top: 16px;">
                <div class="view-btn">
                    <el-input v-model="controllableForm.param" placeholder="工号/姓名" size="small" suffix-icon="el-icon-search" clearable style="width: 180px; margin-right: 16px;" @clear="getItemsList()" />
                    <el-button type="primary" size="small" :disabled="controllableForm.param.trim()===''" @click="getItemsList(true)">
                        查询
                    </el-button>
                    <el-button type="danger" size="small" :disabled="targetInfoList.length===0" @click="removeItems()">
                        批量删除
                    </el-button>
                    <el-button type="primary" size="small" @click="addOrUpdateItem()">
                        增加
                    </el-button>
                </div>
                <el-table ref="targetInfoList" class="newTable" :data="targetInfoList" :height="mainClientHeight - 52 - 155" header-row-class-name="tableHead" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" fixed align="center" />
                    <el-table-column type="index" label="序号" :index="indexMethod" width="50" />
                    <el-table-column prop="workNum" label="人员工号" width="120" />
                    <el-table-column prop="realName" label="人员姓名" width="100" />
                    <el-table-column prop="deptName" label="所属部门" width="100" :show-overflow-tooltip="true" />
                    <el-table-column prop="sex" label="性别" :show-overflow-tooltip="true" width="60" :formatter="sexFormatter" />
                    <el-table-column prop="post" label="职务" :show-overflow-tooltip="true" width="160" />
                    <el-table-column prop="email" label="邮箱" :show-overflow-tooltip="true" width="260" />
                    <el-table-column prop="phone" label="手机号" :show-overflow-tooltip="true" width="120" />
                    <el-table-column prop="created" label="创建日期" width="180" />
                    <el-table-column v-if="targetInfoList.length!==0" label="操作" fixed="right" width="65">
                        <template slot-scope="scope">
                            <el-button style="padding: 0;" type="text" @click="addOrUpdateItem(scope.row.id)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </template>
        </org-view>
        <staff-add-or-update v-if="isDialogShow" ref="addOrUpdateItem" :org-tree="orgTree" @refreshDataList="getItemsList" />
    </div>
</template>

<script>
import { COMMON_API } from 'common/api/api';
import StaffAddOrUpdate from './StaffAddOrUpdate';
export default {
    name: 'StaffManages',
    components: {
        StaffAddOrUpdate
    },
    data() {
        return {
            controllableForm: {
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
    computed: {
        mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }
    },
    methods: {
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.currPage) - 1) * (Number(this.pageSize));
        },
        // 根据deptId查询用户
        showOrgDetail(data) {
            this.deptID = data.id;
            this.deptName = data.deptName;
            this.getItemsList();
        },
        // 获取列表
        getItemsList(hasParas) {
            if (hasParas) {
                this.currPage = 1;
            }
            if (!this.deptID) {
                this.$notify.error({ title: '错误', message: '请选择组织层级' });
                return;
            }
            COMMON_API.USER_ROLE_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptId: this.deptID,
                workNum: this.controllableForm.param,
                current: this.currPage,
                size: this.pageSize
            }).then(({ data }) => {
                if (hasParas && data.data.records.length === 0) {
                        this.$infoToast('暂无任何内容');
                }
                this.multipleSelection = [];
                this.targetInfoList = data.data.records;
                this.targetInfoList.forEach(item => {
                    // if (item.tempFlag === 'Y') {
                    //     item.workNumTemp = item.workNum;
                    //     item.workNum = '';
                    // }
                    item.deptName = item.sysDept.deptName;
                })
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
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
                this.multipleSelectionTemp.forEach(item => {
                    if (item.roles.length !== 0) {
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
                            }).then(() => {
                                this.multipleSelection = [];
                                this.getItemsList();
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
        },
        sexFormatter(row) {
            if (row.sex === 'M') {
                return '男'
            } else if (row.sex === 'F') {
                return '女'
            }
                return ''


        }
    }
};
</script>

<style lang="scss" scoped>
    .view-btn {
        float: right;
        margin-bottom: 10px;
    }
</style>
