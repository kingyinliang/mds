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
            <el-table class="newTable" :data="firstFormDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;" @cell-click="compareFirstFormDataGroupChange">
                <el-table-column label="序号" type="index" width="55" fixed="left" />
                <el-table-column min-width="130" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small" clearable style="width: 100;" @change="compareFirstFormDataGroupChange(scope.row)">
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
            <el-table class="newTable" :data="secondFormDataGroup" :row-class-name="rowStopDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;" @cell-click="compareSecondFormDataGroupChange">
                <el-table-column label="序号" type="index" width="55" fixed="left" />
                <el-table-column min-width="130" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small" clearable style="width: 100px;" @change="compareSecondFormDataGroupChange(scope.row)">
                            <el-option
                                v-for="item in classesOptions"
                                :key="item.dictCode"
                                :label="item.dictValue"
                                :value="item.dictCode"
                            />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机类型
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopType" size="small" clearable @change="changeStopModeOption(scope.row)">
                            <el-option v-for="(item) in stopTypeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机方式
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopMode" size="small" clearable :disabled="fzReasonOptions" @change="compareSecondFormDataGroupChange(scope.row)">
                            <el-option v-for="(item) in stopModeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
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
                        <el-input v-model.number="scope.row.exceptionCount" size="small" placeholder="输入次数" clearable oninput="value=value.replace(/\D*/g,'')" :disabled="fzExceptionCount" />
                    </template>
                </el-table-column>
                <el-table-column width="140" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机情况
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopSituation" size="small" clearable @change="changeStopReasonOption(scope.row)">
                            <el-option v-for="(item) in stopSituationOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column width="140" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机原因
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.stopReason" size="small" clearable @change="compareSecondFormDataGroupChange(scope.row)">
                            <el-option v-for="(item) in stopReasonOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
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
import { COMMON_API, PKG_API } from 'common/api/api';
import { dateFormat, getUserNameNumber } from 'utils/utils';
import _ from 'lodash';

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
    @Prop({ type: String, default: '' }) productLine

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
    stopTypeOptions: Option[]=[]
    stopModeOptions: Option[]=[]
    stopSituationOptions: Option[]=[]
    planHaltOptions: Option[]=[]
    abnormalHaltOptions: Option[]=[]
    stopReasonOptions: Option[]=[]
    fzReasonOptions=false
    fzExceptionCount=false

    init(formHeader) {
        PKG_API.PKG_DEVICE_QUERY_API({ // 设备运行-查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            if (data.data !== null) {
                this.firstFormDataGroup = JSON.parse(JSON.stringify(data.data));
                this.orgFirstFormDataGroup = JSON.parse(JSON.stringify(data.data));
            }
        });
        PKG_API.PKG_EXCEPTION_QUERY_API({ // 停机情况-查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            if (data.data !== null) {
                this.secondFormDataGroup = JSON.parse(JSON.stringify(data.data));
                this.orgSecondFormDataGroup = JSON.parse(JSON.stringify(data.data));
            }
        });

        this.getStopType()

        this.getStopMode()

        this.getPlanHalt()

        this.getAbnormalHalt()

        this.waitedFirstDataDelete = [];
        this.waitedFirstDataInsert = [];
        this.waitedFirstDataUpdate = [];
        this.tabFirstChangedState = [0, 0, 0]

        this.waitedSecondDataDelete = [];
        this.waitedSecondDataInsert = [];
        this.waitedSecondDataUpdate = [];
        this.tabSecondChangedState = [0, 0, 0]
    }

    savedData(formHeader) {
        const pkgDeviceSaveRequestDto: FristObj = {
            deviceRunTime: this.computedFirstDataTotal,
            ids: [],
            pkgDeviceInsertDtos: [],
            pkgDeviceUpdateDtos: []
        };
        const pkgExceptionSaveRequestDto: SecondObj = {
            devicePauseTime: this.computedSecondDataTotal,
            ids: [],
            pkgExceptionInsertDtos: [],
            pkgExceptionUpdateDtos: []
        };

        this.firstFormDataGroup.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    pkgDeviceSaveRequestDto.ids.push(item.id)
                }
            } else if (item.id) {
                if (!_.isEqual(this.orgFirstFormDataGroup[index], item)) {
                    item.orderId = formHeader.id;
                    pkgDeviceSaveRequestDto.pkgDeviceUpdateDtos.push(item)
                }
            } else {
                item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                item.orderId = formHeader.id;
                item.orderNo = formHeader.orderNo;
                pkgDeviceSaveRequestDto.pkgDeviceInsertDtos.push(item)
            }
        });

        this.secondFormDataGroup.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    pkgExceptionSaveRequestDto.ids.push(item.id)
                }
            } else if (item.id) {
                if (!_.isEqual(this.orgSecondFormDataGroup[index], item)) {
                    item.orderId = formHeader.id;
                    pkgExceptionSaveRequestDto.pkgExceptionUpdateDtos.push(item)
                }
            } else {
                item.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
                item.orderId = formHeader.id;
                item.orderNo = formHeader.orderNo;
                pkgExceptionSaveRequestDto.pkgExceptionInsertDtos.push(item)
            }
        });

        return {
            pkgDeviceSaveRequestDto,
            pkgExceptionSaveRequestDto
        }
    }

    getStopType() {
        COMMON_API.DICTQUERY_API({
            dictType: 'COMMON_HALT_TYPE'
        }).then(({ data }) => {
            console.log('停机类型')
            console.log(data)
            this.stopTypeOptions = []
            data.data.forEach((item) => {
                this.stopTypeOptions.push({
                    dictValue: item.dictValue,
                    dictCode: item.dictCode
                })
            })
        });
    }

    getStopMode() {
        COMMON_API.DICTQUERY_API({
            dictType: 'COMMON_HALT_MODE'
        }).then(({ data }) => {
            console.log('停机方法')
            console.log(data)
            this.stopModeOptions = []
            data.data.forEach((item) => {
                this.stopModeOptions.push({
                    dictValue: item.dictValue,
                    dictCode: item.dictCode
                })
            })
        });
    }

    getPlanHalt() {
        COMMON_API.DICTQUERY_API({
            dictType: 'PLAN_HALT'
        }).then(({ data }) => {
            this.planHaltOptions = []
            console.log('计划停机')
            console.log(data)
            data.data.forEach((item) => {
                this.planHaltOptions.push({
                    dictValue: item.dictValue,
                    dictCode: item.dictCode
                })
            })
        });
    }

    getAbnormalHalt() {
        COMMON_API.DICTQUERY_API({
            dictType: 'ABNORMAL_HALT'
        }).then(({ data }) => {
            this.abnormalHaltOptions = []
            console.log('异常停机')
            console.log(data)
            data.data.forEach((item) => {
                this.abnormalHaltOptions.push({
                    dictValue: item.dictValue,
                    dictCode: item.dictCode
                })
            })
        });
    }

    changeStopModeOption(row) {
        console.log(row)
        if (row.stopType === 'PLAN_HALT') {
            row.stopMode = 'CONTINUE_HALT'
            row.exceptionCount = 1
            this.fzExceptionCount = true
            this.stopSituationOptions = JSON.parse(JSON.stringify(this.planHaltOptions))
            row.stopReasonOptions = ''
            row.stopSituation = ''
        } else {
            row.stopMode = ''
            row.exceptionCount = 0
            this.fzExceptionCount = false
            this.stopSituationOptions = JSON.parse(JSON.stringify(this.abnormalHaltOptions))
            row.stopReasonOptions = ''
            row.stopSituation = ''
        }
    }

    changeStopReasonOption(row) {
        console.log(row)
        if (row.stopSituation === 'PLAN_HALT' || row.stopSituation === 'MAINTENCE' || row.stopSituation === 'RECOVERY' || row.stopSituation === 'SHUTDOWN') {
            this.fzReasonOptions = false
            COMMON_API.DEVICELIST_API({
                deptId: this.productLine,
                current: 1,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                size: 100
            }).then(({ data }) => {
                console.log('data')
                console.log(data)
                data.data.forEach((item) => {
                    this.stopReasonOptions.push({
                        dictValue: item.deviceName,
                        dictCode: item.deviceNo
                    })
                })
            });
        } else if (row.stopSituation === 'EXPERIMENT' || row.stopSituation === 'POOR_PROCESS' || row.stopSituation === 'WAIT' || row.stopSituation === 'ENERGY') {
            this.fzReasonOptions = false
            COMMON_API.DICTQUERY_API({
                dictType: row.stopSituation
            }).then(({ data }) => {
                this.stopReasonOptions = []
                data.data.forEach((item) => {
                    this.stopReasonOptions.push({
                        dictValue: item.dictValue,
                        dictCode: item.dictCode
                    })
                })
            });
        } else {
            this.fzReasonOptions = true
            row.stopReason = ''
            this.stopReasonOptions = []
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
            deviceRunTime: this.computedFirstDataTotal,
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
            devicePauseTime: this.computedSecondDataTotal,
            deleteData: this.waitedSecondDataDelete,
            insertData: this.waitedSecondDataInsert,
            updateData: this.waitedSecondDataUpdate
        }
    }

    compareFirstFormDataGroupChange(row) {
            this.orgFirstFormDataGroup.forEach((item) => {
                if (row.editedMark === false) {
                    if (item.id === row.id) {
                        console.log(item)
                        console.log(row)
                        console.log(_.isEqual(row, item))
                        if (!_.isEqual(row, item)) {
                            row.editedMark = true
                            this.tabFirstChangedState[2] += 1
                            console.log(row.editedMark)
                        }
                    }
                }
            })
            console.log('增删改状态')
            console.log(this.tabFirstChangedState)
    }

    compareSecondFormDataGroupChange(row) {
            this.orgSecondFormDataGroup.forEach((item) => {
                if (row.editedMark === false) {
                    if (item.id === row.id) {
                        console.log(item)
                        console.log(row)
                        console.log(_.isEqual(row, item))
                        if (!_.isEqual(row, item)) {
                            row.editedMark = true
                            this.tabSecondChangedState[2] += 1
                            console.log(row.editedMark)
                        }
                    }
                }
            })
            console.log('增删改状态')
            console.log(this.tabSecondChangedState)
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
        console.log('查询 tabFirstChangedState 增删改状态')
        console.log(this.tabFirstChangedState)
        return !(this.tabFirstChangedState[0] === 0 && this.tabFirstChangedState[1] === 0 && this.tabFirstChangedState[2] === 0)
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
        let total = 0;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        if (this.firstFormDataGroup.length !== 0) {
            total = this.firstFormDataGroup.map(item => item.duration).reduce(reducer) as number
        }
        return total
    }

    get computedSecondDataTotal(): number {
        let total = 0;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        if (this.secondFormDataGroup.length !== 0) {
            total = this.firstFormDataGroup.map(item => item.duration).reduce(reducer) as number
        }
        return total
    }
}

interface FristObj {
    deviceRunTime?: number;
    ids: string[];
    pkgDeviceInsertDtos: FirstDataTable[];
    pkgDeviceUpdateDtos: FirstDataTable[];
}

interface SecondObj {
    devicePauseTime?: number;
    ids: string[];
    pkgExceptionInsertDtos: SecondDataTable[];
    pkgExceptionUpdateDtos: SecondDataTable[];
}

interface FirstDataTable {
    factory?: string;
    orderId?: string;
    orderNo?: string;
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
    factory?: string;
    orderId?: string;
    orderNo?: string;
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

interface Option{
    dictValue?: string;
    dictCode?: string;
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
