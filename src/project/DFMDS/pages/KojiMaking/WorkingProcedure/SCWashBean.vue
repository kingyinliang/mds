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
                <wash-bean-material-apply ref="washBeanMaterialApply" :is-redact="data.isRedact" :sieve-total-num="sieveTotalNum" @setMaterialTable="setMaterialTable" />
            </template>
            <template slot="2" slot-scope="data">
                <wash-bean-material-craft ref="washBeanMaterialCraft" :is-redact="data.isRedact" :set-material-table-data="setMaterialTableData" @changeSieveTotalNum="changeSieveTotalNum" />
            </template>
            <template slot="3" slot-scope="data">
                <koji-exc-record ref="excRecord" :is-redact="data.isRedact" :form-header="formHeader" />
            </template>
            <template slot="4" slot-scope="data">
                <koji-text-record ref="textRecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';

    import WashBeanMaterialApply from './common/WashBeanMaterialApply.vue';
    import WashBeanMaterialCraft from './common/WashBeanMaterialCraft.vue';
    import KojiExcRecord from './common/KojiExcRecord.vue';
    import KojiTextRecord from './common/KojiTextRecord.vue';

    @Component({
        name: 'WashBeanIndex',
        components: {
            WashBeanMaterialApply,
            WashBeanMaterialCraft,
            KojiExcRecord,
            KojiTextRecord
        }
    })
    export default class WashBeanIndex extends Vue {
        $refs: {
            washBeanMaterialApply: HTMLFormElement;
            washBeanMaterialCraft: HTMLFormElement;
            excRecord: HTMLFormElement;
            textRecord: HTMLFormElement;
        }

        formHeader: OrderData = {};

        // 杂质数量
        sieveTotalNum = 0;
        // 物料领用记录 == 批次信息
        setMaterialTableData = [];

        changeSieveTotalNum(num) {
            this.sieveTotalNum = num;
        }

        setMaterialTable(data) {
            this.setMaterialTableData = data
        }

        headerBase = [
            {
                type: 'p',
                label: '生产车间',
                icon: 'factory-shengchanchejian',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialName', 'materialCode']
            },
            {
                type: 'p',
                label: '生产订单',
                icon: 'factory-bianhao',
                value: 'orderNo'
            },
            {
                type: 'p',
                label: '订单日期',
                icon: 'factory--meirijihuachanliangpeizhi',
                value: 'orderStartDate'
            },
            {
                type: 'tooltip',
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
                label: '物料领用'
            },
            {
                label: '工艺控制'
            },
            {
                label: '异常记录'
            },
            {
                label: '文本记录'
            }
        ];

        submitRules(): Function[] {
            return [this.$refs.washBeanMaterialCraft.ruleSubmit, this.$refs.excRecord.ruleSubmit]
        }

        mounted() {
            this.getOrderList();
        }

        // 查询表头
        getOrderList() {
            COMMON_API.OREDER_QUERY_BY_NO_API({
                orderNo: this.$store.state.koji.orderScInfo.orderNo || ''
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.textStage = 'SC';
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
                this.$refs.washBeanMaterialApply.init(this.formHeader);
                this.$refs.washBeanMaterialCraft.init(this.formHeader);
                this.$refs.excRecord.init(this.formHeader, 'SC');
                this.$refs.textRecord.init(this.formHeader, 'koji');
            })
        }

        savedDatas() {
            const steSemi = this.$refs.washBeanMaterialCraft.getSavedOrSubmitData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'SC');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');

            return KOJI_API.KOJI_XD_SAVE_API({
                ...steSemi,
                kojiExceptionSaveDto: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                kojiTextSaveDto: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo
            })
        }

        submitDatas() {
            const steSemi = this.$refs.washBeanMaterialCraft.getSavedOrSubmitData(this.formHeader);
            const excRequest = this.$refs.excRecord.getSavedOrSubmitData(this.formHeader, 'SC');
            const textRequest = this.$refs.textRecord.savedData(this.formHeader, 'koji');

             return KOJI_API.KOJI_XD_SUBMIT_API({
                ...steSemi,
                kojiExceptionSaveDto: {
                    insertDatas: excRequest.InsertDto,
                    removeIds: excRequest.ids,
                    updateDatas: excRequest.UpdateDto
                },
                kojiTextSaveDto: textRequest.pkgTextInsert,
                kojiOrderNo: this.formHeader.kojiOrderNo,
                orderNo: this.formHeader.orderNo
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
        orderNo?: string;
        kojiHouseNo?: string;
        kojiOrderNo?: string;
        textStage?: string;
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
        steTagPot?: StatusObj;
    }
</script>
