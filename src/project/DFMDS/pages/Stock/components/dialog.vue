<!-- dialog 弹框组件 -->
<template>
    <el-dialog :visible.sync="visible" :title="title" :close-on-click-modal="false" :width="width">
        <el-form ref="formRef" :model="formModel" :rules="rules" size="mini" :inline="false" label-suffix="：" label-width="100px">
            <el-form-item v-for="(item, index) in formColumns" :key="index" :label="item.label" :prop="item.prop">
                <el-input v-if="item.type === 'input' && !item.formatter" v-model="formModel[item.prop]" :disabled="item.disabled" size="small" :placeholder="'请输入' + item.label" style="width: 260px;" />
                <el-input v-if="item.type === 'input' && item.formatter" :value="item.formatter(formModel)" :disabled="item.disabled" size="small" :placeholder="'请输入' + item.label" style="width: 260px;" />
                <el-select v-if="item.type === 'select'" v-model="formModel[item.prop]" :disabled="item.disabled" clearable size="small" :placeholder="'请选择' + item.label" style="width: 260px;">
                    <el-option v-for="option in item.defaultOptions" :key="option.value" :label="option.label" :value="option.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <div class="btn-box">
                    <el-button size="small" @click="cancel">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" @click="sure">
                        确定
                    </el-button>
                </div>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component({
    name: 'Dialog'
})
export default class Dialog extends Vue {

    $refs: {
        formRef: HTMLFormElement;
    }

    @Prop({ type: String, default: '标题' }) title;
    @Prop({ type: String, default: '500px' }) width;
    @Prop({ type: Object, default: () => ({}) }) rules;
    @Prop({ type: Array, default: () => ([]) }) formColumns;
    @Prop({ type: Function, default: () => 1 }) submitHandler;

    visible = false;

    formModel = {};

    init(row) {
        this.visible = true;
        this.formModel = { ...row };
        this.reset()
    }

    reset() {
        this.$nextTick(() => {
            this.$refs.formRef.clearValidate()
        })
    }

    cancel() {
        this.reset()
        this.visible = false
    }

    sure() {
        console.log(this.formModel)
        this.$refs.formRef.validate((valid) => {
            if (valid) {
                this.submitHandler(this.formModel).then(res => {
                    if (res.data.code === 200) {
                        this.$successToast(res.data.msg)
                        this.$emit('success')
                        this.reset()
                        this.visible = false
                    }
                })
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }
}
</script>

<style lang="scss">
    .btn-box {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        padding: 10px 20px 20px 0;
    }
</style>
