<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="4">
                <div class="card-left" style="background: #fff;">
                    <p class="dataEntry-head-leftRight__title" style="color: #333;">
                        罐号：{{ LeaveningformData.holderName }}
                    </p>
                    <div class="dataEntry-head-leftRight-pot">
                        <img src="~DFMDS/assets/img/pot-c.png" alt="" style=" left: 0; z-index: 1;">
                        <img src="~DFMDS/assets/img/pot.png" alt="" style=" left: 0; z-index: 2;">
                    </div>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="card-right" style="background: #fff; cursor: default;">
                    <el-form ref="Leavening" :model="LeaveningformData" size="small" label-width="120px" :inline="true">
                        <el-form-item
                            label="生产车间："
                        >
                            <el-input
                                v-model="LeaveningformData.workShopName"
                                placeholder=""
                                :disabled="true"
                                style="width: 180px;"
                            />
                        </el-form-item>
                        <el-form-item
                            label="生产订单："
                        >
                            <el-tooltip class="item" effect="dark" :content="LeaveningformData.orderNo" placement="top">
                                <el-input
                                    v-model="LeaveningformData.orderNo"
                                    placeholder=""
                                    :disabled="true"
                                    style="width: 180px;"
                                />
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item
                            label="生产物料："
                        >
                            <el-tooltip class="item" effect="dark" :content="LeaveningformData.material" placement="top">
                                <el-input
                                    v-model="LeaveningformData.material"
                                    placeholder=""
                                    :disabled="true"
                                    style="width: 180px;"
                                />
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item
                            label="订单数量："
                        >
                            <el-input
                                v-model="LeaveningformData.currentStock"
                                placeholder=""
                                style="width: 180px;"
                                :disabled="true"
                            />
                        </el-form-item>
                        <el-form-item
                            label="库存数量："
                        >
                            <el-input
                                v-model="LeaveningformData.currentStock"
                                placeholder=""
                                style="width: 180px;"
                                :disabled="true"
                            />
                        </el-form-item>
                        <el-form-item
                            label="状态："
                        >
                            <el-input
                                v-model="LeaveningformData.fermentorStatusName"
                                placeholder=""
                                style="width: 180px;"
                                :disabled="true"
                            />
                        </el-form-item>
                        <el-form-item
                            label="入罐日期："
                        >
                            <el-input
                                v-model="LeaveningformData.intoDate"
                                placeholder=""
                                style="width: 180px;"
                                :disabled="true"
                            />
                        </el-form-item>
                        <el-form-item
                            label="发酵天数："
                        >
                            <el-input
                                v-model="LeaveningformData.fermentDays"
                                placeholder=""
                                style="width: 180px;"
                                :disabled="true"
                            >
                                <span slot="suffix">天</span>
                            </el-input>
                        </el-form-item>
                        <el-form-item
                            label="是否成熟："
                        >
                            <el-input
                                v-model="LeaveningformData.freezeFlagnName"
                                placeholder=""
                                style="width: 180px;"
                                :disabled="true"
                            />
                        </el-form-item>
                        <el-form-item label="特殊资源：">
                            <el-radio-group v-model="LeaveningformData.brineFlag">
                                <el-radio label="N" disabled>
                                    盐水发料未发
                                </el-radio>
                                <el-radio label="N1" disabled>
                                    盐水发料中
                                </el-radio>
                                <el-radio label="Y" disabled>
                                    盐水发料已发
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activetTabName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    投料信息
                </span>
                <el-table header-row-class-name="" :data="currentInStockDataGroup" border tooltip-effect="dark" class="newTable" size="mini" max-height="500">
                    <el-table-column type="index" label="序号" width="55" fixed align="center" />
                    <el-table-column label="车间" :show-overflow-tooltip="true" width="180">
                        <template>
                            {{ currentWorkShopName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="生产订单" :show-overflow-tooltip="true" width="280">
                        <template slot-scope="scope">
                            {{ scope.row.productOrderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.orderTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ `${scope.row.moveMaterialName} ${scope.row.moveMaterialCode}` }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料批次" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveBatch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.unit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="来源车间" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.workShop }}
                        </template>
                    </el-table-column>
                    <el-table-column label="来源订单" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.orderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="曲房号" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.kojiHouse }}
                        </template>
                    </el-table-column>
                    <el-table-column label="来源罐号" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.potName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入罐日期" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人员" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.operators }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.operated }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    领用信息
                </span>
                <el-table header-row-class-name="" :data="currentOutStockDataGroup" border tooltip-effect="dark" class="newTable" size="mini" max-height="500">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="车间" :show-overflow-tooltip="true" width="180">
                        <template>
                            {{ currentWorkShopName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="生产订单" :show-overflow-tooltip="true" width="280">
                        <template slot-scope="scope">
                            {{ scope.row.productOrderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.orderTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ `${scope.row.moveMaterialName} ${scope.row.moveMaterialCode}` }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料批次" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveBatch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveType }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.unit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用车间" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.workShop }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用订单" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.orderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="目标罐号" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.potName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用日期" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.moveDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人员" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.operators }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.operated }}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { FER_API } from 'common/api/api';

@Component({
    components: {},
    name: 'LeaveningBucketDetail'
})
export default class LeaveningBucketDetail extends Vue {

    activetTabName = '1';

    currentWorkShopName=''
    // 投料信息
    currentInStockDataGroup = [];
    totalDataList = [];
    // 领用信息
    currentOutStockDataGroup = [];

    LeaveningformData: LeaveningData= {}; // 上方表单讯息

    mounted() {
        this.retrieveDetail();
    }

    retrieveDetail() {
        console.log('取值')
        console.log(this.$store.state.fer.fermentBucketDetail)
        this.LeaveningformData = this.$store.state.fer.fermentBucketDetail
        this.$set(this.LeaveningformData, 'material', `${this.LeaveningformData.materialName} ${this.LeaveningformData.materialCode}`)
        this.$set(this.LeaveningformData, 'freezeFlagnName', this.LeaveningformData.freezeFlag === 'Y' ? '是' : '否')
        this.currentWorkShopName = this.LeaveningformData.workShopName as string

        FER_API.FER_FERMENTOR_STOCK_DETAIL_QUERY_API({
            holderId: '96'
            }).then(({ data }) => {
                console.log('详细数据')
                console.log(data)
                 // 投料信息
                this.currentInStockDataGroup = [];
                // 领用信息
                this.currentOutStockDataGroup = [];
                if (data.data) {
                    this.currentInStockDataGroup = data.data.inStock;
                    this.currentOutStockDataGroup = data.data.outStock;
                }

        });

    }

}
interface LeaveningData{
        brineFlag?: string;
        brineFlagName?: string;
        changed?: string;
        changer?: string;
        currentStock?: number;
        cycle?: string;
        fermentDays?: number;
        fermentorStatus?: string;
        fermentorStatusName?: string;
        freezeFlag?: string;
        fullDate?: string;
        holderId?: string;
        holderName?: string;
        holderNo?: string;
        holderType?: string;
        holderTypeName?: string;
        holderVolume?: number;
        id?: string;
        intoDate?: string;
        judgeResult?: string;
        judgeResultName?: string;
        materialCode?: string;
        materialName?: string;
        matureFlag?: string;
        openFlag?: string;
        orderNo?: string;
        remark?: string;
        workShop?: string;
        workShopName?: string;
    }

</script>

<style lang="css" scoped>

.markStyle >>> th .notNull::before {
    margin-right: 4px;
    color: #f00;
    content: "*";
}
.markStyle >>> th .notNull {
    color: #333;
}

.markStyle >>> .star .el-form-item__label::before {
    margin-right: 4px;
    color: #f56c6c;
    content: "*";
}

/* 个例处理 */
.card-right >>> .el-input__inner {
    cursor: default;
}
.card-right >>> .el-radio__input.is-disabled + span.el-radio__label {
    color: #606266;
    font-weight: 400;
    cursor: default;
}

</style>
<style lang="scss" scoped>
// 容器罐呈现
.header_main {
    .dataEntry-head-leftRight-pot {
        position: relative;
        height: 150px;
        overflow: hidden;
        img {
            position: absolute;
        }
    }
}


@media (max-width: 1600px) {
    .header_main .dataEntry-head-leftRight .card-left,
    .header_main .dataEntry-head-leftRight .card-right {
        height: 200px;
        padding: 10px;
    }
}

@media (max-width: 1200px) {
    .header_main .dataEntry-head-leftRight .card-left,
    .header_main .dataEntry-head-leftRight .card-right {
        height: 300px;
        padding: 10px;
    }
}
</style>
