<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :is-query-form-show="false"
            query-auth="strainQuery"
            :type="'home'"
            :query-form-data="queryFormData"
            :list-interface="getDataList"
            :custom-data="true"
        >
            <template slot="home">
                <div class="item-sort-container">
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in stockInfoList" :key="item.potId" :span="12">
                            <div class="card-stock">
                                <div class="card-stock__head">
                                    <span>{{ item.workShopName?`&{item.workShopName}:`:'' }} {{ `${item.wareHouseName || item.materialLocation? (item.wareHouseName || item.materialLocation) : ''}` }}</span>
                                    <el-button v-if="isAuth('strainMxQuery')" class="floatr" type="text" @click="goDetail(item)">
                                        详情
                                    </el-button>
                                </div>
                                <div class="card-stock__content">
                                    <stock-detail-num :current-data="item" />
                                    <mds-card class="box-card" title="库存明细" :pack-up="false" :name="'fermenterTotal'">
                                        <stock-detail-table :current-data="item.detailsList" />
                                    </mds-card>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </template>
        </query-table>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { KOJI_API } from 'common/api/api';

    import StockDetailTable from '../common/StockDetailTable.vue';
    import StockDetailNum from '../common/StockDetailNum.vue';
    @Component({
        name: 'StockY158Index',
        components: {
            StockDetailTable,
            StockDetailNum
        }
    })
    export default class StockY158Index extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        };

        // 车间详情列表
        stockInfoList: object[] = [];

        queryFormData = [
        ]

        mounted() {
            this.getDataList();
        }

        private FnCallBackHandle(data) {
            this.stockInfoList = data.data || [];
            if (this.stockInfoList.length === 0) {
                this.$infoToast('暂无任何内容');
            }
        }

        // 查询车间下的信息
        private getDataList() {
            return KOJI_API.KOJI_STORAGE_Y158_STRAIN_CURRENT_PARTICULARS_API({}).then(({ data }) => {
                this.FnCallBackHandle(data);
            });
        }

        // 跳转详情页
        private goDetail(row) {
            this.$store.commit('koji/updateStockY158Info', row);
            this.$store.commit(
                'common/updateMainTabs',
                this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-KojiMaking-Stock-Bacterial-detail')
            );
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-KojiMaking-Stock-Bacterial-detail`
                });
            }, 100);
        }
    }
</script>
<style lang="scss" scoped>
    .item-sort-container {
        margin-top: 10px;
    }
    .home_card__main {
        .card-stock {
            margin-bottom: 20px;
            background: #fff;
            border-radius: 8px;
            -webkit-box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.09);
            box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.09);
            .card-stock__head {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 15px 20px;
                font-size: 14px;
                border-bottom: 1px #e8e8e8 solid;
                .el-button {
                    font-size: 12px;
                    &::after {
                        content: ">>";
                    }
                }
            }
            .card-stock__content {
                .box-card {
                    padding: 8px 20px 26px !important;
                    border: 0;
                }
            }
        }
    }
</style>
