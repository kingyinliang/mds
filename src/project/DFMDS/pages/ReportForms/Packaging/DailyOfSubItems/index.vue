<!-- 分品项产量日报  -->
<template>
    <div class="header_main">
        <!-- <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
            :span-method="spanMethod"
            :show-page="true"
            query-auth=""
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :get-summaries="getSummaries"
            :custom-data="true"
            :factory-type="1"
            :export-excel="true"
            :is-show-summary="false"
            @get-data-success="setData"
            @date-change="dateChange"
        /> -->
        <report-query-table
            ref="queryTable"
            :span-method="spanMethod"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :custom-data="true"
            :query-table-type="'report'"
            @get-data-success="setData"
            @changeSpanArr="changeSpanArr"
            @date-change="dateChange"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';
    /**
     * 获取某月有几天
     * @param yearAndmonth '202101'
     */
    function getDays(yearAndmonth) {
        const arr = [yearAndmonth.substr(0, 4), yearAndmonth.substr(4, 2)];
        const d = new Date(arr[0], arr[1] || '', 0);
        return d.getDate();
    }
    @Component({
        components: {
        },
        name: 'DailyOfSubItems'
    })
    export default class DailyOfSubItems extends Vue {

        currentMonth = '';
        spanArr: number[] = [];
        pos = 0;

        // query header area setting
        queryFormSetting = {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'monthId',
                    text: '请选择月'
                },
                {
                    prop: 'unit',
                    text: '请选择单位'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '分品项产量日报'
            }
        }

        // data table area setting
        get dataTableSetting() {
            console.log(this.currentMonth)
            return {
                showIt: true, // showit or not
                showSelectColumn: false,
                showIndexColumn: false,
                showOperationColumn: false,
                showPagination: true,
                //表格数据
                column: [
                    {
                        prop: 'largeClassName',
                        label: '品项',
                        width: '140',
                        minWidth: '140'
                    },
                    {
                        prop: 'unit',
                        label: '单位',
                        minWidth: '120'
                    },
                    {
                        prop: 'materialName',
                        label: '生产物料',
                        subLabel: '（箱）',
                        minWidth: '120',
                        width: 140
                    },
                    ...new Array(getDays(this.currentMonth)).fill('').map((item, index) => {
                        return {
                            prop: 'output' + (index + 1),
                            label: index + 1 + '日',
                            minWidth: '120'
                        }
                    }),
                    {
                        prop: 'outputSummary',
                        label: '合计',
                        minWidth: '120'
                    }
                ],
                tableAttributes: {
                    isShowSummary: false // 合计
                },
                dataChangeByAPI: false, // table data change by API
                tableHeightSet: 405
            }
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
                type: 'select',
                label: '品项大类',
                prop: 'largeClass',
                labelWidth: '100',
                filterable: true,
                rule: [{ required: false, message: '请选择品项大类', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_LARGE_CLASS_DROP_DOWN_API({ })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
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
            },
            {
                type: 'select',
                label: '单位',
                prop: 'unit',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择单位', trigger: 'blur' }],
                options: [
                    { label: '箱', value: 'CAR' },
                    { label: '吨', value: 'T' }
                ],
                defaultValue: 'CAR',
                resVal: {
                    // resData: 'data',
                    label: ['label'],
                    value: 'value'
                }
            }
        ];

        // 查询请求
        listInterface(params) {
            console.log(this.queryFormData, params)
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_SUB_OUTPUT_DAILY_QUERY_API(params);
        }

        dateChange(v) {
            this.currentMonth = v;
        }

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
                    if (item.largeClassName === arr[index - 1].largeClassName) {
                        this.spanArr[pos] += 1
                        this.spanArr.push(0)
                        return
                    }
                    pos = index
                    this.spanArr.push(1)
                }
            })
        }

        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const row = this.spanArr[rowIndex];
                const col = row > 0 ? 1 : 0;
                return {
                    rowspan: row,
                    colspan: col
                }
            }
        }
    }

</script>
