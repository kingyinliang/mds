<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-09-16 12:08:51
 * @LastEditors: Telliex
 * @LastEditTime: 2020-11-19 14:44:33
-->
<template lang="pug">
    div
        .redactBox
            .redactBox(:style="{ 'padding-left': sidebarFold ? '64px' : '170px' }")
                div(v-if="redactBoxStatus" class="redact clearfix")
                    div(v-if="type === 'entry'" class="redact_tips")
                        em(class="el-icon-info")
                        span(v-if="orderStatus === 'toBeAudited'") 请仔细核对数据后再进行提交
                        span(v-else-if="orderStatus === '已过账'") 订单已过账
                        span(v-else-if="orderStatus === '待审核'") 已提交至主管审核，请等待
                        span(v-else-if="orderStatus === '已审核'") 已提交至生管审核，请等待
                        span(v-else-if="orderStatus === '已保存'")
                            span(v-if="isRedact") {{ formHeader.changer }}于{{ dateChange }}分钟前已保存
                            span(v-else) 点击编辑按钮，对当前页面进行编辑
                        span(v-else-if="orderStatus === '已退回'")
                            span(v-if="isRedact") 请及时保存数据
                            span(v-else) 订单审核不通过，请核对
                        span(v-else-if="orderStatus === 'checked'") 订单已审核通过
                        span(v-else-if="orderStatus === 'submit'") 订单已提交，请等待审核
                        span(v-else-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已退回' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账'")
                            span(v-if="isRedact") 请及时保存数据
                            span(v-else) 点击编辑按钮，对当前页面进行编辑
                    div(v-if="type === 'entry'" class="redact_btn")
                        el-button(v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && isAuth(redactAuth)" type="primary" size="small" @click="setRedact" :disabled="disabled") {{ isRedact ? '取消' : '编辑' }}
                        template(v-if="isRedact || onlySubmit")
                            el-button(v-if="isShowSaveBtn && orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && isAuth(saveAuth)" type="primary" size="small" @click="savedData('saved')" :disabled="disabled") 保存
                        el-button(v-if="isShowSubmitBtn && orderStatus !== 'submit' && orderStatus !== 'checked' && orderStatus !== '已审核' && orderStatus !== '待审核' && orderStatus !== '已过账' && ifSubmit() && isAuth(submitAuth)" type="primary" size="small" @click="submitData" :disabled="disabled") 提交
                    div(v-else class="redact_btn")
                        slot(name="custom_btn")
                div(v-else class="redact clearfix")
                    div(class="redact_tips")
                        em(class="el-icon-info")
                        span(v-if="isRedact") 请及时保存数据
                        span(v-else) 点击编辑按钮，对当前页面进行编辑
                    div(class="redact_btn")
                        el-button(v-if="isRedact && isAuth(redactAuth)" type="primary" size="small" @click="cancel") 取消
                        el-button(v-if="isAuth(saveAuth)" type="primary" size="small" @click="save") {{ isRedact ? '保存' : '编辑' }}

        el-dialog(width="400px" title="分批提交" :close-on-click-modal="false" :visible.sync="visible")
            p(style="margin-bottom: 20px; font-size: 18px;") 本次提交是否提交全部数据
            el-radio(v-model="submitRadio" label="1" style="font-size: 18px;") 紧急提交
            el-radio(v-model="submitRadio" label="2") 正常提交
            span(slot="footer" class="dialog-footer")
                el-button(@click="visible = false") 取消
                el-button(type="primary" @click="") 确定

</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    // import { COMMON_API, STE_API } from 'common/api/api';
    // import { dateFormat } from 'utils/utils';


    @Component({
        name: 'RedactBox',
        components: {
        }
    })
    export default class InstorageDataTabs extends Vue {
        $refs: {

        }

        @Prop({ default: true }) redactBoxStatus: boolean;
        @Prop({ default: false }) onlySubmit: boolean;
        @Prop({ default: false }) isRedact: boolean;
        @Prop({ default: true }) isShowSubmitBtn: boolean;
        @Prop({ default: true }) isShowSaveBtn: boolean;
        @Prop({ type: Array, default: () => { return ['submit', 'checked'] } }) notPermitSubmitStatus;

        @Prop({ default: 'entry' }) type: string;
        @Prop({ default: '' }) redactAuth: string; // 编辑取消按钮操作权限
        @Prop({ default: '' }) submitAuth: string; // 提交按钮操作权限
        @Prop({ default: '' }) saveAuth: string; // 保存按钮操作权限
        @Prop({ default: true }) disabled: string;
        @Prop({ default: '' }) orderStatus: string; // 订单状态
        @Prop({ type: Function, default: () => [] }) savedRules; // 保存验证
        @Prop({ type: Function, default: () => [] }) savedDatas; // 保存数据
        @Prop({ type: Function, default: () => [] }) submitRules; // 提交验证
        @Prop({ type: Function, default: () => [] }) submitDatas; // 提交数据
        @Prop({ default: false }) urgentSubmit: boolean; // 是否紧急提交

        // isRedact=false
        visible=false
        submitRadio = '2';

        mounted() {
           //
        }

        setRedact() {
            if (this.isRedact) {
                this.$emit('success');
            }
            // this.isRedact = !this.isRedact
            this.$emit('update:isRedact', !this.isRedact)
        }

        // 保存
        savedData(str) {
            if (str === 'saved') {
                const arr = this.savedRules();
                for (const rule of arr) {
                    if (!rule('saved')) {
                        return false;
                    }
                }
                this.savedDatas().then(res => {
                    if (res !== false) {
                        // this.isRedact = false;
                        this.$emit('update:isRedact', false)
                        this.$emit('sendSuccess');
                        this.$successToast('保存成功');

                    }
                });
            } else {
                this.submitDatas().then(res => {
                    if (res !== false) {
                        // this.isRedact = false;
                        this.$emit('update:isRedact', false)
                        this.$emit('sendSuccess');
                        this.$successToast('提交成功');

                    }
                });
            }
        }

        // 提交
        submitData() {
            if (this.urgentSubmit) {
                this.visible = true
                return
            }
            // 回传各页签是否皆通过必填栏位验证
            const arr = this.submitRules();
            for (const rule of arr) {
                if (!rule('submit')) {
                    return false;
                }
            }
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedData('submit');
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        }

        get sidebarFold() {
            return this.$store.state.common.sidebarFold;
        }

        ifSubmit() {
            return !this.notPermitSubmitStatus.includes(this.orderStatus);
        }

    }

</script>

<style scoped>

</style>
