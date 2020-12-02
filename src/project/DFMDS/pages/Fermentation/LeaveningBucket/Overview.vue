<!--
 * @Description:
 * @Anthor: Telliex
 * @Date: 2020-12-01 20:33:02
 * @LastEditors: Telliex
 * @LastEditTime: 2020-12-02 09:16:55
-->
<template>
    <div>
        <data-entry
            ref="dataEntry"
            :tabs="tabs"
            :order-status-show="'false'"
            :head-show="'false'"
        >
            <template slot="1" slot-scope="data">
                <wash-bean-material-apply ref="fermentOverview" :is-redact="data.isRedact" :sieve-total-num="sieveTotalNum" />
            </template>
            <template slot="2" slot-scope="data">
                <wash-bean-material-craft ref="fermentList" :is-redact="data.isRedact" :set-material-table-data="setMaterialTableData" />
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { COMMON_API, KOJI_API } from 'common/api/api';

    // import FermentOverview from './common/FermentOverview.vue';
    // import FermentList from './common/FermentList.vue';


    @Component({
        name: 'OverviewIndex',
        components: {
            // fermentOverview,
            // fermentList
        }
    })
    export default class OverviewIndex extends Vue {
        $refs: {
            fermentOverview: HTMLFormElement;
            fermentList: HTMLFormElement;

        }

        orderIndex=['已同步', '已保存', '待审核', '已审核', '已过账', '已退回', '未录入']

        jumpFromAudit=false // is from audit ?

        // 杂质数量
        sieveTotalNum = 0;
        // 物料领用记录 == 批次信息
        setMaterialTableData = [];


        tabs = [
                {
                    label: '发酵一览表'
                },
                {
                    label: '发酵库存列表'
                }
            ]


        mounted() {
            //

        }


    }

</script>
