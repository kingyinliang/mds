<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:formPress:pressList'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
export default {
    name: 'Press',
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
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', { parentId: val, deptType: 'proLine' });// eslint-disable-line
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'startTime',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                    defaultValueTwo: dateFormat(new Date(), 'yyyy-MM-dd'),
                    propTwo: 'endTime'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.SQUEEZEPRESSLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPSQUEEZEPRESS_API,
                auth: 'report:formPress:exportPress',
                text: '压榨报表数据导出'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '180'
                }, {
                    prop: 'workShop',
                    label: '车间',
                    minwidth: '100'
                }, {
                    prop: 'created',
                    label: '生产日期',
                    minwidth: '180'
                }, {
                    prop: 'pulpName',
                    label: '布浆线',
                    minwidth: '80'
                }, {
                    prop: 'hovercraftName',
                    label: '气垫车号',
                    minwidth: '100'
                }, {
                    prop: 'clothNo',
                    label: '布号',
                    minwidth: '100'
                }, {
                    prop: 'selfDrenchTime',
                    label: '自重自淋时间',
                    minwidth: '110'
                }, {
                    prop: 'pulpAmount',
                    label: '布浆量(方)',
                    minwidth: '100'
                }, {
                    prop: 'destoryNumEast',
                    label: '压榨一东碎布数',
                    minwidth: '130'
                }, {
                    prop: 'destoryNumWest',
                    label: '压榨一西碎布数',
                    minwidth: '130'
                }, {
                    prop: 'destoryNum',
                    label: '压榨二碎布数',
                    minwidth: '130'
                }, {
                    prop: 'potOne',
                    label: '发酵罐1',
                    minwidth: '100'
                }, {
                    prop: 'potTwo',
                    label: '发酵罐2',
                    minwidth: '180'
                }, {
                    prop: 'pulpNum',
                    label: '布浆张数',
                    minwidth: '100'
                }, {
                    prop: 'pulpStartDate',
                    label: '布浆开始时间',
                    minwidth: '180'
                }, {
                    prop: 'pulpEndDate',
                    label: '布浆结束时间',
                    minwidth: '180'
                }, {
                    prop: 'pulpTime',
                    label: '布浆时间',
                    minwidth: '100'
                }, {
                    prop: 'drenchTime',
                    label: '自淋时间',
                    minwidth: '100'
                }, {
                    prop: 'deviceName',
                    label: '预压机号',
                    minwidth: '100'
                }, {
                    prop: 'prePressStart',
                    label: '预压开始时间',
                    minwidth: '180'
                }, {
                    prop: 'prePressEnd',
                    label: '预压结束时间',
                    minwidth: '180'
                }, {
                    prop: 'prePressTime',
                    label: '预压时间',
                    minwidth: '100'
                }, {
                    prop: 'endDeviceName',
                    label: '终压机号',
                    minwidth: '100'
                }, {
                    prop: 'pressStart',
                    label: '终压开始时间',
                    minwidth: '180'
                }, {
                    prop: 'pressEnd',
                    label: '终压结束时间',
                    minwidth: '190'
                }, {
                    prop: 'sauceClass',
                    label: '酱醪品质',
                    minwidth: '100'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
