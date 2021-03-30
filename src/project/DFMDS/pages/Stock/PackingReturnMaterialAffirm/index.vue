<!-- 包材退料确认 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steCkQuery"
            :factory-type="1"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :tabs="tabs"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            :operation-column-width="100"
            :show-select-column="['0', '1'].includes(currentTab)"
            :show-index-column="true"
            @tab-click="tabClick"
            @get-data-success="returnDataFromQueryTableForm"
            @created-end="createdEnd"
        >
            <template v-slot:tab-head0>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '待过账列表' }} </h3>
                    <div class="btn-box">
                        <el-form :model="postForm" :rules="rules" inline label-suffix="：" label-width="100px" size="small">
                            <el-form-item label="过账日期" prop="date">
                                <el-date-picker v-model="postForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
                            </el-form-item>
                            <el-form-item label="抬头文本" prop="text">
                                <el-input v-model="postForm.text" placeholder="请输入" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="requestOrderHandler">
                                    过账
                                </el-button>
                                <el-button type="danger" @click="requestOrderHandler">
                                    退回
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </template>
            <template v-slot:tab-head1>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '已过账列表' }} </h3>
                    <div class="btn-box">
                        <el-form :model="postForm" :rules="rules" inline label-suffix="：" label-width="100px" size="small">
                            <el-form-item label="过账日期" prop="date">
                                <el-date-picker v-model="postForm.date" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" />
                            </el-form-item>
                            <el-form-item label="抬头文本" prop="text">
                                <el-input v-model="postForm.text" placeholder="请输入" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="danger" @click="requestOrderHandler">
                                    反审
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="!scope.row.redact" type="text" size="small" @click="editHandler(scope.row)">
                    编辑
                </el-button>
                <el-button v-else type="text" size="small" @click="saveHandler(scope.row)">
                    保存
                </el-button>
                <el-button type="text" size="small">
                    日志
                </el-button>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    // import { dateFormat } from 'src/utils/utils';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'PackingReturnMaterialAffirm',
        components: {}
    })
    export default class PackingReturnMaterialAffirm extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        postForm = {};

        currentTab = '0';

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                labelWidth: '120',
                prop: 'workShop',
                defaultValue: '',
                rule: [{ required: true, message: '请选择生产车间', trigger: 'blur' }],
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
                labelWidth: '100',
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
                type: 'select',
                label: '包材物料',
                prop: 'material',
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
                type: 'select',
                label: '状态',
                prop: 'status',
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
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        Column = [
            {
                prop: 'fermentorName',
                label: '状态',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '生产工厂',
                minwidth: '100'
            },
            {
                prop: 'productMaterialName',
                label: '包材物料',
                minwidth: '160',
                formatter(row) {
                    return `${row.productMaterialName} ${row.productMaterialCode}`
                }
            },
            {
                prop: 'fermentorName',
                label: '批次',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '供应商',
                minwidth: '100'
            },
            {
                prop: 'amount',
                label: '数量',
                minwidth: '85'
            },
            {
                prop: 'unit',
                label: '单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'fermentorName',
                label: '订单',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '线别',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '出库库位',
                minwidth: '100'
            },
            {
                prop: 'orderType',
                label: '移动类型',
                minwidth: '160',
                type: 'select',
                redact: true,
                header: true,
                resVal: {
                    resData: 'data',
                    label: 'dictValue',
                    value: 'dictCode'
                }
            },
            {
                prop: 'fermentorName',
                label: '过账移动原因',
                minwidth: '120'
            },
            {
                prop: 'fermentorName',
                label: '收货库位',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '收货批次',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '异动原因',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '接口回写',
                minwidth: '100'
            }
        ]

        tabs = [
            {
                label: '待过账',
                tableData: [{ redact: false }],
                multipleSelection: [],
                showOperationColumn: true,
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column // eslint-disable-line
                ]
            },
            {
                label: '已过账',
                tableData: [{ redact: false }],
                multipleSelection: [],
                showOperationColumn: true,
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column // eslint-disable-line
                ]
            },
            {
                label: '已退回',
                tableData: [{}],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    ...this.Column // eslint-disable-line
                ]
            }
        ]

        rules = {
            date: [
                { required: true, message: '请选择日期', triggle: 'blur' }
            ]
        }

        editHandler(row) {
            row.redact = true
        }

        saveHandler(row) {
            row.redact = false
        }

        createdEnd() {
            this.getDict();
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        tabClick(name) {
            this.currentTab = name;
        }

        getDict() {
            COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                dictType: 'ORDER_TYPE' // 字典类型
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.orderType = data.data;
                // this.orderType = data.data;
            })
            COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
                factory: 'common',
                dictType: 'COMMON_PBREV' // 字典类型 版本
            }).then(({ data }) => {
                this.$refs.queryTable.optionLists.ver = data.data;
            })
        }

        // queryTable 查询请求
        queryTableListInterface(params) {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            if (Number(this.$refs.queryTable.activeName) === 0) {
                params.applyFlag = 'N'; // 申请标识(Y,N)
            } else {
                params.applyFlag = 'Y'; // 申请标识(Y,N)
            }
            // console.log(params, '=-==========+++++++++++++');
            params.current = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage;// eslint-disable-line
            params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            return FER_API.FER_ORDER_LIST_API(params);
        }

        // queryTable 回传 result
        returnDataFromQueryTableForm(datas, st) {
            const edit = 0;
            if (st) {
                this.tabs.map((item, index) => {
                    if (index !== Number(this.$refs.queryTable.activeName)) {
                        const params = JSON.parse(JSON.stringify(this.$refs.queryTable.queryForm))
                        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                        if (index === 0) {
                            params.applyFlag = 'N'; // 申请标识(Y,N)
                        } else {
                            params.applyFlag = 'Y'; // 申请标识(Y,N)
                        }
                        params.current = 1;
                        params.size = this.$refs.queryTable.tabs[index].pages.pageSize;
                        params.total = this.$refs.queryTable.tabs[index].pages.totalCount;
                        FER_API.FER_ORDER_LIST_API(params).then(({ data }) => {
                            if (index === edit) {
                                data.data.records.map(row => {
                                    row.orderType = this.$refs.queryTable.optionLists.orderType[0].dictCode;
                                    // 鲜香泡豆默认01，其余物料默认为空不可编辑
                                    row.redact = true;
                                    if (row.productMaterialCode !== 'SP01130005') {
                                        row.ver = '';
                                        row.notEditableProp = ['ver'];
                                    } else {
                                        row.ver = this.$refs.queryTable.optionLists.ver[0].dictCode;
                                    }
                                })
                            }
                            this.tabs[index].tableData = data.data.records;
                            this.$refs.queryTable.tabs[index].pages.currPage = data.data.current;
                            this.$refs.queryTable.tabs[index].pages.pageSize = data.data.size;
                            this.$refs.queryTable.tabs[index].pages.totalCount = data.data.total;
                        });
                    } else {
                        if (index === edit) {
                            datas.data.records.map(row => {
                                row.orderType = this.$refs.queryTable.optionLists.orderType[0].dictCode;
                                // 鲜香泡豆默认01，其余物料默认为空不可编辑
                                row.redact = true;
                                if (row.productMaterialCode !== 'SP01130005') {
                                    row.ver = '';
                                    row.notEditableProp = ['ver'];
                                } else {
                                    row.ver = this.$refs.queryTable.optionLists.ver[0].dictCode;
                                }
                            })
                        }
                        this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                        this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
                    }
                })
            } else {
                if (Number(this.$refs.queryTable.activeName) === edit) {
                    datas.data.records.map(row => {
                        row.orderType = this.$refs.queryTable.optionLists.orderType[0].dictCode;
                        // 鲜香泡豆默认01，其余物料默认为空不可编辑
                        row.redact = true;
                        if (row.productMaterialCode !== 'SP01130005') {
                            row.ver = '';
                            row.notEditableProp = ['ver'];
                        } else {
                            row.ver = this.$refs.queryTable.optionLists.ver[0].dictCode;
                        }
                    })
                }
                this.tabs[this.$refs.queryTable.activeName].tableData = datas.data.records;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.currPage = datas.data.current;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize = datas.data.size;
                this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount = datas.data.total;
            }
        }

        requestOrderHandler() {
            const arr = this.tabs[0].multipleSelection as OrderObj[];
            if (!arr.length) {
                this.$warningToast('请选择订单');
                return false;
            }
            for (const item of arr) {
                if (!item.orderType) {
                    this.$warningToast('请填写必填项');
                    return false;
                }
            }
            const params = arr.map((item: OrderObj) => ({
                id: item.id,
                orderType: item.orderType,
                ver: item.ver
            }));
            FER_API.FER_ORDER_SEND_API(params).then(res => {
                this.$successToast(res.data.msg);
                this.$refs.queryTable.getDataList(true);
            })
        }
    }
    interface OrderObj {
        id: string;
        orderType: string;
        ver: string;
    }
</script>

<style lang="scss" scoped>
    .btn-box {
        float: right;
        width: 80%;
        padding: 0;
    }
</style>
