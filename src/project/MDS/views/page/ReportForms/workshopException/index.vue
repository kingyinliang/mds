<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:form:listExc" :column="column" :export-excel="true" :export-option="exportOption" />
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
                            deptId: val
                        });
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productline']
                },
                {
                    type: 'select',
                    label: '生产产线',
                    prop: 'productline',
                    resVal: {
                        resData: 'childList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
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
                return this.$http(`${REP_API.REPEXCLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPEXCOUTPUT_API,
                auth: 'report:form:exportExc',
                text: '车间异常统计报表数据导出'
            },
            column: [
                {
                    prop: 'productDate',
                    label: '生产日期',
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
                    prop: 'productLineName',
                    label: '产线',
                    minwidth: '95'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '120'
                },
                {
                    prop: 'materialH',
                    label: '物料',
                    minwidth: '150'
                },
                {
                    prop: 'expCodeName',
                    label: '异常情况',
                    minwidth: '80'
                },
                {
                    prop: 'expInfo',
                    label: '异常描述',
                    minwidth: '80'
                },
                {
                    prop: 'expStartDate',
                    label: '异常开始时间',
                    minwidth: '120'
                },
                {
                    prop: 'expEndDate',
                    label: '异常结束时间',
                    minwidth: '120'
                },
                {
                    prop: 'expContinue',
                    label: '异常时间',
                    minwidth: '77'
                },
                {
                    prop: 'expContinueUnit',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'deviceIdName',
                    label: '设备',
                    minwidth: '100'
                },
                {
                    prop: 'materialShortName',
                    label: '物料分类简称',
                    minwidth: '105'
                },
                {
                    prop: 'energyName',
                    label: '能源',
                    minwidth: '50'
                },
                {
                    prop: 'affectProduction',
                    label: '影响产量',
                    minwidth: '90'
                },
                {
                    prop: 'affectProductionUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '80'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
