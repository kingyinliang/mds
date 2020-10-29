<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-09-02 10:21:15
 * @LastEditors: Telliex
 * @LastEditTime: 2020-10-28 09:52:20
-->
<template lang="pug">
    el-dialog(:title="formElementSetting.props.title" :close-on-click-modal="false" :visible.sync="isCurrentDailogShow")
        el-form(ref="dataForm" :model="dataForm" size="small"  :label-width="`${formElementSetting.props.labelWidth || 100}px`")
            template(v-for="(formElement,index) in formElementSetting.data")
                el-form-item(v-if="formElement.type==='select:remote'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop" :label-width="`${formElement.labelWidth || formElementSetting.props.labelWidth}px`" :rules="formElement.rules" )
                    el-select(:ref="formElement.prop" v-model="dataForm[formElement.prop]" filterable remote :placeholder="formElement.placeholder" style="width: 100%;" clearable @clear="clearVal(formElement)" :disabled="formElement.disabled || false"  :loading="loading" :remote-method="((val)=>{remoteMethod(val,index)})" @change="((val)=>{emitChange(val,formElement,index)})")
                        el-option(v-for="(opt, optIndex) in formElement.optionList" :key="opt+optIndex" :label="opt.optLabel" :value="opt.optValue" )
                el-form-item(v-else-if="formElement.type==='select'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop" :label-width="`${formElement.labelWidth || formElementSetting.props.labelWidth}px`" :rules="formElement.rules" )
                    el-select(:ref="formElement.prop" v-model="dataForm[formElement.prop]" filterable :placeholder="formElement.placeholder" style="width: 100%;" clearable @clear="clearVal(formElement)" :disabled="formElement.disabled || false" @change="((val)=>{emitChange(val,formElement,index)})")
                        el-option(v-for="(opt, optIndex) in formElement.optionList" :key="opt+optIndex" :label="opt.optLabel" :value="opt.optValue")
                el-form-item(v-else-if="formElement.type==='input'&&formElement.typeof==='number'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop" :label-width="`${formElement.labelWidth || 100}px`" :rules="formElement.rules")
                    el-input(:ref="formElement.prop" v-model.number="dataForm[formElement.prop]" :placeholder="formElement.placeholder" :oninput="formElement.oninput" clearable :disabled="formElement.disabled || false" )
                el-form-item(v-else-if="formElement.type==='input'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop" :label-width="`${formElement.labelWidth || formElementSetting.props.labelWidth}px`" :rules="formElement.rules")
                    el-input(:ref="formElement.prop" v-model="dataForm[formElement.prop]" :placeholder="formElement.placeholder" :oninput="formElement.oninput" clearable :disabled="formElement.disabled || false" )
                el-form-item(v-else-if="formElement.type==='text'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop" :label-width="`${formElement.labelWidth || formElementSetting.props.labelWidth}px`")
                    el-input(:ref="formElement.prop" v-model="dataForm[formElement.prop]" disabled)
        div(slot="footer" class="dialog-footer")
            el-button(@click="closeDialog") 取消
            el-button(type="primary" @click="submitDataForm") 确定
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component({
        name: 'DialogShow',
        components: {
        }
    })
    export default class DialogSearch extends Vue {
        @Prop({ type: Object, default: () => { return {} } }) dataForm // 数据
        @Prop({ type: Object, default: () => { return {} } }) formElementSetting // 表单元素设置

        $refs: {
            dataForm: HTMLFormElement;
        }

        isCurrentDailogShow= false
        loading=false


        // [BTN] 取消关闭
        closeDialog() {
            this.isCurrentDailogShow = false;
            this.$refs.dataForm.resetFields();
        }

        // [BTN] 确认送出
        submitDataForm() {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    const newDataForm = JSON.parse(JSON.stringify(this.dataForm))
                    // 对 newDataForm 做处理
                    this.$emit('update:dataForm', newDataForm)
                    this.$emit('send-dialog-form-data', newDataForm);
                    this.$refs.dataForm.resetFields();
                    this.isCurrentDailogShow = false;
                } else {
                    this.$infoToast('请完善表单')
                    return false;
                }
            });
        }

        clearVal(item) {
            // 将有连动的下拉清空
            item.linkageProp.forEach(element => {
                this.dataForm[element] = '' // 清空连动栏位
                this.formElementSetting.data.forEach(atom => {
                    if (atom.prop === element) {
                        atom.optionList = [] // 先清空连动栏位下拉选单
                    }
                })
            })
        }

        init() {
            this.isCurrentDailogShow = true;
            // 基础设置
            this.setting()
        }

        // 设置下拉label
        setLabel(opt, item) {
            let label = '';
            item.resVal.label.forEach(it => {
                label += opt[it] + ' ';
            });
            return label;
        }

        setting() {
            // 设置表单元素
            this.formElementSetting.data.forEach(item => {
                // 下拉框获取下拉
                if (item.options) {
                    this.$set(item, 'optionList', item.options);
                } else if (item.defaultOptionsFn) {
                    // 初始化下拉
                    item.defaultOptionsFn().then((res) => {
                        this.$set(item, 'optionList', res);
                    });
                }

                if (item.linkageProp) {
                    if (this.dataForm[item.prop]) {
                        const target = this.formElementSetting.data.filter(element => element.prop === item.linkageProp[0])[0]
                        target.emitChange(this.dataForm[item.prop]).then((res) => {
                            this.$set(target, 'optionList', JSON.parse(JSON.stringify(res)))
                        })
                    }
                }
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        emitChange(val, element, index) {
            // TODO 目前只接受一个连动，后续在添加
            if (element.linkageProp) {
                this.clearVal(element);
                // 連動對象
                const target = this.formElementSetting.data.filter(item => item.prop === element.linkageProp[0])[0]
                target.emitChange(val, element).then((res) => {
                    this.$set(target, 'optionList', JSON.parse(JSON.stringify(res)))
                })
            }
        }

        remoteMethod(query, index) {
            if (query !== '' && query.length > 1) {
                this.loading = true;
                this.formElementSetting.data[index].remoteMethod(query).then((res) => {
                    this.loading = false;
                    this.formElementSetting.data[index].optionList = res
                })
            } else {
                this.loading = false;
                this.formElementSetting.data[index].optionList = [];
            }
        }
    }
</script>
<style lang="sass" scoped></style>
