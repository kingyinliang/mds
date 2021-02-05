<template>
    <div class="home">
        <echarts-head>MDS数据展示中心</echarts-head>
        <div class="home_main">
            <img src="~src/layout/assets/img/board_home.png" class="home--img" alt="welcome">
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        components: {
            EchartsHead: resolve => {
                require(['src/layout/main/board/EchartsHead'], resolve);
            }
        }
    };
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
    &_main {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        padding: 20px 60px 20px 150px;
    }
}
</style>
