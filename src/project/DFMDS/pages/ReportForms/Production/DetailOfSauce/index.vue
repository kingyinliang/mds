<!-- 待处理酱料明细表 -->
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
            :is-show-summary="false"
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
        name: 'DetailOfSauce'
    })
    export default class DetailOfSauce extends Vue {

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
                    label: '成品料号',
                    minWidth: '120'
                },
                {
                    prop: 'holderTypeName',
                    label: '成品描述',
                    minWidth: '120',
                    width: 140
                },
                ...new Array(getDays(this.currentMonth) + 1).fill('').map((item, index) => {
                    let i: string | number = index;
                    if (index === 0) {
                        i = 'Sum';
                    }
                    return {
                        label: index === 0 ? '合计' : (i + '日'),
                        minWidth: '120',
                        child: [
                            {
                                prop: 'bbbbbbbbbbb' + i,
                                label: '成品',
                                subLabel: '（箱）',
                                minWidth: '120',
                                width: 140
                            },
                            {
                                prop: 'cccccccccccc' + i,
                                label: '挤料数量',
                                subLabel: '（kg）',
                                minWidth: '120',
                                width: 140
                            },
                            {
                                prop: 'dddddddddddddd' + i,
                                label: '测密封度',
                                subLabel: '（kg）',
                                minWidth: '120',
                                width: 140
                            },
                            {
                                prop: 'eeeeeeeeee' + i,
                                label: '废酱',
                                subLabel: '（kg）',
                                minWidth: '120',
                                width: 140
                            },
                            {
                                prop: 'fffffffffffff' + i,
                                label: '线上不良',
                                subLabel: '（kg）',
                                minWidth: '120',
                                width: 140
                            },
                            {
                                prop: 'ggggggggggggggggggg' + i,
                                label: '其他',
                                subLabel: '（kg）',
                                minWidth: '120',
                                width: 140
                            }
                        ]
                    }
                })
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
                label: '生产产线',
                prop: 'productLine',
                labelWidth: '100',
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
                prop: 'productMaterial',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择生产物料', trigger: 'blur' }],
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
            // 针对查找必填关键字进行提示
            for (let i = 0; i < this.queryFormData.length; i++) {
                const element = this.queryFormData[i];
                if (element.rule) {
                    for (let j = 0; j < element.rule.length; j++) {
                        const item = element.rule[j];
                        if (item.required && !params[element.prop]) {
                            this.$warningToast(item.message);
                            return new Promise((resolve, reject) => {
                                reject('error') // eslint-disable-line
                            });
                        }
                    }
                }
            }
            // for (let index = 0; index < this.rules.length; index++) {
            //     const element = this.rules[index];
            //     if (!params[element.prop]) {
            //         this.$warningToast(element.text);
            //         return new Promise((resolve, reject) => {
            //             reject('error') // eslint-disable-line
            //         });
            //     }
            // }
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
            console.log(this.column)
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
