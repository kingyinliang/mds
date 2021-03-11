<!-- 生产线产能利用率 -->
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
            :multi-header="true"
            @get-data-success="setData"
        />
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';

    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二', '汇总'];

    @Component({ })
    export default class ProductCapacity extends Vue {
        formHeader = {};

        $refs: {
            queryTable: HTMLFormElement;
        };

        spanArr: number[] = []
        spanArr1: number[] = []

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'year',
                    text: '请选择年度'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '生产线产能利用率'
            }
        }

        // data table area setting
        dataTableSetting={
            type: 'multiHeader', // default/multiHeader
            merges: [
                'A1:A2',
                'B1:B2',
                'C1:C2',
                'D1:D2',
                'E1:G1',
                'H1:J1',
                'K1:M1',
                'N1:P1', // 4
                'Q1:S1', // 5
                'T1:V1', // 6
                'W1:Y1', // 7
                'Z1:AB1', // 8
                'AC1:AE1', // 9
                'AF1:AH1', // 10
                'AI1:AK1', // 11
                'AL1:AN1', // 12
                'AO1:AQ1' // 12
            ],
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: true,
            //表格数据
            column: [
                {
                    label: '生产车间',
                    prop: 'workShop',
                    minwidth: 120
                },
                {
                    label: '生产线',
                    prop: 'productLine',
                    width: 120
                },
                {
                    label: '生产物料',
                    prop: 'materialName',
                    minwidth: '210',
                    formatter: (row) => {
                        return row.materialName + ' ' + row.materialCode;
                    }
                },
                {
                    label: '单位',
                    prop: 'unitName'
                },
                ...months.map((item, index) => {
                    const suffix = item === '汇总' ? 'Summary' : (index + 1)
                    return {
                        label: item === '汇总' ? item : (item + '月份'),
                        child: [
                            { label: '有效产能', prop: 'effectiveCapacity' + suffix, width: 120 },
                            { label: '实际产量', prop: 'actualCapacity' + suffix, width: 120 },
                            { label: '实际产量利用率', prop: 'capacityRatio' + suffix, width: 120 }
                        ]
                    };
                })
            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }

        // 查询表头
        queryFormData = [
            {
                type: 'date-picker',
                label: '年度',
                dataType: 'year',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                prop: 'year',
                valueFormat: 'yyyy'
            },
            {
                type: 'select',
                label: '生产车间',
                labelWidth: '120',
                prop: 'workShop',
                defaultValue: '',
                rule: [{ required: false, message: '请选择生产车间', trigger: 'blur' }],
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
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return REPORTS_API.REPORT_PRODUCT_LINE_CAPACITY_API(params);
            return new Promise((resolve) => {
                REPORTS_API.REPORT_PRODUCT_LINE_CAPACITY_API(params).then(res => {
                    res.data.data.sort((a, b) => {
                        if (a.workShop === b.workShop) {
                            return a.productLine - b.productLine
                        }
                        return a.workShop - b.workShop
                    })
                    resolve(res)
                })
            });
        };

        // 设置数据
        setData(data) {
            if (!data.data) {
                this.$infoToast('暂无任何内容');
            }
            this.getSpanArr(data.data)
        }

        getSpanArr(arr) {
            this.spanArr = []
            this.spanArr1 = []
            let pos = 0
            let pos1 = 0
            if (!arr) return false;
            arr.map((item, index) => {
                if (index === 0) {
                    this.spanArr.push(1)
                    this.spanArr1.push(1)
                } else {
                    // 生产车间合并
                    if (item.workShop === arr[index - 1].workShop) {
                        this.spanArr[pos] += 1
                        this.spanArr.push(0)
                    } else {
                        pos = index
                        this.spanArr.push(1)
                    }
                    // 生产线合并
                    if (item.productLine === arr[index - 1].productLine) {
                       this.spanArr1[pos1] += 1
                        this.spanArr1.push(0)
                    } else {
                        pos1 = index
                        this.spanArr1.push(1)
                    }
                }
            })
            console.log(this.spanArr, this.spanArr1, '====================')
        }

        spanMethod({ /* row, column, */ rowIndex, columnIndex }) {
            // console.log({ row, column, rowIndex, columnIndex })
            if (columnIndex === 0) {
                const row = this.spanArr[rowIndex]
                const col = row > 0 ? 1 : 0
                return {
                    rowspan: row,
                    colspan: col
                }
            }
            if (columnIndex === 1) {
                const row = this.spanArr1[rowIndex]
                const col = row > 0 ? 1 : 0
                return {
                    rowspan: row,
                    colspan: col
                }
            }
        }

    }
</script>

<style lang="scss" scoped>
</style>
