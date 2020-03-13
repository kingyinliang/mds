<template>
    <div class="box-card">
        <div class="box-card-title clearfix">
            <h3> <i class="title-icon" :style="{ background: iconBg }" />{{ title }} </h3>
            <slot name="titleBtn" />
        </div>
        <div :class="name + 'Box'">
            <slot />
        </div>
        <div class="box-card-show-hidden">
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
        }
    },
    data() {
        return {};
    },
    computed: {},
    mounted() {
        ShowHiddenNameBox(this.$);
    },
    methods: {}
};
</script>

<style scoped></style>
