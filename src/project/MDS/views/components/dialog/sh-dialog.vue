<template>
    <div class="sh-dialog">
        <div class="sh-dialog_content" :style="{ width: '100px', marginTop: '15vh' }">
            <div class="sh-dialog_content_title" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ShDialog',
    components: {},
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.sh-dialog {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
    margin: 0;
    overflow: auto;
    background-color: rgba(255, 255, 255, 0.6);
    &_content {
        margin: 0 auto 50px;
        border-radius: 6px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        &_title {
            padding: 20px;
            background: #1890ff;
        }
    }
}
</style>
