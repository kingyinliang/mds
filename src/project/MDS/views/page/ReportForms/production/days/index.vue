<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :rules="rules"
            :list-interface="listInterface"
            :query-auth="'report:fromEs:zhiquDaily'"
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
    import { REP_API, BASICDATA_API } from '@/api/api';
    import { dateFormat } from '@/net/validate.js';
    export default {
        name: 'Index',
        components: {},
        data() {
            // let self = this
            const kojimakingColumn = [
                {
                    prop: 'theDate',
                    label: '工序',
                    fixed: 'left'
                },
                {
                    prop: 'workShopName',
                    label: '炒麦',
                    child: [
                        {
                            label: '小麦/kg',
                            prop: 'wheat'
                        },
                        {
                            label: '粉麦数/kg',
                            prop: 'wheatFlour',
                            width: '120'
                        },
                        {
                            label: '粉麦率/%',
                            prop: 'wheatFlourRate',
                            width: '120'
                        },
                        {
                            label: '损耗率/%',
                            prop: 'wheatFlourLossRate',
                            width: '120'
                        }
                    ]
                },
                {
                    prop: 'productLineName',
                    label: 'PW小麦',
                    child: [
                        {
                            label: '小麦/kg',
                            prop: 'pwWheatOut'
                        },
                        {
                            label: 'PW小麦/kg',
                            prop: 'pwWheatIn',
                            width: '120'
                        },
                        {
                            label: '小颗粒/kg',
                            prop: 'pwWheatSmall',
                            width: '120'
                        },
                        {
                            label: '出仁率/%',
                            prop: 'pwKernelRate',
                            width: '120'
                        },
                        {
                            label: '损耗率/%',
                            prop: 'pwKernelLossRate',
                            width: '120'
                        }
                    ]
                },
                {
                    prop: 'productDate',
                    label: '制曲',
                    child: [
                        {
                            label: '豆粕/kg',
                            prop: 'zhiquPulp'
                        },
                        {
                            label: '小麦粉/kg',
                            prop: 'zhiquWheatFlour',
                            width: '120'
                        },
                        {
                            label: '盐水/方',
                            prop: 'zhiquSalt'
                        },
                        {
                            label: '菌种/盒',
                            prop: 'zhiquBacteria'
                        },
                        {
                            label: '入曲/批',
                            prop: 'zhiquHolderPatch'
                        },
                        {
                            label: '曲房号/号',
                            prop: 'zhiquHouseNo',
                            width: '120',
                            showOverFlowTooltip: true
                        },
                        {
                            label: '产量/方',
                            prop: 'zhiquProduction'
                        }
                    ]
                },
                {
                    prop: 'orderNo',
                    label: '出曲',
                    child: [
                        {
                            label: '出曲/批',
                            prop: 'outHolderPatch'
                        },
                        {
                            label: '出曲数量/方',
                            prop: 'outProduction',
                            width: '130'
                        }
                    ]
                }
            ];
            return {
                rules: [
                    {
                        prop: 'factory',
                        text: '请选择工厂'
                    },
                    {
                        // {
                        //  prop: 'workShop',
                        //  text: '请选择车间'
                        // },
                        prop: 'productDate',
                        text: '请选择月份'
                    }
                ],
                abc: [
                    {
                        prop: 'theDate',
                        label: '工序',
                        fixed: 'left'
                    },
                    {
                        prop: 'workShopName',
                        label: '炒麦',
                        child: [
                            {
                                label: '小麦/kg',
                                prop: 'wheat'
                            },
                            {
                                label: '粉麦数/kg',
                                prop: 'wheatFlour',
                                width: '120'
                            },
                            {
                                label: '粉麦率/%',
                                prop: 'wheatFlourRate',
                                width: '120'
                            },
                            {
                                label: '损耗率/%',
                                prop: 'wheatFlourLossRate',
                                width: '120'
                            }
                        ]
                    },
                    {
                        prop: 'productLineName',
                        label: 'PW小麦',
                        child: [
                            {
                                label: '小麦/kg',
                                prop: 'pwWheatOut'
                            },
                            {
                                label: 'PW小麦/kg',
                                prop: 'pwWheatIn',
                                width: '120'
                            },
                            {
                                label: '小颗粒/kg',
                                prop: 'pwWheatSmall',
                                width: '120'
                            },
                            {
                                label: '出仁率/%',
                                prop: 'pwKernelRate',
                                width: '120'
                            },
                            {
                                label: '损耗率/%',
                                prop: 'pwKernelLossRate',
                                width: '120'
                            }
                        ]
                    },
                    {
                        prop: 'productDate',
                        label: '制曲',
                        child: [
                            {
                                label: '豆粕/kg',
                                prop: 'zhiquPulp'
                            },
                            {
                                label: '小麦粉/kg',
                                prop: 'zhiquWheatFlour',
                                width: '120'
                            },
                            {
                                label: '盐水/方',
                                prop: 'zhiquSalt'
                            },
                            {
                                label: '菌种/盒',
                                prop: 'zhiquBacteria'
                            },
                            {
                                label: '入曲/批',
                                prop: 'zhiquHolderPatch'
                            },
                            {
                                label: '曲房号/号',
                                prop: 'zhiquHouseNo',
                                width: '120',
                                showOverFlowTooltip: true
                            },
                            {
                                label: '产量/方',
                                prop: 'zhiquProduction'
                            }
                        ]
                    },
                    {
                        prop: 'orderNo',
                        label: '出曲',
                        child: [
                            {
                                label: '出曲/批',
                                prop: 'outHolderPatch'
                            },
                            {
                                label: '出曲数量/方',
                                prop: 'outProduction',
                                width: '130'
                            }
                        ]
                    }
                ],
                tabs: [
                    {
                        label: '制曲一车间',
                        tableData: [],
                        column: kojimakingColumn
                    },
                    {
                        label: '制曲二车间',
                        tableData: [],
                        column: kojimakingColumn
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
                    return this.$http(`${REP_API.DAYS_REPROT_LIST}`, 'POST', params);
                },
                exportOption: {
                    exportInterface: REP_API.DAYS_REPROT_EXOECT,
                    auth: 'report:fromEs:expectZhiquDaily',
                    text: '制曲日报表数据导出'
                }
            };
        },
        computed: {},
        methods: {
            setData(data) {
                this.tabs[0].tableData = data.page.list;
                this.tabs[1].tableData = data.page2.list;
            }
        }
    };
</script>

<style scoped></style>
