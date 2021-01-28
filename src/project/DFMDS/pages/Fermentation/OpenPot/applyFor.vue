<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :factory-type="1"
            :query-form-data="queryFormData"
            :column="column"
            :show-table="true"
            :custom-data="true"
            :show-operation-column="true"
            :operation-column-width="65"
            :list-interface="listInterface"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                    新增
                </el-button>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="scope.row.statusName === '已保存'" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="del(scope.row, true)">
                    删除
                </el-button>
                <el-button v-if="scope.row.statusName === '待处理' || scope.row.statusName === '待审核'" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="withdraw(scope.row, true)">
                    撤回
                </el-button>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component
    export default class ApplyFor extends Vue {
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
                type: 'date-picker',
                label: '生产日期',
                prop: 'useDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
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
                type: 'select',
                label: '状态',
                prop: 'status',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'FER_OPEN_STATUS'
                    });
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ];

        column = [
            {
                label: '车间',
                prop: 'workShopName',
                minwidth: '120'
            },
            {
                label: '开罐类型',
                prop: 'openTypeName',
                minwidth: '100'
            },
            {
                label: '开罐单号',
                prop: 'openPotNo',
                minwidth: '140',
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
                    }, row.openPotNo);
                }
            },
            {
                label: '状态',
                prop: 'statusName',
                minwidth: '100'
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
        ];

        // 查询
        listInterface(params) {
            params['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return FER_API.FER_OPEN_POT_APPLY_LIST_API(params);
        }

        // out() {
        //     const params = {
        //         ...this.$refs.queryTable.queryForm,
        //         current: 1,
        //         size: 99999
        //     }
        //     FER_API.FER_OPEN_POT_APPLY_LIST_API(params).then(({ data }) => {
        //         exportFileFor2Excel(this.column, data.data.records, '报表')
        //     })
        // }

        goDetail(row: object) {
            this.$store.commit('fer/updateapplyForObj', row);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-OpenPot-applyDetail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-OpenPot-applyDetail`
                });
            }, 100);
        }

        AddDate() {
            this.$store.commit('fer/updateapplyForObj', {});
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Fermentation-OpenPot-applyDetail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-OpenPot-applyDetail`
                });
            }, 100);
        }

        del(row) {
            this.$confirm('确认删除, 是否继续?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                FER_API.FER_OPEN_POT_APPLY_DEL_API({
                    id: row.id
                }).then(() => {
                    this.$successToast('删除成功!');
                    this.$refs.queryTable.getDataList()
                })
            })
        }

        withdraw(row) {
            this.$confirm('确认撤回, 是否继续?', '撤回', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                FER_API.FER_OPEN_POT_APPLY_REVOCATION_API({
                    id: row.id
                }).then(() => {
                    this.$successToast('撤回成功!');
                    this.$refs.queryTable.getDataList()
                })
            })
        }
    }
</script>

<style scoped>

</style>
