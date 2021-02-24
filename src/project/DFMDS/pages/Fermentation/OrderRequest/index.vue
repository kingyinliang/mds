<!-- 订单申请 -->
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
            :operation-column-width="90"
            :show-select-column="currentTab === '0'"
            :show-index-column="true"
            @tab-click="tabClick"
            @get-data-success="returnDataFromQueryTableForm"
            @created-end="createdEnd"
        >
            <template v-slot:tab-head0>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '未申请' }} </h3>
                    <el-button type="primary" size="small" style="float: right;" @click="requestOrderHandler">
                        申请订单
                    </el-button>
                </div>
            </template>
            <template v-slot:tab-head1>
                <div class="box-card-title clearfix">
                    <h3> <em class="title-icon" :style="{ background: '#487bff' }" />{{ '已申请' }} </h3>
                </div>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
import { dateFormat } from 'src/utils/utils';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'OrderRequest',
        components: {}
    })
    export default class OrderRequest extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        currentTab = '0';

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                rule: [
                    { required: true, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '发酵'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['fermentorId']
            },
            {
                type: 'select',
                label: '容器号',
                prop: 'fermentorId',
                labelWidth: 80,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                filterable: true,
                optionsFn: val => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_DROPDOWN_API({ // /sysHolder/query
                            deptId: val,
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            holderType: ['001', '025', '028'] // 发酵罐/池、鲜香泡豆泡豆罐、调酱罐/池 参数编码
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'productMaterialCode',
                labelWidth: 90,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                filterable: true,
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ALLMATERIAL_API({
                            materialTypes: ['ZHAL'] // 物料类型列表 - 半成品
                        }).then((res) => {
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'date-interval',
                label: '订单日期',
                labelWidth: 90,
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'startDate',
                propTwo: 'endDate'
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
                label: '容器号',
                minwidth: '160'
            },
            {
                prop: 'productMaterialName',
                label: '生产物料',
                minwidth: '160',
                formatter(row) {
                    return `${row.productMaterialName} ${row.productMaterialCode}`
                }
            },
            {
                prop: 'amount',
                label: '订单数量',
                minwidth: '85'
            },
            {
                prop: 'unit',
                label: '订单单位',
                minwidth: '80',
                onclick: true
            },
            {
                prop: 'orderType',
                label: '订单类型',
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
                prop: 'ver',
                label: '版本',
                minwidth: '160',
                type: 'select',
                redact: true,
                resVal: {
                    resData: 'data',
                    label: 'dictValue',
                    value: 'dictCode'
                }
            },
            {
                prop: 'startDate',
                label: '开始日期',
                minwidth: '120'
            },
            {
                prop: 'endDate',
                label: '结束日期',
                minwidth: '120'
            },
            {
                prop: 'preOrderNo',
                label: '前置订单',
                minwidth: '160'
            },
            {
                prop: 'preMaterialName',
                label: '前置物料',
                minwidth: '160',
                formatter(row) {
                    return `${row.preMaterialName} ${row.preMaterialCode}`
                }
            },
            {
                prop: 'preAmount',
                label: '数量',
                minwidth: '80'
            },
            {
                prop: 'preUnit',
                label: '单位',
                minwidth: '60'
            }
        ]

        tabs = [
            {
                label: '未申请',
                tableData: [],
                multipleSelection: [],
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
                label: '已申请',
                tableData: [],
                multipleSelection: [],
                pages: {
                    currPage: 1,
                    pageSize: 10,
                    totalCount: 0
                },
                column: [
                    {
                        prop: 'orderNo',
                        label: '订单号',
                        minwidth: '160'
                    },
                    ...this.Column, // eslint-disable-line
                    {
                        prop: 'applicant',
                        label: '申请人员',
                        minwidth: '160'
                    },
                    {
                        prop: 'applyDate',
                        label: '申请时间',
                        minwidth: '160'
                    }
                ]
            }
        ]

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

</style>
