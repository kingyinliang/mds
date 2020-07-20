<template>
    <el-dialog title="半成品领用" :close-on-click-modal="false" :visible.sync="visible">
        <el-form ref="dataForm" :model="dataForm" status-icon :rules="dataRule" label-width="125px" size="small" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="生产锅号：" prop="stePotNo">
                <el-input v-model="dataForm.stePotNo" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="发酵罐领用：">
                <el-input v-model="dataForm.consumeType" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="发酵罐号：" prop="fermentPotNo">
                <el-select v-model="dataForm.fermentPotNo" placeholder="请选择" style="width: 100%;" clearable>
                    <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="领用物料：" prop="">
                <el-select v-model="dataForm.materialCode" placeholder="请选择" style="width: 100%;" clearable>
                    <el-option v-for="(item, index) in materialArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                </el-select>
            </el-form-item>
            <el-form-item label="单位：" prop="consumeUnit">
                <el-input v-model="dataForm.consumeUnit" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="领用数量：" prop="consumeAmount">
                <el-input v-model="dataForm.consumeAmount" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="领用批次：" prop="consumeBatch">
                <el-input v-model="dataForm.consumeBatch" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="发酵罐库存：">
                <el-input v-model="dataForm.fermentStorage" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="转运罐号：">
                <el-input v-model="dataForm.tankNo" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model="dataForm.remark" placeholder="手动输入" />
            </el-form-item>
            <el-form-item label="操作人：">
                <el-input v-model="dataForm.changer" placeholder="手动输入" disabled />
            </el-form-item>
            <el-form-item label="操作时间：">
                <el-date-picker v-model="dataForm.changed" type="datetime" placeholder="选择" disabled style="width: 100%;" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="visible = false">
                取消
            </el-button>
            <el-button size="small" type="primary" @click="dataFormSubmit">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, ORDER_API } from 'common/api/api';

    @Component
    export default class SemiReceiveDialog extends Vue {
        $refs: {dataForm: HTMLFormElement};
        visible = false;
        potArr = [];
        materialArr = [];
        dataForm: DataObj = {};
        dataRule = {
            stePotNo: [{ required: true, message: '生产锅号不能为空', trigger: 'blur' }],
            fermentPotNo: [{ required: true, message: '发酵罐号不能为空', trigger: 'blur' }],
            materialCode: [{ required: true, message: '领用物料不能为空', trigger: 'blur' }],
            consumeUnit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
            consumeAmount: [{ required: true, message: '领用数量不能为空', trigger: 'blur' }],
            consumeBatch: [{ required: true, message: '领用批次不能为空', trigger: 'blur' }]
        };

        mounted() {
            COMMON_API.HOLDER_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                current: 1,
                size: 9999,
                holderType: '001'
            }).then(({ data }) => {
                this.potArr = data.data.records
            })
            ORDER_API.ORDER_BOOM_LIST_API({
                materialType: 'ZHAL',
                orderNoList: [this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo]
            }).then(({ data }) => {
                this.materialArr = data.data.records
            })
        }

        init() {
            this.visible = true;
            this.dataForm.stePotNo = this.$store.state.sterilize.SemiReceive.potNo
        }

        dataFormSubmit() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.visible = false;
                    this.$emit('success', this.dataForm)
                }
            })
        }
    }
    interface DataObj {
        stePotNo?: string;
    }
</script>

<style scoped>

</style>
