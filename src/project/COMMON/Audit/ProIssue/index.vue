<template>
    <el-col>
        <el-col>
            <div class="header_main">
                <el-card class="searchCard">
                    <el-row type="flex">
                        <el-col>
                            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                                <el-form-item label="生产车间：">
                                    <el-select v-model="plantList.workShop" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产产线：">
                                    <el-select v-model="plantList.productLine" placeholder="产线" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.id" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产订单：">
                                    <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 160px;" />
                                </el-form-item>
                                <el-form-item label="组件物料：">
                                    <el-select v-model="plantList.material" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in materialsList" :key="index" :label="item.value" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="订单类型：">
                                    <el-select v-model="plantList.orderType" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.value" :value="item.code" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="过账状态：">
                                    <el-select v-model="plantList.status" placeholder="请选择" style="width: 160px;">
                                        <el-option label="请选择" value="" />
                                        <el-option label="已审核" value="C" />
                                        <el-option label="已退回" value="R" />
                                        <el-option label="接口失败" value="F" />
                                        <el-option label="已过账" value="P" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="生产日期：" class="dateinput">
                                    <el-row>
                                        <el-col :span="12">
                                            <el-date-picker v-model="plantList.prodDateBegin" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 135px;" />
                                            <span>-</span>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-date-picker v-model="plantList.prodDateEnd" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 135px;" />
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <el-form-item class="floatr">
                                    <el-button type="primary" size="small" @click="GetAuditList(true)">
                                        查询
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-col>
                    </el-row>
                    <div class="toggleSearchBottom">
                        <i class="el-icon-caret-top" />
                    </div>
                </el-card>
            </div>
            <div class="main">
                <el-card class="tableCard">
                    <div class="toggleSearchTop">
                        <i class="el-icon-caret-bottom" />
                    </div>
                    <el-form ref="pstngDate" :model="plantList" :rules="plantListRule" size="small" :inline="true" label-position="right" label-width="100px" class="topforms">
                        <el-form-item label="过账日期：" prop="pstngDate">
                            <el-date-picker v-model="plantList.pstngDate" type="date" placeholder="选择" value-format="yyyy-MM-dd" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item label="抬头文本：">
                            <el-input v-model="plantList.headerTxt" placeholder="抬头文本" style="width: 160px;" />
                        </el-form-item>
                        <el-form-item>
                            <el-button :disabled="(activeName === '1' && noPassMultipleSelection.length == 0) || activeName === '2' " type="primary" size="small" @click="getPass()">
                                过账
                            </el-button>
                            <el-button :disabled="(activeName === '1' && noPassMultipleSelection.length == 0) || activeName === '2' " type="danger" size="small" @click="refuseDialogShow(true)">
                                退回
                            </el-button>
                            <el-button :disabled="activeName === '1' || (activeName === '2' && passMultipleSelection.length === 0)" type="warning" size="small" @click="refuseDialogShow(false)">
                                反审
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-tabs v-model="activeName" type="border-card" class="NewDaatTtabs" style="margin-top: 5px;">
                        <el-tab-pane name="1">
                            <span slot="label" class="spanview">
                                <el-button>未过账</el-button>
                            </span>
                            <el-table ref="table1" header-row-class-name="tableHead" :data="auditNoPassList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="34" :selectable="noPassSelectable" />
                                <el-table-column fixed type="index" label="序号" :index="indexMethod" width="55" />
                                <el-table-column prop="status" label="过账状态" width="112" />
                                <el-table-column prop="orderProductDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                                <el-table-column prop="orderNo" label="生产订单" :show-overflow-tooltip="true" width="112" />
                                <el-table-column label="生产物料" :show-overflow-tooltip="true" width="112" />
                                <el-table-column prop="planOutput" label="计划数量" width="80" />
                                <el-table-column prop="outputUnitName" label="单位" width="50" />
                                <el-table-column prop="entryQnt" label="入库数量" width="80" />
                                <el-table-column prop="entryUomName" label="单位" width="50" />
                                <el-table-column label="组件物料" :show-overflow-tooltip="true" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialCode + scope.row.materialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="entryQnt" label="发料数量" width="80" />
                                <el-table-column prop="entryUom" label="单位" width="50" />
                                <el-table-column label="物料批次" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>物料批次</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-if="scope.row.redact" v-model="scope.row.batch" size="mini" />
                                        <span v-else>{{ scope.row.batch }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="出库库位" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>出库库位</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-if="scope.row.redact" v-model="scope.row.stgeLoc" size="mini" />
                                        <span v-else>{{ scope.row.stgeLoc }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="移动类型" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>移动类型</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-input v-if="scope.row.redact" v-model="scope.row.moveType" size="mini" />
                                        <span v-else>{{ scope.row.moveType }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="移动原因" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>移动原因</span>
                                    </template>
                                    <template slot-scope="scope">
                                        <el-select v-if="scope.row.redact" v-model="scope.row.moveReason" placeholder="请选择" size="mini">
                                            <el-option label="请选择" value="" />
                                            <el-option v-for="(item, index) in moveReas" :key="index" :label="item.dictValue" :value="item.id" />
                                        </el-select>
                                        <span v-else>{{ scope.row.moveReason }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" label="备注" :show-overflow-tooltip="true" width="112" />
                                <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="112" />
                                <el-table-column fixed="right" label="操作" width="80">
                                    <template slot-scope="scope">
                                        <el-button type="primary" round size="mini" @click="redact(scope.row)">
                                            {{ scope.row.redact ? '保存' : '编辑' }}
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane name="2">
                            <span slot="label" class="spanview">
                                <el-button>已过账</el-button>
                            </span>
                            <el-table ref="table2" header-row-class-name="tableHead" :data="auditPassList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="34" />
                                <el-table-column fixed type="index" label="序号" :index="indexMethod" width="55" />
                                <el-table-column prop="status" label="过账状态" width="112" />
                                <el-table-column prop="orderProductDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                                <el-table-column prop="orderNo" label="生产订单" :show-overflow-tooltip="true" width="112" />
                                <el-table-column label="生产物料" :show-overflow-tooltip="true" width="112" />
                                <el-table-column prop="planOutput" label="计划数量" width="80" />
                                <el-table-column prop="outputUnitName" label="单位" width="50" />
                                <el-table-column prop="entryQnt" label="入库数量" width="80" />
                                <el-table-column prop="entryUomName" label="单位" width="50" />
                                <el-table-column label="组件物料" :show-overflow-tooltip="true" width="120">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialCode + scope.row.materialName }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="entryQnt" label="发料数量" width="80" />
                                <el-table-column prop="entryUom" label="单位" width="50" />
                                <el-table-column prop="batch" label="物料批次" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>物料批次</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="stgeLoc" label="出库库位" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>出库库位</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="moveType" label="移动类型" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>移动类型</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="moveReason" label="移动原因" width="112" :show-overflow-tooltip="true">
                                    <template slot="header">
                                        <i class="reqI">*</i><span>移动类型</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="remark" :show-overflow-tooltip="true" label="备注" width="112" />
                                <el-table-column prop="interfaceReturn" label="接口回写" :show-overflow-tooltip="true" width="112" />
                                <el-table-column fixed="right" label="操作" width="112">
                                    <el-button type="primary" round size="mini" @click="isAuditLogDialogShow = true">
                                        审核日志
                                    </el-button>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-row>
                            <el-pagination :current-page="plantList.currPage" :page-sizes="[10, 20, 50]" :page-size="plantList.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="plantList.totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
                        </el-row>
                    </el-tabs>
                </el-card>
            </div>
            <el-dialog :close-on-click-modal="false" :visible.sync="isRefuseOrWriteOffsDialogShow" @close="closeRefuseDialog()">
                <el-input v-model="refuseOrWriteOffsText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 150px;" />
                <span slot="title"> {{ dialogTitle }} </span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="isRefuseOrWriteOffsDialogShow = false">
                        取消
                    </el-button>
                    <el-button type="primary" @click="getRefuseOrWriteOffs()">
                        确定
                    </el-button>
                </span>
            </el-dialog>
            <el-dialog title="审核日志" :close-on-click-modal="false" :visible.sync="isAuditLogDialogShow" @close="closePostDataDialog()">
                <el-table :data="auditLogList" border tooltip-effect="dark" style="width: 100%;">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="55" />
                    <el-table-column prop="action" label="审核动作" width="120" />
                    <el-table-column prop="opintion" label="审核意见" width="160" />
                    <el-table-column prop="reviewer" label="审核人" width="160" />
                    <el-table-column prop="reviewTime" label="审核时间" />
                </el-table>
                <span slot="footer" />
            </el-dialog>
        </el-col>
    </el-col>
</template>

<script>
    import { COMMON_API, AUDIT_API } from 'common/api/api';
    import { headanimation } from '@/net/validate';
    export default {
        name: 'Index',
        filters: {
            SetDate: function(value) {
                return value.slice(0, value.indexOf(' '));
            }
        },
        components: {},
        data() {
            return {
                workshop: [],
                productline: [],
                materialsList: [],
                orderTypeList: [],
                activeName: '1',
                isRefuseOrWriteOffsDialogShow: false,
                isAuditLogDialogShow: false,
                dialogTitle: '',
                refuseOrWriteOffsText: '',
                moveReas: [],
                auditPassList: [],
                auditNoPassList: [],
                passMultipleSelection: [],
                noPassMultipleSelection: [],
                auditLogList: [
                    { action: '提交', opintion: '无', reviewer: '刘利民（18060024）', reviewTime: '2018-06-19 12：30' },
                    { action: '审核不通过', opintion: '工时数据不对', reviewer: '李晓梅（18060024）', reviewTime: '2018-06-19 13：30' },
                    { action: '审核不通过', opintion: '工时数据不对', reviewer: '李晓梅（18060024）', reviewTime: '2018-06-19 13：30' },
                    { action: '审核不通过', opintion: '工时数据不对', reviewer: '李晓梅（18060024）', reviewTime: '2018-06-19 13：30' },
                    { action: '审核不通过', opintion: '工时数据不对', reviewer: '李晓梅（18060024）', reviewTime: '2018-06-19 13：30' }
                    ],
                plantList: {
                    workShop: '',
                    productLine: '',
                    orderNo: '',
                    material: '',
                    orderType: '',
                    status: '',
                    prodDateBegin: '',
                    prodDateEnd: '',
                    pstngDate: '',
                    headerTxt: '',
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 20
                },
                plantListRule: {
                    pstngDate: [{ required: true, message: '过账日期不能为空', trigger: 'blur' }]
                }
            };
        },
        computed: {},
        watch: {
            'plantList.workShop'(n) {
                this.getProductLineType(n);
            }
        },
        mounted() {
            this.GetAuditList();
            this.getDeptByFactoryId();
            this.getMoveReas();
            this.getMaterialsList();
            this.getOrderTypeList();
            headanimation(this.$);
        },
        methods: {
            // 获取列表
            GetAuditList(st) {
                if (st) {
                    this.plantList.currPage = 1;
                }
                AUDIT_API.PROISSUEQUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    current: this.plantList.currPage,
                    size: this.plantList.pageSize
                }).then(({ data }) => {
                    data.data.records.forEach((item) => {
                        console.log(item.status);
                        if (item.status === '已审核' || item.status === '已退回' || item.status === '接口失败') {
                            this.auditNoPassList.push(item);
                        } else if (item.status === '已过账') {
                            this.auditPassList.push(item);
                        }
                    })
                    this.plantList.currPage = data.data.pages;
                    this.plantList.pageSize = data.data.size;
                    this.plantList.totalCount = data.data.total;
                });
            },
            //获取车间
            getDeptByFactoryId() {
                COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptType: ['WORK_SHOP']
                }).then(({ data }) => {
                    this.workshop = data.data;
                    if (this.workshop.length) {
                        this.plantList.workShop = this.workshop[0]['id'];
                    }
                });
            },
            // 获取产线
            getProductLineType(id) {
                this.plantList.productLine = '';
                if (id) {
                    COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: this.plantList.workShop
                    }).then(({ data }) => {
                        this.productline = data.data;
                    });
                } else {
                    this.productline = [];
                }
            },
            //获取组件物料
            getMaterialsList() {
                AUDIT_API.PROISSUEDROPDOWN_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
                }).then(({ data }) => {
                    console.log(data);
                });
            },
            //获取订单类型
            getOrderTypeList() {
                COMMON_API.DICTIONARY_ITEM_QUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id
                }).then(({ data }) => {
                    console.log(data);
                });
            },
            //获取移动类型
            getMoveReas() {
                COMMON_API.DICTQUERY_API({
                    dictType: 'COMMON_MOVE_REASON'
                }).then(({ data }) => {
                    this.moveReas = data.data;
                });
            },
            //显示退回或反审
            refuseDialogShow(bol) {
                this.dialogTitle = bol ? '退回原因' : '反审原因';
                this.isRefuseOrWriteOffsDialogShow = true;
            },
            //过账
            getPass() {
                this.$refs.pstngDate.validate(valid => {
                    if (valid) {
                        this.$confirm('确认过账，是否继续', '过账确认', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            AUDIT_API.PROISSUEPASS_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                ids: this.noPassMultipleSelection,
                                pstngDate: this.plantList.pstngDate,
                                remark: this.plantList.headerTxt
                            }).then(({ data }) => {
                                console.log(data);
                            });
                        })
                    }
                })
            },
            //退回或反审确认
            getRefuseOrWriteOffs() {
                if (this.dialogTitle === '退回原因') {
                    if (this.refuseOrWriteOffsText.length <= 0) {
                        this.$warningToast('请填写退回原因');
                    } else {
                        this.$confirm('确认退回，是否继续', '退回确认', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            AUDIT_API.PROISSUEREFUSE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                ids: this.noPassMultipleSelection,
                                remark: this.refuseOrWriteOffsText
                            }).then(({ data }) => {
                                this.isRefuseOrWriteOffsDialogShow = false;
                                console.log(data);
                            });
                        })
                    }
                } else if (this.refuseOrWriteOffsText.length <= 0) {
                        this.$warningToast('请填写反审原因');
                    } else {
                        this.$confirm('部分数据已经调用SAP接口已发料，请确认sap冲销，确认要反审？', '反审确认', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            AUDIT_API.PROISSUEWRITEOFFS_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                ids: this.passMultipleSelection,
                                remark: this.refuseOrWriteOffsText
                            }).then(({ data }) => {
                                this.isRefuseOrWriteOffsDialogShow = false;
                                console.log(data);
                            });
                        })
                    }
            },
            //未过账页签下编辑事件
            redact(row) {
                if (!row.redact) {
                    row.redact = true;
                } else {
                    AUDIT_API.PROISSUEUPDATE_API({
                        id: row.id,
                        stgeLoc: row.stgeLoc,
                        moveType: row.moveType,
                        moveReason: row.moveReason
                    }).then(({ data }) => {
                        row.redact = false;
                        console.log(data);
                    });
                }
            },
            // 序号
            indexMethod(index) {
                return index + 1 + (Number(this.plantList.currPage) - 1) * Number(this.plantList.pageSize);
            },
            // 表格选中
            handleSelectionChange(val) {
                if (this.activeName === '1') {
                    this.noPassMultipleSelection = [];
                } else {
                    this.passMultipleSelection = [];
                }
                val.forEach((item) => {
                    if (this.activeName === '1') {
                        this.noPassMultipleSelection.push(item.id);
                    } else {
                        this.passMultipleSelection.push(item.id);
                    }
                });
            },
            //未过账页签下已退回数据无法过账和退回
            noPassSelectable(row) {
                if (row.status === '已退回') {
                    return false;
                }
                return true;
            },
            // 改变每页条数
            handleSizeChange(val) {
                this.plantList.pageSize = val;
                // this.GetAuditList();
            },
            // 跳转页数
            handleCurrentChange(val) {
                this.plantList.currPage = val;
                // this.GetAuditList();
            }
        }
    };
</script>

<style lang="scss">
    .searchCard {
        margin-bottom: 0;
    }
    .searchCard .el-card__body {
        padding-bottom: 0;
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
        .formtextarea {
            .el-form-item__content {
                width: 500px;
            }
        }
    }
</style>
