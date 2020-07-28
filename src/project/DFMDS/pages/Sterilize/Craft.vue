<template>
    <div>
        <data-entry
            ref="dataEntry"
            :redact-auth="'pkg:order:update'"
            :save-auth="'pkg:order:update'"
            :submit-auth="'pkg:order:update'"
            :order-status="formHeader.orderStatusName"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            :submit-rules="submitRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @success="getList"
        >
            <template slot="1" slot-scope="data">
                <craft ref="craft" :is-redact="data.isRedact" />
            </template>
            <template slot="2" slot-scope="data">
                <exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
            </template>
            <template slot="3" slot-scope="data">
                <text-record ref="textRecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import Craft from './common/Craft.vue';
    import { STE_API } from 'common/api/api';

    @Component({
        name: 'CraftIndex',
        components: {
            Craft
        }
    })
    export default class CraftIndex extends Vue {
        $refs: {
            craft: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        formHeader: FormHeader = {};
        headerBase = [
            {
                type: 'p',
                label: '生产车间',
                icon: 'factory-shengchanchejian',
                value: 'workShopName'
            },
            {
                type: 'p',
                label: '生产锅号',
                icon: 'factory-qiyaguanjianhua',
                value: 'potNo'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                label: '生产锅序',
                icon: 'factory-bianhao',
                value: 'potOrder'
            },
            {
                type: 'p',
                label: '生产产量',
                icon: 'factory--meirijihuachanliangpeizhi',
                value: 'potAmount'
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '生产日期',
                value: 'productDate'
            },
            {
                type: 'p',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        tabs = [
            {
                label: '工艺控制',
                status: '未录入'
            },
            {
                label: '异常记录'
            },
            {
                label: '文本记录'
            }
        ];

        mounted() {
            this.getDetailInfo();
        }

        getDetailInfo() {
            STE_API.STE_DETAIL_CRAFTHEADER_INFO_API({
                potOrderNo: this.$store.state.sterilize.Craft.potOrderMap.potOrderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.textStage = 'craft';
                this.$refs.craft.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'craft');
                this.$refs.textRecord.init(this.formHeader, 'sterilize');
            });
        }

        // 保存
        savedDatas() {
            // this.formHeader.textStage = 'craft';
            const craftRequest = this.$refs.craft.getSavedOrSubmitData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'craft');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_DETAIL_CRAFT_SAVED_API({
                steControlInsertDto: craftRequest.steControlInsertDto,
                steControlUpdateDto: craftRequest.steControlUpdateDto,
                steItemRemoveDto: craftRequest.ids,
                steExceptionInsertDtos: excRequest.InsertDto,
                steExceptionUpdateDtos: excRequest.UpdateDto,
                steExceptionRemoveDto: excRequest.ids,
                steTextInsertDto: textRequest.pkgTextInsert,
                steTextUpdateDto: textRequest.pkgTextUpdate
            })
        }

        // 提交校验
        submitRules(): Function[] {
            return [this.$refs.craft.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        // 提交
        submitDatas() {
            const craftRequest = this.$refs.craft.getSavedOrSubmitData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'craft');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_DETAIL_CRAFT_SUBMIT_API({
                steControlInsertDto: craftRequest.steControlInsertDto,
                steControlUpdateDto: craftRequest.steControlUpdateDto,
                steExceptionInsertDtos: excRequest.InsertDto,
                steExceptionUpdateDtos: excRequest.UpdateDto,
                steExceptionRemoveDto: excRequest.ids,
                steTextInsertDto: textRequest.pkgTextInsert,
                steTextUpdateDto: textRequest.pkgTextUpdate
            })
        }

        // 数据拉取
        getList() {
            this.getDetailInfo();
        }
    }
interface FormHeader{
    textStage?: string;
    changed?: string;
    changer?: string;
    factory?: string;
    factoryName?: string;
    id?: string;
    materialCode?: string;
    materialName?: string;
    orderId?: string;
    orderNo?: string;
    potAmount?: string;
    potNo?: string;
    potOrder?: string;
    potOrderNo?: string;
    potUnit?: string;
    productDate?: string;
    status?: string;
    workShop?: string;
    workShopName?: string;
}
</script>

<style scoped>

</style>
