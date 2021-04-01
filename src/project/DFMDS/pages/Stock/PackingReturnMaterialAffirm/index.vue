<!-- 包材退料确认 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steCkQuery"
            :factory-type="1"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :tabs="tabs"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            :operation-column-width="100"
            :show-select-column="['0', '1'].includes(currentTab)"
            :show-index-column="true"
            @tab-click="tabClick"
            @get-data-success="returnDataFromQueryTableForm"
            @created-end="createdEnd"
        >
            <template v-slot:tab-head0>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '待过账列表' }} </h3>
                    <div class="btn-box">
                        <el-form ref="postFormRef" :model="postForm" :rules="rules" inline label-suffix="：" label-width="100px" size="small">
                            <el-form-item label="过账日期" prop="pstngDate">
                                <el-date-picker v-model="postForm.pstngDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
                            </el-form-item>
                            <el-form-item label="抬头文本" prop="headerText">
                                <el-input v-model="postForm.headerText" placeholder="请输入" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="passBill">
                                    过账
                                </el-button>
                                <el-button type="danger" @click="refuseDialogShow(true)">
                                    退回
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </template>
            <template v-slot:tab-head1>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '已过账列表' }} </h3>
                    <div class="btn-box">
                        <el-form ref="postFormRef2" :model="postForm" :rules="rules" inline label-suffix="：" label-width="100px" size="small">
                            <el-form-item label="过账日期" prop="pstngDate">
                                <el-date-picker v-model="postForm.pstngDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
                            </el-form-item>
                            <el-form-item label="抬头文本" prop="headerText">
                                <el-input v-model="postForm.headerText" placeholder="请输入" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click="refuseDialogShow(false)">
                                    反审
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <!-- <el-button v-if="!scope.row.redact" type="text" size="small" @click="editHandler(scope.row)">
                    编辑
                </el-button>
                <el-button v-else type="text" size="small" @click="saveHandler(scope.row)">
                    保存
                </el-button> -->
                <el-button type="text" size="small" @click="AuditLog(scope.row)">
                    日志
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
        <el-dialog title="审核日志" width="900px" :close-on-click-modal="false" :visible.sync="visibleAuditLog">
            <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { AUDIT_API, COMMON_API, PKG_API } from 'common/api/api';
    // import { dateFormat } from 'src/utils/utils';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'PackingReturnMaterialAffirm',
        components: {}
    })
    export default class PackingReturnMaterialAffirm extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
            postFormRef: HTMLFormElement;
            postFormRef2: HTMLFormElement;
        }

        postForm = {
            pstngDate: '',
            headerText: ''
        };

        currentTab = '0';

        // 已审核、已过账、已退回
        status = ['C', 'P', 'R'];

        visibleAuditLog = false // 审核日志弹窗
        auditLogData = [] // 审核日志

        isRefuseOrWriteOffsDialogShow = false;
        refuseOrWriteOffsText = '';
        dialogTitle = '';

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                labelWidth: '100',
                prop: 'workShop',
                rule: [{ required: true, message: '请选择生产车间', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '包装'
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
                labelWidth: '100',
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || '',
                        deptType: 'PRODUCT_LINE'
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
                type: 'select',
                label: '包材物料',
                prop: 'material',
                defaultValue: '',
                filterable: true,
                labelWidth: '100',
                defaultOptionsFn: () => {
                    return COMMON_API.SEARCH_MATERIAL_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        materialType: 'ZHAL'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        Column = [
            {
                prop: 'statusName',
                label: '状态',
                minwidth: '100'
            },
            {
                prop: 'factory',
                label: '生产工厂',
                minwidth: '100'
            },
            {
                prop: 'materialCode',
                label: '包材物料',
                minwidth: '160',
                formatter(row) {
                    return `${row.materialName} ${row.materialCode}`
                }
            },
            {
                prop: 'batch',
                label: '批次',
                minwidth: '100'
            },
            {
                prop: 'manufactor',
                label: '供应商',
                minwidth: '100'
            },
            {
                prop: 'changeAmount',
                label: '数量',
                minwidth: '85'
            },
            {
                prop: 'unit',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'productLine',
                label: '线别',
                minwidth: '100'
            },
            {
                prop: 'stgeLoc',
                label: '出库库位',
                minwidth: '100'
            },
            {
                prop: 'moveType',
                label: '移动类型',
                minwidth: '160',
                type: 'select',
                redact: true,
                header: true,
                resVal: {
                    resData: 'data',
                    label: 'dictValue',
                    value: 'dictCode'
                }
            },
            {
                prop: 'moveReason',
                label: '过账移动原因',
                minwidth: '120'
            },
            {
                prop: 'receiptLoc',
                label: '收货库位',
                minwidth: '100'
            },
            {
                prop: 'receiptBatch',
                label: '收货批次',
                minwidth: '100'
            },
            {
                prop: 'writeoffsMoveReason',
                label: '异动原因',
                minwidth: '100'
            },
            {
                prop: 'interfaceMsg',
                label: '接口回写',
                minwidth: '100'
            }
        ]

        tabs = [
            {
                label: '待过账',
                tableData: [],
                multipleSelection: [],
                showOperationColumn: true,
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column // eslint-disable-line
                ]
            },
            {
                label: '已过账',
                tableData: [],
                multipleSelection: [],
                showOperationColumn: true,
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column // eslint-disable-line
                ]
            },
            {
                label: '已退回',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column // eslint-disable-line
                ]
            }
        ]

        rules = {
            pstngDate: [
                { required: true, message: '请选择日期', triggle: 'blur' }
            ]
        }

        editHandler(row) {
            row.redact = true
        }

        saveHandler(row) {
            row.redact = false
        }

        // 审核日志
        AuditLog(row) {
            AUDIT_API.AUDIT_DIALOG_LOG_LIST_API({
                verifyId: row.id,
                verifyType: 'STORAGE_RETURN'
            }).then(({ data }) => {
                this.auditLogData = data.data
                this.visibleAuditLog = true
            })
        }

        createdEnd() {
            this.getDict();
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        tabClick(name) {
            this.currentTab = name;
        }

        getDict() {
            COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'ORDER_TYPE' // 字典类型
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.orderType = data.data;
                // this.orderType = data.data;
            })
            COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
                factory: 'common',
                dictType: 'COMMON_PBREV' // 字典类型 版本
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.ver = data.data;
            })
        }

        // queryTable 查询请求
        queryTableListInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            params.status = this.status[Number(this.$refs.queryTable.activeName)];
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            return PKG_API.VERIFY_STORAGE_RETURN_PAGE_QUERY_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(datas, st) {
            if (st) {
                this.tabs.map((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm))
                        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        params.status = this.status[index];
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        PKG_API.VERIFY_STORAGE_RETURN_PAGE_QUERY_API(params).then(({ data }) => {
                            this.tabs[index].tableData = data.data.records;
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
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
                    this.refuseOrWriteOffsText = '';
                    this.dialogTitle = '退回原因';
                    this.isRefuseOrWriteOffsDialogShow = true;
                } else {
                    this.$warningToast('请勾选数据')
                }
            } else {
                //反审
                // if (!this.pstngDate) {
                //     this.$warningToast('请选择过账日期')
                //     return false
                // }
                if (this.$refs.queryTable.tabs[1].multipleSelection && this.$refs.queryTable.tabs[1].multipleSelection.length) {
                    if (this.dialogTitle === '退回原因') {
                        this.refuseOrWriteOffsText = ''
                    }
                    this.refuseOrWriteOffsText = '';
                    this.dialogTitle = '反审原因'
                    this.isRefuseOrWriteOffsDialogShow = true
                    return
                }
                this.$warningToast('请勾选数据')
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
                    const params = {
                        idSet: [] as string[],
                        memo: this.refuseOrWriteOffsText
                    }
                    list.forEach(item => {
                        params.idSet.push(item.id)
                    });
                    PKG_API.VERIFY_STORAGE_RETURN_RETURNED_API(params).then(({ data }) => {
                        this.isRefuseOrWriteOffsDialogShow = false;
                        this.$successToast(data.msg);
                        this.$refs.queryTable.getDataList(true);
                    }).catch((err) => {
                        if (err.data.code === 201) {
                            this.isRefuseOrWriteOffsDialogShow = false;
                            // this.$errorToast(err.data.msg);
                            this.$refs.queryTable.getDataList(true);
                        }
                    });
                })
            } else {
                if (this.refuseOrWriteOffsText.length <= 0) {
                    this.$warningToast('请填写反审原因')
                    return false;
                }
                this.$confirm('数据已经调用SAP接口已发料，反审后将冲销SAP数据，是否反审?', '反审确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[1].multipleSelection
                    // for (const item of list) {
                    //     if (!item.stgeLoc || !item.moveType || !item.writeoffsMoveReason) {
                    //         this.$warningToast('请填写必填项');
                    //         return false;
                    //     }
                    //     item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                    //     item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                    //     item.reason = this.refuseOrWriteOffsText
                    //     item.headerText = this.headerText
                    //     item.pstngDate = this.pstngDate
                    //     // if (item.batch !== '' && item.batch !== null) {
                    //     //     if (item.batch.length !== 10) {
                    //     //         this.$warningToast('物料批次长度为10位')
                    //     //         return false;
                    //     //     }
                    //     // }
                    // }
                    const params = {
                        idSet: [] as string[],
                        reason: this.refuseOrWriteOffsText
                    }
                    list.map(item => {
                        params.idSet.push(item.id)
                    })
                    PKG_API.VERIFY_STORAGE_RETURN_WRITE_OFFS_API(params).then(({ data }) => {
                        this.isRefuseOrWriteOffsDialogShow = false
                        this.$successToast(data.msg);
                        this.$refs.queryTable.getDataList(true)
                    }).catch((err) => {
                        if (err.data.code === 201) {
                            this.isRefuseOrWriteOffsDialogShow = false;
                            // this.$errorToast(err.data.msg);
                            this.$refs.queryTable.getDataList(true);
                        }
                    });
                })
            }
        }

        // 过账
        passBill() {
            const arr = this.tabs[0].multipleSelection as OrderObj[];
            if (!arr.length) {
                this.$warningToast('请选择退料明细');
                return false;
            }
            this.$refs.postFormRef.validate(valid => {
                if (valid) {
                    const params = {
                        idSet: [] as string[],
                        pstngDate: this.postForm.pstngDate,
                        headerText: this.postForm.headerText
                    }
                    arr.map((item: OrderObj) => {
                        params.idSet.push(item.id)
                    });
                    PKG_API.VERIFY_STORAGE_RETURN_PASS_API(params).then(res => {
                        this.$successToast(res.data.msg);
                        this.$refs.queryTable.getDataList(true);
                    })
                } else {
                    return false
                }
            })
        }
    }
    interface OrderObj {
        id: string;
        orderType: string;
        ver: string;
    }
</script>

<style lang="scss" scoped>
    .btn-box {
        float: right;
        width: 80%;
        padding: 0;
    }
</style>
