<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :column="column"
            :show-table="true"
            :show-operation-column="true"
            :operation-column-width="65"
            :list-interface="listInterface"
            get-list-field="data"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                    新增
                </el-button>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="scope.$index === 0" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="del(scope.row, true)">
                    删除
                </el-button>
                <el-button v-if="scope.$index === 1" class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="withdraw(scope.row, true)">
                    撤回
                </el-button>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
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
                prop: 'productDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            },
            {
                type: 'select',
                label: '开罐类型',
                prop: 'orderType',
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
                prop: 'order',
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
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '开罐类型',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                type: 'clickSpan',
                label: '开罐单号',
                prop: 'productLineName',
                onclick: (row)=> this.goDetail(row), // eslint-disable-line
                minwidth: '160'
            },
            {
                label: '状态',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '物料',
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
                label: '申请人员',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '申请人员',
                prop: 'productLineName',
                minwidth: '160'
            },
            {
                label: '申请时间',
                prop: 'productLineName',
                minwidth: '160'
            }
        ];

        // 查询
        listInterface(params) {
            params['factory'] = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return COMMON_API.DICTQUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'ORDER_TYPE'
            });
        }

        goDetail(row: object) {
            console.log(row);
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
                console.log(row);
            })
        }

        withdraw() {
            //
        }
    }
</script>

<style scoped>

</style>
