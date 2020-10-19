<template>
    <div class="header_main">
        <query-table ref="queryTable" :table-class="tableClass" :rules="rules" :query-form-data="queryFormData" :list-interface="listInterface" :query-auth="'report:form:listProductM'" :column="column" :export-excel="true" :export-option="exportOption" @get-data-success="setTable" />
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
    data() {
        return {
            tableClass: '',
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
                            deptId: val,
                            deptName: '包装 组装'
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
                    type: 'select',
                    label: '品项',
                    prop: 'materialCode',
                    filterable: true,
                    resVal: {
                        resData: 'list',
                        label: ['sapName', 'itemCode'],
                        value: 'sapCode'
                    },
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDSAP_API}`, 'POST', { params: '' });
                    }
                },
                {
                    type: 'date-picker',
                    label: '生产日期',
                    prop: 'productDate',
                    dataType: 'month',
                    valueFormat: 'yyyy-MM'
                }
            ],
            rules: [
                {
                    prop: 'productDate',
                    text: '请选择月份'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPPRODUCTMLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPPRODUCTMOUTPUT_API,
                auth: 'report:form:exportProductM',
                text: '产量月汇总'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    width: '90'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    width: '95'
                },
                {
                    prop: 'productLineName',
                    label: '产线',
                    width: '70'
                },
                {
                    prop: 'materialH',
                    label: '生产品项',
                    width: '180'
                },
                {
                    prop: 'production',
                    label: '月计',
                    width: '100'
                },
                {
                    prop: 'productionUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'basic',
                    label: '月计',
                    width: '100'
                },
                {
                    prop: 'basicUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'ml',
                    label: '月计',
                    width: '100'
                },
                {
                    prop: 'mlUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'cubic',
                    label: '月计',
                    width: '80'
                },
                {
                    prop: 'cubicUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'brand',
                    label: '品牌',
                    width: '70'
                },
                {
                    prop: 'largeClass',
                    label: '类别',
                    width: '70'
                },
                {
                    prop: 'boxSpec',
                    label: '箱规格',
                    width: '70'
                },
                {
                    prop: 'boxSpecUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'productSpec',
                    label: '瓶规格',
                    width: '70'
                },
                {
                    prop: 'productSpecUnitName',
                    label: '单位',
                    width: '50'
                },
                {
                    prop: 'unitName',
                    label: '单位',
                    width: '50'
                }
            ]
        };
    },
    methods: {
        setTable(data) {
            this.column.splice(18, this.column.length - 19);
            if (data.page.list.length <= 0) {
                return false;
            }
            const productDate = this.$refs.queryTable.queryForm.productDate;
            const month = productDate.substring(productDate.indexOf('-') + 1).split('')[0] === '0' ? productDate.substring(productDate.indexOf('-') + 1).slice(1) : productDate.substring(productDate.indexOf('-') + 1);
            data.page.list[0].listMonth.forEach((item, index) => {
                this.column.splice(this.column.length - 1, 0, {
                    label: `${month}月${index + 1}日`,
                    child: [
                        {
                            prop: `listMonth[${index}].dayProduction`,
                            label: '白班产量'
                        },
                        {
                            prop: `listMonth[${index}].midProduction`,
                            label: '中班产量'
                        },
                        {
                            prop: `listMonth[${index}].nigProduction`,
                            label: '夜班产量'
                        }
                    ]
                });
            });
            this.tableClass = 'borderTable'
        }
    }
};
</script>

<style scoped></style>
