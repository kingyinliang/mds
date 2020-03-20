<template>
    <div class="header_main">
        <query-table ref="queryTable" :rules="rules" :queryFormData="queryFormData" :listInterface="listInterface" :queryAuth="'report:production:bottleQuality'" :column="column" :exportExcel="true" returnColumnType="bottleQuality" :exportOption="exportOption" />
    </div>
</template>

<script>
import { REP_API, BASICDATA_API } from '@/api/api';
export default {
    name: 'JuiceOccupation',
    components: {},
    data() {
        return {
            rules: [
                {
                    prop: 'factory',
                    text: '请选择工厂'
                }
            ],
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
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '吹瓶' });
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
                    label: '生产产线',
                    prop: 'productLine',
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
                    type: 'input',
                    label: '生产订单',
                    prop: 'orderNo'
                },
                {
                    type: 'select',
                    label: '品项',
                    prop: 'materialCode',
                    filterable: true,
                    resVal: {
                        resData: 'bottleQualityMaterialCode',
                        label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
                        value: 'MATERIAL_CODE'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${REP_API.BOTTLEQUALITY_MATERIALCODE_API}`, 'POST', {}, false, false, false);
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'startDate',
                    propTwo: 'endDate'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.BOTTLEQUALITY_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.BOTTLEQUALITY_EXPORT_API,
                auth: 'report:production:bottleQualityExport',
                text: '吹瓶质量检测数据导出'
            },
            column: [
                {
                    prop: 'productDate',
                    label: '生产日期',
                    width: '100'
                },
                {
                    prop: 'factory',
                    label: '工厂',
                    width: '90'
                },
                {
                    prop: 'workShop',
                    label: '车间',
                    width: '90'
                },
                {
                    prop: 'productLine',
                    label: '产线',
                    width: '90'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    width: '120'
                },
                {
                    prop: 'materialCode',
                    label: '生产物料',
                    width: '120',
                    formatter: (row) => {
                        return row.materialCode + ' ' + row.materialName;
                    }
                },
                {
                    prop: 'date',
                    label: '检测时间',
                    width: '100'
                },
                {
                    prop: 'parameter',
                    label: '参数',
                    width: '100'
                },
                {
                    prop: 'oneWell',
                    label: '1#',
                    width: '70'
                },
                {
                    prop: 'twoWell',
                    label: '2#',
                    width: '70'
                },
                {
                    prop: 'threeWell',
                    label: '3#',
                    width: '70'
                },
                {
                    prop: 'fourWell',
                    label: '4#',
                    width: '70'
                },
                {
                    prop: 'fiveWell',
                    label: '5#',
                    width: '70'
                },
                {
                    prop: 'sixWell',
                    label: '6#',
                    width: '70'
                },
                {
                    prop: 'sevenWell',
                    label: '7#',
                    width: '70'
                },
                {
                    prop: 'eightWell',
                    label: '8#',
                    width: '70'
                },
                {
                    prop: 'nineWell',
                    label: '9#',
                    width: '70'
                },
                {
                    prop: 'tenWell',
                    label: '10#',
                    width: '70'
                },
                {
                    prop: 'elevenWell',
                    label: '11#',
                    width: '70'
                },
                {
                    prop: 'twelveWell',
                    label: '12#',
                    width: '70'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '70'
                },
                {
                    prop: 'changer',
                    label: '检测人',
                    width: '100'
                }
            ]
        };
    },
    computed: {},
    methods: {}
};
</script>

<style scoped></style>
