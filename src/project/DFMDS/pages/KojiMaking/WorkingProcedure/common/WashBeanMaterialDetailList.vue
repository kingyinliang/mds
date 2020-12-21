<template>
    <div class="material-detail-list__content">
        <div class="stock-image">
            <div class="stock-image_content">
                <div class="stock-image_info">
                    <i class="iconfont factory-chejianguanli" />
                    <img src="~DFMDS/assets/img/kojiScan.png" alt="">
                </div>
            </div>
            <div class="stock-image_content stock-image_content_right">
                <div class="stock-image_info stock-image_info_right">
                    <i class="iconfont factory-zongliangguanli" />
                    <div class="stock-image_info_num">
                        <el-tooltip effect="dark" :content="totalNum&&totalNum > 999999? (totalNum+'').substr(0,6): totalNum +'千克'" placement="top">
                            <span class="stock-image_info_num_toolTip">{{ totalNum&&totalNum > 999999? (totalNum+'').substr(0,6): totalNum }}</span>
                        </el-tooltip>
                        <span class="stock-image_info_num_span">千克</span>
                    </div>
                    <div class="stock-image_info_title">
                        库存总量
                    </div>
                </div>
            </div>
        </div>
        <mds-card class="table-card" title="库存明细" :pack-up="false" :name="'fermenterTotal'">
            <div
                class="stock-detail-table-content"
            >
                <el-table height="120" :data="materialDetailData.detailsList" border tooltip-effect="dark" class="newTable" size="mini">
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="120">
                        <template slot-scope="scope">
                            {{ scope.row.materialName +' '+ scope.row.materialCode }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" prop="batch" align="center" min-width="100" />
                    <el-table-column label="数量" :show-overflow-tooltip="true" prop="currentAmount" width="100" align="right">
                        <template slot-scope="scope">
                            {{ scope.row.currentAmount ? scope.row.currentAmount.toLocaleString()+' '+ scope.row.unitName : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="日期" prop="productDate" align="center" :formatter="formatterProductDate" min-width="100" />
                </el-table>
            </div>
        </mds-card>
    </div>
</template>
<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat } from 'utils/utils';
    @Component({
        name: 'MaterialDetailList',
        components: {}
    })
    export default class MaterialDetailList extends Vue {
        @Prop({
            default: {}
        }) materialDetailData: MaterialDetailDatas;

        private formatterProductDate(row, column, cellValue) {
            return dateFormat(new Date(cellValue), 'yyyy-MM-dd')
        }

        get totalNum() {
            let total = 0;
            this.materialDetailData.detailsList && this.materialDetailData.detailsList.map(item => {
                total += item.currentAmount
            })
            return total ? total.toLocaleString() : ''
        }

    }
    interface MaterialDetailDatas {
        detailsList?: DetailD[];
    }
    interface DetailD {
        currentAmount: number;
    }
</script>

<style lang="scss" scoped>
.material-detail-list__content {
    .stock-image {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 6px 10px 0;
        .stock-image_content {
            width: 50%;
            height: 90px;
            padding-right: 5px;
            padding-left: 0;
            .stock-image_info {
                position: relative;
                width: 100%;
                height: 100%;
                padding-left: 6px;
                background: #ffbf00;
                border-radius: 8px;
                box-shadow: 3px 3px 5px 0 #d6d2c4;
                i {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    color: #fff;
                    font-size: 12px;
                }
                img {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    display: block;
                    height: 100%;
                    transform: translate(-50%, -50%);
                }
                .stock-image_info_num {
                    height: 60px;
                    padding-top: 20px;
                    color: #fff;
                    font-weight: 600;
                    font-size: 22px;
                    line-height: 40px;
                }
                .stock-image_info_num_span {
                    font-size: 14px;
                }
                .stock-image_info_title {
                    height: 20px;
                    color: #fff;
                    font-weight: 600;
                    font-size: 12px;
                    line-height: 20px;
                }
            }
            .stock-image_info_right {
                background: #487bff;
            }
        }
        .stock-image_content_right {
            padding-right: 0;
            padding-left: 5px;
        }
    }
    .table-card {
        padding: 8px 10px 0 !important;
        border: 0;
        box-shadow: none;
    }
}
</style>
