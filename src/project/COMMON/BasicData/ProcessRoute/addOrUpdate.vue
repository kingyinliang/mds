<template>
    <el-dialog width="500px" title="工艺路线新增/修改" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="addForm" :inline="true" :rules="rules" size="small" :model="dataForm" label-width="110px">
            <el-form-item label="生产车间：" prop="workShop">
                <el-select v-model="dataForm.workShop" placeholder="请选择" filterable style="width: 283px;" clearable>
                    <el-option v-for="(sole, index) in workShopList" :key="index" :value="sole.id" :label="`${sole.deptName}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产物料：" prop="productMaterialCode">
                <el-select v-model="dataForm.productMaterialCode" placeholder="请选择" filterable style="width: 283px;" clearable @change="productMaterialChange">
                    <el-option v-for="(sole, index) in productMaterialList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="任务清单类型：" prop="taskInventoryType">
                <el-input v-model="dataForm.taskInventoryType" value="N" placeholder="请输入" disabled style="width: 283px;" />
            </el-form-item>
            <el-form-item label="任务清单组码：" prop="taskInventoryCode">
                <!-- <el-select v-model="dataForm.taskInventoryCode" placeholder="请选择" filterable style="width: 283px;" clearable>
                    <el-option v-for="(sole, index) in productMaterialList" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select> -->
                <el-input v-model="dataForm.taskInventoryCode" placeholder="请输入" filterable style="width: 283px;" />
            </el-form-item>
            <el-form-item label="组计数器：" prop="groupCounter">
                <el-input v-model="dataForm.groupCounter" placeholder="请输入" style="width: 283px;" />
            </el-form-item>
            <el-form-item label="生产版本：">
                <el-input v-model="dataForm.produceVersion" placeholder="请输入" style="width: 283px;" />
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
import { BASIC_API } from 'src/common/api/api';
export default {
    props: {
        workShopList: {
            type: Array,
            default: () => []
        },
        productMaterialList: {
            type: Array,
            default: () => ([])
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
                productMaterialCode: [
                    { required: true, message: '请选择生产物料', trigger: 'change' }
                ],
                taskInventoryType: [
                    { required: true, message: '请输入任务清单类型', trigger: 'blur' }
                ],
                taskInventoryCode: [
                    { required: true, message: '请输入任务清单组码', trigger: 'blur' }
                ],
                groupCounter: [
                    { required: true, message: '请输入组计数器', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        productMaterialChange(v) {
            console.log(v, '===============')
            this.productMaterialList.map(item => {
                if (item.materialCode === v) {
                    this.dataForm.productMaterialName = item.materialName;
                    this.dataForm.productMaterialType = item.materialTypeCode;
                }
            })
        },
        addHandler() {
            this.$refs.addForm.validate((valid) => {
                if (valid) {
                    BASIC_API[this.dataForm.id ? 'FER_CRAFT_UPDATE_API' : 'FER_CRAFT_SAVE_API'](this.dataForm).then(({ data }) => {
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
