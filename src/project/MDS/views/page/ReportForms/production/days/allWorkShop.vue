<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            table-class="borderTable"
            :custom-data="true"
            :query-form-data="queryFormData"
            :rules="rules"
            :list-interface="listInterface"
            :query-auth="'report:all:allDaily'"
            :export-excel="true"
            :export-option="exportOption"
            :fix-table-height-from-top="180"
            :show-page="false"
            :tabs="tabs"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <el-table class="newTable borderTable" :data="kojiMakingDataList1" max-height="400" border header-row-class-name="tableHead">
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
            </template>
            <template slot="tab-head1">
                <el-table class="newTable borderTable" :data="kojiMakingDataList2" max-height="400" border header-row-class-name="tableHead">
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
            </template>
            <template slot="tab-head2">
                <el-table class="newTable borderTable" :data="squeezeDataList1" max-height="400" border header-row-class-name="tableHead">
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
            </template>
            <template slot="tab-head3">
                <el-table class="newTable borderTable" :data="squeezeDataList2" max-height="400" border header-row-class-name="tableHead">
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
            </template>
            <template slot="tab-head4">
                <el-table class="newTable borderTable" :data="dataList" max-height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod">
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
            </template>
            <template slot="tab-head5">
                <el-table class="newTable borderTable" :data="dataList2" max-height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod2">
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
            </template>
            <template slot="tab-head6">
                <el-table class="newTable borderTable" :data="bottleTable1" max-height="400" border header-row-class-name="tableHead">
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
            </template>
            <template slot="tab-head7">
                <el-table class="newTable borderTable" :data="bottleTable2" max-height="400" border header-row-class-name="tableHead">
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
            </template>
        </query-table>
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'All',
    components: {},
    data() {
        return {
            rules: [
                {
                    prop: 'factory',
                    text: '请选择工厂'
                },
                {
                    prop: 'productDate',
                    text: '请选择月份'
                }
            ],
            tabs: [
                {
                    label: '制曲一车间'
                },
                {
                    label: '制曲二车间'
                },
                {
                    label: '压榨一车间'
                },
                {
                    label: '压榨二车间'
                },
                {
                    label: '杀菌一车间'
                },
                {
                    label: '杀菌二车间'
                },
                {
                    label: '吹瓶一车间'
                },
                {
                    label: '吹瓶二车间'
                }
            ],
            queryFormData: [
                {
                    type: 'select',
                    label: '生产工厂',
                    prop: 'factory',
                    defaultOptionsFn: () => {
                        return this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false);
                    },
                    resVal: {
                        resData: 'typeList',
                        label: ['deptName'],
                        value: 'deptId'
                    }
                },
                {
                    type: 'date-picker',
                    label: '选择月份',
                    dataType: 'month',
                    prop: 'productDate',
                    valueFormat: 'yyyy-MM',
                    defaultValue: dateFormat(new Date(), 'yyyy-MM')
                }
            ],
            listInterface: () => {
                return new Promise((resolve) => {
                    resolve({})
                })
            },
            exportOption: {
                exportInterface: REP_API.ALLWORKSHOPDAY_EXPORT_API,
                auth: 'report:all:expectAllDaily',
                text: '生管日报表'
            },
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
    methods: {
        setData() {
            // 制曲
            this.kojiMakingDataList1 = [];
            this.kojiMakingDataList2 = [];
            this.$http(`${REP_API.DAYS_REPROT_LIST}`, 'POST', this.$refs.queryTable.queryForm).then(({ data }) => {
                if (data.code === 0) {
                    this.kojiMakingDataList1 = (data.page ? data.page.list : []);
                    this.kojiMakingDataList2 = (data.page2 ? data.page2.list : []);
                } else {
                    this.$errorToast(data.msg);
                }
            });
            // 压榨
            this.squeezeDataList1 = [];
            this.squeezeDataList2 = [];
            this.$http(`${REP_API.SQUEEZEDAYS_LIST}`, 'POST', this.$refs.queryTable.queryForm).then(({ data }) => {
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
            this.$http(`${REP_API.STERILIZATIONDAYS_LIAT_API}`, 'POST', this.$refs.queryTable.queryForm).then(({ data }) => {
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
            this.$http(`${REP_API.BOTTLE_LIST_API}`, 'POST', this.$refs.queryTable.queryForm).then(({ data }) => {
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
        }
    }
};
</script>

<style scoped></style>
