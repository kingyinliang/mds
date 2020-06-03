<template>
    <data-entry
        type="audit"
        :header-base="headerBase"
        :form-header="formHeader"
        :tabs="tabs"
    >
        <template slot="1" slot-scope="data">
            <ready-time ref="readyTime" :is-redact="data.isRedact" />
        </template>
        <template slot="2" slot-scope="data">
            <product-people ref="productPeople" :is-redact="data.isRedact" />
        </template>
        <template slot="3" slot-scope="data">
            <Equipment ref="equipment" :is-redact="data.isRedact" />
        </template>
        <template slot="4" slot-scope="data">
            <product-in-storage ref="productInStorage" :is-redact="data.isRedact" />
        </template>
        <template slot="5" slot-scope="data">
            <material ref="material" :is-redact="data.isRedact" />
        </template>
        <template slot="6" slot-scope="data">
            <pending-num ref="pendingNum" :is-redact="data.isRedact" />
        </template>
        <template slot="7" slot-scope="data">
            <text-record ref="textRecord" :is-redact="data.isRedact" />
        </template>
    </data-entry>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';
    import ReadyTime from '../common/ReadyTimes.vue';
    import Material from '../common/Material.vue';
    import ProductPeople from '../common/ProductPeople.vue';
    import PendingNum from '../common/PendingNum.vue';
    import TextRecord from '../common/TextRecord.vue';
    import ProductInStorage from '../common/ProductInStorage.vue';
    import Equipment from '../common/Equipment.vue';

    @Component({
        name: 'AuditDetail',
        components: {
            ReadyTime,
            ProductPeople,
            PendingNum,
            TextRecord,
            Material,
            ProductInStorage,
            Equipment
        }
    })
    export default class AuditDetail extends Vue {
        orderStatus = ''
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
                value: ['planOutput', 'realOutput']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: ['orderStartDate', 'orderEndDate']
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
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'p',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        tabs = [
            {
                label: '生产准备',
                status: '未录入',
                isRedact: false
            },
            {
                label: '生产人员',
                status: '未录入',
                isRedact: false
            },
            {
                label: '设备运行',
                isRedact: false
            },
            {
                label: '生产入库',
                status: '未录入',
                isRedact: false
            },
            {
                label: '物料领用',
                status: '未录入',
                isRedact: false
            },
            {
                label: '待处理数量',
                isRedact: false
            },
            {
                label: '文本记录',
                isRedact: false
            }
        ];

        formHeader: OrderData = {}

        mounted() {
            this.initData()
        }

        initData() {
            console.log(1);
            PKG_API.PKG_HOME_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: this.formHeader.orderNo
            }).then(({ data }) => {
                this.orderStatus = data.data.orderStatus
            })
        }
    }

    interface OrderData{
        changed?: string;
        countMan?: number;
        countOutput?: number;
        countOutputUnit?: string;
        dispatchMan?: string;
        exceptionDateCount?: number;
        factory?: string;
        factoryCode?: string;
        germs?: number;
        id?: string;
        materialCode?: string;
        materialName?: string;
        operator?: string;
        operatorDate?: string;
        orderEndDate?: string;
        orderNo?: string;
        orderStartDate?: string;
        orderStatus?: string;
        orderType?: string;
        outputUnit?: string;
        planOutput?: number;
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        realInAmount?: number;
        realOutput?: number;
        version?: number;
        workShop?: string;
        workShopName?: string;
    }
</script>

<style scoped>

</style>
