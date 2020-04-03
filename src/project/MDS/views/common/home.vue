<template>
    <div>
        <img src="@/assets/img/index.svg" style=" display: block; width: 80%; margin: 120px auto;" alt="welcome">
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
        console.log(this.version);
    },
    methods: {}
};
</script>

<style scoped></style>
