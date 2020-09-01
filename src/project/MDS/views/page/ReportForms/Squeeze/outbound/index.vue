<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:formh:prsMaterialList'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script lang="ts">
import { BASICDATA_API, REP_API, SQU_API } from '@/api/api';
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {}
})
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
            linkageProp: ['workshop', 'fermentPotNo']
        },
        {
            type: 'select',
            label: '生产车间',
            prop: 'workshop',
            optionsFn: val => {
                return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {// eslint-disable-line
                    deptId: val,
                    deptName: '压榨'
                });
            },
            resVal: {
                resData: 'typeList',
                label: ['deptName'],
                value: 'deptId'
            },
            linkageProp: ['productLine']
        },
        {
            type: 'select',
            label: '布浆线',
            prop: 'productLine',
            defaultValue: '',
            resVal: {
                resData: 'childList',
                label: ['deptName'],
                value: 'deptId'
            },
            optionsFn: val => {
                return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val, deptType: 'proLine' });// eslint-disable-line
            }
        },
        {
            type: 'select',
            label: '发酵罐',
            defaultValue: '',
            prop: 'fermentPotNo',
            resVal: {
                resData: 'num',
                label: ['holderName'],
                value: 'holderId'
            },
            optionsFn: val => {
                return this.$http(`${SQU_API.MATERIAL_APPLY_POT_LIST_API}`, 'POST', { factory: val });// eslint-disable-line
            }
        },
        {
            type: 'date-interval',
            label: '生产日期',
            prop: 'commitDateOne',
            propTwo: 'commitDateTwo'
        }
    ]

    listInterface(params) {
        params.currPage = String(params.currPage);
        params.pageSize = String(params.pageSize);
        return this.$http(`${REP_API.APPLY_MATERIAL_LIST_API}`, 'POST', params);
    }

    exportOption = {
        exportInterface: REP_API.APPLY_MATERIAL_EXPECT_API,
        auth: 'report:formh:exportPrsMaterialList',
        text: '压榨领用报表'
    };

    column = [
        {
            prop: 'factoryName',
            label: '工厂',
            minwidth: '180'
        }, {
            prop: 'workShopName',
            label: '车间',
            minwidth: '130'
        }, {
            prop: 'productLineName',
            label: '布浆线',
            minwidth: '100'
        }, {
            prop: 'created',
            label: '生产日期',
            minwidth: '100'
        }, {
            prop: 'fermentPotName',
            label: '发酵罐',
            minwidth: '100'
        }, {
            prop: 'remainAmount',
            label: '发酵罐剩余量',
            minwidth: '120'
        }, {
            prop: 'startAmount',
            label: '起始数（方）',
            minwidth: '120'
        }, {
            prop: 'endAmount',
            label: '终止数（方）',
            minwidth: '120'
        }, {
            prop: 'amount',
            label: '打料数（方）',
            minwidth: '120'
        }, {
            prop: 'storageAmount',
            label: '暂存罐剩余量',
            minwidth: '120'
        }
    ]
}
</script>
<style lang="scss" scoped>
</style>
