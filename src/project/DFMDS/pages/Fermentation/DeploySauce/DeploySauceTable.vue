<template>
    <div>
        <mds-card :title="'调酱列表'" :name="'list1'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table1">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="状态" prop="openFlagName" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.openFlagName === '否'? '未开罐' : '已开罐' }}
                    </template>
                </el-table-column>
                <el-table-column label="车间" prop="workShopName" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="容器号" prop="holderName" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="领用说明" prop="description" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="订单类型" prop="orderType" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="发酵天数/天" prop="fermentDays" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="物料" prop="productMaterialName" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.productMaterialName + ' ' + scope.row.productMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="熟酱状态" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.matureFlagName === '否'? '未成熟' : '已成熟' }}
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.realAddAmount = scope.row.currentStock }}
                    </template>
                </el-table-column>
                <el-table-column label="库存数量（KG）" prop="currentStock" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="unit" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="入库日期" prop="inStorageDate" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="inStorageBatch" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="实验备注" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.experiment }}
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card v-if="formHeader.ferOpen.applyMaterialName === '黄豆酱熟酱' && formHeader.ferOpen.applyMaterialCode === 'SP03130002'" :title="'鲜香泡豆'" :name="'list2'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" :disabled="!isRedact" size="small" @click="addList2()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="table2" :row-class-name="rowDelFlag">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="容器号" prop="openFlagName" min-width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.fermentorId" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable @change="fermentorNoChange(scope.row)">
                            <el-option v-for="(item, index) in holderArr" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="添加物料" prop="addMaterialCode" min-width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable style="width: 100%;" @change="materialChange(scope.row)">
                            <el-option v-for="(item, index) in (holderArr.filter(it => it.holderId === scope.row.fermentorNo).length > 0 ? holderArr.filter(it => it.holderId === scope.row.fermentorNo)[0].ferInStorageList : [])" :key="index" :label="item.productMaterialName +' ' + item.productMaterialCode" :value="item.productMaterialCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.unit }}
                    </template>
                </el-table-column>
                <el-table-column label="库存数量" prop="stockAmount" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="batch" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="计划添加数量" prop="openFlagName" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.planAddAmount" :disabled="!isRedact" placeholder="手动输入" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手动输入" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realAddAmount" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button :disabled="!(isRedact)" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'调配物料'" :name="'list3'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table3" :row-class-name="rowDelFlag" :span-method="spanMethod">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="添加物料" prop="addMaterialCode" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.addMaterialCode + ' ' + scope.row.addMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column label="计划添加数量" prop="planAddAmount" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="unitName" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="开罐备注" prop="remark" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column width="70">
                    <template slot-scope="scope">
                        <el-button type="text" :disabled="!(isRedact)" @click="SplitDate(scope.row, scope.$index)">
                            <em class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="batch" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.batch" maxlength="10" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realAddAmount" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button :disabled="!(isRedact)" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'超期酱'" :name="'list4'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table4" :row-class-name="rowDelFlag">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="容器号" prop="fermentorName" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="添加物料" prop="addMaterialCode" min-width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.addMaterialName + " " + scope.row.addMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="unit" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="库存数量" prop="stockAmount" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="batch" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="计划添加数量" prop="planAddAmount" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="领用数量" prop="realAddAmount" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.realAddAmount" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.remark" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="70">
                    <template slot-scope="scope">
                        <el-button :disabled="!(isRedact)" class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="del(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { FER_API } from 'common/api/api';
    import { merge } from 'utils/utils';

    @Component
    export default class DeploySauceTable extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        table1: LisObj[] = []
        table2: LisObj[] = []
        table3: LisObj[] = []
        table4 = []
        formHeader = {}

        spanArr: number[] = []

        holderArr: PotObj[] = []

        init(formHeader) {
            this.formHeader = formHeader
            this.getSelect()
            this.getList(formHeader)
        }

        // 获取鲜香泡豆、调配物料、超期酱
        getList(formHeader) {
            this.table1 = formHeader.ferMixFermentorResponseDtoList
            this.table2 = formHeader.pickledMixMaterialList
            this.table3 = formHeader.receiveMixMaterialList
            this.table4 = formHeader.sauceMixMaterialList
            this.spanArr = merge(this.table3, 'addMaterialCode')
        }

        // 获取下拉
        getSelect() {
            FER_API.FER_OPEN_POT_DETAIL_HOLDER_LIST_API({}).then(({ data }) => {
                this.holderArr = data.data
            })
        }

        // 超期酱修改容器号
        fermentorNoChange(row) {
            const filterArr1: (any) = this.holderArr.filter(item => item.holderId === row.fermentorId)// eslint-disable-line
            row.fermentorNo = filterArr1[0].holderNo
            row.fermentorName = filterArr1[0].holderName
            row.addMaterialCode = ''
            row.unit = ''
            row.stockAmount = ''
            row.batch = ''
        }

        materialChange(row) {
            const filterArr1: (any) = this.holderArr.filter(item => item.holderId === row.fermentorId)// eslint-disable-line
            const filterArr: (any) = filterArr1[0].ferInStorageList.filter(item => item.productMaterialCode === row.addMaterialCode)// eslint-disable-line
            row.addMaterialName = filterArr[0].productMaterialName
            row.addMaterialType = filterArr[0].productMaterialType
            row.orderId = filterArr[0].orderId
            row.orderNo = filterArr[0].orderNo
            row.unit = filterArr[0].unit
            row.stockAmount = filterArr[0].currentStock
            row.batch = filterArr[0].inStorageBatch
        }

        saveData() {
            const materialRemoveIds = []
            this.delId(this.table2, materialRemoveIds)
            this.delId(this.table3, materialRemoveIds)
            this.delId(this.table4, materialRemoveIds)
            const ferMixFermentorSaveDtoList: PotObj[] = []
            const ferMixFermentorUpdateDtoList: PotObj[] = []
            this.table1.forEach(item => {
                if (item.id) {
                    ferMixFermentorUpdateDtoList.push({
                        id: item.id,
                        realAddAmount: item.realAddAmount,
                        remark: item.remark
                    })
                } else {
                    ferMixFermentorSaveDtoList.push({
                        cycle: item.cycle,
                        description: item.description,
                        experiment: item.experiment,
                        fermentDays: item.fermentDays,
                        fermentorId: item.fermentorId,
                        orderId: item.orderId,
                        originalId: item.originalId,
                        realAddAmount: item.realAddAmount,
                        remark: item.remark
                    })
                }
            })
            return {
                ferMixFermentorSaveDtoList,
                ferMixFermentorUpdateDtoList,
                materialRemoveIds: materialRemoveIds,
                pickledMixMaterialList: this.table2,
                receiveMixMaterialList: this.table3,
                sauceMixMaterialList: this.table4
            }
        }

        delId(data, ids) {
            for (let i = 0; i < data.length; i++) {
                if (data[i].delFlag === 1 && data[i].id) {
                    ids.push(data[i].id)
                }
                if (data[i].delFlag === 1 && !data[i].id) {
                    data.splice(i, 1)
                    i--
                }
            }
        }

        SplitDate(row, index) {
            this.table3.splice(index + this.table3.filter(item => item.addMaterialCode === row.addMaterialCode).length, 0, {
                id: row.id,
                openPotNo: row.openPotNo,
                addMaterialCode: row.addMaterialCode,
                addMaterialName: row.addMaterialName,
                planAddAmount: row.planAddAmount,
                unit: row.unit,
                unitName: row.unitName,
                remark: row.remark,
                batch: '',
                realAddAmount: '',
                toBeSplit: true
            })
            this.spanArr = merge(this.table3, 'addMaterialCode')
            console.log(this.spanArr);
        }

        addList2() {
            this.table2.push({
                id: '',
                fermentorNo: '',
                addMaterialCode: '',
                unit: '',
                stockAmount: '',
                batch: '',
                planAddAmount: '',
                remark: ''
            })
        }

        // 合并行
        spanMethod({ rowIndex, columnIndex }) {
            if (columnIndex <= 5) {
                return {
                    rowspan: this.spanArr[rowIndex],
                    colspan: this.spanArr[rowIndex] > 0 ? 1 : 0
                };
            }
        }

        del(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
                this.spanArr = merge(this.table3, 'addMaterialCode')
                console.log(this.spanArr);
            });
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            } else if (row.pushMark === 2) {
                return 'disabled-row'
            } else if (row.pushMark === 1 || row.pushMark === 0) {
                return 'warning-row'
            }
            return '';
        }

    }
    interface PotObj{
        id?: string;
        cycle?: string;
        description?: string;
        experiment?: string;
        fermentDays?: string;
        orderId?: string;
        originalId?: string;
        realAddAmount?: string;
        remark?: string;
        holderId?: string;
        openPotNo?: string;
        fermentorId?: string;
        mixSauceNo?: string;
        ferFermentor?: PotObj;
        materialRemoveIds?: string[];
    }
    interface LisObj {
        id?: string;
        cycle?: string;
        description?: string;
        experiment?: string;
        fermentDays?: string;
        orderId?: string;
        originalId?: string;
        holderId?: string;
        fermentorId?: string;
        toBeSplit?: boolean;
        openPotNo?: string;
        fermentorNo?: string;
        stockAmount?: string;
        addMaterialCode?: string;
        addMaterialName?: string;
        planAddAmount?: string;
        unit?: string;
        unitName?: string;
        remark?: string;
        batch?: string;
        realAddAmount?: string;
    }
</script>

<style scoped>

</style>
