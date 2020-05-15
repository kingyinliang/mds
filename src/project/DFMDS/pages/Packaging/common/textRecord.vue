<template>
    <div>
        <mds-card title="文本记录" :name="'textRecord'">
            <el-input v-model="textObj.pkgText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
        </mds-card>
    </div>
</template>

<script>
export default {
    name: 'PendingNum',
    components: {
    },
    props: {
        isRedact: {
            type: Boolean
        }
    },
    data() {
        return {
            textObj: {}
        }
    },
    methods: {}
}
</script>

<style lang="scss" scoped>
</style>
