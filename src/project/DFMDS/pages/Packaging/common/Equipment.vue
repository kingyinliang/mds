<template>
    <div>
        <mds-card title="运行情况" :name="'equipment'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addNewFirstDataRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="firstFormDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="55" fixed="left" />
                <el-table-column min-width="130" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small" clearable style="width: 100;">
                            <el-option
                                v-for="item in classesOptions"
                                :key="item.dictCode"
                                :label="item.dictValue"
                                :value="item.dictCode"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" min-width="200">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" min-width="200">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 170px;" />
                    </template>
                </el-table-column>
                <el-table-column label="运行时长(H)" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <!-- <el-input v-model.trim="scope.row.duration" size="small" /> -->
                        {{ operationHour(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeFirstDataRow(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    总运行时间：
                </div>
                <div class="input_bottom">
                    {{ computedFirstDataTotal }} H
                </div>
            </el-row>
        </mds-card>
        <mds-card title="停机情况" :name="'equipmentStop'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addSecondDataRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="secondFormDataGroup" :row-class-name="rowStopDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="55" fixed="left" />
                <el-table-column min-width="130" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small" clearable style="width: 100px;">
                            <el-option
                                v-for="item in classesOptions"
                                :key="item.dictCode"
                                :label="item.dictValue"
                                :value="item.dictCode"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机类型
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopType" size="small" clearable>
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机方式
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopMode" size="small" clearable>
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="200" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.startDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 170px;" clearable />
                    </template>
                </el-table-column>
                <el-table-column min-width="200" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.endDate" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 170px;" clearable />
                    </template>
                </el-table-column>
                <el-table-column label="时长(MIN)" width="120" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <!-- <el-input v-model.number="scope.row.duration" size="small" clearable /> -->
                        {{ stopMin(scope.row,scope.$index) }}
                    </template>
                </el-table-column>
                <el-table-column width="80" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>次数
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.number="scope.row.exceptionCount" size="small" placeholder="输入次数" clearable oninput="value=value.replace(/\D*/g,'')" />
                    </template>
                </el-table-column>
                <el-table-column width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机情况
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopSituation" size="small" clearable>
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机原因
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopReason" size="small" clearable>
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="描述" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.exceptionInfo" size="small" placeholder="请输入" clearable />
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" clearable />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" min-width="180" :show-overflow-tooltip="true" />
                <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeSecondDataRow(scope.$index)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    总停线时间：
                </div>
                <div class="input_bottom">
                    {{ computedSecondDataTotal }} MIN
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="readAudit" />
    </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { PKG_API } from 'common/api/api';
import { dateFormat, getUserNameNumber } from 'utils/utils';

@Component({
    name: 'Equipment',
    components: {
        // AuditLog: resolve => {
        //     require(['@/views/components/AuditLog'], resolve);
        // }
    }
})

export default class Equipment extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact
    @Prop({ type: Array, default: [] }) classesOptions

    // 常有变数
    firstFormDataGroup: FirstDataTable[] = []; // 主 data
    secondFormDataGroup: SecondDataTable[] = []; // 次 data
    orgFirstFormDataGroup: FirstDataTable[] = []; // 主 data 复制
    orgSecondFormDataGroup: SecondDataTable[] = []; // 次 data 复制

    waitedFirstDataDelete: string[]= [] // 入库删除集合
    waitedFirstDataInsert: FirstDataTable[] = [] // 入库新增集合
    waitedFirstDataUpdate: FirstDataTable[] =[] // 入库修改集合
    waitedSecondDataDelete: string[]= [] // 入库删除集合
    waitedSecondDataInsert: FirstDataTable[] = [] // 入库新增集合
    waitedSecondDataUpdate: FirstDataTable[] =[] // 入库修改集合
    tabFirstChangedState=[0, 0, 0] // 增,删,改
    tabSecondChangedState=[0, 0, 0] // 增,删,改

    readAudit = []

    formDataGroupArray: string[]=['firstFormDataGroup', 'secondFormDataGroup']


    init(dataGroup, order) {
        console.log('equipment带进来的 data')
        console.log(dataGroup)

        if (order === 'first') {
            if (dataGroup !== null) {
                this.firstFormDataGroup = JSON.parse(JSON.stringify(dataGroup))
                this.firstFormDataGroup.forEach((item) => {
                    item.editedMark = false
                })
                this.orgFirstFormDataGroup = JSON.parse(JSON.stringify(this.firstFormDataGroup))
            } else {
                //
            }
        } else if (dataGroup !== null) {
                this.secondFormDataGroup = JSON.parse(JSON.stringify(dataGroup))
                this.secondFormDataGroup.forEach((item) => {
                    item.editedMark = false
                })
                this.orgSecondFormDataGroup = JSON.parse(JSON.stringify(this.secondFormDataGroup))
            } else {
                //
            }
    }

    returnFirstDataGroup() {
        this.waitedFirstDataInsert = [];
        this.waitedFirstDataUpdate = [];
        this.firstFormDataGroup.forEach(item => {
            if (item.id) {
                if (item.editedMark === true) {
                    delete item.editedMark
                    this.waitedFirstDataUpdate.push(item)
                }
            } else {
                this.waitedFirstDataInsert.push(item)
            }
        })

        return {
            deleteData: this.waitedFirstDataDelete,
            insertData: this.waitedFirstDataInsert,
            updateData: this.waitedFirstDataUpdate
        }
    }

    returnSecondDataGroup() {
        this.waitedSecondDataInsert = [];
        this.waitedSecondDataUpdate = [];
        this.secondFormDataGroup.forEach(item => {
            if (item.id) {
                if (item.editedMark === true) {
                    delete item.editedMark
                    this.waitedSecondDataUpdate.push(item)
                }
            } else {
                this.waitedSecondDataInsert.push(item)
            }
        })

        return {
            deleteData: this.waitedSecondDataDelete,
            insertData: this.waitedSecondDataInsert,
            updateData: this.waitedSecondDataUpdate
        }
    }

    operationHour(row, index): number {
        let num = 0
        if (row.endDate !== '' && row.startDate !== '') {
            num = (new Date(row.endDate).getTime() - new Date(row.startDate).getTime()) / 3600000
        }
        this.firstFormDataGroup[index].duration = num

        return num
    }

    stopMin(row, index): number {
        let num = 0
        if (row.endDate !== '' && row.startDate !== '') {
        num = (new Date(row.endDate).getTime() - new Date(row.startDate).getTime()) / 3600000
        }
        this.secondFormDataGroup[index].duration = num

        return num
    }

    addNewFirstDataRow() {
        const sole: FirstDataTable = {
            classes: '',
            startDate: '',
            endDate: '',
            duration: 0,
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber(),
            delFlag: 0
        }
        this.tabFirstChangedState[0] += 1
        this.firstFormDataGroup.push(sole);
    }

    addSecondDataRow() {
        const sole: SecondDataTable = {
            classes: '',
            stopType: '',
            stopMode: '',
            startDate: '',
            endDate: '',
            duration: 0,
            delFlag: 0,
            exceptionCount: 0,
            stopSituation: '',
            stopReason: '',
            exceptionInfo: '',
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber()
        }
        this.tabSecondChangedState[0] += 1
        this.secondFormDataGroup.push(sole);
    }

    rowDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
        return '';
    }

    rowStopDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
        return '';
    }

    tabFirstChangeState() {
        console.log('查询 firstFormDataGroup 增删改状态')
        console.log(this.firstFormDataGroup)
        return !(this.firstFormDataGroup[0] === 0 && this.firstFormDataGroup[1] === 0 && this.firstFormDataGroup[2] === 0)
    }

    tabSecondChangeState() {
        console.log('查询 tabSecondChangedState 增删改状态')
        console.log(this.tabSecondChangedState)
        return !(this.tabSecondChangedState[0] === 0 && this.tabSecondChangedState[1] === 0 && this.tabSecondChangedState[2] === 0)
    }

    removeFirstDataRow(index) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {

            if (Object.prototype.hasOwnProperty.call(this.firstFormDataGroup[index], 'id')) {
                this.tabFirstChangedState[1] += 1
                this.waitedFirstDataDelete.push((this.firstFormDataGroup[index].id) as string)
            } else {
                this.tabFirstChangedState[0] -= 1
            }

            this.firstFormDataGroup.splice(index, 1);
        });
    }

    removeSecondDataRow(index) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (Object.prototype.hasOwnProperty.call(this.secondFormDataGroup[index], 'id')) {
                this.tabFirstChangedState[1] += 1
                this.waitedSecondDataDelete.push((this.secondFormDataGroup[index].id) as string)
            } else {
                this.tabSecondChangedState[0] -= 1
            }
            this.secondFormDataGroup.splice(index, 1);
        });
    }

    get computedFirstDataTotal(): number {
        const total = 0;
        // if (this.firstFormDataGroup.length !== 0) {
        //     total = this.firstFormDataGroup.map(item => item.duration).reduce((prev, next) => {
        //         return prev + next;
        //     })
        // }
        return total
    }

    get computedSecondDataTotal(): number {
        const total = 0;
        // if (this.secondFormDataGroup.length !== 0) {
        //     total = this.secondFormDataGroup.map(item => item.duration).reduce((prev, next) => {
        //         return prev + next;
        //     })
        // }
        return total
    }
}

interface FirstDataTable {
    classes?: string;
    startDate?: string;
    endDate?: string;
    duration?: number;
    remark?: string;
    changed?: string;
    changer?: string;
    delFlag?: number; // 删除标记(1：删除，0：正常)
    id?: string;
    editedMark?: boolean;
}
interface SecondDataTable{
    classes?: string;
    stopType?: string;
    stopMode?: string;
    startDate?: string;
    endDate?: string;
    duration?: number;
    delFlag?: number;
    exceptionCount?: number;
    stopSituation?: string;
    stopReason?: string;
    exceptionInfo?: string;
    remark?: string;
    changed?: string;
    changer?: string;
    id?: string;
    editedMark?: boolean;
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
