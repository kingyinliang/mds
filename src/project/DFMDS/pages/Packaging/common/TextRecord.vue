<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="pkgText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PKG_API } from 'common/api/api';

@Component({
    name: 'TextRecord'
    })

export default class TextRecord extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact

    pkgText = ''

    getDataInfo(formHeader: object) {
        PKG_API.PKG_TEXT_QUERY_API({ factory: formHeader['factory'], orderNo: formHeader['orderNo'] }).then(({ data }) => {
            if (data.code === 200) {
                if (data.data.length !== 0) {
                    this.pkgText = data.data[0]['pkgText']
                }
            }
        });
    }
}
// interface TextObj{
//     pkgText: string;
// }
</script>

<style lang="scss" scoped>
</style>
