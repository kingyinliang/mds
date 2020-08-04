<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-08-03 18:13:58
 * @LastEditors: Telliex
 * @LastEditTime: 2020-08-04 16:01:20
-->
<template>
    <el-dialog :title="title" :width="width" :close-on-click-modal="false" :visible.sync="isShowInStorageDialog">
        <el-form ref="dialogForm" :model="dialogForm" size="small" label-width="110px" class="orderMangedialog" :rules="dialogFormRules">
            <el-form-item label="生产订单：">
                <span class="default">{{ dialogForm.orderNo }}</span>
            </el-form-item>
            <el-form-item label="正常入库：">
                <el-radio v-model="dialogForm.normalFlag" label="Y">
                    是
                </el-radio>
                <el-radio v-model="dialogForm.normalFlag" label="N">
                    否
                </el-radio>
            </el-form-item>
            <el-form-item label="包装产线：" prop="packageLine">
                <el-input v-model.trim="dialogForm.packageLine" size="small" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="包装订单：" prop="packageOrderNo">
                <el-input v-model.trim="dialogForm.packageOrderNo" size="small" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="入库物料：">
                <!-- <el-input v-model.trim="dialogForm.packageOrderNo" size="small" placeholder="请输入" clearable /> -->
                <span class="default">{{ dialogForm.materialCode }} {{ dialogForm.materialName }}</span>
            </el-form-item>
            <el-form-item label="单位：">
                <!-- <el-input v-model.trim="dialogForm.packageOrderNo" size="small" placeholder="请输入" clearable /> -->
                <span class="default">{{ dialogForm.materialUnit }}</span>
            </el-form-item>
            <el-form-item label="入库锅数：" prop="inStoragePot">
                <el-input v-model.number="dialogForm.inStoragePot" size="small" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="入库数量：" prop="inStorageAmount">
                <el-input v-model.number="dialogForm.inStorageAmount" size="small" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="入库批次：" prop="inStorageBatch">
                <el-input v-model.trim="dialogForm.inStorageBatch" size="small" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="备注：">
                <el-input v-model.trim="dialogForm.remark" placeholder="请输入" clearable />
            </el-form-item>
            <el-form-item label="操作人：">
                <span class="default">{{ dialogForm.changer }}</span>
            </el-form-item>
            <el-form-item label="操作时间：">
                <span class="default">{{ dialogForm.changed }}</span>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="btnClearBucketStatus">
                取消
            </el-button>
            <el-button type="primary" size="small" @click="btnComfirmBucketStatus">
                确定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import { STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';

    @Component({
        name: 'InStorageDialog',
        components: {
        }
    })
    export default class DissolveBucketIndex extends Vue {
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: '' }) title: string;
        @Prop({ default: '80%' }) width: string;
        // @Prop() dialogForm: object;

        dialogForm={
            orderNo: '',
            normalFlag: 'Y',
            packageLine: '',
            packageOrderNo: '',
            materialCode: '',
            materialName: '',
            materialUnit: '',
            inStoragePot: 0,
            inStorageAmount: 0,
            inStorageBatch: '',
            remark: '',
            changer: getUserNameNumber(),
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
        }

        dialogFormRules= {
            packageLine: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            packageOrderNo: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            inStoragePot: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            inStorageAmount: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            inStorageBatch: [
                { required: true, message: '请输入', trigger: 'blur' }
            ]
        }

        isShowInStorageDialog = false;

        init() {
            this.isShowInStorageDialog = true;
        }

        btnClearBucketStatus() {
            this.isShowInStorageDialog = false
        }

        btnComfirmBucketStatus() {
            //
        }
    }

</script>

<style lang="scss" scoped>
</style>
