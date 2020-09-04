<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-09-02 10:21:15
 * @LastEditors: Telliex
 * @LastEditTime: 2020-09-04 14:32:02
-->
<template lang="pug">
    el-dialog(:title="formElementSetting.props.title" :close-on-click-modal="false" :visible.sync="isCurrentDailogShow")
        el-form(ref="dataForm" :model="dataForm" size="small" :label-width="formElementSetting.props.labelWidth")
            template(v-for="(formElement,index) in formElementSetting.data")
                el-form-item(v-if="formElement.type==='select'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop" :rules="formElement.rules")
                    el-select(:ref="formElement.prop" v-model="dataForm[formElement.prop]" filterable :placeholder="formElement.placeholder" style="width: 100%;" clearable @clear="clearVal(formElement)")
                        el-option(v-for="(opt, optIndex) in optionLists[formElement.prop]" :key="opt+optIndex" :label="setLabel(opt, formElement)" :value="opt[formElement.resVal.value]")
                el-form-item(v-if="formElement.type==='input'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop")
                    el-input(:ref="formElement.prop" v-model="dataForm[formElement.prop]" :placeholder="formElement.placeholder" clearable)
                el-form-item(v-if="formElement.type==='text'" :key="formElement.prop+index" :label="`${formElement.label}：` || ''" :prop="formElement.prop")
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
        optionLists={
        }

        // 取消关闭
        closeDialog() {
            this.isCurrentDailogShow = false;
            this.$refs.dataForm.resetFields();
        }

        // 确认送出
        submitDataForm() {
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    const newDataForm = JSON.parse(JSON.stringify(this.dataForm))
                    // 对 newDataForm 做处理
                    this.$emit('update:dataForm', newDataForm)
                    this.$emit('send-dialog-form-data', newDataForm);
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
                console.log(element)
                this.dataForm[element.prop] = ''; // 先清空
            })
        }

        init() {
            this.isCurrentDailogShow = true;
            console.log('Dialog 传进来的 data')
            console.log(this.dataForm)
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
                // 设置查询表单
                // this.$set(this.dataForm, item.prop, item.defaultValue || item.multiple ? [] : '');
                // if (item.type === 'date-interval') {
                //     this.$set(this.dataForm, item.prop, item.defaultValue || '');
                //     this.$set(this.dataForm, item.propTwo, item.defaultValueTwo || '');
                // }


                // 下拉框获取下拉
                if (item.options) {
                    this.$set(this.optionLists, item.prop, item.options || []);
                } else if (item.defaultOptionsFn) {
                    // 初始化下拉
                    item.defaultOptionsFn().then(({ data }) => {
                        const dataTemp = data[item.resVal.resData];
                        this.$set(this.optionLists, item.prop, dataTemp);
                        // if (dataTemp.length > 0 && item.defaultValue === '') {
                        //     this.$set(this.dataForm, item.prop, dataTemp[0][item.resVal.value]);
                        //     this.$nextTick(() => {
                        //         this.$refs[item.prop][0].emitChange(dataTemp[0][item.resVal.value]);
                        //     });
                        // }
                    });
                }
                // 联动监听事件对象
                if (item.linkageProp) {
                    this.$nextTick(() => {
                        // 添加监听
                        this.$refs[item.prop][0].emitChange = val => {
                            // this.clearTableAndPage();
                            item.linkageProp.forEach(linkagePropItem => {
                                // 联动的对象
                                const linkagePropItemObj = this.formElementSetting.data.filter(it => it.prop === linkagePropItem)[0];
                                // 联动的对象赋值
                                this.dataForm[linkagePropItemObj.prop] = ''; // 先清空
                                this.$refs[linkagePropItemObj.prop][0].emitChange('');
                                // 获取联动的下拉
                                if (val) {
                                    let secondVal = '';
                                    let fromVal = '';
                                    if (linkagePropItemObj.returnValue) {
                                        // 抓取其他接口返回的其他参数
                                        secondVal = this.optionLists[linkagePropItemObj.returnValue.findList].find(it => it[linkagePropItemObj.returnValue.findId] === val)[linkagePropItemObj.returnValue.findField]
                                    }
                                    if (linkagePropItemObj.formValue) {
                                        fromVal = this.dataForm[linkagePropItemObj.formValue];
                                    }
                                    linkagePropItemObj.optionsFn(val, secondVal, fromVal).then(({ data }) => {
                                        let dataTemp = data
                                        if (linkagePropItemObj.resVal.resDataArray) {
                                            linkagePropItemObj.resVal.resDataArray.map(sole => {
                                                dataTemp = dataTemp[sole]
                                            })
                                        } else {
                                            dataTemp = data[linkagePropItemObj.resVal.resData];
                                        }
                                        this.$set(this.optionLists, linkagePropItemObj.prop, dataTemp);
                                        if (dataTemp.length > 0 && linkagePropItemObj.defaultValue === '') {
                                            this.$set(this.dataForm, linkagePropItemObj.prop, dataTemp[0][linkagePropItemObj.resVal.value]);
                                            this.$nextTick(() => {
                                                this.$refs[linkagePropItemObj.prop][0].emitChange(dataTemp[0][linkagePropItemObj.resVal.value]);
                                            });
                                        }
                                    });
                                } else {
                                    this.$set(this.optionLists, linkagePropItemObj.prop, []);
                                }
                            });
                        };
                    });
                }
            });
        }
    }
</script>
<style lang="sass" scoped></style>
