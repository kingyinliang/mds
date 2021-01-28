<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
            :is-show-summary="true"
            :get-summaries="getSummaries"
            :show-page="false"
            query-auth=""
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :factory-type="1"
            :export-excel="true"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'OutputSummary'
    })
    export default class OutputSummary extends Vue {
        //表格数据
        column = [
            {
                prop: 'workShopName',
                label: '生产车间',
                minWidth: '120'
            },
            {
                prop: 'unitName',
                label: '单位',
                minWidth: '120'
            },
            {
                prop: 'holderTypeName',
                label: '年度',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '月/季',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '有效产能',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '实际产能',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
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
                prop: 'aaaaaaa',
                radioArr: [
                    { label: '月报', val: '月报val' },
                    { label: '季报', val: '季报val' }
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
                prop: 'oneorderProductDate',
                dataType: 'year',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                valueFormat: 'yyyy'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return REPORTS_API.REPORT_PACKAGING_OEE_API(params);
            return new Promise(resolve => {
                resolve({
                    data: {
                        data: {
                            records: [
                                { workShopName: '车间一', unitName: '单位' }
                            ]
                        }
                    }
                })
            })
        };

        // 设置数据
        setData(data) {
            console.log(data);
        }

        getSummaries(param) {
            const { columns, data } = param;
            const sums: string[] = [];
            columns.forEach((column, index: number) => {
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
            return sums;
        }

    }
</script>
