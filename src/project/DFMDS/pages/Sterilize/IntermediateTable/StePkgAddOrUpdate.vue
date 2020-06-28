<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" label-width="120px" size="small">
            <el-form-item label="杀菌车间：">
                <el-input v-model.trim="dataForm.material" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="杀菌锅：">
                <el-input v-model.trim="dataForm.material" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="包装车间：">
                <el-input v-model.trim="dataForm.material" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="包装产线：">
                <el-input v-model.trim="dataForm.material" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model.trim="dataForm.material" style="width: 180px;" clearable />
            </el-form-item>
            <el-form-item label="操作人：" />
            <el-form-item label="操作时间：" />
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class StePkgAddOrUpdate extends Vue {
        visible = false;
        dataForm = {
            material: ''
        }
    }
</script>

<style scoped>

</style>
