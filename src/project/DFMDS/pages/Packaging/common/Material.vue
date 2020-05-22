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
                <el-table-column label="订单物料" prop="receiveMaterial" width="80" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" @click="SplitDate(scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="实际用量" prop="realUseAmount" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realUseAmount" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="batch" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="实际损耗" prop="realLoss" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realLoss" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="不合格数" prop="unqualified" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.unqualified" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="不良批次" prop="badBatch" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.badBatch" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="厂家" prop="manufactor" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.manufactor" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" size="small" />
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
        <mds-card :title="'半成品领用'" :name="'materialS'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="materialS" border tooltip-effect="dark" />
        </mds-card>
        <audit-log :table-data="MaterialAudit" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';

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

        init(formHeader) {
            PKG_API.PKG_MATERIAL_P_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo,
                orderStatus: formHeader.orderStatus,
                productLine: formHeader.productLine
            }).then(({ data }) => {
                this.processData(data.data);
                this.merge(this.currentDataTable)
            })
        }

        // 处理数据
        processData(data) {
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
                        receiveMaterial: item.receiveMaterial
                    };
                    Object.assign(materialMap, listitem);
                    finalData.push(materialMap)
                })
            });
            this.currentDataTable = finalData
        }

        // 设置合并行
        merge(tableData) {
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
            this.spanOneArr = spanOneArr
        }

        // 合并行
        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 7) {
                return {
                    rowspan: this.spanOneArr[rowIndex],
                    colspan: this.spanOneArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        // 拆分
        SplitDate(row, index) {
            this.currentDataTable.splice(index + this.currentDataTable.filter(item => item.id === row.id).length, 0, {
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
            this.merge(this.currentDataTable)
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
}
</script>

<style scoped>
</style>
