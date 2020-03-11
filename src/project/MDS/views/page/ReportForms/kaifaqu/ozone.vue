<template>
    <div class="header_main">
        <query-table ref="queryTable" :queryFormData="queryFormData" :listInterface="listInterface" :queryAuth="'o3:board:charList'" :column="column" :exportExcel="true" :exportOption="exportOption" :showPage="true" />
    </div>
</template>

<script>
import { REP_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '名称',
                    prop: 'paraName',
                    defaultOptionsFn: () => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { type: 'O3' }, false, false, false);
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'code'
                    }
                },
                {
                    type: 'date-picker',
                    label: '时间选择',
                    dataType: 'month',
                    prop: 'endTime',
                    valueFormat: 'yyyy-MM'
                },
                {
                    type: 'input',
                    label: '限定值',
                    prop: 'v'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.OZONE_SEARCH_LIST}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.OZONE_SEARCH_EXPECT,
                auth: 'o3:board:expectCharList',
                text: '臭氧看板数据导出'
            },
            column: [
                {
                    prop: 'paraName',
                    label: '名称'
                },
                {
                    prop: 'v',
                    label: '数值'
                },
                {
                    prop: 'dateTime',
                    label: '时间'
                }
            ]
        };
    },
    computed: {},
    mounted() {},
    methods: {}
};
</script>

<style scoped></style>
