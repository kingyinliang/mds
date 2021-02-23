<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
            :show-page="true"
            query-auth=""
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :get-summaries="getSummaries"
            :is-show-summary="true"
            :custom-data="true"
            :query-tabke-type="'report'"
            :export-excel="true"
            :rules="queryTableFormRules"
            :export-option="exportOption"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        components: {
        },
        name: 'ProductLineOEEReport'
    })
    export default class ProductLineOEEReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询必填栏位校验
        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]


        //表格数据
        column = [
            {
                prop: 'productLineName',
                label: '生产产线',
                minWidth: '120'
            },
            {
                prop: 'materialCode',
                label: '物料编码',
                minWidth: '120'
            },
            {
                prop: 'materialName',
                label: '物料名称',
                width: '120'
            },
            {
                prop: 'productDate',
                label: '日/月/季',
                width: '100'
            },
            {
                prop: 'timeCropRatio',
                label: '时间嫁动率',
                width: '100'
            },
            {
                prop: 'performCropRatio',
                label: '性能嫁动率',
                width: '100'
            },
            {
                prop: 'googRatio',
                label: '良品率',
                width: '100'
            },
            {
                prop: 'theOEERatio',
                label: 'OEE',
                width: '100'
            },
            {
                prop: 'notReach',
                label: '未达成原因',
                width: '200'
            }
        ];


        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '报表类型',
                prop: 'formType',
                defaultValue: '',
                labelWidth: '80',
                defaultOptionsList: [
                    { value: 'quarter', label: '季' },
                    { value: 'month:', label: '月' },
                    { value: 'day', label: '日' }
                ],
                width: '100'
            },
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: '100',
                width: '150',
                defaultValue: '',
                rule: [{ required: true, message: '请输入生产车间', trigger: 'blur' }],
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
                defaultValue: '',
                labelWidth: '80',
                width: '200',
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
                }
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'materialCode',
                defaultValue: '',
                labelWidth: '80',
                width: '160',
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_PACKAGING_OEE_MATERIAL_QUERY_API({
                        workShop: '',
                        productLine: ''
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            },
            {
                type: 'date-picker',
                label: '年度',
                defaultValue: '',
                labelWidth: '60',
                width: '100',
                dataType: 'year',
                prop: 'year'
            },
            {
                type: 'date-interval',
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                width: '305',
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_PRODUCTLINE_OEE_QUERY_API(params);
        };

        exportOption= {
            exportInterface: '',
            auth: '',
            text: '产线OEE报表'
        }

        /**
         * @description: data 表单 合计
         * @param1 {*}
         * @param2 {*}
         * @param3 {*}
         * @return {*}
         * @example: 示例代码
         * @param {*} getSummaries
         */
        getSummaries = param => {
            const { columns, data } = param;
            const sums: string[] = []
            const target = data[0]
            if (target) {
                columns.forEach((column, index) => {
                    if (Object.prototype.hasOwnProperty.call(target.totalData, column.property)) {
                        sums[index] = target.totalData[column.property]
                    } else {
                        sums[index] = ''
                    }
                });
                sums[0] = '合计';
            }
            return sums
        };

        // 设置数据
        setData(data) {
            console.log('查找回传结果');
            console.log(data);
            if (!data.data) {
                this.$infoToast('暂无任何内容');
            }
        }

    }
</script>
