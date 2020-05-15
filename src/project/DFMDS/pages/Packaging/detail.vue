<template>
    <div>
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
            <template slot="6" slot-scope="data">
                <pending-num ref="PendingNum" :is-redact="data.isRedact" />
            </template>
            <template slot="7" slot-scope="data">
                <text-record ref="PendingNum" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import ReadyTime from './common/readyTimes';
    import ProductPeople from './common/productPeople';
    import PendingNum from './common/pendingNum';
    import TextRecord from './common/textRecord';

    @Component({
        components: {
            ReadyTime,
            ProductPeople,
            PendingNum,
            TextRecord
        }
    })
    export default class PackagingDetail extends Vue {
        orderStatus = ''

        formHeader = {}

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
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
    }
</script>

<style>
</style>
