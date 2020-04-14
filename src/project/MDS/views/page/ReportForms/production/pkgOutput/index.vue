<template>
    <div class="header_main">
        <query-table ref="queryTable" :query-form-data="queryFormData" :get-list-field="'packing'" :show-page="false" :list-interface="listInterface" :query-auth="'report:fromEs:materialSummary'" :show-table="false" :export-excel="true" :export-option="exportOption" @get-data-success="getDataSuccess">
            <template slot="card-main">
                <el-table :data="tableData" :span-method="spanMethod" class="newTable borderTable">
                    <template v-for="item in column">
                        <el-table-column v-if="!item.hide" :key="item.prop" :fixed="item.fixed" :prop="item.prop" :label="item.label" :width="item.width || ''" :formatter="item.formatter" :show-overflow-tooltip="true">
                            <template v-if="item.child">
                                <el-table-column v-for="chind in item.child" :key="chind.prop" :prop="chind.prop" :label="chind.label" :formatter="chind.formatter" :show-overflow-tooltip="chind.showOverFlowTooltip" :width="chind.width || ''" />
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
            </template>
        </query-table>
    </div>
</template>

<script>
    import { BASICDATA_API, REP_API } from '@/api/api';
    import { accAdd, dateFormat, accSub } from '@/net/validate';
    export default {
        name: 'Index',
        components: {},
        data() {
            // let self = this
            return {
                tableData: [],
                datas: [],
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
                        valueFormat: 'yyyy-MM',
                        defaultValue: dateFormat(new Date(), 'yyyy-MM')
                    }
                ],
                listInterface: params => {
                    return this.$http(`${REP_API.PKGOUTPUT_LIST_API}`, 'POST', params);
                },
                spanMethod: ({ rowIndex, columnIndex }) => {
                    if (rowIndex === 1) {
                        if (columnIndex === Number(accSub(this.datas.length, 2))) {
                            return {
                                rowspan: 2,
                                colspan: 2
                            };
                        }
                        if (Object.prototype.hasOwnProperty.call(this.tableData[1].spanMethodObj, columnIndex)) {
                            return {
                                rowspan: 1,
                                colspan: this.tableData[1].spanMethodObj[columnIndex]
                            };
                        }
                        return {
                            rowspan: 1,
                            colspan: 0
                        };
                    } else if (rowIndex === 2 && this.datas.length > 2) {
                        return {
                            rowspan: 1,
                            colspan: Number(accSub(this.datas.length, 2))
                        };
                    }
                },
                column: [],
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
                    this.datas = data.content;
                    const arr = [];
                    let keyIndex = 0;
                    for (const item of data.list) {
                        const arrTwo = [];
                        let spanMethodNum = 0;
                        let spanMethod = 0;
                        if (item.summary.length) {
                            for (const it of item.summary) {
                                arrTwo.push({
                                    label: it.largeClassName,
                                    prop: 'item' + keyIndex
                                });
                                keyIndex++;
                                spanMethodNum++;
                                spanMethod = accAdd(spanMethod, it.amount);
                            }
                        }
                        arr.push({
                            label: item.brand,
                            child: arrTwo,
                            spanMethodNum: spanMethodNum,
                            spanMethod: spanMethod
                        });
                    }
                    const obj = {};
                    const obj1 = {
                        spanMethodObj: {},
                        spanMethodArr: []
                    };
                    const obj2 = {
                        item0: data.total
                    };
                    let num = 0;
                    let sNum = 0;
                    arr.forEach((item) => {
                        obj1['item' + sNum] = item.spanMethod;
                        obj1.spanMethodObj[sNum] = item.spanMethodNum;
                        obj1.spanMethodArr.push(sNum);
                        sNum += item.spanMethodNum;
                    });
                    for (const items of data.content) {
                        obj['item' + num] = items;
                        num++;
                    }
                    this.column = arr;
                    if (arr.length > 1) {
                        this.tableData = [obj, obj1, obj2];
                    } else {
                        this.tableData = [obj, obj1];
                    }
                }
            }
        }
    };
</script>

<style scoped></style>
