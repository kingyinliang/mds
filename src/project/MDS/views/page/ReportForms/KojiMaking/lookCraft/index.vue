<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:kjmORwht:guardTechList" table-class="newTable borderTable" :column="column" :export-excel="true" :export-option="exportOption" />
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
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'date-interval',
                    label: '制曲日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPOUTLOOKCRAFT_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPOUTLOOKCRAFTEXPORT_API,
                auth: 'report:kjmORwht:expectGuardTech',
                text: '看曲工艺报表导出'
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
                    prop: 'inKjmDate',
                    label: '制曲日期',
                    minwidth: '100'
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
                    prop: 'beanMaterialName',
                    label: '豆粕物料',
                    minwidth: '100'
                },
                {
                    prop: 'pulpWeight',
                    label: '豆粕量',
                    minwidth: '100'
                },
                {
                    prop: 'beanBatch',
                    label: '豆粕批次',
                    minwidth: '100',
                    showOverFlowTooltip: true
                },
                {
                    prop: 'wheatWeight',
                    label: '麦粉量',
                    minwidth: '100'
                },
                {
                    prop: 'whtBatch',
                    label: '麦粉批次',
                    minwidth: '100',
                    showOverFlowTooltip: true
                },
                {
                    prop: 'saltWaterWeight',
                    label: '盐水量',
                    minwidth: '100'
                },
                {
                    prop: 'inStartTime',
                    label: '入曲开始时间',
                    minwidth: '165'
                },
                {
                    prop: 'inEndTime',
                    label: '入曲结束时间',
                    minwidth: '165'
                },
                {
                    prop: 'overWeight',
                    label: '二翻加水量',
                    minwidth: '100'
                },
                {
                    prop: 'outWeight',
                    label: '出曲加水量',
                    minwidth: '100'
                },
                {
                    prop: 'oneCodeU',
                    label: 'U',
                    child: [
                        { label: '一翻感官', prop: 'oneCodeU' },
                        { label: '二翻感官', prop: 'twoCodeU' },
                        { label: '出曲感官', prop: 'outCodeU' }
                    ]
                },
                {
                    prop: 'oneCodeS',
                    label: 'S',
                    child: [
                        { label: '一翻感官', prop: 'oneCodeS' },
                        { label: '二翻感官', prop: 'twoCodeS' },
                        { label: '出曲感官', prop: 'outCodeS' }
                    ]
                },
                {
                    prop: 'oneCodeA',
                    label: 'A',
                    child: [
                        { label: '一翻感官', prop: 'oneCodeA' },
                        { label: '二翻感官', prop: 'twoCodeA' },
                        { label: '出曲感官', prop: 'outCodeA' }
                    ]
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
