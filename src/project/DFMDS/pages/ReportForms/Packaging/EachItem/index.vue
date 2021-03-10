<!-- 包装各品项产量  -->
<template>
    <div class="header_main">
        <report-query-table
            ref="queryTable"
            :query-form-setting="queryFormSetting"
            :query-form-data="queryFormData"
            :data-table-setting="dataTableSetting"
            :list-interface="listInterface"
            :custom-data="true"
            :query-table-type="'report'"
            @get-data-success="setData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, REPORTS_API } from 'common/api/api';
import { dateFormat } from 'src/utils/utils';
    // import { dateFormat } from 'utils/utils';

    const months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];

    @Component({
        components: {
        },
        name: 'EachItem'
    })
    export default class EachItem extends Vue {

        // query header area setting
        queryFormSetting= {
            isQueryFormShow: true, // 标头搜寻区块是否显示
            rules: [ // 查询必填栏位校验
                {
                    prop: 'year',
                    text: '请选择年度'
                },
                {
                    prop: 'unit',
                    text: '请选择单位'
                }
            ],
            queryAuth: '',
            exportExcel: true, // 导出 excel BTN
            exportOption: {
                exportInterface: '',
                auth: '',
                text: '包装各品项产量'
            }
        }

        // data table area setting
        dataTableSetting={
            showIt: true, // showit or not
            showSelectColumn: false,
            showIndexColumn: false,
            showOperationColumn: false,
            showPagination: true,
            //表格数据
            column: [
                {
                    prop: 'materialCode',
                    label: '物料编号',
                    width: '140'
                },
                {
                    prop: 'materialName',
                    label: '物料名称',
                    width: '140'
                },
                {
                    prop: 'unit',
                    label: '单位',
                    width: '80'
                },
                ...months.map((item, index) => {
                    return {
                        prop: 'output' + (index + 1),
                        label: item + '月',
                        minWidth: '120'
                    }
                }),
                {
                    prop: 'outputSummary',
                    label: '合计',
                    width: '140'
                }
            ],
            tableAttributes: {
                isShowSummary: false // 合计
            },
            dataChangeByAPI: false, // table data change by API
            tableHeightSet: 405
        }

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 查询表头
        queryFormData = [
            {
                type: 'date-picker',
                label: '年度',
                dataType: 'year',
                defaultValue: dateFormat(new Date(), 'yyyy'),
                labelWidth: '100',
                rule: [{ required: true, message: '请选择年度', trigger: 'blur' }],
                prop: 'year',
                valueFormat: 'yyyy'
            },
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultValue: '',
                labelWidth: '100',
                rule: [{ required: false, message: '请选择生产车间', trigger: 'blur' }],
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
                    value: 'deptCode'
                }
                // linkageProp: ['largeClass', 'materialCode']
            },
            {
                type: 'select',
                label: '品项大类',
                prop: 'largeClass',
                labelWidth: '100',
                filterable: true,
                rule: [{ required: false, message: '请选择品项大类', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_LARGE_CLASS_DROP_DOWN_API({
                        // workShop: val || ''
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
                // linkageProp: ['materialCode']
            },
            {
                type: 'select',
                label: '生产物料',
                prop: 'materialCode',
                labelWidth: '100',
                filterable: true,
                rule: [{ required: false, message: '请选择生产物料', trigger: 'blur' }],
                defaultOptionsFn: () => {
                    return REPORTS_API.REPORT_MATERIAL_DROP_DOWN_API({
                        // workShop: val1 || '',
                        // largeClass: val2 || ''
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictCode', 'dictValue'],
                    value: 'dictCode'
                }
            },
            {
                type: 'select',
                label: '单位',
                prop: 'unit',
                labelWidth: '100',
                rule: [{ required: true, message: '请选择单位', trigger: 'blur' }],
                options: [
                    { label: '箱', value: 'CAR' },
                    { label: '吨', value: 'T' }
                ],
                defaultValue: 'CAR',
                resVal: {
                    // resData: 'data',
                    label: ['label'],
                    value: 'value'
                }
            }
        ];

        // 查询请求
        listInterface = params => {
            // params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return REPORTS_API.REPORT_SUB_OUT_PUT_API(params);
        };

        // 设置数据
        setData(data) {
            console.log(data);
        }

    }
</script>
