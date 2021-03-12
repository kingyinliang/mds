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
        >
            <!-- <template v-slot:customDataTable>
                <el-table
                    ref="table"
                    class="newTable"
                    :data="tableData.slice((currentPage - 1) * currentSize, (currentPage - 1) * currentSize + currentSize)"
                    :height="dataTableSetting.tableHeightSet"
                    border
                    size="small"
                    tooltip-effect="dark"
                    header-row-class-name="tableHead"
                    :header-cell-style="tableHeaderCellStyle"
                    style="width: 100%; margin-bottom: 20px;"
                    :show-summary="dataTableSetting.tableAttributes.isShowSummary"
                    :summary-method="getSummaries"
                >
                    <el-table-column type="index" :index="indexMethod" label="序号" width="50px" fixed />
                    <el-table-column label="代码" prop="materialCode" width="190" show-overflow-tooltip fixed />
                    <el-table-column label="品名" prop="materialName" width="180" show-overflow-tooltip fixed />
                    <el-table-column label="月汇总" width="180" fixed>
                        <el-table-column label="产出/方" prop="monthOutput" />
                        <el-table-column label="投入/方" prop="monthInput" width="110" />
                    </el-table-column>
                    <el-table-column label="出品率" prop="monthProductRate" width="90" show-overflow-tooltip fixed />
                    <el-table-column v-for="(item, index) in daySizeList" :key="index" :label="item + '日'">
                        <el-table-column label="产出/方" :prop="`output${item}`" />
                        <el-table-column label="投入/方" :prop="`input${item}`" />
                    </el-table-column>
                </el-table>
                <el-pagination
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 50]"
                    :page-size="currentSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </template> -->
        </report-query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    // const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

    let daysList: DayData[] = [];
    @Component({
        components: {
        },
        name: 'LaborHoursStatisticsReport'
    })
    export default class LaborHoursStatisticsReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
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
                text: '人工工时统计报表'
            }
        }

        // 查询表头
        queryFormData = [
            {
                type: 'date-picker',
                hide: false, // hide column
                label: '生产日期',
                defaultValue: '',
                labelWidth: '90', // default 70px
                width: '160', // default 70px
                dataType: 'month',
                prop: 'startDate',
                valueFormat: 'yyyy-MM',
                marked: true, // mark it
                clearable: true,
                disabled: false
            },
            {
                type: 'select',
                hide: false, // hide column
                label: '生产车间',
                prop: 'workShop',
                // defaultValue: '',
                labelWidth: '80', // default 70px
                width: '150',
                clearable: true,
                marked: false, // mark it
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
                }
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
            }
        ];

        // data table area setting
        dataTableSetting={
            type: 'multiHeader', // default/multiHeader
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: true,
            showOperationColumn: false,
            showPagination: true,
            merges: [
                'A1:A2',
                'B1:B2',
                'C1:C2',
                'D1:E1'
            ],
            //表格数据
            column: [
                {
                    prop: 'materialCode',
                    label: '代码',
                    width: '120',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'materialName',
                    label: '品名',
                    minWidth: '180',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'useMaterialUnit',
                    label: '单位',
                    width: '80',
                    hide: false,
                    fixed: true,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: '',
                    label: '月度合计',
                    subLabel: '',
                    width: '180',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default',
                    child: [
                        { label: '实际产量', prop: 'actualYieldSum', width: 120 },
                        { label: '生产工时', prop: 'productionHoursSum', width: 120 }
                    ]
                },
                ...daysList.map((item) => {
                    return {
                        prop: '',
                        label: item,
                        child: [
                            { label: '实际产量', prop: `actualYield${item.productDate}`, width: 120 },
                            { label: '生产工时', prop: `productionHours${item.productDate}`, width: 120 }
                        ]
                    };
                })
            ],
            tableAttributes: {
                isShowSummary: true // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405

        }

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return REPORTS_API.REPORT_PACKAGING_LABOR_HOURS_STATISTICS_QUERY_API(params);

            return new Promise((resolve) => {
                REPORTS_API.REPORT_PACKAGING_LABOR_HOURS_STATISTICS_QUERY_API(params).then(res => {
                    daysList = [];
                    const resTemp = JSON.parse(JSON.stringify(res))
                    if (resTemp.data.data.length !== 0) {
                        resTemp.data.data.froEach(item => {
                            item.dayData.forEach(subItem => {
                                item[`actualYield${subItem.productDate}`] = subItem.actualYield
                                item[`productionHours${subItem.productDate}`] = subItem.productionHours
                                daysList.push(subItem)
                            })
                        })
                    }
                    resolve(resTemp)
                })
            });
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
    interface DayData{
        actualYield: number;
        productDate: string;
        productionHours: number;
    }
</script>
