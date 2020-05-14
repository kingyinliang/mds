<template>
    <el-dialog :title="isParasType ? isAddParas ? '修改类型':'新增类型' : isAddParas ? '修改参数':'新增参数'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
        <div style="height: 330px; overflow: auto;">
            <el-form ref="dataForm" :model="dataForm" label-width="125px" :rules="checkRules">
                <el-form-item label="工厂：" prop="factory">
                    <span v-if="!isParasType">{{ dataForm.factoryName }}</span>
                    <el-select v-if="isParasType" v-model="factory" @change="changeFactory">
                        <el-option v-for="sole in factoryList" :key="sole.id" :label="sole.deptName" :value="sole.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="参数类型编码：" prop="dictType">
                    <span v-if="!isParasType">{{ dataForm.dictType }}</span>
                    <el-input v-if="isParasType" v-model.trim="dataForm.dictType" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item label="参数类型名称：" prop="dictName">
                    <span v-if="!isParasType">{{ dataForm.dictName }}</span>
                    <el-input v-if="isParasType" v-model.trim="dataForm.dictName" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item v-if="!isParasType" label="参数编码：" prop="dictCode">
                    <el-input v-model.trim="dataForm.dictCode" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item v-if="!isParasType" label="参数名称：" prop="dictValue">
                    <el-input v-model.trim="dataForm.dictValue" placeholder="手动输入" clearable />
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button class="j_closeBtn" @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="submitDataForm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { COMMON_API } from 'common/api/api';

export default {
    name: 'ParameterAddorUpdate',
    components: {},
    props: {
        factoryList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            factory: '',
            isAddParas: false,
            dataForm: {
                factoryName: '',
                dictType: '',
                dictName: '',
                dictCode: '',
                dictValue: '',
                parentId: ''
            },
            isDialogShow: false,
            isParasType: true, // 类型或参数
            checkRules: {
                factoryName: [
                    { required: true, message: '请选择工厂', trigger: 'blur' }
                ],
                dictType: [
                    { required: true, message: '请输入参数类型编码', trigger: 'blur' },
                    { pattern: /^[A-Z_0-9]+$/, message: '需为大写字母', trigger: 'blur' }
                ],
                dictName: [
                    { required: true, message: '请输入参数类型名称', trigger: 'blur' }
                ],
                dictCode: [
                    { required: true, message: '请输入参数编码', trigger: 'blur' }
                ],
                dictValue: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            }
        };
    },
    computed: {},
    mounted() {
        //
    },
    methods: {
        init(parasLevel, parentItem, targetItem) {

            this.factoryList.forEach(item => {
                if (item.deptName === parentItem.factoryName) {
                    this.factory = item.id
                }
            })

            if (parasLevel === 'type') {
                this.isParasType = true;
                if (JSON.stringify(parentItem) !== '{}') {
                    this.isAddParas = true;
                    console.log('类型编辑')
                    this.dataForm = {
                        factoryName: parentItem.factoryName,
                        dictType: parentItem.dictType,
                        dictName: parentItem.dictName,
                        dictCode: '',
                        dictValue: '',
                        parentId: parentItem.id
                    }
                } else {
                    this.isAddParas = false;
                    console.log('类型新增')
                    this.dataForm = {
                        factoryName: '',
                        dictType: '',
                        dictName: '',
                        dictCode: '',
                        dictValue: '',
                        parentId: ''
                    }
                }
            } else {
                this.isParasType = false;
                if (JSON.stringify(targetItem) !== '{}') {
                    this.isAddParas = true;
                    console.log('参数编辑')
                    this.dataForm = targetItem;
                    this.dataForm.parentId = parentItem.id
                    this.dataForm.dictType = parentItem.dictType
                    this.dataForm.dictName = parentItem.dictName
                } else {
                    this.isAddParas = false;
                    console.log('参数新增')
                    this.dataForm = {
                        factoryName: parentItem.factoryName,
                        dictType: parentItem.dictType,
                        dictName: parentItem.dictName,
                        dictCode: '',
                        dictValue: '',
                        parentId: parentItem.id
                    }
                }
            }
            this.isDialogShow = true;
        },
        submitDataForm() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.isParasType) {
                        if (!this.isAddParas) {
                            console.log('类型新增请求送出')
                            COMMON_API.DICTIONARY_INSERT_API({
                                factory: this.factory,
                                dictName: this.dataForm.dictName,
                                dictType: this.dataForm.dictType
                            }).then(() => {
                                this.$emit('refreshParentDataList');
                                this.dataForm = {};
                                this.isDialogShow = false;
                            });
                        } else {
                            console.log('类型编辑请求送出')
                            COMMON_API.DICTIONARY_UPDATE_API({
                                factory: this.factory,
                                dictName: this.dataForm.dictName,
                                dictType: this.dataForm.dictType,
                                id: this.dataForm.parentId
                            }).then(() => {
                                this.$emit('refreshParentDataList');
                                this.dataForm = {};
                                this.isDialogShow = false;
                            });
                        }
                    } else {
                        console.log('我是参数')
                        if (!this.isAddParas) {
                            console.log('参数新增请求送出')
                            COMMON_API.DICTIONARY_ITEM_INSERT_API({
                                factory: this.factory,
                                dictCode: this.dataForm.dictCode,
                                dictValue: this.dataForm.dictValue,
                                dictId: this.dataForm.parentId
                            }).then(() => {
                                this.$emit('refreshChildDataList')
                                this.dataForm = {};
                                this.isDialogShow = false;
                            });
                        } else {
                            console.log('参数編輯请求送出')
                            console.log(this.dataForm);
                            COMMON_API.DICTIONARY_ITEM_UPDATE_API({
                                factory: this.factory,
                                dictCode: this.dataForm.dictCode,
                                dictValue: this.dataForm.dictValue,
                                dictId: this.dataForm.dictId,
                                id: this.dataForm.parentId
                            }).then(() => {
                                this.$emit('refreshChildDataList');
                                this.dataForm = {};
                                this.isDialogShow = false;
                            });
                        }
                    }
                }
            })
        },
        changeFactory(value) {
            const factory = this.factoryList.find(item => item.id === value);
            if (factory) {
                this.dataForm.factoryName = factory.deptName;
            }
        },
        // 重置
        closeDialog() {
            document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
            this.dataForm.factoryName = '';
            this.$refs.dataForm.resetFields();
            this.isDialogShow = false;
        }
    }
};
</script>

<style scoped></style>
