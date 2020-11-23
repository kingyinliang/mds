<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :order-status-show="false"
            :head-show="false"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class OpenPotDedail extends Vue {
    }
</script>

<style scoped>

</style>
