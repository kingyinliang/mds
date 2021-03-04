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
        name: 'HumanResourcesByDayReport'
    })
    export default class HumanResourcesByDayReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'workShop',
                    text: '请输入生产时间'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '每日人力报表'
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
                }
            },
            {
                type: 'date-interval',
                hide: false, // hide column
                label: '出勤日期',
                defaultValue: '',
                labelWidth: '100',
                width: '305',
                marked: false, // mark it
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
                    prop: 'attendanceDate',
                    label: '出勤日期',
                    minWidth: '120',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'post',
                    label: '岗位',
                    minWidth: '120',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'actualMan',
                    label: '实际人力',
                    width: '80',
                    hide: false,
                    fixed: false,
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'dayMan',
                    label: '出勤人力',
                    minWidth: '180',
                    hide: false,
                    fixed: false,
                    subLabel: '(白班)',
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'middayMan',
                    label: '出勤人力',
                    minWidth: '180',
                    hide: false,
                    fixed: false,
                    subLabel: '(中班)',
                    showOverFlowTooltip: true,
                    dataType: 'default'
                },
                {
                    prop: 'nightMan',
                    label: '出勤人力',
                    minWidth: '180',
                    hide: false,
                    fixed: false,
                    subLabel: '(晚班)',
                    showOverFlowTooltip: true,
                    dataType: 'default'
                }
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
            return REPORTS_API.REPORT_PACKAGING_DAYMAN_QUERY_API(params);
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
                this.$infoToast('暂无任何内容');
            }
        }

    }
</script>
