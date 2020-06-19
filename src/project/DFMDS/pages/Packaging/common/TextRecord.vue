<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="currentFormDataGroup.pkgText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PKG_API } from 'common/api/api';
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

    orgFormDataGroup: TextObj = {
        pkgText: '', // 文本
        factory: '', // 工厂
        id: '', // 主键
        orderId: '', // 订单ID
        orderNo: '' // 订单号
    }

    isChange=false
    isNewForm=false

    init(formHeader) {
        PKG_API.PKG_TEXT_QUERY_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            if (data.data !== null) {
                this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data))
                this.orgFormDataGroup = JSON.parse(JSON.stringify(data.data))
                this.isNewForm = false
            } else {
                this.isNewForm = true
            }
        })
    }

    savedData(formHeader) {
        let pkgTextInsert: TextObj = {};
        let pkgTextUpdate: TextObj = {};
        if (!_.isEqual(this.orgFormDataGroup, this.currentFormDataGroup)) {
            this.currentFormDataGroup.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            this.currentFormDataGroup.orderId = formHeader.id;
            this.currentFormDataGroup.orderNo = formHeader.orderNo;
            if (this.isNewForm) {
                pkgTextInsert = this.currentFormDataGroup
            } else {
                pkgTextUpdate = this.currentFormDataGroup
            }
        }
        return {
            pkgTextInsert,
            pkgTextUpdate
        }
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
