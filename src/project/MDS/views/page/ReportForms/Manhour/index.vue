<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :rules="rules" :list-interface="listInterface" query-auth="report:form:listWorkshopWHoursM" :column="column" :export-excel="true" :export-option="exportOption" @get-data-success="setTable" />
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
                    defaultValue: '',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYPARENTID_API}`, 'POST', { parentId: val });
                    }
                },
                {
                    type: 'date-picker',
                    label: '生产日期',
                    dataType: 'month',
                    valueFormat: 'yyyy-MM',
                    prop: 'productDate'
                }
            ],
            rules: [
                {
                    prop: 'productDate',
                    text: '请选择月份'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.REPMANHOURLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPMANHOUROUTPUT_API,
                auth: 'report:form:exportWorkshopWHoursM',
                text: '车间工时报表导出'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '120'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '120'
                },
                {
                    prop: 'productLineName',
                    label: '产线',
                    minwidth: '120'
                },
                {
                    prop: 'boxSpec',
                    label: '箱规格',
                    minwidth: '65'
                },
                {
                    prop: 'boxSpecUnitName',
                    label: '单位',
                    width: '80'
                },
                {
                    prop: 'productSpec',
                    label: '瓶规格',
                    minwidth: '65'
                },
                {
                    prop: 'productSpecUnitName',
                    label: '单位',
                    width: '80'
                }
            ]
        };
    },
    methods: {
        setTable(data) {
            this.column = this.column.slice(0, 7);
            const dataList = data.page.list
            if (dataList.length) {
                const temp = this.$refs.queryTable.queryForm.productDate;
                const month = temp.substring(temp.indexOf('-') + 1).split('')[0] === '0' ? temp.substring(temp.indexOf('-') + 1).slice(1) : temp.substring(temp.indexOf('-') + 1);
                dataList[0].listMonth.forEach((item, index) => {
                    this.column.push({
                        label: `${month}月${index + 1}日`,
                        child: [
                            {
                                prop: `listMonth[${index}].machineWorking`,
                                label: '机器工时'
                            },
                            {
                                prop: `listMonth[${index}].peopleWorking`,
                                label: '人工工时'
                            }
                        ]
                    })
                })
            }
        }
    }
};
</script>

<style scoped></style>
