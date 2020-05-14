<template>
    <div class="header_main">
        <div>
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col>
                        <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="70px" class="multi_row">
                            <el-form-item label="生产车间：">
                                <el-select v-model="plantList.workShop" placeholder="请选择" style="width: 170px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产产线：">
                                <el-select v-model="plantList.productLine" placeholder="产线" style="width: 170px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in productline" :key="index" :label="item.deptName" :value="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="生产订单：">
                                <el-input v-model="plantList.orderNo" placeholder="订单号" style="width: 170px;" />
                            </el-form-item>
                            <el-form-item label="组件物料：">
                                <el-select v-model="plantList.material" placeholder="请选择" style="width: 170px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in materialsList" :key="index" :label="item.materialCode + ' ' + item.materialName" :value="item.materialCode" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="订单类型：">
                                <el-select v-model="plantList.orderType" placeholder="请选择" style="width: 170px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in orderTypeList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="过账状态：">
                                <el-select v-model="plantList.status" placeholder="请选择" style="width: 170px;">
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
                                        <el-date-picker v-model="plantList.prodDateBegin" type="date" placeholder="选择" :editable="false" value-format="yyyy-MM-dd" style="width: 140px;" />
                                        <span style="margin-left: 5px;">-</span>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-date-picker v-model="plantList.prodDateEnd" type="date" placeholder="选择" :editable="false" value-format="yyyy-MM-dd" style="width: 140px;" />
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item class="floatr">
                                <el-button type="primary" size="small" @click="getAuditList(true)">
                                    查询
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <el-tabs v-model="activeName" type="border-card" class="NewDaatTtabs tabsPages">
            <el-tab-pane name="0">
                <span slot="label" class="spanview">
                    <el-button>未过账</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="pstngDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headerTxt" placeholder="抬头文本" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button :disabled="noPassMultipleSelection.length === 0" type="primary" size="small" @click="getPass()">
                            过账
                        </el-button>
                        <el-button :disabled="noPassMultipleSelection.length === 0" type="danger" size="small" @click="refuseDialogShow(true)">
                            退回
                        </el-button>
                    </div>
                </div>
                <el-table ref="table1" class="newTable" header-row-class-name="tableHead" :data="auditNoPassList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" :selectable="noPassSelectable" />
                    <el-table-column type="index" label="序号" :index="noPassIndexMethod" width="55" />
                    <el-table-column prop="status" label="过账状态" width="100" />
                    <el-table-column prop="orderProductDate" label="生产日期" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="orderNo" label="生产订单" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="materialName" label="生产物料" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="planOutput" label="计划数量" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="outputUnit" label="单位" :show-overflow-tooltip="true" width="60" />
                    <el-table-column prop="countOutput" label="入库数量" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="countOutputUnit" label="单位" :show-overflow-tooltip="true" width="60" />
                    <el-table-column label="组件物料" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="entryQnt" label="发料数量" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="entryUom" label="单位" :show-overflow-tooltip="true" width="60" />
                    <el-table-column label="物料批次" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.redact" v-model="scope.row.batch" size="mini" />
                            <el-input v-else v-model="scope.row.batch" size="mini" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="出库库位" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>出库库位</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.redact" v-model="scope.row.stgeLoc" size="mini" />
                            <el-input v-else v-model="scope.row.stgeLoc" size="mini" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>移动类型</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.redact" v-model="scope.row.moveType" size="mini" />
                            <el-input v-else v-model="scope.row.moveType" size="mini" disabled />
                        </template>
                    </el-table-column>
                    <el-table-column label="移动原因" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>移动原因</span>
                        </template>
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.redact" v-model="scope.row.moveReason" placeholder="请选择" size="mini">
                                <el-option label="" value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in moveReas" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                            <el-select v-else v-model="scope.row.moveReason" placeholder="请选择" size="mini" disabled>
                                <el-option label="" value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in moveReas" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" width="112" :show-overflow-tooltip="true" />
                    <el-table-column prop="interfaceReturn" label="接口回写" width="112" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="135">
                        <template slot-scope="scope">
                            <el-button class="ra_btn" type="text" round size="mini" @click="redact(scope.row)">
                                {{ scope.row.redact ? '保存' : '编辑' }}
                            </el-button>
                            <el-button class="ra_btn" type="text" round size="mini" @click="getAuditLog(scope.row)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="auditNoPassList.length !== 0">
                    <el-pagination :current-page="noPassCurrPage" :page-sizes="[10, 20, 50]" :page-size="noPassPageSize" layout="total, sizes, prev, pager, next, jumper" :total="noPassTotalCount" @size-change="noPassHandleSizeChange" @current-change="noPassHandleCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    <el-button>已过账</el-button>
                </span>
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="pstngDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headerTxt" placeholder="抬头文本" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button :disabled="passMultipleSelection.length === 0" type="warning" size="small" @click="refuseDialogShow(false)">
                            反审
                        </el-button>
                    </div>
                </div>
                <el-table ref="table2" class="newTable" header-row-class-name="tableHead" :data="auditPassList" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" />
                    <el-table-column type="index" label="序号" :index="passIndexMethod" width="55" />
                    <el-table-column prop="status" label="过账状态" width="100" />
                    <el-table-column prop="orderProductDate" label="生产日期" :show-overflow-tooltip="true" width="120" />
                    <el-table-column prop="orderNo" label="生产订单" :show-overflow-tooltip="true" width="120" />
                    <el-table-column prop="materialName" label="生产物料" :show-overflow-tooltip="true" width="120" />
                    <el-table-column prop="planOutput" label="计划数量" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="outputUnit" label="单位" :show-overflow-tooltip="true" width="60" />
                    <el-table-column prop="countOutput" label="入库数量" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="countOutputUnit" label="单位" :show-overflow-tooltip="true" width="60" />
                    <el-table-column label="组件物料" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="entryQnt" label="发料数量" :show-overflow-tooltip="true" width="80" />
                    <el-table-column prop="entryUom" label="单位" :show-overflow-tooltip="true" width="60" />
                    <el-table-column prop="batch" label="物料批次" width="120" :show-overflow-tooltip="true" />
                    <el-table-column prop="stgeLoc" label="出库库位" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>出库库位</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="moveType" label="移动类型" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>移动类型</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="移动原因" width="120" :show-overflow-tooltip="true">
                        <template slot="header">
                            <i class="reqI">*</i><span>移动原因</span>
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.moveReason" placeholder="请选择" size="mini" disabled>
                                <el-option label="" value="">
                                    请选择
                                </el-option>
                                <el-option v-for="(item, index) in moveReas" :key="index" :label="item.dictValue" :value="item.dictCode" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" width="112" :show-overflow-tooltip="true" />
                    <el-table-column prop="interfaceReturn" label="接口回写" width="112" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="85">
                        <template slot-scope="scope">
                            <el-button class="ra_btn" type="text" round size="mini" @click="getAuditLog(scope.row)">
                                审核日志
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-if="auditPassList.length !== 0">
                    <el-pagination :current-page="passCurrPage" :page-sizes="[10, 20, 50]" :page-size="passPageSize" layout="total, sizes, prev, pager, next, jumper" :total="passTotalCount" @size-change="passHandleSizeChange" @current-change="passHandleCurrentChange" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :close-on-click-modal="false" :visible.sync="isRefuseOrWriteOffsDialogShow">
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
        <el-dialog title="审核日志" width="600px" :close-on-click-modal="false" :visible.sync="isAuditLogDialogShow">
            <audit-log :table-data="logList" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>

