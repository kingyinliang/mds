<template lang="pug">
    div.header_main
        mds-card(title="报工中间表" :name="'spe'" :pack-up="false" style="margin-bottom: 0; background: #fff;")
            template(slot="titleBtn")
                el-row(style="float: right;")
                    el-form(:inline="true" :model="controllableForm" size="small" label-width="68px" class="topforms2" @submit.native.prevent)
                        el-form-item
                            //- el-input(v-model="controllableForm.workShop" placeholder="生产车间" suffix-icon="el-icon-search" clearable @clear="getItemsList" @blur="controllableForm.workShop===''?getItemsList():false" @change="dataOfSearch.productMaterial=controllableForm.workShop")
                            el-select(v-model="controllableForm.workShop" placeholder="生产车间" clearable @clear="clearSearchKeyWords")
                                el-option(v-for="(opt, optIndex) in workShopList" :key="opt+optIndex" :label="opt.optLabel" :value="opt.optValue" )
                        el-form-item(style="height: 32px;")
                            el-button(type="primary" size="small" @click="getItemsList(true,'normal')") 查询
                            el-button(type="primary" size="small" @click="btnAdvanceSearch") 高级查询
                            el-button(type="primary" size="small" @click="btnAddItem") 新增
                            el-button(type="danger" size="small" @click="btnRemoveItems" v-if="tableData.length!==0" :disabled="chechDeleteList===0") 批量删除
            //- show table
            table-show(ref="showTable" :table-element-setting="tableItemSetting" :target-table.sync="tableData" :check-delete.sync="chechDeleteList" @updateItem="btnUpdateItem" @removeItem="")
            el-pagination(v-if="tableData.length!==0" :current-page="currPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange")
        //- 新增工序
        dialog-form(ref="addWorkProcedure" :form-element-setting="dialogAddItemSetting" :data-form.sync="dataOfAddItem" @send-dialog-form-data="addItem")
        //- 编辑工序
        dialog-form(ref="updateWorkProcedure" :form-element-setting="dialogEditItemSetting" :data-form.sync="dataOfEditItem" @send-dialog-form-data="updateItem")
        //- 高级查询
        dialog-form(ref="advanceSearch" :form-element-setting="dialogSearchSetting" :data-form.sync="controllableForm" @send-dialog-form-data="getItemsListFromDialog")
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';
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

        currPage= 1
        pageSize= 10
        totalCount= 1

        nowSearchModle='normal'
        chechDeleteList=0 // 删除都选统计

        controllableForm= {
            jobBookingProcess: '',
            material: '',
            productProcess: '',
            workShop: ''
        }

        workShopList: Options[]= [] // 车间缓存
        workShopListObject = {}

        tableItemSetting={
            props: {
                // eslint-disable-next-line no-invalid-this
                height: this.mainClientHeight - 70 - 47,
                title: 'TableWorkProcedure'
            },
            data: [
                {
                    type: 'single', // 表格元件
                    prop: 'workShop',
                    headerAlign: 'center',
                    align: 'left',
                    label: '生产车间', // 表单元件名称
                    minWidth: 0,
                    width: 160, // width 会覆盖 minWidth
                    content: ['workShop'],
                    transList: {}
                    // transFn: () => {
                    //     return new Promise((resolve) => {
                    //         COMMON_API.ORG_QUERY_WORKSHOP_API({
                    //             factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    //             deptType: ['WORK_SHOP'],
                    //             deptName: '制曲'
                    //         }).then(({ data }) => {
                    //             const wrapperObject = {};
                    //             data.data.forEach(item => {
                    //                 wrapperObject[item.deptCode] = item.deptName
                    //             })
                    //             resolve(wrapperObject)
                    //         })
                    //     })
                    // }
                },
                {
                    type: 'multiple', // 表格元件
                    prop: 'material',
                    label: '物料', // 表单元件名称
                    minWidth: 260,
                    width: 0,
                    content: ['materialCode', 'materialName']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'jobBookingProcess',
                    label: '报工工序', // 表单元件名称
                    minWidth: 0,
                    width: 160,
                    content: ['jobBookingProcess']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'productProcessName',
                    label: '生产工序', // 表单元件名称
                    minWidth: 0,
                    width: 180,
                    content: ['productProcessName']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'remark',
                    label: '备注', // 表单元件名称
                    minWidth: 0,
                    width: 260,
                    content: ['remark']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'changer',
                    label: '操作人', // 表单元件名称
                    minWidth: 0,
                    width: 160,
                    content: ['changer']
                },
                {
                    type: 'single', // 表格元件
                    prop: 'changed',
                    label: '操作时间', // 表单元件名称
                    minWidth: 0,
                    width: 170,
                    content: ['changed']
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
                            icon: '',
                            isAuth: 'specEdit'
                        }]
                }
            ]
        }

        tableData: CurrentDataTable[]=[]

        // [dialog][setting] 高级查询
        dialogSearchSetting={
            props: {
                labelWidth: 120,
                title: '高级查询'
            },
            data: [
                {
                    type: 'select', // 表单元件类型下拉選單
                    prop: 'workShop',
                    label: '生产车间', // 表单元件名称
                    labelWidth: 120,
                    placeholder: '请选择',
                    rules: [],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_WORKSHOP_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                deptType: ['WORK_SHOP'],
                                deptName: '制曲'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.deptName)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.deptCode)
                                })
                                resolve(optionList)
                            })
                        })
                    },
                    linkageProp: ['productProcess']
                },
                {
                    type: 'input',
                    prop: 'material',
                    label: '生产物料',
                    labelWidth: 120,
                    placeholder: '请输入物料编码或者物料描述',
                    rules: []
                },
                {
                    type: 'select',
                    prop: 'jobBookingProcess',
                    label: '报工工序',
                    labelWidth: 120,
                    placeholder: '请选择',
                    rules: [],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                dictType: 'COMMON_PROCEDURE'
                                }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', `${item.dictValue}`)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', `${item.dictCode}`)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'select',
                    prop: 'productProcess',
                    label: '生产工序',
                    labelWidth: 120,
                    placeholder: '请选择',
                    rules: [],
                    emitChange: (val) => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_CHILDREN_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                parentId: val || '',
                                deptType: 'PROCESS'
                            }).then(({ data }) => {
                                    const optionList = data.data;
                                    optionList.forEach(item => {
                                        // eslint-disable-next-line no-invalid-this
                                        this.$set(item, 'optLabel', `${item.deptName}`)
                                        // eslint-disable-next-line no-invalid-this
                                        this.$set(item, 'optValue', `${item.deptCode}`)
                                    })
                                    resolve(optionList)
                            })
                        })
                    }
                }
            ]
        }


         // [dialog][data] 高级查询
        // dataOfSearch={
        //     workShop: '',
        //     material: '',
        //     jobBookingProcess: '',
        //     productProcess: ''
        // }


        // [dialog][setting] 新增工序
            dialogAddItemSetting={
            props: {
                labelWidth: 120,
                title: '新增报工'
            },
            data: [
                {
                    type: 'select',
                    prop: 'workShop',
                    label: '生产车间',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [
                        { required: true, message: '请选择车间', trigger: 'change' }
                    ],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_WORKSHOP_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                deptType: ['WORK_SHOP'],
                                deptName: '制曲'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', item.deptName)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', item.deptCode)
                                })
                                resolve(optionList)
                            })
                        })
                    },
                    linkageProp: ['productProcess']
                },
                {
                    type: 'select',
                    prop: 'material',
                    label: '生产物料',
                    placeholder: '请选择',
                    disabled: false,
                    rules: [
                        { required: true, message: '请选择生产物料', trigger: 'change' }
                    ],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.SEARCH_MATERIAL_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                materialType: 'ZHAL'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', `${item.materialCode} ${item.materialName}`)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', `${item.materialCode}&${item.materialName}`)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'select',
                    prop: 'jobBookingProcess',
                    label: '报工工序',
                    placeholder: '请選擇报工工序',
                    disabled: false,
                    rules: [
                        { required: true, message: '请選擇报工工序', trigger: 'change' }
                    ],
                    defaultOptionsFn: () => {
                        return new Promise((resolve) => {
                            COMMON_API.DICTQUERY_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                dictType: 'COMMON_PROCEDURE'
                            }).then(({ data }) => {
                                const optionList = data.data;
                                optionList.forEach(item => {
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optLabel', `${item.dictValue}`)
                                    // eslint-disable-next-line no-invalid-this
                                    this.$set(item, 'optValue', `${item.dictCode}`)
                                })
                                resolve(optionList)
                            })
                        })
                    }
                },
                {
                    type: 'select',
                    prop: 'productProcess',
                    label: '生产工序',
                    placeholder: '请選擇生产工序',
                    rules: [
                        { required: true, message: '请選擇生产工序', trigger: 'change' }
                    ],
                    emitChange: (val) => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_CHILDREN_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                parentId: val || '',
                                deptType: 'PROCESS'
                            }).then(({ data }) => {
                                    const optionList = data.data;
                                    optionList.forEach(item => {
                                        // eslint-disable-next-line no-invalid-this
                                        this.$set(item, 'optLabel', `${item.deptName}`)
                                        // eslint-disable-next-line no-invalid-this
                                        this.$set(item, 'optValue', `${item.deptCode}`)
                                    })
                                    resolve(optionList)
                            })
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
                    label: '操作人'
                },
                {
                    type: 'text',
                    prop: 'changed',
                    label: '操作时间'
                }
            ]
        }

        // [dialog][data] 新增工序
        dataOfAddItem={
            workShop: '',
            productMaterial: '',
            jobBookingProcess: '',
            productProcess: '',
            material: '',
            materialCode: '',
            materialName: '',
            remark: '',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }


        // [dialog][setting] 编辑工序
        dialogEditItemSetting={
            props: {
                labelWidth: 100,
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
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.ORG_QUERY_WORKSHOP_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            deptType: ['WORK_SHOP'],
                            deptName: '制曲'
                        }).then(({ data }) => {
                            const optionList = data.data;
                            optionList.forEach(item => {
                                // eslint-disable-next-line no-invalid-this
                                this.$set(item, 'optLabel', `${item.deptName}`)
                                // eslint-disable-next-line no-invalid-this
                                this.$set(item, 'optValue', `${item.deptCode}`)

                            })
                            resolve(optionList)
                        })
                    })
                },
                linkageProp: ['productProcess']
            },
            {
                type: 'select',
                prop: 'material',
                label: '生产物料',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择生产物料', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.SEARCH_MATERIAL_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            materialType: 'ZHAL'
                        }).then(({ data }) => {
                            const optionList = data.data;
                            optionList.forEach(item => {
                                // eslint-disable-next-line no-invalid-this
                                this.$set(item, 'optLabel', `${item.materialCode} ${item.materialName}`)
                                // eslint-disable-next-line no-invalid-this
                                this.$set(item, 'optValue', `${item.materialCode}&${item.materialName}`)
                            })
                            resolve(optionList)
                        })
                    })
                }
            },
            {
                type: 'select',
                prop: 'jobBookingProcess',
                label: '报工工序',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择报工工序', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.DICTQUERY_API({
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            dictType: 'COMMON_PROCEDURE'
                        }).then(({ data }) => {
                            const optionList = data.data;
                            optionList.forEach(item => {
                                // eslint-disable-next-line no-invalid-this
                                this.$set(item, 'optLabel', `${item.dictValue}`)
                                // eslint-disable-next-line no-invalid-this
                                this.$set(item, 'optValue', `${item.dictCode}`)
                            })
                            resolve(optionList)
                        })
                    })
                }
            },
            {
                type: 'select',
                prop: 'productProcess',
                label: '生产工序',
                placeholder: '请选择',
                rules: [
                    { required: true, message: '请选择生产工序', trigger: 'change' }
                ],
                emitChange: (val) => {
                        return new Promise((resolve) => {
                            COMMON_API.ORG_QUERY_CHILDREN_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                parentId: val || '',
                                deptType: 'PROCESS'
                            }).then(({ data }) => {
                                    const optionList = data.data;
                                    optionList.forEach(item => {
                                        // eslint-disable-next-line no-invalid-this
                                        this.$set(item, 'optLabel', `${item.deptName}`)
                                        // eslint-disable-next-line no-invalid-this
                                        this.$set(item, 'optValue', `${item.deptCode}`)
                                    })
                                    resolve(optionList)
                            })
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
        dataOfEditItem={}

        async mounted() {
            await this.getWorkShop()
            this.tableItemSetting.data[0].transList = this.workShopListObject
            this.$refs.showTable.init();
            this.getItemsList();
        }

        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        clearSearchKeyWords() {
            this.controllableForm = {
                jobBookingProcess: '',
                material: '',
                productProcess: '',
                workShop: ''
            }
            this.getItemsList()
        }

         // from dialog
        addItem(dataForm) {

            KOJI_API.WORKPROCEDURE_INSERT_API({
                workShop: dataForm.workShop,
                jobBookingProcess: dataForm.jobBookingProcess,
                productProcess: dataForm.productProcess,
                materialCode: dataForm.material.split('&')[0],
                materialName: dataForm.material.split('&')[1],
                remark: dataForm.remark
            }).then(() => {
                this.$successToast('新增成功')
                this.getItemsList(true, 'normal');
            });
        }

        // from dialog
        updateItem(dataForm) {
            console.log('dataForm')
            console.log(dataForm)
            KOJI_API.WORKPROCEDURE_UPDATE_API({
                id: dataForm.id,
                jobBookingProcess: dataForm.jobBookingProcess,
                materialCode: dataForm.material.split('&')[0],
                materialName: dataForm.material.split('&')[1],
                productProcess: dataForm.productProcess,
                remark: dataForm.remark,
                workShop: dataForm.workShop
            }).then(() => {
                this.$successToast('编辑成功')
                this.getItemsList(true, 'normal');
            });
        }

        getItemsList(haveParas = false, type = 'normal') {

            if (haveParas) {
                this.currPage = 1;
            }
            if (type === 'normal') {
                this.nowSearchModle = 'normal'
                this.controllableForm.jobBookingProcess = ''
                this.controllableForm.productProcess = ''
                this.controllableForm.material = ''
            }
            KOJI_API.WORKPROCEDURE_QUERY_API({
                workShop: this.controllableForm.workShop,
                material: this.controllableForm.material,
                jobBookingProcess: this.controllableForm.jobBookingProcess,
                productProcess: this.controllableForm.productProcess,
                current: this.currPage,
                size: this.pageSize
            }).then(({ data }) => {
                if (haveParas && data.data.records.length === 0) {
                    this.$infoToast('暂无任何内容');
                }
                this.tableData = data.data.records;
                this.currPage = data.data.current;
                this.pageSize = data.data.size;
                this.totalCount = data.data.total;
            });
        }

        getItemsListFromDialog() {
            this.nowSearchModle = 'advance'
            this.getItemsList(true, 'advance')
        }

        // [BTN] 新增
        btnAddItem() {
            this.dataOfAddItem = {
                workShop: '',
                productMaterial: '',
                jobBookingProcess: '',
                productProcess: '',
                material: '',
                materialCode: '',
                materialName: '',
                remark: '',
                changer: getUserNameNumber(),
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            this.$nextTick(() => {
                this.$refs.addWorkProcedure.init();
            });
        }

        // [BTN] 修改
        btnUpdateItem(data) {
            this.dataOfEditItem = data
            this.$set(this.dataOfEditItem, 'material', `${data.materialCode} ${data.materialName}`)

            this.$nextTick(() => {
                this.$refs.updateWorkProcedure.init();
            });
        }

        // [btn] 批量删除
        btnRemoveItems() {
            const tempMultipleSelection = this.$refs.showTable.getMultipleSelection()
            if (tempMultipleSelection.length === 0) {
                this.$warningToast('请选择要删除的条目');
            } else {
                this.$confirm('确认删除, 是否继续?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        KOJI_API.WORKPROCEDURE_DELETE_API(tempMultipleSelection).then(() => {
                            this.$successToast('刪除成功')
                            this.$nextTick(() => {
                                this.getItemsList();
                            });
                        });
                    })
                    .catch();
            }
        }

        // 车间下拉
        getWorkShop() {
            return new Promise(resolve => {
                COMMON_API.ORG_QUERY_WORKSHOP_API({
                    factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                    deptType: ['WORK_SHOP'],
                    deptName: '制曲'
                }).then(({ data }) => {
                const optionList = data.data;
                        this.workShopListObject = {}
                        optionList.forEach(item => {
                            this.$set(item, 'optLabel', `${item.deptName}`)
                            this.$set(item, 'optValue', `${item.deptCode}`)
                            this.workShopListObject[item.deptCode] = item.deptName
                        })
                        this.workShopList = optionList
                        resolve()
                    })
            })
        }


        // [BTN] 高级查询
        btnAdvanceSearch() {
            this.$nextTick(() => {
                this.$refs.advanceSearch.init();
            });
        }

        // 改变每页条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.getItemsList(false, this.nowSearchModle);
        }

        // 跳转页数
        handleCurrentChange(val) {
            this.currPage = val;
            this.getItemsList(false, this.nowSearchModle);
        }
    }

interface CurrentDataTable {
    changed: Date;
    changer: string;
    factory: string;
    id: string;
    jobBookingProcess: string;
    materialCode: string;
    materialName: string;
    productProcess: string;
    remark: string;
    workShop: string;
}

interface Options {
    dictCode: string;
    dictId?: string;
    dictValue: string;
    factoryName?: string;
    id?: string;
}

</script>

<style lang="sass" scoped></style>
