<template>
    <div class="header_main">
        <el-row class="dataEntry-head-leftRight" :gutter="10">
            <el-col :span="4">
                <div class="card-left" style="background: #fff;">
                    <p class="dataEntry-head-leftRight__title" style="color: #333;">
                        罐号：{{ formData.potNo }}
                    </p>
                    <div class="dataEntry-head-leftRight-pot">
                        <!-- <div class="dataEntry-head-leftRight-pot__tank">
                            <div class="dataEntry-head-leftRight-pot__tank__bg" />
                        </div> -->
                        <img src="~DFMDS/assets/img/pot-c.png" alt="" style=" left: 0; z-index: 1;">
                        <img src="~DFMDS/assets/img/pot.png" alt="" style=" left: 0; z-index: 2;">
                    </div>
                </div>
            </el-col>
            <el-col :span="20">
                <div class="card-right" style="background: #487bff;">
                    <p class="dataEntry-head-leftRight__title">
                        <em class="iconfont factory-gongchang" />{{ formData.factoryName ? formData.factoryName : '' }}
                    </p>
                    <div class="dataEntry-head-leftRight-message">
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>{{ formData.workShop ? formData.workShop : '' }}</p>
                            <p><em class="iconfont factory-37_zhusu" /> 杀菌车间</p>
                        </div>
                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.prodcutMaterial ? formData.prodcutMaterial : '' }}
                            </p>
                            <p> <em class="iconfont factory-bianhao" />生产物料 </p>
                        </div>

                        <div class="dataEntry-head-leftRight-message__item">
                            <p>
                                {{ formData.potAmount ? formData.potAmount.toLocaleString() : 0 }}
                                <em>{{ formData.unit ? formData.unit : 'KG' }}</em>
                            </p>
                            <p> <em class="iconfont factory-cunchurongliang" />配置锅数 </p>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-tabs id="DaatTtabs" ref="tabs" v-model="activetTabName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    当前库存
                </span>
                <el-table header-row-class-name="" :data="currentInventoryDataGroup" border tooltip-effect="dark" class="newTable" size="mini">
                    <el-table-column type="index" label="序号" width="55" fixed align="center" />
                    <el-table-column label="罐号" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.potNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.prodcutMaterial }} {{ scope.row.prodcutMaterialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" maxlength="10" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.feedBatch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            {{ chechMoveType(scope.row.moveType) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.moveType!=='I'">-</span>{{ scope.row.moveAmount.toFixed(3) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" :show-overflow-tooltip="true" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.moveUnit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅号" :show-overflow-tooltip="true" width="100">
                        <template slot-scope="scope">
                            {{ scope.row.usePotNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅单" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.usePortOrderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.feedMan }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.feedDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.changer }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-row v-if="currentInventoryDataGroup.length !== 0">
                    <el-pagination :current-page="currentInventoryCurrentPage" :page-sizes="[10, 20, 50]" :page-size="currentInventoryPageSize" layout="total, sizes, prev, pager, next, jumper" :total="currentInventoryTotalCount" @size-change="handleCurrentInventorySizeChange" @current-change="handleCurrentInventoryCurrentChange" />
                </el-row> -->
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    历史库存
                </span>
                <el-table header-row-class-name="" :data="historyInventoryDataGroup" border tooltip-effect="dark" class="newTable">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="罐号" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.potNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.prodcutMaterial }} {{ scope.row.prodcutMaterialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="批次" :show-overflow-tooltip="true" maxlength="10" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.feedBatch }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ chechMoveType(scope.row.moveType) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            <span v-if="scope.row.moveType!=='R'">-</span>{{ scope.row.moveAmount.toFixed(3) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" :show-overflow-tooltip="true" width="170">
                        <template slot-scope="scope">
                            {{ scope.row.moveUnit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅号" :show-overflow-tooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.usePotNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用锅单" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.usePortOrderNo }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.feedMan }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.feedDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作人" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.changer }}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作时间" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.changed }}
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-row v-if="historyInventoryDataGroup.length !== 0">
                    <el-pagination :current-page="historyInventoryCurrentPage" :page-sizes="[10, 20, 50]" :page-size="historyInventoryCurrentPageSize" layout="total, sizes, prev, pager, next, jumper" :total="historyInventoryTotalCount" @size-change="handleHistoryInventorySizeChange" @current-change="handleHistoryInventoryCurrentSizeChange" />
                </el-row> -->
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { STE_API } from 'common/api/api';
// import MSG from '@/assets/js/hint-msg';
@Component({
    components: {},
    name: 'DissolveBucketDetail'
})
export default class DissolveBucketDetail extends Vue {
    importData: ImportData={}
    activetTabName = '1';
    // 当前数据
    currentInventoryDataGroup = [];
    totalDataList = [];
    // 历史数据
    historyInventoryDataGroup = [];
    totalAdjustList = [];

    formData = {}; // 上方表单讯息

    mounted() {
        this.retrieveDetail();
    }

    retrieveDetail() {
        console.log('取值')
        console.log(this.$store.state.sterilize.dissolveBucketDetail)
        this.importData = this.$store.state.sterilize.dissolveBucketDetail
        STE_API.STE_DISSOLUTIONBUCKET_ITEM_QUERY_API({
            cycle: this.importData.cycle,
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            potId: this.importData.potId,
            potNo: this.importData.potNo,
            // potStatus: this.importData.potStatus
            workShop: this.importData.workShop
            }).then(({ data }) => {
                console.log('详细数据')
                console.log(data)
                this.formData = {
                    potNo: this.importData.potNo,
                    factoryName: JSON.parse(sessionStorage.getItem('factory') || '{}').deptShort,
                    potAmount: data.data.number,
                    unit: data.data.unit,
                    prodcutMaterial: data.data.materialName,
                    workShop: data.data.workShop
                };
                this.currentInventoryDataGroup = data.data.item
        });

    }

    chechMoveType(typeString) {
        if (typeString === 'I') {
            return '投料'
        } else if (typeString === 'F') {
            return '领用'
        }
        return ''
    }
}
interface ImportData{
    cycle?: string;
    feedDate?: string;
    id?: string;
    potAmount?: string;
    potId?: string;
    potNo?: string;
    potStatus?: string;
    prodcutMaterial?: string;
    prodcutMaterialName?: string;
    ratio?: number;
    workShop?: string;
}

</script>
<style lang="scss" scoped>
.header_main {
    .dataEntry-head-leftRight-pot {
        position: relative;
        height: 150px;
        overflow: hidden;
        img {
            position: absolute;
        }
    }
    .dataEntry-head-leftRight-pot__tank {
        bottom: 0;
        left: 34px;
        width: 32px;
        height: 54px;
    }
    .dataEntry-head-leftRight-pot__tank__bg {
        background-image: radial-gradient(at center top, #91d5ff, #1890ff);
    }
    .dataEntry-head-leftRight-message__item p:first-child {
        font-size: 24px;
    }
    .dataEntry-head-leftRight-message__item p:first-child em {
        font-size: 16px;
    }
}


.el-form-item--small.el-form-item {
    margin-bottom: 18px;
}

@media (max-width: 1367px) {
    .header_main .dataEntry-head-leftRight .card-left,
    .header_main .dataEntry-head-leftRight .card-right {
        height: 170px;
        padding: 10px;
    }
}
</style>
