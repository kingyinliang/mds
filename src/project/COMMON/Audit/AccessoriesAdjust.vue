<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="true"
            :column="column"
            :show-page="true"
            query-auth="ckTimeQuery"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :factory-type="1"
            @get-data-success="setData"
        >
            <template slot="showTableOther">
                <el-row class="solerow">
                    <div>
                        移动数量合计：
                    </div>
                    <div class="input_bottom">
                        {{ amountSum }} H
                    </div>
                </el-row>
            </template>
        </query-table>
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
        column = [
            {
                prop: 'workShopName',
                label: '生产车间',
                width: '120'
            },
            {
                prop: 'holderTypeName',
                label: '容器类型',
                width: '120'
            },
            {
                prop: 'holderNo',
                label: '容器号',
                width: '65'
            },
            {
                prop: 'materialCode',
                label: '生产物料 ',
                width: '180',
                formatter: (row) => {
                    return row.productMaterialName + ' ' + row.productMaterialCode;
                }
            },
            {
                prop: 'planOutput',
                label: '组件物料',
                width: '180',
                formatter: (row) => {
                    return row.materialName + ' ' + row.materialCode;
                }
            },
            {
                prop: 'type',
                label: '调整类型'
            },
            {
                prop: 'amount',
                label: '调整数量'
            },
            {
                prop: 'batch',
                label: '调整批次',
                width: '110'
            },
            {
                prop: 'unit',
                label: '单位',
                width: '65'
            },
            {
                prop: 'productData',
                label: '投料/生产时间',
                width: '165'
            },
            {
                prop: 'remark',
                label: '备注'
            },
            {
                prop: 'changer',
                label: '操作人',
                width: '140'
            },
            {
                prop: 'changed',
                label: '操作时间',
                width: '165'
            }
        ];

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
                type: 'select',
                label: '容器类型',
                prop: 'holderType',
                options: [
                    { label: '溶解罐', value: '019' },
                    { label: '煮料锅', value: '020' }
                ],
                resVal: {
                    label: ['label'],
                    value: 'value'
                },
                linkageProp: ['holderId']
            },
            // {
            //     type: 'input',
            //     label: '容器号',
            //     prop: 'holderId'
            // },
            {
                type: 'select',
                label: '容器号',
                prop: 'holderId',
                optionsFn: val => {
                    return COMMON_API.HOLDER_DROPDOWN_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        holderType: val || ''
                        // deptType: 'PRODUCT_LINE'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['holderNo'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'productMaterialCode',
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
            // {
            //     type: 'select',
            //     label: '组件物料',
            //     prop: 'materialCode',
            //     defaultValue: '',
            //     filterable: true,
            //     defaultOptionsFn: () => {
            //         return COMMON_API.SEARCH_MATERIAL_API({
            //             factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //             materialType: 'ZROH' // ZFZC  辅料  ZROH 原材料

            //         })
            //     },
            //     resVal: {
            //         resData: 'data',
            //         label: ['materialName', 'materialCode'],
            //         value: 'materialCode'
            //     }
            // },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'productStartDate',
                propTwo: 'productEndDate'
            }
        ];

        amountSum = 0;

        // 查询请求
        listInterface = params => {
            // params.current = this.$refs.queryTable.queryForm.currPage;// eslint-disable-line
            // params.size = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.pageSize;// eslint-disable-line
            // params.total = this.$refs.queryTable.tabs[this.$refs.queryTable.activeName].pages.totalCount;// eslint-disable-line
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return AUDIT_API.ACCESSORIES_LIST_API(params);
        };

        setData(datas) {
            if (datas.data['total'] > 0) {
                this.amountSum = datas.data['records'][0]['amountSum'];
            }
        }

    }
</script>
