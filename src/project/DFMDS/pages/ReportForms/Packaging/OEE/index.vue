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
        name: 'OEEReport'
    })
    export default class OEEReport extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        // 查询必填栏位校验
        queryTableFormRules = [
            {
                prop: 'startDate',
                text: '请选择开始时间'
            }
        ]


        //表格数据
        column = [
            {
                prop: 'workShopName',
                label: '生产车间',
                minWidth: '120'
            },
            {
                prop: 'productLineName',
                label: '产线',
                minWidth: '120'
            },
            {
                prop: 'classesName',
                label: '班次',
                width: '80'
            },
            {
                prop: 'materialName',
                label: '品项',
                width: '80'
            },
            {
                prop: 'productDate',
                label: '日期',
                width: '220'
            },
            {
                prop: 'avbRatio',
                label: '可用率',
                width: '100'
            },
            {
                prop: 'timeCropRatio',
                label: '时间嫁动率',
                width: '140'
            },
            {
                prop: 'performCropRatio',
                label: '性能嫁动率',
                width: '140'
            },
            {
                prop: 'googRatio',
                label: '良品率',
                width: '100'
            },
            {
                prop: 'theOEERatio',
                label: '综合效率',
                subLabel: '(OEE)',
                width: '140'
            },
            {
                prop: 'proDuctRatio',
                label: '生产效率',
                width: '100'
            },
            {
                prop: 'allTolTime',
                label: '总时间',
                subLabel: '(min)',
                width: '100'
            },
            {
                prop: 'planStopTime',
                label: '计划停机时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'alltime',
                label: '实际投入时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'removeTime',
                label: '除外时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'excptTime',
                label: '异常损失时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'netOprTime',
                label: '净作业时间',
                subLabel: '(min)',
                width: '140'
            },
            {
                prop: 'output',
                label: '产出数',
                subLabel: '(件)',
                width: '100'
            },
            {
                prop: 'allBad',
                label: '不良品数',
                subLabel: '(件)',
                width: '100'
            },
            {
                prop: 'effecCapacity',
                label: '有效效能',
                subLabel: '(件/h)',
                width: '140'
            },
            {
                prop: 'outPutTime',
                label: '产出时间',
                subLabel: '(h)',
                width: '100'
            },
            {
                prop: 'netOprTimeHour',
                label: '净作业时间',
                subLabel: '(h)',
                width: '140'
            }
        ];

        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultValue: '',
                width: '150',
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
                type: 'date-interval',
                label: '生产日期',
                defaultValue: '',
                labelWidth: '100',
                width: '305',
                rule: [{ required: true, message: '请输入生产日期', trigger: 'blur' }],
                prop: 'startDate',
                propTwo: 'endDate'
            }
        ];


        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_PACKAGING_OEE_API(params);
        };

        exportOption= {
            exportInterface: '',
            auth: '',
            text: 'OEE报表'
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
