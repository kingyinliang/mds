<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :get-summaries="getSummaries"
            :custom-data="true"
            :query-table-type="'report'"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    let daysList: DayData[] = [];
    const columnOrder: string[] = ['E1:F1', 'G1:H1', 'I1:J1', 'K1:L1', 'M1:N1', 'O1:P1', 'Q1:R1', 'S1:T1', 'U1:V1', 'W1:X1', 'Y1:Z1', 'AA1:AB1', 'AC1:AD1', 'AE1:AF1', 'AG1:AH1', 'AI1:AJ1', 'AK1:AL1', 'AM1:AN1', 'AO1:AP1', 'AQ1:AR1', 'AS1:AT1', 'AU1:AV1', 'AW1:AX1', 'AY1:AZ1', 'BA1:BB1', 'BC1:BD1', 'BE1:BF1', 'BG1:BH1', 'BI1:BJ1', 'BK1:BL1', 'BM1:BN1']
    @Component({
        components: {
        },
        name: 'LaborHoursStatisticsReport'
    })
    export default class LaborHoursStatisticsReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
            table: HTMLFormElement;
        }

        columnTemp=[]

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'startDate',
                    text: '请输入生产日期'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '人工工时统计报表'
            }
        }

        // 查询表头
        queryFormData = [
            {
                type: 'date-picker',
                hide: false, // hide column
                label: '生产日期',
                defaultValue: '',
                labelWidth: '90', // default 70px
                width: '160', // default 70px
                dataType: 'month',
                prop: 'startDate',
                valueFormat: 'yyyy-MM',
                marked: true, // mark it
                clearable: true,
                disabled: false
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '生产车间',
                prop: 'workShop',
                // defaultValue: '',
                labelWidth: '80', // default 70px
                width: '150',
                clearable: true,
                marked: false, // mark it
                disabled: false,
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
                linkageProp: ['materialCode']
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '生产物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return REPORTS_API.REPORT_PACKAGING_OEE_MATERIAL_QUERY_API({ // /pkgReportForm/material/query
                            workShop: val || '',
                            productLine: ''
                        })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            }
        ];

        // data table area setting
        dataTableSetting={
            type: 'multiHeader', // default/multiHeader
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: true,
            showOperationColumn: false,
            showPagination: true,
            merges: [
                'A1:A2',
                'B1:B2',
                'C1:D2',
                ...columnOrder.map(item => {
                    return item
                })
            ],
            //表格数据
            column: [
                {
                    prop: 'materialName',
                    label: '品名',
                    width: '240',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['materialName', 'materialCode']
                },
                {
                    prop: 'materialUnit',
                    label: '单位',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: '',
                    label: '月度合计',
                    subLabel: '',
                    minWidth: '180',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default',
                    child: [
                        { label: '实际产量', prop: 'actualYieldSum', minWidth: 120 },
                        { label: '生产工时', prop: 'productionHoursSum', minWidth: 120 }
                    ]
                },
                ...daysList.map((item) => {
                    return {
                        prop: '',
                        label: item.productDate,
                        child: [
                            { label: '实际产量', prop: `actualYield${item.productDate}`, width: 120 },
                            { label: '生产工时', prop: `productionHours${item.productDate}`, width: 120 }
                        ]
                    };
                })
            ],
            tableAttributes: {
                isShowSummary: true // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }

        mounted() {
            this.columnTemp = JSON.parse(JSON.stringify(this.dataTableSetting.column))
        }

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return REPORTS_API.REPORT_PACKAGING_LABOR_HOURS_STATISTICS_QUERY_API(params);

            return new Promise((resolve) => {
                REPORTS_API.REPORT_PACKAGING_LABOR_HOURS_STATISTICS_QUERY_API(params).then(res => {
                    daysList = [];
                    const resTemp = JSON.parse(JSON.stringify(res))
                    if (resTemp.data.data !== null && resTemp.data.data.length !== 0) {

                        const totalDataTemp = {}

                        resTemp.data.data.forEach(item => {
                            item.materialUnit = '箱/小时'
                            item.dayData.forEach(subItem => {
                                item[`actualYield${subItem.productDate}`] = subItem.actualYield
                                item[`productionHours${subItem.productDate}`] = subItem.productionHours
                                daysList.push(subItem)
                            })
                        })

                        resTemp.data.data[0].totalData.forEach(item => {
                            totalDataTemp[`actualYield${item.productDate}`] = item.actualYield
                            totalDataTemp[`productionHours${item.productDate}`] = item.productionHours
                        })
                        totalDataTemp[`productionHoursSum`] = resTemp.data.data[0].productionHoursSumTotal
                        totalDataTemp[`actualYieldSum`] = resTemp.data.data[0].actualYieldSumTotal
                        console.log('totalDataTemp')
                        console.log(totalDataTemp)
                        resTemp.data.data[0].totalData = totalDataTemp
                    }
                    resolve(resTemp)
                })
            });
        };

        /**
         * @description: data 表单 合计
         * @param1 {*}
         * @param2 {*}
         * @param3 {*}
         * @return {*}
         * @example: 示例代码
         * @param {*} getSummaries
         */
        getSummaries = param => {
            const { columns, data } = param;
            const sums: string[] = []
            const target = data[0]
            if (target) {
                columns.forEach((column, index) => {
                    if (Object.prototype.hasOwnProperty.call(target.totalData, column.property)) {
                        sums[index] = target.totalData[column.property]
                    } else {
                        sums[index] = ''
                    }
                });
                sums[0] = '合计';
            }
            return sums
        };

        // 设置数据
        setData(data) {
            console.log('查找回传结果');
            console.log(data);
            if (!data.data || data.data.length === 0) {
                this.$infoToast('查询无结果');

            }

            this.dataTableSetting.column = JSON.parse(JSON.stringify(this.columnTemp))
            daysList.map((item) => {
                this.dataTableSetting.column.push({
                    prop: '',
                    label: item.productDate,
                    child: [
                        { label: '实际产量', prop: `actualYield${item.productDate}`, width: 120 },
                        { label: '生产工时', prop: `productionHours${item.productDate}`, width: 120 }
                    ]
                })
            })
        }

    }
    interface DayData{
        actualYield: number;
        productDate: string;
        productionHours: number;
    }
</script>
