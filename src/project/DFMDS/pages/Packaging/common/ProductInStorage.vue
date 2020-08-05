<template>
    <div>
        <mds-card :title="'生产入库'" :name="'productInStore'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!(isRedact && status !== 'C' && status !== 'D' && status !== 'P')" @click="addNewDataRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-form ref="ruleForm" :model="ruleForm">
                <el-table header-row-class-name="tableHead" class="newTable" :data="currentFormDataGroup" :row-class-name="rowDelFlag" border tooltip-effect="dark" size="small">
                    <el-table-column type="index" label="序号" width="50px" fixed />
                    <el-table-column label="生产日期" prop="productDate" width="210">
                        <template slot="header">
                            <span class="notNull">* </span>生产日期
                        </template>
                        <template slot-scope="scope">
                            <el-date-picker
                                v-model="scope.row.productDate"
                                type="date"
                                placeholder="选择日期"
                                size="small"
                                style="width: 180px;"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')"
                            />
                        </template>
                    </el-table-column>
                    <el-table-column label="班次" prop="classes" width="120">
                        <template slot="header">
                            <span class="notNull">* </span>班次
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                                    <el-option
                                        v-for="item in classesOptions"
                                        :key="item.dictCode"
                                        :label="item.dictValue"
                                        :value="item.dictCode"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产批次" prop="batch" width="160">
                        <template slot="header">
                            <span class="notNull">* </span>生产批次
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.batch'" :rules="dataRules.batch">
                                <el-input v-model.trim="scope.row.batch" maxlength="10" placeholder="输入批次" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="生产入库" prop="inStorageCount" width="140">
                        <template slot="header">
                            <span class="notNull">* </span>生产入库
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.inStorageCount'" :rules="dataRules.inStorageCount">
                                <el-input v-model.number="scope.row.inStorageCount" size="small" placeholder="输入数量" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" clearable oninput="value=value.replace(/\D*/g,'')" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="inStorageUnit" width="100">
                        <template slot="header">
                            <span class="notNull">* </span>单位
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.inStorageUnit'" :rules="dataRules.inStorageUnit">
                                <el-select v-model="scope.row.inStorageUnit" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                                    <el-option
                                        v-for="item in unitOptions"
                                        :key="item.key"
                                        :label="item.value"
                                        :value="item.key"
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="入库不良" prop="inStorageBadCount" width="140">
                        <template slot-scope="scope">
                            <el-input v-model.number="scope.row.inStorageBadCount" size="small" placeholder="输入数量" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="inStorageBadUnit" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.inStorageBadUnit" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                                <el-option
                                    v-for="item in unitOptions"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="线上不良" prop="onlineBadCount" width="140">
                        <template slot-scope="scope">
                            <el-input v-model.number="scope.row.onlineBadCount" size="small" placeholder="输入数量" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="onlineBadUnit" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.onlineBadUnit" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                                <el-option
                                    v-for="item in unitOptions"
                                    :key="item.key"
                                    :label="item.value"
                                    :value="item.key"
                                />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="样品" prop="sampleCount" width="140">
                        <template slot-scope="scope">
                            <el-input v-model.number="scope.row.sampleCount" size="small" placeholder="输入数量" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="sampleUnit" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.sampleUnit" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
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
                            {{ amountProductNum(scope.row,scope.$index) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" prop="outputUnit" width="100">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.outputUnit" placeholder="请选择" size="small" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
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
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
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
                            <el-button v-if="!scope.row.original" class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
        </mds-card>
        <el-row class="solerow">
            <div>
                产出数合计：
            </div>
            <div class="input_bottom">
                {{ computedTotal }} {{ basicUnitName }}
            </div>
        </el-row>
        <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { PKG_API, AUDIT_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber, dataEntryData } from 'utils/utils';
    import _ from 'lodash';

    @Component({
        name: 'ProductInStore',
        components: {
        }
    })
    export default class ProductInStore extends Vue {

        $refs: {
            ruleForm: HTMLFormElement;
        }

        @Prop({ type: Boolean, default: false }) isRedact;
        @Prop({ type: Array, default: [] }) classesOptions;
        @Prop({ type: String, default: '' }) status;

        currentAudit = [];

        // 常有变数
        currentFormDataGroup: CurrentDataTable[] = [] // 主 data
        orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制

        unitOptions: UnitOptions[]=[]
        basicUnitName=''
        ratio=1
        readAudit= []
        ruleForm={
        }

        dataRules= {
            classes: [
                { required: true, message: '请输入', trigger: 'change' }
            ],
            batch: [
                { required: true, message: '请输入', trigger: 'blur' }
            ],
            inStorageCount: [
                { required: true, message: '请输入数量', trigger: 'blur' }
            ],
            inStorageUnit: [
                { required: true, message: '请输入', trigger: 'change' }
            ]
        }

        async init(formHeader) {
            PKG_API.PKG_INSTORAGE_QUERY_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: formHeader.orderNo,
                materialCode: formHeader.materialCode
            }).then(({ data }) => {
                if (data.data.length !== 0) {
                    this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data.inStorages))
                    this.orgFormDataGroup = JSON.parse(JSON.stringify(data.data.inStorages))
                    this.setValidate(this.currentFormDataGroup, this.ruleForm)
                }
                this.basicUnitName = data.data.basicUnitName
                this.ratio = data.data.ratio
                if (this.unitOptions.length === 0) {
                    this.unitOptions.push({ key: data.data.basicUnit, value: data.data.basicUnitName })
                    this.unitOptions.push({ key: data.data.productUnit, value: data.data.productUnitName })
                }


            });
            this.currentAudit = await this.getAudit(formHeader, 'INSTORAGE');
        }

        async getAudit(formHeader, verifyType) {
            const result = await AUDIT_API.AUDIT_LOG_LIST_API({
                orderNo: formHeader.orderNo,
                verifyType: verifyType
            })
            return result.data.data
        }

        // 提交时跑校验
        ruleSubmit() {
            if (this.currentFormDataGroup.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请录入生产入库');
                return false
            }
            for (const item of this.currentFormDataGroup.filter(it => it.delFlag !== 1)) {
                if (!item.productDate || !item.classes || !item.batch || !item.inStorageCount || !item.inStorageUnit) {
                    this.$warningToast('请填写生产入库必填项');
                    return false
                }
            }
            return true
        }

        // 加工校验 ruleForm
        setValidate(currentFormDataGroup, ruleForm) {
            currentFormDataGroup.forEach((item, index) => {
                this.$set(ruleForm, 'r' + index, item)
            })
        }

        savedData(formHeader) {
            const instorageDelete = [];
            const instorageInsert = [];
            const instorageUpdate = [];

            dataEntryData(formHeader, this.currentFormDataGroup, this.orgFormDataGroup, instorageDelete, instorageInsert, instorageUpdate);

            return {
                countOutput: this.computedTotal,
                counOutputUnit: this.unitOptions[0].key,
                instorageDelete,
                instorageInsert,
                instorageUpdate
            }
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        // 删除行
        removeDataRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
                this.setValidate(this.currentFormDataGroup, this.ruleForm)
            });
        }

        // 新增行
        addNewDataRow() {
            const sole: CurrentDataTable = {
                    delFlag: 0,
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
                    sampleStatus: '',
                    output: 0,
                    outputUnit: this.unitOptions[0].key,
                    emergencyFlag: 'N',
                    remark: '',
                    checkStatus: '',
                    changer: getUserNameNumber(),
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
                    // created: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
            this.currentFormDataGroup.push(sole)

            this.setValidate(this.currentFormDataGroup, this.ruleForm)
        }


        amountProductNum(row, index): number {
            const inStorageUnitRatio: number = row.inStorageUnit === this.unitOptions[0].key ? 1 : this.ratio
            const inStorageBadUnitRatio: number = row.inStorageBadUnit === this.unitOptions[0].key ? 1 : this.ratio
            const sampleUnitRatio: number = row.sampleUnit === this.unitOptions[0].key ? 1 : this.ratio
            const outputUnitRatio: number = row.outputUnit === this.unitOptions[0].key ? 1 : this.ratio
            const num = Number(_.add(_.add((row.inStorageCount * inStorageUnitRatio), (row.inStorageBadCount * inStorageBadUnitRatio)), (row.sampleCount * sampleUnitRatio)))

            this.currentFormDataGroup[index].output = num

            let finalNum = 0
            if (num % outputUnitRatio === 0) {
                finalNum = _.divide(num / outputUnitRatio)
            } else {
                finalNum = _.divide(num / outputUnitRatio).toFixed(2)
            }

            return finalNum
        }

        uniquenessClasses() {
            const classesMap: string[] = [];
            this.currentFormDataGroup.map((item: CurrentDataTable) => {
                if (item.classes && item.delFlag !== 1) {
                    classesMap.push(item.classes);
                }
            })
            return [...new Set(classesMap)];
        }

        get computedTotal(): number {
            let total = 0;
            // if (this.currentFormDataGroup.length !== 0) {
            //     total = this.currentFormDataGroup.map(item => item.output).reduce((prev, next) => {
            //         return prev + next;
            //     })
            // }
            // return total


            this.currentFormDataGroup.map((item) => {
                if (item.delFlag !== 1) {
                    total = _.add(total, Number(item.output));
                }
            });
            return total;
        }

    }

interface CurrentDataTable{
    delFlag?: number;
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
    sampleStatus?: string;
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
    id?: string;
    editedMark?: boolean;
    // created?: boolean;
}
interface UnitOptions{
    key?: string;
    value?: string;
}
</script>

<style lang="scss" scoped>
.solerow {
    margin: 5px 0;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
