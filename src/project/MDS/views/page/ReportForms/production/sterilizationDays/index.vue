<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            table-class="borderTable"
            :query-form-data="queryFormData"
            :rules="rules"
            :custom-data="true"
            :list-interface="listInterface"
            :query-auth="'report:fromEs:shajunDaily'"
            :export-excel="true"
            :export-option="exportOption"
            :fix-table-height-from-top="180"
            :show-page="false"
            :tabs="tabs"
            @get-data-success="setData"
        >
            <template slot="tab-head0">
                <el-table :data="dataList" height="400" class="newTable borderTable" border header-row-class-name="tableHead" :span-method="objectSpanMethod">
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
            <template slot="tab-head1">
                <el-table :data="dataList2" class="newTable borderTable" height="400" border header-row-class-name="tableHead" :span-method="objectSpanMethod2">
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
        </query-table>
    </div>
</template>

<script>
import { dateFormat } from '@/net/validate';
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'SteDay',
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
                    label: '杀菌一车间',
                    tableData: []
                },
                {
                    label: '杀菌二车间',
                    tableData: []
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
            listInterface: params => {
                return this.$http(`${REP_API.STERILIZATIONDAYS_LIAT_API}`, 'POST', params);
            },
            exportOption: {
                exportInterface: REP_API.STERILIZATIONDAYS_EXPORT_API,
                auth: 'report:fromEs:expectShajunDaily',
                text: '吹瓶日报表'
            },
            dataList: [],
            dataList2: [],
            daySizeList: ['1'],
            spanOneArr1: [],
            spanOneArr2: []
        };
    },
    methods: {
        setData(data) {
            this.dataList = data.list1;
            this.dataList2 = data.list2;
            for (let i = 1; i <= data.daySize; i++) {
                this.daySizeList.push(i.toString());
            }
            this.merge(this.dataList, 1);
            this.merge(this.dataList2, 2);
        },
        // 获取工厂
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
