<template>
    <div>
        <mds-card :title="'包材领用'" :name="'materialP'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="materialP" :span-method="spanMethod" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" />
                <el-table-column label="领用物料" prop="material" width="150" />
                <el-table-column label="单位" prop="amount" width="80" />
                <el-table-column label="需求用量" prop="amount" width="80" />
                <el-table-column label="结算库存" prop="amount" width="80" />
                <el-table-column label="初始库存" prop="amount" width="80" />
                <el-table-column label="订单物料" prop="amount" width="80" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" @click="SplitDate(scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="实际用量" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="实际损耗" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="不合格数" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="不良批次" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="厂家" prop="productDate" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="productDate">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.holderName" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.original" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delMaterial(scope.row)">
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

        materialP = [];

        materialS = [];

        spanOneArr = [];

        mounted() {
            this.processData(this.ma);
            this.merge(this.materialP)
        }

        // 处理数据
        processData(data) {
            const finalData = []
            data.forEach(item => {
                item.list.forEach((listitem, index) => {
                    const materialMap = {
                        id: item.id,
                        material: item.material,
                        amount: item.amount
                    }
                    if (index === 0) {
                        materialMap.original = true
                    }
                    Object.assign(materialMap, listitem)
                    finalData.push(materialMap)
                })
            })
            this.materialP = finalData
        }

        // 设置合并行
        merge(tableData) {
            const spanOneArr = [];
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
            this.materialP.splice(index + this.materialP.filter(item => item.id === row.id).length, 0, {
                id: row.id,
                material: row.material,
                amount: row.amount,
                batch: ''
            });
            this.merge(this.materialP)
        }
    }
</script>

<style scoped>

</style>
