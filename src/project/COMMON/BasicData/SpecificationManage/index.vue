<template lang="pug">
    div.header_main
        mds-card(title="规格列表" :name="'spe'" :pack-up="false" style="margin-bottom: 0; background: #fff;")
            template(slot="titleBtn")
                el-row(style="float: right;")
                    el-form(:inline="true" :model="dataOfSearch" size="small" label-width="68px" class="topforms2" @submit.native.prevent)
                        el-form-item
                            el-input(v-model="dataOfSearch.materialCode" placeholder="物料" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="dataOfSearch.materialCode===''?getItemsList():false")
                        el-form-item(style="height: 32px;")
                            el-button(v-if="isAuth('specQuery')" type="primary" size="small" :disabled="dataOfSearch.materialCode.trim()===''" @click="getItemsList(true,'normal')") 查询
                            el-button(v-if="isAuth('specQuery')" type="primary" size="small" @click="btnAdvanceSearch") 高级查询
                            el-button(v-if="isAuth('specInsert')" type="primary" size="small" @click="btnAddItem") 新增
                            el-button(v-if="isAuth('specDel')" type="danger" size="small"  @click="btnRemoveItems") 批量删除
            //- show table
            table-show(ref="targetInfoList" :table-element-setting="tableItemSetting" :target-table.sync="targetInfoList" @updateItem="btnUpdateItem")
            el-pagination(:current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange")
        //- 编辑规格
        dialog-form(ref="updateSpecification" :form-element-setting="dialogUpdateItemSetting" :data-form.sync="dataOfUpdateItem" @send-dialog-form-data="updateItem")
        //- 新增规格
        dialog-form(ref="addSpecification" :form-element-setting="dialogAddItemSetting" :data-form.sync="dataOfAddItem" @send-dialog-form-data="addItem")
        //- 高级查询
        dialog-form(ref="advanceSearch" :form-element-setting="dialogSearchSetting" :data-form.sync="dataOfSearch" @send-dialog-form-data="getItemsList(true,'Advance')")
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { getUserNameNumber } from 'utils/utils';
    import { COMMON_API } from 'common/api/api';
    import DialogForm from 'components/DialogForm.vue';
    import TableShow from 'components/TableShow.vue';

    @Component({
        name: 'Specification',
        components: {
            TableShow,
            DialogForm
        }
    })
    export default class WorkProcedureManage extends Vue {

        $refs: {
            targetInfoList: HTMLFormElement; // 表格数据
            addSpecification: HTMLFormElement; // 新增数据 dialog
            updateSpecification: HTMLFormElement; // 更新数据 dialog
            advanceSearch: HTMLFormElement; // 高级查询 dialog
        }

        unitClassList: Options[]=[] // 单位缓存
        unitClassObject = {}
        largeClassList: Options[]= [] // 大类缓存
        largeClassObject= {}
        targetInfoList: CurrentDataTable[]= []
        multipleSelection: CurrentDataTable[]= []

        tableItemSetting={
            props: {
                // eslint-disable-next-line no-invalid-this
                height: this.mainClientHeight - 70 - 47,
                title: 'TableSpecification'
            },
            data: [
                {
                    type: 'multiple', // 表格元件
                    prop: 'material',
                    headerAlign: 'left',
                    align: 'left',
                    label: '物料', // 表单元件名称
                    minWidth: 300,
                    width: 0, // width 会覆盖 minWidth
                    content: ['materialCode', 'materialName']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'brand',
                    label: '品牌', // 表单元件名称
                    minWidth: 0,
                    width: 100,
                    content: ['brand']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'largeClass',
                    label: '大类', // 表单元件名称
                    minWidth: 0,
                    width: 160,
                    content: ['largeClass'],
                    // eslint-disable-next-line no-invalid-this
                    // transList: this.largeClassObject
                    transFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_CATEGORY'
                                }).then(({ data }) => {
                                const wrapperObject = {};
                                data.data.forEach(item => {
                                    wrapperObject[item.dictCode] = item.dictValue
                                })
                                resolve(wrapperObject)
                            })
                        })
                    }
                },
                {
                    type: 'single', // 表格元件
                    prop: 'boxSpec',
                    label: '箱规格', // 表单元件名称
                    minWidth: 0,
                    width: 70,
                    content: ['boxSpec']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'boxSpecUnit',
                    label: '单位', // 表单元件名称
                    minWidth: 0,
                    width: 70,
                    content: ['boxSpecUnit'],
                    // eslint-disable-next-line no-invalid-this
                    // transList: this.unitClassObject
                    transFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                            dictType: 'COMMON_SPEC_UNIT'
                            }).then(({ data }) => {
                                const wrapperObject = {};
                                data.data.forEach(item => {
                                    wrapperObject[item.dictCode] = item.dictValue
                                })
                                resolve(wrapperObject)
                            })
                        })
                    }
                },
                {
                    type: 'single', // 表格元件
                    prop: 'bottleSpec',
                    label: '瓶规格', // 表单元件名称
                    minWidth: 0,
                    width: 70,
                    content: ['bottleSpec']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'bottleSpecUnit',
                    label: '单位', // 表单元件名称
                    minWidth: 0,
                    width: 70,
                    content: ['bottleSpecUnit'],
                    // eslint-disable-next-line no-invalid-this
                    // transList: this.unitClassObject
                    transFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                            dictType: 'COMMON_SPEC_UNIT'
                            }).then(({ data }) => {
                                const wrapperObject = {};
                                data.data.forEach(item => {
                                    wrapperObject[item.dictCode] = item.dictValue
                                })
                                resolve(wrapperObject)
                            })
                        })
                    }
                },
                {
                    type: 'single', // 表格元件
                    prop: 'changer',
                    label: '维护人', // 表单元件名称
                    minWidth: 0,
                    width: 160,
                    content: ['changer']
                },
                {
                    type: 'button', // 表格元件
                    prop: 'control',
                    label: '操作', // 表单元件名称
                    minWidth: 0,
                    width: 100,
                    control: [{
                            buttonName: '编辑',
                            btn: 'editBtn',
                            icon: 'el-icon-edit',
                            isAuth: 'specEdit'
                        }]
                }
            ]
        }

        // [dialog][setting] 高级查询
        dialogSearchSetting={
            props: {
                labelWidth: 100,
                title: '高级查询'
            },
            data: [
                {
                    type: 'input', // 表单元件类型下拉選單
                    prop: 'materialCode',
                    label: '物料', // 表单元件名称
                    placeholder: '手工录入',
                    rules: []
                },
                {
                    type: 'input',
                    prop: 'brand',
                    label: '品牌',
                    placeholder: '手工录入',
                    rules: []
                },
                {
                    type: 'input',
                    prop: 'boxSpec',
                    label: '箱规格',
                    placeholder: '手工录入',
                    oninput: "value=value.replace(/\D*/g,'')",
                    rules: []
                },
                {
                    type: 'input',
                    prop: 'productSpec',
                    label: '瓶规格',
                    placeholder: '手工录入',
                    oninput: "value=value.replace(/\D*/g,'')",
                    rules: []
                }
            ]
        }

         // [dialog][data] 高级查询
        dataOfSearch= {
            brand: '',
            materialCode: '',
            boxSpec: '',
            productSpec: ''
        }

        // [dialog][setting] 新增规格
        dialogAddItemSetting={
            props: {
                labelWidth: 100,
                title: '新增规格'
            },
            data: [
                {
                    type: 'select:remote',
                    prop: 'material',
                    label: '物料',
                    placeholder: '请输入物料',
                    disabled: false,
                    rules: [
                        { required: true, message: '物料不能为空', trigger: 'blur' }
                    ],
                    remoteMethod: (query) => {
                        return new Promise((resolve) => {
                            COMMON_API.ALLMATERIAL_API({
                                materialTypes: ['ZFER'],
                                material: query
                            }).then(({ data }) => {
                                const tempOptionList = data.data
                                tempOptionList.forEach(item => {
                                    item.optValue = item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName
                                    item.optLabel = item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName
                                })
                                resolve(tempOptionList)
                            })
                        })
                    },
                    linkageProp: ['brand']
                },
                {
                    type: 'input',
                    prop: 'brand',
                    label: '品牌',
                    placeholder: '请先选择物料',
                    disabled: true,
                    rules: [
                        { required: true, message: '品牌不能为空', trigger: 'blur' }
                    ],
                    emitChange: (val, element) => {
                        return new Promise((resolve) => {
                            // eslint-disable-next-line no-invalid-this
                            this.dataOfAddItem.brand = element.optionList.find(item => item.materialCode === val.split(' ')[0]).kondm
                            resolve({ prop: 'brand', value: element.optionList.find(item => item.materialCode === val.split(' ')[0]).kondm })
                        })
                    }
                    // defaultOptionsFn: () => {
                    //     return new Promise((resolve) => {
                    //         resolve()
                    //     })
                    // }
                },
                {
                    type: 'select',
                    prop: 'largeClass',
                    label: '大类',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [
                        { required: true, message: '大类不能为空', trigger: 'blur' }
                    ],
                    // eslint-disable-next-line no-invalid-this
                    // options: this.largeClassList
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_CATEGORY'
                            }).then(({ data }) => {
                                const optionList = data.data
                                optionList.forEach(item => {
                                    // optionList.push({ 'optValue': item.dictCode, 'optLabel': item.dictValue })
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.dictValue)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.dictCode)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'input',
                    prop: 'boxSpec',
                    label: '箱规格',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [
                        { required: true, message: '箱规格不能为空', trigger: 'blur' }
                    ]
                },
                {
                    type: 'select',
                    prop: 'boxSpecUnit',
                    label: '单位',
                    disabled: false,
                    placeholder: '请输入',
                    rules: [
                        { required: true, message: '箱规格单位不能为空', trigger: 'blur' }
                    ],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_SPEC_UNIT'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // optionList.push({ 'optValue': item.dictCode, 'optLabel': item.dictValue })
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.dictValue)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.dictCode)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'input',
                    prop: 'bottleSpec',
                    label: '瓶规格',
                    placeholder: '',
                    disabled: false,
                    rules: []
                },
                {
                    type: 'select',
                    prop: 'bottleSpecUnit',
                    label: '单位',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_SPEC_UNIT'
                            }).then(({ data }) => {
                                const optionList = data.data
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.dictValue)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.dictCode)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                }
            ]
        }


        // [dialog][data] 新增规格
        dataOfAddItem={
            id: '',
            material: '',
            brand: '',
            largeClass: '',
            boxSpec: '',
            boxSpecUnit: '',
            bottleSpec: '',
            bottleSpecUnit: '',
            changer: getUserNameNumber(),
            version: 0,
            materialCode: '',
            materialName: ''
        }

        // [dialog][setting] 编辑规格
        dialogUpdateItemSetting={
            props: {
                labelWidth: 100,
                title: '新增规格'
            },
            data: [
                {
                    type: 'input',
                    prop: 'material',
                    label: '物料',
                    placeholder: '请输入物料',
                    disabled: true,
                    rules: [
                        { required: true, message: '物料不能为空', trigger: 'blur' }
                    ]
                },
                {
                    type: 'input',
                    prop: 'brand',
                    label: '品牌',
                    placeholder: '请先选择物料',
                    disabled: true,
                    rules: [
                        { required: true, message: '品牌不能为空', trigger: 'blur' }
                    ]
                },
                {
                    type: 'select',
                    prop: 'largeClass',
                    label: '大类',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [
                        { required: true, message: '大类不能为空', trigger: 'blur' }
                    ],
                    // eslint-disable-next-line no-invalid-this
                    // options: this.largeClassList
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_CATEGORY'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.dictValue)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.dictCode)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'input',
                    prop: 'boxSpec',
                    label: '箱规格',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [
                        { required: true, message: '箱规格不能为空', trigger: 'blur' }
                    ]
                },
                {
                    type: 'select',
                    prop: 'boxSpecUnit',
                    label: '单位',
                    disabled: false,
                    placeholder: '请输入',
                    rules: [
                        { required: true, message: '箱规格单位不能为空', trigger: 'blur' }
                    ],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_SPEC_UNIT'
                            }).then(({ data }) => {
                                const optionList = data.data
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.dictValue)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.dictCode)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'input',
                    prop: 'bottleSpec',
                    label: '瓶规格',
                    placeholder: '',
                    disabled: false,
                    rules: []
                },
                {
                    type: 'select',
                    prop: 'bottleSpecUnit',
                    label: '单位',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                dictType: 'COMMON_SPEC_UNIT'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // optionList.push({ 'optValue': item.dictCode, 'optLabel': item.dictValue })
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.dictValue)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.dictCode)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'input',
                    prop: 'changer',
                    label: '维护人',
                    placeholder: '',
                    disabled: true,
                    rules: []
                }
            ]
        }

        dataOfUpdateItem: CurrentDataTable={}

        currPage= 1
        pageSize= 10
        totalCount= 1
        checkRules= {
            productSpec: [{ pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }
            ],
            boxSpec: [{ pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }
            ]
        }

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        // async created() {
        //     this.getLargeClass(); // 大类下拉选单
        //     this.getUnit(); // 单位下拉选单
        //     this.getItemsList(); // 获取数据
        // }

        async mounted() {
            await this.getLargeClass(); // 大类下拉选单
            await this.getUnit(); // 单位下拉选单
            await this.getItemsList(); // 获取数据
            await this.$refs.targetInfoList.init();
        }

        // [BTN] 新增
        btnAddItem() {
            this.$nextTick(() => {
                this.$refs.addSpecification.init();
            });
        }

        // [BTN] 高级查询
        btnAdvanceSearch() {
            this.$nextTick(() => {
                this.$refs.advanceSearch.init();
            });
        }

        // [BTN] 删除
        btnRemoveItems() {
            this.multipleSelection = [];
            this.multipleSelection = this.$refs.targetInfoList.getMultipleSelection()
            if (this.multipleSelection.length === 0) {
                this.$warningToast('请选择要删除的规格');
            } else {
                this.$confirm('确认删除规格, 是否继续?', '删除规格', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        COMMON_API.SPECS_REMOVE_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            ids: this.multipleSelection
                        }).then(() => {
                            this.multipleSelection = [];
                            this.$nextTick(() => {
                                this.$successToast('删除成功')
                                this.getItemsList(true, 'normal');
                            });
                        });
                    })
                    .catch();
            }
        }

        // 查询
        getItemsList(haveParas = false, type = 'normal') {
            if (haveParas) {
                this.currPage = 1;
            }
            if (type === 'normal') {
                this.dataOfSearch.brand = '';
                this.dataOfSearch.boxSpec = '';
                this.dataOfSearch.productSpec = '';
            }
            COMMON_API.SPECS_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                boxSpec: this.dataOfSearch.boxSpec.trim(),
                bottleSpec: this.dataOfSearch.productSpec.trim(),
                brand: this.dataOfSearch.brand.trim(),
                material: this.dataOfSearch.materialCode.trim(),
                current: JSON.stringify(this.currPage),
                size: JSON.stringify(this.pageSize)
            }).then(({ data }) => {
                if (haveParas && data.data.records.length === 0) {
                        this.$infoToast('暂无任何内容');
                }
                this.targetInfoList = data.data.records;
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
                this.$refs.targetInfoList.init();
            });
        }

        // 大类下拉
        getLargeClass() {
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_CATEGORY'
                }).then(({ data }) => {
                    this.largeClassObject = {}
                    this.largeClassList = data.data;
                    this.largeClassList.forEach(item => {
                        this.$set(item, 'optLabel', item.dictValue)
                        this.$set(item, 'optValue', item.dictCode)
                        this.largeClassObject[item.dictCode] = item.dictValue
                    })
                });
        }

        // 单位下拉
        getUnit() {
            COMMON_API.DICTQUERY_API({
                dictType: 'COMMON_SPEC_UNIT'
                }).then(({ data }) => {
                    this.unitClassObject = {}
                    this.unitClassList = data.data;
                    this.unitClassList.forEach(item => {
                        this.$set(item, 'optLabel', item.dictValue)
                        this.$set(item, 'optValue', item.dictCode)
                        this.unitClassObject[item.dictCode] = item.dictValue
                    })
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

        addItem(dataForm) {
            COMMON_API.SPECS_INSERT_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                brand: dataForm.brand,
                largeClass: dataForm.largeClass,
                boxSpec: dataForm.boxSpec,
                boxSpecUnit: dataForm.boxSpecUnit,
                bottleSpec: dataForm.bottleSpec,
                bottleSpecUnit: dataForm.bottleSpecUnit,
                materialName: dataForm.material.split(' ')[1],
                materialCode: dataForm.material.split(' ')[0]
            }).then(() => {
                this.$successToast('新增成功')
                this.getItemsList(true, 'normal');
            });
        }

        updateItem(dataForm) {
            console.log(dataForm)
            COMMON_API.SPECS_UPDATE_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                id: dataForm.id,
                brand: dataForm.brand,
                largeClass: dataForm.largeClass,
                boxSpec: dataForm.boxSpec,
                boxSpecUnit: dataForm.boxSpecUnit,
                bottleSpec: dataForm.bottleSpec,
                bottleSpecUnit: dataForm.bottleSpecUnit,
                materialName: dataForm.materialName,
                materialCode: dataForm.materialCode,
                version: dataForm.version
            }).then(() => {
                this.$successToast('编辑成功')
                this.getItemsList(true, 'normal');
            });

        }

        // [BTN] 更新
        btnUpdateItem(dataForm) {
            console.log(dataForm)
            this.dataOfUpdateItem = JSON.parse(JSON.stringify(dataForm))
            COMMON_API.ALLMATERIAL_API({
                materialTypes: ['ZFER'],
                material: dataForm.materialCode
            }).then(({ data }) => {
                const tempOptionList = data.data
                this.$set(this.dataOfUpdateItem, 'material', this.dataOfUpdateItem.materialCode + ' ' + this.dataOfUpdateItem.materialName + ' ' + tempOptionList[0].materialTypeName)
                this.$nextTick(() => {
                    this.$refs.updateSpecification.init();
                });
            })
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
    materialTypeName?: number;
}

interface Options {
    dictCode: string;
    // dictId?: string;
    dictValue: string;
    optValue?: string;
    optLabel?: string;
    // factoryName?: string;
    // id?: string;
}

</script>
<style scoped></style>
