<template>
    <div class="header_main">
        <query-entry
            ref="queryEntry"
            :query-form-data="queryFormData"
            :query-auth="'fer:shoot:list'"
            :list-interface="listInterface"
            :edit-auth="'fer:shoot:update'"
            :tabs="tabs"
            :fake-page="true"
            :get-list-field="'ferList'"
            @get-data-success="getDataList"
            @saved-data="savedData"
            @submit-data="submitData"
            @click-line="clickLine"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="scope.row.approveStatus !== 'submit' && scope.row.approveStatus !== 'checked'" type="text" size="mini" :disabled="!($refs.queryEntry.isRedact)" @click="AddData(scope.row, scope.$index)">
                    <i class="icons iconfont factory-chaifen" />拆分
                </el-button>
                <el-button v-if="scope.row.approveStatus !== 'submit' && scope.row.approveStatus !== 'checked'" type="text" :style="{marginLeft: '0', color: !($refs.queryEntry.isRedact) ? '#CCC' : 'red'}" icon="el-icon-delete" size="mini" :disabled="!($refs.queryEntry.isRedact)" @click="delData(scope.row)">
                    删除
                </el-button>
            </template>
        </query-entry>
        <audit-log :table-data="Audit" style="margin-top: 5px;" />
    </div>
</template>

