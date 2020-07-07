<template>
    <div>
        <data-entry
            ref="dataEntry"
            :redact-auth="'pkg:order:update'"
            :save-auth="'pkg:order:update'"
            :submit-auth="'pkg:order:update'"
            :order-status="formHeader.orderStatus"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
        >
            <template slot="1" slot-scope="data">
                <acce-add ref="craft" :is-redact="data.isRedact" />
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
    import AcceAdd from './common/AcceAdd.vue';

    @Component({
        name: 'AcceAddIndex',
        components: {
            AcceAdd
        }
    })
    export default class AcceAddIndex extends Vue {
        formHeader = {};
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
                value: 'workShopName'
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
                value: 'workShopName'
            },
            {
                type: 'p',
                label: '生产产量',
                icon: 'factory--meirijihuachanliangpeizhi',
                value: 'workShopName'
            },
            {
                type: 'p',
                label: '生产产量',
                icon: 'factory--meirijihuachanliangpeizhi',
                value: 'workShopName'
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
    }
</script>

<style scoped>

</style>
