<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:formh:kjmProductList" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script lang="ts">
import { BASICDATA_API, REP_API } from '@/api/api';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Index extends Vue {
    queryFormData = [
        {
            type: 'select',
            label: '生产工厂',
            prop: 'factory',
            defaultOptionsFn: () => {
                return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);// eslint-disable-line
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
                return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {// eslint-disable-line
                    deptId: val,
                    deptName: '制曲'
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
    ];

    listInterface(params) {
        params.currPage = String(params.currPage);
        params.pageSize = String(params.pageSize);
        return this.$http(`${REP_API.KJMAKINGPRO_LIST_API}`, 'POST', params);
    }

    exportOption = {
        exportInterface: REP_API.KJMAKINGPRO_EXCEL_API,
        auth: 'report:formh:exportKjmProductList',
        text: '制曲生产报表导出'
    };

    column = [
        {
            prop: 'inKjmDate',
            label: '制曲日期',
            minwidth: '100'
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
            prop: 'allPlup',
            label: '豆粕量(KG)',
            minwidth: '100'
        },
        {
            prop: 'allWheat',
            label: '麦粉量(KG)',
            minwidth: '100'
        },
        {
            prop: 'allSalt',
            label: '盐水量(方)',
            minwidth: '100'
        },
        {
            prop: 'allMat',
            label: '菌种量(盒)',
            minwidth: '100'
        },
        {
            prop: 'allTPatch',
            label: '投料批数',
            minwidth: '100'
        },
        {
            prop: 'allOutMat',
            label: '投料量(方)',
            minwidth: '100'
        },
        {
            prop: 'allOutPatch',
            label: '出曲批数',
            minwidth: '100'
        },
        {
            prop: 'allOut',
            label: '出曲量',
            minwidth: '100'
        },
        {
            prop: 'houseStr',
            label: '曲房号',
            minwidth: '100'
        }
    ];
}
</script>
<style lang="scss" scoped>
</style>
