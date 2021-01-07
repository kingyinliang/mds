<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row" @keyup.enter.native="GetAuditList()" @submit.native.prevent>
                        <el-form-item label="生产工厂：">
                            <el-select v-model="plantList.factory" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="plantList.workShop" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <el-select v-model="plantList.productLine" placeholder="产线" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="日期：" label-width="50px">
                            <el-date-picker v-model="plantList.startDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 140px;" /> - <el-date-picker v-model="plantList.endDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 140px;" />
                        </el-form-item>
                        <el-form-item label="考勤类型：">
                            <el-select v-model="plantList.kqlx" placeholder="请选择" size="small" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(iteam, index) in ARtype" :key="index" :label="iteam.value" :value="iteam.code" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="人员：">
                            <el-input v-model="plantList.userId" placeholder="请输入" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="审核状态：">
                            <el-select v-model="plantList.status" placeholder="请选择" style="width: 160px;">
                                <el-option label="请选择" value="" />
                                <el-option label="未审核" value="submit" />
                                <el-option label="审核通过" value="checked" />
                                <el-option label="审核不通过" value="noPass" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="floatr">
                            <el-button v-if="isAuth('sys:att:listAtt')" type="primary" size="small" @click="GetAuditList(true)">
                                查询
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <mds-card title="考勤审核" name="AuditList" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; width: 688px; text-align: right;">
                    <el-button v-if="isAuth('sys:att:auditAtt')" type="primary" size="small" @click="subAutio">
                        审核通过
                    </el-button>
                    <el-button v-if="isAuth('sys:att:auditAtt')" type="danger" size="small" @click="repulseAutios">
                        审核不通过
                    </el-button>
                </div>
            </template>
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="AuditList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxT" width="50" />
                <el-table-column label="审核状态" min-width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status === 'submit' ? '未审核' : scope.row.status === 'checked' ? '审核通过' : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="reqno" label="订单号" :show-overflow-tooltip="true" min-width="170" />
                <el-table-column prop="kqrq" label="日期" :show-overflow-tooltip="true" min-width="120" />
                <el-table-column prop="workShopName" label="车间" :show-overflow-tooltip="true" min-width="120" />
                <el-table-column prop="kqdlName" label="考勤大类" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="kqlxName" label="考勤类型" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="productLineName" label="产线" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="deptIdName" label="班组" :show-overflow-tooltip="true" min-width="100" />
                <el-table-column prop="userType" label="人员属性" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="userId" label="姓名（工号）" :show-overflow-tooltip="true" min-width="160" />
                <el-table-column prop="classTypeName" label="白/中/夜班" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="content" label="工作内容" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="timedTime" label="计时时数（小时）" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="pieceTime" label="计件时数（小时）" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="workTime" label="出勤时数（小时）" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="remark" label="考勤备注" :show-overflow-tooltip="true" min-width="80" />
                <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" min-width="80" />
            </el-table>
            <el-row>
                <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-row>
        </mds-card>
        <el-dialog title="审核拒绝" :close-on-click-modal="false" :visible.sync="visible">
            <p style="line-height: 42px;">
                请填写不通过原因
            </p>
            <el-input v-model="Text" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="repulseAutio()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API, AUDIT_API, SYSTEMSETUP_API, AR_API } from '@/api/api';
