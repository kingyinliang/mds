<template>
    <div>
        <div class="error clearfix">
            <img src="@/assets/img/500.png" alt="">
            <div class="errortxt">
                <h3>500</h3>
                <p>抱歉，服务器出错了</p>
                <el-button type="primary" size="small" @click="$router.push({ name: 'home' })">
                    返回首页
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Error500',
    components: {},
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.error {
    width: 790px;
    margin: auto;
    margin-top: 120px;
    padding: 30px 0;
    img {
        float: left;
        width: 419px;
        height: 202px;
    }
    .errortxt {
        float: left;
        width: 300px;
        margin-top: 20px;
        margin-left: 60px;
    }
    h3 {
        font-weight: 600;
        font-size: 60px;
        letter-spacing: 5px;
        text-align: left;
    }
    p {
        color: #8a979e;
        font-size: 20px;
        line-height: 45px;
        text-align: left;
    }
}
</style>
