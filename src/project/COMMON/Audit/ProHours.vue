<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :tabs="tabs"
            :show-index-column="true"
            :show-select-column="true"
            :show-operation-column="true"
            :operation-column-width="70"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 120px; margin-right: 10px;" />
                        <el-button type="primary" size="small" @click="pass">
                            过账
                        </el-button>
                        <el-button type="primary" size="small" class="sub-red" @click="visibleRefuse = true">
                            退回
                        </el-button>
                        <el-button type="primary" size="small" class="sub-yellow" @click="visibleBack = true">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>报工列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 120px; margin-right: 10px;" />
                        <el-button type="primary" size="small" class="sub-yellow" @click="visibleBack = true">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="primary" round size="mini" @click="addOrupdate(scope.row)">
                    编辑
                </el-button>
            </template>
        </query-table>
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleRefuse = false">取消</el-button>
                <el-button type="primary" @click="refuse()">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="反审原因" :close-on-click-modal="false" :visible.sync="visibleBack">
            <el-input v-model="BackText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleWriteOffs = false">取消</el-button>
                <el-button type="primary" @click="writeOffs()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, AUDIT_API } from 'common/api/api';

    const Column = [
        {
            prop: 'status',
            label: '过账状态'
        },
        {
            prop: 'orderProductDate',
            label: '生产日期'
        },
        {
            prop: 'orderNo',
            label: '生产订单'
        },
        {
            prop: 'orderMaterialCode',
            label: '生产物料 '
        },
        {
            prop: 'orderAmount',
            label: '计划数量'
        },
        {
            prop: 'orderEntryUom',
            label: '单位'
        },
        {
            prop: 'entryQnt',
            label: '入库数量'
        },
        {
            prop: 'entryUom',
            label: '单位'
        },
        {
            prop: 'confActivity1',
            label: '准备工时'
        },
        {
            prop: 'confActiUnit1',
            label: '单位'
        },
        {
            prop: 'confActivity2',
            label: '机器工时'
        },
        {
            prop: 'confActiUnit2',
            label: '单位'
        },
        {
            prop: 'confActivity3',
            label: '人工工时'
        },
        {
            prop: 'confActiUnit3',
            label: '单位'
        },
        {
            prop: 'execStartDate',
            label: '开始日期'
        },
        {
            prop: 'execStartTime',
            label: '完成日期'
        },
        {
            prop: 'operation',
            label: '操作活动编号'
        },
        {
            prop: 'finConf',
            label: '部分/最后确认'
        },
        {
            prop: 'remark',
            label: '备注'
        },
        {
            prop: 'interfaceReturn',
            label: '接口回写'
        }
    ]

    @Component({
        components: {
        }
    })
    export default class ProInStore extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        ReText = ''
        BackText = ''
        postingDate = ''
        visibleRefuse = false
        visibleBack = false

        multipleSelection: object[] = [];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workshop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP']
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
                prop: 'orderId'
            },
            {
                type: 'input',
                label: '组件物料',
                prop: 'materialCode'
            },
            {
                type: 'select',
                label: '订单类型',
                prop: 'orderType',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
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
                label: '过账状态',
                prop: 'orderStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
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
                type: 'date-interval',
                label: '生产日期',
                prop: 'produceStart',
                propTwo: 'produceEnd'
            }
        ];

        tabs = [
            {
                label: '未过账',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: Column
            },
            {
                label: '已过账',
                tableData: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: Column
            }
        ];

        listInterface = params => {
            params.passStatus = this.$refs.queryTable.activeName * 1;// eslint-disable-line
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
            return AUDIT_API.HOURS_LIST_API(params);
        };

        selectableFn = val => {
            console.log(val);
        };

        setData(data) {
            this.tabs[this.$refs.queryTable.activeName].tableData = data.data.records;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = data.data.current;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = data.data.size;
            this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = data.data.total;
        }

        pass() {
            this.$confirm(`确定过账，是否继续？`, '过账确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                AUDIT_API.HOURS_PASS_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    list: this.$refs.queryTable.multipleSelection,
                    postingDate: this.postingDate
                }).then(({ data }) => {
                    this.$successToast(data.msg)
                    this.$refs.queryTable.getDataList()
                })
            })
        }

        refuse() {
            this.$confirm(`确定退回，是否继续？`, '退回确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                AUDIT_API.HOURS_REFUSE_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    list: this.$refs.queryTable.multipleSelection,
                    reason: this.ReText
                }).then(({ data }) => {
                    this.visibleRefuse = false
                    this.$successToast(data.msg)
                    this.$refs.queryTable.getDataList()
                })
            })
        }

        writeOffs() {
            this.$confirm(`确定反审，是否继续？`, '反审确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                AUDIT_API.HOURS_WRITEOFFS_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    list: this.$refs.queryTable.multipleSelection
                }).then(({ data }) => {
                    this.visibleRefuse = false
                    this.$successToast(data.msg)
                    this.$refs.queryTable.getDataList()
                })
            })
        }
    }
</script>

<style lang="scss" scoped>
    .tab__heads {
        margin-bottom: 10px;
        line-height: 32px;
    }
    .title-icon {
        float: left;
        width: 4px;
        height: 12px;
        margin-top: 10px;
        margin-right: 5px;
        background: #487bff;
        border-radius: 2px;
    }
</style>
