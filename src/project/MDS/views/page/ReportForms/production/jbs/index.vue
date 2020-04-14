<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:production:jbsReport'" :column="column" :export-excel="true" :export-option="exportOption" get-list-field="jbsReport" :show-page="false" />
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'date-picker',
                    label: '月份',
                    prop: 'startDate',
                    dataType: 'month',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM'),
                    valueFormat: 'yyyy-MM'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.JBS_REPORT_LIST}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.JBS_REPORT_EXPORT,
                auth: 'report:production:jbsReportExport',
                text: 'JBS出品率'
            },
            column: [
                {
                    prop: 'type',
                    label: '大类'
                },
                {
                    prop: 'unit',
                    label: '单位'
                },
                {
                    prop: 'jbsOut',
                    label: 'JBS出库数'
                },
                {
                    prop: 'filterNums',
                    label: '过滤领用数'
                },
                {
                    prop: 'jbsProduce',
                    label: 'JBS出品率'
                }
            ]
        };
    },
    computed: {},
    methods: {}
};
</script>

<style scoped></style>
