<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="ckMatQuery"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :tabs="tabs"
            :selectable-fn="selectableFn"
            :show-index-column="true"
            :show-select-column="true"
            :show-operation-column="true"
            :operation-column-width="140"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <div class="tab__heads clearfix">
                    <em class="title-icon" />
                    <span>发料列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="pstngDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headerText" placeholder="抬头文本" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button v-if="isAuth('ckMatPost')" type="primary" size="small" @click="getPass">
                            过账
                        </el-button>
                        <el-button v-if="isAuth('ckMatReturn')" type="primary" size="small" class="sub-red" @click="refuseDialogShow(true)">
                            退回
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="tab-head1">
                <div class="tab__heads clearfix">
                    <em class="title-icon" />
                    <span>发料列表</span>
                    <div style="float: right;">
                        <span>过账日期：</span><el-date-picker v-model="pstngDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" size="small" style="width: 140px; margin-right: 10px;" />
                        <span>抬头文本：</span><el-input v-model="headerText" placeholder="抬头文本" size="small" style="width: 190px; margin-right: 10px;" />
                        <el-button v-if="isAuth('ckMatRevert')" type="primary" size="small" class="sub-yellow" @click="refuseDialogShow(false)">
                            反审
                        </el-button>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="isAuth('ckMatEdit')" :disabled="scope.row.status === 'R'" class="ra_btn" type="text" round size="mini" @click="redact(scope.row)">
                    {{ scope.row.redact ? '保存' : '编辑' }}
                </el-button>
                <el-button v-if="isAuth('ckMatRecord')" class="ra_btn" type="text" round size="mini" @click="getAuditLog(scope.row)">
                    审核日志
                </el-button>
            </template>
        </query-table>
        <el-dialog :close-on-click-modal="false" :visible.sync="isRefuseOrWriteOffsDialogShow">
            <el-input v-model="refuseOrWriteOffsText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 150px;" />
            <span slot="title"> {{ dialogTitle }} </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isRefuseOrWriteOffsDialogShow = false">
                    取消
                </el-button>
                <el-button type="primary" @click="getRefuseOrWriteOffs()">
                    确定
                </el-button>
            </span>
        </el-dialog>
        <el-dialog title="审核日志" width="900px" :close-on-click-modal="false" :visible.sync="isAuditLogDialogShow">
            <audit-log :table-data="auditLogData" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :pack-up="false" :status="true" />
            <div slot="footer" class="dialog-footer" />
        </el-dialog>
    </div>
</template>


