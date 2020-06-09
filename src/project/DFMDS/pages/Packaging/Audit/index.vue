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
            :operation-column-width="90"
            @get-data-success="setData"
            @tab-click="getTabData"
            @line-click="getLineClick"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="getLogList(scope.row)">
                    审核日志
                </el-button>
            </template>
        </query-table>RDM   MDS
        <el-dialog title="审核日志" width="800px" :close-on-click-modal="false" :visible.sync="visibleDetailLog">
            <div>
                <el-table header-row-class-name="" :data="logList" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" align="center" fixed />
                    <el-table-column label="审核动作" show-overflow-tooltip width="160" />
                    <el-table-column label="审核意见" prop="moveUnit" />
                    <el-table-column label="审核人" prop="moveAmount" show-overflow-tooltip width="160" />
                    <el-table-column label="审核时间" prop="changed" width="160" />
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" style=" color: #fff; background-color: #1890ff; border-color: #1890ff;" @click="visibleDetailLog = false">
                    确定
                </el-button>
            </div>
        </el-dialog>
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
            label: '状态',
            minwidth: '50'
        },
        {
            prop: 'workShopName',
            label: '生产车间',
            minwidth: '50'
        },
        {
            prop: 'productLineName',
            label: '生产产线',
            minwidth: '90'
        },
        {
            prop: 'orderNo',
            label: '生产订单',
            minwidth: '70',
            onclick: true
        },
        {
            prop: 'materialName',
            label: '生产物料',
            minwidth: '150'
        },
        {
            prop: 'planOutput',
            label: '订单数量',
            minwidth: '55'
        },
        {
            prop: 'outputUnit',
            label: '订单单位',
            minwidth: '50'
        },
        {
            prop: 'productDate',
            label: '生产日期',
            minwidth: '60'
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
                    prop: 'orderStatus',
                    label: '状态',
                    minwidth: '50'
                },
                {
                    prop: 'workShopName',
                    label: '生产车间',
                    minwidth: '50'
                },
                {
                    prop: 'productLineName',
                    label: '生产产线',
                    minwidth: '90'
                },
                {
                    prop: 'orderNo',
                    label: '生产订单',
                    minwidth: '70',
                    onclick: true
                },
                {
                    prop: 'materialName',
                    label: '生产物料'
                },
                {
                    prop: 'planOutput',
                    label: '订单数量',
                    minwidth: '55'
                },
                {
                    prop: 'outputUnit',
                    label: '订单单位',
                    minwidth: '50'
                },
                {
                    prop: 'productDate',
                    label: '生产日期',
                    minwidth: '60'
                },
                {
                    prop: 'changer',
                    label: '提交人',
                    minwidth: '85'
                },
                {
                    prop: 'changed',
                    label: '提交时间',
                    minwidth: '100'
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
            showOperationColumn: true,
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
            showOperationColumn: true,
            column: this.Column // eslint-disable-line
        }
    ];

    rules = [
        {
            prop: 'workshop',
            text: '请选择生产车间'
        }
    ]

    logList = [];
    visibleDetailLog = false;

    // 查询请求
    listInterface(params) {
        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        params.orderStatus = 'D'; // eslint-disable-line
        return COMMON_API.ORDER_QUERY_API(params);
    }

    setData(datas) {
        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
    }

    getTabData(tab) {
        let orderStatus = ''
        if (tab.name === '0') {
            orderStatus = 'D';
        } else if (tab.name === '1') {
            orderStatus = 'C';
        } else {
            orderStatus = 'R';
        }
        this.getList(orderStatus, tab.name);
    }

    getList(orderStatus, tabNumber) {
        if (!this.$refs.queryTable.queryForm.workshop) {
            this.$infoToast('请选择车间');
            return false
        }
        const params = {
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderStatus: orderStatus,
            current: 1,
            size: this.$refs.queryTable.tabs[tabNumber].pages.pageSize,
            total: this.$refs.queryTable.tabs[tabNumber].pages.totalCount
        };
        COMMON_API.ORDER_QUERY_API(params).then(({ data }) => {
            this.tabs[tabNumber].tableData = data.data.records;
            this.$refs.queryTable.tabs[tabNumber].pages.currPage = data.data.current;
            this.$refs.queryTable.tabs[tabNumber].pages.pageSize = data.data.size;
            this.$refs.queryTable.tabs[tabNumber].pages.totalCount = data.data.total;
        });
    }

    // 审核日志
    getLogList(row: object) {
        AUDIT_API.AUDIT_LOG_LIST_API({ orderNo: row['orderNo'] }).then(({ data }) => {
            this.logList = data.data;
            this.visibleDetailLog = true;
        })
    }

    getLineClick(row: object) {
        console.log(row)
        this.$store.commit('packaging/Audit', row);
        this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Packaging-Audit-AuditDetail'))
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Packaging-Audit-AuditDetail`
            });
        }, 100);

    }
}
</script>
