<template>
    <transition name="el-fade-in">
        <div v-show="toTopShow" class="page-up scroll-to-top" @click="scrollToTop">
            <i class="el-icon-caret-top" />
            <span>TOP</span>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'ScrollToTop',
    components: {},
    data() {
        return {
            toTopShow: false,
            scrollTop: 0
        };
    },
    computed: {},
    mounted() {
        this.$nextTick(() => {
            const dom = document.getElementsByClassName('site-content__wrapper')[0];
            dom.addEventListener('scroll', this.handleScroll, true);
        });
    },
    destroyed() {
        const dom = document.getElementsByClassName('site-content__wrapper')[0];
        dom.addEventListener('scroll', this.handleScroll, true);
    },
    methods: {
        handleScroll() {
            const dom = document.getElementsByClassName('site-content__wrapper')[0];
            this.scrollTop = dom.scrollTop;
            if (this.scrollTop >= 200) {
                this.toTopShow = true;
            } else {
                this.toTopShow = false;
            }
        },
        scrollToTop() {
            let timer = null;
            const _this = this;
            cancelAnimationFrame(timer);
            timer = requestAnimationFrame(function fn() {
                if (_this.scrollTop > 5000) {
                    _this.scrollTop -= 1000;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = _this.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (_this.scrollTop > 1000 && _this.scrollTop <= 5000) {
                    _this.scrollTop -= 500;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = _this.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (_this.scrollTop > 200 && _this.scrollTop <= 1000) {
                    _this.scrollTop -= 100;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = _this.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (_this.scrollTop > 50 && _this.scrollTop <= 200) {
                    _this.scrollTop -= 10;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = _this.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (_this.scrollTop > 0 && _this.scrollTop <= 50) {
                    _this.scrollTop -= 5;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = _this.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else {
                    cancelAnimationFrame(timer);
                    _this.toTopShow = false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.scroll-to-top {
    width: 40px;
    height: 40px;
    background: rgba(72, 123, 255, 0.88);
    position: fixed;
    bottom: 47px;
    right: 30px;
    z-index: 99999;
    border-radius: 50%;
    text-align: center;
    color: white;
    cursor: pointer;
    i {
        font-size: 18px;
        display: block;
    }
    span {
        font-size: 12px;
        display: block;
    }
}
</style>
