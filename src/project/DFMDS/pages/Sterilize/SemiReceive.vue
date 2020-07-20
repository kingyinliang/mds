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
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
        >
            <template slot="1" slot-scope="data">
                <semi-receive ref="semiReceive" :is-redact="data.isRedact" />
            </template>
            <template slot="2" slot-scope="data">
                <exc-record ref="ExcRecord" :is-redact="data.isRedact" />
            </template>
            <template slot="3" slot-scope="data">
                <text-record ref="textRecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
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
                value: ['planOutput', 'outputUnit']
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

        mounted() {
            this.getOrderList()
        }

        // 查询表头
        getOrderList() {
            COMMON_API.OREDER_QUERY_BY_NO_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.$store.state.sterilize.SemiReceive.orderNoMap.orderNo
            }).then(({ data }) => {
                this.formHeader = data.data;
                this.formHeader.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptName;
                this.formHeader.potNo = this.$store.state.sterilize.SemiReceive.potNo;
                this.formHeader.potOrder = this.$store.state.sterilize.SemiReceive.potOrderMap.potOrder;
                this.$refs.semiReceive.init();
            })
        }

        savedDatas() {
            return STE_API.STE_SEMI_SAVE_API({})
        }

        submitDatas() {
            return STE_API.STE_SEMI_SUBMIT_API({})
        }
    }
    interface OrderData {
        factoryName?: string;
        potNo?: string;
        potOrder?: string;
    }
</script>

<style scoped>

</style>
