<template>
    <el-dialog :title="targetID ? '修改规格信息' : '新增规格'" :close-on-click-modal="false" :visible.sync="isDialogShow" @close="closeDialog">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="checkRules" label-width="100px" size="small">
            <el-form-item label="物料：" prop="material">
                <el-select v-if="!targetID" v-model="dataForm.material" filterable placeholder="请选择" style="width: 100%;" @change="setBrand">
                    <el-option v-for="item in serchSpecList" :key="item.id" :label="item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName" :value="item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName" />
                </el-select>
                <el-select v-else v-model="dataForm.material" filterable placeholder="请选择" style="width: 100%;" disabled @change="setBrand">
                    <el-option v-for="item in serchSpecList" :key="item.id" :label="item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName" :value="item.materialCode + ' ' + item.materialName + ' ' + item.materialTypeName" />
                </el-select>
            </el-form-item>
            <el-form-item label="品牌：" prop="brand">
                <el-input v-model="dataForm.brand" placeholder="请先选择物料" disabled />
            </el-form-item>
            <el-form-item label="大类：" prop="largeClass">
                <el-select v-model="dataForm.largeClass" filterable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in largeClass" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="箱规格：" prop="boxSpec">
                <el-input v-model="dataForm.boxSpec" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="单位：" prop="boxSpecUnit">
                <el-select v-model="dataForm.boxSpecUnit" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in unitClass" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="瓶规格：" prop="bottleSpec">
                <el-input v-model="dataForm.bottleSpec" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="单位：">
                <el-select v-model="dataForm.bottleSpecUnit" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in unitClass" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="targetID" label="维护人：">
                <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button class="j_closeBtn" @click="closeDialog">
                取消
            </el-button>
            <el-button type="primary" @click="submitDataForm">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { COMMON_API } from 'common/api/api';
    export default {
        name: 'SpecificationAddOrUpdate',
        components: {},
        props: {
            // serchSpecList: {
            //     type: Array,
            //     default: () => []
            // }
            serchSpecList: {
                type: Array,
                default: () => []
            },
            largeClass: {
                type: Array,
                default: () => []
            },
            unitClass: {
                type: Array,
                default: () => []
            }
        },
        data() {
            return {
                isDialogShow: false,
                // serchSpecList: [],
                targetID: '',
                // largeClass: [],
                // unitClass: [],
                dataForm: {
                    material: '',
                    brand: '',
                    largeClass: '',
                    boxSpec: '',
                    boxSpecUnit: '',
                    bottleSpec: '',
                    bottleSpecUnit: ''
                },
                checkRules: {
                    material: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                    brand: [{ required: true, message: '品牌不能为空', trigger: 'blur' }],
                    largeClass: [{ required: true, message: '大类不能为空', trigger: 'blur' }],
                    boxSpec: [{ required: true, message: '箱规格不能为空', trigger: 'blur' }],
                    boxSpecUnit: [{ required: true, message: '箱规格单位不能为空', trigger: 'blur' }],
                    bottleSpec: [{ pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }]
                }
            };
        },
        computed: {},
        methods: {
            closeDialog() {
                document.querySelectorAll('.j_closeBtn')[0].focus(); // bug 优化
                this.$refs.dataForm.resetFields();
                this.isDialogShow = false;
            },
            // 设置品牌
            setBrand(val) {
                this.dataForm.brand = val.split(' ')[2];
            },
            init(data) {
                if (data) {
                    this.targetID = data.id;
                    this.dataForm.id = data.id;
                    this.dataForm.material = data.materialCode + ' ' + data.materialName + ' ' + data.brand;
                    this.dataForm.brand = data.brand;
                    this.dataForm.largeClass = data.largeClass;
                    this.dataForm.boxSpec = data.boxSpec;
                    this.dataForm.boxSpecUnit = data.boxSpecUnit;
                    this.dataForm.bottleSpec = data.bottleSpec;
                    this.dataForm.bottleSpecUnit = data.bottleSpecUnit;
                    this.dataForm.changer = data.changer;
                } else {
                    this.targetID = '';
                    this.dataForm = {};
                    // this.dataForm.boxSpecUnit = '001';
                    // this.dataForm.bottleSpecUnit = '002';
                }
                this.isDialogShow = true;
            },
            submitDataForm() {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        if (this.targetID) {
                            COMMON_API.SPECS_UPDATE_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                id: this.targetID,
                                brand: this.dataForm.brand,
                                largeClass: this.dataForm.largeClass,
                                boxSpec: this.dataForm.boxSpec,
                                boxSpecUnit: this.dataForm.boxSpecUnit,
                                bottleSpec: this.dataForm.bottleSpec,
                                bottleSpecUnit: this.dataForm.bottleSpecUnit,
                                materialName: this.dataForm.material.split(' ')[1],
                                materialCode: this.dataForm.material.split(' ')[0],
                                version: this.dataForm.version
                                // :this.dataForm.changer,
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            });
                        } else {
                            COMMON_API.SPECS_INSERT_API({
                                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                                brand: this.dataForm.brand,
                                largeClass: this.dataForm.largeClass,
                                boxSpec: this.dataForm.boxSpec,
                                boxSpecUnit: this.dataForm.boxSpecUnit,
                                bottleSpec: this.dataForm.bottleSpec,
                                bottleSpecUnit: this.dataForm.bottleSpecUnit,
                                materialName: this.dataForm.material.split(' ')[1],
                                materialCode: this.dataForm.material.split(' ')[0]
                                // :this.dataForm.changer,
                            }).then(() => {
                                this.$emit('refreshDataList');
                                this.isDialogShow = false;
                            });
                        }
                    }
                });
            }
        }
    };
</script>

<style scoped>
    .el-form-item--small.el-form-item {
        margin-bottom: 20px;
    }
</style>