<script>
import { BASICDATA_API, SYSTEMSETUP_API, FERMENTATION_API } from '@/api/api';
export default {
    name: 'Index',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    data() {
        return {
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    defaultValue: '',
                    linkageProp: ['workShop', 'orderType']
                },
                {
                    type: 'select',
                    label: '生产车间',
                    prop: 'workShop',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: val, deptName: '发酵' }, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    defaultValue: '',
                    linkageProp: ['ferMaterialCode', 'ferOrderNos', 'holderIds']
                },
                {
                    type: 'select',
                    label: '发料物料',
                    prop: 'ferMaterialCode',
                    optionsFn: val => {
                        return this.$http(`${FERMENTATION_API.SHOOT_MATERIAL_LIST}`, 'POST', { workShop: val }, false, false, false);
                    },
                    resVal: {
                        resData: 'list',
                        label: ['matnr', 'material_name'],
                        value: 'matnr'
                    },
                    filterable: true
                },
                {
                    type: 'select',
                    label: '状态',
                    prop: 'approveStatus',
                    options: [
                        {
                            value: '1',
                            name: '未录入'
                        },
                        {
                            value: 'saved',
                            name: '已保存'
                        }, {
                            value: 'submit',
                            name: '已提交'
                        }, {
                            value: 'checked',
                            name: '审核通过'
                        }, {
                            value: 'noPass',
                            name: '审核不通过'
                        }
                    ],
                    resVal: {
                        value: 'value',
                        label: ['name']
                    }
                },
                {
                    type: 'select',
                    label: '订单类型',
                    prop: 'orderType',
                    optionsFn: (val) => {
                        return this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', { factory: val, types: ['order_type'] }, false, false, false);
                    },
                    resVal: {
                        resDataArray: ['dicList', 0, 'prolist'],
                        label: ['value'],
                        value: 'code'
                    }
                },
                {
                    type: 'select',
                    label: '订单编号',
                    prop: 'ferOrderNos',
                    optionsFn: (val, secondVal, formValue) => {
                        return this.$http(`${FERMENTATION_API.SHOOT_GETORDER_API}`, 'POST', { factory: formValue, workShop: val }, false, false, false);
                    },
                    resVal: {
                        resData: 'verList',
                        label: ['ferOrderNo'],
                        value: 'ferOrderNo'
                    },
                    filterable: true,
                    multiple: true,
                    formValue: 'factory'
                },
                {
                    type: 'select',
                    label: '罐号',
                    prop: 'holderIds',
                    optionsFn: (val, secondVal, formValue) => {
                        return this.$http(`${BASICDATA_API.BASEHOLDERLIST_API}`, 'POST', { factory: formValue, workShop: val }, false, false, false);
                    },
                    resVal: {
                        resData: 'holderList',
                        label: ['holderName'],
                        value: 'holderId'
                    },
                    filterable: true,
                    multiple: true,
                    formValue: 'factory'
                },
                {
                    type: 'date-interval',
                    label: '订单日期',
                    prop: 'productDateOne',
                    propTwo: 'productDateTwo'
                }
            ],
            listInterface: params => {
                return this.$http(`${FERMENTATION_API.SHOOT_LIST_API}`, 'POST', params);
            },
            tabs: [
                {
                    title: '发料列表',
                    showSelectColumn: true,
                    showIndexColumn: true,
                    showOperationColumn: '112',
                    column: [
                        {
                            prop: 'ferOrderNo',
                            label: '订单号',
                            minwidth: '120'
                        },
                        {
                            prop: 'approveStatusString',
                            label: '状态',
                            minwidth: '93',
                            colorprop: true
                        },
                        {
                            prop: 'holderName',
                            label: '容器',
                            minwidth: '110'
                        },
                        {
                            prop: ['ferMaterialCode', 'ferMaterialName'],
                            label: '物料',
                            minwidth: '180'
                        },
                        {
                            prop: 'ferAmount',
                            label: '订单量',
                            minwidth: '80'
                        },
                        {
                            prop: 'ferUnit',
                            label: '单位',
                            minwidth: '50'
                        },
                        {
                            prop: ['kjmMaterialCode', 'kjmMaterialName'],
                            label: '领用物料',
                            minwidth: '180'
                        },
                        {
                            prop: 'kjmAmount',
                            label: '数量',
                            minwidth: '100',
                            type: 'input',
                            require: true
                        },
                        {
                            prop: 'kjmUnit',
                            label: '单位',
                            minwidth: '50'
                        },
                        {
                            prop: 'batch',
                            label: '批次',
                            minwidth: '120',
                            type: 'input',
                            require: true
                        },
                        {
                            prop: 'remark',
                            label: '备注',
                            minwidth: '80',
                            type: 'input'
                        },
                        {
                            prop: 'changer',
                            label: '提交人员',
                            minwidth: '135'
                        },
                        {
                            prop: 'changed',
                            label: '提交时间',
                            minwidth: '150'
                        }
                    ]
                }
            ],
            Audit: []
        };
    },
    methods: {
        getDataList(dataList) {
            this.Audit = [];
            dataList.map(item => {
                item.color = item.approveStatus === 'noPass' ? 'red' : item.approveStatus === 'checked' ? '#7ED321' : '';
                item.approveStatusString = item.approveStatus === 'saved' ? '已保存' : item.approveStatus === 'submit' ? ' 已提交' : item.approveStatus === 'noPass' ? '审核不通过' : item.approveStatus === 'checked' ? '已审核' : '未录入';
                if (item.approveStatus === 'checked' || item.approveStatus === 'submit') {
                    item.lineStatus = 0;
                } else {
                    item.lineStatus = 1;
                }
            })
            this.$refs.queryEntry.dataList = dataList;
        },
        // 拆分
        AddData(row, index) {
            const newobj = JSON.parse(JSON.stringify(row));
            newobj.approveStatus = '';
            newobj.id = '';
            newobj.kjmAmount = '';
            newobj.batch = '';
            newobj.remark = '';
            this.$refs.queryEntry.dataList.splice(index + 1, 0, newobj);
        },
        // 删除
        delData(row) {
            this.$confirm('确认删除吗?', '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (row.approveStatus === '') {
                    this.$refs.queryEntry.dataList.splice(this.$refs.queryEntry.dataList.indexOf(row), 1);
                    this.Audit = [];
                } else {
                    this.$http(`${FERMENTATION_API.SHOOT_DEL_API}`, 'POST', {
                        id: row.id
                    }).then(({ data }) => {
                        if (data.code === 0) {
                            this.$successToast('删除成功');
                            this.$refs.queryEntry.getDataList();
                        } else {
                            this.$errorToast(data.msg);
                        }
                    });
                }
            })
        },
        savedData() {
            const refsQuery = this.$refs.queryEntry
            if (refsQuery.multipleSelection.length) {
                refsQuery.multipleSelection.forEach(item => {
                    if (item.approveStatus) {
                        if (item.approveStatus === 'saved') {
                            item.approveStatus = 'saved';
                        }
                    } else {
                        item.approveStatus = 'saved';
                    }
                });
            } else {
                this.$warningToast('请先勾选数据');
                return;
            }
            this.$http(`${FERMENTATION_API.SHOOT_UPDATE_API}`, 'POST', refsQuery.multipleSelection).then(({ data }) => {
                if (data.code === 0) {
                    this.$successToast('保存成功');
                    refsQuery.getDataList();
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        submitData() {
            this.$confirm('确认提交吗?', '操作', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const refsQuery = this.$refs.queryEntry
                for (const item of refsQuery.multipleSelection) {
                    if (!item.kjmAmount || !item.batch) {
                        this.$warningToast('请先填写必填项');
                        return false
                    }
                }
                if (refsQuery.multipleSelection.length) {
                    refsQuery.multipleSelection.forEach(item => {
                        if (item.approveStatus) {
                            if (item.approveStatus === 'saved') {
                                item.approveStatus = 'submit';
                            } else if (item.approveStatus === 'noPass') {
                                item.approveStatus = 'submit';
                            }
                        } else {
                            item.approveStatus = 'submit';
                        }
                    });
                } else {
                    this.$warningToast('请先勾选数据');
                    return;
                }
                this.$http(`${FERMENTATION_API.SHOOT_UPDATE_API}`, 'POST', refsQuery.multipleSelection).then(({ data }) => {
                    if (data.code === 0) {
                        // eslint-disable-next-line
                        this.$http(`${FERMENTATION_API.SHOOT_SUBMIT_API}`, 'POST', refsQuery.multipleSelection).then(({ data }) => {
                            if (data.code === 0) {
                                this.$successToast('提交成功');
                                refsQuery.getDataList();
                            } else {
                                this.$errorToast(data.msg);
                            }
                        });
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            })
        },
        clickLine(row) {
            this.$http(`${FERMENTATION_API.SHOOT_LOG_API}`, 'POST', {
                ferOrderNo: row.ferOrderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Audit = data.verList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        }
    }
};
</script>

<style scoped></style>
