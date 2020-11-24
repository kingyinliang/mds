<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible" :title="dataForm.id? '修改' : '新增'" width="420px">
        <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="140px" size="small">
            <el-form-item label="工序段：" prop="productProcess">
                <el-select v-model="dataForm.productProcess" placeholder="请选择" filterable style="width: 220px;" clearable>
                    <el-option v-for="(sole, index) in processList" :key="index" :value="sole.dictCode" :label="sole.dictValue" />
                </el-select>
            </el-form-item>
            <el-form-item label="生产物料：" prop="productMaterialCode">
                <el-select v-model="dataForm.productMaterialCode" placeholder="请选择" filterable style="width: 220px;" clearable @change="setPro">
                    <el-option v-for="(sole, index) in material" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="领用物料：" prop="useMaterialCode">
                <el-select v-model="dataForm.useMaterialCode" placeholder="请选择" filterable style="width: 220px;" clearable @change="setUse">
                    <el-option v-for="(sole, index) in material" :key="index" :value="sole.materialCode" :label="`${sole.materialName} ${sole.materialCode}`" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单天数：" prop="orderDays">
                <el-input v-model="dataForm.orderDays" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="报工成熟天数：">
                <el-input v-model="dataForm.jobDays" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="发酵成熟天数：">
                <el-input v-model="dataForm.matureDays" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="发酵超期天数：" prop="overdueDays">
                <el-input v-model="dataForm.overdueDays" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="报工标识：" prop="jobBookingFlag">
                <el-select v-model="dataForm.jobBookingFlag" placeholder="请选择" filterable style="width: 220px;" clearable>
                    <el-option v-for="(iteam, index) in hoursList" :key="index" :label="iteam.dictValue" :value="iteam.dictCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="数量倍数：">
                <el-input v-model.trim="dataForm.multiple" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model.trim="dataForm.remark" style="width: 220px;" clearable />
            </el-form-item>
            <el-form-item label="操作人：">
                {{ dataForm.changer }}
            </el-form-item>
            <el-form-item label="操作时间：">
                {{ dataForm.changed }}
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { BASIC_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component
    export default class CraftAddOrUpdate extends Vue {
        @Prop({ type: Array, default: [] }) processList;
        @Prop({ type: Array, default: [] }) material;
        @Prop({ type: Array, default: [] }) hoursList;

        $refs: {
            dataForm: HTMLFormElement;
        };

        visible = false;
        dataForm = {
            id: '',
            productMaterialCode: '',
            productMaterialName: '',
            productMaterialType: '',
            useMaterialCode: '',
            useMaterialName: '',
            useMaterialType: '',
            productProcess: '',
            orderDays: '',
            jobDays: '',
            matureDays: '',
            overdueDays: '',
            jobBookingFlag: '',
            multiple: '',
            remark: '',
            changer: '',
            changed: ''
        };

        dataRule = {
            productProcess: [{ required: true, message: '工序段不能为空', trigger: 'blur' }],
            productMaterialCode: [{ required: true, message: '生产物料不能为空', trigger: 'blur' }],
            useMaterialCode: [{ required: true, message: '领用物料不能为空', trigger: 'blur' }],
            orderDays: [{ required: true, message: '订单天数不能为空', trigger: 'blur' }],
            overdueDays: [{ required: true, message: '发酵超期天数不能为空', trigger: 'blur' }],
            jobBookingFlag: [{ required: true, message: '报工标识不能为空', trigger: 'blur' }]
        };

        init(data) {
            if (data) {
                this.dataForm = JSON.parse(JSON.stringify(data));
            } else {
                this.dataForm = {
                    id: '',
                    productMaterialCode: '',
                    productMaterialName: '',
                    productMaterialType: '',
                    useMaterialCode: '',
                    useMaterialName: '',
                    useMaterialType: '',
                    productProcess: '',
                    orderDays: '',
                    jobDays: '',
                    matureDays: '',
                    overdueDays: '',
                    jobBookingFlag: '',
                    multiple: '',
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                }
            }
            this.visible = true;
        }

        setPro() {
            const filterArr1: (any) = this.material.filter(it => it.materialCode === this.dataForm.productMaterialCode);// eslint-disable-line
            this.dataForm.productMaterialName = filterArr1[0].materialName;
            this.dataForm.productMaterialType = filterArr1[0].materialTypeCode;
        }

        setUse() {
            const filterArr1: (any) = this.material.filter(it => it.materialCode === this.dataForm.useMaterialCode);// eslint-disable-line
            this.dataForm.useMaterialName = filterArr1[0].materialName;
            this.dataForm.useMaterialType = filterArr1[0].materialTypeCode;
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    BASIC_API.FERINFO_SAVE_API(this.dataForm).then(({ data }) => {
                        this.visible = false;
                        this.$successToast(data.msg);
                        this.$emit('refreshDataList');
                    });
                }
            })
        }
    }
</script>

<style scoped>

</style>
