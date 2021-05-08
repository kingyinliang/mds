<template>
    <el-dialog
        width="458px"
        :title="title"
        :close-on-click-modal="false"
        :visible.sync="isShowCurrentDialog"
        destroy-on-close
        custom-class="stock-dialog-custom"
        @close="btnHandleCancel"
    >
        <el-form
            ref="dialogForm"
            :model="dialogForm"
            label-width="120px"
            class="stock-dialog-form-custom"
            :rules="dialogFormRules"
        >
            <el-form-item label="物料描述：">
                <el-input :value="dialogForm.materialName + ' ' + dialogForm.materialCode" class="stock-form_item_style" disabled size="small" placeholder="" />
            </el-form-item>
            <el-form-item label="物料批次：">
                <el-input v-model="dialogForm.batch" class="stock-form_item_style" disabled size="small" placeholder="" />
            </el-form-item>
            <el-form-item label="厂家：">
                <el-input v-model="dialogForm.supplierName" class="stock-form_item_style" disabled size="small" placeholder="" />
            </el-form-item>
            <el-form-item label="模具编号：">
                <el-input v-model="dialogForm.mouldCode" class="stock-form_item_style" disabled size="small" placeholder="" />
            </el-form-item>
            <el-form-item label="基本单位：">
                <el-input v-model="dialogForm.materialUnitName" class="stock-form_item_style" disabled size="small" placeholder="" />
            </el-form-item>
            <el-form-item label="调整类型：" prop="type">
                <el-select v-model="dialogForm.type" class="stock-form_item_style" size="small" placeholder="请选择" clearable>
                    <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="调整数量：" prop="changedAmount">
                <el-input v-model="dialogForm.changedAmount" type="number" class="stock-form_item_style" size="small" placeholder="请输入">
                    <span slot="suffix" class="stock-form_item_input_suffix">{{ dialogForm.materialUnitName }}</span>
                </el-input>
            </el-form-item>
            <el-form-item label="调整说明：" prop="remark">
                <el-input v-model="dialogForm.remark" class="stock-form_item_style" size="small" placeholder="请输入" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="btnHandleCancel">
                取 消
            </el-button>
            <el-button type="primary" size="small" @click="btnHandleComfirm">
                确 定
            </el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { STOCK_API } from 'common/api/api';

    @Component({
        name: 'StockEditDialog',
        components: {}
    })
    export default class StockEditDialog extends Vue {
        // 标题
        @Prop({ default: '' }) title: string;
        // 库存类型: 大豆 面粉 Y158
        @Prop({ default: '' }) stockType: string;

        $refs: {
            dialogForm: HTMLFormElement;
        };

        // 调整类型下拉
        typeOptions: TypeOptionList[] = [
            { value: 'INVENTORY_PROFIT', label: '盘盈' },
            { value: 'INVENTORY_LOSSES', label: '盘亏' }
        ]

        // 弹窗开关
        isShowCurrentDialog = false;

        // 表单 data
        dialogForm: DialogForm = {};

        // 表单 data Rule
        dialogFormRules = {
            type: [{ required: true, message: '请选择调整类型', trigger: 'change' }],
            changedAmount: [
                { required: true, message: '请输入调整量', trigger: 'blur' },
                { pattern: /^[1-9]\d*$/, message: '需为数字', trigger: 'blur' }
            ],
            remark: [{ required: true, message: '调整说明必填', trigger: 'blur' }]
        };

        // 弹窗初始
        init(rowData) {
            this.isShowCurrentDialog = true;
            this.dialogForm = {
                ...rowData,
                // id: rowData.id,
                // type: '',
                remark: ''
            };
        }

        // 取消操作
        private btnHandleCancel() {
            this.isShowCurrentDialog = false;
            this.$refs.dialogForm.resetFields();
        }

        // 提交操作
        btnHandleComfirm() {
            this.$refs.dialogForm.validate(valid => {
                if (valid) {
                    STOCK_API.STOCK_PACKAGE_STORAGE_ADJUST_API({
                        id: this.dialogForm.id,
                        remark: this.dialogForm.remark,
                        changedAmount: this.dialogForm.changedAmount,
                        type: this.dialogForm.type
                    }).then(({ data }) => {
                        if (data.code === 200) {
                            this.$refs.dialogForm.resetFields();
                            this.isShowCurrentDialog = false;
                            this.$successToast('提交成功');
                            this.$emit('refreshTableList');
                        } else {
                            this.$errorToast(data.msg || '提交失败')
                        }
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    }

    interface TypeOptionList {
        label?: string;
        value?: string;
    }

    interface DialogForm {
        id?: number|string;
        type?: string;
        remark?: string;
        changedAmount?: string;
    }
</script>

<style lang="scss" scoped>
    .stock-dialog-custom {
        .stock-dialog-form-custom {
            .stock-form_item_style {
                width: 260px;
                .stock-form_item_input_suffix {
                    margin-right: 20px;
                }
            }
        }
    }
</style>
<style>
    .stock-dialog-form-custom .el-form-item {
        margin-bottom: 2px;
    }
    .stock-dialog-form-custom .el-form-item.is-error.is-required {
        margin-bottom: 16px;
    }
    .stock-dialog-form-custom .el-form-item .el-form-item__error {
        padding-top: 0;
    }
    .stock-dialog-custom .el-dialog__body {
        padding: 30px 10px 35px;
    }
    .stock-dialog-custom .el-dialog__footer {
        padding: 0 16px 16px;
    }
</style>
