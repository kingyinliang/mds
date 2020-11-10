<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steSplitQuery"
            :type="'home'"
            :query-form-data="queryFormData"
            :list-interface="getDataList"
            :custom-data="true"
            @get-data-success="FnCallBackHandle"
            @created-end="createdEnd"
        >
            <template slot="home">
                <div class="item-sort-container">
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in stockInfoList" :key="item.potId" :span="12">
                            <div class="card-stock">
                                <div class="card-stock__head">
                                    <span>{{ `${item.workShopName}${item.wareHouseName || item.materialLocation? '：'+(item.wareHouseName || item.materialLocation) : ''}` }}</span>
                                    <el-button class="floatr" type="text" @click="goDetail(item)">
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
    import { COMMON_API, KOJI_API } from 'common/api/api';

    import StockDetailTable from '../common/StockDetailTable.vue';
    import StockDetailNum from '../common/StockDetailNum.vue';
    @Component({
        name: 'StockSoybeanIndex',
        components: {
            StockDetailTable,
            StockDetailNum
        }
    })
    export default class StockSoybeanIndex extends Vue {

        $refs: {
            queryTable: HTMLFormElement;
        };

        // 车间详情列表
        stockInfoList: object[] = [];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                rule: [
                    { required: true, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '制曲'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            }
        ]

        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.productDate !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        // 统一车间具体信息请求成功处理
        private FnCallBackHandle(data) {
            this.stockInfoList = data.data || [];
            if (this.stockInfoList.length === 0) {
                this.$infoToast('暂无任何内容');
            }
        }

        // 查询车间下的信息
        private getDataList(params) {
            const queryParams = {
                workShopId: params.workShop
            }
            // 未选择车间查所有
            if (queryParams.workShopId) {
                return KOJI_API.KOJI_STORAGE_BEAN_CURRENT_PARTICULARS_API({
                    ...queryParams
                })
            }
            return KOJI_API.KOJI_STORAGE_BEAN_CURRENT_PARTICULARS_API({}).then(({ data }) => {
                this.FnCallBackHandle(data);
            });
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
