<template>
    <mds-card title="文本记录" :name="'textRecord'">
        <el-input v-model="currentFormDataGroup.kojiText" type="textarea" :rows="7" :disabled="!isRedact" style="width: 100%; height: 200px;" />
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';

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
            console.log(formHeader)
            if (workShop === 'koji') {
                KOJI_API.KOJI_TEXT_QUERY_API({
                    orderNo: formHeader.orderNo,
                    kojiOrderNo: formHeader.kojiHouseNo,
                    textStage: formHeader.textStage
                }).then(({ data }) => {
                    this.getData(data, formHeader);
                })
            }
        }

        getData(data, formHeader) {
            if (data.data && data.data.kojiText) {
                this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data))
            } else {
                this.currentFormDataGroup = {
                    kojiText: '', // 文本
                    id: '', // 主键
                    orderNo: formHeader.orderNo, // 订单号
                    kojiOrderNo: formHeader.kojiHouseNo || '', // 曲房单号
                    textStage: formHeader.textStage // 工艺
                }
            }
        }

        savedData() {
            let pkgTextInsert: TextObj = {};
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
