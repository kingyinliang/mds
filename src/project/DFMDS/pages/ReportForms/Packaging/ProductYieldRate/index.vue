<!-- 产品出成率  -->
<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :custom-data="true"
            :query-table-type="'report'"
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
        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'monthId',
                    text: '请选择生产日期'
                },
                {
                    prop: 'workShop',
                    text: '请选择生产车间'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '产品出成率'
            }
        }

        // data table area setting
        dataTableSetting={
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: true,
            //表格数据
            column: [
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
            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405
        }

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
                clearable: true,
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
                clearable: true,
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
