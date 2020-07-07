<template>
    <mds-card :title="'录入数据单位：MIN'" :name="'exc'" :icon-bg="'#f05c4a'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="AddExcDate(ExcDate)">
                    新增
                </el-button>
            </div>
        </template>
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component({
        name: 'ExcRecord'
    })
    export default class ExcRecord extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        AddExcDate(data) {
            console.log(data);
        }
    }
</script>

<style scoped>

</style>
