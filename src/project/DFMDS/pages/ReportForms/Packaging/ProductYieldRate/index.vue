<!-- 产品出成率  -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
            :show-page="false"
            :rules="queryTableFormRules"
            query-auth=""
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :export-excel="true"
            :query-tabke-type="'report'"
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
                prop: 'largeClassName',
                label: '品项大类',
                minWidth: '120'
            },
            {
                prop: 'output',
                label: '当月产出量',
                subLabel: '（吨）',
                minWidth: '120'
            },
            {
                prop: 'input',
                label: '当月领用量',
                subLabel: '（吨）',
                minWidth: '120'
            },
            {
                prop: 'yield',
                label: '出成率',
                minWidth: '120'
            },
            {
                prop: 'previousYield',
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
                type: 'date-picker',
                dataType: 'month',
                valueFormat: 'yyyyMM',
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请输入生产日期', trigger: 'blur' }],
                prop: 'monthId'
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
                prop: 'largeClass',
                labelWidth: '100',
                filterable: true,
                rule: [{ required: false, message: '请选择品项大类', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_LARGE_CLASS_DROP_DOWN_API({ })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ];

        // 查询必填栏位校验
        queryTableFormRules = [
            {
                prop: 'monthId',
                text: '请选择生产日期'
            },
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        // 查询请求
        listInterface = params => {
            // params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_QUERY_YIELD_API(params);
        };

        // 设置数据
        setData(data) {
            console.log(data);
        }

    }
</script>
