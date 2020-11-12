<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :inline="true" size="small" :model="formHeader" label-width="80px" class="topform sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="formHeader.productDate" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 180px;" />
                </el-form-item>
                <el-form-item label="生产订单：">
                    <el-input v-model="formHeader.orderNo" type="text" clearable style="width: 140px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button type="primary" size="small" @click="GetDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <mds-card title="助滤剂审核" name="AuditList" :pack-up="false">
            <template slot="titleBtn">
                <div style="float: right; width: 688px; text-align: right;">
                    <el-form ref="pstngDate" :model="formHeader" :rules="plantListRule" size="small" :inline="true" label-position="right" label-width="82px" class="topforms">
                        <el-form-item label="记账日期：" prop="pstngDate">
                            <el-date-picker v-model="formHeader.pstngDate" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="抬头文本：">
                            <el-input v-model="formHeader.headerTxt" placeholder="抬头文本" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item style="float: right; margin-right: 0;">
                            <el-button type="primary" size="small" @click="subAutio()">
                                审核通过
                            </el-button>
                            <el-button type="danger" size="small" @click="repulseAutios()">
                                审核不通过
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="AuditList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxT" width="50" />
                <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                <el-table-column label="审核状态" width="100">
                    <template slot-scope="scope">
                        {{ scope.row.status === 'submit' ? '未审核' : scope.row.status === 'checked' ? (scope.row.interfaceReturnStatus === '0' ? '接口失败' : '审核通过') : scope.row.status === 'noPass' ? '审核不通过' : '' }}
                    </template>
                </el-table-column>
                <el-table-column prop="productDate" label="生产日期" :show-overflow-tooltip="true" width="100" />
                <el-table-column prop="orderNo" label="生产订单" :show-overflow-tooltip="true" width="130" />
                <el-table-column prop="confActiUnit3" label="生产物料" :show-overflow-tooltip="true" width="190">
                    <template slot-scope="scope">
                        {{ scope.row.materialNameH + ' ' + scope.row.materialCodeH }}
                    </template>
                </el-table-column>
                <el-table-column prop="planOutput" label="计划生产数量" :show-overflow-tooltip="true" width="110" />
                <el-table-column prop="outputUnitName" label="单位" :show-overflow-tooltip="true" width="50" />
                <el-table-column prop="confActiUnit3" label="组件物料" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="entryQnt" label="发料组件数量" :show-overflow-tooltip="true" width="110" />
                <el-table-column prop="entryUomName" label="单位" :show-overflow-tooltip="true" width="50" />
                <el-table-column prop="batch" label="物料批次" :show-overflow-tooltip="true" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" size="small" :disabled="!scope.row.redact" />
                    </template>
                </el-table-column>
                <el-table-column prop="stgeLoc" label="出库库位" :show-overflow-tooltip="true" width="80">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.stgeLoc" size="small" :disabled="!scope.row.redact" />
                    </template>
                </el-table-column>
                <el-table-column prop="manufacturer" label="厂家" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="workShopRemar" label="车间备注" :show-overflow-tooltip="true" width="80" />
                <el-table-column label="移动类型" width="78">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.moveType" size="small" :disabled="!scope.row.redact" />
                    </template>
                </el-table-column>
                <el-table-column label="移动原因" width="120">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.moveReas" placeholder="请选择" :disabled="!scope.row.redact" size="small">
                            <el-option label="请选择" value="" />
                            <el-option v-for="(item, index) in MoveReas" :key="index" :label="item.value" :value="item.code" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="stckType" label="库存类型" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="120" />
                <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" width="80">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" placeholder="手工录入" size="small" :disabled="!scope.row.redact" />
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="!((scope.row.status === 'checked' && scope.row.interfaceReturnStatus === '1') || scope.row.status === 'noPass')" class="ra_btn" type="primary" round size="mini" @click="redact(scope.row)">
                            {{ scope.row.redact ? '保存' : '编辑' }}
                        </el-button>
                        <el-button v-if="scope.row.status === 'checked' && (scope.row.interfaceReturnStatus === '1' || scope.row.interfaceReturnStatus === null)" class="ra_btn" type="warning" round size="mini" @click="ResetD(scope.row)">
                            反审
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        <el-dialog title="反审" :close-on-click-modal="false" :visible.sync="visibleRe">
            <p style="line-height: 42px;">
                请填写反审意见
            </p>
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleRe = false">取消</el-button>
                <el-button type="primary" @click="ResetIs()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getFactory, getWorkshop, dateFormat } from '@/net/validate';
