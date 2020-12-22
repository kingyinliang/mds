<template>
    <div>
        <mds-card :title="'调酱列表'" :name="'list1'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table1">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="状态" prop="openFlagName" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="车间" prop="workShopName" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="容器号" prop="holderName" min-width="80" :show-overflow-tooltip="true" />
                <el-table-column label="领用说明" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferOpenFermentor.explain }}
                    </template>
                </el-table-column>
                <el-table-column label="订单类型" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferOrder.orderType }}
                    </template>
                </el-table-column>
                <el-table-column label="发酵天数/天" prop="fermentDays" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column label="物料" prop="productMaterialName" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferOrder.productMaterialName + ' ' + scope.row.ferOrder.productMaterialCode }}
                    </template>
                </el-table-column>
                <el-table-column label="熟酱状态" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferOrder.matureFlagName }}
                    </template>
                </el-table-column>
                <el-table-column label="领用数量" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferOrder.amount }}
                    </template>
                </el-table-column>
                <el-table-column label="库存数量（KG）" prop="receiveMaterial" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column label="单位" prop="receiveMaterial" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="入库日期" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferInStorageList > 0? scope.row.ferInStorageList[0].changed : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="批次" prop="materialUnit" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.ferInStorageList > 0? scope.row.ferInStorageList[0].inStorageBatch : '' }}
                    </template>
                </el-table-column>
                <el-table-column label="实验备注" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="receiveMaterial" min-width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.receiveMaterial" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card :title="'鲜香泡豆'" :name="'list2'">
            <el-table header-row-class-name="tableHead" class="newTable" :data="table2">
                <el-table-column type="index" label="序号" width="50" fixed align="center" />
                <el-table-column label="容器号" prop="openFlagName" min-width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.fermentorNo" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable @change="fermentorNoChange(scope.row)">
                            <el-option v-for="(item, index) in holderArr" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="添加物料" prop="addMaterialCode" min-width="150" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable>
                            <el-option v-for="(item, index) in scope.row.addMaterialArr" :key="index" :label="item.materialName+' ' + item.materialCode" :value="item.materialCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="openFlagName" min-width="50" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        {{ scope.row.unit }}}
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
                <el-table-column label="领用数量" prop="receiveMaterial" min-width="100" :show-overflow-tooltip="true" />
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
                        <el-input v-model="scope.row.batch" :disabled="!(isRedact)" size="small" placeholder="请输入" />
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
                <el-table-column label="容器号" prop="receiveMaterial" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.fermentorNo" placeholder="请选择" size="small" :disabled="!isRedact" @change="fermentorNoChange(scope.row)">
                            <el-option v-for="(item, index) in holderArr" :key="index" :label="item.holderName" :value="item.holderId" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="添加物料" prop="addMaterialCode" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.addMaterialCode" :disabled="!isRedact" placeholder="请选择" size="small" filterable clearable @change="materialChange(scope.row)">
                            <el-option v-for="(item, index) in scope.row.addMaterialArr" :key="index" :label="item.productMaterialName + ' ' + item.productMaterialCode" :value="item.productMaterialCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="unit" min-width="50" :show-overflow-tooltip="true" />
                <el-table-column label="库存数量" prop="stockAmount" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="批次" prop="batch" min-width="100" :show-overflow-tooltip="true" />
                <el-table-column label="计划添加数量" prop="planAddAmount" min-width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.planAddAmount" :disabled="!(isRedact)" size="small" placeholder="请输入" />
                    </template>
                </el-table-column>
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

        table1 = []
        table2 = []
        table3: LisObj[] = []
        table4 = []

        spanArr: number[] = []

        holderArr: PotObj[] = []

        init(formHeader) {
            this.getSelect()
            this.getSauce(formHeader)
            this.getList('PICKLED', formHeader)
            this.getList('RECEIVE', formHeader)
            this.getList('SAUCE', formHeader)
        }

        // 获取调酱列表
        getSauce(formHeader) {
            FER_API.FER_OPEN_POT_APPLY_DETAIL_TABLE_API({
                openPotNo: formHeader.openPotNo
            }).then(({ data }) => {
                this.table1 = data.data
            })
        }

        // 获取鲜香泡豆、调配物料、超期酱
        getList(str, formHeader) {
            FER_API.FER_DEPLOY_SAUCE_DETAIL_LIST_API({
                mixMaterialType: str,
                openPotNo: formHeader.openPotNo
            }).then(({ data }) => {
                if (str === 'PICKLED') {
                    this.table2 = data.data
                } else if (str === 'RECEIVE') {
                    this.table3 = data.data
                    this.spanArr = merge(this.table3, 'addMaterialCode')
                } else if (str === 'SAUCE') {
                    this.table4 = data.data
                }
            })
        }

        // 获取下拉
        getSelect() {
            FER_API.FER_OPEN_POT_DETAIL_LIST_API({
                judgeResult: 'CQ'
            }).then(({ data }) => {
                this.holderArr = data.data
            })
        }

        // 超期酱修改容器号
        fermentorNoChange(row) {
            const filterArr: (any) = this.holderArr.filter(item => item.holderId === row.fermentorNo)// eslint-disable-line
            row.addMaterialCode = ''
            row.addMaterialArr = filterArr[0].ferInStorageList
        }

        materialChange(row) {
            const filterArr: (any) = row.ferInStorageList.filter(item => item.productMaterialCode === row.addMaterialCode)// eslint-disable-line
            row.unit = filterArr[0].unit
            // row.stockAmount = filterArr[0]
            // row.batch = filterArr[0]
        }

        saveData() {
            const materialRemoveIds = []
            this.delId(this.table2, materialRemoveIds)
            this.delId(this.table3, materialRemoveIds)
            this.delId(this.table4, materialRemoveIds)
            return {
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
                id: '',
                openPotNo: row.openPotNo,
                addMaterialCode: row.addMaterialCode,
                addMaterialName: row.addMaterialName,
                planAddAmount: row.planAddAmount,
                unit: row.unit,
                unitName: row.unitName,
                remark: row.remark,
                batch: '',
                realAddAmount: ''
            })
            this.spanArr = merge(this.table3, 'addMaterialCode')
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
            });
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

    }
    interface PotObj{
        id?: string;
        holderId?: string;
        openPotNo?: string;
        fermentorId?: string;
        mixSauceNo?: string;
        ferFermentor?: PotObj;
        materialRemoveIds?: string[];
    }
    interface LisObj {
        id?: string;
        openPotNo?: string;
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
