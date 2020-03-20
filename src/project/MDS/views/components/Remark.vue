<template>
    <div :style="{ width: width }">
        <div class="kt-tooltip-input__hidden" style="position: fixed; left: -19800px;">
            {{ value }}
        </div>
        <div v-show="flag" style="cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :style="{ width: width }" @click="visibilityChange($event)">
            {{ value ? value : '点击修改备注' }}
        </div>
        <el-tooltip v-show="!flag" ref="toolTip" :placement="placement" :effect="effect" :manual="true">
            <div slot="content" style="width: 300px; display: flex; flex: 1; flex-direction: column; justify-content: space-between;">
                <div style="flex: 1;">
                    <textarea ref="textArea" rows="10" style="width: 300px; font-size: 14px;" placeholder="请输入备注" :value="value" @input="changeInput($event.target.value)" />
                </div>
                <div style="flex: 1; align-self: flex-end; margin-top: 10px;">
                    <el-button type="primary" size="small" style="color: #000; background-color: #fff; border-color: #d9d9d9;" @click="cancel">
                        取消
                    </el-button>
                    <el-button type="primary" size="small" @click="save">
                        保存
                    </el-button>
                </div>
            </div>
            <div style="cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" :style="{ width: width }">
                {{ content ? content : '' }}
            </div>
        </el-tooltip>
    </div>
</template>
<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            required: false,
            default: ''
        },
        width: {
            type: String,
            default: '100px'
        },
        placement: {
            type: String,
            default: 'right'
        },
        effect: {
            type: String,
            default: 'light'
        }
    },
    data() {
        return {
            content: this.value,
            flag: true
        };
    },
    watch: {
        flag(n) {
            if (!n) {
                // 手动打开编辑弹框
                this.$nextTick(() => {
                    this.$refs.toolTip.showPopper = true;
                });
            } else {
                // 手动关闭编辑弹框
                this.$nextTick(() => {
                    this.$refs.toolTip.showPopper = false;
                });
            }
        }
    },
    methods: {
        visibilityChange() {
            if (!this.disabled) {
                this.flag = false;
            }
        },
        cancel() {
            this.changeInput(this.content);
            this.flag = true;
        },
        save() {
            this.content = this.value;
            this.flag = true;
        },
        changeInput(val) {
            this.$emit('input', val ? val.trim() : '');
        }
    }
};
</script>
