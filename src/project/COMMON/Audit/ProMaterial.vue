<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :tabs="tabs"
            :selectable-fn="selectableFn"
            :show-index-column="true"
            :show-select-column="true"
            :show-operation-column="true"
            :operation-column-width="140"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="pstngDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headerText" placeholder="抬头文本" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small" @click="getPass">
                            过账
                        </el-button>
                        <el-button type="primary" size="small" class="sub-red" @click="refuseDialogShow(true)">
                            退回
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="pstngDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headerText" placeholder="抬头文本" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small" class="sub-yellow" @click="refuseDialogShow(false)">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="name === '0'" class="ra_btn" type="text" round size="mini" @click="redact(scope.row)">
                    {{ scope.row.redact ? '保存' : '编辑' }}
                </el-button>
                <el-button class="ra_btn" type="text" round size="mini" @click="getAuditLog(scope.row)">
                    审核日志
                </el-button>
            </template>
        </query-table>
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
            <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>


<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, AUDIT_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        }
    })

    export default class ProInStore extends Vue {
        mounted() {
            this.getMoveReas();
        }

        //表格数据
        get name() {
            return this.$refs.queryTable.activeName;
        }

        Column = [
            {
                prop: 'status',
                label: '过账状态'
            },
            {
                prop: 'orderProductDate',
                label: '生产日期',
                width: '120'
            },
            {
                prop: 'orderNo',
                label: '生产订单',
                width: '120'
            },
            {
                prop: 'materialName',
                label: '生产物料 ',
                width: '120'
            },
            {
                prop: 'planOutput',
                label: '计划数量'
            },
            {
                prop: 'outputUnit',
                label: '单位'
            },
            {
                prop: 'countOutput',
                label: '入库数量'
            },
            {
                prop: 'countOutputUnit',
                label: '单位'
            },
            {
                prop: 'materialName',
                label: '组件物料',
                width: '120',
                formatter: (row) => {
                    return row.materialCode + ' ' + row.materialName;
                }
            },
            {
                prop: 'entryQnt',
                label: '发料数量'
            },
            {
                prop: 'entryUom',
                label: '单位'
            },
            {
                prop: 'batch',
                label: '物料批次',
                type: 'input',
                width: '140',
                redact: true,
                header: true
            },
            {
                prop: 'stgeLoc',
                label: '出库库位',
                type: 'input',
                width: '140',
                redact: true,
                header: true
            },
            {
                prop: 'moveType',
                label: '移动类型',
                type: 'input',
                width: '140',
                redact: true,
                header: true
            },
            {
                prop: 'moveReason',
                label: '移动原因',
                resVal: {
                    label: 'dictValue',
                    value: 'dictCode'
                },
                type: 'select',
                width: '140',
                redact: true,
                header: true
            },
            {
                prop: 'remark',
                label: '备注',
                type: 'input',
                width: '140',
                redact: true
            },
            {
                prop: 'interfaceReturn',
                label: '接口回写'
            }
        ]

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 过账日期
        pstngDate = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1 >= 10 ? (new Date().getMonth() + 1).toString() : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() >= 10 ? new Date().getDate().toString() : '0' + new Date().getDate())
        headerText = '' //抬头文本
        dialogTitle = '' //退回或反审弹窗title
        refuseOrWriteOffsText = ''//退回或反审原因
        isRefuseOrWriteOffsDialogShow = false //退回或反审弹窗
        auditLogData = [] // 审核日志
        isAuditLogDialogShow = false //审核日志弹窗
        moveReas = [] //移动原因
        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP']
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['productLine']
            },
            {
                type: 'select',
                label: '生产产线',
                prop: 'productLine',
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || ''
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo',
                placeholder: '订单号'
            },
            {
                type: 'select',
                label: '组件物料',
                prop: 'materialCode',
                defaultOptionsFn: () => {
                    return AUDIT_API.PROISSUEDROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'ORDER_TYPE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['materialCode', 'materialName'],
                    value: 'materialCode'
                }
            },
            {
                type: 'select',
                label: '订单类型',
                prop: 'orderType',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'ORDER_TYPE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'select',
                label: '过账状态',
                prop: 'postingStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'oneorderProductDate',
                propTwo: 'twoorderProductDate'
            }
        ];

        // tab页签
        tabs = [
            {
                label: '未过账',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            },
            {
                label: '已过账',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.passStatus = this.$refs.queryTable.activeName * 1;// eslint-disable-line
            return AUDIT_API.PROISSUEQUERY_API(params);
        };

        // 设置数据
        setData(datas, st) {
            if (st) {
                this.tabs.forEach((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = this.$refs.queryTable.queryForm
                        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        params.passStatus = index;
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        AUDIT_API.PROISSUEQUERY_API(params).then(({ data }) => {
                            this.setRedact(data.data.records);
                            this.tabs[index].tableData = data.data.records;
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.setRedact(datas.data.records);
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.setRedact(datas.data.records);
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
            }

        }

        // 设置编辑
        setRedact(data) {
            data.forEach(item => {
                item.redact = false
            })
        }

        //过账
        getPass() {
            if (!this.pstngDate) {
                this.$warningToast('请选择过账日期')
                return false
            }
            if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
                this.$confirm('确认过账，是否继续', '过账确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[0].multipleSelection
                    list.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                        item.pstngDate = this.pstngDate
                        item.headerText = this.headerText
                    });
                    AUDIT_API.PROISSUEPASS_API(list).then(({ data }) => {
                        this.$successToast(data.msg)
                        this.$refs.queryTable.getDataList()
                    });
                })
            } else {
                this.$warningToast('请勾选数据')
            }
        }

        //显示退回或反审弹窗
        refuseDialogShow(bol) {
            if (bol) {
                //退回
                if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
                    if (this.dialogTitle === '反审原因') {
                        this.refuseOrWriteOffsText = '';
                    }
                    this.dialogTitle = '退回原因';
                    this.isRefuseOrWriteOffsDialogShow = true;
                } else {
                    this.$warningToast('请勾选数据')
                }
            } else {
                //反审
                if (!this.pstngDate) {
                    this.$warningToast('请选择过账日期')
                    return false
                }
                if (this.$refs.queryTable.tabs[1].multipleSelection && this.$refs.queryTable.tabs[1].multipleSelection.length) {
                    if (this.dialogTitle === '退回原因') {
                        this.refuseOrWriteOffsText = ''
                    }
                    this.dialogTitle = '反审原因'
                    this.isRefuseOrWriteOffsDialogShow = true
                } else {
                    this.$warningToast('请勾选数据')
                }
            }
        }

         //退回或反审确认
        getRefuseOrWriteOffs() {
            if (this.dialogTitle === '退回原因') {
                if (this.refuseOrWriteOffsText.length <= 0) {
                    this.$warningToast('请填写退回原因')
                    return false;
                }
                this.$confirm('确认退回，是否继续', '退回确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[0].multipleSelection
                    list.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        item.memo = this.refuseOrWriteOffsText
                        item.verifyType = ''
                    });
                    AUDIT_API.PROISSUEREFUSE_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        refuseList: list
                    }).then(({ data }) => {
                        this.isRefuseOrWriteOffsDialogShow = false
                        this.$successToast(data.msg)
                        this.$refs.queryTable.getDataList()
                    });
                })
            } else {
                if (this.refuseOrWriteOffsText.length <= 0) {
                    this.$warningToast('请填写反审原因')
                    return false;
                }
                this.$confirm('部分数据已经调用SAP接口已发料，请确认sap冲销，确认要反审？', '反审确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[1].multipleSelection
                    list.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                        item.reason = this.refuseOrWriteOffsText
                        item.headerText = this.headerText
                        item.pstngDate = this.pstngDate
                    });
                    AUDIT_API.PROISSUEWRITEOFFS_API(list).then(({ data }) => {
                        this.isRefuseOrWriteOffsDialogShow = false
                        this.$successToast(data.msg);
                        this.$refs.queryTable.getDataList()
                    });
                })
            }
        }

        //未过账页签下编辑事件
        redact(row) {
            if (!row.redact) {
                row.redact = true;
                // this.$refs.table1.bodyWrapper.scrollLeft = document.querySelector('.el-table__body').offsetWidth - document.querySelector('.el-table__body-wrapper').clientWidth;
                // this.$refs.table.bodyWrapper.scrollLeft = 10000;
            } else {
                if (!row.stgeLoc || !row.moveType || !row.moveReason) {
                    this.$warningToast('请填写必填项')
                    return false;
                }
                if (row.batch.length > 10) {
                    this.$warningToast('物料批次最大长度为10位')
                    return false;
                }
                if (row.stgeLoc.length > 4) {
                    this.$warningToast('出库库位最大长度为4位')
                    return false;
                }
                if (row.moveType.length > 3) {
                    this.$warningToast('移动类型最大长度为3位')
                    return false;
                }
                AUDIT_API.PROISSUEUPDATE_API({
                    id: row.id,
                    batch: row.batch,
                    stgeLoc: row.stgeLoc,
                    moveType: row.moveType,
                    moveReason: row.moveReason,
                    remark: row.remark
                }).then(({ data }) => {
                    this.$successToast(data.msg)
                    row.redact = false;
                });
            }
        }

         // 审核日志
        getAuditLog(row) {
            console.log(this.$refs.queryTable.activeName)
            AUDIT_API.AUDIT_LOG_LIST_API({
                orderNo: row.orderNo
            }).then(({ data }) => {
                this.auditLogData = data.data
                this.isAuditLogDialogShow = true
            })
        }

         //获取移动类型
        getMoveReas() {
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_MOVE_REASON'
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.moveReason = data.data;
            });
        }

        // 表格复选框
        selectableFn = row => {
            if (row.status === '已退回') {
                return 0;
            }
            return 1;
        }
    }
</script>

<style lang="scss" scoped>
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
