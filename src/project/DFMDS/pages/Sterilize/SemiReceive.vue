<template>
    <div>
        <data-entry
            ref="dataEntry"
            redact-auth="steSemiEdit"
            save-auth="steSemiEdit"
            submit-auth="steSemiSubmit"
            :order-status="formHeader.statusName"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            :submit-rules="submitRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @success="getOrderList"
        >
            <template slot="1" slot-scope="data">
                <semi-receive ref="semiReceive" :is-redact="data.isRedact" />
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
    import { STE_API } from 'common/api/api';
    import SemiReceive from './common/SemiReceive.vue';

    @Component({
        name: 'SemiReceiveIndex',
        components: {
            SemiReceive
        }
    })
    export default class SemiReceiveIndex extends Vue {
        $refs: {
            semiReceive: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        formHeader: OrderData = {};
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

        tabs: TabsObj[] = [
            {
                label: '半成品领用',
                status: '未录入'
            },
            {
                label: '异常记录'
            },
            {
                label: '文本记录'
            }
        ];

        submitRules(): Function[] {
            return [this.$refs.semiReceive.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        mounted() {
            this.getOrderList()
        }

        // 查询表头
        getOrderList() {
            if (!this.isAuth('steSemiQuery')) {
                this.$warningToast('无权限');
                return false
            }
            STE_API.STE_DETAIL_CRAFTHEADER_INFO_API({
                potOrderNo: this.$store.state.sterilize.SemiReceive.potOrderMap.potOrderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.textStage = 'semiReceive';
                this.tabs[0].status = this.formHeader.steTagPot.semiMaterialStatus
                this.$refs.semiReceive.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'semiReceive');
                this.$refs.textRecord.init(this.formHeader, 'sterilize');
            })
        }

        savedDatas() {
            const steSemi = this.$refs.semiReceive.savedData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'semiReceive');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_SEMI_SAVE_API({
                ...steSemi,
                steExceptionInsertDtos: excRequest.InsertDto,
                steExceptionUpdateDtos: excRequest.UpdateDto,
                steExceptionRemoveDto: excRequest.ids,
                steTextInsertDto: textRequest.pkgTextInsert,
                steTextUpdateDto: textRequest.pkgTextUpdate
            })
        }

        submitDatas() {
            const steSemi = this.$refs.semiReceive.savedData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'semiReceive');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'sterilize');

            return STE_API.STE_SEMI_SUBMIT_API({
                ...steSemi,
                steExceptionInsertDtos: excRequest.InsertDto,
                steExceptionUpdateDtos: excRequest.UpdateDto,
                steExceptionRemoveDto: excRequest.ids,
                steTextInsertDto: textRequest.pkgTextInsert,
                steTextUpdateDto: textRequest.pkgTextUpdate
            })
        }
    }
    interface TabsObj {
        label?: string;
        status?: string;
    }
    interface StatusObj {
        semiMaterialStatus?: string;
    }
    interface OrderData {
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        steTagPot?: StatusObj;
    }
</script>

<style scoped>

</style>
