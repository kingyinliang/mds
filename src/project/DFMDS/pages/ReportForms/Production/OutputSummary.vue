<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
            :show-page="false"
            query-auth=""
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :rules="queryTableFormRules"
            :export-excel="true"
            :query-tabke-type="'report'"
            :span-method="spanMethod"
            :is-show-summary="true"
            :get-summaries="getSummaries"
            :export-option="exportOption"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'OutputSummary'
    })
    export default class OutputSummary extends Vue {

        tableData = [];

        //表格数据
        column = [
            {
                prop: 'workShopName',
                label: '生产车间',
                minWidth: '120'
            },
            {
                prop: 'unit',
                label: '单位',
                minWidth: '120'
            },
            {
                prop: 'yearId',
                label: '年度',
                minWidth: '120'
            },
            {
                prop: 'timeName',
                label: '月/季',
                minWidth: '120'
            },
            {
                prop: 'effectiveCapacity',
                label: '有效产能',
                minWidth: '120'
            },
            {
                prop: 'actualCapacity',
                label: '实际产能',
                minWidth: '120'
            },
            {
                prop: 'capacityRatio',
                label: '产能利用率',
                minWidth: '120'
            }
        ];

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'radio',
                prop: 'granularity',
                radioArr: [
                    { label: '月报', val: 'MONTH' },
                    { label: '季报', val: 'QUARTER' }
                ],
                rule: [{ required: true, message: '请选择月报/季报' }]
            },
            {
                type: 'select',
                label: '生产车间',
                labelWidth: '120',
                prop: 'workShop',
                defaultValue: '',
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
                }
            },
            {
                type: 'date-picker',
                label: '年度',
                prop: 'year',
                dataType: 'year',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                valueFormat: 'yyyy'
            }
        ];

        // 查询必填栏位校验
        queryTableFormRules = [
            {
                prop: 'granularity',
                text: '请选择月报/季报'
            },
            {
                prop: 'workShop',
                text: '请选择生产车间'
            },
            {
                prop: 'year',
                text: '请选择年度'
            }
        ]

        // 查询请求
        listInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_OUTPUT_SUMMARY_QUERY_API(params);
        }

        exportOption= {
            exportInterface: '',
            auth: '',
            text: '产量汇总 报表'
        }

        setData(data) {
            const tableData = data.data;
            // tableData[tableData.length - 1] = {
            //     ...tableData[tableData.length - 1],
            //     isSum: true,
            //     workShopName: '合计'
            // }
            // console.log(tableData)
            const d = tableData.pop()
            tableData[0].totalData = d
            this.$refs.queryTable.tableData = tableData;
        }

        spanMethod({ row, /* column, rowIndex, */ columnIndex }) {
            if (row.isSum) {
                if (columnIndex === 0) {
                    return {
                        rowspan: 1,
                        colspan: 4
                    }
                } else if (columnIndex < 4) {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        }

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
            console.log(param)
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
    }
</script>
