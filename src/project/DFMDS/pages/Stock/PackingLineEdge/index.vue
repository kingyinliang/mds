<!-- 包材线边库 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth=""
            :factory-type="1"
            :column="column"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :show-operation-column="true"
            :operation-column-width="140"
            :show-index-column="true"
            :custom-data="true"
            @get-data-success="setData"
            @created-end="createdEnd"
        >
            <template slot="operation_column" slot-scope="{ scope }">
                <div>
                    <el-button type="text" size="small" @click="returnMaterial(scope.row)">
                        退料
                    </el-button>
                    <el-button type="text" size="small" @click="transferLine(scope.row)">
                        转线
                    </el-button>
                    <el-button type="text" size="small" @click="edit(scope.row)">
                        调整
                    </el-button>
                </div>
            </template>
        </query-table>
        <my-dialog ref="dialog" :form-columns="formColumns" :rules="rules" title="转线" />
        <my-dialog ref="dialog2" :form-columns="formColumns2" :rules="rules2" title="调整" />
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
import MyDialog from '../components/dialog.vue'
@Component({
    name: 'PackingLineEdge',
    components: {
        MyDialog
    }
})
export default class PackingLineEdge extends Vue {

    $refs: {
        queryTable: HTMLFormElement;
        dialog: HTMLFormElement;
        dialog2: HTMLFormElement;
    };

    // 查询表头
    queryFormData = [
        {
            type: 'select',
            label: '生产车间',
            labelWidth: '120',
            prop: 'workShop',
            defaultValue: '',
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
            label: '生产物料',
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
        }
    ];

    column = [
        {
            label: '生产线',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '包材物料',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '单位',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '库存数量',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '批次',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '厂家',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '模具号',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '操作人',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        },
        {
            label: '操作时间',
            prop: 'aaaaaaaaaaaa',
            minwidth: '120px'
        }
    ]

    formColumns = [
        {
            type: 'input',
            label: '转出线',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '包材物料',
            prop: 'aaaaaaaaa',
            formatter: row => row.toString(),
            disabled: true
        },
        {
            type: 'input',
            label: '批次',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '模具号',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '当前库存',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'select',
            label: '转入线',
            prop: 'line',
            defaultOptions: [

            ]
        },
        {
            type: 'input',
            label: '数量',
            prop: 'count'
        },
        {
            type: 'input',
            label: '单位',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '备注',
            prop: 'aaaaaaaaa'
        },
        {
            type: 'input',
            label: '操作人',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '操作时间',
            prop: 'aaaaaaaaa',
            disabled: true
        }
    ]

    formColumns2 = [
        {
            type: 'input',
            label: '包材物料',
            prop: 'aaaaaaaaa',
            formatter: row => row.toString(),
            disabled: true
        },
        {
            type: 'input',
            label: '批次',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '模具号',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '当前库存',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'select',
            label: '调整类型',
            prop: 'type',
            defaultOptions: [

            ]
        },
        {
            type: 'input',
            label: '调整量',
            prop: 'count'
        },
        {
            type: 'input',
            label: '单位',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '说明',
            prop: 'aaaaaaaaa'
        },
        {
            type: 'input',
            label: '操作人',
            prop: 'aaaaaaaaa',
            disabled: true
        },
        {
            type: 'input',
            label: '操作时间',
            prop: 'aaaaaaaaa',
            disabled: true
        }
    ]

    rules = {
        line: [
            { required: true, message: '请选择转入线', trigger: 'change' }
        ],
        count: [
            { required: true, message: '请输入数量', trigger: 'blur' }
        ]
    }

    rules2 = {
        type: [
            { required: true, message: '请选择调整类型', trigger: 'change' }
        ],
        count: [
            { required: true, message: '请输入数量', trigger: 'blur' }
        ]
    }

    // 查询请求
    listInterface = params => {
        params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
        // return REPORTS_API.REPORT_PRODUCT_LINE_CAPACITY_API(params);
        return new Promise((resolve) => {
            resolve({
                data: {
                    data: {
                        records: [
                            { aaaaaaaaaaaa: 'aaaaaaaaaaaaaaaaaaaaaa' }
                        ],
                        total: 10
                    }
                }
            })
        });
    };

    // 设置数据
    setData(data) {
        if (!data.data) {
            this.$infoToast('暂无任何内容');
        }
    }

    createdEnd() {
        console.log(1111111111)
    }

    transferLine(row) {
        this.$refs.dialog.init(row)
    }

    returnMaterial() {
        this.$store.commit(
            'common/updateMainTabs',
            this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Stock-PackingLineEdge-returnMaterial')
        );
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Stock-PackingLineEdge-returnMaterial`
            });
        }, 100);
    }

    edit(row) {
        this.$refs.dialog2.init(row)
    }
}
</script>

<style>
</style>
