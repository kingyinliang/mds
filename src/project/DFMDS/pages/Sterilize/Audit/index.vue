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
            @line-click="getLineClick"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="text" round size="mini" style="margin-left: 0;" @click="getLogList(scope.row)">
                    审核日志
                </el-button>
            </template>
        </query-table>
        <el-dialog title="审核日志" width="800px" :close-on-click-modal="false" :visible.sync="visibleDetailLog">
            <div>
                <el-table header-row-class-name="" :data="logList" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" align="center" fixed />
                    <el-table-column label="审核动作" prop="status" show-overflow-tooltip width="160" />
                    <el-table-column label="审核意见" prop="memo" />
                    <el-table-column label="审核人" prop="verifyMan" show-overflow-tooltip width="140" />
                    <el-table-column label="审核时间" prop="verifyDate" width="180" />
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
            },
            linkageProp: ['productLine']
        },
        {
            type: 'select',
            label: '生产产线',
            prop: 'productLine',
            optionsFn: val => {
                return COMMON_API.ORG_QUERY_CHILDREN_API({
                    parentId: val || '',
                    deptType: 'PRODUCT_LINE'
                })
            },
            resVal: {
                resData: 'data',
                label: ['deptName'],
                value: 'id'
            },
            defaultValue: ''
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
            prop: 'orderStatusName',
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
                    prop: 'orderStatusName',
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
        this.$store.commit('Sterilize/updateAuditDetail', row);
        this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Audit-AuditDetail'))
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Sterilize-Audit-AuditDetail`
            });
        }, 100);

    }
}
</script>
