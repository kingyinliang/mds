<!--
 * @Description:发酵车间/发酵罐一览表
 * @Anthor: Telliex
 * @Date: 2020-12-01 20:33:02
 * @LastEditors: Telliex
 * @LastEditTime: 2021-02-02 14:49:45
-->
<template>
    <data-entry ref="dataEntry" :tabs="tabs" :order-status-show="false" :header-area-show="false" :redact-box-show="false" class="mainForm">
        <template slot="1">
            <mds-card title="发酵罐一览表(单位: 罐/个)" :name="'kojiGuard'">
                <template slot="titleBtn">
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="exportFermentSummary">
                            导出
                        </el-button>
                    </div>
                </template>
                <el-table class="newTable other" :data="targetSummaryQueryTableList" max-height="500" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column label="名称" :show-overflow-tooltip="true" min-width="210">
                        <template slot-scope="scope">
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="N<30" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount0 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="30<=N<60" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount30 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="60<=N<90" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount60 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="90<=N<120" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount90 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="120<=N<150" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount120 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="150<=N<180" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount150 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="N>=180" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentingAmount180 }}
                        </template>
                    </el-table-column>
                    <el-table-column label="超期" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.overdueAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用中" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.openAmount }}
                        </template>
                    </el-table-column>
                </el-table>
                <ul class="solerow">
                    <li>
                        <span class="title">
                            容量总数:
                        </span>
                        <span class="content">
                            {{ holderNum }}
                        </span>
                    </li>
                    <li>
                        <span class="title">
                            空罐数量:
                        </span>
                        <span class="content">
                            {{ emptyHolderNum }}
                        </span>
                    </li>
                    <li>
                        <span class="title">
                            待清洗数量:
                        </span>
                        <span class="content">
                            {{ needClearNum }}
                        </span>
                    </li>
                </ul>
            </mds-card>
        </template>
        <template slot="2">
            <mds-card title="发酵库存列表" :name="'kojiGuard'">
                <template slot="titleBtn">
                    <div style="float: right;">
                        <el-button type="primary" size="small" @click="exportFermentStockSummary">
                            导出
                        </el-button>
                    </div>
                </template>
                <el-table class="newTable other" :data="targetSotckSummaryQueryTableList" max-height="500" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column label="容器类别" :show-overflow-tooltip="true" min-width="210" fixed="left">
                        <template slot-scope="scope">
                            {{ scope.row.holderTypeName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="容器号" :show-overflow-tooltip="true" width="140" fixed="left">
                        <template slot-scope="scope">
                            {{ scope.row.holderName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentorStatusName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料数(吨)" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.injectionAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="库存数(吨)" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.currentStock }}
                        </template>
                    </el-table-column>
                    <el-table-column label="投料开始时间" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.intoDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵开始时间" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.fullDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵结束时间" :show-overflow-tooltip="true" width="180">
                        <template slot-scope="scope">
                            {{ scope.row.fermentEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵期" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.matureDays }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵时间" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.fermentDays }}
                        </template>
                    </el-table-column>
                    <el-table-column label="调酱时间" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.mixDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用时间" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.receiveDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="领用数(吨)" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.receiveAmount }}
                        </template>
                    </el-table-column>
                    <el-table-column label="出品率" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.yieldRate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="容器容量(吨)" :show-overflow-tooltip="true" width="140">
                        <template slot-scope="scope">
                            {{ scope.row.holderVolume }}
                        </template>
                    </el-table-column>
                </el-table>
            </mds-card>
        </template>
    </data-entry>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { FER_API } from 'common/api/api';
    // import { exportFileForm } from 'utils/utils.ts';
    import { getNewDate } from '@/net/validate';

    @Component({
        name: 'OverviewIndex',
        components: {
        }
    })
    export default class OverviewIndex extends Vue {
        $refs: {
        };

        targetSummaryQueryTableList: QuerySummary[] = []; // 发酵罐一览表
        targetSotckSummaryQueryTableList: StockQuerySummary[] = []; // 发酵库存列表

        tabs = [
            {
                label: '发酵一览表'
            },
            {
                label: '发酵库存列表'
            }
        ];

        holderNum = 0; // 容器总量
        emptyHolderNum = 0; // 空罐数量
        needClearNum = 0; // 待清洗数量

        mounted() {
            // 发酵一览表
            FER_API.FER_FERMENTOR_SUMMARY_QUERY_API({}).then(({ data }) => {
                console.log('发酵一览表');
                console.log(data);
                this.targetSummaryQueryTableList = [];
                if (data.data) {
                    this.targetSummaryQueryTableList = data.data.summaryList;
                    this.holderNum = data.data.total;
                    this.emptyHolderNum = data.data.emptyAmount;
                    this.needClearNum = data.data.cleaningAmount;
                }
            });

            // 发酵罐库存汇总信息
            FER_API.FER_FERMENTOR_STOCK_SUMMARY_QUERY_API({}).then(({ data }) => {
                console.log('发酵罐库存汇总信息');
                console.log(data);
                this.targetSotckSummaryQueryTableList = [];
                if (data.data) {
                    this.targetSotckSummaryQueryTableList = data.data;
                }
            });
        }

        // TODOS 发酵一览表导出部分未处理
        // 发酵一览表 export
        exportFermentSummary() {
            // exportFileForm(`${FER_API.FER_EXPORT_FERMENTOR_SUMMARY_QUERY_API}`, '发酵一览表报表', this);

            FER_API.FER_EXPORT_FERMENTOR_SUMMARY_QUERY_API({}).then(({ data }) => {
                console.log('发酵一览表报表');
                console.log(data);
                if (data.data.url) {
                    const elink = document.createElement('a');
                    elink.download = `发酵一览表报表${getNewDate()}.xls`;
                    elink.style.display = 'none';
                    elink.href = data.data.url;
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                }
            });
        }

        // TODOS 发酵罐库存汇总信息导出部分未处理
        // 发酵罐库存汇总信息 export
        exportFermentStockSummary() {
            // exportFileForm(`${FER_API.FER_EXPORT_FERMENTOR_STOCK_SUMMARY_QUERY_API}`, '发酵罐库存汇总信息表', this);
            FER_API.FER_EXPORT_FERMENTOR_STOCK_SUMMARY_QUERY_API({}).then(({ data }) => {
                console.log('发酵罐库存汇总信息表');
                console.log(data);
                if (data.data.url) {
                    const elink = document.createElement('a');
                    elink.download = `发酵罐库存汇总信息表${getNewDate()}.xls`;
                    elink.style.display = 'none';
                    elink.href = data.data.url;
                    document.body.appendChild(elink);
                    elink.click();
                    document.body.removeChild(elink);
                }
            });
        }
    }

    interface QuerySummary {
        emptyAmount: number;
        fermentingAmount0: number;
        fermentingAmount120: number;
        fermentingAmount150: number;
        fermentingAmount180: number;
        fermentingAmount30: number;
        fermentingAmount60: number;
        fermentingAmount90: number;
        materialCode: string;
        materialName: string;
        openAmount: number;
        overdueAmount: number;
    }

    interface StockQuerySummary {
        currentStock: number;
        fermentDays: number;
        fermentEndDate: string;
        fermentorStatus: string;
        fermentorStatusName: string;
        fullDate: string;
        holderId: string;
        holderName: string;
        holderType: string;
        holderTypeName: string;
        holderVolume: number;
        inStorageAmount: number;
        injectionAmount: number;
        intoDate: string;
        materialCode: string;
        materialName: string;
        matureDays: number;
        mixDate: string;
        receiveAmount: number;
        receiveDate: string;
        yieldRate: string;
    }
</script>
<style  scoped>
.mainForm >>> .dataEntry-head {
    display: none;
}
</style>
<style lang="scss" scoped>
.solerow {
    display: flex;
    li {
        display: flex;
        width: 130px;
        margin-top: 5px;
        margin-right: 20px;
        color: #333;
        font-weight: 500;
        font-size: 12px;
        line-height: 33px;
    }

    span.title {
        flex: 2;
    }
    span.content {
        flex: 1;
        padding: 0 14px;
        text-align: left;
        background-color: #f5f5f5;
        border: none;
        border-radius: 4px;
    }
}

</style>
