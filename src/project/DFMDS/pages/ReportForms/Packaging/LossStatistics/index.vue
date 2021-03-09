<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :get-summaries="getSummaries"
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
        name: 'LossStatisticsReport'
    })
    export default class LossStatisticsReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'workShop',
                    text: '请输入生产车间'
                },
                             {
                    prop: 'startDate',
                    text: '请输入生产日期'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '损耗统计及分析'
            }
        }

        // 查询表头
        queryFormData = [
            {
                type: 'select',
                hide: false, // hide column
                label: '生产车间',
                prop: 'workShop',
                defaultValue: '',
                labelWidth: '90', // default 70px
                width: '150',
                clearable: true,
                marked: true, // mark it
                disabled: false,
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
                hide: false, // hide column
                label: '生产产线',
                prop: 'productLine',
                defaultValue: '',
                labelWidth: '80',
                width: '200',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || '',
                        deptType: 'PRODUCT_LINE'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                hide: false, // hide column
                label: '生产订单',
                prop: 'orderNo',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '生产物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                clearable: true,
                marked: false, // mark it
                disabled: false,
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_PACKAGING_OEE_MATERIAL_QUERY_API({
                        workShop: '',
                        productLine: ''
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'date-interval',
                hide: false, // hide column
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                width: '305',
                marked: true, // mark it
                clearable: true,
                disabled: false,
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ];

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
                    prop: 'productLineName',
                    label: '生产产线',
                    width: '120',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'orderNo',
                    label: '订单',
                    width: '120',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'materialCode',
                    label: '物料编码',
                    width: '120',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'materialName',
                    label: '物料名称',
                    width: '180',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'materialUnit',
                    label: '单位',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'orderStartDate',
                    label: '订单开始日期',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'orderEndDate',
                    label: '订单结束日期',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'receivingNum',
                    label: '收货数量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'assNeedNum',
                    label: '组件需求数量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'assActualNum',
                    label: '组件实发数量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'diffNum',
                    label: '差异量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'actualLoss',
                    label: '实际损耗率',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'lossReason',
                    label: '损耗原因',
                    minWidth: '240',
                    width: '240',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    custom: true,
                    dataType: 'list'
                }

            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by APIs
            tableHeightSet: 405

        }

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_LOSS_STATISTICS_QUERY_API(params);
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
            const target = data[0]
            if (target) {
                columns.forEach((column, index) => {
                    if (Object.prototype.hasOwnProperty.call(target.totalData, column.property)) {
                        sums[index] = target.totalData[column.property]
                    } else {
                        sums[index] = ''
                    }
                });
                sums[0] = '合计';
            }
            return sums
        };

        // 设置数据
        setData(data) {
            console.log('查找回传结果');
            console.log(data);
            if (!data.data) {
                this.$infoToast('查询无结果');
            }
        }

    }
</script>
