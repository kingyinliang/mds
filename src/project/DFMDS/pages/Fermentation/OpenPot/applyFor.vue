<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :column="column"
            :show-table="true"
            :show-operation-column="true"
            :operation-column-width="80"
        >
            <template slot="mds-button">
                <el-button type="primary" size="small" style="margin-left: 10px;" @click="AddDate()">
                    新增
                </el-button>
            </template>
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
    import { dateFormat } from 'utils/utils';

    @Component
    export default class ApplyFor extends Vue {
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '包装'
                    })
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
                        dictType: 'ORDER_TYPE'
                    })
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
                        dictType: 'ORDER_TYPE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ]

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
                label: '开罐单号',
                prop: 'productLineName',
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
        ]

        del() {
        //
        }
    }
</script>

<style scoped>

</style>
