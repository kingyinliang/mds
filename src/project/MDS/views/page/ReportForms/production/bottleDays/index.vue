<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            table-class="borderTable"
            :query-form-data="queryFormData"
            :rules="rules"
            :custom-data="true"
            :list-interface="listInterface"
            :query-auth="'report:fromEs:chuipingDaily'"
            :export-excel="true"
            :export-option="exportOption"
            :fix-table-height-from-top="180"
            :show-page="false"
            :tabs="tabs"
            @get-data-success="setData"
        />
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Bottle',
    data() {
        const bottleColumn = [{
            prop: 'theDate',
            label: '名称'
        }, {
            prop: 'workShopName',
            label: '瓶胚领用/个',
            child: [
                {
                    label: '普利思',
                    prop: 'plsRec'
                }, {
                    label: '西蒙西',
                    prop: 'xmxRec'
                }, {
                    label: '尧邦',
                    prop: 'ybRec'
                }
            ]
        }, {
            prop: 'allRec',
            label: '耗用瓶胚数量/个',
            width: '140'
        }, {
            prop: 'workShopName',
            label: 'PET瓶产出/个',
            child: [
                {
                    label: '普利思',
                    prop: 'plsOutput'
                }, {
                    label: '西蒙西',
                    prop: 'xmxOutput'
                }, {
                    label: '尧邦',
                    prop: 'ybOutput'
                }
            ]
        }, {
            prop: 'loss',
            label: '损耗数量/个'
        }, {
            prop: 'productRate',
            label: '良品率'
        }, {
            prop: 'pkgOutput',
            label: '包装领用/个'
        }];
        return {
            rules: [
                {
                    prop: 'factory',
                    text: '请选择工厂'
                },
                {
                    prop: 'productDate',
                    text: '请选择月份'
                }
            ],
            tabs: [
                {
                    label: '吹瓶一车间',
                    tableData: [],
                    column: bottleColumn
                },
                {
                    label: '吹瓶二车间',
                    tableData: [],
                    column: bottleColumn
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
                    label: '选择月份',
                    dataType: 'month',
                    prop: 'productDate',
                    valueFormat: 'yyyy-MM',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM')
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.BOTTLE_LIST_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.BOTTLE_REPORT_API,
                auth: 'report:fromEs:expectChuipingDaily',
                text: '吹瓶日报表'
            }
        };
    },
    methods: {
        setData(data) {
            this.tabs[0].tableData = data.list1;
            this.tabs[1].tableData = data.list2;
        }
    }
};
</script>

<style scoped></style>
