<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :factory-type="1"
            :query-form-data="queryFormData"
            :tabs="tabs"
            :list-interface="listInterface"
            :operation-column-width="65"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="goDetail(scope.row)">
                    开罐
                </el-button>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';

    @Component
    export default class List extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

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
                    });
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'material',
                defaultValue: '',
                filterable: true,
                defaultOptionsFn: () => {
                    return COMMON_API.SEARCH_MATERIAL_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        materialType: 'ZHAL'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'date-picker',
                label: '申请日期',
                prop: 'created',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
            },
            {
                type: 'date-picker',
                label: '使用日期',
                prop: 'useDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
            },
            {
                type: 'input',
                label: '开罐单号',
                prop: 'openPotNo'
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
            }
        ]

        Column = [
            {
                prop: 'workShopName',
                label: '生产车间',
                minwidth: '100'
            },
            {
                prop: 'openTypeName',
                label: '开罐类型',
                minwidth: '100'
            },
            {
                type: 'clickSpan',
                prop: 'openPotNo',
                label: '开罐单号',
                onclick: (row)=> this.goDetail(row), // eslint-disable-line
                minwidth: '140'
            },
            {
                label: '物料',
                prop: 'applyMaterialCode',
                minwidth: '180',
                formatter: (row) => {
                    return row.applyMaterialCode + ' ' + row.applyMaterialName;
                }
            },
            {
                label: '申请数量',
                prop: 'applyAmount',
                minwidth: '90'
            },
            {
                label: '生产日期',
                prop: 'useDate',
                minwidth: '140'
            },
            {
                label: '申请人员',
                prop: 'changer',
                minwidth: '140'
            },
            {
                label: '申请时间',
                prop: 'changed',
                minwidth: '140'
            }
        ]

        tabs = [
            {
                label: '待处理',
                tableData: [],
                showOperationColumn: true,
                pages: {
                    current: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: this.Column // eslint-disable-line
            },
            {
                label: '已处理',
                tableData: [],
                pages: {
                    current: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: this.Column // eslint-disable-line
            },
            {
                label: '已退回',
                tableData: [],
                pages: {
                    current: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: this.Column // eslint-disable-line
            }
        ]

        // 查询
        listInterface(params) {
            if (this.$refs.queryTable.activeName === '0') {
                params.status = 'D';
            } else if (this.$refs.queryTable.activeName === '1') {
                params.status = 'P';
            } else {
                params.status = 'R';
            }
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            return FER_API.FER_OPEN_POT_APPLY_LIST_API(params);
        }

        setData(datas, st) {
            if (st) {
                this.tabs.map((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm))
                        if (index === 0) {
                            params.status = 'D';
                        } else if (index === 1) {
                            params.status = 'P';
                        } else {
                            params.status = 'R';
                        }
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        FER_API.FER_OPEN_POT_APPLY_LIST_API(params).then(({ data }) => {
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
            this.$store.commit('fer/updateopenPotObj', row);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-OpenPot-OpenPotDedail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-OpenPot-OpenPotDedail`
                });
            }, 100);
        }
    }
</script>

<style scoped>

</style>
