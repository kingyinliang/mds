<!-- 包装各品项产量  -->
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

    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

    @Component({
        components: {
        },
        name: 'EachItem'
    })
    export default class EachItem extends Vue {
        //表格数据
        column = [
            {
                prop: 'workShopName',
                label: '物料编号',
                minWidth: '120'
            },
            {
                prop: 'holderTypeName',
                label: '物料名称',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '单位',
                width: '80'
            },
            ...months.map((item, index) => {
                return {
                    prop: 'holderTypeName' + (index + 1),
                    label: item + '月',
                    minWidth: '120'
                }
            }),
            {
                prop: 'holderNo',
                label: '合计',
                width: '140'
            }
        ];

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'date-picker',
                label: '年度',
                dataType: 'year',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                prop: 'oneorderProductDate',
                valueFormat: 'yyyy'
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
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'productLine',
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
                type: 'select',
                label: '单位',
                prop: 'unit',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择单位', trigger: 'blur' }],
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
