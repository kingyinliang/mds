<!-- 产品出成率  -->
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
        name: 'ProductYieldRate'
    })
    export default class ProductYieldRate extends Vue {
        //表格数据
        column = [
            {
                prop: 'workShopName',
                label: '品项大类',
                minWidth: '120'
            },
            {
                prop: 'holderTypeName',
                label: '当月产出量',
                subLabel: '（吨）',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '当月领用量',
                subLabel: '（吨）',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '出成率',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '同期出成率',
                minWidth: '120'
            }
        ];

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请输入生产日期', trigger: 'blur' }],
                prop: 'oneorderProductDate',
                propTwo: 'twoorderProductDate'
            },
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
                prop: 'bigCategory',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择品项大类', trigger: 'blur' }],
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
