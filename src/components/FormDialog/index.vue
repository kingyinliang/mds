<template>
    <div>
        <el-dialog
            :visible.sync="show"
            :close-on-click-modal="false"
            :title="otherConfigure.title"
            class="customWidth"
        >
            <el-form
                ref="formInfo"
                :model="formInfo1"
                :rules="rules"
                label-width="8rem"
                style="width: 40%;"
            >
                <el-form-item
                    v-for="item in formLabel"
                    :key="item.prop"
                    :label="item.label + '：'"
                    :prop="item.prop"
                    style="width: 500px;"
                >
                    <el-input
                        v-model="formInfo1[item.prop]"
                        :maxlength="50"
                        show-word-limit
                        :placeholder="'请输入'+ item.label"
                    />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="close">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'FormDialog',
        props: {
            formLabel: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            show: {
                type: Boolean,
                default: false
            },
            formInfo: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            otherConfigure: {
                type: Object,
                default: () => {
                    return {};
                }
            },
            rules: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        data: () => ({
            formInfo1: {
                a: ''
            }
        }),
        methods: {
            close() {
                this.$emit('update:show', false);
            }
        }
    };
</script>

<style scoped>

</style>
