<template>
    <div class="stock-image">
        <div class="stock-image_content">
            <div class="stock-image_info stock-image_info_left">
                <!-- <i class="iconfont factory-chejianguanli" /> -->
                <!-- <img src="~DFMDS/assets/img/stockScan.png" alt=""> -->
                <image-comp :s3-path="currentData.s3Path" height="70px" />
            </div>
        </div>
        <div class="stock-image_content stock-image_content_right">
            <div class="stock-image_info stock-image_info_right">
                <i class="iconfont factory-zongliangguanli" />
                <div class="stock-image_info_num">
                    <el-tooltip effect="dark" :content="totalNum+stockUnit" placement="top">
                        <span class="stock-image_info_num_toolTip">{{ totalNum&&totalNum > 999999? (totalNum+'').substr(0,6): totalNum }}</span>
                    </el-tooltip>
                    <span class="stock-image_info_num_span">{{ totalNum&&totalNum > 999999?'...  ':'' }} {{ stockUnit }}</span>
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
    import ImageComp from '../components/imageComp.vue'
    @Component({
        name: 'StockDetailNum',
        components: {
            ImageComp
        }
    })
    export default class StockDetailNum extends Vue {
        @Prop({
            default: {
                materialStorageResponseDtoList: [],
                totalCurrentAmount: 0,
                s3Path: ''
            }
        }) currentData;

        get totalNum() {
            // let total = 0;
            // this.currentData.detailsList && this.currentData.detailsList.map(item => {
            //     total += item.currentAmount
            // })
            // return total ? total.toLocaleString() : '0'
            return this.currentData.totalCurrentAmount
        }

        get stockUnit() {
            if (this.currentData.materialStorageResponseDtoList && this.currentData.materialStorageResponseDtoList.length) {
                return this.currentData.materialStorageResponseDtoList[0].materialUnitName
            }
            return '个'
        }
    }
</script>
<style lang="scss" scoped>
.stock-image {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 10px 5px;
    .stock-image_content {
        width: 45%;
        height: 120px;
        padding-right: 10px;
        padding-left: 0;
        .stock-image_info {
            position: relative;
            width: 100%;
            height: 100%;
            // padding-left: 28px;
            background: #ffbf00;
            border-radius: 8px;
            box-shadow: 3px 3px 5px 0 #d6d2c4;
            i {
                position: absolute;
                top: 12px;
                right: 6px;
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
                height: 64px;
                // padding-top: 28px;
                color: #fff;
                font-weight: 600;
                font-size: 12px;
                line-height: 100px;
            }
            .stock-image_info_num_span {
                font-size: 18px;
            }
            .stock-image_info_num_toolTip {
                font-size: 20px;
            }
            .stock-image_info_title {
                height: 28px;
                color: #fff;
                font-weight: 600;
                font-size: 14px;
                line-height: 28px;
            }
        }
        .stock-image_info_right {
            padding-left: 15px;
            background: #487bff;
        }
        .stock-image_info_left {
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 0 5px 0 #d6d2c4;
            i {
                color: #487bff;
            }
        }
    }
    .stock-image_content_right {
        width: 55%;
        padding-right: 0;
        // padding-left: 10px;
    }
}
</style>

