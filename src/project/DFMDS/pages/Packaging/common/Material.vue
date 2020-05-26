<template>
    <div>
        <mds-card :title="'包材领用'" :name="'materialP'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="currentDataTable" :span-method="spanMethod" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode + scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="materialUnit" width="50" :show-overflow-tooltip="true" />
                <el-table-column label="需求用量" prop="needNum" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="结算库存" prop="endStocks" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="初始库存" prop="startStocks" width="80" :show-overflow-tooltip="true" />
                <el-table-column label="订单领料" prop="receiveMaterial" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" @click="SplitDate('currentDataTable', scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="实际用量" prop="realUseAmount" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>实际用量
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realUseAmount" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="batch" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="实际损耗" prop="realLoss" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realLoss" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="不合格数" prop="unqualified" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.unqualified" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="不良批次" prop="badBatch" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.badBatch" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="厂家" prop="manufactor" width="120">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.manufactor" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.splitFlag === 'N'" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'半成品领用'" :name="'materialS'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="materialS" :span-method="spanTwoMethod" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.materialCode + scope.row.materialName }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="materialUnit" width="50" :show-overflow-tooltip="true" />
                <el-table-column label="需求用量" prop="needNum" width="80" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" @click="SplitDate('materialS', scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="入库号" prop="sterilizeStorageNo" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="锅号" prop="sterilizePotNo" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="物料" prop="materialCode" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="batch" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="实际用量" prop="realUsed" width="150" :show-overflow-tooltip="true" />
                <el-table-column label="开始使用时间" prop="batch" width="150">
                    <!-- <template slot-scope="scope">
                        <el-input v-model="scope.row.startDate" size="small" />
                    </template> -->
                    <template slot-scope="scope">
                        <el-time-select
                            v-model="scope.row.startDate"
                            placeholder="开始使用时间"
                            :picker-options="{
                                start: '00:00',
                                end: '24:00'
                            }"
                        />
                    </template>
                </el-table-column>

                <el-table-column label="用完时间" prop="batch" width="150">
                    <!-- <template slot-scope="scope">
                        <el-input v-model="scope.row.endDate" size="small" />
                    </template> -->
                    <template slot-scope="scope">
                        <el-time-select
                            v-model="scope.row.endDate"
                            placeholder="用完时间"
                            :picker-options="{
                                start: '00:00',
                                end: '24:00',
                                minTime: materialS[scope.$index].startDate
                            }"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="140">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.splitFlag === 'N'" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="MaterialAudit" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    @Component({
        name: 'Material',
        components: {
        }
    })
    export default class Material extends Vue {
        ma = [{
            id: '0',
            material: 'asdad',
            amount: '1',
            list: [
                {
                    batch: '11'
                },
                {
                    batch: '22'
                }
            ]
        }, {
            id: '1',
            material: 'bbbb',
            amount: '2',
            list: [
                {
                    batch: '11'
                },
                {
                    batch: '22'
                }
            ]
        }];

        MaterialAudit = [];

        currentDataTable: MaterialMap[] = [];

        materialS = [];

        spanOneArr: number[] = [];
        spanTwoArr: number[] = [];

        init(dataGroup) {
            PKG_API.PKG_MATERIAL_P_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: dataGroup.orderNo,
                orderStatus: dataGroup.orderStatus,
                productLine: dataGroup.productLine
            }).then(({ data }) => {
                console.log('包材领用')
                console.log(data)
                this.processData(data.data, 'currentDataTable');
                this.merge(this.currentDataTable, 'currentDataTable');

                console.log('包材领用处理后')
                console.log(this.currentDataTable)
            });
            PKG_API.PKG_MATERIAL_S_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: dataGroup.orderNo,
                orderStatus: dataGroup.orderStatus,
                productLine: dataGroup.productLine
            }).then(({ data }) => {
                console.log('半成品领用')
                console.log(data)
                this.processData(data.data, 'materialS');
                this.merge(this.materialS, 'materialS');
            })
        }

        // 处理数据
        processData(data, dataGroup) {
            const finalData: MaterialMap[] = []
            data.forEach(item => {
                item.item.forEach((listitem) => {
                    const materialMap: MaterialMap = {
                        id: item.id,
                        materialCode: item.materialCode,
                        materialName: item.materialName,
                        materialStatus: item.materialStatus,
                        materialUnit: item.materialUnit,
                        needNum: item.needNum,
                        startStocks: item.startStocks,
                        endStocks: item.endStocks,
                        receiveMaterial: item.receiveMaterial,
                        changer: getUserNameNumber(),
                        changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                    };
                    Object.assign(materialMap, listitem);
                    finalData.push(materialMap)
                })
            });
            this[dataGroup] = finalData
        }

        // 设置合并行
        merge(tableData, Data) {
            const spanOneArr: number[] = [];
            let concatOne = 0;
            tableData.forEach((item, index) => {
                if (index === 0) {
                    spanOneArr.push(1);
                } else if (item.id === tableData[index - 1].id) {
                    spanOneArr[concatOne] += 1;
                    spanOneArr.push(0);
                } else {
                    spanOneArr.push(1);
                    concatOne = index;
                }
            });
            if (Data === 'currentDataTable') {
                this.spanOneArr = spanOneArr
            }
            if (Data === 'materialS') {
                this.spanTwoArr = spanOneArr
            }
        }

        // 合并行
        spanMethod({ rowIndex, columnIndex }) {
            // if (columnIndex <= 7) {
            //     return {
            //         rowspan: this.spanOneArr[rowIndex],
            //         colspan: this.spanOneArr[rowIndex] > 0 ? 1 : 0
            //     };
            // }
        }

        spanTwoMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 4) {
                return {
                    rowspan: this.spanTwoArr[rowIndex],
                    colspan: this.spanTwoArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        // 拆分
        SplitDate(str, row, index) {
            this[str].splice(index + this[str].filter(item => item.id === row.id).length, 0, {
                id: row.id,
                materialCode: row.materialCode,
                materialName: row.materialName,
                materialStatus: row.materialStatus,
                materialUnit: row.materialUnit,
                needNum: row.needNum,
                startStocks: row.startStocks,
                endStocks: row.endStocks,
                receiveMaterial: row.receiveMaterial,
                splitFlag: 'N'
            });
            this.merge(this[str], str)
        }

        // 删除
        delMaterial(index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.currentDataTable.splice(index, 1);
            });
        }
    }
interface MaterialMap{
    id?: string;
    original?: boolean;
    materialCode?: string;
    materialName?: string;
    materialStatus?: string;
    materialUnit?: string;
    needNum?: number;
    startStocks?: number;
    endStocks?: number;
    receiveMaterial?: string;
    splitFlag?: string;
    changer?: string;
    changed?: string;
}
</script>

<style scoped>
</style>
