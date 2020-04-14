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
        // const dom = document.getElementsByClassName('site-content__wrapper')[0];
        // dom.addEventListener('scroll', this.handleScroll, true);
        // dom.removeEventListener('scroll', this.handleScroll, true);
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
            const that = this;// eslint-disable-line
            cancelAnimationFrame(timer);
            timer = requestAnimationFrame(function fn() {
                if (that.scrollTop > 5000) {
                    that.scrollTop -= 1000;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = that.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (that.scrollTop > 1000 && that.scrollTop <= 5000) {
                    that.scrollTop -= 500;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = that.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (that.scrollTop > 200 && that.scrollTop <= 1000) {
                    that.scrollTop -= 100;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = that.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (that.scrollTop > 50 && that.scrollTop <= 200) {
                    that.scrollTop -= 10;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = that.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else if (that.scrollTop > 0 && that.scrollTop <= 50) {
                    that.scrollTop -= 5;
                    document.getElementsByClassName('site-content__wrapper')[0].scrollTop = that.scrollTop;
                    timer = requestAnimationFrame(fn);
                } else {
                    cancelAnimationFrame(timer);
                    that.toTopShow = false;
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.scroll-to-top {
    position: fixed;
    right: 30px;
    bottom: 47px;
    z-index: 99999;
    width: 40px;
    height: 40px;
    color: white;
    text-align: center;
    background: rgba(72, 123, 255, 0.88);
    border-radius: 50%;
    cursor: pointer;
    i {
        display: block;
        font-size: 18px;
    }
    span {
        display: block;
        font-size: 12px;
    }
}
</style>
