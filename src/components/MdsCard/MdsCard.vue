<template>
    <div class="box-card">
        <div class="box-card-title clearfix">
            <h3> <em class="title-icon" :style="{ background: iconBg }" />{{ title }} </h3>
            <slot name="titleBtn" />
        </div>
        <div :class="name + 'Box'">
            <slot />
        </div>
        <div v-if="packUp" class="box-card-show-hidden">
            <span class="showHiddenBtn" :name="name">收起 <em class="el-icon-caret-top" /></span>
        </div>
    </div>
</template>

<script>
import { ShowHiddenNameBox } from 'utils/utils.ts';
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
