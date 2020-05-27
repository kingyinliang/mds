<template>
    <div>
        <mds-card :title="'生产入库'" :name="'productInStore'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewDataRow()">
                        新增
                    </el-button>
                </div>
            </template>

            <el-table header-row-class-name="tableHead" class="newTable" :data="currentFormDataGroup" border tooltip-effect="dark" size="small">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="生产日期" prop="productDate" width="180">
                    <template slot="header">
                        <span class="notNull">* </span>生产日期
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.productDate"
                            type="date"
                            placeholder="选择日期"
                            size="small"
                            style="width: 140px;"
                            :disabled="!isRedact"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="班次" prop="classes" width="120">
                    <template slot="header">
                        <span class="notNull">* </span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option
                                v-for="item in classesOptions"
                                :key="item"
                                :label="item"
                                :value="item"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="生产批次" prop="batch" width="160">
                    <template slot="header">
                        <span class="notNull">* </span>生产批次
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.batch" maxlength="10" placeholder="请输入" size="small" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="生产入库" prop="inStorageCount" width="100">
                    <template slot="header">
                        <span class="notNull">* </span>生产入库
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.inStorageCount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="inStorageUnit" width="100">
                    <template slot="header">
                        <span class="notNull">* </span>单位
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.inStorageUnit" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option
                                v-for="item in unitOptions"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="入库不良" prop="inStorageBadCount" width="100">
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.inStorageBadCount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="inStorageBadUnit" width="100">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.inStorageBadUnit" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option
                                v-for="item in unitOptions"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="线上不良" prop="onlineBadCount" width="100">
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.onlineBadCount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="onlineBadUnit" width="100">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.onlineBadUnit" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option
                                v-for="item in unitOptions"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="样品" prop="sampleCount" width="100">
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.sampleCount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="sampleUnit" width="100">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.sampleUnit" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option
                                v-for="item in unitOptions"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="产出数" prop="output" width="100">
                    <template slot-scope="scope">
                        {{ formatter(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column label="单位" prop="outputUnit" width="100">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.outputUnit" placeholder="请选择" size="small" :disabled="!isRedact">
                            <el-option
                                v-for="item in unitOptions"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="备注" prop="remark" width="100">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" prop="changer" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" prop="changed" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="!scope.row.original" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <el-row class="solerow">
            <div>
                产出数合计：
            </div>
            <div class="input_bottom">
                {{ computedTotal }}
            </div>
        </el-row>
        <audit-log :table-data="readAudit" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import { PKG_API } from 'common/api/api';

    @Component({
        name: 'ProductInStore',
        components: {
        }
    })
    export default class ProductInStore extends Vue {

        @Prop({ type: Boolean, default: false }) isRedact
        currentFormDataGroup: CurrentDataTable[] = [];
        readAudit= [];
        instorageDelete= []; // 入库删除集合
        instorageInsert= []; // 入库新增集合
        instorageUpdate=[]; // 入库修改集合
        productInStoreData: [];
        classesOptions=['白班', '中班', '夜班'];
        unitOptions: UnitOptions[]=[]
        basicUnitName=''
        ratio=1

        init(dataGroup) {
            console.log('ProductInStore带进来的 data')
            console.log(dataGroup)
            this.currentFormDataGroup = JSON.parse(JSON.stringify(dataGroup.inStorages))
            this.basicUnitName = dataGroup.basicUnitName
            this.ratio = dataGroup.ratio
            this.unitOptions.push({ key: dataGroup.basicUnit, value: dataGroup.basicUnitName })
            this.unitOptions.push({ key: dataGroup.productUnit, value: dataGroup.productUnitName })
            console.log('this.unitOptions')
            console.log(this.unitOptions)
        }

        returnDataGroup() {
            return JSON.parse(JSON.stringify(this.currentFormDataGroup))
        }

        removeDataRow(index) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.currentFormDataGroup.splice(index, 1);
            });
        }

        addNewDataRow() {
            const sole: CurrentDataTable = {
                    productDate: dateFormat(new Date(), 'yyyy-MM-dd'),
                    classes: '',
                    batch: '',
                    inStorageCount: 0,
                    inStorageUnit: this.unitOptions[1].key,
                    inStorageBadCount: 0,
                    inStorageBadUnit: this.unitOptions[0].key,
                    onlineBadCount: 0,
                    onlineBadUnit: this.unitOptions[0].key,
                    sampleCount: 0,
                    sampleUnit: this.unitOptions[0].key,
                    output: 0,
                    outputUnit: this.unitOptions[0].key,
                    emergencyFlag: 'N',
                    remark: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            this.currentFormDataGroup.push(sole)
        }


        formatter(row, index): number {
            const inStorageUnitRatio: number = row.inStorageUnit === this.unitOptions[0].key ? 1 : this.ratio
            const inStorageBadUnitRatio: number = row.inStorageBadUnit === this.unitOptions[0].key ? 1 : this.ratio
            const sampleUnitRatio: number = row.sampleUnit === this.unitOptions[0].key ? 1 : this.ratio
            const outputUnitRatio: number = row.outputUnit === this.unitOptions[0].key ? 1 : this.ratio
            const num = Number((((row.inStorageCount * inStorageUnitRatio) + (row.inStorageBadCount * inStorageBadUnitRatio) + (row.sampleCount * sampleUnitRatio)) / outputUnitRatio))
            this.currentFormDataGroup[index].output = num
            return num

        }

        get computedTotal(): number {
            let total = 0;
            if (this.currentFormDataGroup.length !== 0) {
                total = this.currentFormDataGroup.map(item => item.output).reduce((prev, next) => {
                        console.log(prev)
                        console.log(next)
                        return prev + next;
                    })
            }
            return total
        }

    }
interface CurrentDataTable{
    productDate?: string;
    classes?: string; // 班次
    batch?: string; // 生产批次
    inStorageCount?: number;
    inStorageUnit?: string;
    inStorageBadCount?: number;
    inStorageBadUnit?: string;
    onlineBadCount?: number;
    onlineBadUnit?: string;
    sampleCount?: number;
    sampleUnit?: string;
    output: number;
    outputUnit?: string;
    remark?: string;
    changer?: string;
    changed?: string; // 操作日期
    checkStatus?: string; // x 审核状态
    emergencyFlag?: string; // x 紧急提交标记(是：Y，否：N)
    factory?: string;
    orderId?: string;
    orderNo?: string;
}
interface UnitOptions{
    key?: string;
    value?: string;
}
</script>

<style lang="scss" scoped>
.solerow {
    margin-top: 5px;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
