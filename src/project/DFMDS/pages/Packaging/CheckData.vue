<template>
    <data-entry
        ref="dataEntry"
        redact-auth="pkgCkdEdit"
        save-auth="pkgCkdSave"
        :order-status-show="false"
        :header-base="headerBase"
        :form-header="formHeader"
        :tabs="tabs"
        :redact-box-status="false"
        :saved-datas="sentData"
        :cancel-datas="cancelData"
    >
        <template slot="1" slot-scope="data">
            <seal ref="seal" :is-redact="data.isRedact" />
        </template>
        <template slot="2" slot-scope="data">
            <weight ref="weight" :is-redact="data.isRedact" />
        </template>
        <template slot="3" slot-scope="data">
            <nr ref="nr" :is-redact="data.isRedact" />
        </template>
        <template slot="4" slot-scope="data">
            <torque ref="torque" :is-redact="data.isRedact" />
        </template>
    </data-entry>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';
    import Seal from './CheckData/Seal.vue';
    import Weight from './CheckData/Weight.vue';
    import Nr from './CheckData/Nr.vue';
    import Torque from './CheckData/Torque.vue';

    @Component({
        components: {
            Seal,
            Weight,
            Nr,
            Torque
        }
    })

    export default class PackagingDetail extends Vue {
        $refs: {
            seal: HTMLFormElement;
            weight: HTMLFormElement;
            nr: HTMLFormElement;
            torque: HTMLFormElement;
        }

        formHeader: HeaderData = {}
        dataGroup: SendData = {}; // 提交物件

        headerBase = [
            {
                type: 'p',
                label: '生产车间',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                label: '生产产线',
                value: 'productLineName'
            },
            {
                type: 'tooltip',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                label: '订单产量',
                value: ['planOutput', 'outputUnit']
            },
            {
                type: 'p',
                label: '订单日期',
                value: ['orderStartDate']
            },
            {
                type: 'p',
                label: '生产日期',
                value: 'productDate'
            },
            {
                type: 'p',
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'tooltip',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        tabs = [
            {
                label: '密封度检测',
                isRedact: false
            },
            {
                label: '称重记录',
                isRedact: false
            },
            {
                label: 'NR检测',
                isRedact: false
            },
            {
                label: '扭力检测',
                isRedact: false
            }
        ];

        created() {
            this.formHeader = this.$store.state.packaging.packCheckData
            console.log(this.formHeader)
        }

        mounted() {
            this.initData()
        }

        initData() {
            if (!this.isAuth('pkgCkdQuery')) {
                this.$warningToast('无权限');
                return false
            }
            this.$refs.seal.init(this.formHeader)
            this.$refs.weight.init(this.formHeader)
            this.$refs.nr.init(this.formHeader)
            this.$refs.torque.init(this.formHeader)
        }

        sentData() {
            if (!this.$refs.seal.sealDataRul()) {
                return false;
            }
            if (!this.$refs.weight.weightDataRul()) {
                return false;
            }
            if (!this.$refs.nr.nrDataRul()) {
                return false;
            }
            if (!this.$refs.torque.torqueDataRul()) {
                return false;
            }
            this.dataGroup.pkgSealData = this.$refs.seal.returnSealData()
            this.dataGroup.pkgWeightData = this.$refs.weight.returnWeightData()
            this.dataGroup.pkgNrData = this.$refs.nr.returnNrData()
            this.dataGroup.pkgTorqueData = this.$refs.torque.returnTorqueData()
            return PKG_API.PKG_CHECKDATA_SAVE_API(this.dataGroup).then(() => {
                this.$refs['dataEntry']['isRedact'] = false
                //防止查询数据失败
                this.$refs.seal.sealList = []
                this.$refs.weight.weightList = []
                this.$refs.nr.nrList = []
                this.$refs.torque.torqueList = []
                this.initData() // 刷新
            })
        }

        cancelData() {
            this.$refs.seal.cancelSealData()
            this.$refs.weight.cancelWeightData()
            this.$refs.nr.cancelNrData()
            this.$refs.torque.cancelTorqueData()
        }
    }
interface HeaderData{
    workShop?: string;
    workShopName?: string;
    productLine?: string;
    productLineName?: string;
    materialCode?: string;
    materialName?: string;
    orderNo?: string;
    id?: string;
    planOutput?: number;
    outputUnit?: string;
    orderStartDate?: string;
    productDate?: string;
    changed?: string;
    changer?: string;
}

interface SendData{
    pkgSealData?: object;
    pkgWeightData?: object;
    pkgNrData?: object;
    pkgTorqueData?: object;
}


</script>

<style>
</style>
