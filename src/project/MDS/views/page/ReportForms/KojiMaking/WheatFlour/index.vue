<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :list-interface="listInterface" query-auth="report:kjmORwht:checkRecordList" :column="column" :export-excel="true" :export-option="exportOption" />
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
                    linkageProp: ['workShop']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
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
                    },
                    linkageProp: ['deviceId']
                },
                {
                    type: 'select',
                    label: '炒麦机',
                    prop: 'deviceId',
                    resVal: {
                        resData: 'list.list',
                        label: ['deviceName'],
                        value: 'deviceId'
                    },
                    defaultValue: '',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.DEVICELIST_API}`, 'POST', {
                            param: '炒麦机',
                            deptId: val,
                            currPage: '1',
                            pageSize: '50'
                        });
                    }
                },
                {
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'commitDateOne',
                    propTwo: 'commitDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPCHECKRECORDLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPEXPECTCHECKRECORD_API,
                auth: 'report:kjmORwht:expectCheckRecord',
                text: '麦粉检测报表导出'
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
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '120'
                },
                {
                    prop: 'productDate',
                    label: '生产日期',
                    minwidth: '110'
                },
                {
                    prop: 'deviceName',
                    label: '炒麦机',
                    minwidth: '90'
                },
                {
                    prop: 'checkTime',
                    label: '检测时间',
                    minwidth: '120'
                },
                {
                    prop: 'cokingRate',
                    label: '焦糊率',
                    minwidth: '65'
                },
                {
                    prop: 'expandRate',
                    label: '膨胀率',
                    minwidth: '65'
                },
                {
                    prop: 'piecesRate',
                    label: '粉碎度',
                    minwidth: '65'
                },
                {
                    prop: 'changer',
                    label: '检测人员',
                    minwidth: '140'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    minwidth: '80'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
