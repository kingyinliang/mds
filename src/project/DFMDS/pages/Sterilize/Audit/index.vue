<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steCkQuery"
            :factory-type="1"
            :query-form-data="queryFormData"
            :tabs="tabs"
            :rules="rules"
            :show-index-column="true"
            :list-interface="listInterface"
            :custom-data="true"
            :operation-column-width="90"
            @get-data-success="setData"
            @line-click="getLineClick"
        />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, AUDIT_API } from 'common/api/api';
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
            prop: 'workShop',
            defaultOptionsFn: () => {
                return COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptType: ['WORK_SHOP'],
                    deptName: '杀菌'
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
            type: 'select',
            label: '生产物料',
            filterable: true,
            prop: 'material',
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
            },
            defaultValue: ''
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
            prop: 'orderStatusName',
            label: '状态',
            minwidth: '50'
        },
        {
            prop: 'workShopName',
            label: '生产车间',
            minwidth: '75'
        },
        {
            prop: 'orderNo',
            label: '生产订单',
            minwidth: '95',
            onclick: true
        },
        {
            prop: 'materialName',
            label: '生产物料',
            minwidth: '210',
            formatter: (row) => {
                return row.materialName + ' ' + row.materialCode;
            }
        },
        {
            prop: 'planOutput',
            label: '订单数量',
            minwidth: '60'
        },
        {
            prop: 'outputUnit',
            label: '订单单位',
            minwidth: '60'
        },
        {
            prop: 'planPotCount',
            label: '计划锅数',
            minwidth: '90'
        },
        {
            prop: 'realPotCount',
            label: '生产锅数',
            minwidth: '90'
        },
        {
            prop: 'productDate',
            label: '生产日期',
            minwidth: '80'
        }
    ]

    tabs = [
        {
            label: '待审核列表',
            tableData: [],
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            column: [
                {
                    prop: 'orderStatusName',
                    label: '状态',
                    minwidth: '50'
                },
                {
                    prop: 'workShopName',
                    label: '生产车间',
                    minwidth: '75'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '95',
                    onclick: true
                },
                {
                    prop: 'materialName',
                    label: '生产物料',
                    minwidth: '210',
                    formatter: (row) => {
                        return row.materialName + ' ' + row.materialCode;
                    }
                },
                {
                    prop: 'planOutput',
                    label: '订单数量',
                    minwidth: '60'
                },
                {
                    prop: 'outputUnit',
                    label: '订单单位',
                    minwidth: '60'
                },
                {
                    prop: 'planPotCount',
                    label: '订单锅数',
                    minwidth: '60'
                },
                {
                    prop: 'realPotCount',
                    label: '生产锅数',
                    minwidth: '60'
                },
                {
                    prop: 'productDate',
                    label: '生产日期',
                    minwidth: '80'
                },
                {
                    prop: 'changer',
                    label: '提交人',
                    minwidth: '85'
                },
                {
                    prop: 'changed',
                    label: '提交时间',
                    minwidth: '95'
                }
            ]
        },
        {
            label: '已审核列表',
            tableData: [],
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            column: this.Column // eslint-disable-line
        },
        {
            label: '退回列表',
            tableData: [],
            pages: {
                currPage: 1,
                pageSize: 10,
                totalCount: 0
            },
            column: this.Column // eslint-disable-line
        }
    ];

    rules = [
        {
            prop: 'workShop',
            text: '请选择生产车间'
        }
    ]

    logList = [];
    visibleDetailLog = false;

    // 查询请求
    listInterface(params) {
        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        let orderStatus: string[] = [];
        if (this.$refs.queryTable.activeName === '0') {
            orderStatus = ['D'];
        } else if (this.$refs.queryTable.activeName === '1') {
            orderStatus = ['C', 'P'];
        } else {
            orderStatus = ['R'];
        }
        params.orderStatus = orderStatus; // eslint-disable-line
        params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
        params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
        params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
        return COMMON_API.ORDER_QUERY_API(params);
    }

    // paramsFunction(params, index) {
    //     COMMON_API.ORDER_QUERY_API(params).then(({ data }) => {
    //         this.tabs[index].tableData = data.data.records;
    //         this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
    //         this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
    //         this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
    //     });
    // }

    // 设置数据
    setData(datas, st) {
        if (st) {
            this.tabs.map((item, index) => {
                if (index !== Number(this.$refs.queryTable.activeName)) {
                    const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm))
                    params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                    if (index === 0) {
                        params['orderStatus'] = ['D'];
                    } else if (index === 1) {
                        params.orderStatus = ['C', 'P'];
                    } else {
                        params['orderStatus'] = ['R'];
                    }
                    params.current = 1;
                    params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                    params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                    COMMON_API.ORDER_QUERY_API(params).then(({ data }) => {
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

    sleep(millisecond) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()
            }, millisecond)
        })
    }

    // 审核日志
    getLogList(row: object) {
        AUDIT_API.AUDIT_LOG_LIST_API({ orderNo: row['orderNo'], verifyType: '' }).then(({ data }) => {
            this.logList = data.data;
            this.visibleDetailLog = true;
        })
    }

    getLineClick(row: object) {
        this.$store.commit('sterilize/updateAuditDetail', row);
        this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Audit-AuditDetail'))
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Sterilize-Audit-AuditDetail`
            });
        }, 100);
    }
}
</script>
