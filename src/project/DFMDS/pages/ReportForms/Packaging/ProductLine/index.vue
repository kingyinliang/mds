<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
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
        name: 'OEEReport'
    })
    export default class OEEReport extends Vue {
        //表格数据
        column = [
            {
                prop: 'workShopName',
                label: '生产产线',
                minWidth: '120'
            },
            {
                prop: 'holderTypeName',
                label: '物料编码',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '物料名称',
                width: '80'
            },
            {
                prop: 'holderNo',
                label: '日/月/季',
                width: '80'
            },
            {
                prop: 'holderNo',
                label: '时间嫁动率',
                width: '220'
            },
            {
                prop: 'holderNo',
                label: '性能嫁动率',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '良品率',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: 'OEE',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '未达成原因',
                width: '100'
            }
        ];

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '报表类型',
                prop: 'workShop',
                defaultValue: '',
                labelWidth: '80',
                defaultOptionsList: [
                    { value: '', label: '季' },
                    { value: '', label: '月' },
                    { value: '', label: '日' }
                ],
                width: '80',
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: '100',
                defaultValue: '',
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
            },
            {
                type: 'date-picker',
                label: '年度',
                defaultValue: '',
                labelWidth: '60',
                dataType: 'year',
                prop: 'oneorderProductDate'
            },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请输入生产日期', trigger: 'blur' }],
                prop: 'oneorderProductDate',
                propTwo: 'twoorderProductDate'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_OEE_API(params);
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
        }

    }
</script>
