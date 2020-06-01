<template>
    <div />
</template>

<script>
export default {
    name: 'Working',
    data() {
        return {
            form: {},
            statusList: [
                {
                    name: '已保存',
                    value: '0'
                },
                {
                    name: '已提交',
                    value: '1'
                }
            ]
        };
    }
};
</script>

<style lang="scss">
.selectwidth {
    width: 170px;
}
</style>
