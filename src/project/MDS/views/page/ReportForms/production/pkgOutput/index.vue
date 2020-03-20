<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            :queryFormData="queryFormData"
            :getListField="'packing'"
            :showPage="false"
            :listInterface="listInterface"
            :queryAuth="'report:fromEs:materialSummary'"
            :spanMethod="spanMethod"
            :column="column"
            :exportExcel="true"
            :exportOption="exportOption"
            @get-data-success="getDataSuccess"
        />
        <el-table :data="tableData">
            <template v-for="item in column">
                <el-table-column v-if="!item.hide" :key="item.prop" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :showOverflowTooltip="true">
                    <template v-for="chind in item.child">
                        <el-table-column v-if="item.child" :key="chind.prop" :prop="chind.prop" :label="chind.label" :formatter="chind.formatter" :showOverflowTooltip="chind.showOverFlowTooltip" :width="chind.width || ''" />
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </div>
</template>

<script>
import { BASICDATA_API, REP_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
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
                    label: '月份',
                    prop: 'productDate',
                    dataType: 'month',
                    valueFormat: 'yyyy-MM'
                }
            ],
            listInterface: params => {
                return this.$http(`${REP_API.PKGOUTPUT_LIST_API}`, 'POST', params);
            },
            spanMethod: ({ row, columnIndex }) => {
                if (Number(row.brand) === 1000) {
                    row.brand = '1L';
                }
                if (row.brand === '总计') {
                    if (columnIndex === 0) {
                        return [1, 3];
                    } else if (columnIndex === 1) {
                        return [0, 0];
                    } else if (columnIndex === 2) {
                        return [0, 0];
                    }
                }
                if (columnIndex === 0 || columnIndex === 4 || columnIndex === 6) {
                    return {
                        rowspan: row.mergeNums,
                        colspan: 1
                    };
                }
                    return {
                        rowspan: 1,
                        colspan: 1
                    };

            },
            exportOption: {
                exportInterface: REP_API.PKGOUTPUT_EXPORT_API,
                auth: 'report:fromEs:expectMaterialSummary',
                text: '包装品项产量汇总导出'
            }
        };
    },
    computed: {},
    methods: {
        getDataSuccess(data) {
            if (data.list.length) {
                const arr = [];
                let keyIndex = 0;
                for (const item of data.list) {
                    const arrTwo = [];
                    if (item.summary.length) {
                        for (const it of item.summary) {
                            arrTwo.push({
                                label: it.largeClassName,
                                prop: 'item' + keyIndex
                            });
                            keyIndex++;
                        }
                    }
                    arr.push({
                        label: item.brand,
                        child: arrTwo
                    });
                }
                console.log(arr);
                const obj = {};
                let num = 0;
                for (const items of data.content) {
                    obj['item' + num] = items;
                    num++;
                }
                console.log(obj);
                this.column = arr;
                this.$refs.queryTable.tableData = [
                    {
                        item0: 395062,
                        item1: 5551722.86,
                        item2: 469521.2,
                        item3: 1656567.8,
                        item4: 5620.5,
                        item5: 344197.5,
                        item6: 14595,
                        item7: 21957
                    }
                ];
            }
        }
    }
};
</script>

<style scoped></style>
