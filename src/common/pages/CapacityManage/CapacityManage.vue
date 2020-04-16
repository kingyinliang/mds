<template>
    <div>
        <org-view
            :title="'产能管理'"
            :right-tile="'产能信息'"
            @treeNodeClick="getData"
        />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component({
        components: {
        }
    })
    export default class CapacityManage extends Vue {
        getData(row) {
            console.log(row);
        }
    }
</script>

<style scoped>

</style>
