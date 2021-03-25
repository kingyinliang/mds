<!-- 待处理酱料明细表 -->
<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :span-method="spanMethod"
            :custom-data="true"
            :query-table-type="'report'"
            :multi-header="true"
            @date-change="dateChange"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';
    const ceils: string[] = []
    for (let i = 0; i < 26; i++) {
        ceils.push(String.fromCharCode((65 + i)))
    }
    for (let i = 0; i < 26; i++) {
        for (let j = 0; j < 26; j++) {
            ceils.push(ceils[i] + String.fromCharCode((65 + j)))
        }
    }
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
        name: 'DetailOfSauce'
    })
    export default class DetailOfSauce extends Vue {

        currentMonth = '';

        tableData: Record[] = [];
        spanArr: number[] = [];
        pos = 0;

        // query header area setting
        queryFormSetting = {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'monthId',
                    text: '请选择生产日期'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '待处理酱料明细表'
            }
        }

        // data table area setting
        get dataTableSetting() {
            // 总列数
            const columnCount: number = (getDays(this.currentMonth) + 1) * 4 + 3;
            const merges: string[] = []
            let pos = 3
            for (let i = 0; i < columnCount; i++) {
                if (i < 3) {
                    merges.push(`${ceils[i]}1:${ceils[i]}2`)
                    continue;
                }
                if (pos === i) {
                    merges.push(`${ceils[i]}1:${ceils[i + 3]}1`)
                    pos = i + 4
                }
            }
            return {
                type: 'multiHeader', // default/multiHeader
                merges: merges,
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
                        prop: 'materialCode',
                        label: '成品料号',
                        minWidth: '120'
                    },
                    {
                        prop: 'materialName',
                        label: '成品描述',
                        minWidth: '120',
                        width: 140
                        // formatter: row => row.materialName + ' ' + row.materialCode
                    },
                    ...new Array(getDays(this.currentMonth) + 1).fill('').map((item, index) => {
                        let i: string | number = index;
                        if (index === 0) {
                            i = 'Summary';
                        }
                        return {
                            label: index === 0 ? '合计' : (i + '日'),
                            minWidth: '120',
                            child: [
                                {
                                    prop: 'output' + i,
                                    label: '成品',
                                    subLabel: '（箱）',
                                    minWidth: '120',
                                    width: 140
                                },
                                {
                                    prop: 'pressMaterial' + i,
                                    label: '挤料数量',
                                    subLabel: '（kg）',
                                    minWidth: '120',
                                    width: 140
                                },
                                {
                                    prop: 'sealingPlug' + i,
                                    label: '测密封度',
                                    subLabel: '（kg）',
                                    minWidth: '120',
                                    width: 140
                                },
                                {
                                    prop: 'wasteSauce' + i,
                                    label: '废酱',
                                    subLabel: '（kg）',
                                    minWidth: '120',
                                    width: 140
                                }
                                // ,
                                // {
                                //     prop: 'fffffffffffff' + i,
                                //     label: '线上不良',
                                //     subLabel: '（kg）',
                                //     minWidth: '120',
                                //     width: 140
                                // },
                                // {
                                //     prop: 'ggggggggggggggggggg' + i,
                                //     label: '其他',
                                //     subLabel: '（kg）',
                                //     minWidth: '120',
                                //     width: 140
                                // }
                            ]
                        }
                    })
                ], // eslint-disable-line
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
                labelWidth: '100',
                clearable: true,
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
                filterable: true,
                clearable: true,
                rule: [{ required: true, message: '请选择生产产线', trigger: 'blur' }],
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
                label: '生产物料',
                prop: 'materialCode',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择生产物料', trigger: 'blur' }],
                filterable: true,
                clearable: true,
                defaultValue: '',
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
        listInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_GERMS_SUMMARY_QUERY_API(params);
        }

        dateChange(v) {
            this.currentMonth = v;
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
            console.log('表单合计param')
            console.log(param)
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                }
                    return prev;

                }, 0);
                sums[index] += ' 元';
            } else {
                sums[index] = 'N/A';
            }
            });
            return sums
        };

        // 设置数据
        setData(data) {
            if (!data.data.length) {
                this.$warningToast('暂无数据')
            }
            // console.log(data);
            // this.tableData = data.data.records
            this.spanArr = []
            this.getSpanArr(data.data)
        }

        getSpanArr(data) {
            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0;
                    continue;
                }
                // 判断当前元素与上一个元素是否相同
                if (data[i].largeClassName === data[i - 1].largeClassName) {
                    this.spanArr[this.pos] += 1;
                    this.spanArr.push(0);
                    continue;
                }
                this.spanArr.push(1);
                this.pos = i;
            }
        }

        spanMethod({ row, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                const rowspan = this.spanArr[rowIndex];
                const colspan = rowspan > 0 ? 1 : 0;
                return {
                    rowspan: rowspan,
                    colspan: colspan
                }
            }
            if ((columnIndex === 1 || columnIndex === 2) && row.materialCode === '合计') {
                return {
                    rowspan: 1,
                    colspan: columnIndex === 1 ? 2 : 0
                }
            }
        }
    }

    interface Record {
        workShopName: string;
    }
</script>
