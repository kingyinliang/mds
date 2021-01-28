<!-- 生产线产能利用率 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :show-table="true"
            :show-index-column="false"
            :column="column"
            :span-method="spanMethod"
            :show-page="true"
            query-auth=""
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            :factory-type="1"
            :export-excel="true"
            @get-data-success="setData"
        />
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';

    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

    @Component({ })
    export default class ProductCapacity extends Vue {
        formHeader = {};

        $refs: {
            queryTable: HTMLFormElement;
        };

        column = [
            {
                label: '生产车间',
                prop: 'workShopName'
            },
            {
                label: '生产线',
                prop: 'workShop',
                width: 120
            },
            {
                label: '生产物料',
                prop: 'workShop'
            },
            {
                label: '单位',
                prop: 'unitName'
            },
            ...months.map((item, index) => {
                return {
                    label: item + '月份',
                    child: [
                        { label: '有效产能', prop: 'aaaa' + (index + 1), width: 120 },
                        { label: '实际产量', prop: 'bbbb' + (index + 1), width: 120 },
                        { label: '实际产量利用率', prop: 'cccc' + (index + 1), width: 120 }
                    ]
                };
            }),
            {
                label: '汇总',
                child: [
                    { label: '有效产能', prop: 'aaaaAll', width: 120 },
                    { label: '实际产量', prop: 'bbbbAll', width: 120 },
                    { label: '实际产量利用率', prop: 'ccccAll', width: 120 }
                ]
            }
        ]

        // 查询表头
        queryFormData = [
            {
                type: 'date-picker',
                label: '年度',
                dataType: 'year',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                prop: 'oneorderProductDate',
                valueFormat: 'yyyy'
            },
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
                }
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
            }
        ];

        // 查询请求
        listInterface = params => {
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            // return REPORTS_API.REPORT_PACKAGING_OEE_API(params);
            return new Promise(resolve => {
                resolve({
                    data: {
                        data: {
                            records: [
                                { workShopName: '车间一', unitName: '单位' }
                            ]
                        }
                    }
                })
            })
        };

        // 设置数据
        setData(data) {
            console.log(data);
        }

        spanMethod({ row, column, rowIndex, columnIndex }) {
            console.log({ row, column, rowIndex, columnIndex })
            if (columnIndex === 1) {
                if (rowIndex === 0) {
                    return [1, 2];
                } else if (columnIndex === 1) {
                    return [0, 0];
                }
            }
        }

    }
</script>

<style lang="scss" scoped>
</style>
