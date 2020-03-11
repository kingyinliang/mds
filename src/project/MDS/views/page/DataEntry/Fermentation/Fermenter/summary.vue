<template>
    <div class="header_main">
        <el-tabs v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">发酵一览表</span>
                <div class="titleLeft">
                    (单位:罐)
                    <el-button v-if="isAuth('report:production:fermentationExport')" type="primary" size="small" style="float: right;" @click="FormExportExcel(true)">
                        导出
                    </el-button>
                </div>
                <el-table :data="dataList2" border headerRowClassName="tableHead" style="margin-top: 10px;">
                    <el-table-column label=" " prop="type" />
                    <el-table-column label="<30" prop="ltThirty" />
                    <el-table-column label="30≤N<60" prop="ltSixty" />
                    <el-table-column label="60≤N<90" prop="ltNinety" />
                    <el-table-column label="90≤N<130" prop="ltOneHundredAndThree" />
                    <el-table-column label="130≤N<150" prop="ltOneHundredAndFive" />
                    <el-table-column label="150≤N<180" prop="ltOneHundredAndEight" />
                    <el-table-column label="180≤N<200" prop="ltTwoHundred" />
                    <el-table-column label="200≤N" prop="gtTwoHundred" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">发酵库存列表</span>
                <div class="titleLeft">
                    <i class="iconfont factory-kucun" style="color: #666; margin-right: 10px;" />发酵罐分布情况
                    <el-button v-if="isAuth('report:production:fermentationExport')" type="primary" size="small" style="background-color: #1890ff; color: #fff; float: right;" @click="ExportExcelA(true)">
                        导出
                    </el-button>
                </div>
                <el-table :data="headerInfo" border headerRowClassName="tableHead" style="margin-top: 10px;">
                    <el-table-column label="区域" showOverflowTooltip prop="holderArea" />
                    <el-table-column label="空罐" showOverflowTooltip prop="empty" />
                    <el-table-column label="投料中" showOverflowTooltip prop="feeding" />
                    <el-table-column label="发酵中" showOverflowTooltip prop="fermentation" />
                    <el-table-column label="领用中" showOverflowTooltip prop="collarUse" />
                    <el-table-column label="其他占用罐" showOverflowTooltip prop="other" />
                    <el-table-column label="味极鲜罐数" showOverflowTooltip prop="weijixian" />
                    <el-table-column label="六月鲜罐数" showOverflowTooltip prop="liuyuexian" />
                    <el-table-column label="TB罐数" showOverflowTooltip prop="tb" />
                    <el-table-column label="JYTB罐数" showOverflowTooltip prop="jytb" />
                    <el-table-column label="JY罐数" showOverflowTooltip prop="jy" />
                    <el-table-column label="发酵一总罐数" showOverflowTooltip prop="sum" width="110" />
                </el-table>
                <div class="titleLeft" style="margin-top: 15px;">
                    <i class="iconfont factory-icon_function_keyongkucun" style="color: #666; margin-right: 10px;" />发酵总库存列表
                </div>
                <el-table :data="dataList" border headerRowClassName="tableHead" style="margin-top: 10px;">
                    <el-table-column label="罐号" showOverflowTooltip prop="holderNo" width="50" />
                    <el-table-column label="状态" showOverflowTooltip prop="holderStatus" width="70" />
                    <el-table-column label="投料数(M³)" showOverflowTooltip prop="realInAmount" width="75" />
                    <el-table-column label="入库数(M³)" showOverflowTooltip prop="ferAmount" width="75" />
                    <el-table-column label="库存数(M³)" showOverflowTooltip prop="stockAmount" width="75" />
                    <el-table-column label="类别" prop="halfType" showOverflowTooltip width="70" />
                    <el-table-column label="" showOverflowTooltip prop="feedingDate" width="100">
                        <template slot="header">
                            投料开始<br>时间
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.feedingDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="" showOverflowTooltip prop="fermentDate" width="100">
                        <template slot="header">
                            发酵开始<br>时间
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.fermentDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵结束时间" showOverflowTooltip prop="fermentEndDate" width="100">
                        <template slot="header">
                            发酵结束<br>时间
                        </template>
                        <template slot-scope="scope">
                            {{ scope.row.fermentEndDate }}
                        </template>
                    </el-table-column>
                    <el-table-column label="发酵期" showOverflowTooltip prop="fermentTime" width="60" />
                    <el-table-column label="发酵时间" showOverflowTooltip prop="fermentDays" width="50" />
                    <el-table-column label="压榨时间" showOverflowTooltip prop="pulpDate" width="100" />
                    <el-table-column label="领用酱醪数(M³)" showOverflowTooltip prop="useNums" width="80" />
                    <el-table-column label="出品数" showOverflowTooltip prop="outAmount" width="70" />
                    <el-table-column label="出品率" showOverflowTooltip prop="yield" width="80" />
                    <el-table-column label="发酵罐容量(M³)" showOverflowTooltip prop="holderHold" />
                </el-table>
                <el-pagination :currentPage="currentPage" :pageSizes="[10, 15, 30, 35]" :pageSize="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { FERMENTATION_API, REP_API } from '@/api/api';
import { exportFile } from '@/net/validate';
export default {
    name: 'Summarys',
    data() {
        return {
            activeName: '1',
            currentPage: 1,
            pageSize: 10,
            total: 0,
            headerInfo: [],
            dataList: [],
            dataListAll: [],
            plantList: {
                workShop: ''
            },
            dataList2: []
        };
    },
    mounted() {
        this.GetList();
        this.GetList2();
    },
    methods: {
        GetList() {
            this.$http(`${FERMENTATION_API.FER_REPORT_LIST}`, 'POST', {
                workShop: this.$store.state.common.Fermentation.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    // this.headerInfo = data.returnMap.head
                    data.returnMap.head.map(item => {
                        this.headerInfo.push(item);
                    });
                    this.dataListAll = data.returnMap.info;
                    this.total = data.returnMap.info.length;
                    this.changeList();
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.changeList();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.changeList();
        },
        changeList() {
            this.dataList = this.dataListAll.slice((this.currentPage - 1) * this.pageSize, (this.currentPage - 1) * this.pageSize + this.pageSize);
        },
        // 导出
        ExportExcelA() {
            this.plantList.workShop = this.$store.state.common.Fermentation.workShop;
            exportFile(`${FERMENTATION_API.FER_REPORT_EXPORTLIST}`, '发酵罐一览表', this);
        },
        GetList2() {
            this.$http(`${REP_API.FERMENTATION_LIST_API}`, 'POST', {}).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList2 = data.fermentationStatus;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        FormExportExcel() {
            const that = this;
            exportFile(`${REP_API.FERMENTATION_EXPORT_API}`, '发酵一览表报表', that);
        }
    }
};
</script>

<style lang="scss" scoped>
.titleLeft {
    font-weight: bold;
    margin: 0;
    line-height: 32px;
}
</style>
