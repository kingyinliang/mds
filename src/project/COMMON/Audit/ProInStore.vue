<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :tabs="tabs"
            :selectable-fn="selectableFn"
            :show-index-column="true"
            :show-select-column="true"
            :show-operation-column="true"
            :operation-column-width="70"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>入库列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker size="small" style="width: 120px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small" @click="pass">
                            过账
                        </el-button>
                        <el-button type="primary" size="small" class="sub-red" @click="visibleRefuse = true">
                            退回
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <i class="title-icon" />
                    <span>入库列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="postingDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 120px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button type="primary" size="small" class="sub-yellow" @click="visibleBack = true">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button class="ra_btn" type="text" round size="mini" @click="addOrupdate(scope.row)">
                    {{ scope.row.redact ? '保存' : '编辑' }}
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
            prop: 'isSample',
            label: '是否样品'
        },
        {
            prop: 'batch',
            label: '物料批次'
        },
        {
            prop: 'pkgOrderProductDate',
            label: '订单生产日期'
        },
        {
            type: 'input',
            redact: true,
            prop: 'stgeLoc',
            label: '入库库位'
        },
        {
            type: 'input',
            redact: true,
            prop: 'moveType',
            label: '移动类型'
        },
        {
            type: 'input',
            redact: true,
            prop: 'stckType',
            label: '库存类型'
        },
        {
            type: 'input',
            redact: true,
            prop: 'noMoreGr',
            label: '交货已完成',
            width: '120'
        },
        {
            type: 'input',
            redact: true,
            prop: 'expirydate',
            label: '货架寿命到期日',
            width: '120'
        },
        {
            type: 'input',
            redact: true,
            prop: 'theDate',
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
                prop: 'workShop',
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
                prop: 'orderNo'
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
                prop: 'startDate',
                propTwo: 'endDate'
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
            params.gzStatus = this.$refs.queryTable.activeName;// eslint-disable-line
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return AUDIT_API.INLIST_API(params);
        }

        selectableFn = row => {
            if (row.status === '已退回') {
                return 0;
            }
            return 1;
        };

        setData(datas, st) {
            if (st) {
                this.tabs.forEach((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = this.$refs.queryTable.queryForm
                        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        params.passStatus = index;
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        AUDIT_API.HOURS_LIST_API(params).then(({ data }) => {
                            this.tabs[index].tableData = data.data.records;
                            this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this.setRedact(this.tabs[this.$refs.queryTable.activeName].tableData);
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
            }
        }

        setRedact(data) {
            data.forEach(item => {
                item.redact = false
            })
        }

        addOrupdate(row) {
            if (!row.redact) {
                row.redact = true;
            } else {
                row.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                AUDIT_API.INUPDATE_API(row).then(({ data }) => {
                    this.$successToast(data.msg);
                    row.redact = false
                })
            }
        }

        pass() {
            this.$confirm(`确定过账，是否继续？`, '过账确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                AUDIT_API.INPASS_API({
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
                AUDIT_API.INREFUSE_API({
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
                AUDIT_API.INWRITEOFFS_API({
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
