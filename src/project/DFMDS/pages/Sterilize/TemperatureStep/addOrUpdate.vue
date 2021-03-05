<template>
    <el-dialog width="500px" title="新增/修改温度阶段" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="addForm" :inline="true" :rules="rules" size="small" :model="dataForm" label-width="110px">
            <el-form-item label="生产车间：" prop="workShop">
                <el-select v-model="dataForm.workShop" placeholder="请选择" filterable style="width: 283px;" clearable>
                    <el-option v-for="(sole, index) in workShopList" :key="index" :value="sole.id" :label="`${sole.deptName}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产物料：" prop="materialCode">
                <el-select v-model="dataForm.materialCode" placeholder="请选择" filterable style="width: 283px;" clearable @change="productMaterialChange">
                    <el-option v-for="(sole, index) in productMaterialList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="温度类型：" prop="type">
                <el-select v-model="dataForm.type" placeholder="请选择" filterable style="width: 283px;" clearable @change="typeChangeHandler">
                    <el-option v-for="(sole, index) in controlTypeList" :key="index" :value="sole.dictCode" :label="sole.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="温度阶段：" prop="stage">
                <el-select v-model="dataForm.stage" placeholder="请选择" filterable style="width: 283px;" clearable>
                    <el-option v-for="(sole, index) in controlStageList" :key="index" :label="sole.dictValue" :value="sole.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序号：" prop="sort">
                <el-input v-model="dataForm.sort" placeholder="请输入" style="width: 283px;" />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="dataForm.remark" placeholder="请输入" style="width: 283px;" />
            </el-form-item>
            <el-form-item label="操作人：">
                <el-input v-model="dataForm.changer" placeholder="请输入" disabled style="width: 283px;" />
            </el-form-item>
            <el-form-item label="操作时间：">
                <el-input v-model="dataForm.changed" placeholder="请输入" disabled style="width: 283px;" />
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="addHandler()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { STE_API, COMMON_API } from 'src/common/api/api';
export default {
    props: {
        workShopList: {
            type: Array,
            default: () => []
        },
        productMaterialList: {
            type: Array,
            default: () => ([])
        },
        controlTypeList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            visible: false,
            dataForm: {},
            rules: {
                workShop: [
                    { required: true, message: '请选择生产车间', trigger: 'change' }
                ],
                materialCode: [
                    { required: true, message: '请选择生产物料', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '请选择温度类型', trigger: 'change' }
                ],
                stage: [
                    { required: true, message: '请选择温度阶段', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序号', trigger: 'blur' }
                ]
            },
            controlStageList: []
        }
    },
    methods: {
        typeChangeHandler(v) {
            this.dataForm.stage = ''
            this.getControlTypeChange(v)
        },
        // 阶段拉取
        getControlTypeChange(dictType) {
            if (dictType) {
                COMMON_API.DICTQUERY_API({ dictType: dictType }).then(({ data }) => {
                    this.controlStageList = data.data
                });
                return
            }
            this.controlStageList = []
        },
        productMaterialChange(v) {
            // console.log(v, '===============')
            this.productMaterialList.map(item => {
                if (item.materialCode === v) {
                    this.dataForm.materialName = item.materialName;
                    this.dataForm.productMaterialType = item.materialTypeCode;
                }
            })
        },
        addHandler() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    STE_API[this.dataForm.id ? 'STE_CRAFT_UPDATE_API' : 'STE_CRAFT_INSERT_API'](this.dataForm).then(({ data }) => {
                        this.visible = false;
                        this.$successToast(data.msg);
                        this.$emit('refreshDataList');
                    });
                }
                return false;
            });
        }
    }
}
</script>

<style>

</style>