<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, AUDIT_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        }
    })

    export default class ProInStore extends Vue {


        //表格数据
        get name() {
            return this.$refs.queryTable.activeName;
        }

        // Column = [
        //     {
        //         prop: 'status',
        //         label: '过账状态'
        //     },
        //     {
        //         prop: 'orderProductDate',
        //         label: '生产日期',
        //         width: '120'
        //     },
        //     {
        //         prop: 'orderNo',
        //         label: '生产订单',
        //         width: '120'
        //     },
        //     {
        //         prop: 'materialName',
        //         label: '生产物料 ',
        //         width: '120',
        //         formatter: (row) => {
        //             return row.productMaterialCode + ' ' + row.productMaterialName;
        //         }
        //     },
        //     {
        //         prop: 'planOutput',
        //         label: '计划数量'
        //     },
        //     {
        //         prop: 'outputUnit',
        //         label: '单位'
        //     },
        //     {
        //         prop: 'countOutput',
        //         label: '入库数量'
        //     },
        //     {
        //         prop: 'countOutputUnit',
        //         label: '单位'
        //     },
        //     {
        //         prop: 'materialName',
        //         label: '组件物料',
        //         width: '120',
        //         formatter: (row) => {
        //             return row.materialCode + ' ' + row.materialName;
        //         }
        //     },
        //     {
        //         prop: 'entryQnt',
        //         label: '发料数量'
        //     },
        //     {
        //         prop: 'entryUom',
        //         label: '单位'
        //     },
        //     {
        //         prop: 'batch',
        //         label: '物料批次',
        //         type: 'input',
        //         width: '140',
        //         redact: true
        //     },
        //     {
        //         prop: 'stgeLoc',
        //         label: '出库库位',
        //         type: 'input',
        //         width: '140',
        //         redact: true,
        //         header: true
        //     },
        //     {
        //         prop: 'moveType',
        //         label: '移动类型',
        //         type: 'input',
        //         width: '140',
        //         redact: true,
        //         header: true
        //     },
        //     {
        //         prop: 'moveReason',
        //         label: '过账移动原因',
        //         resVal: {
        //             label: 'dictValue',
        //             value: 'dictCode'
        //         },
        //         type: 'select',
        //         width: '140',
        //         redact: true,
        //         header: true
        //     },
        //     {
        //         prop: 'writeoffsMoveReason',
        //         label: '反审移动原因',
        //         resVal: {
        //             label: 'dictValue',
        //             value: 'dictCode'
        //         },
        //         type: 'select',
        //         width: '140',
        //         redact: true,
        //         header: true
        //     },
        //     {
        //         prop: 'remark',
        //         label: '备注',
        //         type: 'input',
        //         width: '140',
        //         redact: true
        //     },
        //     {
        //         prop: 'interfaceReturn',
        //         label: '接口回写'
        //     }
        // ];

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 过账日期
        pstngDate = dateFormat(new Date(), 'yyyy-MM-dd');
        headerText = '' //抬头文本
        dialogTitle = '' //退回或反审弹窗title
        refuseOrWriteOffsText = ''//退回或反审原因
        isRefuseOrWriteOffsDialogShow = false //退回或反审弹窗
        auditLogData = [] // 审核日志
        isAuditLogDialogShow = false //审核日志弹窗
        moveReas = [] //移动原因
        moveReason = []
        haveMoveReason = []
        // 查询表头
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
                        parentId: val || '',
                        deptType: 'PRODUCT_LINE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo',
                placeholder: '订单号'
            },
            {
                type: 'select',
                label: '组件物料',
                prop: 'materialCode',
                defaultOptionsFn: () => {
                    return AUDIT_API.PROISSUEDROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        dictType: 'ORDER_TYPE'
                    })
                },
                filterable: true,
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['materialCode', 'materialName'],
                    value: 'materialCode'
                }
            },
            {
                type: 'select',
                label: '订单类型',
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
                label: '过账状态',
                prop: 'postingStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    }).then((data) => {
                        data.data.data = data.data.data.filter(it => it.dictValue === '已审核' || it.dictValue === '已退回' || it.dictValue === '接口失败' || it.dictValue === '反审');
                        return data
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
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'oneorderProductDate',
                propTwo: 'twoorderProductDate'
            }
        ];

        // tab页签
        tabs = [
            {
                label: '未过账',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.getColumn(1) // eslint-disable-line
            },
            {
                label: '已过账',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                showOperationColumn: true,
                column: this.getColumn(2) // eslint-disable-line
            }
        ];

                mounted() {
        // 消息管理跳转 url 传参判断
        if (window.location.href.indexOf('?') !== -1) {
            console.log('url~~~~~~')
            const url = window.location.href.split('?')[1].split('&');
            const urlData = {};
            for (let i = 0; i < url.length; i++) {
                urlData[url[i].split('=')[0]] = unescape(url[i].split('=')[1]);
            }

            // 切换页签
            if (urlData['orderStatus'] === 'P') {
                this.$refs.queryTable.activeName = '1'
            } else {
                this.$refs.queryTable.activeName = '0'
            }

            const paramsTemp = {
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: urlData['orderNo'],
                // orderStatus: [urlData['orderStatus']],
                passStatus: Number(this.$refs.queryTable.activeName),
                current: 1,
                size: 10,
                total: 0
            }
            AUDIT_API.PROISSUEQUERY_API(paramsTemp).then(({ data }) => {
                console.log('data')
                console.log(data)
                // 显示内容
                this.setData(data, true)
                // 修正表单上呈现
                setTimeout(() => {
                    this.queryFormData.forEach(item => {
                        this.$refs.queryTable.queryForm[item.prop] = ''
                    })
                    this.$refs.queryTable.queryForm.workShop = urlData['workShop']
                    this.$refs.queryTable.queryForm.orderNo = urlData['orderNo']
                }, 1000);


            });
        }

            this.getHaveBeenMoveReas();
            this.getMoveReas();
        }

        getColumn(type) {
            const column = [
                    {
                        prop: 'statusName',
                        label: '过账状态'
                    },
                    {
                        prop: 'orderProductDate',
                        label: '生产日期',
                        width: '120'
                    },
                    {
                        prop: 'orderNo',
                        label: '生产订单',
                        width: '120'
                    },
                    {
                        prop: 'materialName',
                        label: '生产物料 ',
                        width: '120',
                        formatter: (row) => {
                            return row.productMaterialCode + ' ' + row.productMaterialName;
                        }
                    },
                    {
                        prop: 'planOutput',
                        label: '计划数量'
                    },
                    {
                        prop: 'outputUnit',
                        label: '单位'
                    },
                    {
                        prop: 'countOutput',
                        label: '入库数量'
                    },
                    {
                        prop: 'countOutputUnit',
                        label: '单位'
                    },
                    {
                        prop: 'materialName',
                        label: '组件物料',
                        width: '120',
                        formatter: (row) => {
                            return row.materialCode + ' ' + row.materialName;
                        }
                    },
                    {
                        prop: 'entryQnt',
                        label: '发料数量'
                    },
                    {
                        prop: 'entryUom',
                        label: '单位'
                    },
                    {
                        prop: 'batch',
                        label: '物料批次',
                        type: 'input',
                        width: '140',
                        redact: true
                    },
                    {
                        prop: 'stgeLoc',
                        label: '出库库位',
                        type: 'input',
                        width: '140',
                        redact: true,
                        header: true
                    },
                    {
                        prop: 'moveType',
                        label: '移动类型',
                        type: 'input',
                        width: '140',
                        redact: true,
                        header: true
                    },
                    {
                        prop: 'moveReason',
                        label: '过账移动原因',
                        resVal: {
                            label: 'dictValue',
                            value: 'dictCode'
                        },
                        type: 'select',
                        width: '140',
                        redact: true,
                        header: true
                    },
                    {
                        prop: 'writeoffsMoveReason',
                        label: '反审移动原因',
                        resVal: {
                            label: 'dictValue',
                            value: 'dictCode'
                        },
                        type: 'select',
                        width: '140',
                        redact: true,
                        header: true,
                        hide: true
                    },
                    {
                        prop: 'remark',
                        label: '备注',
                        type: 'input',
                        width: '140',
                        redact: true
                    },
                    {
                        prop: 'interfaceReturn',
                        label: '接口回写'
                    }
                ];
                if (type === 2) {
                    column[14]['hide'] = true;
                    column[15]['hide'] = false;
                    column[11]['type'] = '';
                    column[12]['type'] = '';
                    column[13]['type'] = '';
                }
            return column;
        }

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.passStatus = this.$refs.queryTable.activeName * 1;// eslint-disable-line
            return AUDIT_API.PROISSUEQUERY_API(params);
        };

        // 设置数据
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
                        AUDIT_API.PROISSUEQUERY_API(params).then(({ data }) => {
                            this.setRedact(data.data.records);
                            const datasNew = this.changeMoveReason(data.data.records, index);
                            this.tabs[index].tableData = datasNew;
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        this.setRedact(datas.data.records);
                        const datasNew = this.changeMoveReason(datas.data.records, this.$refs.queryTable.activeName);
                        this.tabs[this.$refs.queryTable.activeName].tableData = datasNew;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                this.setRedact(datas.data.records);
                const datasNew = this.changeMoveReason(datas.data.records, this.$refs.queryTable.activeName);
                this.tabs[this.$refs.queryTable.activeName].tableData = datasNew;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
            }
        }

        changeMoveReason(datas, activeName) {
            datas.map(item => {
                if (activeName === '0') {
                    if (!item.moveReason) {
                        item.moveReason = '0001';
                    }
                } else if (!item.writeoffsMoveReason) {
                        item.writeoffsMoveReason = '0002';
                    }
            })
            return datas;
        }

        // 设置编辑
        setRedact(data) {
            data.forEach(item => {
                item.redact = false
            })
        }

        //过账
        getPass() {
            if (!this.pstngDate) {
                this.$warningToast('请选择过账日期')
                return false
            }
            if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
                const list = this.$refs.queryTable.tabs[0].multipleSelection
                for (const item of list) {
                    item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                    item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                    item.pstngDate = this.pstngDate
                    item.headerText = this.headerText
                    if (!item.stgeLoc || !item.moveType || !item.moveReason) {
                        this.$warningToast('请填写必填项');
                        return false;
                    }
                    // if (item.batch !== '' && item.batch !== null) {
                    //     if (item.batch.length !== 10) {
                    //         this.$warningToast('物料批次长度为10位')
                    //         return false;
                    //     }
                    // }
                }
                this.$confirm('确认过账，是否继续', '过账确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    AUDIT_API.PROISSUEPASS_API(list).then(({ data }) => {
                        this.$successToast(data.msg)
                        this.$refs.queryTable.getDataList(true)
                    }).catch((err) => {
                        if (err.data.code === 201) {
                            // this.$errorToast(err.data.msg);
                            this.$refs.queryTable.getDataList(true)
                        }
                    });
                })
            } else {
                this.$warningToast('请勾选数据')
            }
        }

        //显示退回或反审弹窗
        refuseDialogShow(bol) {
            if (bol) {
                //退回
                if (this.$refs.queryTable.tabs[0].multipleSelection && this.$refs.queryTable.tabs[0].multipleSelection.length) {
                    if (this.dialogTitle === '反审原因') {
                        this.refuseOrWriteOffsText = '';
                    }
                    this.refuseOrWriteOffsText = '';
                    this.dialogTitle = '退回原因';
                    this.isRefuseOrWriteOffsDialogShow = true;
                } else {
                    this.$warningToast('请勾选数据')
                }
            } else {
                //反审
                if (!this.pstngDate) {
                    this.$warningToast('请选择过账日期')
                    return false
                }
                if (this.$refs.queryTable.tabs[1].multipleSelection && this.$refs.queryTable.tabs[1].multipleSelection.length) {
                    if (this.dialogTitle === '退回原因') {
                        this.refuseOrWriteOffsText = ''
                    }
                    this.refuseOrWriteOffsText = '';
                    this.dialogTitle = '反审原因'
                    this.isRefuseOrWriteOffsDialogShow = true
                } else {
                    this.$warningToast('请勾选数据')
                }
            }
        }

         //退回或反审确认
        getRefuseOrWriteOffs() {
            if (this.dialogTitle === '退回原因') {
                if (this.refuseOrWriteOffsText.length <= 0) {
                    this.$warningToast('请填写退回原因')
                    return false;
                }
                this.$confirm('确认退回，是否继续', '退回确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[0].multipleSelection
                    list.forEach(item => {
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        item.memo = this.refuseOrWriteOffsText
                        item.verifyType = ''
                    });
                    AUDIT_API.PROISSUEREFUSE_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        refuseList: list
                    }).then(({ data }) => {
                        this.isRefuseOrWriteOffsDialogShow = false;
                        this.$successToast(data.msg);
                        this.$refs.queryTable.getDataList(true);
                    }).catch((err) => {
                        if (err.data.code === 201) {
                            this.isRefuseOrWriteOffsDialogShow = false;
                            // this.$errorToast(err.data.msg);
                            this.$refs.queryTable.getDataList(true);
                        }
                    });
                })
            } else {
                if (this.refuseOrWriteOffsText.length <= 0) {
                    this.$warningToast('请填写反审原因')
                    return false;
                }
                this.$confirm('数据已经调用SAP接口已发料，反审后将冲销SAP数据，是否反审?', '反审确认', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const list = this.$refs.queryTable.tabs[1].multipleSelection
                    for (const item of list) {
                        if (!item.stgeLoc || !item.moveType || !item.writeoffsMoveReason) {
                            this.$warningToast('请填写必填项');
                            return false;
                        }
                        item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id
                        item.factoryCode = JSON.parse(sessionStorage.getItem('factory') || '{}').deptCode
                        item.reason = this.refuseOrWriteOffsText
                        item.headerText = this.headerText
                        item.pstngDate = this.pstngDate
                        // if (item.batch !== '' && item.batch !== null) {
                        //     if (item.batch.length !== 10) {
                        //         this.$warningToast('物料批次长度为10位')
                        //         return false;
                        //     }
                        // }
                    }
                    AUDIT_API.PROISSUEWRITEOFFS_API(list).then(({ data }) => {
                        this.isRefuseOrWriteOffsDialogShow = false
                        this.$successToast(data.msg);
                        this.$refs.queryTable.getDataList(true)
                    }).catch((err) => {
                        if (err.data.code === 201) {
                            this.isRefuseOrWriteOffsDialogShow = false;
                            // this.$errorToast(err.data.msg);
                            this.$refs.queryTable.getDataList(true);
                        }
                    });
                })
            }
        }

        //未过账页签下编辑事件
        redact(row) {
            if (!row.redact) {
                row.redact = true;
                // this.$refs.table1.bodyWrapper.scrollLeft = document.querySelector('.el-table__body').offsetWidth - document.querySelector('.el-table__body-wrapper').clientWidth;
                // this.$refs.table.bodyWrapper.scrollLeft = 10000;
            } else {
                if (!row.stgeLoc || !row.moveType) {
                    this.$warningToast('请填写必填项')
                    return false;
                }
                // if (row.batch.length !== 10) {
                //     this.$warningToast('物料批次长度为10位')
                //     return false;
                // }
                if (row.stgeLoc.length > 4) {
                    this.$warningToast('出库库位最大长度为4位')
                    return false;
                }
                if (row.moveType.length > 3) {
                    this.$warningToast('移动类型最大长度为3位')
                    return false;
                }
                AUDIT_API.PROISSUEUPDATE_API({
                    id: row.id,
                    batch: row.batch,
                    stgeLoc: row.stgeLoc,
                    moveType: row.moveType,
                    moveReason: row.moveReason,
                    writeoffsMoveReason: row.writeoffsMoveReason,
                    remark: row.remark
                }).then(({ data }) => {
                    this.$successToast(data.msg)
                    row.redact = false;
                });
            }
        }

         // 审核日志
        getAuditLog(row) {
            // console.log(this.$refs.queryTable.activeName)
            AUDIT_API.AUDIT_DIALOG_LOG_LIST_API({
                verifyId: row.id,
                verifyType: 'MATERIAL'
            }).then(({ data }) => {
                this.auditLogData = data.data
                this.isAuditLogDialogShow = true
            })
        }

         //获取移动类型 - 未过账
        getMoveReas() {
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_MOVE_REASON'
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.moveReason = data.data;
                this.moveReason = data.data;
            });
        }

         //获取移动类型 - 已过账
        getHaveBeenMoveReas() {
            COMMON_API.DICTQUERY_API({
                dictType: 'RETURN_MOVE_REASON'
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.writeoffsMoveReason = data.data;
                this.haveMoveReason = data.data;
            });
        }

        // 表格复选框
        selectableFn = row => {
            if (row.status === '已退回') {
                return 0;
            }
            return 1;
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
