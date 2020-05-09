<template>
    <el-dialog :title="isParasType ? '新增类型' : isAddParas ? '新增参数':'修改参数'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
        <div style="height: 330px; overflow: auto;">
            <el-form ref="dataForm" :model="dataForm" label-width="125px" :rules="checkRules">
                <el-form-item label="工厂：" prop="factory">
                    <span v-if="!isParasType">{{ dataForm.factory }}</span>
                    <el-select v-if="isParasType" v-model="dataForm.factory" @change="changeFactory">
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
                <el-form-item label="参数编码：" prop="dictCode">
                    <el-input v-model.trim="dataForm.dictCode" placeholder="手动输入" clearable />
                </el-form-item>
                <el-form-item label="参数名称：" prop="dictValue">
                    <el-input v-model.trim="dataForm.dictValue" placeholder="手动输入" clearable />
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
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
            isAddParas: false,
            dataForm: {
                factory: '',
                dictType: '',
                dictName: '',
                dictCode: '',
                dictValue: ''
            },
            isDialogShow: false,
            isParasType: true,
            submitType: true,
            checkRules: {
                factory: [
                    { required: true, message: '请选择工厂', trigger: 'blur' }
                ],
                dictType: [
                    { required: true, message: '请输入参数类型编码', trigger: 'blur' },
                    { pattern: /^[A-Z_]+$/, message: '需为大写字母', trigger: 'blur' }
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
    methods: {
        init(parasLevel, parentItem, targetItem) {
            if (parasLevel === 'type') {
                this.isParasType = true;
                    this.dataForm = {
                        factory: '',
                        dictType: '',
                        dictName: '',
                        dictCode: '',
                        dictValue: ''
                    }
            } else {
                this.isParasType = false;
                if (JSON.stringify(targetItem) !== '{}') {
                    this.isAddParas = false;
                    this.dataForm = targetItem;
                } else {
                    this.isAddParas = true;
                    this.dataForm = {
                        factory: parentItem.factory,
                        dictType: parentItem.dictType,
                        dictName: parentItem.dictName,
                        dictCode: '',
                        dictValue: ''
                    }
                }
            }
            this.isDialogShow = true;
        },
        submitDataForm() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.isParasType) {
                        console.log('我是类型')
                            if (this.isAddParas) {
                                console.log('我是类型新增')
                                COMMON_API.DICTIONARY_INSERT_API({
                                    factory: this.dataForm.factory,
                                    dictName: this.dataForm.dictName,
                                    dictType: this.dataForm.dictType
                                }).then(() => {
                                        this.dataForm = {};
                                        this.$successTost('操作成功');
                                        this.isDialogShow = false;
                                        this.$emit('refreshDataList');
                                });
                            } else {
                                console.log('我是类型編輯')
                                COMMON_API.DICTIONARY_UPDATE_API({
                                    factory: this.dataForm.factory,
                                    dictName: this.dataForm.dictName,
                                    dictType: this.dataForm.dictType
                                }).then(() => {
                                        this.dataForm = {};
                                        this.$successTost('操作成功');
                                        this.isDialogShow = false;
                                        this.$emit('refreshDataList');
                                });
                            }

                    } else {
                        console.log('我是参数')
                            if (this.isAddParas) {
                                console.log('我是参数新增')
                                COMMON_API.DICTIONARY_ITEM_INSERT_API({
                                    factory: this.dataForm.factory,
                                    dictCode: this.dataForm.dictCode,
                                    dictValue: this.dataForm.dictValue,
                                    dictId: this.dataForm.id
                                }).then(() => {
                                        this.dataForm = {};
                                        this.$successTost('操作成功');
                                        this.isDialogShow = false;
                                        this.$emit('refreshDataList');
                                });
                            } else {
                                console.log('我是参数編輯')
                                COMMON_API.DICTIONARY_ITEM_UPDATE_API({
                                    factory: this.dataForm.factory,
                                    dictCode: this.dataForm.dictCode,
                                    dictValue: this.dataForm.dictValue,
                                    dictId: this.dataForm.id
                                }).then(() => {
                                        this.dataForm = {};
                                        this.$successTost('操作成功');
                                        this.isDialogShow = false;
                                        this.$emit('refreshDataList');
                                });
                            }
                    }
                }
            })
        },
        changeFactory(value) {
            const factory = this.factoryList.find(item => item.deptId === value);
            if (factory) {
                this.dataForm.deptName = factory.deptName;
            }
        },
        // 重置
        closeDialog() {
            this.isDialogShow = false
            this.$refs.dataForm.resetFields();
        }
    }
};
</script>

<style scoped></style>
