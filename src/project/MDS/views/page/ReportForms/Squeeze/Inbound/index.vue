<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:formh:prsInstorageList'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script lang="ts">
import { BASICDATA_API, REP_API } from '@/api/api';
import { Vue, Component } from 'vue-property-decorator';

@Component({
    components: {}
})
export default class Index extends Vue {
    $refs: {
        queryTable: HTMLFormElement;
    };

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
                    deptName: '压榨'
                });
            },
            resVal: {
                resData: 'typeList',
                label: ['deptName'],
                value: 'deptId'
            },
            linkageProp: ['potNo']
        },
        {
            type: 'select',
            label: '原汁罐',
            prop: 'potNo',
            resVal: {
                resData: 'page.list',
                label: ['holderName'],
                value: 'holderId'
            },
            defaultValue: '',
            /* eslint-disable */
            optionsFn: val => {
                const workShopName = this.$refs.queryTable.optionLists.workshop.find(item => item.deptId === val)['deptName'];
                return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                    type: 'holder_type',
                    holder_type: '013',
                    pageSize: 9999,
                    workShopName: workShopName,
                    currPage: 1,
                    dept_id: val
                });
            }
            /* eslint-enable */
        },
        {
            type: 'date-interval',
            label: '生产日期',
            prop: 'commitDateOne',
            propTwo: 'commitDateTwo'
        },
        {
            type: 'radio',
            prop: 'mixType',
            defaultValue: '正常',
            radioArr: [
                {
                    label: '正常罐',
                    val: '正常'
                },
                {
                    label: '混合罐',
                    val: '混合'
                }
            ]
        }
    ];

    listInterface(params) {
        params.currPage = String(params.currPage);
        params.pageSize = String(params.pageSize);
        return this.$http(`${REP_API.INSTOCK_MATERIAL_LIST_API}`, 'POST', params);
    }

    exportOption = {
        exportInterface: REP_API.INSTOCK_MATERIAL_EXPECT_API,
        auth: 'report:formh:exportPrsInstorageList',
        text: '压榨入库报表'
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
            prop: 'productDate',
            label: '生产日期',
            minwidth: '100'
        }, {
            prop: 'potName',
            label: '原汁罐',
            minwidth: '100'
        }, {
            prop: 'batch',
            label: '原汁批次',
            minwidth: '120'
        }, {
            prop: 'inAmount',
            label: '入罐数量',
            minwidth: '100'
        }, {
            prop: 'fullPotAmount',
            label: '满罐数量',
            minwidth: '100'
        }, {
            prop: 'fulPotDate',
            label: '满罐日期',
            minwidth: '100'
        }, {
            prop: 'mixType',
            label: '是否混合罐',
            minwidth: '100'
        }, {
            prop: 'childPotName',
            label: '发酵罐号',
            minwidth: '100'
        }, {
            prop: 'childUsedAmount',
            label: '当日用量',
            minwidth: '100'
        }, {
            prop: 'remainAmount',
            label: '发酵罐剩余量',
            minwidth: '120'
        }
    ];
}
</script>
<style lang="scss" scoped>
</style>