import { AUDIT_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            dataListLoading: false,
            visible: false,
            visibleRe: false,
            formHeader: {
                factory: '',
                workShop: '',
                productDate: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                pstngDate: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate()),
                headerTxt: '',
                orderNo: '',
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            plantListRule: {
                pstngDate: [
                    {
                        required: true,
                        message: '记账日期不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            factory: [],
            workshop: [],
            MoveReas: [],
            Text: '',
            ReText: '',
            reData: {},
            multipleSelection: [],
            AuditList: []
        };
    },
    computed: {},
    watch: {
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            getWorkshop(this, n, '过滤');
        }
    },
    mounted() {
        this.GetMoveReas();
        getFactory(this);
    },
    methods: {
        GetDataList() {
            // if (!this.formHeader.factory || !this.formHeader.workShop) {
            //   this.$message.error('请选择工厂与车间')
            //   return
            // }
            // if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
            //   this.$message.error('生产日期或订单请选填一项')
            //   return false
            // }
            // this.GetMoveReas(this.formHeader.factory)
            this.$http(`${AUDIT_API.AUDIT_AID_LIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.AuditList = data.page.list;
                    this.formHeader.currPage = data.page.currPage;
                    this.formHeader.pageSize = data.page.pageSize;
                    this.formHeader.totalCount = data.page.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 编辑
        redact(row) {
            if (!row.redact) {
                row.redact = true;
                this.AuditList.splice(this.AuditList.length, 0, {});
                this.AuditList.splice(this.AuditList.length - 1, 1);
            } else {
                row.pstngDate = this.formHeader.pstngDate;
                row.status = '';
                this.$http(`${AUDIT_API.AUDIT_AID_UPDATE}`, 'POST', row).then(({ data }) => {
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
                    this.GetDataList();
                });
            }
        },
        // 审核拒绝
        repulseAutios() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择订单');
            } else {
                this.visible = true;
            }
        },
        repulseAutio() {
            if (this.Text.length <= 0) {
                this.$warningToast('请填写不通过原因');
            } else {
                this.$refs.pstngDate.validate(valid => {
                    if (valid) {
                        this.$confirm('确认审核不通过, 是否继续?', '审核不通过', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.multipleSelection.forEach(item => {
                                item.status = 'noPass';
                                item.memo = this.Text;
                                item.pstngDate = this.formHeader.pstngDate;
                            });
                            this.$http(`${AUDIT_API.AUDIT_AID_AUDIT}`, 'POST', this.multipleSelection).then(({ data }) => {
                                if (data.code === 0) {
                                    this.visible = false;
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.GetDataList();
                                } else {
                                    this.$errorToast(data.msg);
                                }
                            });
                        }).catch(() => {
                            // this.$infoToast('已取消删除');
                        });
                    }
                });
            }
        },
        // 审核通过
        subAutio() {
            if (this.multipleSelection.length <= 0) {
                this.$warningToast('请选择订单');
            } else {
                this.$refs.pstngDate.validate(valid => {
                    if (valid) {
                        this.$confirm('确认审核通过, 是否继续?', '审核通过', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            this.multipleSelection.forEach(item => {
                                item.status = 'checked';
                                item.memo = '审核通过';
                                item.pstngDate = this.formHeader.pstngDate;
                                item.headerTxt = this.formHeader.headerTxt;
                            });
                            this.$http(`${AUDIT_API.AUDIT_AID_AUDIT}`, 'POST', this.multipleSelection).then(({ data }) => {
                                if (data.code === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.GetDataList();
                                } else {
                                    this.$errorToast(data.msg);
                                    this.GetDataList();
                                }
                            });
                        }).catch(() => {
                            // this.$infoToast('已取消删除');
                        });
                    }
                });
            }
        },
        // 反审
        ResetD(row) {
            this.visibleRe = true;
            this.reData = row;
        },
        ResetIs() {
            this.$confirm('部分数据已经调用SAP接口已发料，请确认sap冲销，确认要反审？', '反审', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.reData.status = 'submit';
                this.reData.memo = this.ReText;
                this.dataListLoading = true;
                this.$http(`${AUDIT_API.AUDIT_AID_RESET}`, 'POST', this.reData).then(({ data }) => {
                    this.dataListLoading = false;
                    if (data.code === 0) {
                        this.visibleRe = false;
                        this.ReText = '';
                        this.reData = {};
                        this.GetDataList();
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
        },
        // 获取移动原因
        GetMoveReas() {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                type: 'move_reas'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.MoveReas = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 审核通过禁用
        checkboxT(row) {
            if ((row.status === 'checked' && (row.interfaceReturnStatus === '1' || row.interfaceReturnStatus === null)) || row.status === 'noPass') {
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
        // 序号
        indexMethod(index) {
            return index + 1 + (Number(this.formHeader.currPage) - 1) * (Number(this.formHeader.pageSize));
        }
    }
};
</script>

<style scoped></style>
