<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:kjmORwht:beanTechList" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
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
                    linkageProp: ['workShop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                            deptId: val,
                            deptName: '制曲'
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['houseNoID', 'inPotNoID']
                },
                {
                    type: 'select',
                    label: '生产曲房',
                    prop: 'houseNoID',
                    resVal: {
                        resData: 'page.list',
                        label: ['holderName'],
                        value: 'holderId'
                    },
                    defaultValue: '',
                    optionsFn: val => {
                        const workShopName = this.$refs.queryTable.optionLists.workShop.find(item => item.deptId === val)['deptName'];
                        return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                            currPage: 1,
                            dept_id: val,// eslint-disable-line
                            holder_type: '005',// eslint-disable-line
                            pageSize: 9999,
                            type: 'holder_type',
                            workShopName: workShopName
                        });
                    }
                },
                {
                    type: 'select',
                    label: '发酵罐',
                    prop: 'inPotNoID',
                    optionsFn: val => {
                        const workShopName = this.$refs.queryTable.optionLists.workShop.find(item => item.deptId === val)['deptName'];
                        return this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
                            currPage: 1,
                            dept_id: val,// eslint-disable-line
                            holder_type: '001',// eslint-disable-line
                            pageSize: 9999,
                            type: 'holder_type',
                            workShopName: workShopName
                        });
                    },
                    defaultValue: '',
                    resVal: {
                        resData: 'page.list',
                        label: ['holderName'],
                        value: 'holderId'
                    }
                },
                {
                    type: 'date-interval',
                    label: '制曲日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPOUTBEANCRAFT_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPOUTBEANCRAFTEXPORT_API,
                auth: 'report:kjmORwht:expectBeanTech',
                text: '煮豆工艺报表导出'
            },
            column: [
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
                    prop: 'houseNoName',
                    label: '曲房',
                    minwidth: '100'
                },
                {
                    prop: 'inPotNoName',
                    label: '发酵罐',
                    minwidth: '100'
                },
                {
                    prop: 'cookingNoName',
                    label: '连续蒸煮号',
                    minwidth: '100'
                },
                {
                    prop: 'inKjmDate',
                    label: '制曲日期',
                    minwidth: '100'
                },
                {
                    prop: 'preheatTime',
                    label: '预热时间',
                    minwidth: '90'
                },
                {
                    prop: 'unloadingStartDate',
                    label: '下料开始时间',
                    minwidth: '165'
                },
                {
                    prop: 'unloadingEndDate',
                    label: '下料结束时间',
                    minwidth: '165'
                },
                {
                    prop: 'rateRunWater',
                    label: '润水比例',
                    minwidth: '100'
                },
                {
                    prop: 'realRate',
                    label: '实际比例',
                    minwidth: '100'
                },
                {
                    prop: 'tempRunWater',
                    label: '润水温度',
                    minwidth: '100'
                },
                {
                    prop: 'frequenceRunWater',
                    label: '润水变频',
                    minwidth: '100'
                },
                {
                    prop: 'oncePreheatFrequency',
                    label: '一次预热变频',
                    minwidth: '120'
                },
                {
                    prop: 'secondPreheatFrequency',
                    label: '二次预热变频',
                    minwidth: '120'
                },
                {
                    prop: 'secondPreheatTemp',
                    label: '二次预热温度',
                    minwidth: '120'
                },
                {
                    prop: 'unloadingSpeed',
                    label: '下料速度',
                    minwidth: '100'
                },
                {
                    prop: 'cookingFrequency',
                    label: '蒸煮变频',
                    minwidth: '100'
                },
                {
                    prop: 'upFrequency',
                    label: '上转阀变频',
                    minwidth: '100'
                },
                {
                    prop: 'downFrequency',
                    label: '下转阀变频',
                    minwidth: '100'
                },
                {
                    prop: 'cookingPress',
                    label: '蒸煮数显压力',
                    minwidth: '120'
                },
                {
                    prop: 'cookingMachinePress',
                    label: '蒸煮机械压力',
                    minwidth: '120'
                },
                {
                    prop: 'separateDrum',
                    label: '分气包压力',
                    minwidth: '100'
                },
                {
                    prop: 'cookingTemp',
                    label: '蒸煮数显温度',
                    minwidth: '120'
                },
                {
                    prop: 'cookingMachineTemp',
                    label: '蒸煮机械温度',
                    minwidth: '120'
                },
                {
                    prop: 'upCooling',
                    label: '上转阀冷却',
                    minwidth: '100'
                },
                {
                    prop: 'downCooling',
                    label: '下转阀冷却',
                    minwidth: '100'
                },
                {
                    prop: 'mixtureTemp',
                    label: '混合料温度',
                    minwidth: '100'
                },
                {
                    prop: 'inoculationTemp',
                    label: '接种温度',
                    minwidth: '100'
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
