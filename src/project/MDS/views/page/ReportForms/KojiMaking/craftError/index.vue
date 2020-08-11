<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:kjmORwht:techExceptionList" :column="column" :export-excel="true" :export-option="exportOption" />
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
                return this.$http(`${REP_API.REPOUTCRARTERROR_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPOUTCRARTERROREXPORT_API,
                auth: 'report:kjmORwht:expectTechException',
                text: '工艺异常报表导出'
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
                    prop: 'inKjmDate',
                    label: '制曲日期',
                    minwidth: '100'
                },
                {
                    prop: 'cookingException',
                    label: '煮豆异常',
                    minwidth: '120'
                },
                {
                    prop: 'continuousCookingException',
                    label: '连续蒸煮异常',
                    minwidth: '120'
                },
                {
                    prop: 'blendException',
                    label: '混合入曲异常',
                    minwidth: '120'
                },
                {
                    prop: 'guardException',
                    label: '看曲异常',
                    minwidth: '120'
                },
                {
                    prop: 'outException',
                    label: '出曲异常',
                    minwidth: '120'
                }
            ]
        };
    }
};
</script>

<style lang="scss" scoped></style>
