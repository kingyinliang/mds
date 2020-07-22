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
                    <span>入库列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headText" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small" @click="pass">
                            过账
                        </el-button>
                        <el-button type="primary" size="small" class="sub-red" @click="refuseDialog">
                            退回
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>入库列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headText" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small" class="sub-yellow" @click="writeOffsDialog">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="text" round size="mini" @click="addOrupdate(scope.row)">
                    {{ scope.row.redact ? '保存' : '编辑' }}
                </el-button>
                <el-button class="ra_btn" type="text" round size="mini" @click="AuditLog(scope.row)">
                    审核日志
                </el-button>
            </template>
        </query-table>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="反审原因" :close-on-click-modal="false" :visible.sync="visibleBack">
            <el-input v-model="BackText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleBack = false">
                    取消
                </el-button>
                <el-button type="primary" @click="writeOffs()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog title="审核日志" width="600px" :close-on-click-modal="false" :visible.sync="visibleAuditLog">
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
                prop: 'orderMaterialCode',
                label: '生产物料 ',
                width: '120',
                formatter: (row) => {
                    return row.orderMaterialCode + ' ' + row.orderMaterialName;
                }
            },
            {
                prop: 'orderAmount',
                label: '计划数量'
            },
            {
                prop: 'orderEntryUom',
                label: '单位'
            },
            {
                prop: 'entryQnt',
                label: '入库数量'
            },
            {
                prop: 'entryUom',
                label: '单位'
            },
            {
                prop: 'isSample',
                label: '是否样品',
                formatter: (row) => {
                    return row.isSample === '0' ? '否' : '是'
                }
            },
            {
                prop: 'batch',
                label: '物料批次',
                width: '120'
            },
            {
                prop: 'pkgOrderProductDate',
                label: '生产日期',
                width: '120'
            },
            {
                type: 'input',
                redact: true,
                header: true,
                prop: 'stgeLoc',
                label: '入库库位',
                width: '120'
            },
            {
                type: 'input',
                redact: true,
                header: true,
                prop: 'moveType',
                label: '移动类型',
                width: '120'
            },
            {
                type: 'input',
                redact: true,
                header: true,
                prop: 'stckType',
                label: '库存类型',
                width: '120'
            },
            {
                type: 'input',
                redact: true,
                prop: 'noMoreGr',
                label: '交货已完成',
                width: '120'
            },
            {
                type: 'date-picker',
                redact: true,
                valueFormat: 'yyyy-MM-dd HH:mm:ss',
                prop: 'expirydate',
                label: '货架寿命到期日',
                width: '158'
            },
            {
                type: 'input',
                redact: true,
                prop: 'theDate',
                label: '备注'
            },
            {
                prop: 'interfaceMsg',
                label: '接口回写'
            }
        ];

        $refs: {
            queryTable: HTMLFormElement;
        };

        auditLogData = []; // 审核日志
        ReText = ''; // 退回原因
        BackText = ''; // 反审原因
        postingDate = dateFormat(new Date(), 'yyyy-MM-dd'); // 过账日期
        headText = ''; // 抬头文本
        visibleAuditLog = false; // 审核日志弹窗
        visibleRefuse = false; // 退回原因弹窗
        visibleBack = false; // 反审原因弹窗

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
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
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
                prop: 'orderStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    }).then((data) => {
                        data.data.data = data.data.data.filter(it => it.dictValue === '已审核' || it.dictValue === '已过账' || it.dictValue === '接口失败' || it.dictValue === '反审');
                        return data
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
                prop: 'startDate',
                propTwo: 'endDate',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                defaultValueTwo: ''
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
            params.gzStatus = this.$refs.queryTable.activeName;// eslint-disable-line
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return AUDIT_API.INLIST_API(params);
        }

        // 表格复选框
        selectableFn = row => {
            if (row.status === '已退回') {
                return 0;
            }
            return 1;
        };

        // 设置数据
        setData(datas, st) {
            if (st) {
                this.tabs.forEach((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = this.$refs.queryTable.queryForm
                        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        params.gzStatus = index;
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        AUDIT_API.INLIST_API(params).then(({ data }) => {
                            this.tabs[index].tableData = data.data.records;
                            this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
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

        // 保存修改
        addOrupdate(row) {
            if (!row.redact) {
                row.redact = true;
            } else {
                if (!row.stgeLoc || !row.moveType || !row.stckType) {
                    this.$warningToast('请填写必填项')
                    return false
                }
                const status = row.status;
                row.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                row.status = null;
                AUDIT_API.INUPDATE_API(row).then(({ data }) => {
                    this.$successToast(data.msg);
                    row.redact = false;
                    row.status = status
                }).catch(() => {
                    row.status = status
                })
            }
        }

        // 审核日志
        AuditLog(row) {
            AUDIT_API.AUDIT_LOG_LIST_API({
                orderNo: row.orderNo,
                verifyType: 'INSTORAGE'
            }).then(({ data }) => {
                this.auditLogData = data.data
                this.visibleAuditLog = true
            })
        }

        // 过账
        pass() {
            if (!this.postingDate) {
                this.$warningToast('请选择过账日期')
                return false
            }
            // if (!this.headText) {
            //     this.$warningToast('请填写抬头文本')
            //     return false
            // }
            if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
                this.$confirm(`确定过账，是否继续？`, '过账确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[0].multipleSelection
                    for (const item of list) {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                        item.headerTxt = this.headText
                        item.pstngDate = this.postingDate
                        if (!item.stgeLoc || !item.moveType || !item.stckType) {
                            this.$warningToast('请填写数据必填项')
                            return false;
                        }
                    }
                    AUDIT_API.INPASS_API(list).then(({ data }) => {
                        this.$successToast(data.msg)
                        this.$refs.queryTable.getDataList(true)
                    }).catch((err) => {
                        if (err.data.code === 201) {
                            this.$successToast(err.data.msg)
                            this.$refs.queryTable.getDataList(true)
                        }
                    })
                })
            }
        }

        // 退回弹窗
        refuseDialog() {
            if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
                if (this.postingDate) {
                    this.visibleRefuse = true
                } else {
                    this.$warningToast('请选择过账日期')
                }
            } else {
                this.$warningToast('请勾选数据')
            }
        }

        // 退回确认
        refuse() {
            this.$confirm(`确定退回，是否继续？`, '退回确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const list = this.$refs.queryTable.tabs[0].multipleSelection
                list.forEach(item => {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                    item.memo = this.ReText
                    item.verifyType = ''
                });
                AUDIT_API.INREFUSE_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    refuseList: list
                }).then(({ data }) => {
                    this.visibleRefuse = false
                    this.$successToast(data.msg)
                    this.$refs.queryTable.getDataList()
                })
            })
        }

        // 反审弹窗
        writeOffsDialog() {
            if (this.$refs.queryTable.tabs[1].multipleSelection && this.$refs.queryTable.tabs[1].multipleSelection.length) {
                if (this.postingDate) {
                    this.visibleBack = true
                } else {
                    this.$warningToast('请选择过账日期')
                }
            } else {
                this.$warningToast('请勾选数据')
            }
        }

        // 反审确认
        writeOffs() {
            if (!this.BackText) {
                this.$warningToast('请填写审核意见')
                return false;
            }
            this.$confirm(`部分数据已经调用SAP接口已入库，请确认sap冲销，确认要反审?`, '反审确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const list = this.$refs.queryTable.tabs[1].multipleSelection
                list.forEach(item => {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                    item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                    item.reason = this.BackText
                    item.headerTxt = this.headText
                    item.pstngDate = this.postingDate
                });
                AUDIT_API.INWRITEOFFS_API(list).then(({ data }) => {
                    this.visibleBack = false;
                    this.$successToast(data.msg);
                    this.$refs.queryTable.getDataList(true)
                }).catch((err) => {
                    if (err.data.code === 201) {
                        this.visibleBack = false;
                        this.$errorToast(err.data.msg);
                        this.$refs.queryTable.getDataList(true)
                    }
                })
            })
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
