<template>
    <div class="EchartsHead">
        <p><slot /></p>
        <img src="@/assets/img/echartsHead.png" alt="">
    </div>
</template>

<script>
export default {
    name: 'EchartsHead',
    components: {},
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.EchartsHead {
    position: relative;
    width: 100%;
    height: 90px;
    padding-top: 5px;
    p {
        position: absolute;
        top: 0;
        width: 100%;
        padding-top: 7px;
        color: white;
        font-size: 30px;
        text-align: center;
    }
    img {
        display: block;
        width: 100%;
    }
}

@media (max-width: 1300px) {
    .EchartsHead p {
        font-size: 28px;
    }
}

@media (max-width: 1200px) {
    .EchartsHead p {
        font-size: 26px;
    }
}

@media (max-width: 1100px) {
    .EchartsHead p {
        font-size: 22px;
    }
}
</style>
