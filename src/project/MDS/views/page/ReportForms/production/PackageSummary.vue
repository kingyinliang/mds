<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :rules="rules"
            :queryFormData="queryFormData"
            getListField="packingYield"
            :showPage="false"
            :listInterface="listInterface"
            :queryAuth="'report:production:packingYield'"
            :column="column"
            :exportExcel="true"
            :tableData="tableData"
            :exportOption="exportOption"
            @get-data-success="setTable"
        />
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { REP_API, BASICDATA_API } from '@/api/api';
export default {
    name: 'JuiceOccupation',
    components: {},
    data() {
        return {
            tableData: [],
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
                    }
                },
                {
                    type: 'date-picker',
                    label: '月份',
                    prop: 'productDate',
                    dataType: 'month',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM'),
                    valueFormat: 'yyyy-MM'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.PACKINGYUELD_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.PACKINGYUELD_EXPORT_API,
                auth: 'report:production:packingYieldExport',
                text: '包装产量汇总数据导出'
            },
            column: [
                {
                    prop: 'days',
                    label: '',
                    width: '100px'
                },
                {
                    prop: 'workShopOne',
                    label: '包装1/方'
                },
                {
                    prop: 'workShopTwo',
                    label: '包装2/方'
                },
                {
                    prop: 'workShopThree',
                    label: '包装3/方'
                },
                {
                    prop: 'amount',
                    label: '小计/方'
                }
            ]
        };
    },
    computed: {},
    mounted() {},
    methods: {
        setTable(data) {
            this.$refs.queryTable.tableData.splice(0, 0, {
                days: '月计',
                workShopOne: this.$refs.queryTable.tableData[0].monthSumOne,
                workShopTwo: this.$refs.queryTable.tableData[0].monthSumTwo,
                workShopThree: this.$refs.queryTable.tableData[0].monthSumThree,
                amount: this.$refs.queryTable.tableData[0].monthSum
            });
        }
    }
};
</script>

<style scoped></style>
