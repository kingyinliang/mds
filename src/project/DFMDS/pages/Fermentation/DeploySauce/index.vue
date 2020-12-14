<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :tabs="tabs"
            :query-form-data="queryFormData"
            :custom-data="true"
            :list-interface="listInterface"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component({})
    export default class DeploySauce extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        Column = [
            {
                type: 'clickSpan',
                label: '调酱单号',
                prop: 'mixSauceNo',
                onclick: (row)=> this.goDetail(row), // eslint-disable-line
                minwidth: '160'
            },
            {
                label: '开罐类型',
                prop: 'openTypeName',
                minwidth: '160',
                formatter: (row) => {
                    return row.ferOpen.openTypeName;
                }
            },
            {
                label: '领用物料',
                prop: 'productLineName',
                minwidth: '160',
                formatter: (row) => {
                    return row.mixMaterialCode + ' ' + row.mixMaterialName;
                }
            },
            {
                label: '调配容器',
                prop: 'mixPotName',
                minwidth: '160'
            },
            {
                label: '申请数量',
                prop: 'productLineName',
                minwidth: '160',
                formatter: (row) => {
                    return row.ferOpen.applyAmount;
                }
            },
            {
                label: '生产日期',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '开罐号',
                prop: 'openPotNo',
                minwidth: '160'
            },
            {
                label: '操作人员',
                prop: 'changer',
                minwidth: '160'
            },
            {
                label: '操作时间',
                prop: 'changed',
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
                prop: 'mixPotId',
                filterable: true,
                defaultOptionsFn: () => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: ['001', '028']
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '领用容器',
                prop: 'fermentorId',
                filterable: true,
                defaultOptionsFn: () => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: ['001']
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '领用物料',
                prop: 'applyMaterial',
                defaultOptionsFn: () => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: ['014']
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
                prop: 'mixSauceNo'
            },
            {
                type: 'select',
                label: '开罐类型',
                prop: 'openType',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'FER_OPEN_TYPE'
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
                prop: 'startIntoDate',
                propTwo: 'endIntoDate'
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

        // 查询请求
        listInterface(params) {
            if (this.$refs.queryTable.activeName === '0') {
                params.mixSauceStatus = 'N';
            } else {
                params.mixSauceStatus = 'Y';
            }
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            return FER_API.FER_DEPLOY_SAUCE_LIST_API(params);
        }

        // 设置数据
        setData(datas, st) {
            if (st) {
                this.tabs.map((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm))
                        if (index === 0) {
                            params.mixSauceStatus = 'N';
                        } else {
                            params.mixSauceStatus = 'Y';
                        }
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        FER_API.FER_DEPLOY_SAUCE_LIST_API(params).then(({ data }) => {
                            this.tabs[index].tableData = data.data.records;
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
            }
        }

        goDetail(row) {
            this.$store.commit('fer/updatedeploySauceObjObj', row);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-DeploySauce-datail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-DeploySauce-datail`
                });
            }, 100);
        }
    }
</script>

<style scoped>

</style>
