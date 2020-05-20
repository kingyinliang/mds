<template>
    <div class="home">
        <img src="~common/img/index.svg" class="home--img" alt="welcome">
    </div>
</template>

<script>
export default {
    name: 'Home',
    components: {
    },
    data() {
        return {};
    },
    computed: {},
    mounted() {
        console.log('当前版平台本: ' + this.version);
    },
    methods: {}
};
</script>

<style lang="scss" scoped>
    .home {
        overflow: hidden;
        &--img {
            display: block;
            width: 80%;
            margin: 120px auto;
        }
    }
</style>
