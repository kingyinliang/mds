<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="5">
                <div class="card-left">
                    <!-- <p class="dataEntry-head-leftRight__title">罐号：{{ stockInfoObj.potNo }}</p> -->
                    <div class="dataEntry-head-leftRight-pot">
                        <img src="~DFMDS/assets/img/stockScan.png" alt="">
                    </div>
                </div>
            </el-col>
            <el-col :span="19">
                <div class="card-right">
                    <p class="dataEntry-head-leftRight__title">
                        <em class="iconfont factory-gongchang" />{{ stockInfoObj.factoryName ? stockInfoObj.factoryName : factoryName }}
                    </p>
                    <div class="dataEntry-head-leftRight-message">
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>{{ stockInfoObj.workShopName ? stockInfoObj.workShopName : '' }}</p>
                            <p><em class="iconfont factory-quyu" />车间</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p class="dataEntry-head-leftRight-message__item_info">
                                {{ stockInfoObj.beanWareHouse || stockInfoObj.beanLocation || '' }}
                            </p>
                            <p><em class="iconfont factory-bianhao" />库位</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p class="dataEntry-head-leftRight-message__item_info">
                                {{ stockMaterial }}
                            </p>
                            <p><em class="iconfont factory-bianma" />生产物料</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p class="dataEntry-head-leftRight-message__item_info">
                                {{ totalNum }}<span>{{ stockUnit }}</span>
                            </p>
                            <p><em class="iconfont factory-cunchurongliang" />总库存</p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activetTabName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    当前库存信息
                </span>
                <stock-table-data :work-shop="$store.state.koji.StockSoybeanInfo.workShop" stock-type="BEAN" />
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    历史库存信息
                </span>
                <stock-table-data :work-shop="$store.state.koji.StockSoybeanInfo.workShop" :is-history-page="true" stock-type="BEAN" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import StockTableData from '../common/StockTableData.vue'
    @Component({
        components: {
            StockTableData
        },
        name: 'StockSoybeanDetail'
    })
    export default class StockSoybeanDetail extends Vue {
        // 默认第一个标签
        private activetTabName = '1';
        // 车间详情信息
        private stockInfoObj: DataObj = {};

        private factoryName = '';

        mounted() {
            this.stockInfoObj = {
                ...this.$store.state.koji.StockSoybeanInfo
            };
            this.factoryName = JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort;
        }

        // 计算总量
        get totalNum() {
            let total = 0;
            this.stockInfoObj.detailsList && this.stockInfoObj.detailsList.map(item => {
                total += item.currentAmount
            })
            return total ? total.toLocaleString() : ''
        }

        // 获取库存明细第一条的单位
        get stockUnit() {
            if (this.stockInfoObj.detailsList && this.stockInfoObj.detailsList.length) {
                return this.stockInfoObj.detailsList[0].unit
            }
            return 'KG'
        }

        // 获取库存明细第一条的物料
        get stockMaterial() {
            if (this.stockInfoObj.detailsList && this.stockInfoObj.detailsList.length) {
                return this.stockInfoObj.detailsList[0].materialName + ' ' + this.stockInfoObj.detailsList[0].materialCode
            }
            return ''
        }
    }
    interface DataObj {
        detailsList?: DetailsList[];
    }

    interface DetailsList {
        currentAmount: number;
        materialCode?: number|string;
        materialName?: number|string;
        unit?: number|string;
    }
</script>
<style lang="scss" scoped>
.header_main {
    .card-left {
        height: 220px;
        padding: 0;
        background: #ffbf00;
        border-radius: 8px;
        box-shadow: 3px 3px 5px 1px #d6d2c4;
    }
    .card-right {
        height: 220px;
        padding: 0;
        background: #487bff;
        border-radius: 8px;
        box-shadow: 3px 3px 5px 0 #d6d2c4;
    }
    .dataEntry-head-leftRight__title {
        height: 37px;
        padding-top: 12px;
        padding-left: 12px;
        color: #fff;
        font-weight: 500;
        font-size: 18px;
        line-height: 25px;
    }
    .dataEntry-head-leftRight-message {
        height: 64px;
        margin-top: 60px;
    }
    .dataEntry-head-leftRight-message__item {
        font-weight: 500;
        font-size: 14px;
        .dataEntry-head-leftRight-message__item_info {
            max-width: 300px;
            color: #fff;
            font-weight: 600;
            font-size: 22px;
            span {
                font-weight: 400;
                font-size: 14px;
            }
        }
    }
    .dataEntry-head-leftRight-pot {
        position: relative;
        height: 100%;
        overflow: hidden;
        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}

.el-form-item--small.el-form-item {
    margin-bottom: 18px;
}
</style>

