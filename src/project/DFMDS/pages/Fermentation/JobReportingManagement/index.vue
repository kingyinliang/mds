<!-- 报工管理 -->
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
            :show-select-column="true"
            :show-index-column="true"
            :operation-column-width="140"
            @get-data-success="returnDataFromQueryTableForm"
        >
            <template v-slot:tab-head0>
                <div class="box-card-title clearfix">
                    <div style="float: right;">
                        <span class="tab-label">执行结束日期：</span>
                        <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="请选择" size="small" />
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="scope">
                <div>
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.scope.row)">
                        删除
                    </el-button>
                    <el-button type="text" size="small" @click="showLogHandler(scope.scope.row)">
                        审核日志
                    </el-button>
                </div>
            </template>
        </query-table>
        <redact-box :disabled="redactBoxDisable" :is-redact.sync="isRedact" redact-auth="steStgEdit" save-auth="steStgEdit" :is-show-submit-btn="true" :saved-rules="savedRules" :saved-datas="savedDatas" />
        <el-dialog
            title="审核日志"
            :visible.sync="dialogVisible"
            width="60%"
            :before-close="handleClose"
        >
            <el-table :data="logList">
                <el-table-column label="序号" type="index" />
                <el-table-column label="审核动作" prop="aaaaa" />
                <el-table-column label="审核意见" prop="aaaaa" />
                <el-table-column label="审核人" prop="aaaaa" />
                <el-table-column label="审核时间" prop="aaaaa" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';
    import RedactBox from 'components/RedactBox.vue'; // 下方状态 bar

    @Component({
        name: 'JobReportingManagement',
        components: {
            RedactBox
        }
    })
    export default class JobReportingManagement extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        targetQueryTableList: SaltWaterObj[] = [];

        redactBoxDisable = false; // control bar 可否禁用

        isRedact = false; // 可否编辑

        dialogVisible = false;

        logList = [
            { aaaaa: 'sssss' }
        ];

        endDate = dateFormat(new Date(), 'yyyy-MM-dd');

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 85,
                rule: [
                    { required: true, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '发酵'
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
                prop: 'orderId',
                labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }]
                // defaultValue: ''
            },
            {
                type: 'select',
                label: '订单类型',
                prop: 'orderType',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'materialId',
                // labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '发酵罐/池',
                prop: 'materialId3',
                labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '状态',
                prop: 'status',
                labelWidth: 85,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '019' // 溶解罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'date-interval',
                label: '订单日期',
                labelWidth: 85,
                valueFormat: 'yyyy-MM-dd',
                // defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'orderStartDateBegin',
                propTwo: 'orderStartDateEnd'
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
                prop: 'orderStatusName',
                label: '状态',
                minwidth: '80'
            },
            {
                prop: 'orderStatusName',
                label: '生产订单',
                minwidth: '80'
            },
            {
                prop: 'orderStatusName',
                label: '发酵罐/池号',
                minwidth: '100'
            },
            {
                prop: 'workShopName',
                label: '生产物料',
                minwidth: '85'
            },
            {
                prop: 'workShopName',
                label: '订单数量',
                minwidth: '85'
            },
            {
                prop: 'workShopName',
                label: '入库数量',
                minwidth: '85'
            },
            {
                prop: 'orderNo',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'workShopName',
                label: '准备工时',
                minwidth: '85'
            },
            {
                prop: 'orderNo',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'workShopName',
                label: '机器工时',
                minwidth: '85'
            },
            {
                prop: 'orderNo',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'workShopName',
                label: '人工工时',
                minwidth: '85'
            },
            {
                prop: 'orderNo',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'outputUnit',
                label: '执行开始日期',
                minwidth: '120'
            },
            {
                prop: 'productDate',
                label: '执行结束日期',
                minwidth: '120'
            },
            {
                prop: 'materialName',
                label: '部分/完全',
                minwidth: '100'
                // formatter: (row) => {
                //     return row.materialName + ' ' + row.materialCode;
                // }
            },
            {
                prop: 'productDate',
                label: '备注',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '操作人员',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '操作时间',
                minwidth: '80'
            }
        ]

        tabs = [
            {
                label: '部分报工',
                tableData: [{ id: 'sssss' }, { id: 'aaaa' }],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            },
            {
                label: '完全报工',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            },
            {
                label: '返工订单',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.Column // eslint-disable-line
            }
        ]

        // queryTable 查询请求
        queryTableListInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            let orderStatus: string[] = [];
            if (this.$refs.queryTable.activeName === '0') { // eslint-disable-line
                orderStatus = ['D'];
            } else if (this.$refs.queryTable.activeName === '1') {  // eslint-disable-line
                orderStatus = ['C', 'P'];
            } else {
                orderStatus = ['R'];
            }
            params.orderStatus = orderStatus; // eslint-disable-line
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            return COMMON_API.ORDER_QUERY_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                this.targetQueryTableList = data.data as SaltWaterObj[];
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        requestOrderHandler() {
            alert(11);
        }

        ruleMagnetSubmit() {
            return true;
        }

        ruleForiegnMatterSubmit() {
            return true;
        }

        // {redact-box} 提交需跑的验证 function
        savedRules(): Function[] {
            return [this.ruleMagnetSubmit, this.ruleForiegnMatterSubmit];
        }

        savedDatas() {
            return new Promise((resolve) => {
                resolve(null);
            });
        }

        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log(row);
                // this.$set(row, 'delFlag', 1)
                // this.$successToast('删除成功');
            });
        }

        showLogHandler(row) {
            console.log(row);
            this.dialogVisible = true;
        }

        handleClose() {
            this.dialogVisible = false;
        }
    }
    interface SaltWaterObj {
        id: string;
    }
</script>

<style lang="scss" scoped>

</style>

