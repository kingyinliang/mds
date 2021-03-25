<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="multi_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factoryIDValue" class="w300" placeholder="请选择" clearable>
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="批次：" label-width="50px">
                    <el-input v-model="formHeader.batch" placeholder="请输入" style="width: 160px;" clearable />
                </el-form-item>
                <el-form-item label="审核状态：">
                    <el-select v-model="formHeader.status" placeholder="请选择" style="width: 160px;">
                        <el-option label="请选择" value="" />
                        <el-option label="已保存" value="saved" />
                        <el-option label="已提交" value="submit" />
                        <el-option label="审核通过" value="checked" />
                        <el-option label="审核不通过" value="noPass" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <template style="float: right; margin-left: 10px;">
                        <el-button v-if="isAuth('gra:dept:list')" type="primary" size="small" @click="getDataList(true)">
                            查 询
                        </el-button>
                    </template>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="部门领用列表" :pack-up="false" style="margin-top: 5px;">
            <template slot="titleBtn">
                <div style="float: right; margin-bottom: 5px;">
                    <el-button v-if="isAuth('gra:dept:save')" type="primary" size="small" :disabled="!isRedact" @click="AddRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table :data="dataList" border class="newTable" tooltip-effect="dark" header-row-class-name="tableHead" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxT" width="50" fixed />
                <el-table-column type="index" label="序号" width="55" />
                <el-table-column label="状态" min-width="93" prop="statusName" />
                <el-table-column label="领用物料" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column min-width="180" :show-overflow-tooltip="true">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>领用中心</span>
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.costCenter" value-key="costCenter" placeholder="请选择" :disabled="!isRedact || scope.row.status === 'checked' || scope.row.status === 'submit'" size="small" @change="changeCost($event, scope.row)">
                            <el-option v-for="(item, index) in costList" :key="index" :label="item.costCenterName + ' ' + item.costCenter" :value="item.costCenter" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" prop="batch">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>批次</span>
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.batch" value-key="productCode" placeholder="请选择" :disabled="!isRedact || scope.row.status === 'checked' || scope.row.status === 'submit'" size="small" @change="changeBatch($event, scope.row)">
                            <el-option v-for="(item, index) in batchList" :key="index" :label="item.batch" :value="item.batch" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" prop="kjmAmount">
                    <template slot="header">
                        <em class="reqI">*</em>
                        <span>领用量</span>
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.useAmount" size="mini" placeholder="手工录入" :disabled="!isRedact || scope.row.status === 'checked' || scope.row.status === 'submit'" />
                    </template>
                </el-table-column>
                <el-table-column label="领用人" min-width="150" prop="kjmAmount" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <div class="required" style="line-height: 32px;">
                            <span v-if="!isRedact || scope.row.status === 'checked' || scope.row.status === 'submit'">
                                <em v-for="(item, index) in scope.row.useMan" :key="index">{{ item }}，</em>
                            </span>
                            <span v-else style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.useMan" :key="index">{{ item }}，</em>
                                <em>点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="用途" min-width="100" prop="kjmAmount">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.useRemark" size="mini" :disabled="!isRedact || scope.row.status === 'checked' || scope.row.status === 'submit'" placeholder="手工录入" />
                    </template>
                </el-table-column>
                <el-table-column label="领用时间" min-width="110" prop="productDate" :show-overflow-tooltip="true" />
                <el-table-column label="记账日期" min-width="80" prop="pstngDate" :show-overflow-tooltip="true" />
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="showMoreDetail(scope.row)">
                            <em class="iconfont factory-fangdajing-copy" style="margin-right: 5px; font-size: 12px;" />审核日志
                        </el-button> &nbsp;
                        <el-button v-if="scope.row.status !== 'submit' && scope.row.status !== 'checked'" type="text" style="color: red;" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="delData(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-pagination :current-page="formHeader.currPage" :page-sizes="[10, 20, 30]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <!--编辑-->
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_btn">
                        <el-button v-if="isAuth('gra:dept:save')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                            {{ isRedact ? '取消' : '编辑' }}
                        </el-button>
                        <template v-if="isRedact" style="float: right; margin-left: 10px;">
                            <el-button type="primary" size="small" @click="savedorSumbitData('saved')">
                                保存
                            </el-button>
                            <el-button type="primary" size="small" @click="savedorSumbitData('submit')">
                                提交
                            </el-button>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :close-on-click-modal="false" :visible.sync="isShowMessageBoxAuditLog" width="950px" custom-class="dialog__class bg_dialog">
            <div slot="title" class="title">
                <span>审核日志</span>
            </div>
            <el-table header-row-class-name="" :data="auditLog" border tooltip-effect="dark" class="newTable">
                <el-table-column type="index" label="序号" width="55" align="center" fixed />
                <el-table-column label="审核动作" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.status === 'checked' ? "通过" : '不通过' }}
                    </template>
                </el-table-column>
                <el-table-column label="审核意见" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.memo }}
                    </template>
                </el-table-column>
                <el-table-column label="审核人" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.verifyMan }}
                    </template>
                </el-table-column>
                <el-table-column label="审核时间" :show-overflow-tooltip="true" align="right" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.verifyDate }}
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
        <loaned-personnel v-if="loanedPersonnelStatus" ref="loanedPersonnel" :org-tree="OrgTree" :title="'领用人'" :arr-list="arrList" @changeUser="changeUser" />
    </div>
</template>

