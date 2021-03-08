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
            @data-action="dataAction"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    import { exportFileFor2ExcelMultiSheets } from 'utils/utils.ts';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'DailyReport'
    })
    export default class DailyReport extends Vue {
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
                text: '产线OEE报表'
            }
        }

        // 查询表头
        queryFormData = [
            {
                type: 'select', // column type
                hide: false, // hide column
                label: '生产车间', // column title
                prop: 'workShop',
                defaultValue: '',
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
                type: 'date-picker',
                hide: false, // hide column
                label: '生产日期',
                defaultValue: '',
                labelWidth: '80', // default 70px
                width: '160', // default 70px
                dataType: 'date',
                prop: 'startDate',
                marked: false, // mark it
                clearable: true,
                disabled: false
            }
            // {
            //     type: 'date-picker',
            //     hide: false, // hide column
            //     label: '生产日期',
            //     defaultValue: '',
            //     labelWidth: '80', // default 70px
            //     width: '305', // default 305px
            //     marked: false, // mark it
            //     clearable: true,
            //     prop: 'startDate',
            //     propTwo: 'endDate',
            //     disabled: false
            // }
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
                    prop: 'materialName',
                    label: '生产物料',
                    minWidth: '120',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    subLabel: '',
                    dataType: 'default'
                },
                {
                    prop: 'theoryNum',
                    label: '理论量',
                    minWidth: '120',
                    hide: false,
                    fixed: false,
                    subLabel: '(箱)',
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'todayNum',
                    label: '今日产量',
                    width: '200',
                    hide: false,
                    fixed: false,
                    subLabel: '(箱)',
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'useMaterialName',
                    label: '包材物料',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'useMaterialUnit',
                    label: '单位',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'bomNum',
                    label: '订单计划量',
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
                    prop: 'feedNum',
                    label: '补料量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'lssueNum',
                    label: '仓库发料量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'actualNum',
                    label: '实际用料',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'actualLossNum',
                    label: '实际损失',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'badNum',
                    label: '不良品',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'returnNum',
                    label: '实退量',
                    width: '100',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
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
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_PRODUCT_DAY_QUERY_API(params);
        };


        dataAction(row, index) {
            console.log(row)
            console.log(index)
            this.isDialogVisible = true;
            this.dialogDataMainTable = this.currentQueryData[index].notReachInfo as DialogDataMainTable[]
            // if (this.dialogDataMainTable.length !== 0) {
            //     this.dialogDataSecondTable = this.dialogDataMainTable.notReachInfo as DialogDataSecondTable[]
            // }

        }

         // 表格双击
        showDetailInfo() {
            this.isShowSecondTable = true;
        }

        subTableExportExcel(data) {
            const excelDatas = [
                {
                    tHeader: ['生产线', '物料编码', '生产物料', '月/季', '停机情况', '停机时长（MIN)'],
                    filterVal: ['productLineName', 'materialCode', 'materialName', 'productDate', 'stopType', 'stopTime'],
                    tableDatas: data,
                    sheetName: '异常汇总'
                }
            ]

            data.foeEach(item => {
                excelDatas.push({
                    tHeader: ['生产日期', '停机类型', '停机方式', '停机时间开始', '停机结束时间', '停机时长（MIN)', '次数', '停机情况', '停机原因'],
                    filterVal: ['productDate', 'stopType', 'stopMode', 'startDate', 'endDate', 'duration', 'exceptionCount', 'stopReason'],
                    tableDatas: item.notReachInfo,
                    sheetName: item.stopType
                })
            })
            exportFileFor2ExcelMultiSheets(excelDatas, '异常明细', true, 'xlsx')
        }

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
                this.$infoToast('暂无任何内容');
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
