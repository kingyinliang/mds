<template>
    <img :src="url" :style="{ height: height }" alt="">
</template>

<script lang="ts">
import { COMMON_API } from 'common/api/api';
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({
    name: 'ImageComp'
})
export default class ImageComp extends Vue {

    @Prop({ type: String, default: '' }) s3Path;
    @Prop({ type: String, default: '' }) height;

    url = '';

    @Watch('s3Path')
    getImgByKey() {
        COMMON_API.DOWNLOADFILE_API({
            key: this.s3Path
        }).then((res) => {
            this.url = res.data.data.url;
        })
    }

    mounted() {
        this.getImgByKey()
    }
}
</script>

<style>

</style>