import { headanimation } from '@/net/validate';
// import { export_json_to_excel } from '@/vendor/Export2Excel'
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            lodingStatus1: false,
            dataListLoading: false,
            visible: false,
            factory: [],
            workshop: [],
            productline: [],
            ARtype: [],
            Text: '',
            plantList: {
                isAudit: '1',
                orderNo: '',
                factory: '',
                workShop: '',
                productLine: '',
                startDate:
                    new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() +
                    '-' +
                    (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1 >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) +
                    '-' +
                    (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : '0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate()),
                endDate: '',
                kqlx: '',
                userId: '',
                status: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            AuditList: [],
            multipleSelection: []
        };
    },
    computed: {},
    watch: {
        'plantList.factory'(n) {
            this.Getdeptbyid(n);
            this.GetARtype(n);
        },
        'plantList.workShop'(n) {
            this.GetParentline(n);
        }
    },
    mounted() {
        this.Getdeptcode();
        headanimation(this.$);
    },
    methods: {
        /* eslint-disable no-shadow */
        // 获取考勤类型
        GetARtype() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'other_time'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.ARtype = data.dicList;
                    this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                        type: 'normal_time'
                    }).then(({ data }) => {
                        if (data.code === 0) {
                            this.ARtype = this.ARtype.concat(data.dicList);
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        /* eslint-enable no-shadow */
        // 获取列表
        GetAuditList(st) {
            if (st) {
                this.plantList.currPage = 1;
            }
            this.dataListLoading = true;
            this.$http(`${AR_API.ARLIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.AuditList = data.page.list;
                    this.plantList.currPage = data.page.currPage;
                    this.plantList.pageSize = data.page.pageSize;
                    this.plantList.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
                this.dataListLoading = false;
            });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.plantList.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.plantList.workShop = '';
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (!this.plantList.workShop && data.typeList.length > 0) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshop = [];
            }
        },
        // 获取产线
        GetParentline(id) {
            this.plantList.productLine = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', {
                    parentId: id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.productline = data.childList;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.productline = [];
            }
        },
        // 表格选中
        handleSelectionChange(val) {
            this.multipleSelection = [];
            val.forEach((item) => {
                this.multipleSelection.push(item);
            });
        },
        // 审核通过禁用
        checkboxT(row) {
            if (row.status === 'checked' || row.status === 'noPass') {
                return 0;
            }
                return 1;

        },
        // 编辑
        redact(row) {
            if (!row.redact) {
                row.redact = true;
                this.AuditList.splice(this.AuditList.length, 0, {});
                this.AuditList.splice(this.AuditList.length - 1, 1);
            } else {
                row.postgDate = this.plantList.postgDate;
                row.status = '';
                this.lodingStatus1 = true;
                this.$http(`${AUDIT_API.AUDITHOURSUPDATE_API}`, 'POST', [row]).then(({ data }) => {
                    this.lodingStatus1 = false;
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        row.redact = false;
                        this.AuditList.splice(this.AuditList.length, 0, {});
                        this.AuditList.splice(this.AuditList.length - 1, 1);
                    } else {
                        this.$errorToast(data.msg);
                    }
                    this.GetAuditList();
                });
            }
        },
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.plantList.currPage) - 1) * (Number(this.plantList.pageSize));
        },
        // 审核拒绝
        repulseAutios() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择考勤');
            } else {
                this.visible = true;
            }
        },
        repulseAutio() {
            if (this.Text.length <= 0) {
                this.$warningToast('请填写不通过原因');
            } else {
                this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(item => {
                        item.status = 'noPass';
                        item.memo = this.Text;
                    });
                    this.lodingStatus1 = true;
                    this.$http(`${AR_API.ARAUDIT_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                        this.lodingStatus1 = false;
                        if (data.code === 0) {
                            this.visible = false;
                            this.Text = '';
                            this.GetAuditList();
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }).catch(() => {
                // this.$infoToast('已取消删除');
                });
            }
        },
        // 审核通过
        subAutio() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择订单');
            } else {
                this.$confirm('确认审核通过, 是否继续?', '审核通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.multipleSelection.forEach(item => {
                        item.status = 'checked';
                        item.memo = '审核通过';
                    });
                    this.lodingStatus1 = true;
                    this.$http(`${AR_API.ARAUDIT_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                        this.lodingStatus1 = false;
                        if (data.code === 0) {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetAuditList();
                        } else {
                            this.GetAuditList();
                            this.$errorToast(data.msg);
                        }
                    });
                }).catch(() => {
                // this.$infoToast('已取消删除');
                });
            }
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.plantList.pageSize = val;
            this.GetAuditList();
        },
        // 跳转页数
        handleCurrentChange(val) {
            this.plantList.currPage = val;
            this.GetAuditList();
        }
    }
};
</script>

<style lang="scss">
.searchCard {
    margin-bottom: 0;
}
.searchCard,
.tableCard {
    position: relative;
    .toggleSearchTop {
        position: absolute;
        top: 0;
        left: 0;
        display: none;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .toggleSearchBottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        text-align: center;
        cursor: pointer;
    }
    .el-icon-caret-top::before,
    .el-icon-caret-bottom::before {
        color: #dcdfe6;
    }
}
.topforms {
    .el-date-editor.el-input {
        width: auto;
    }
}
</style>
