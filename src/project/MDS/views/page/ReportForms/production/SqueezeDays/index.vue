<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :rules="rules"
            table-class="borderTable"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :query-auth="'report:production:prsDays'"
            :export-excel="true"
            :show-page="false"
            :export-option="exportOption"
            :tabs="tabs"
            @get-data-success="setData"
        />
    </div>
</template>

<script>
    import { BASICDATA_API, REP_API } from '@/api/api';
    import { dateFormat } from '@/net/validate';
    export default {
        name: 'Index',
        components: {},
        data() {
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
                        defaultValue: dateFormat(new Date(), 'yyyy-MM'),
                        dataType: 'month',
                        valueFormat: 'yyyy-MM'
                    }
                ],
                listInterface: params => {
                    return this.$http(`${REP_API.SQUEEZEDAYS_LIST}`, 'POST', params);
                },
                exportOption: {
                    exportInterface: REP_API.SQUEEZEDAYS_OUT,
                    auth: 'report:production:prsDaysExport',
                    text: '压榨日报表'
                },
                tabs: [
                    {
                        label: '压榨一',
                        tableData: [],
                        column: [
                            {
                                prop: 'days',
                                label: '名称'
                            },
                            {
                                label: '领用/方',
                                child: [
                                    {
                                        prop: 'collarUse',
                                        label: '普通酱醪'
                                    }
                                ]
                            },
                            {
                                label: '产出/方',
                                child: [
                                    {
                                        prop: 'produce',
                                        label: '普通原汁'
                                    }
                                ]
                            },
                            {
                                label: '生产笼数/笼',
                                child: [
                                    {
                                        prop: 'oneNums',
                                        label: '一期'
                                    },
                                    {
                                        prop: 'twoNums',
                                        label: '二期'
                                    },
                                    {
                                        prop: 'threeNums',
                                        label: '三期'
                                    },
                                    {
                                        prop: 'fourNums',
                                        label: '四期'
                                    }
                                ]
                            },
                            {
                                prop: 'plateNums',
                                label: '酱渣板数/板'
                            },
                            {
                                prop: 'oilYield',
                                label: '出油率/%'
                            },
                            {
                                prop: 'tbdays',
                                label: '名称'
                            },
                            {
                                label: '领用/方',
                                child: [
                                    {
                                        prop: 'tbcollarUse',
                                        label: 'JYTB酱醪'
                                    }
                                ]
                            },
                            {
                                label: '产出/方',
                                child: [
                                    {
                                        prop: 'tbproduce',
                                        label: 'TB原汁'
                                    }
                                ]
                            },
                            {
                                label: '生产笼数/笼',
                                child: [
                                    {
                                        prop: 'tboneNums',
                                        label: '一期'
                                    },
                                    {
                                        prop: 'tbtwoNums',
                                        label: '二期'
                                    },
                                    {
                                        prop: 'tbthreeNums',
                                        label: '三期'
                                    },
                                    {
                                        prop: 'tbfourNums',
                                        label: '四期'
                                    }
                                ]
                            },
                            {
                                prop: 'tbplateNums',
                                label: '酱渣板数/板'
                            },
                            {
                                prop: 'tboilYield',
                                label: '出油率/%'
                            }
                        ]
                    },
                    {
                        label: '压榨二',
                        tableData: [],
                        column: [
                            {
                                prop: 'days',
                                label: '名称'
                            },
                            {
                                label: '领用/方',
                                child: [
                                    {
                                        prop: 'collarUse',
                                        label: '普通酱醪'
                                    }
                                ]
                            },
                            {
                                label: '产出/方',
                                child: [
                                    {
                                        prop: 'produce',
                                        label: '普通原汁'
                                    }
                                ]
                            },
                            {
                                label: '生产笼数/笼',
                                child: [
                                    {
                                        prop: 'oneNums',
                                        label: '一期'
                                    },
                                    {
                                        prop: 'twoNums',
                                        label: '二期'
                                    },
                                    {
                                        prop: 'threeNums',
                                        label: '三期'
                                    },
                                    {
                                        prop: 'fourNums',
                                        label: '四期'
                                    }
                                ]
                            },
                            {
                                prop: 'plateNums',
                                label: '酱渣板数/板'
                            },
                            {
                                prop: 'oilYield',
                                label: '出油率/%'
                            }
                        ]
                    }
                ]
            };
        },
        computed: {},
        methods: {
            setData(data) {
                data.prsDays.one.forEach((it, index) => {
                    it.tbdays = data.prsDays.oneTb[index].days;
                    it.tbcollarUse = data.prsDays.oneTb[index].collarUse;
                    it.tbproduce = data.prsDays.oneTb[index].produce;
                    it.tboneNums = data.prsDays.oneTb[index].oneNums;
                    it.tbtwoNums = data.prsDays.oneTb[index].twoNums;
                    it.tbthreeNums = data.prsDays.oneTb[index].threeNums;
                    it.tbfourNums = data.prsDays.oneTb[index].fourNums;
                    it.tbplateNums = data.prsDays.oneTb[index].plateNums;
                    it.tboilYield = data.prsDays.oneTb[index].oilYield;
                });
                this.tabs[0].tableData = data.prsDays.one;
                this.tabs[1].tableData = data.prsDays.two;
                if (data.prsDays.one.length) {
                    this.tabs[0].tableData.unshift({
                        days: '月计',
                        tbdays: '月计',
                        collarUse: data.prsDays.one[0].collarUseSum,
                        produce: data.prsDays.one[0].produceSum,
                        oneNums: data.prsDays.one[0].oneNumsSum,
                        twoNums: data.prsDays.one[0].twoNumsSum,
                        threeNums: data.prsDays.one[0].threeNumsSum,
                        fourNums: data.prsDays.one[0].fourNumsSum,
                        plateNums: data.prsDays.one[0].plateNumsSum,
                        oilYield: data.prsDays.one[0].monthOilYield,
                        tbcollarUse: data.prsDays.oneTb[0].collarUseSum,
                        tbproduce: data.prsDays.oneTb[0].produceSum,
                        tboneNums: data.prsDays.oneTb[0].oneNumsSum,
                        tbtwoNums: data.prsDays.oneTb[0].twoNumsSum,
                        tbthreeNums: data.prsDays.oneTb[0].threeNumsSum,
                        tbfourNums: data.prsDays.oneTb[0].fourNumsSum,
                        tbplateNums: data.prsDays.oneTb[0].plateNumsSum,
                        tboilYield: data.prsDays.oneTb[0].monthOilYield
                    });
                }
                if (data.prsDays.two.length) {
                    this.tabs[1].tableData.unshift({
                        days: '月计',
                        collarUse: data.prsDays.two[0].collarUseSum,
                        produce: data.prsDays.two[0].produceSum,
                        oneNums: data.prsDays.two[0].oneNumsSum,
                        twoNums: data.prsDays.two[0].twoNumsSum,
                        threeNums: data.prsDays.two[0].threeNumsSum,
                        fourNums: data.prsDays.two[0].fourNumsSum,
                        plateNums: data.prsDays.two[0].plateNumsSum,
                        oilYield: data.prsDays.two[0].monthOilYield
                    });
                }
            }
        }
    };
</script>

<style scoped></style>
