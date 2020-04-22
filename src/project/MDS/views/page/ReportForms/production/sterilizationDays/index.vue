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
                        <el-button v-if="isAuth('report:fromEs:shajunDaily')" type="primary" size="small" @click="GetDataList(true)">
                            查询
                        </el-button>
                        <el-button v-if="isAuth('report:fromEs:expectShajunDaily')" type="primary" size="small" @click="FormExportExcel(true)">
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-tabs v-model="activeName" type="border-card" style="margin-top: 5px;">
                <el-tab-pane name="0" label="杀菌一车间">
                    <el-table :data="dataList" height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod">
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
                    <el-table :data="dataList2" height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod2">
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
            </el-tabs>
        </div>
    </div>
</template>

<script>
import { dateFormat, exportFile } from '@/net/validate';
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
            activeName: '0',
            dataList: [],
            dataList2: [],
            daySizeList: ['1'],
            spanOneArr1: [],
            spanOneArr2: []
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
            this.daySizeList = [];
            this.$http(`${REP_API.STERILIZATIONDAYS_LIAT_API}`, 'POST', this.plantList).then(({ data }) => {
                if (data.code === 0) {
                    this.dataList = data.list1;
                    this.dataList2 = data.list2;
                    for (let i = 1; i <= data.daySize; i++) {
                        this.daySizeList.push(i.Toastring());
                    }
                    this.merge(this.dataList, 1);
                    this.merge(this.dataList2, 2);
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
            exportFile(`${REP_API.STERILIZATIONDAYS_EXPORT_API}`, '吹瓶日报表', this);
        }
    }
};
</script>

<style scoped></style>
