<!-- 订单申请 -->
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
            :operation-column-width="90"
            :show-select-column="true"
            :show-index-column="true"
            @get-data-success="returnDataFromQueryTableForm"
        >
            <template v-slot:tab-head0>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '未申请' }} </h3>
                    <el-button type="primary" size="small" style="float: right;" @click="requestOrderHandler">
                        申请订单
                    </el-button>
                </div>
            </template>
            <template v-slot:tab-head1>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '未申请' }} </h3>
                </div>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'OrderRequest',
        components: {}
    })
    export default class OrderRequest extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        targetQueryTableList: SaltWaterObj[] = []

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
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
                type: 'select',
                label: '容器号',
                prop: 'potId',
                labelWidth: 80,
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
                labelWidth: 90,
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
                labelWidth: 90,
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
                label: '容器号',
                minwidth: '80'
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
                prop: 'orderNo',
                label: '订单单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'materialName',
                label: '订单类型',
                minwidth: '80',
                formatter: (row) => {
                    return row.materialName + ' ' + row.materialCode;
                }
            },
            {
                prop: 'planOutput',
                label: '版本',
                minwidth: '60'
            },
            {
                prop: 'outputUnit',
                label: '开始日期',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '结束日期',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '前置订单',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '前置物料',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '数量',
                minwidth: '80'
            },
            {
                prop: 'productDate',
                label: '单位',
                minwidth: '60'
            }
        ]

        tabs = [
            {
                label: '未申请',
                tableData: [],
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
                label: '已申请',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column, // eslint-disable-line
                    {
                        prop: 'orderCode',
                        label: '申请人员',
                        minwidth: '90'
                    },
                    {
                        prop: 'orderCode',
                        label: '申请时间',
                        minwidth: '90'
                    }
                ]
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
    }
    interface SaltWaterObj {
        id: string;
    }
</script>

<style lang="scss" scoped>

</style>
