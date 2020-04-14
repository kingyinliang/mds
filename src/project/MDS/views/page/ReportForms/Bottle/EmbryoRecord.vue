<template>
    <div class="header_main">
        <query-table ref="queryTable" :rules="rules" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:fromEs:embryoRecord'" :column="column" :export-excel="true" :export-option="exportOption" />
    </div>
</template>

<script>
import { REP_API, BASICDATA_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'EmbryoRecord',
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
                    linkageProp: ['workShop', 'supplier']
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
                    type: 'input',
                    label: '瓶胚批号',
                    prop: 'embryoBatch'
                },
                {
                    type: 'select',
                    label: '供应商',
                    prop: 'supplier',
                    resVal: {
                        resData: 'dicList',
                        label: ['value'],
                        value: 'code'
                    },
                    defaultValue: '',
                    optionsFn: val => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                            factory: val,
                            type: 'supplier_bottle'
                        });
                    }
                },
                {
                    type: 'date-interval',
                    label: '生产日期',
                    prop: 'productDateStart',
                    propTwo: 'productDateEnd'
                }
            ],
            listInterface: params => {
                if (params.productDateStart || params.productDateEnd) {
                    return this.$http(`${REP_API.BOTTLEEMRE_LIST_API}`, 'POST', params);
                }
                    this.$warningTost('请选择生产日期');

            },
            exportOption: {
                exportInterface: REP_API.BOTTLEEMRE_EXPORT_API,
                auth: 'report:fromEs:expectEmbryoRecord',
                text: '吹瓶投胚记录数据导出'
            },
            column: [
                {
                    prop: 'productDate',
                    label: '生产日期',
                    width: '100'
                },
                {
                    prop: 'factoryName',
                    label: '工厂',
                    width: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    width: '90'
                },
                {
                    prop: 'productLineName',
                    label: '产线',
                    width: '90'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    width: '120'
                },
                {
                    prop: 'material',
                    label: '生产物料'
                },
                {
                    prop: 'date',
                    label: '投胚日期',
                    width: '120'
                },
                {
                    prop: 'embryoBatch',
                    label: '瓶胚批号',
                    width: '120'
                },
                {
                    prop: 'embryoAmount',
                    label: '瓶胚数量',
                    width: '120'
                },
                {
                    prop: 'unit',
                    label: '单位',
                    width: '120'
                },
                {
                    prop: 'isDustName',
                    label: '是否除尘',
                    width: '120'
                },
                {
                    prop: 'supplierName',
                    label: '供应商',
                    width: '120'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '70'
                }
            ]
        };
    }
};
</script>

<style scoped></style>
