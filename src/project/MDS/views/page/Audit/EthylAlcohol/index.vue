<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-form :inline="true" size="small" :model="formHeader" label-width="70px" class="topform sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 190px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item> -->
                <el-form-item label="领用中心：">
                    <el-select v-model="formHeader.costCenter" placeholder="请选择" clearable style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(item, index) in costList" :key="index" :label="item.costCenterName + ' ' + item.costCenter" :value="item.costCenter" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="formHeader.productDate" type="date" clearable placeholder="请选择" value-format="yyyy-MM-dd" style="width: 140px;" />
                </el-form-item>
                <el-form-item label="订单状态：">
                    <el-select v-model="formHeader.status" placeholder="请选择" clearable style="width: 150px;">
                        <el-option label="请选择" value="" />
                        <el-option label="已提交" value="submit" />
                        <el-option label="审核通过" value="checked" />
                        <el-option label="审核不通过" value="noPass" />
                        <el-option label="接口失败" value="failure" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('gra:dept:checked')" type="primary" size="small" @click="getDataList(true)">
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
                            <el-date-picker v-model="formHeader.pstngDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="抬头文本：">
                            <el-input v-model="formHeader.headerTxt" placeholder="抬头文本" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item style="float: right; margin-right: 0;">
                            <el-button v-if="isAuth('gra:dept:checked')" type="primary" size="small" @click="subAutio()">
                                审核通过
                            </el-button>
                            <el-button v-if="isAuth('gra:dept:checked')" type="danger" size="small" @click="repulseAutios()">
                                审核不通过
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="AuditList" border tooltip-effect="dark" style="width: 100%;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" :selectable="checkboxT" width="50" />
                <el-table-column type="index" label="序号" :index="indexMethod" width="55" fixed />
                <el-table-column label="状态" prop="statusName" :show-overflow-tooltip="true" width="90" />
                <el-table-column label="领用物料" :show-overflow-tooltip="true" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.materialName + ' ' + scope.row.materialCode }}
                    </template>
                </el-table-column>
                <el-table-column prop="location" label="库位" :show-overflow-tooltip="true" width="85" />
                <el-table-column prop="deptName" label="领用部门" :show-overflow-tooltip="true" width="110" />
                <el-table-column prop="moveType" label="移动类型" :show-overflow-tooltip="true" width="85" />
                <el-table-column prop="moveReasName" label="移动原因" :show-overflow-tooltip="true" width="100" />
                <el-table-column prop="batch" label="批次" :show-overflow-tooltip="true" width="110" />
                <el-table-column prop="useAmount" label="领用量" :show-overflow-tooltip="true" width="90" />
                <el-table-column prop="useMan" label="领用人" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <div class="required" style="line-height: 32px;">
                            <span>
                                <em v-for="(item, index) in scope.row.useMan" :key="index">{{ item }}，</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="useRemark" label="用途" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="memo" label="审核意见" :show-overflow-tooltip="true" width="80" />
                <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="120" />
                <el-table-column fixed="right" label="操作" width="75">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 'checked' && isAuth('gra:dept:reset')" class="ra_btn" type="warning" round size="mini" @click="ResetD(scope.row)">
                            反审
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="width: 100%; margin-bottom: 20px;">
                <el-pagination :current-page="formHeader.currPage" :page-sizes="[10, 20, 50]" :page-size="formHeader.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="formHeader.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
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
import { getFactory, dateFormat } from '@/net/validate';
import { AUDIT_API, INVENTORY_API } from '@/api/api';
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
            costList: [],
            MoveReas: [],
            Text: '',
            ReText: '',
            reData: {},
            multipleSelection: [],
            AuditList: []
        };
    },
    computed: {},
    watch: {},
    mounted() {
        getFactory(this);
        this.getCostCenterList();
    },
    methods: {
        // 领用中心
        getCostCenterList() {
            this.$http(`${INVENTORY_API.Y010_LIST_COSTCENTER_LIST_API}`, `POST`, {}, false, false, false).then(({ data }) => {
                this.costList = data.info;
            });
        },
        getDataList() {
            if (!this.formHeader.factory) {
              this.$message.error('请选择工厂')
              return
            }
            // if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
            //   this.$message.error('生产日期或订单请选填一项')
            //   return false
            // }
            // this.GetMoveReas(this.formHeader.factory)
            this.$http(`${AUDIT_API.AUDIT_ETHYLALCOHOL_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.AuditList = data.info.list;
                    this.formHeader.currPage = data.info.currPage;
                    this.formHeader.pageSize = data.info.pageSize;
                    this.formHeader.totalCount = data.info.totalCount;
                } else {
                    this.$errorToast(data.msg);
                }
            });
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
                this.reData.memo = this.ReText;
                this.dataListLoading = true;
                this.$http(`${AUDIT_API.AUDIT_ETHYLALCOHOL_RESET_API}`, 'POST', this.reData).then(({ data }) => {
                    this.dataListLoading = false;
                    if (data.code === 0) {
                        this.visibleRe = false;
                        this.ReText = '';
                        this.reData = {};
                        this.getDataList();
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
                                item.memo = this.Text;
                                item.pstngDate = this.formHeader.pstngDate;
                            });
                            this.$http(`${AUDIT_API.AUDIT_ETHYLALCOHOL_PASS_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                                if (data.code === 0) {
                                    this.visible = false;
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.getDataList();
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
                                item.memo = '审核通过';
                                item.pstngDate = this.formHeader.pstngDate;
                                item.headerTxt = this.formHeader.headerTxt;
                            });
                            this.$http(`${AUDIT_API.AUDIT_ETHYLALCOHOL_CHECKED_API}`, 'POST', this.multipleSelection).then(({ data }) => {
                                if (data.code === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '操作成功',
                                        type: 'success'
                                    });
                                    this.getDataList();
                                } else {
                                    this.$errorToast(data.msg);
                                    this.getDataList();
                                }
                            });
                        }).catch(() => {
                            // this.$infoToast('已取消删除');
                        });
                    }
                });
            }
        },
        // 审核通过禁用
        checkboxT(row) {
            if (row.status === 'checked' || row.status === 'noPass') {
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
        },
        // 改变每页条数
        handleSizeChange(val) {
            this.formHeader.pageSize = val;
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

<style scoped></style>
