<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :get-list-field="'packing'"
            :show-page="false"
            :list-interface="listInterface"
            :query-auth="'report:production:packing'"
            :span-method="spanMethod"
            :column="column"
            :export-excel="true"
            :export-option="exportOption"
            @get-data-success="getDataSuccess"
        />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'date-picker',
                    label: '月份',
                    prop: 'productDate',
                    dataType: 'month',
                    valueFormat: 'yyyy-MM'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.PKGSPECANDOUTPUT_LIST}`, 'POST', params);
            },
            spanMethod: ({ row, columnIndex }) => {
                if (Number(row.brand) === 1000) {
                    row.brand = '1L';
                }
                if (row.brand === '总计') {
                    if (columnIndex === 0) {
                        return [1, 3];
                    } else if (columnIndex === 1) {
                        return [0, 0];
                    } else if (columnIndex === 2) {
                        return [0, 0];
                    }
                }
                if (columnIndex === 0 || columnIndex === 4 || columnIndex === 6) {
                    return {
                        rowspan: row.mergeNums,
                        colspan: 1
                    };
                }
                    return {
                        rowspan: 1,
                        colspan: 1
                    };

            },
            exportOption: {
                exportInterface: REP_API.PKGSPECANDOUTPUT_OUT,
                auth: 'report:production:packingExport',
                text: '包装规格&品项产量分析报表导出'
            },
            column: [
                {
                    prop: 'brand',
                    label: '品相'
                },
                {
                    prop: 'productLine',
                    label: '产线'
                },
                {
                    prop: 'type',
                    label: '类别'
                },
                {
                    prop: 'boxNums',
                    label: '箱数'
                },
                {
                    prop: 'boxNumsSum',
                    label: '小计'
                },
                {
                    prop: 'squareNums',
                    label: '方数'
                },
                {
                    prop: 'squareNumsSum',
                    label: '小计'
                }
            ]
        };
    },
    computed: {},
    methods: {
        getDataSuccess() {
            if (this.$refs.queryTable.tableData.length) {
                this.$refs.queryTable.tableData.push({
                    brand: '总计',
                    productLine: '',
                    type: '',
                    boxNums: this.$refs.queryTable.tableData[0].boxNumsTotal,
                    boxNumsSum: '',
                    squareNums: this.$refs.queryTable.tableData[0].squareNumsTotal,
                    squareNumsSum: '',
                    boxNumsTotal: 0,
                    squareNumsTotal: 0,
                    mergeNums: 1
                });
            }
        }
    }
};
</script>

<style scoped></style>
