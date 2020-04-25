<template>
    <el-dialog :title="targetID ? '修改规格信息' : '新增规格'" :close-on-click-modal="false" :visible.sync="isDialogShow">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="checkRules" label-width="100px" size="small" @keyup.enter.native="submitDataForm()">
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
                <el-select v-model="dataForm.boxSpecUnit" filterable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in unitClass" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="瓶规格：">
                <el-input v-model="dataForm.bottleSpec" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="单位：">
                <el-select v-model="dataForm.bottleSpecUnit" filterable placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in unitClass" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item v-if="targetID" label="维护人：">
                <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">
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
                    boxSpecUnit: [{ required: true, message: '箱规格单位不能为空', trigger: 'blur' }]
                }
            };
        },
        computed: {},
        mounted() {
            // // 获取大类
            // this.getLargeClass();
            // // 获取单位
            // this.getUnit();
            // 获取物料
            // this.getMaterial();
        },
        methods: {
            closeDialog() {
                this.isDialogShow = false;
                this.$refs.dataForm.resetFields();
            },
            // 设置品牌
            setBrand(val) {
                this.dataForm.brand = val.split(' ')[2];
            },
            // // 大类下拉
            // getLargeClass() {
            //     COMMON_API.DICTQUERY_API({
            //         dictType: 'COMMON_CATEGORY'
            //         }).then(({ data }) => {
            //             console.log('大类')
            //             console.log(data)
            //             if (data.code === 200) {
            //                 this.largeClass = data.data;
            //             } else {
            //                 this.$errorTost(data.msg);
            //             }
            //         });
            // },
            // // 单位下拉
            // getUnit() {
            //     COMMON_API.DICTQUERY_API({
            //         dictType: 'COMMON_SPEC_UNIT'
            //         }).then(({ data }) => {
            //             if (data.code === 200) {
            //                 this.unitClass = data.data;
            //             } else {
            //                 this.$errorTost(data.msg);
            //             }
            //         });
            // },

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
                    this.dataForm.boxSpecUnit = '001';
                    this.dataForm.bottleSpecUnit = '002';
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
                            }).then(({ data }) => {
                                if (data.code === 200) {
                                    this.isDialogShow = false;
                                    this.$successToast('操作成功');
                                    this.$emit('refreshDataList');
                                } else {
                                    this.$errorTost(data.msg);
                                }
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
                            }).then(({ data }) => {
                                if (data.code === 200) {
                                    this.isDialogShow = false;
                                    this.$successToast('操作成功');
                                    this.$emit('refreshDataList');
                                } else {
                                    this.$errorTost(data.msg);
                                }
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
        margin-bottom: 14px;
    }
</style>
