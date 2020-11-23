<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :tabs="tabs"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="del(scope.row, true)">
                    删除
                </el-button>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';

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
                prop: 'productMaterialCode',
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
                prop: 'productDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
            },
            {
                type: 'date-picker',
                label: '使用日期',
                prop: 'productDate1',
                valueFormat: 'yyyy-MM-dd hh:mm:ss'
            },
            {
                type: 'input',
                label: '开罐单号',
                prop: 'orderNo'
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
            }
        ]

        Column = [
            {
                prop: 'workShopName',
                label: '生产车间',
                minwidth: '50'
            },
            {
                prop: 'productLineName',
                label: '开罐类型',
                minwidth: '90'
            },
            {
                prop: 'orderNo',
                label: '开罐单号',
                formatter: (row) => {
                    const h = this.$createElement; // eslint-disable-line
                    return h('div', {
                        style: {
                            color: '#45c2b5',
                            cursor: 'pointer'
                        },
                        on: {
                            click: () => {
                                console.log(row);
                            }
                        }
                    }, row.dictValue);
                },
                minwidth: '70'
            },
            {
                prop: 'materialName',
                label: '物料',
                minwidth: '150'
            },
            {
                prop: 'planOutput',
                label: '申请数量',
                minwidth: '55'
            },
            {
                prop: 'productDate',
                label: '生产日期',
                minwidth: '60'
            },
            {
                prop: 'productDate',
                label: '申请人员',
                minwidth: '60'
            },
            {
                prop: 'productDate',
                label: '申请时间',
                minwidth: '60'
            }
        ]

        tabs = [
            {
                label: '待处理',
                tableData: [],
                column: this.Column // eslint-disable-line
            },
            {
                label: '已处理',
                tableData: [],
                column: this.Column // eslint-disable-line
            },
            {
                label: '已退回',
                tableData: [],
                column: this.Column // eslint-disable-line
            }
        ]

        del() {
        //
        }
    }
</script>

<style scoped>

</style>
