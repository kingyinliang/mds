<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :factory-type="1"
            :query-form-data="queryFormData"
            :tabs="tabs"
            :rules="rules"
            :show-index-column="true"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import { dateFormat } from 'utils/utils';

@Component

export default class AuditIndex extends Vue {

    $refs: {
        queryTable: HTMLFormElement;
    };

    // 查询表头
    queryFormData = [
        {
            type: 'select',
            label: '生产车间',
            prop: 'workshop',
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
            },
            linkageProp: ['productLine']
        },
        {
            type: 'select',
            label: '生产产线',
            prop: 'productLine',
            optionsFn: val => {
                return COMMON_API.ORG_QUERY_CHILDREN_API({
                    parentId: val || ''
                })
            },
            resVal: {
                resData: 'data',
                label: ['deptName'],
                value: 'id'
            }
        },
        {
            type: 'input',
            label: '生产订单',
            prop: 'orderNo'
        },
        {
            type: 'date-interval',
            label: '生产日期',
            defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
            prop: 'orderStartDateBegin',
            propTwo: 'orderStartDateEnd'
        }
    ];

    Column = [
        {
            prop: 'orderStatus',
            label: '状态'
        },
        {
            prop: 'workShopName',
            label: '生产车间'
        },
        {
            prop: 'productLineName',
            label: '生产产线'
        },
        {
            prop: 'orderNo',
            label: '生产订单'
        },
        {
            prop: 'materialName',
            label: '生产物料'
        },
        {
            prop: 'planOutput',
            label: '订单数量'
        },
        {
            prop: 'outputUnit',
            label: '订单单位'
        },
        {
            prop: 'productDate',
            label: '生产日期'
        },
        {
            prop: 'status',
            label: '审核日志'
        }
    ]

    tabs = [
        {
            label: '待审核列表',
            tableData: [],
            column: [
                {
                    prop: 'orderStatus',
                    label: '状态'
                },
                {
                    prop: 'workShopName',
                    label: '生产车间'
                },
                {
                    prop: 'productLineName',
                    label: '生产产线'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单'
                },
                {
                    prop: 'materialName',
                    label: '生产物料'
                },
                {
                    prop: 'planOutput',
                    label: '订单数量'
                },
                {
                    prop: 'outputUnit',
                    label: '订单单位'
                },
                {
                    prop: 'productDate',
                    label: '生产日期'
                },
                {
                    prop: 'changer',
                    label: '提交人'
                },
                {
                    prop: 'changed',
                    label: '提交时间'
                }
            ]
        },
        {
            label: '已审核列表',
            tableData: [],
            column: this.Column // eslint-disable-line
        },
        {
            label: '退回列表',
            tableData: [],
            column: this.Column // eslint-disable-line
        }
    ];

    rules = [
        {
            prop: 'workshop',
            text: '请选择生产车间'
        }
    ]

    // 查询请求
    listInterface(params) {
        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        params.passStatus = this.$refs.queryTable.activeName; // eslint-disable-line
        return COMMON_API.ORDER_QUERY_API(params);
    }

    setData(datas, st) {
        if (st) {
            this.tabs.forEach((item, index) => {
                console.log(index)
            })
        } else {
            this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
        }
    }

}
</script>
