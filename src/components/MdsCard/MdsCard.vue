<template>
    <div class="box-card">
        <div class="box-card-title clearfix">
            <h3>
                <i class="title-icon" :style="{ background: iconBg }" />{{ title }}
                <el-form :inline="true" :model="soleForm" class="formS" label-width="60px">
                    <template v-for="(item, index) in mdsCardForm">
                        <el-form-item v-if="item.type === 'select'" :key="index" :label="item.labelName">
                            <el-select v-model="soleForm[item.sole]" size="small" style="width: 120px;" class="floatr" @change="selectChange">
                                <el-option v-for="(items, indexs) in item.dataList" :key="indexs" :value="items.value" :label="items.name" />
                            </el-select>
                        </el-form-item>
                    </template>
                </el-form>
                <template v-for="(item, index) in mdsCardButton">
                    <el-button v-if="item.type === 'add'" :key="index" type="primary" class="floatr" size="small" @click="AddRow()">
                        新增
                    </el-button>
                </template>
            </h3>
            <slot name="titleBtn" />
        </div>
        <div :class="name + 'Box'">
            <slot />
        </div>
        <div v-if="packUp" class="box-card-show-hidden">
            <span class="showHiddenBtn" :name="name">收起 <i class="el-icon-caret-top" /></span>
        </div>
    </div>
</template>

<script>
import { ShowHiddenNameBox } from '@/utils/index';
export default {
    name: 'MdsCard',
    components: {},
    props: {
        packUp: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        iconBg: {
            type: String,
            default: '#487bff'
        },
        mdsCardForm: {
            type: Array,
            default: () => {
                return [];
            }
        },
        mdsCardButton: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            soleForm: {}
        };
    },
    computed: {},
    mounted() {
        ShowHiddenNameBox(this.$);
        this.$nextTick(() => {
            if (this.mdsCardForm.length) {
                this.mdsCardForm.map((item) => {
                    this.soleForm[`${item.sole}`] = item.defaultValue
                })
            }
        })
    },
    methods: {
        selectChange(val) {
            this.$emit('get-return-data', val);
        },
        AddRow() {
            this.$emit('add-button-click');
        }
    }
};
</script>

<style scoped></style>
