<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :tabs="tabs"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component({})
    export default class DeploySauce extends Vue {
        Column = [
            {
                label: '调酱单号',
                prop: 'productLineName',
                formatter: (row) => {
                    const h = this.$createElement; // eslint-disable-line
                    return h('div', {
                        style: {
                            color: '#45c2b5',
                            cursor: 'pointer'
                        },
                        on: {
                            click: () => {
                                this.goDetail(row); // eslint-disable-line
                            }
                        }
                    }, row.dictValue);
                },
                minwidth: '160'
            },
            {
                label: '开罐类型',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '领用物料',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '调配容器',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '申请数量',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '生产日期',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '开罐号',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '操作人员',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '操作时间',
                prop: 'productLineName',
                minwidth: '160'
            }
        ]

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '发酵'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '调酱容器',
                prop: 'productLine',
                defaultOptionsFn: () => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: '014'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['holderNo'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '领用容器',
                prop: 'a',
                defaultOptionsFn: () => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: '014'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['holderNo'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '领用物料',
                prop: 'b',
                defaultOptionsFn: () => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: '014'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['holderNo'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '调酱单号',
                prop: 'orderNo'
            },
            {
                type: 'select',
                label: '开罐类型',
                prop: 'orderType',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'ORDER_TYPE'
                    });
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'orderStartDateBegin',
                propTwo: 'orderStartDateEnd'
            }
        ]

        tabs = [
            {
                label: '待调酱',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: this.Column // eslint-disable-line
            },
            {
                label: '已调酱',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: this.Column // eslint-disable-line
            }
        ]

        goDetail(row) {
            console.log(row);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-OpenPot-applyDetail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-OpenPot-applyDetail`
                });
            }, 100);
        }
    }
</script>

<style scoped>

</style>
