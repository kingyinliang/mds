<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :rules="rules" :list-interface="listInterface" table-class="newTable borderTable" query-auth="report:form:listAttM" :column="column" :export-excel="true" :export-option="exportOption" @get-data-success="setTable" />
    </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, REP_API } from '@/api/api';
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
                    }
                },
                {
                    type: 'select',
                    label: '考勤类型',
                    prop: 'kqlx',
                    defaultValue: '',
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                                type: 'other_time'
                            }).then(({ data }) => {
                                const list = data.dicList;
                                this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                                    type: 'normal_time'
                                }).then((val) => {
                                    resolve({
                                        data: list.concat(val.data.dicList)
                                    })
                                })
                            })
                        })
                    },
                    resVal: {
                        resData: '',
                        label: ['value'],
                        value: 'code'
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
                return this.$http(`${REP_API.REPATTMLIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.REPATTMOUTPUT_API,
                auth: 'report:form:exportAttM',
                text: '计时考勤报表导出'
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    minwidth: '100'
                },
                {
                    prop: 'workShopName',
                    label: '车间',
                    minwidth: '100'
                },
                {
                    prop: 'deptIdName',
                    label: '班组',
                    minwidth: '100'
                },
                {
                    prop: 'kqdlName',
                    label: '考勤大类',
                    minwidth: '100'
                },
                {
                    prop: 'kqlxName',
                    label: '考勤类型',
                    minwidth: '100'
                },
                {
                    prop: 'userId',
                    label: '人员',
                    minwidth: '150'
                },
                {
                    prop: 'allTime',
                    label: '统计',
                    child: [
                        { prop: 'allTime', label: '出勤总时数', width: '100' },
                        { prop: 'allDay', label: '出勤总天数', width: '100' }
                    ]
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
                                prop: `listMonth[${index}].timedTime`,
                                label: '计时时数'
                            },
                            {
                                prop: `listMonth[${index}].pieceTime`,
                                label: '计件时数'
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
