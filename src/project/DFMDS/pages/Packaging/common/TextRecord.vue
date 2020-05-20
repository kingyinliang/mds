<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="textObj.pkgText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'TextRecord'
    })

export default class TextRecord extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact

    textObj: TextObj ={
        pkgText: ''
    }


}
interface TextObj{
    pkgText: string;
}
</script>

<style lang="scss" scoped>
</style>
