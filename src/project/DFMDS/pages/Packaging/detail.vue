<template>
    <data-entry
        ref="dataEntry"
        :redact-auth="'pkg:order:update'"
        :save-auth="'pkg:order:update'"
        :submit-auth="'pkg:order:update'"
        :order-status="orderStatus"
        :header-base="headerBase"
        :form-header="formHeader"
        :tabs="tabs"
    >
        <template slot="1" slot-scope="data">
            <ready-time ref="readytime" :is-redact="data.isRedact" />
        </template>
        <template slot="2" slot-scope="data">
            <product-people ref="productPeople" :is-redact="data.isRedact" />
        </template>
        <template slot="4" slot-scope="data">
            <product-in-storage ref="productInStorage" :is-redact="data.isRedact" />
        </template>
        <template slot="5" slot-scope="data">
            <material ref="material" :is-redact="data.isRedact" />
        </template>
        <template slot="6" slot-scope="data">
            <pending-num ref="PendingNum" :is-redact="data.isRedact" />
        </template>
        <template slot="7" slot-scope="data">
            <text-record ref="textRecord" :is-redact="data.isRedact" />
        </template>
    </data-entry>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';
    import ReadyTime from './common/ReadyTimes.vue';
    import Material from './common/Material.vue';
    import ProductPeople from './common/ProductPeople.vue';
    import PendingNum from './common/PendingNum.vue';
    import TextRecord from './common/TextRecord.vue';
    import ProductInStorage from './common/ProductInStorage.vue';


    @Component({
        components: {
            ReadyTime,
            ProductPeople,
            PendingNum,
            TextRecord,
            Material,
            ProductInStorage
        }
    })
    export default class PackagingDetail extends Vue {
        orderStatus = ''

        formHeader = {}
        orderData: OrderData = {}

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShop'
            },
            {
                type: 'p',
                icon: 'factory-shengchanxian',
                label: '生产产线',
                value: 'productLineName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '订单产量',
                value: ['planOutput', 'outputUnit']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: ['planOutput', 'outputUnit']
            },
            {
                type: 'date-picker',
                icon: 'factory-riqi1',
                label: '生产日期',
                value: 'productDate'
            },
            {
                type: 'p',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员',
                value: 'operator'
            },
            {
                type: 'p',
                icon: 'factory-riqi',
                label: '提交时间',
                value: 'operDate'
            }
        ];

        tabs = [
            {
                label: '生产准备',
                status: '未录入'
            },
            {
                label: '生产人员',
                status: '未录入'
            },
            {
                label: '设备运行'
            },
            {
                label: '生产入库',
                status: '未录入'
            },
            {
                label: '物料领用',
                status: '未录入'
            },
            {
                label: '待处理数量'
            },
            {
                label: '文本记录'
            }
        ];

        mounted() {
            console.log(this.$route.params.orderNo)
            console.log(this.$route.params.productLineName)
            PKG_API.PKG_HOME_QUERY_BY_NO_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        orderNo: this.$route.params.orderNo
            }).then(({ data }) => {
                console.log(data)
                this.orderData = data
            })
        }
    }
interface OrderData{
    workShop?: string;
    productLine?: string;
}
</script>

<style>
</style>
