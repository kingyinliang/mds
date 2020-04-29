<template>
    <div class="header_main">
        <div>
            <el-card class="searchCard" style="margin-bottom: 5px;">
                <el-form :model="plantList" :inline="true" size="small" label-width="70px" class="multi_row clearfix" style="font-size: 0;">
                    <el-form-item label="生产工厂：">
                        <el-select v-model="plantList.factory" style="width: 170px;">
                            <el-option label="请选择" value="" />
                            <el-option v-for="sole in factory" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="月份：">
                        <el-date-picker v-model="plantList.productDate" type="month" placeholder="请选择" value-format="yyyy-MM" style="width: 170px;" />
                    </el-form-item>
                    <el-form-item class="floatr">
                        <el-button v-if="isAuth('report:all:allDaily')" type="primary" size="small" @click="GetDataList(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('report:all:expectAllDaily')" type="primary" size="small" @click="FormExportExcel(true)">
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-tabs v-model="activeName" type="border-card" style="margin-top: 5px;">
                <el-tab-pane name="tab0" label="制曲一车间">
                    <el-table :data="kojiMakingDataList1" max-height="400" border header-row-class-name="tableHead">
                        <el-table-column label="工序" prop="theDate" show-overflow-tooltip fixed />
                        <el-table-column label="炒麦">
                            <el-table-column label="小麦/kg" prop="wheat" />
                            <el-table-column label="粉麦数/kg" prop="wheatFlour" width="120" />
                            <el-table-column label="粉麦率/%" prop="wheatFlourRate" width="120" />
                            <el-table-column label="损耗率/%" prop="wheatFlourLossRate" width="120" />
                        </el-table-column>
                        <el-table-column label="PW小麦">
                            <el-table-column label="小麦/kg" prop="pwWheatOut" />
                            <el-table-column label="PW小麦/kg" prop="pwWheatIn" width="120" />
                            <el-table-column label="小颗粒/kg" prop="pwWheatSmall" width="120" />
                            <el-table-column label="出仁率/%" prop="pwKernelRate" width="120" />
                            <el-table-column label="损耗率/%" prop="pwKernelLossRate" width="120" />
                        </el-table-column>
                        <el-table-column label="制曲">
                            <el-table-column label="豆粕/kg" prop="zhiquPulp" />
                            <el-table-column label="小麦粉/kg" prop="zhiquWheatFlour" width="120" />
                            <el-table-column label="盐水/方" prop="zhiquSalt" width="120" />
                            <el-table-column label="菌种/盒" prop="zhiquBacteria" width="120" />
                            <el-table-column label="入曲/批" prop="zhiquHolderPatch" width="120" />
                            <el-table-column label="曲房号/号" prop="zhiquHouseNo" width="120" />
                            <el-table-column label="产量/方" prop="zhiquProduction" width="120" />
                        </el-table-column>
                        <el-table-column label="出曲">
                            <el-table-column label="出曲/批" prop="outHolderPatch" />
                            <el-table-column label="出曲数量/方" prop="outProduction" width="120" />
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="tab1" label="制曲二车间">
                    <el-table :data="kojiMakingDataList2" max-height="400" border header-row-class-name="tableHead">
                        <el-table-column label="工序" prop="theDate" show-overflow-tooltip fixed />
                        <el-table-column label="炒麦">
                            <el-table-column label="小麦/kg" prop="wheat" />
                            <el-table-column label="粉麦数/kg" prop="wheatFlour" width="120" />
                            <el-table-column label="粉麦率/%" prop="wheatFlourRate" width="120" />
                            <el-table-column label="损耗率/%" prop="wheatFlourLossRate" width="120" />
                        </el-table-column>
                        <el-table-column label="PW小麦">
                            <el-table-column label="小麦/kg" prop="pwWheatOut" />
                            <el-table-column label="PW小麦/kg" prop="pwWheatIn" width="120" />
                            <el-table-column label="小颗粒/kg" prop="pwWheatSmall" width="120" />
                            <el-table-column label="出仁率/%" prop="pwKernelRate" width="120" />
                            <el-table-column label="损耗率/%" prop="pwKernelLossRate" width="120" />
                        </el-table-column>
                        <el-table-column label="制曲">
                            <el-table-column label="豆粕/kg" prop="zhiquPulp" />
                            <el-table-column label="小麦粉/kg" prop="zhiquWheatFlour" width="120" />
                            <el-table-column label="盐水/方" prop="zhiquSalt" width="120" />
                            <el-table-column label="菌种/盒" prop="zhiquBacteria" width="120" />
                            <el-table-column label="入曲/批" prop="zhiquHolderPatch" width="120" />
                            <el-table-column label="曲房号/号" prop="zhiquHouseNo" width="120" />
                            <el-table-column label="产量/方" prop="zhiquProduction" width="120" />
                        </el-table-column>
                        <el-table-column label="出曲">
                            <el-table-column label="出曲/批" prop="outHolderPatch" />
                            <el-table-column label="出曲数量/方" prop="outProduction" width="120" />
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="tab3" label="压榨一车间">
                    <el-table :data="squeezeDataList1" max-height="400" border header-row-class-name="tableHead">
                        <el-table-column label="名称" prop="days" show-overflow-tooltip />
                        <el-table-column label="领用/方">
                            <el-table-column label="普通酱醪" prop="collarUse" />
                        </el-table-column>
                        <el-table-column label="产出/方">
                            <el-table-column label="普通原汁" prop="produce" />
                        </el-table-column>
                        <el-table-column label="生产笼数/笼">
                            <el-table-column label="一期" prop="oneNums" />
                            <el-table-column label="二期" prop="twoNums" />
                            <el-table-column label="三期" prop="threeNums" />
                            <el-table-column label="四期" prop="fourNums" />
                        </el-table-column>
                        <el-table-column label="酱渣板数/板" prop="plateNums" show-overflow-tooltip />
                        <el-table-column label="出油率/%" prop="oilYield" show-overflow-tooltip />
                        <el-table-column label="名称" prop="tbdays" show-overflow-tooltip />
                        <el-table-column label="领用/方">
                            <el-table-column label="JYTB酱醪" prop="tbcollarUse" />
                        </el-table-column>
                        <el-table-column label="产出/方">
                            <el-table-column label="TB原汁" prop="tbproduce" />
                        </el-table-column>
                        <el-table-column label="生产笼数/笼">
                            <el-table-column label="一期" prop="tboneNums" />
                            <el-table-column label="二期" prop="tbtwoNums" />
                            <el-table-column label="三期" prop="tbthreeNums" />
                            <el-table-column label="四期" prop="tbfourNums" />
                        </el-table-column>
                        <el-table-column label="酱渣板数/板" prop="tbplateNums" />
                        <el-table-column label="出油率/%" prop="tboilYield" width="120" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="tab4" label="压榨二车间">
                    <el-table :data="squeezeDataList2" max-height="400" border header-row-class-name="tableHead">
                        <el-table-column label="名称" prop="days" show-overflow-tooltip />
                        <el-table-column label="领用/方">
                            <el-table-column label="普通酱醪" prop="collarUse" />
                        </el-table-column>
                        <el-table-column label="产出/方">
                            <el-table-column label="普通原汁" prop="produce" />
                        </el-table-column>
                        <el-table-column label="生产笼数/笼">
                            <el-table-column label="一期" prop="oneNums" />
                            <el-table-column label="二期" prop="twoNums" />
                            <el-table-column label="三期" prop="threeNums" />
                            <el-table-column label="四期" prop="fourNums" />
                        </el-table-column>
                        <el-table-column label="酱渣板数/板" prop="plateNums" />
                        <el-table-column label="出油率/%" prop="oilYield" width="120" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="0" label="杀菌一车间">
                    <el-table :data="dataList" max-height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod">
                        <el-table-column label="产出物料" prop="materialH" width="190" show-overflow-tooltip fixed />
                        <el-table-column label="投入物料" prop="material" width="180" show-overflow-tooltip fixed />
                        <el-table-column label="月汇总" width="180" fixed>
                            <el-table-column label="产出/方" prop="monthOutput" />
                            <el-table-column label="投入/方" prop="monthInput" width="110" />
                        </el-table-column>
                        <el-table-column label="出品率" prop="monthProductRate" width="90" show-overflow-tooltip fixed />
                        <el-table-column v-for="(item, index) in daySizeList" :key="index" :label="item + '日'">
                            <el-table-column label="产出/方" :prop="`output${item}`" />
                            <el-table-column label="投入/方" :prop="`input${item}`" />
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="1" label="杀菌二车间">
                    <el-table :data="dataList2" max-height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod2">
                        <el-table-column label="产出物料" prop="materialH" width="190" show-overflow-tooltip fixed />
                        <el-table-column label="投入物料" prop="material" width="180" show-overflow-tooltip fixed />
                        <el-table-column label="月汇总" width="180" fixed>
                            <el-table-column label="产出/方" prop="monthOutput" />
                            <el-table-column label="投入/方" prop="monthInput" width="110" />
                        </el-table-column>
                        <el-table-column label="出品率" prop="monthProductRate" width="90" show-overflow-tooltip fixed />
                        <el-table-column v-for="(item, index) in daySizeList" :key="index" :label="item + '日'">
                            <el-table-column label="产出/方" :prop="`output${item}`" />
                            <el-table-column label="投入/方" :prop="`input${item}`" />
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="tab7" label="吹瓶一车间">
                    <el-table :data="bottleTable1" max-height="400" border header-row-class-name="tableHead">
                        <el-table-column label="名称" prop="theDate" />
                        <el-table-column label="瓶胚领用/个">
                            <el-table-column label="普利思" prop="plsRec" />
                            <el-table-column label="西蒙西" prop="xmxRec" />
                            <el-table-column label="尧邦" prop="ybRec" />
                        </el-table-column>
                        <el-table-column label="耗用瓶胚数量/个" prop="allRec" width="140" />
                        <el-table-column label="PET瓶产出/个">
                            <el-table-column label="普利思" prop="plsOutput" />
                            <el-table-column label="西蒙西" prop="xmxOutput" />
                            <el-table-column label="尧邦" prop="ybOutput" />
                        </el-table-column>
                        <el-table-column label="损耗数量/个" prop="loss" />
                        <el-table-column label="良品率" prop="productRate" />
                        <el-table-column label="包装领用/个" prop="pkgOutput" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane name="tab8" label="吹瓶二车间">
                    <el-table :data="bottleTable2" max-height="400" border header-row-class-name="tableHead">
                        <el-table-column label="名称" prop="theDate" />
                        <el-table-column label="瓶胚领用/个">
                            <el-table-column label="普利思" prop="plsRec" />
                            <el-table-column label="西蒙西" prop="xmxRec" />
                            <el-table-column label="尧邦" prop="ybRec" />
                        </el-table-column>
                        <el-table-column label="耗用瓶胚数量/个" prop="allRec" width="140" />
                        <el-table-column label="PET瓶产出/个">
                            <el-table-column label="普利思" prop="plsOutput" />
                            <el-table-column label="西蒙西" prop="xmxOutput" />
                            <el-table-column label="尧邦" prop="ybOutput" />
                        </el-table-column>
                        <el-table-column label="损耗数量/个" prop="loss" />
                        <el-table-column label="良品率" prop="productRate" />
                        <el-table-column label="包装领用/个" prop="pkgOutput" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'QueryTable',
    components: {},
    data() {
        return {
            plantList: {
                factory: '',
                productDate: dateFormat(new Date(), 'yyyy-MM')
            },
            factory: '',
            activeName: 'tab0',
            kojiMakingDataList1: [],
            kojiMakingDataList2: [],
            squeezeDataList1: [],
            squeezeDataList2: [],
            dataList: [],
            dataList2: [],
            daySizeList: ['1'],
            spanOneArr1: [],
            spanOneArr2: [],
            bottleTable1: [],
            bottleTable2: []
        };
    },
    computed: {},
    mounted() {
        this.Getdeptcode();
    },
    methods: {
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factory && data.typeList.length > 0) {
                        this.plantList.factory = data.typeList[0].deptId;
                    }
                } else {
                    this.$warningToast(data.msg);
                }
            });
        },
        // 获取数据
        GetDataList() {
            if (this.plantList.factory === '') {
                this.$warningToast('请选择工厂');
                return false;
            }
            if (!this.plantList.productDate) {
                this.$warningToast('请选择日期');
                return false;
            }
            // 制曲
            this.kojiMakingDataList1 = [];
            this.kojiMakingDataList2 = [];
            this.$http(`${REP_API.DAYS_REPROT_LIST}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.kojiMakingDataList1 = data.page.list;
                    this.kojiMakingDataList2 = data.page2.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
            // 压榨
            this.squeezeDataList1 = [];
            this.squeezeDataList2 = [];
            this.$http(`${REP_API.SQUEEZEDAYS_LIST}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    data.prsDays.one.forEach((it, index) => {
                        it.tbdays = data.prsDays.oneTb[index].days;
                        it.tbcollarUse = data.prsDays.oneTb[index].collarUse;
                        it.tbproduce = data.prsDays.oneTb[index].produce;
                        it.tboneNums = data.prsDays.oneTb[index].oneNums;
                        it.tbtwoNums = data.prsDays.oneTb[index].twoNums;
                        it.tbthreeNums = data.prsDays.oneTb[index].threeNums;
                        it.tbfourNums = data.prsDays.oneTb[index].fourNums;
                        it.tbplateNums = data.prsDays.oneTb[index].plateNums;
                        it.tboilYield = data.prsDays.oneTb[index].oilYield;
                    });
                    this.squeezeDataList1 = data.prsDays.one;
                    this.squeezeDataList2 = data.prsDays.two;
                    if (data.prsDays.one.length) {
                        this.squeezeDataList1.unshift({
                            days: '月计',
                            tbdays: '月计',
                            collarUse: data.prsDays.one[0].collarUseSum,
                            produce: data.prsDays.one[0].produceSum,
                            oneNums: data.prsDays.one[0].oneNumsSum,
                            twoNums: data.prsDays.one[0].twoNumsSum,
                            threeNums: data.prsDays.one[0].threeNumsSum,
                            fourNums: data.prsDays.one[0].fourNumsSum,
                            plateNums: data.prsDays.one[0].plateNumsSum,
                            oilYield: data.prsDays.one[0].monthOilYield,
                            tbcollarUse: data.prsDays.oneTb[0].collarUseSum,
                            tbproduce: data.prsDays.oneTb[0].produceSum,
                            tboneNums: data.prsDays.oneTb[0].oneNumsSum,
                            tbtwoNums: data.prsDays.oneTb[0].twoNumsSum,
                            tbthreeNums: data.prsDays.oneTb[0].threeNumsSum,
                            tbfourNums: data.prsDays.oneTb[0].fourNumsSum,
                            tbplateNums: data.prsDays.oneTb[0].plateNumsSum,
                            tboilYield: data.prsDays.oneTb[0].monthOilYield
                        });
                    }
                    if (data.prsDays.two.length) {
                        this.squeezeDataList2.unshift({
                            days: '月计',
                            collarUse: data.prsDays.two[0].collarUseSum,
                            produce: data.prsDays.two[0].produceSum,
                            oneNums: data.prsDays.two[0].oneNumsSum,
                            twoNums: data.prsDays.two[0].twoNumsSum,
                            threeNums: data.prsDays.two[0].threeNumsSum,
                            fourNums: data.prsDays.two[0].fourNumsSum,
                            plateNums: data.prsDays.two[0].plateNumsSum,
                            oilYield: data.prsDays.two[0].monthOilYield
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
            //杀菌
            this.dataList = [];
            this.dataList2 = [];
            this.$http(`${REP_API.STERILIZATIONDAYS_LIAT_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.list1;
                    this.dataList2 = data.list2;
                    for (let i = 1; i <= data.daySize; i++) {
                        this.daySizeList.push(i.toString());
                    }
                    this.merge(this.dataList, 1);
                    this.merge(this.dataList2, 2);
                } else {
                    this.$errorToast(data.msg);
                }
            });
            // 吹瓶
            this.bottleTable1 = [];
            this.bottleTable2 = [];
            this.$http(`${REP_API.BOTTLE_LIST_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.bottleTable1 = data.list1;
                    this.bottleTable2 = data.list2;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        merge(tableData, Num) {
            const spanOneArr = [];
            let concatOne = 0;
            tableData.forEach((item, index) => {
                if (index === 0) {
                    spanOneArr.push(1);
                } else if (item.materialH === '') {
                        spanOneArr.push(1);
                        concatOne = index;
                    } else if (item.materialH === tableData[index - 1].materialH) {
                        // 第一列需合并相同内容的判断条件
                        spanOneArr[concatOne] += 1;
                        spanOneArr.push(0);
                    } else {
                        spanOneArr.push(1);
                        concatOne = index;
                    }
            });
            Num === 1 ? (this.spanOneArr1 = spanOneArr) : (this.spanOneArr2 = spanOneArr);
        },
        objectSpanMethod({ rowIndex, columnIndex }) {
            if (columnIndex === 0 || columnIndex === 2 || columnIndex === 4 || (columnIndex > 4 && columnIndex % 2 !== 0)) {
                return {
                    rowspan: this.spanOneArr1[rowIndex],
                    colspan: this.spanOneArr1[rowIndex] > 0 ? 1 : 0
                };
            }
        },
        objectSpanMethod2({ rowIndex, columnIndex }) {
            if (columnIndex === 0 || columnIndex === 2 || columnIndex === 4 || (columnIndex > 4 && columnIndex % 2 !== 0)) {
                return {
                    rowspan: this.spanOneArr2[rowIndex],
                    colspan: this.spanOneArr2[rowIndex] > 0 ? 1 : 0
                };
            }
        },
        // 导出
        FormExportExcel() {
            // exportFile(`${REP_API.STERILIZATIONDAYS_EXPORT_API}`, '所有车间日报表', this);
        }
    }
};
</script>

<style scoped></style>
