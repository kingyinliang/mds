<template>
    <el-dialog :close-on-click-modal="false" :visible.sync="visible">
        <el-form :model="dataForm" label-width="120px" size="small" />
    </el-dialog>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class StePkgAddOrUpdate extends Vue {
        visible = false;
        dataForm = {}
    }
</script>

<style scoped>

</style>
