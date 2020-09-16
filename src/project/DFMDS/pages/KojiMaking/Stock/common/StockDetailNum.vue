<template>
    <div class="stock-image">
        <div class="stock-image_content">
            <div class="stock-image_info">
                <i class="iconfont factory-chejianguanli" />
                <img src="~DFMDS/assets/img/stockScan.png" alt="">
            </div>
        </div>
        <div class="stock-image_content stock-image_content_right">
            <div class="stock-image_info stock-image_info_right">
                <i class="iconfont factory-zongliangguanli" />
                <div class="stock-image_info_num">
                    <el-tooltip effect="dark" :content="totalNum+stockUnit" placement="top">
                        <span class="stock-image_info_num_toolTip">{{ totalNum&&totalNum > 10000? (totalNum+'').substr(0,4): totalNum }}</span>
                    </el-tooltip>
                    <span class="stock-image_info_num_span">{{ totalNum&&totalNum > 10000?'...  ':'' }}{{ stockUnit }}</span>
                </div>
                <div class="stock-image_info_title">
                    库存总量
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    @Component({
        name: 'StockDetailNum',
        components: {}
    })
    export default class StockDetailNum extends Vue {
        @Prop({
            default: {
                detailsList: []
            }
        }) currentData;

        get totalNum() {
            console.log(this.currentData);
            let total = 0;
            this.currentData.detailsList && this.currentData.detailsList.map(item => {
                total += item.currentAmount
            })
            return total
        }

        get stockUnit() {
            if (this.currentData.detailsList && this.currentData.detailsList.length) {
                return this.currentData.detailsList[0].unit
            }
            return 'KG'
        }
    }
</script>
<style lang="scss" scoped>
.stock-image {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 10px;
    .stock-image_content {
        width: 50%;
        height: 180px;
        padding-right: 10px;
        padding-left: 0;
        .stock-image_info {
            position: relative;
            width: 100%;
            height: 100%;
            padding-left: 28px;
            background: #ffbf00;
            border-radius: 8px;
            box-shadow: 3px 3px 5px 0 #d6d2c4;
            i {
                position: absolute;
                top: 16px;
                right: 16px;
                display: inline-block;
                width: 26px;
                height: 26px;
                color: #fff;
            }
            img {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            .stock-image_info_num {
                height: 128px;
                padding-top: 28px;
                color: #fff;
                font-weight: 600;
                font-size: 12px;
                line-height: 100px;
            }
            .stock-image_info_num_span {
                font-size: 18px;
            }
            .stock-image_info_num_toolTip {
                font-size: 72px;
            }
            .stock-image_info_title {
                height: 28px;
                color: #fff;
                font-weight: 600;
                font-size: 20px;
                line-height: 28px;
            }
        }
        .stock-image_info_right {
            background: #487bff;
        }
    }
    .stock-image_content_right {
        padding-right: 0;
        padding-left: 10px;
    }
}
</style>

