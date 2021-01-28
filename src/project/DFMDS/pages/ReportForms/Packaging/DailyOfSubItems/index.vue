<!-- 分品项产量日报  -->
<template>
    <div class="header_main">
        <query-table
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
            :is-show-summary="true"
            @get-data-success="setData"
            @date-change="dateChange"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';
    /**
     * 获取某月有几天
     * @param yearAndmonth '2021-01'
     */
    function getDays(yearAndmonth) {
        const arr = yearAndmonth.split('-');
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

        tableData: Record[] = [];
        spanArr: number[] = [];
        pos = 0;

        //表格数据
        get column() {
            console.log(this.currentMonth)
            return [
                {
                    prop: 'workShopName',
                    label: '品项',
                    width: '140',
                    minWidth: '140'
                },
                {
                    prop: 'holderNo',
                    label: '单位',
                    minWidth: '120'
                },
                {
                    prop: 'holderTypeName',
                    label: '生产物料',
                    subLabel: '（箱）',
                    minWidth: '120',
                    width: 140
                },
                ...new Array(getDays(this.currentMonth)).fill('').map((item, index) => {
                    return {
                        prop: 'aaa' + (index + 1),
                        label: index + 1 + '日',
                        minWidth: '120'
                    }
                }),
                {
                    prop: 'xxxx',
                    label: '合计',
                    minWidth: '120'
                }
            ]
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
                prop: 'oneorderProductDate',
                valueFormat: 'yyyy-MM'
            }
        ];

        // 查询请求
        listInterface(params) {
            console.log(this.queryFormData, params)
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return REPORTS_API.REPORT_PACKAGING_OEE_API(params);
            return new Promise((resolve) => {
                resolve({
                    data: {
                        data: {
                            records: [
                                { workShopName: '1111111111111', holderNo: '11' },
                                { workShopName: '1111111111111', holderNo: '1111' },
                                { workShopName: '2222222222222', holderNo: '22' },
                                { workShopName: '2222222222222', holderNo: '2222' }
                            ]
                        }
                    }
                })
            })
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
            console.log(data);
            this.tableData = data.data.records
            this.spanArr = []
            this.getSpanArr(this.tableData)
        }

        getSpanArr(data) {
            for (let i = 0; i < data.length; i++) {
                if (i === 0) {
                    this.spanArr.push(1);
                    this.pos = 0;
                    continue;
                }
                // 判断当前元素与上一个元素是否相同
                if (data[i].workShopName === data[i - 1].workShopName) {
                    this.spanArr[this.pos] += 1;
                    this.spanArr.push(0);
                    continue;
                }
                this.spanArr.push(1);
                this.pos = i;
            }
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

    interface Record {
        workShopName: string;
    }
</script>
