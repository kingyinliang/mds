<!-- 车间品项产量汇总 -->
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
            :multi-header="false"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';

    @Component({
        name: 'SumOfWorkShopItem'
    })
    export default class SumOfWorkShopItem extends Vue {

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'startDate',
                    text: '请选择生产日期'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '车间品项产量汇总'
            }
        }

        // data table area setting
        dataTableSetting={
            type: 'default', // default/multiHeader
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: true,
            //表格数据
            column: [
                {
                    prop: 'productLineName',
                    label: '生产线',
                    minWidth: '140'
                },
                {
                    prop: 'productDate',
                    label: '日期',
                    minWidth: '120'
                },
                {
                    prop: 'materialName',
                    label: '品项',
                    minWidth: '120'
                },
                {
                    prop: 'outputCar',
                    label: '当日产量',
                    subLabel: '（箱）',
                    minWidth: '120'
                },
                {
                    prop: 'outputT',
                    label: '当日产量',
                    subLabel: '（吨）',
                    minWidth: '120'
                },
                {
                    prop: 'monthOutputCar',
                    label: '月度产量',
                    subLabel: '（箱）',
                    minWidth: '120'
                },
                {
                    prop: 'monthOutputT',
                    label: '月度产量',
                    subLabel: '（吨）',
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
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
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
                },
                linkageProp: ['productLine']
            },
            {
                type: 'select',
                label: '生产产线',
                prop: 'productLine',
                labelWidth: '100',
                clearable: true,
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
                // linkageProp: ['productMaterial']
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'materialCode',
                labelWidth: '100',
                filterable: true,
                clearable: true,
                rule: [{ required: true, message: '请选择生产物料', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_MATERIAL_DROP_DOWN_API({
                        // parentId: val || '',
                        // deptType: 'PRODUCT_LINE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictCode', 'dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请输入生产日期', trigger: 'blur' }],
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ];

        // 查询请求
        listInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_PRODUCT_LINE_SUB_OUT_PUT_QUERY_API(params);
        }

        // 设置数据
        setData(data) {
            console.log(data, '=========')
            if (!data.data.length) {
                this.$infoToast('暂无任何内容');
            }
        }
    }

</script>
