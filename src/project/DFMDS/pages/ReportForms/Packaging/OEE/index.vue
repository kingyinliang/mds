<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="true"
            :column="column"
            :show-page="true"
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
                label: '生产车间',
                minWidth: '120'
            },
            {
                prop: 'holderTypeName',
                label: '产线',
                minWidth: '120'
            },
            {
                prop: 'holderNo',
                label: '班次',
                width: '80'
            },
            {
                prop: 'holderNo',
                label: '品项',
                width: '80'
            },
            {
                prop: 'holderNo',
                label: '日期',
                width: '220'
            },
            {
                prop: 'holderNo',
                label: '可用率',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '时间嫁动率',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '性能嫁动率',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '良品率',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '综合效率',
                subLabel: '(OEE)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '生产效率',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '总时间',
                subLabel: '(min)',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '计画停机时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '实际投入时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '除外时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '异常损失时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '净作业时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '产出数',
                subLabel: '(件)',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '不良品数',
                subLabel: '(件)',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '有效效能',
                subLabel: '(件/h)',
                width: '140'
            },
            {
                prop: 'holderNo',
                label: '产出时间',
                subLabel: '(h)',
                width: '100'
            },
            {
                prop: 'holderNo',
                label: '净作业时间',
                subLabel: '(h)',
                width: '140'
            }
        ];

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

        // 设置数据
        setData(data) {
            console.log(data);
        }

    }
</script>
