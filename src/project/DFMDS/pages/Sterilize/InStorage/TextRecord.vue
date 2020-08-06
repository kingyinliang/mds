<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="currentFormDataGroup.text" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    // import { PKG_API, STE_API } from 'common/api/api';
    import { STE_API } from 'common/api/api';
    // import _ from 'lodash';

    @Component({
        name: 'TextRecord'
    })

    export default class TextRecord extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        currentFormDataGroup: TextObj = {
            text: '', // 文本
            factory: '', // 工厂
            id: '', // 主键
            orderId: '', // 订单ID
            orderNo: '' // 订单号
        }

        orgFormDataGroup: TextObj = {
            text: '', // 文本
            factory: '', // 工厂
            id: '', // 主键
            orderId: '', // 订单ID
            orderNo: '' // 订单号
        }

        isChange=false
        isNewForm=false

        init(orderNo, workShop?) {
            // 车间陆续增加
            if (workShop === 'sterilize') {
                STE_API.STE_DETAIL_TEXT_API({
                    // potOrderNo: formHeader.potOrderNo,
                    orderNo: orderNo
                    // textStage: formHeader.textStage
                }).then(({ data }) => {
                    console.log('文本data')
                    console.log(data)
                    this.getData(data);
                })
            } else {
                // PKG_API.PKG_TEXT_QUERY_API({
                //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                //     orderNo: formHeader.orderNo
                // }).then(({ data }) => {
                //     this.getData(data);
                // })
            }
        }

        getData(data) {
            if (data.data !== null) {
                this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data))
                this.orgFormDataGroup = JSON.parse(JSON.stringify(data.data))
                this.isNewForm = false
            } else {
                this.isNewForm = true
            }
        }

        savedData(formHeader, workShop?) {
            let pkgTextInsert: TextObj = {};
            let pkgTextUpdate: TextObj = {};
            // if (!_.isEqual(this.orgFormDataGroup, this.currentFormDataGroup)) {
            //     this.currentFormDataGroup.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            //     this.currentFormDataGroup.orderId = formHeader.id;
            //     this.currentFormDataGroup.orderNo = formHeader.orderNo;
            //     if (this.isNewForm) {
            //         pkgTextInsert = this.currentFormDataGroup
            //     } else {
            //         pkgTextUpdate = this.currentFormDataGroup
            //     }
            // }
            if (workShop === 'sterilize') {
                this.currentFormDataGroup.orderId = formHeader.orderId;
                this.currentFormDataGroup.orderNo = formHeader.orderNo;
                this.currentFormDataGroup.potOrderId = formHeader.id;
                this.currentFormDataGroup.potOrderNo = formHeader.potOrderNo;
                this.currentFormDataGroup.textStage = formHeader.textStage;
            } else {
                this.currentFormDataGroup.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                this.currentFormDataGroup.orderId = formHeader.id;
                this.currentFormDataGroup.orderNo = formHeader.orderNo;
            }
            if (this.isNewForm && this.currentFormDataGroup.text !== '') {
                pkgTextInsert = this.currentFormDataGroup;
            } else {
                // eslint-disable-next-line
                if (this.currentFormDataGroup.text !== this.orgFormDataGroup.text) {
                    pkgTextUpdate = this.currentFormDataGroup;
                }
            }
            return {
                pkgTextInsert,
                pkgTextUpdate
            }
        }
    }
    interface TextObj{
        text?: string ; // 文本记录
        factory?: string ; // 工厂
        id?: string ; // 主键 （更新用参数）
        orderId?: string ; // 订单主键 ID
        orderNo?: string ; // 订单号
        potOrderId?: string; // 锅单主键
        potOrderNo?: string; // 锅单号
        textStage?: string; // 异常阶段（半成品、工艺、辅料、入库）
    }
</script>

<style lang="scss" scoped>
</style>
