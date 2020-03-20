<template>
    <div class="header_main">
        <el-tabs v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="3">
                <span slot="label" class="spanview">原汁库存汇总</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;" />原汁库存汇总表（单位：方）
                    <el-button v-if="isAuth('juice:pot:juiceStockItemExport')" type="primary" size="small" style="background-color: #1890ff; color: #fff; float: right;" @click="ExportExcelC(true)">
                        导出
                    </el-button>
                </div>
                <el-table headerRowClassName="tableHead" :data="formDataTop" border tooltipEffect="dark">
                    <el-table-column label="" :showOverflowTooltip="true" prop="type" />
                    <el-table-column label=">=7天" :showOverflowTooltip="true" prop="gtSevenDay" />
                    <el-table-column label="6天" :showOverflowTooltip="true" prop="sixDay" />
                    <el-table-column label="5天" :showOverflowTooltip="true" prop="fiveDay" />
                    <el-table-column label="4天" :showOverflowTooltip="true" prop="fourDay" />
                    <el-table-column label="3天" :showOverflowTooltip="true" prop="threeDay" />
                    <el-table-column label="2天" :showOverflowTooltip="true" prop="twoDay" />
                    <el-table-column label="1天" :showOverflowTooltip="true" prop="oneDay" />
                    <el-table-column label="0天" :showOverflowTooltip="true" prop="zeroDay" />
                    <el-table-column label="合计" :showOverflowTooltip="true" prop="sumAmount" />
                </el-table>
                <el-table headerRowClassName="tableHead" :data="formData" border tooltipEffect="dark" style="margin-top: 25px;">
                    <el-table-column label="" :showOverflowTooltip="true" prop="type" />
                    <el-table-column label=">=15天" :showOverflowTooltip="true" prop="gtFifteenDay" />
                    <el-table-column label="14天" :showOverflowTooltip="true" prop="fourteenDay" />
                    <el-table-column label="13天" :showOverflowTooltip="true" prop="thirteenDay" />
                    <el-table-column label="12天" :showOverflowTooltip="true" prop="twelveDay" />
                    <el-table-column label="11天" :showOverflowTooltip="true" prop="elevenDay" />
                    <el-table-column label="10天" :showOverflowTooltip="true" prop="tenDay" />
                    <el-table-column label="9天" :showOverflowTooltip="true" prop="nineDay" />
                    <el-table-column label="<9天" :showOverflowTooltip="true" prop="ltNineDay" />
                    <el-table-column label="合计" :showOverflowTooltip="true" prop="sumAmount" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="1">
                <span slot="label" class="spanview">原汁库存明细</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;" />原汁总库存（单位:方）
                    <el-button v-if="isAuth('juice:pot:juiceStockItemExport')" type="primary" size="small" style="background-color: #1890ff; color: #fff; float: right;" @click="ExportExcelA(true)">
                        导出
                    </el-button>
                </div>
                <el-table headerRowClassName="tableHead" :data="formLeftData" border tooltipEffect="dark">
                    <el-table-column label="味极鲜" :showOverflowTooltip="true" prop="weijixian" />
                    <el-table-column label="六月鲜" :showOverflowTooltip="true" prop="liuyuexian" />
                    <el-table-column label="JY" :showOverflowTooltip="true" prop="jy" />
                    <el-table-column label="TB" :showOverflowTooltip="true" prop="tb" />
                    <el-table-column label="JYTB" :showOverflowTooltip="true" prop="jytb" />
                    <el-table-column label="F0" :showOverflowTooltip="true" prop="f0" />
                    <el-table-column label="JBS" :showOverflowTooltip="true" prop="jbs" />
                    <el-table-column label="原汁总库存量" :showOverflowTooltip="true" prop="sum" />
                </el-table>
                <div class="titleLeft">
                    <i class="iconfont factory-icon_function_keyongkucun" style="color: #666; margin-right: 10px;" />原汁总库存列表（单位:方）
                </div>
                <el-table headerRowClassName="tableHead" :data="dataLeftListOrder" border tooltipEffect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexOrderMethod" />
                    <el-table-column label="原汁罐号" :showOverflowTooltip="true" prop="holderName" width="120" />
                    <el-table-column label="状态" :showOverflowTooltip="true" width="75">
                        <template slot-scope="scope">
                            {{ scope.row.holderStatus === '6' ? '空罐' : scope.row.holderStatus === '7' ? '入料中' : scope.row.holderStatus === '8' ? '沉淀中' : scope.row.holderStatus === '9' ? '领用中' : scope.row.holderStatus === '10' ? '待清洗' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="罐内总量" :showOverflowTooltip="true" prop="amount" width="100" />
                    <el-table-column label="发酵罐号" :showOverflowTooltip="true" prop="fermentationHolderName" width="100" />
                    <el-table-column label="满罐日期" :showOverflowTooltip="true" prop="fullDate" width="160" />
                    <el-table-column label="车间" :showOverflowTooltip="true" prop="workShop" width="70" />
                    <el-table-column label="物料" :showOverflowTooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}{{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类别" :showOverflowTooltip="true" prop="type" width="70" />
                    <el-table-column label="是否F0/原汁JBS" :showOverflowTooltip="true" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.isF === '1' ? 'F0' : scope.row.isF === '2' ? 'JBS' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="沉淀期" :showOverflowTooltip="true" prop="days" width="70" />
                    <el-table-column label="入库批次" :showOverflowTooltip="true" prop="batch" width="110" />
                    <el-table-column label="入库订单号" :showOverflowTooltip="true" prop="orderNo" width="120" />
                </el-table>
                <el-row>
                    <el-pagination :currentPage="dataLeftCurrPage" :pageSizes="[10, 20, 50]" :pageSize="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataLeftTotalCount" @size-change="handleDataSizeChange" @current-change="handleDataCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">可用原汁明细</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;" />原汁总库存（单位:方）
                    <el-button v-if="isAuth('juice:pot:juiceStockItemExport')" type="primary" size="small" style="background-color: #1890ff; color: #fff; float: right;" @click="ExportExcelB(true)">
                        导出
                    </el-button>
                </div>
                <el-table headerRowClassName="tableHead" :data="formRightData" border tooltipEffect="dark">
                    <el-table-column label="味极鲜" :showOverflowTooltip="true" prop="weijixian" />
                    <el-table-column label="六月鲜" :showOverflowTooltip="true" prop="liuyuexian" />
                    <el-table-column label="JY" :showOverflowTooltip="true" prop="jy" />
                    <el-table-column label="TB" :showOverflowTooltip="true" prop="tb" />
                    <el-table-column label="JYTB" :showOverflowTooltip="true" prop="jytb" />
                    <el-table-column label="F0" :showOverflowTooltip="true" prop="f0" />
                    <el-table-column label="JBS" :showOverflowTooltip="true" prop="jbs" />
                    <el-table-column label="原汁总库存量" :showOverflowTooltip="true" prop="sum" />
                </el-table>
                <div class="titleLeft">
                    <i class="iconfont factory-icon_function_keyongkucun" style="color: #666; margin-right: 10px;" />可用原汁列表（单位:方）
                </div>
                <el-table headerRowClassName="tableHead" :data="dataRightListOrder" border tooltipEffect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexOrderMethodRight" />
                    <el-table-column label="原汁罐号" :showOverflowTooltip="true" prop="holderName" width="120" />
                    <el-table-column label="状态" :showOverflowTooltip="true" width="75">
                        <template slot-scope="scope">
                            {{ scope.row.holderStatus === '6' ? '空罐' : scope.row.holderStatus === '7' ? '入料中' : scope.row.holderStatus === '8' ? '沉淀中' : scope.row.holderStatus === '9' ? '领用中' : scope.row.holderStatus === '10' ? '待清洗' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="罐内总量" :showOverflowTooltip="true" prop="amount" width="100" />
                    <el-table-column label="发酵罐号" :showOverflowTooltip="true" prop="fermentationHolderName" width="100" />
                    <el-table-column label="满罐日期" :showOverflowTooltip="true" prop="fullDate" width="160" />
                    <el-table-column label="车间" :showOverflowTooltip="true" prop="workShop" width="70" />
                    <el-table-column label="物料" :showOverflowTooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}{{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类别" :showOverflowTooltip="true" prop="type" width="70" />
                    <el-table-column label="是否F0" :showOverflowTooltip="true" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.isF === '1' ? 'F0' : scope.row.isF === '2' ? 'JBS' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="沉淀期" :showOverflowTooltip="true" prop="days" width="70" />
                    <el-table-column label="入库批次" :showOverflowTooltip="true" prop="batch" width="110" />
                    <el-table-column label="入库订单号" :showOverflowTooltip="true" prop="orderNo" width="120" />
                </el-table>
                <el-row>
                    <el-pagination :currentPage="dataRightCurrPage" :pageSizes="[10, 20, 50]" :pageSize="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataRightTotalCount" @size-change="handleDataSizeChangeRight" @current-change="handleDataCurrentChangeRight" />
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { JUICE_API } from '@/api/api';
import { exportFile } from '@/net/validate';
export default {
    name: 'Summarys',
    data() {
        return {
            activeName: '3',
            formLeftData: [],
            dataLeftListOrderTotal: [],
            dataLeftListOrder: [],
            dataPageSize: 10,
            dataLeftCurrPage: 1,
            dataLeftTotalCount: 0,
            formRightData: [],
            dataRightListOrderTotal: [],
            dataRightListOrder: [],
            dataPageSizeRight: 10,
            dataRightCurrPage: 1,
            dataRightTotalCount: 0,
            plantList: {},
            formDataTop: [],
            formData: []
        };
    },
    mounted() {
        this.GetInfo();
    },
    methods: {
        GetInfo() {
            this.$http(`${JUICE_API.JUICE_JUICE_STOCKITEM}`, 'POST', {
                TYPE: 'all'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formLeftData = [data.juiceStockItem.juiceStockItemHead];
                    this.dataLeftTotalCount = data.juiceStockItem.juiceStockItemPot.length;
                    this.dataLeftListOrderTotal = data.juiceStockItem.juiceStockItemPot;
                    this.changeLeftDataList();
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
            this.$http(`${JUICE_API.JUICE_JUICE_STOCKITEM}`, 'POST', {
                TYPE: 'alls'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formRightData = [data.juiceStockItem.juiceStockItemHead];
                    this.dataRightTotalCount = data.juiceStockItem.juiceStockItemPot.length;
                    this.dataRightListOrderTotal = data.juiceStockItem.juiceStockItemPot;
                    this.changeRightDataList();
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
            this.$http(`${JUICE_API.JUICE_POT_STOCKSUM}`, 'POST', {}).then(({ data }) => {
                if (data.code === 0) {
                    data.getJuiceStork.map(item => {
                        if (item.type === 'F0' || item.type === 'JBS') {
                            this.formData.push(item);
                        } else {
                            this.formDataTop.push(item);
                        }
                    });
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 序号
        indexOrderMethod(index) {
            return index + 1 + (Number(this.dataLeftCurrPage) - 1) * (Number(this.dataPageSize));
        },
        handleDataSizeChange(val) {
            this.dataPageSize = val;
            this.dataLeftCurrPage = 1;
            this.changeLeftDataList();
        },
        handleDataCurrentChange(val) {
            this.dataLeftCurrPage = val;
            this.changeLeftDataList();
        },
        changeLeftDataList() {
            this.dataLeftListOrder = this.dataLeftListOrderTotal.slice((this.dataLeftCurrPage - 1) * this.dataPageSize, (this.dataLeftCurrPage - 1) * this.dataPageSize + this.dataPageSize);
        },
        // 序号
        indexOrderMethodRight(index) {
            return index + 1 + (Number(this.dataLeftCurrPage) - 1) * (Number(this.dataPageSize));
        },
        handleDataSizeChangeRight(val) {
            this.dataPageSizeRight = val;
            this.dataRightCurrPage = 1;
            this.changeRightDataList();
        },
        handleDataCurrentChangeRight(val) {
            this.dataRightCurrPage = val;
            this.changeRightDataList();
        },
        changeRightDataList() {
            this.dataRightListOrder = this.dataRightListOrderTotal.slice((this.dataRightCurrPage - 1) * this.dataPageSizeRight, (this.dataRightCurrPage - 1) * this.dataPageSizeRight + this.dataPageSizeRight);
        },
        // 导出
        ExportExcelA() {
            this.plantList.TYPE = 'all';
            exportFile(`${JUICE_API.JUICE_STOCKITEM_KUCUN}`, '原汁库存明细', this);
        },
        ExportExcelB() {
            this.plantList.TYPE = 'alls';
            exportFile(`${JUICE_API.JUICE_STOCKITEM_KUCUN}`, '可用原汁明细', this);
        },
        ExportExcelC() {
            this.plantList.TYPE = 'alls';
            exportFile(`${JUICE_API.JUICE_STOCKITEM_KUCUN}`, '可用原汁汇总', this);
        }
    }
};
</script>

<style lang="scss" scoped>
.titleLeft {
    font-weight: 600;
    margin: 15px 0;
    line-height: 32px;
}
</style>
