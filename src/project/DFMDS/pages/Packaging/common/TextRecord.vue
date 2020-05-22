<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="currentFormDataGroup.pkgText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { PKG_API } from 'common/api/api';

@Component({
    name: 'TextRecord'
    })

export default class TextRecord extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact

    currentFormDataGroup: TextObj = {
        pkgText: '', // 文本
        factory: '', // 工厂
        id: '', // 主键
        orderId: '', // 订单ID
        orderNo: '' // 订单号
    }

    init(data) {
        console.log('textRecord带进来的 data')
        console.log(data)
        this.currentFormDataGroup = data
    }

    returnDataGroup() {
        return this.currentFormDataGroup
    }

    // getDataInfo(formHeader: object) {
    //     PKG_API.PKG_TEXT_QUERY_API({ factory: formHeader['factory'], orderNo: formHeader['orderNo'] }).then(({ data }) => {
    //         if (data.code === 200) {
    //             if (data.data.length !== 0) {
    //                 this.pkgText = data.data[0]['pkgText']
    //             }
    //         }
    //     });
    // }
}
interface TextObj{
    pkgText?: string ; // 文本
    factory?: string ; // 工厂
    id?: string ; // 主键
    orderId?: string ; // 订单ID
    orderNo?: string ; // 订单号
}
</script>

<style lang="scss" scoped>
</style>
