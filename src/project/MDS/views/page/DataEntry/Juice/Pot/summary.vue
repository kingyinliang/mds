<template>
    <div class="header_main">
        <el-tabs v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="3">
                <span slot="label" class="spanview">原汁库存汇总</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style=" margin-right: 10px; color: #666;" />原汁库存汇总表（单位：方）
                    <el-button v-if="isAuth('juice:pot:juiceStockItemExport')" type="primary" size="small" style=" float: right; color: #fff; background-color: #1890ff;" @click="ExportExcelC(true)">
                        导出
                    </el-button>
                </div>
                <el-table header-row-class-name="tableHead" :data="formDataTop" border tooltip-effect="dark">
                    <el-table-column label="" :show-overflow-tooltip="true" prop="type" />
                    <el-table-column label=">=7天" :show-overflow-tooltip="true" prop="gtSevenDay" />
                    <el-table-column label="6天" :show-overflow-tooltip="true" prop="sixDay" />
                    <el-table-column label="5天" :show-overflow-tooltip="true" prop="fiveDay" />
                    <el-table-column label="4天" :show-overflow-tooltip="true" prop="fourDay" />
                    <el-table-column label="3天" :show-overflow-tooltip="true" prop="threeDay" />
                    <el-table-column label="2天" :show-overflow-tooltip="true" prop="twoDay" />
                    <el-table-column label="1天" :show-overflow-tooltip="true" prop="oneDay" />
                    <el-table-column label="0天" :show-overflow-tooltip="true" prop="zeroDay" />
                    <el-table-column label="合计" :show-overflow-tooltip="true" prop="sumAmount" />
                </el-table>
                <el-table header-row-class-name="tableHead" :data="formData" border tooltip-effect="dark" style="margin-top: 25px;">
                    <el-table-column label="" :show-overflow-tooltip="true" prop="type" />
                    <el-table-column label=">=15天" :show-overflow-tooltip="true" prop="gtFifteenDay" />
                    <el-table-column label="14天" :show-overflow-tooltip="true" prop="fourteenDay" />
                    <el-table-column label="13天" :show-overflow-tooltip="true" prop="thirteenDay" />
                    <el-table-column label="12天" :show-overflow-tooltip="true" prop="twelveDay" />
                    <el-table-column label="11天" :show-overflow-tooltip="true" prop="elevenDay" />
                    <el-table-column label="10天" :show-overflow-tooltip="true" prop="tenDay" />
                    <el-table-column label="9天" :show-overflow-tooltip="true" prop="nineDay" />
                    <el-table-column label="<9天" :show-overflow-tooltip="true" prop="ltNineDay" />
                    <el-table-column label="合计" :show-overflow-tooltip="true" prop="sumAmount" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="1">
                <span slot="label" class="spanview">原汁库存明细</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style=" margin-right: 10px; color: #666;" />原汁总库存（单位:方）
                    <el-button v-if="isAuth('juice:pot:juiceStockItemExport')" type="primary" size="small" style=" float: right; color: #fff; background-color: #1890ff;" @click="ExportExcelA(true)">
                        导出
                    </el-button>
                </div>
                <el-table header-row-class-name="tableHead" :data="formLeftData" border tooltip-effect="dark">
                    <el-table-column label="味极鲜" :show-overflow-tooltip="true" prop="weijixian" />
                    <el-table-column label="六月鲜" :show-overflow-tooltip="true" prop="liuyuexian" />
                    <el-table-column label="JY" :show-overflow-tooltip="true" prop="jy" />
                    <el-table-column label="TB" :show-overflow-tooltip="true" prop="tb" />
                    <el-table-column label="JYTB" :show-overflow-tooltip="true" prop="jytb" />
                    <el-table-column label="F0" :show-overflow-tooltip="true" prop="f0" />
                    <el-table-column label="JBS" :show-overflow-tooltip="true" prop="jbs" />
                    <el-table-column label="原汁总库存量" :show-overflow-tooltip="true" prop="sum" />
                </el-table>
                <div class="titleLeft">
                    <i class="iconfont factory-icon_function_keyongkucun" style=" margin-right: 10px; color: #666;" />原汁总库存列表（单位:方）
                </div>
                <el-table header-row-class-name="tableHead" :data="dataLeftListOrder" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexOrderMethod" fixed />
                    <el-table-column label="原汁罐号" :show-overflow-tooltip="true" prop="holderName" width="120" />
                    <el-table-column label="状态" :show-overflow-tooltip="true" width="75">
                        <template slot-scope="scope">
                            {{ scope.row.holderStatus === '6' ? '空罐' : scope.row.holderStatus === '7' ? '入料中' : scope.row.holderStatus === '8' ? '沉淀中' : scope.row.holderStatus === '9' ? '领用中' : scope.row.holderStatus === '10' ? '待清洗' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="罐内总量" :show-overflow-tooltip="true" prop="amount" width="100" />
                    <el-table-column label="发酵罐号" :show-overflow-tooltip="true" prop="fermentationHolderName" width="100" />
                    <el-table-column label="满罐日期" :show-overflow-tooltip="true" prop="fullDate" width="160" />
                    <el-table-column label="车间" :show-overflow-tooltip="true" prop="workShop" width="70" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}{{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类别" :show-overflow-tooltip="true" prop="type" width="70" />
                    <el-table-column label="是否F0/原汁JBS" :show-overflow-tooltip="true" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.isF === '1' ? 'F0' : scope.row.isF === '2' ? 'JBS' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="沉淀期" :show-overflow-tooltip="true" prop="days" width="70" />
                    <el-table-column label="入库批次" :show-overflow-tooltip="true" prop="batch" width="110" />
                    <el-table-column label="入库订单号" :show-overflow-tooltip="true" prop="orderNo" width="120" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="dataLeftCurrPage" :page-sizes="[10, 20, 50]" :page-size="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataLeftTotalCount" @size-change="handleDataSizeChange" @current-change="handleDataCurrentChange" />
                </el-row>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">可用原汁明细</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style=" margin-right: 10px; color: #666;" />原汁总库存（单位:方）
                    <el-button v-if="isAuth('juice:pot:juiceStockItemExport')" type="primary" size="small" style=" float: right; color: #fff; background-color: #1890ff;" @click="ExportExcelB(true)">
                        导出
                    </el-button>
                </div>
                <el-table header-row-class-name="tableHead" :data="formRightData" border tooltip-effect="dark">
                    <el-table-column label="味极鲜" :show-overflow-tooltip="true" prop="weijixian" />
                    <el-table-column label="六月鲜" :show-overflow-tooltip="true" prop="liuyuexian" />
                    <el-table-column label="JY" :show-overflow-tooltip="true" prop="jy" />
                    <el-table-column label="TB" :show-overflow-tooltip="true" prop="tb" />
                    <el-table-column label="JYTB" :show-overflow-tooltip="true" prop="jytb" />
                    <el-table-column label="F0" :show-overflow-tooltip="true" prop="f0" />
                    <el-table-column label="JBS" :show-overflow-tooltip="true" prop="jbs" />
                    <el-table-column label="原汁总库存量" :show-overflow-tooltip="true" prop="sum" />
                </el-table>
                <div class="titleLeft">
                    <i class="iconfont factory-icon_function_keyongkucun" style=" margin-right: 10px; color: #666;" />可用原汁列表（单位:方）
                </div>
                <el-table header-row-class-name="tableHead" :data="dataRightListOrder" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" :index="indexOrderMethodRight" fixed />
                    <el-table-column label="原汁罐号" :show-overflow-tooltip="true" prop="holderName" width="120" />
                    <el-table-column label="状态" :show-overflow-tooltip="true" width="75">
                        <template slot-scope="scope">
                            {{ scope.row.holderStatus === '6' ? '空罐' : scope.row.holderStatus === '7' ? '入料中' : scope.row.holderStatus === '8' ? '沉淀中' : scope.row.holderStatus === '9' ? '领用中' : scope.row.holderStatus === '10' ? '待清洗' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="罐内总量" :show-overflow-tooltip="true" prop="amount" width="100" />
                    <el-table-column label="发酵罐号" :show-overflow-tooltip="true" prop="fermentationHolderName" width="100" />
                    <el-table-column label="满罐日期" :show-overflow-tooltip="true" prop="fullDate" width="160" />
                    <el-table-column label="车间" :show-overflow-tooltip="true" prop="workShop" width="70" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}{{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="类别" :show-overflow-tooltip="true" prop="type" width="70" />
                    <el-table-column label="是否F0" :show-overflow-tooltip="true" width="80">
                        <template slot-scope="scope">
                            {{ scope.row.isF === '1' ? 'F0' : scope.row.isF === '2' ? 'JBS' : '' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="沉淀期" :show-overflow-tooltip="true" prop="days" width="70" />
                    <el-table-column label="入库批次" :show-overflow-tooltip="true" prop="batch" width="110" />
                    <el-table-column label="入库订单号" :show-overflow-tooltip="true" prop="orderNo" width="120" />
                </el-table>
                <el-row>
                    <el-pagination :current-page="dataRightCurrPage" :page-sizes="[10, 20, 50]" :page-size="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataRightTotalCount" @size-change="handleDataSizeChangeRight" @current-change="handleDataCurrentChangeRight" />
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
                    this.$errorToast(data.msg);
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
                    this.$errorToast(data.msg);
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
                    this.$errorToast(data.msg);
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
    margin: 15px 0;
    font-weight: 600;
    line-height: 32px;
}
</style>
