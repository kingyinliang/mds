<template>
    <div class="header_main">
        <el-form :model="queryParams" :inline="true" size="small" label-width="70px" class="multi_row clearfix">
            <el-form-item label="生产车间：">
                <el-select v-model="queryParams.workShopId" class="stock-index-select_width" placeholder="请选择" clearable>
                    <el-option v-for="(item, optIndex) in workShopList" :key="optIndex" :label="item.deptName" :value="item.deptCode" />
                </el-select>
            </el-form-item>
            <el-form-item class="floatr">
                <el-button type="primary" size="small" @click="getDataList">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <el-row class="home_card__main" :gutter="10">
            <el-col v-for="item in stockInfoList" :key="item.potId" :span="12">
                <div class="card-stock">
                    <div class="card-stock__head">
                        <span>{{ `${item.workShopName}${item.materialLocation? '：'+item.materialLocation: ''}` }}</span>
                        <el-button class="floatr" type="text" @click="goDetail(item)">
                            详情
                        </el-button>
                    </div>
                    <div class="card-stock__content">
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
                                        {{ item.storageTotal }}<span class="stock-image_info_num_span">kg</span>
                                    </div>
                                    <div class="stock-image_info_title">
                                        库存总量
                                    </div>
                                </div>
                            </div>
                        </div>
                        <mds-card class="box-card" title="库存明细" :pack-up="false" :name="'fermenterTotal'">
                            <stock-detail-table :current-data="item.detailsList" />
                        </mds-card>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';

    import StockDetailTable from '../../common/StockDetailTable.vue';
    @Component({
        name: 'StockSoybeanIndex',
        components: {
            StockDetailTable
        }
    })
    export default class StockSoybeanIndex extends Vue {
        // 查询参数集
        queryParams: QueryParamsInterface = {
            workShopId: 1
        };

        // 车间下拉列表
        workShopList: object[] = [];

        // 车间详情列表
        stockInfoList: object[] = [];

        mounted() {
            // 请求车间下拉列表
            this.getWorkShop();
        }

        // 制曲车间下拉列表查询
       private getWorkShop() {
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP'],
                deptName: '制曲'
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.workShopList = data.data;
                    if (data.data.length !== 0) {
                        this.queryParams.workShopId = data.data[0]['deptCode'];
                    }
                    // 默认选中第一个选项 查询车间详情
                    this.getDataList()
                }
            });
        }

        // 统一车间具体信息请求成功处理
        private FnCallBackHandle(data) {
            if (data.code === 200) {
                this.stockInfoList = data.data || [];
            } else {
                this.stockInfoList = [];
                this.$infoToast('暂无任何内容');
            }
        }

        // 查询车间下的信息
        private getDataList() {
            // 未选择车间查所有
            if (this.queryParams.workShopId) {
                KOJI_API.KOJI_STOCK_BEAN_INDEX_LIST_API({
                    ...this.queryParams
                }).then(({ data }) => {
                    this.FnCallBackHandle(data);
                });
            } else {
                KOJI_API.KOJI_STOCK_BEAN_INDEX_LIST_ALL_API({}).then(({ data }) => {
                    this.FnCallBackHandle(data);
                });
            }
        }

        // 跳转详情页
        private goDetail(row) {
            // 保存当前点击的对象信息
            this.$store.commit('koji/updateStockSoybeanInfo', row);
            this.$store.commit(
                'common/updateMainTabs',
                this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-KojiMaking-Stock-Soybean-detail')
            );
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-KojiMaking-Stock-Soybean-detail`
                });
            }, 100);
        }
    }

    interface QueryParamsInterface {
        workShopId: number|string;
    }
</script>
<style lang="scss" scoped>
    .multi_row {
        margin-bottom: 20px;
        padding: 20px 16px 13px;
        background: #fff;
        border-radius: 8px;
        -webkit-box-shadow: 3px 2px 4px 0 rgba(0, 0, 0, 0.09);
        box-shadow: 3px 2px 4px 0 rgba(0, 0, 0, 0.09);
        .stock-index-select_width {
            width: 120px;
        }
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
                                font-size: 72px;
                                line-height: 100px;
                            }
                            .stock-image_info_num_span {
                                font-size: 18px;
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
                .box-card {
                    padding: 8px 20px 26px !important;
                    border: 0;
                }
            }
        }
    }
</style>
