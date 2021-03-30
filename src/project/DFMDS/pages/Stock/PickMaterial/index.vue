<!-- 包材领料 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth=""
            :factory-type="1"
            :column="column"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            :show-index-column="true"
            @line-click="lineClick"
            @get-data-success="setData"
            @created-end="createdEnd"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, FER_API } from 'common/api/api';
    import { dateFormat } from 'src/utils/utils';

    @Component({
        name: 'PickMaterial',
        components: {}
    })
    export default class PickMaterial extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // queryTable 必要变数
        queryTableFormData = [
            {
                type: 'select',
                label: '生产车间',
                labelWidth: '90',
                prop: 'workShop',
                // defaultValue: '',
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
                labelWidth: '90',
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
                type: 'date-interval',
                label: '生产日期',
                labelWidth: 90,
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'startDate',
                propTwo: 'endDate'
            },
            {
                type: 'select',
                label: '领料状态',
                prop: 'status',
                defaultValue: '',
                filterable: true,
                labelWidth: 90,
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
                type: 'input',
                label: '生产订单',
                prop: 'orderNo',
                defaultValue: '',
                labelWidth: 90
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        column = [
            {
                prop: 'fermentorName',
                label: '订单状态',
                minwidth: '100'
            },
            {
                prop: 'fermentorName',
                label: '领料状态',
                minwidth: '100'
            },
            {
                prop: 'startDate',
                label: '生产日期',
                minwidth: '120'
            },
            {
                prop: 'startDate',
                label: '生产产线',
                minwidth: '130'
            },
            {
                prop: 'orderNo',
                label: '生产订单',
                minwidth: '130',
                onclick: true
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
                label: '计划数量',
                minwidth: '85'
            },
            {
                prop: 'unit',
                label: '入库数量',
                minwidth: '85'
            },
            {
                prop: 'preUnit',
                label: '单位',
                minwidth: '60'
            }
        ]

        createdEnd() {
            this.getDict();
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '') {
                    // this.$refs.queryTable.getDataList(true)
                    this.$refs.queryTable.tableData = [{ orderNo: '2020101022' }]
                }
            })
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
            return FER_API.FER_ORDER_LIST_API(params);
        }

        // queryTable 回传 result
        setData(datas) {
            console.log(datas)
        }

        lineClick(row) {
            console.log(this.$route, row)
            this.$store.commit(
                'common/updateMainTabs',
                this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Stock-PickMaterial-detail')
            );
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Stock-PickMaterial-detail`
                });
            }, 100);
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
