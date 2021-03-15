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
    // import { exportFileFor2ExcelMultiSheets } from 'utils/utils.ts';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'DefectiveProductReport'
    })
    export default class DefectiveProductReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        // ========dialog=======
        isDialogVisible=false
        currentQueryData: CurrentQueryData[]=[]
        dialogDataMainTable: DialogDataMainTable[]=[]
        dialogDataSecondTable: NotReachInfo[]=[]
        isShowSecondTable=false

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
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
                text: '包材不良品明细报表'
            }
        }

        // 查询表头
        queryFormData = [
             {
                type: 'single-checkbox',
                hide: false, // hide column
                label: '不良品',
                prop: 'isBadTemp',
                defaultValue: false,
                labelWidth: '80',
                width: '160',
                clearable: false,
                marked: false, // mark it
                disabled: false
            },
            {
                type: 'select', // column type
                hide: false, // hide column
                label: '生产车间', // column title
                prop: 'workShop',
                // defaultValue: '',
                labelWidth: '90',
                width: '140',
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
                type: 'select', // column type
                hide: false, // hide column
                label: '生产产线',
                prop: 'productLine',
                defaultValue: '',
                labelWidth: '80',
                width: '200',
                marked: false, // mark it
                disabled: false,
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({ // /sysDept/childList
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
                type: 'select', // column type
                hide: false, // hide column
                label: '生产物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                marked: false, // mark it
                clearable: true,
                disabled: false,
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_PACKAGING_OEE_MATERIAL_QUERY_API({ // /pkgReportForm/material/query
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
                type: 'select', // column type
                hide: false, // hide column
                label: '包材物料',
                prop: 'pkgMaterialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                marked: false, // mark it
                clearable: true,
                disabled: false,
                defaultOptionsFn: () => {
                    return COMMON_API.SEARCH_MATERIAL_API({ // /pkgReportForm/material/query
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        materialType: 'ZVER'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            }


        ];

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
                    prop: 'orderNo',
                    label: '生产订单',
                    width: '120',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    subLabel: '',
                    dataType: 'default'
                },
                {
                    prop: 'materialName',
                    label: '生产物料',
                    minWidth: '240',
                    hide: false,
                    fixed: false,
                    clearable: true,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['materialName', 'materialCode']
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
                    prop: 'useMaterialName',
                    label: '组件物料',
                    minWidth: '240',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'multi',
                    data: ['useMaterialName', 'useMaterialCode']
                },
                {
                    prop: 'useMaterialUnit',
                    label: '单位',
                    width: '60',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'useAmount',
                    label: '订单领用',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'batch',
                    label: '批次',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'productUse',
                    label: '生产使用',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'badNum',
                    label: '不合格数',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'actualLoss',
                    label: '实际损耗',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'manufactor',
                    label: '厂家',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    custom: true,
                    dataType: 'default'
                },
                 {
                    prop: 'badReason',
                    label: '不良品原因',
                    minWidth: '200',
                    width: '200',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    custom: true,
                    dataType: 'default'
                },
                 {
                    prop: 'productDate',
                    label: '产出日期',
                    width: '180',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    custom: true,
                    dataType: 'default'
                },
                 {
                    prop: 'badRate',
                    label: '不良率',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    custom: true,
                    dataType: 'default'
                }
            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }


        // 查询请求
        listInterface = params => {
            const paramsTemp = JSON.parse(JSON.stringify(params))
            paramsTemp.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
            // search logic
            if (paramsTemp.isBadTemp === true) {
                paramsTemp.isBad = 1
            } else {
                paramsTemp.isBad = 0
            }
            delete paramsTemp.isBadTemp
            return REPORTS_API.REPORT_PACKAGING_DEFECTIVE_PRODUCT_QUERY_API(paramsTemp);
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
            this.currentQueryData = []
            if (!data.data) {
                this.$infoToast('查询无结果');
                return
            }
            this.currentQueryData = data.data
            console.log('this.currentQueryData')
            console.log(this.currentQueryData)
        }

    }
    interface CurrentQueryData{
        googRatio?: string;
        materialCode?: string;
        materialName?: string;
        notReach?: string[];
        notReachInfo?: DialogDataMainTable[];
        performCropRatio?: string;
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        theOEERatio?: string;
        timeCropRatio?: string;
        totalData?: TotalData[];
    }

    interface DialogDataMainTable{
        materialCode?: string;
        materialName?: string;
        notReachInfo?: NotReachInfo[];
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        stopTime?: number;
        stopType?: string;
    }
    interface NotReachInfo{
        changed?: string;
        changer?: string;
        classes?: string;
        created?: string;
        creator?: string;
        delFlag?: number;
        duration?: number;
        durationUnit?: string;
        endDate?: string;
        exceptionCount?: number;
        exceptionInfo?: string;
        factory?: string;
        id?: string;
        orderId?: string;
        orderNo?: string;
        remark?: string;
        startDate?: string;
        stopMode?: string;
        stopReason?: string;
        stopSituation?: string;
        stopType?: string;
        version?: number;
    }
    interface TotalData{
        allBad?: string;
        allTolTime?: string;
        alltime?: string;
        avbRatio?: string;
        effecCapacity?: string;
        excptTime?: string;
        googRatio?: string;
        netOprTime?: string;
        netOprTimeHour?: string;
        outPutTime?: string;
        output?: string;
        performCropRatio?: string;
        planStopTime?: string;
        proDuctRatio?: string;
        removeTime?: string;
        theOEERatio?: string;
        timeCropRatio?: string;
    }
</script>

<style lang="scss" scoped>

    .inner-area {
        .inner-area__title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            h3 {
                font-weight: bold;
                font-size: 14px !important;
                line-height: 32px;
                .title-icon {
                    display: inline-block;
                    width: 4px;
                    height: 12px;
                    margin-top: 10px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 2px;
                }
                .point-icon {
                    width: 5px;
                    height: 5px;
                    margin-top: 13px;
                    margin-right: 5px;
                    background: #487bff;
                    border-radius: 3px;
                }
            }
        }
        .inner-area__body {
            .table-style-light {
                .el-table__header {
                    th {
                        color: white;
                        text-align: center;
                        background: #e8e8e8;
                        background-color: #e8e8e8 !important;
                        border-top: none;
                        border-right: none;
                        border-bottom: none;
                        border-left: none;
                    }
                }
                .el-table__body {
                    td {
                        padding: 0;
                    }
                }
                tr:nth-child(even) {
                    background-color: #f7f7f7;
                }
                .el-table__row {
                    td:first-child {
                        border-left: 2px solid transparent;
                    }
                }
                .hover-row {
                    td:first-child {
                        border-left: 2px solid #e8e8e8;
                    }
                }
                .el-table__row:hover {
                    td:first-child {
                        border-left: 2px solid #e8e8e8;
                    }
                }

                .el-input.is-disabled .el-input__inner {
                    width: 100%;
                    overflow: hidden;
                    color: #666 !important;
                    background: none;
                    border: none;
                }
            }
        }
    }
    .dialog-footer {
        margin-top: 10px;
        text-align: right;
    }
</style>