<script>
import { BASICDATA_API, INVENTORY_API } from '@/api/api';
import LoanedPersonnel from '@/views/components/LoanedPersonnel';
export default {
    name: 'Index',
    components: {
        LoanedPersonnel
    },
    data() {
        return {
            isRedact: false,
            factoryList: [],
            formHeader: {
                batch: '',
                status: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            dataList: [],
            auditLog: [],
            costList: [],
            batchList: [],
            loanedPersonnelStatus: false,
            OrgTree: [],
            arrList: [],
            row: {},
            multipleSelection: [],
            isShowMessageBoxAuditLog: false
        };
    },
    computed: {
        sidebarFold: {
            get() {
                return this.$store.state.common.sidebarFold;
            }
        }
    },
    watch: {},
    mounted() {
        this.getFactory();
        this.getCostCenterList();
        this.getBatchList();
    },
    methods: {
        // 获取工厂
        getFactory() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(({ data }) => {
                this.factoryList = data.typeList;
                this.formHeader.factoryIDValue = this.factoryList[0]['deptId'];
            });
        },
        // 领用中心
        getCostCenterList() {
            this.$http(`${INVENTORY_API.Y010_LIST_COSTCENTER_LIST_API}`, `POST`, {}, false, false, false).then(({ data }) => {
                this.costList = data.info;

            });
        },
        // 批次
        getBatchList() {
            this.$http(`${INVENTORY_API.Y010_LIST_BATCH_LIST_API}`, `POST`, {}, false, false, false).then(({ data }) => {
                this.batchList = data.info;
            });
        },
        // 获取组织结构树
        getTree(factory) {
            this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', { flag: factory }, false, false, false).then(({ data }) => {
                // this.$http(`${BASICDATA_API.ORGSTRUCTURE_API}`, 'GET', {}).then(({data}) => {
                if (data.code === 0) {
                    this.OrgTree = data.deptList;
                    this.arrList = [this.OrgTree[0].children[0].deptId];
                } else {
                    this.$notify.error({ title: '错误', message: data.msg });
                }
            });
        },
        // 选择人员 正式借调
        selectUser(row) {
            this.row = row;
            this.loanedPersonnelStatus = true;
            this.$nextTick(() => {
                this.$refs.loanedPersonnel.init(row.useMan);
            });
        },
        // 员工确认
        changeUser(userId) {
            this.row.useMan = userId;
            if (this.att) {
                this.SetAtt();
            }
            this.loanedPersonnelStatus = false;
        },
        // 查询
        getDataList(st) {
            this.dataList = [];
            this.isRedact = false;
            if (st) {
                this.formHeader.currPage = 1;
            }
            this.$http(`${INVENTORY_API.Y010_INVENTORY_DEPT_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.formHeader.totalCount = data.info.totalCount;
                    this.dataList = data['info']['list'];
                    this.auditLog = [];
                    this.getTree(this.formHeader.factoryIDValue);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 领用中心
        changeCost(val, row) {
            const costSole = this.costList.find(item => (item.costCenter === val));
            row['costCenterName'] = costSole['costCenterName'];
            row['costCenter'] = costSole['costCenter'];
            row['deptId'] = costSole['deptId'];
            row['deptName'] = costSole['deptName'];
        },
        changeBatch(val, row) {
            const batchSole = this.batchList.find(item => (item.batch === val));
            row['holderId'] = batchSole['holderId'];
        },
        // 新增
        AddRow() {
            this.dataList.push({
                materialName: 'Y010',
                materialCode: 'A030300007',
                costCenterString: '',
                batch: '',
                useAmount: '',
                useMan: [],
                useRemark: '',
                status: ''
            })
        },
        // 复选框
        checkboxT(row) {
            if (row.status === 'checked' || row.status === 'submit' || row.status === 'failure' || this.isRedact === false) {
                return 0;
            }
            return 1;
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        savedorSumbitData(state) {
            if (this.multipleSelection.length === 0) {
                this.$infoToast('请勾选数据');
                return false;
            }
            for (const item of this.dataList) {
                if (!item.costCenter || !item.batch || !item.useAmount) {
                    this.$infoToast('请填写必填项');
                    return false;
                }
            }
            let url = '';
            if (state === 'saved') {
                url = INVENTORY_API.Y010_SAVE_API;
            } else {
                url = INVENTORY_API.Y010_SUBMIT_API;
            }
            this.$http(`${url}`, 'POST', this.multipleSelection).then(({ data }) => {
                if (data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '操作成功',
                        type: 'success'
                    });
                    this.getDataList(true);
                    this.isRedact = false;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 删除
        delData(row) {
            if (row.status === '') {
                this.dataList.splice(this.dataList.indexOf(row), 1);
            } else {
                this.$http(`${INVENTORY_API.Y010_INVENTORY_DEPT_DELETE_API}`, 'GET', {
                    id: row.id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getDataList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        showMoreDetail(row) {
            this.$http(`${INVENTORY_API.Y010_INVENTORY_DEPT_LOG_LIST_API}`, 'GET', {
                id: row.id
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.auditLog = data.info;
                    this.isShowMessageBoxAuditLog = true;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
            this.formHeader.currPage = 1;
            this.getDataList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.formHeader.currPage = val;
            this.getDataList();
        }
    }
};
</script>

<style scoped>
.reqI {
    color: red;
}
.button_three_goup {
    position: relative;
    top: 0;
    right: 0;
    padding: 10px;
}
</style>
