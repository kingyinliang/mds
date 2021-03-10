<!-- 分品项产量汇总  -->
<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :span-method="spanMethod"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :custom-data="true"
            :query-table-type="'report'"
            :multi-header="false"
            @get-data-success="setData"
            @changeSpanArr="changeSpanArr"
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
        name: 'SumOfSubItems'
    })
    export default class SumOfSubItems extends Vue {

        spanArr: number[] = []

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'workShop',
                    text: '请选择生产车间'
                },
                {
                    prop: 'monthId',
                    text: '请选择月'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '分品项产量汇总'
            }
        }

        // data table area setting
        dataTableSetting={
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: true,
            //表格数据
            column: [
                {
                    prop: 'brand',
                    label: '品项',
                    minWidth: '120'
                },
                {
                    prop: 'specs',
                    label: '规格',
                    minWidth: '120'
                },
                {
                    prop: 'outputBox',
                    label: '产出',
                    subLabel: '（箱）',
                    minWidth: '120'
                },
                {
                    prop: 'outputT',
                    label: '产出',
                    subLabel: '（吨）',
                    minWidth: '120'
                },
                {
                    prop: 'productionDays',
                    label: '工作天数',
                    minWidth: '120'
                },
                {
                    prop: 'productionClasses',
                    label: '总班次',
                    minWidth: '120'
                },
                {
                    prop: 'productionManHours',
                    label: '人工工时',
                    subLabel: '（H）',
                    minWidth: '120'
                },
                {
                    prop: 'summaryBox',
                    label: '合计',
                    subLabel: '（箱）',
                    minWidth: '120'
                },
                {
                    prop: 'summaryT',
                    label: '合计',
                    subLabel: '（吨）',
                    minWidth: '120'
                }
            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultValue: '',
                labelWidth: '100',
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
                label: '生产月',
                dataType: 'month',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择月', trigger: 'blur' }],
                prop: 'monthId',
                valueFormat: 'yyyyMM'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_SUB_OUTPUT_SUMMARY_QUERY_API(params);
        };

        // 设置数据
        setData(data) {
            if (!data.data) {
                this.$infoToast('暂无任何内容');
            }
            this.getSpanArr(data.data)
        }

        changeSpanArr(page, size, tableData) {
            const arr = tableData.slice((page - 1) * size, page * size)
            this.getSpanArr(arr)
        }

        getSpanArr(arr) {
            this.spanArr = []
            let pos = 0
            if (!arr) return false;
            arr.map((item, index) => {
                if (index === 0) {
                    this.spanArr.push(1)
                } else {
                    // 生产车间合并
                    if (item.brand === arr[index - 1].brand) {
                        this.spanArr[pos] += 1
                        this.spanArr.push(0)
                        return
                    }
                    pos = index
                    this.spanArr.push(1)
                }
            })
            console.log(this.spanArr, '====================')
        }

        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex === 0 || columnIndex === 7 || columnIndex === 8) {
                const row = this.spanArr[rowIndex]
                const col = row > 0 ? 1 : 0
                return {
                    rowspan: row,
                    colspan: col
                }
            }
        }

    }
</script>
