<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="currentFormDataGroup.pkgText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { PKG_API } from 'common/api/api';
import _ from 'lodash';

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

    orgFormDataGroup: TextObj = {}
    isChange=false
    isNewForm=false

    init(dataGroup) {
        console.log('textRecord 带进来的 data')
        console.log(dataGroup)
        if (dataGroup !== null) {
            this.currentFormDataGroup = dataGroup
            this.orgFormDataGroup = JSON.parse(JSON.stringify(this.currentFormDataGroup))
            this.isNewForm = false
        } else {
            this.isNewForm = true
        }
    }

    executeSave() {

        if (this.isNewForm) {
            if (this.isChange) {
                return true
            }
            return false
        }

        this.isChange = _.isEqual(this.orgFormDataGroup, this.currentFormDataGroup)
        if (this.isChange) {
            return false
        }
            return true

    }

    returnDataGroup() {
        return JSON.parse(JSON.stringify(this.currentFormDataGroup))
    }

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