<script>
    import { COMMON_API, AUDIT_API } from 'common/api/api';
    export default {
        components: {},
        data() {
            return {
                workshop: [],
                productline: [],
                materialsList: [],
                orderTypeList: [],
                moveReas: [],
                logList: [],
                activeName: '0',
                isRefuseOrWriteOffsDialogShow: false,
                isAuditLogDialogShow: false,
                //退回或反审title
                dialogTitle: '',
                //退回或反审原因
                refuseOrWriteOffsText: '',
                plantList: {
                    workShop: '',
                    productLine: '',
                    orderNo: '',
                    material: '',
                    orderType: '',
                    status: '',
                    prodDateBegin: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate()),
                    prodDateEnd: ''
                },
                auditPassList: [],
                auditNoPassList: [],
                noPassMultipleSelection: [],
                passMultipleSelection: [],
                noPassCurrPage: 1,
                noPassPageSize: 10,
                noPassTotalCount: 0,
                passCurrPage: 1,
                passPageSize: 10,
                passTotalCount: 0,
                //过账日期
                pstngDate: new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate()),
                //抬头文本
                headerTxt: ''
            };
        },
        computed: {},
        watch: {
            'plantList.workShop'(n) {
                this.getProductLineType(n);
            }
        },
        mounted() {
            this.getWorkShopList();
            this.getMaterialsList();
            this.getOrderTypeList();
            this.getMoveReas();
        },
        methods: {
            // 获取列表
            getAuditList(st) {
                if (st) {
                    if (this.activeName === '0') {
                        this.noPassCurrPage = 1;
                    } else {
                        this.passCurrPage = 1;
                    }
                }
                //刷新数据时清除验证
                AUDIT_API.PROISSUEQUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    current: this.activeName === '0' ? this.noPassCurrPage : this.passCurrPage,
                    size: this.activeName === '0' ? this.noPassPageSize : this.passPageSize,
                    workShop: this.plantList.workShop,
                    productLine: this.plantList.productLine,
                    orderNo: this.plantList.orderNo,
                    materialCode: this.plantList.material,
                    orderType: this.plantList.orderType,
                    postingStatus: this.plantList.status,
                    oneorderProductDate: this.plantList.prodDateBegin,
                    twoorderProductDate: this.plantList.prodDateEnd,
                    passStatus: this.activeName
                }).then(({ data }) => {
                    if (this.activeName === '0') {
                        this.setRedact(data.data.records);
                        this.auditNoPassList = data.data.records;
                        this.noPassCurrPage = data.data.current;
                        this.noPassPageSize = data.data.size;
                        this.noPassTotalCount = data.data.total;
                    } else {
                        this.auditPassList = data.data.records;
                        this.passCurrPage = data.data.current;
                        this.passPageSize = data.data.size;
                        this.passTotalCount = data.data.total;
                    }
                    if (st && data.data.records.length === 0) {
                            this.$infoToast('该搜寻条件无任何数据！');
                        }
                });
            },
            setRedact(data) {
                data.forEach(item => {
                    item.redact = false;
                })
            },
            //获取车间
            getWorkShopList() {
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
                    this.materialsList = data.data;
                });
            },
            //获取订单类型
            getOrderTypeList() {
                COMMON_API.DICTQUERY_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    dictType: 'ORDER_TYPE'
                }).then(({ data }) => {
                    this.orderTypeList = data.data;
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
                if (bol) {
                    if (this.dialogTitle === '反审原因') {
                        this.refuseOrWriteOffsText = '';
                    }
                    this.dialogTitle = '退回原因';
                    this.isRefuseOrWriteOffsDialogShow = true;
                } else {
                    if (!this.pstngDate) {
                        this.$warningToast('请选择过账日期')
                        return false
                    }
                    if (this.dialogTitle === '退回原因') {
                        this.refuseOrWriteOffsText = '';
                    }
                    this.dialogTitle = '反审原因';
                    this.isRefuseOrWriteOffsDialogShow = true;
                }
            },
            //过账
            getPass() {
                if (!this.pstngDate) {
                    this.$warningToast('请选择过账日期')
                    return false
                }
                this.$confirm('确认过账，是否继续', '过账确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    AUDIT_API.PROISSUEPASS_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        list: this.noPassMultipleSelection,
                        pstngDate: this.pstngDate,
                        headerText: this.headerTxt
                    }).then(({ data }) => {
                        this.$successToast(data.msg)
                        this.getAuditList();
                    });
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
                                list: this.noPassMultipleSelection,
                                reason: this.refuseOrWriteOffsText
                            }).then(({ data }) => {
                                this.isRefuseOrWriteOffsDialogShow = false;
                                this.$successToast(data.msg)
                                this.getAuditList();
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
                                list: this.passMultipleSelection,
                                pstngDate: this.pstngDate,
                                reason: this.refuseOrWriteOffsText
                            }).then(({ data }) => {
                                this.isRefuseOrWriteOffsDialogShow = false;
                                this.$successToast(data.msg);
                                this.getAuditList();
                            });
                        })
                    }
            },
            //未过账页签下编辑事件
            redact(row) {
                if (!row.redact) {
                    row.redact = true;
                    // this.$refs.table1.bodyWrapper.scrollLeft = document.querySelector('.el-table__body').offsetWidth - document.querySelector('.el-table__body-wrapper').clientWidth;
                    this.$refs.table1.bodyWrapper.scrollLeft = 10000;
                } else {
                    if (row.batch.length > 10) {
                        this.$warningToast('物料批次最大长度为10位');
                        return false;
                    }
                    if (row.stgeLoc.length > 4) {
                        this.$warningToast('出库库位最大长度为4位');
                        return false;
                    }
                    if (row.moveType.length > 3) {
                        this.$warningToast('移动类型最大长度为3位');
                        return false;
                    }
                    if (!row.stgeLoc || !row.moveType || !row.moveReason) {
                        this.$warningToast('请填写必填项')
                        return false;
                    }
                    AUDIT_API.PROISSUEUPDATE_API({
                        id: row.id,
                        batch: row.batch,
                        stgeLoc: row.stgeLoc,
                        moveType: row.moveType,
                        moveReason: row.moveReason
                    }).then(({ data }) => {
                        row.redact = false;
                        this.$successToast(data.msg);
                    });
                }
            },
            //审核日志
            getAuditLog(row) {
                this.logList = [];
                AUDIT_API.PROISSUEQUERYBYNO_API({
                    orderNo: row.orderNo
                }).then(({ data }) => {
                    this.logList = data.data;
                    this.isAuditLogDialogShow = true;
                });
            },
            // //时间转化
            // getNewDate(row) {
            //     const d = new Date(row.verifyDate);
            //     const year = d.getFullYear();
            //     const month = d.getMonth() + 1 > 10 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1);
            //     const date = d.getDate() > 10 ? d.getDate() : '0' + d.getDate();
            //     const hours = d.getHours() > 10 ? d.getHours() : '0' + d.getHours();
            //     const minutes = d.getMinutes() > 10 ? d.getMinutes() : '0' + d.getMinutes();
            //     const seconds = d.getSeconds() > 10 ? d.getSeconds() : '0' + d.getSeconds();
            //     return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
            // },
            //未过账页签下已退回数据无法过账和退回
            noPassSelectable(row) {
                if (row.status === '已退回') {
                    return false;
                }
                return true;
            },
             // 未过账序号
            noPassIndexMethod(index) {
                return index + 1 + (Number(this.noPassCurrPage) - 1) * Number(this.noPassPageSize);
            },
            //已过账序号
            passIndexMethod(index) {
                return index + 1 + (Number(this.passCurrPage) - 1) * Number(this.passPageSize);

            },
             // 表格选中
            handleSelectionChange(val) {
                if (this.activeName === '0') {
                    this.noPassMultipleSelection = [];
                } else {
                    this.passMultipleSelection = [];
                }
                val.forEach((item) => {
                    if (this.activeName === '0') {
                        this.noPassMultipleSelection.push({ id: item.id, orderId: item.orderId, orderNo: item.orderNo });
                    } else {
                        this.passMultipleSelection.push({ id: item.id, orderId: item.orderId, orderNo: item.orderNo });
                    }
                });
            },
            // 未过账页签下改变每页条数
            noPassHandleSizeChange(val) {
                this.noPassPageSize = val;
                this.getAuditList();
            },
            // 未过账页签下跳转页数
            noPassHandleCurrentChange(val) {
                this.noPassCurrPage = val;
                this.getAuditList();
            },
            // 已过账页签下改变每页条数
            passHandleSizeChange(val) {
                this.passPageSize = val;
                this.getAuditList();
            },
            // 已过账页签下跳转页数
            passHandleCurrentChange(val) {
                this.passCurrPage = val;
                this.getAuditList();
            }
        }
    };
</script>

<style scoed lang="scss">
    .searchCard {
        margin-bottom: 0;
    }
    .searchCard .el-card__body {
        padding-bottom: 0;
    }
    .searchCard,
    .tableCard {
        position: relative;
    }
    .tab__heads {
        margin-bottom: 10px;
        line-height: 32px;
    }
    .title-icon {
        float: left;
        width: 4px;
        height: 12px;
        margin-top: 10px;
        margin-right: 5px;
        background: #487bff;
        border-radius: 2px;
    }
</style>
