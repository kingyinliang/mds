<template>
    <div class="header_main">
        <query-table ref="queryTable" :queryAuth="'ste:material:list'" :showOperationColumn="true" :operationColumnWidth="70" :showSelectColumn="true" :listInterface="listInterface" :queryFormData="queryFormData" :column="column">
            <template slot="mds-button">
                <el-button v-if="isAuth('ste:material:dataInsert')" type="primary" size="small" @click="addOrupdate()">
                    新增
                </el-button>
                <el-button v-if="isAuth('ste:material:del')" type="danger" size="small" @click="remove">
                    批量删除
                </el-button>
            </template>
            <template slot="operation_column" slot-scope="{ scope }">
                <el-button v-if="isAuth('ste:material:dataInsert')" class="ra_btn" type="primary" round size="mini" @click="addOrupdate(scope.row)">
                    编辑
                </el-button>
            </template>
        </query-table>
        <el-dialog :visible.sync="AddDialogTableVisible" :closeOnClickModal="false" width="550px" customClass="dialog__class">
            <div slot="title">
                {{ addAndupdate ? '新增调配物料' : '修改调配物料' }}
            </div>
            <el-form ref="AddDialogTable" :model="AddDialogTable" labelWidth="100px" size="small">
                <el-form-item label="工厂：">
                    <el-select v-model="AddDialogTable.factory" placeholder="请选择" style="width: 100%;">
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产物料：">
                    <el-select
                        v-model="AddDialogTable.productionMaterielCode"
                        filterable
                        placeholder="请选择"
                        style="width: 100%;"
                        @change="
                            e => {
                                AddDialogTable.productionMaterielName = productionMaterielCode.filter(it => it.MATERIAL_CODE === e)[0].MATERIAL_NAME;
                            }
                        "
                    >
                        <el-option v-for="(item, index) in productionMaterielCode" :key="index" :label="item.MATERIAL_CODE + ' ' + item.MATERIAL_NAME" :value="item.MATERIAL_CODE" />
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-row v-for="(item, index) in AddDialogTable.useMateriel" :key="index" style="width: 510px;">
                        <el-col style="width: 290px;">
                            <el-form-item label="领用物料：">
                                <el-select
                                    v-model="item.useMaterielCode"
                                    filterable
                                    placeholder="请选择"
                                    style="width: 100%;"
                                    @change="e => {item.useMaterielName = useMaterielCode.filter(it => it.MATERIAL_CODE === e)[0].MATERIAL_NAME;}"
                                >
                                    <el-option v-for="(subItem, subIndex) in useMaterielCode" :key="subIndex" :label="subItem.MATERIAL_CODE + ' ' + subItem.MATERIAL_NAME" :value="subItem.MATERIAL_CODE" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col style="width: 180px;">
                            <el-form-item label="BL_LY标识：" labelWidth="90px">
                                <el-select v-model="item.type" placeholder="请选择" style="width: 100%;">
                                    <el-option v-for="(sunItem, subIndex) in queryFormData[3].options" :key="subIndex" :label="sunItem.label" :value="sunItem.value" />
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col style="width: 32px; margin-left: 8px;">
                            <el-button v-if="index === 0" type="primary" icon="el-icon-plus" circle size="small" @click="addUseMateriel" />
                            <el-button v-else type="danger" icon="el-icon-delete" circle size="small" @click="delUseMateriel(index)" />
                        </el-col>
                    </el-row>
                </el-row>
                <el-form-item label="备注：">
                    <el-input v-model="AddDialogTable.remark" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item label="操作人：" />
                <el-form-item label="操作时间：" />
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="AddDialogTableVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { BASICDATA_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            AddDialogTableVisible: false,
            addAndupdate: false,
            AddDialogTable: {},
            factory: [],
            productionMaterielCode: [],
            useMaterielCode: [],
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    },
                    linkageProp: ['productionMaterielCode', 'useMaterielCode']
                },
                {
                    type: 'select',
                    label: '生产物料',
                    prop: 'productionMaterielCode',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', { factory: val });
                    },
                    filterable: true,
                    defaultValue: '',
                    resVal: {
                        resData: 'materielList.productionMateriel',
                        label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
                        value: 'MATERIAL_CODE'
                    }
                },
                {
                    type: 'select',
                    label: '领用物料',
                    prop: 'useMaterielCode',
                    optionsFn: val => {
                        return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', { factory: val });
                    },
                    defaultValue: '',
                    filterable: true,
                    resVal: {
                        resData: 'materielList.useMateriel',
                        label: ['MATERIAL_CODE', 'MATERIAL_NAME'],
                        value: 'MATERIAL_CODE'
                    }
                },
                {
                    type: 'select',
                    label: '标识',
                    prop: 'type',
                    options: [
                        { label: 'BL', value: 'BL' },
                        { label: 'LY', value: 'LY' },
                        { label: 'BL_LY', value: 'BL_LY' }
                    ],
                    resVal: {
                        label: ['label'],
                        value: 'value'
                    }
                }
            ],
            listInterface: params => {
                return this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_LIST}`, 'POST', params);
            },
            column: [
                {
                    prop: 'factoryName',
                    label: '工厂',
                    width: '100'
                },
                {
                    prop: 'productionMaterielCode',
                    label: '生产物料',
                    formatter: row => {
                        return row.productionMaterielCode + ' ' + row.productionMaterielName;
                    }
                },
                {
                    prop: 'useMaterielCode',
                    label: '领用物料',
                    formatter: row => {
                        return row.useMaterielCode + ' ' + row.useMaterielName;
                    }
                },
                {
                    prop: 'type',
                    label: 'BL与LY',
                    width: '100'
                },
                {
                    prop: 'remark',
                    label: '备注',
                    width: '100'
                    // formatter: (row, col, value) => {
                    //   let h = this.$createElement
                    //   return h('el-input', {
                    //     attrs: {
                    //       size: 'small'
                    //     }
                    //   })
                    // }
                },
                {
                    prop: 'changer',
                    label: '操作人员',
                    width: '100'
                },
                {
                    prop: 'changed',
                    label: '操作时间'
                }
            ]
        };
    },
    computed: {},
    watch: {
        'AddDialogTable.factory'(n) {
            this.getMeateriel(n);
        }
    },
    methods: {
        getMeateriel(val) {
            this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_SELECT_LIST}`, 'POST', {
                factory: val
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.productionMaterielCode = data.materielList.productionMateriel;
                    this.useMaterielCode = data.materielList.useMateriel;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        addOrupdate(row) {
            this.AddDialogTableVisible = true;
            if (row) {
                this.addAndupdate = false;
                this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_ROWLIST}`, 'POST', {
                    factory: row.factory,
                    productionMaterielCode: row.productionMaterielCode
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.AddDialogTable = {
                            id: row.id,
                            factory: row.factory,
                            productionMaterielCode: row.productionMaterielCode,
                            productionMaterielName: row.productionMaterielName,
                            useMateriel: data.page,
                            remark: row.remark
                        };
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            } else {
                this.addAndupdate = true;
                this.AddDialogTable = {
                    id: '',
                    factory: '',
                    productionMaterielCode: '',
                    productionMaterielName: '',
                    useMateriel: [
                        {
                            useMaterielCode: '',
                            useMaterielName: '',
                            type: ''
                        }
                    ],
                    remark: ''
                };
            }
            this.factory = this.$refs.queryTable.optionLists.factory;
            this.productionMaterielCode = this.$refs.queryTable.optionLists.productionMaterielCode;
            this.useMaterielCode = this.$refs.queryTable.optionLists.useMaterielCode;
        },
        submitForm() {
            this.$refs.AddDialogTable.validate(valid => {
                if (valid) {
                    // if (!this.addAndupdate) {
                    //   this.AddDialogTable.useMateriel = [{
                    //     useMaterielCode: this.AddDialogTable.useMaterielCode,
                    //     useMaterielName: this.AddDialogTable.useMaterielName,
                    //     type: this.AddDialogTable.type
                    //   }]
                    // }
                    this.$http(`${!this.addAndupdate ? BASICDATA_API.DEPLOY_MATERIAL_SAVE : BASICDATA_API.DEPLOY_MATERIAL_UPDATE}`, 'POST', this.AddDialogTable).then(({ data }) => {
                        if (data.code === 0) {
                            this.AddDialogTableVisible = false;
                            this.$success_SHINHO('操作成功');
                            this.$refs.queryTable.GetDataList();
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                }
            });
        },
        remove() {
            if (this.$refs.queryTable.multipleSelection.length > 0) {
                this.$confirm('正在执行删除操作, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(`${BASICDATA_API.DEPLOY_MATERIAL_DEL}`, 'POST', this.$refs.queryTable.multipleSelection).then(({ data }) => {
                        if (data.code === 0) {
                            this.$success_SHINHO('操作成功');
                            this.$refs.queryTable.GetDataList();
                        } else {
                            this.$error_SHINHO(data.msg);
                        }
                    });
                });
            } else {
                this.$warningTost('请选择数据');
            }
        },
        addUseMateriel() {
            this.AddDialogTable.useMateriel.push({
                id: '',
                useMaterielCode: '',
                useMaterielName: '',
                type: ''
            });
        },
        delUseMateriel(index) {
            this.AddDialogTable.useMateriel.splice(index, 1);
        }
    }
};
</script>

<style scoped></style>
