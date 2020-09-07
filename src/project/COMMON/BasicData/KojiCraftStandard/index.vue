<template>
    <div class="header_main">
        <mds-card title="制曲工艺标准" :name="'spe'" :pack-up="false" style="margin-bottom: 0; background: #fff;">
            <template slot="titleBtn">
                <el-row style="float: right;">
                    <el-form :inline="true" :model="controllableForm" size="small" label-width="68px" class="topforms2" @submit.native.prevent>
                        <el-form-item>
                            <el-input v-model="controllableForm.materialCode" placeholder="物料" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="controllableForm.materialCode===''?getItemsList():false" @change="dataOfSearch.productMaterial=controllableForm.materialCode" />
                        </el-form-item>
                        <el-form-item style="height: 32px;">
                            <el-button type="primary" size="small" :disabled="controllableForm.materialCode.trim()===''" @click="getItemsList(true,'normal')" @clear="controllableForm.materialCode=''">
                                查询
                            </el-button>
                            <el-button type="primary" size="small" @click="btnAdvanceSearch">
                                高级查询
                            </el-button>
                            <el-button type="primary" size="small" @click="btnAddItem">
                                新增
                            </el-button>
                            <el-button type="danger" size="small" @click="btnRemoveItems">
                                批量删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </template>
            <!-- show table -->
            <table-show ref="showTable" :table-element-setting="tableItemSetting" :target-table.sync="tableData" />
            <el-pagination v-if="tableData.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </mds-card>
        <!-- 新增工序 -->
        <dialog-form ref="addWorkProcedure" :form-element-setting="dialogAddItemSetting" :data-form.sync="dataOfAddItem" @send-dialog-form-data="addItem" />
        <!-- 编辑工序 -->
        <dialog-form ref="updateWorkProcedure" :form-element-setting="dialogEditItemSetting" :data-form.sync="dataOfEditItem" @send-dialog-form-data="updateItem" />
        <!-- 高级查询 -->
        <dialog-form ref="advanceSearch" :form-element-setting="dialogSearchSetting" :data-form.sync="dataOfSearch" @send-dialog-form-data="getItemsListFromDialog" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    import DialogForm from 'components/DialogForm.vue';
    import TableShow from 'components/TableShow.vue';

    @Component({
        name: 'WorkProcedureManage',
        components: {
            DialogForm,
            TableShow
        }
    })
    export default class WorkProcedureManage extends Vue {

        $refs: {
            addWorkProcedure: HTMLFormElement;
            updateWorkProcedure: HTMLFormElement;
            advanceSearch: HTMLFormElement;
            showTable: HTMLFormElement;
        }

        serchSpecListObject= {}

        currPage= 1
        pageSize= 10
        totalCount= 1

        isAdvanceSearchDailogShow= false
        controllableForm= {
            brand: '',
            materialCode: '',
            boxSpec: '',
            productSpec: ''
        }

        tableItemSetting={
            props: {
                // eslint-disable-next-line no-invalid-this
                height: this.mainClientHeight - 70 - 47,
                title: 'TableWorkProcedure'
            },
            data: [
                {
                    type: 'multiple', // 表格元件
                    prop: 'workShop',
                    label: '生产车间', // 表单元件名称
                    minWidth: '400px',
                    width: '', // width 会覆盖 minWidth
                    content: ['workShop']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'productMaterial',
                    label: '生产物料', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: ['productMaterial']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'standardAmount',
                    label: '曲房原豆标准量', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: ['standardAmount']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'standardDuration',
                    label: '入曲标准时长', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: ['standardDuration']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'remark',
                    label: '备注', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: ['remark']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'changer',
                    label: '操作人', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: ['changer']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'changed',
                    label: '操作时间', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: ['changed']
                },
                {
                    type: 'button', // 表格元件
                    prop: 'control',
                    label: '操作', // 表单元件名称
                    minWidth: '',
                    width: '160px',
                    content: [{
                            buttonName: '编辑',
                            btn: 'editBtn',
                            icon: 'el-icon-edit',
                            isAuth: 'specEdit'
                        }]
                }
            ]
        }

        tableData: CurrentDataTable[]=[]

        // [dialog][setting] 高级查询
        dialogSearchSetting={
            props: {
                labelWidth: '100px',
                title: '高级查询'
            },
            data: [
                {
                    type: 'select', // 表单元件类型下拉選單
                    prop: 'workShop',
                    label: '生产车间', // 表单元件名称
                    placeholder: '请选择',
                    rules: [],
                    resVal: {
                        resData: 'data', // API 回传参数名
                        label: ['deptName'], // 下拉選單 list option 组装 label view
                        value: 'id' // 下拉選單 list option value
                    },
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_WORKSHOP_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptType: ['WORK_SHOP'],
                            deptName: '制曲'
                            }).then((data) => {
                                resolve(data)
                            })
                        })
                    },
                    linkageProp: ['standardDuration']
                },
                {
                    type: 'input',
                    prop: 'productMaterial',
                    label: '生产物料',
                    placeholder: '请输入物料编码或者物料描述',
                    rules: []
                },
                {
                    type: 'select',
                    prop: 'standardAmount',
                    label: '报工工序',
                    placeholder: '请选择',
                    rules: [],
                    resVal: {
                        resData: 'data', // API 回传参数名
                        label: ['dictValue'], // 下拉選單 list option 组装 label view
                        value: 'dictCode' // 下拉選單 list option value
                    },
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_PROCEDURE' }).then((data) => {
                                resolve(data)
                            })
                        })
                    }
                },
                {
                    type: 'select',
                    prop: 'standardDuration',
                    label: '生产工序',
                    placeholder: '请选择',
                    rules: [],
                    optionsFn: val => {
                        return COMMON_API.ORG_QUERY_CHILDREN_API({
                            parentId: val || '',
                            deptType: 'PRODUCT_LINE'
                        })
                    }
                }
            ]
        }


         // [dialog][data] 高级查询
        dataOfSearch={
            workShop: '',
            productMaterial: '',
            standardAmount: '',
            standardDuration: ''
        }


        // [dialog][setting] 新增工序
        dialogAddItemSetting={
            props: {
                labelWidth: '100px',
                title: '新增报工'
            },
            data: [
                {
                    type: 'select',
                    prop: 'workShop',
                    label: '生产车间',
                    placeholder: '请选择',
                    rules: [
                        { required: true, message: '请选择车间', trigger: 'change' }
                    ],
                    resVal: {
                        resData: 'data', // API 回传参数名
                        label: ['deptName'], // 下拉選單 list option 组装 label view
                        value: 'id' // 下拉選單 list option value
                    },
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_WORKSHOP_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptType: ['WORK_SHOP'],
                            deptName: '制曲'
                            }).then((data) => {
                                resolve(data)
                            })
                        })
                    }
                },
                {
                    type: 'select',
                    prop: 'productMaterial',
                    label: '生产物料',
                    placeholder: '请选择',
                    rules: [
                        { required: true, message: '请选择生产物料', trigger: 'change' }
                    ],
                    resVal: {
                        resData: 'data', // API 回传参数名
                        label: ['deptName'], // 下拉選單 list option 组装 label view
                        value: 'id' // 下拉選單 list option value
                    }
                    // defaultOptionsFn: () => {
                    //     return new Promise((resolve) => {
                    //         resolve()
                    //     })
                    // }
                },
                {
                    type: 'select',
                    prop: 'standardAmount',
                    label: '报工工序',
                    placeholder: '请选择',
                    rules: [
                        { required: true, message: '请选择报工工序', trigger: 'change' }
                    ],
                    resVal: {
                        resData: 'data', // API 回传参数名
                        label: ['deptName'], // 下拉選單 list option 组装 label view
                        value: 'id' // 下拉選單 list option value
                    }
                    // defaultOptionsFn: () => {
                    //     return new Promise((resolve) => {
                    //         resolve()
                    //     })
                    // }
                },
                {
                    type: 'select',
                    prop: 'standardDuration',
                    label: '生产工序',
                    placeholder: '请选择',
                    rules: [
                        { required: true, message: '请选择生产工序', trigger: 'change' }
                    ],
                    resVal: {
                        resData: 'data', // API 回传参数名
                        label: ['deptName'], // 下拉選單 list option 组装 label view
                        value: 'id' // 下拉選單 list option value
                    }
                    // defaultOptionsFn: () => {
                    //     return new Promise((resolve) => {
                    //         resolve()
                    //     })
                    // }
                },
                {
                    type: 'input',
                    prop: 'remark',
                    label: '备注',
                    placeholder: '请输入'
                },
                {
                    type: 'text',
                    prop: 'changer',
                    label: '操作人',
                    placeholder: ''
                },
                {
                    type: 'text',
                    prop: 'changed',
                    label: '操作时间',
                    placeholder: ''
                }
            ]
        }

        // [dialog][data] 新增工序
        dataOfAddItem={
            workShop: '',
            productMaterial: '',
            standardAmount: '',
            standardDuration: '',
            remark: '',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }


        // [dialog][setting] 编辑工序
        dialogEditItemSetting={
            props: {
                labelWidth: '100px',
                title: '编辑报工'
            },
            data: [
            {
                type: 'select',
                prop: 'workShop',
                label: '生产车间',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择车间', trigger: 'change' }
                ],
                resVal: {
                    resData: 'data', // API 回传参数名
                    label: ['deptName'], // 下拉選單 list option 组装 label view
                    value: 'id' // 下拉選單 list option value
                },
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '制曲'
                        }).then((data) => {
                            resolve(data)
                        })
                    })
                }
            },
            {
                type: 'select',
                prop: 'productMaterial',
                label: '生产物料',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择生产物料', trigger: 'change' }
                ],
                resVal: {
                    resData: 'data', // API 回传参数名
                    label: ['deptName'], // 下拉選單 list option 组装 label view
                    value: 'id' // 下拉選單 list option value
                },
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        resolve()
                    })
                }
            },
            {
                type: 'select',
                prop: 'standardAmount',
                label: '报工工序',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择报工工序', trigger: 'change' }
                ],
                resVal: {
                    resData: 'data', // API 回传参数名
                    label: ['deptName'], // 下拉選單 list option 组装 label view
                    value: 'id' // 下拉選單 list option value
                },
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        resolve()
                    })
                }
            },
            {
                type: 'select',
                prop: 'standardDuration',
                label: '生产工序',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择生产工序', trigger: 'change' }
                ],
                resVal: {
                    resData: 'data', // API 回传参数名
                    label: ['deptName'], // 下拉選單 list option 组装 label view
                    value: 'id' // 下拉選單 list option value
                },
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        resolve()
                    })
                }
            },
            {
                type: 'input',
                prop: 'remark',
                label: '备注',
                placeholder: '请输入'
            },
            {
                type: 'text',
                prop: 'changer',
                label: '操作人',
                placeholder: '',
                innerText: getUserNameNumber()
            },
            {
                type: 'text',
                prop: 'changed',
                label: '操作时间',
                placeholder: '',
                innerText: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        ]
        }

        // [dialog][data] 编辑工序
        dataOfEditItem={
        }


        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        mounted() {
            this.getItemsList();
        }

        // from dialog
        addItem(data) {
            console.log(data)
        }

        // from dialog
        updateItem(data) {
            console.log(data)
        }

        getItemsList(haveParas = false, type = 'normal') {

            if (haveParas) {
                this.currPage = 1;
            }
            if (type === 'normal') {
                //
            }

            // COMMON_API.SPECS_QUERY_API({
            //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            //     boxSpec: this.controllableForm.boxSpec.trim(),
            //     bottleSpec: this.controllableForm.productSpec.trim(),
            //     brand: this.controllableForm.brand.trim(),
            //     material: this.controllableForm.materialCode.trim(),
            //     current: JSON.stringify(this.currPage),
            //     size: JSON.stringify(this.pageSize)
            // }).then(({ data }) => {
            //     if (haveParas && data.data.records.length === 0) {
            //             this.$infoToast('暂无任何内容');
            //     }
            //     this.targetInfoList = data.data.records;
            //     this.currPage = data.data.current;
            //     this.pageSize = data.data.size;
            //     this.totalCount = data.data.total;

            //     this.isAdvanceSearchDailogShow = false;
            // });
        }

        getItemsListFromDialog(data) {
            this.controllableForm.materialCode = data.productMaterial
            this.getItemsList(true, 'advance')
        }

        // [btn] 新增
        btnAddItem() {
            this.$nextTick(() => {
                this.$refs.addWorkProcedure.init();
            });
        }

        // [btn] 修改
        btnUpdateItem(data) {
            this.dataOfEditItem = data
            this.$nextTick(() => {
                this.$refs.updateWorkProcedure.init();
            });
        }

        // [btn] 批量删除
        btnRemoveItems() {
            const tempMultipleSelection = this.$refs.showTable.getMultipleSelection

            if (tempMultipleSelection.length === 0) {
                this.$warningToast('请选择要删除的条目');
            } else {
                this.$confirm('确认删除, 是否继续?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        // COMMON_API.SPECS_REMOVE_API({
                        //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        //     ids: this.multipleSelection
                        // }).then(() => {
                        //     this.multipleSelection = [];
                        //     this.$nextTick(() => {
                        //         this.getItemsList();
                        //     });
                        // });
                    })
                    .catch();
            }
        }


        // [btn] 高级查询
        btnAdvanceSearch() {
            this.$nextTick(() => {
                this.$refs.advanceSearch.init();
            });
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getItemsList();
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getItemsList();
        }
    }

interface CurrentDataTable {
    bottleSpec?: number;
    bottleSpecUnit?: string;
    boxSpec?: number;
    boxSpecUnit?: string;
    brand?: string;
    changer?: string;
    factory?: string;
    id?: string;
    largeClass?: string;
    materialCode?: string;
    materialName?: string;
    version?: number;
}

interface Options {
    dictCode: string;
    dictId?: string;
    dictValue: string;
    factoryName?: string;
    id?: string;
}

</script>

<style scoped></style>
