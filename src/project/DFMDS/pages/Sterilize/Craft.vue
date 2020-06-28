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
                <div>{{ data.isRedact }}</div>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class Craft extends Vue {
        formHeader = {};
        headerBase = [];
        tabs = [
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

<style scoped>

</style>
