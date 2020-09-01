<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:formh:pwList" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
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
                    },
                    linkageProp: ['workshop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workshop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val,
                            deptName: '炒麦'
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                params.currPage = String(params.currPage);
                params.pageSize = String(params.pageSize);
                return this.$http(`${REP_API.REPPWFRY_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPPWFRYOUT_API,
                auth: 'report:formh:exportpwList',
                text: 'PW小麦报表导出'
            },
            column: [
                {
                    prop: 'productDate',
                    label: '生产日期',
                    width: '100'
                },
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '95'
                },
                {
                    prop: 'issueWeight',
                    label: '小麦领用量',
                    minwidth: '120'
                },
                {
                    prop: 'inStorageWeight',
                    label: 'PW小麦量',
                    minwidth: '120'
                },
                {
                    prop: 'granuleWeight',
                    label: '小颗粒量',
                    minwidth: '120'
                },
                {
                    prop: 'sell',
                    label: '出仁率',
                    minwidth: '120'
                },
                {
                    prop: 'loss',
                    label: '损耗率',
                    minwidth: '120'
                }
            ]
        };
    }
};
</script>

<style>
.fry-wheat-report-forms .el-card__body {
    padding: 12px !important;
}
</style>
<style scoped></style>
