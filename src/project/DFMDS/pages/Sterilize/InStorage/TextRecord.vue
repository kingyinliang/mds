<template lang="pug">
    mds-card(title="文本记录" :name="'textRecord'")
        el-input(v-model="currentFormDataGroup.text" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;")
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
            // factory: '', // 工厂
            id: '', // 主键
            orderId: '', // 订单ID
            orderNo: '', // 订单号
            potOrderId: '', // 锅单主键
            potOrderNo: '', // 锅单号
            textStage: 'INSTORAGE' // 异常阶段（半成品、工艺、辅料、入库）
        }

        orgFormDataGroup: TextObj = {
            text: '', // 文本
            // factory: '', // 工厂
            id: '', // 主键
            orderId: '', // 订单ID
            orderNo: '', // 订单号
            potOrderId: '', // 锅单主键
            potOrderNo: '', // 锅单号
            textStage: 'INSTORAGE' // 异常阶段（半成品、工艺、辅料、入库）
        }

        isNewForm=false

        initData() {
            this.currentFormDataGroup = {
                text: '', // 文本
                // factory: '', // 工厂
                id: '', // 主键
                orderId: '', // 订单ID
                orderNo: '', // 订单号
                potOrderId: '', // 锅单主键
                potOrderNo: '', // 锅单号
                textStage: 'INSTORAGE' // 异常阶段（半成品、工艺、辅料、入库）
            }
            this.orgFormDataGroup = {
                text: '', // 文本
                // factory: '', // 工厂
                id: '', // 主键
                orderId: '', // 订单ID
                orderNo: '', // 订单号
                potOrderId: '', // 锅单主键
                potOrderNo: '', // 锅单号
                textStage: 'INSTORAGE' // 异常阶段（半成品、工艺、辅料、入库）
            }
        }

        init(orderNo, workShop?, clear?) {
            if (clear) {
                this.currentFormDataGroup.text = ''
                return
            }

            // 车间陆续增加
            if (workShop === 'sterilize') {
                STE_API.STE_DETAIL_TEXT_API({
                    // potOrderNo: formHeader.potOrderNo,
                    orderNo: orderNo,
                    textStage: 'INSTORAGE'
                }).then(({ data }) => {
                    console.log('文字调整')
                    console.log(data)
                    if (data.data !== null) {
                        this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data))
                        this.orgFormDataGroup = JSON.parse(JSON.stringify(data.data))
                        this.isNewForm = false
                    } else {
                        this.isNewForm = true
                    }
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


        savedData(formHeader, workShop?) {
            console.log('formHeader')
            console.log(formHeader)
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
                // this.currentFormDataGroup.potOrderId = formHeader.id;
                // this.currentFormDataGroup.potOrderNo = formHeader.potOrderNo;
                this.currentFormDataGroup.textStage = 'INSTORAGE';
            }
            if (this.isNewForm && this.currentFormDataGroup.text !== '') {
                pkgTextInsert = this.currentFormDataGroup;
            } else if (this.currentFormDataGroup.text !== this.orgFormDataGroup.text) {
                pkgTextUpdate = this.currentFormDataGroup;
            }
            this.initData()
            return {
                pkgTextInsert,
                pkgTextUpdate
            }
        }

        ruleSubmit() {
            // if (!this.craftInfo.feedStartDate || !this.craftInfo.feeEndDate || !this.craftInfo.riseStartDate || !this.craftInfo.riseEndDate) {
            //     this.$warningToast('请填写工艺控制页签时间必填项');
            //     return false;
            // }
            // if (this.craftTable.filter(it => it.delFlag !== 1).length === 0) {
            //     this.$warningToast('请录入工艺控制页签杀菌时间及温度数据');
            //     return false;
            // }

            // for (const item of this.craftTable.filter(it => it.delFlag !== 1)) {
            //     if (!item.controlType || !item.controlStage) {
            //         this.$warningToast('请填写工艺控制页签杀菌时间及温度类型、阶段');
            //         return false;
            //     }
            //     if ((item.controlStage === 'START' || item.controlStage === 'END' || item.controlStage === 'DISCHARGE_START' || item.controlStage === 'DISCHARGE_END') && !item.recordDate) {
            //         this.$warningToast('请填写工艺控制页签杀菌时间及温度下记录时间');
            //         return false;
            //     }
            // }
            return true;
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
