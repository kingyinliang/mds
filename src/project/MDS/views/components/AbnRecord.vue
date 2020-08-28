<template>
    <div>
        <div class="audit">
            <span>异常情况记录</span>
        </div>
        <div>
            <el-input type="textarea" class="textarea" style="width: 100%; height: 90px;" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'AbnRecord',
    components: {},
    props: {
        tableData: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.audit {
    margin: 10px 0;
    line-height: 32px;
    em {
        float: left;
        font-size: 22px;
    }
    span {
        font-size: 16px;
    }
}
</style>
