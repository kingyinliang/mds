<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="currentFormDataGroup.text" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';
    // import _ from 'lodash';

    @Component({
        name: 'KojiTextRecord'
    })

    export default class KojiTextRecord extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        currentFormDataGroup: TextObj = {
            kojiText: '', // 文本
            id: '', // 主键
            orderNo: '', // 订单号
            kojiOrderNo: '', // 曲房单号
            textStage: '' // 工艺
        }

        isChange=false
        isNewForm=false

        init(formHeader, workShop?) {
            if (workShop === 'koji') {
                KOJI_API.KOJI_TEXT_QUERY_API({
                    kojiOrderNo: formHeader.kojiHouseNo || formHeader.orderNo,
                    textStage: formHeader.textStage
                }).then(({ data }) => {
                    this.getData(data);
                })
            }
        }

        getData(data) {
            if (data.data !== null) {
                this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data))
            } else {
                this.currentFormDataGroup = {
                    kojiText: '', // 文本
                    id: '', // 主键
                    orderNo: '', // 订单号
                    kojiOrderNo: '', // 曲房单号
                    textStage: '' // 工艺
                }
            }
        }

        savedData(formHeader, workShop?) {
            let pkgTextInsert: TextObj = {};
            if (workShop === 'koji') {
                this.currentFormDataGroup.kojiText = formHeader.kojiText;
                this.currentFormDataGroup.id = formHeader.id;
                this.currentFormDataGroup.orderNo = formHeader.orderNo;
                this.currentFormDataGroup.kojiOrderNo = formHeader.kojiOrderNo;
                this.currentFormDataGroup.textStage = formHeader.textStage;
            }
            pkgTextInsert = this.currentFormDataGroup;
            return {
                pkgTextInsert
            }
        }
    }
    interface TextObj{
        kojiText?: string ; // 文本记录
        factory?: string ; // 工厂
        id?: string ; // 主键 （更新用参数）
        orderNo?: string ; // 订单号
        kojiOrderNo?: string;
        textStage?: string; // 异常阶段（半成品、工艺、辅料、入库）
    }
</script>

<style lang="scss" scoped>
</style>
