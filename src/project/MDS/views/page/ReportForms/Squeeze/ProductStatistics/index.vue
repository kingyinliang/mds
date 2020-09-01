<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:res:proSta'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
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
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);// eslint-disable-line
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['workShop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
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
                    linkageProp: ['childPotNo']
                },
                {
                    type: 'select',
                    label: '发酵罐',
                    defaultValue: '',
                    prop: 'childPotNo',
                    resVal: {
                        resData: 'list',
                        label: ['holderName'],
                        value: 'holderId'
                    },
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.CONTAINER_LIST_API}`, 'POST', {
                            factory: this.$refs.queryTable.queryForm.factory,
                            workShop: val
                        })
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'commitDateOne',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                    defaultValueTwo: dateFormat(new Date(), 'yyyy-MM-dd'),
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.PROSTA_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.PROSTA_EXPECT_API,
                auth: 'report:res:expectProSta',
                text: '生产品项统计报表'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '90'
                }, {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '95'
                }, {
                    prop: 'productDate',
                    label: '生产日期',
                    minwidth: '100'
                }, {
                    prop: 'useMaterial',
                    label: '领用物料',
                    minwidth: '150'
                }, {
                    prop: 'useAmount',
                    label: '领用量',
                    minwidth: '70'
                }, {
                    prop: 'material',
                    label: '生产物料',
                    minwidth: '150'
                }, {
                    prop: 'inPotAmount',
                    label: '入库量',
                    minwidth: '70'
                }, {
                    prop: 'oneCage',
                    label: '1#笼数',
                    minwidth: '70'
                }, {
                    prop: 'twoCage',
                    label: '2#笼数',
                    minwidth: '70'
                }, {
                    prop: 'threeCage',
                    label: '3#笼数',
                    minwidth: '70'
                }, {
                    prop: 'fourCage',
                    label: '4#笼数',
                    minwidth: '70'
                }, {
                    prop: 'boardNum',
                    label: '酱渣板数',
                    minwidth: '90'
                }, {
                    prop: 'spiral',
                    label: '出油率',
                    minwidth: '70'
                }, {
                    prop: 'fermentationTankName',
                    label: '发酵罐',
                    minwidth: '100'
                }, {
                    prop: 'originalTankName',
                    label: '原汁罐',
                    minwidth: '100'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
