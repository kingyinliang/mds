<template>
    <div>
        <mds-card title="运行情况" :name="'equipment'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewFirstDataRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-form ref="ruleFirstForm" :model="ruleFirstForm">
                <el-table class="newTable" :data="firstFormDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%;">
                    <el-table-column label="序号" type="index" width="55" fixed="left" />
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>班次
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                <el-select v-model="scope.row.classes" size="small" clearable style="width: 100%;" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
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
                    <el-table-column min-width="370" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>开始时间 - 结束时间
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.date'" :rules="dataRules.date">
                                <el-date-picker
                                    v-model="scope.row.date"
                                    type="datetimerange"
                                    size="small"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    value-format="yyyy-MM-dd HH:mm"
                                    format="yyyy-MM-dd HH:mm"
                                    style="width: 340px;"
                                    clearable
                                    :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')"
                                />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="运行时长(H)" width="120" :show-overflow-tooltip="true" placeholder="输入小时">
                        <template slot-scope="scope">
                            {{ operationHour(scope.row,scope.$index) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" min-width="140" label="操作人" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" min-width="180" label="操作时间" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeFirstDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
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
                    <el-button type="primary" size="small" :disabled="!isRedact" @click="addSecondDataRow()">
                        新增
                    </el-button>
                </div>
            </template>
            <el-form ref="ruleSecondForm" :model="ruleSecondForm">
                <el-table class="newTable" :data="secondFormDataGroup" :row-class-name="rowStopDelFlag" header-row-class-name="tableHead" border style="width: 100%;">
                    <el-table-column label="序号" type="index" width="55" fixed="left" />
                    <el-table-column min-width="130" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>班次
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.classes'" :rules="dataRules.classes">
                                <el-select v-model="scope.row.classes" size="small" clearable style="width: 100px;" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
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
                    <el-table-column min-width="140" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>停机类型
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.stopType'" :rules="dataRules.stopType">
                                <el-select v-model="scope.row.stopType" size="small" clearable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @change="changeStopTypeOption(scope.row)">
                                    <el-option v-for="(item) in stopTypeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="140" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>停机方式
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.stopMode'" :rules="dataRules.stopMode">
                                <el-select v-model="scope.row.stopMode" size="small" clearable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @change="changeStopModeOption(scope.row)">
                                    <el-option v-for="(item) in stopModeOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="370" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>开始时间 - 结束时间
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.date'" :rules="dataRules.date">
                                <el-date-picker
                                    v-model="scope.row.date"
                                    type="datetimerange"
                                    size="small"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    value-format="yyyy-MM-dd HH:mm"
                                    format="yyyy-MM-dd HH:mm"
                                    style="width: 340px;"
                                    clearable
                                    :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')"
                                />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column label="时长(MIN)" width="120" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-if="scope.row.stopMode!=='CONTINUE_HALT'" v-model.number="scope.row.duration" size="small" clearable :disabled="!isRedact" />
                            <span v-else>{{ stopMin(scope.row,scope.$index) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="80" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>次数
                        </template>
                        <template slot-scope="scope">
                            <!-- <el-input v-model.number="scope.row.exceptionCount" size="small" placeholder="输入次数" clearable oninput="value=value.replace(/\D*/g,'')" :disabled="!(!scope.row.fzExceptionCount)" /> -->
                            <el-input v-model.number="scope.row.exceptionCount" size="small" placeholder="输入次数" clearable oninput="value=value.replace(/\D*/g,'')" :disabled="!(scope.row.stopMode!=='CONTINUE_HALT' && isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                        </template>
                    </el-table-column>
                    <el-table-column width="140" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>停机情况
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'r'+scope.$index+'.stopSituation'" :rules="dataRules.stopSituation">
                                <el-select v-model="scope.row.stopSituation" size="small" clearable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @change="changeStopReasonOption(scope.row)">
                                    <!-- <el-option v-for="(item) in stopSituationOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" /> -->
                                    <el-option v-for="(item) in scope.row.stopSituationArray" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" :show-overflow-tooltip="true">
                        <template slot="header">
                            <span class="notNull">*</span>停机原因
                        </template>
                        <template slot-scope="scope">
                            <el-form-item v-if="scope.row.fzReasonOptions===false" :prop="'r'+scope.$index+'.stopReason'" :rules="dataRules.stopReason">
                                <el-select v-model="scope.row.stopReason" size="small" clearable :disabled="!(!scope.row.fzReasonOptions && isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')">
                                    <!-- <el-option v-for="(item) in stopReasonOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" /> -->
                                    <el-option v-for="(item) in scope.row.stopReasonArray" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                                </el-select>
                            </el-form-item>
                            <el-form-item v-if="scope.row.fzReasonOptions===true" :prop="'r'+scope.$index+'.exceptionInfo'" :rules="dataRules.exceptionInfo">
                                <el-input v-model.trim="scope.row.exceptionInfo" size="small" placeholder="请输入" clearable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="描述" min-width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.exceptionInfo" size="small" placeholder="请输入" clearable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                        </template>
                    </el-table-column> -->
                    <el-table-column label="备注" min-width="180" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" clearable :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="changer" label="操作人" min-width="140" :show-overflow-tooltip="true" />
                    <el-table-column prop="changed" label="操作时间" min-width="180" :show-overflow-tooltip="true" />
                    <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.checkStatus !== 'C' && scope.row.checkStatus !== 'D' && scope.row.checkStatus !== 'P')" @click="removeSecondDataRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <el-row class="solerow">
                <div>
                    总停线时间：
                </div>
                <div class="input_bottom">
                    {{ computedSecondDataTotal }} MIN
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { COMMON_API, PKG_API, AUDIT_API } from 'common/api/api';
import { dataEntryData } from 'utils/utils'
import { dateFormat, getUserNameNumber, accDiv } from 'utils/utils';
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
    @Prop({ type: Boolean, default: false }) isRedact;
    @Prop({ type: Array, default: [] }) classesOptions;
    @Prop({ type: String, default: '' }) productLine;
    @Prop({ type: String, default: '' }) status;

    $refs: {
        ruleFirstForm: HTMLFormElement;
        ruleSecondForm: HTMLFormElement;
    }

    currentAudit = [];

    // 常有变数
    firstFormDataGroup: FirstDataTable[] = []; // 主 data
    secondFormDataGroup: SecondDataTable[] = []; // 次 data
    orgFirstFormDataGroup: FirstDataTable[] = []; // 主 data 复制
    orgSecondFormDataGroup: SecondDataTable[] = []; // 次 data 复制

    readAudit = []
    stopTypeOptions: Option[]=[]
    stopModeOptions: Option[]=[]
    stopSituationOptions: Option[]=[]
    planHaltOptions: Option[]=[]
    abnormalHaltOptions: Option[]=[]
    stopReasonOptions: Option[]=[]
    //fzReasonOptions=false
    // fzExceptionCount=false
    ruleFirstForm={
    }

    ruleSecondForm={
    }

    pickerOptionsStart=[[], []]
    pickerOptionsEnd=[[], []]

    dataRules= {
        classes: [
            { required: true, message: '请输入', trigger: 'change' }
        ],
        date: [
            { required: true, message: '不能为空', trigger: 'blur' }
        ],
        stopType: [
            { required: true, message: '请输入', trigger: 'change' }
        ],
        stopMode: [
            { required: true, message: '请输入', trigger: 'change' }
        ],
        stopSituation: [
            { required: true, message: '请输入', trigger: 'change' }
        ],
        stopReason: [
            { required: true, message: '请输入', trigger: 'change' }
        ],
        exceptionInfo: [
            { required: true, message: '请输入', trigger: 'change' }
        ]
    }


    // changeStart(value, index, order) {
    //     if (!value.endDate) {
    //         this.pickerOptionsStart[order][index] = Object.assign({}, this.pickerOptionsStart[order][index], {
    //         disabledDate: () => {
    //             return false
    //         }
    //         })
    //     } else {
    //         this.pickerOptionsStart[order][index] = Object.assign({}, this.pickerOptionsStart[order][index], {
    //         disabledDate: (time) => {
    //             return time.getTime() > new Date(value.endDate).getTime() - 8.64e6
    //         }
    //         })
    //     }
    // }

    // changeEnd(value, index, order) {
    //     if (!value.startDate) {
    //         this.pickerOptionsEnd[order][index] = Object.assign({}, this.pickerOptionsEnd[order][index], {
    //         disabledDate: () => {
    //             return false
    //             }
    //         })
    //     } else {
    //         this.pickerOptionsEnd[order][index] = Object.assign({}, this.pickerOptionsEnd[order][index], {
    //         disabledDate: (time) => {
    //             return time.getTime() < new Date(value.startDate).getTime() - 8.64e7
    //             }
    //         })
    //     }
    // }

    created() {
        this.getStopType() // 停机类型

        this.getStopMode() // 停机方式

        this.getPlanHalt()

        this.getAbnormalHalt()

    }

    async init(formHeader) {


        PKG_API.PKG_DEVICE_QUERY_API({ // 设备运行-查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            if (data.data !== null) {
                this.firstFormDataGroup = JSON.parse(JSON.stringify(data.data));
                this.firstFormDataGroup.forEach(item => {
                    item.date = [item.startDate as string, item.endDate as string]
                });
                this.orgFirstFormDataGroup = JSON.parse(JSON.stringify(this.firstFormDataGroup));
                this.setValidate(this.firstFormDataGroup, this.ruleFirstForm)
            }
        });
        await PKG_API.PKG_EXCEPTION_QUERY_API({ // 停机情况-查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            if (data.data !== null) {
                this.secondFormDataGroup = JSON.parse(JSON.stringify(data.data));
                this.secondFormDataGroup.forEach(item => {
                    item.fzExceptionCount = false
                    item.fzReasonOptions = false
                    item.date = [item.startDate as string, item.endDate as string]
                    this.changeStopModeDefaultOption(item);
                    this.changeStopReasonDefaultOption(item);
                });

                this.orgSecondFormDataGroup = JSON.parse(JSON.stringify(this.secondFormDataGroup));

                this.setValidate(this.secondFormDataGroup, this.ruleSecondForm)
            }
        });


        this.currentAudit = await this.getAudit(formHeader, 'TIMESHEET');
    }

    async getAudit(formHeader, verifyType) {
        const result = await AUDIT_API.AUDIT_LOG_LIST_API({
            orderNo: formHeader.orderNo,
            verifyType: verifyType
        })
        return result.data.data
    }

    // 设置校验
    setValidate(currentFormDataGroup, ruleFirstForm) {
        currentFormDataGroup.forEach((item, index) => {
            this.$set(ruleFirstForm, 'r' + index, item)
        })
    }

    // 提交时跑校验
    ruleSubmit() {
        if (this.firstFormDataGroup.filter(it => it.delFlag !== 1).length === 0) {
            this.$warningToast('请录入设备运行运行情况');
            return false
        }
        for (const item of this.firstFormDataGroup.filter(it => it.delFlag !== 1)) {
            if (!item.classes || !item.date) {
                this.$warningToast('请填写运行情况必填项');
                return false
            }
        }
        for (const item of this.secondFormDataGroup.filter(it => it.delFlag !== 1)) {
            if (!item.classes || !item.stopType || !item.stopMode || !item.date || !item.exceptionCount || !item.stopSituation || (!item.stopReason && !item.fzReasonOptions) || (!item.exceptionInfo && item.fzReasonOptions)) {
                this.$warningToast('请填写停机情况必填项');
                return false
            }
        }
        return true
    }

    savedData(formHeader) {
        this.firstFormDataGroup.forEach(item => {
            item.startDate = item.date[0]
            item.endDate = item.date[1]
        })
        const pkgDeviceSaveRequestDto: FristObj = {
            deviceRunTime: this.computedFirstDataTotal,
            ids: [],
            pkgDeviceInsertDtos: [],
            pkgDeviceUpdateDtos: []
        };

        this.secondFormDataGroup.forEach(item => {
            item.startDate = item.date[0]
            item.endDate = item.date[1]
        })
        const pkgExceptionSaveRequestDto: SecondObj = {
            devicePauseTime: this.computedSecondDataTotal,
            ids: [],
            pkgExceptionInsertDtos: [],
            pkgExceptionUpdateDtos: []
        };

        dataEntryData(formHeader, this.firstFormDataGroup, this.orgFirstFormDataGroup, pkgDeviceSaveRequestDto.ids, pkgDeviceSaveRequestDto.pkgDeviceInsertDtos, pkgDeviceSaveRequestDto.pkgDeviceUpdateDtos);
        dataEntryData(formHeader, this.secondFormDataGroup, this.orgSecondFormDataGroup, pkgExceptionSaveRequestDto.ids, pkgExceptionSaveRequestDto.pkgExceptionInsertDtos, pkgExceptionSaveRequestDto.pkgExceptionUpdateDtos);

        pkgDeviceSaveRequestDto.pkgDeviceInsertDtos.forEach(item => {
            delete item['stopSituationArray']
        })
        pkgDeviceSaveRequestDto.pkgDeviceUpdateDtos.forEach(item => {
            delete item['stopSituationArray']
        })
        pkgExceptionSaveRequestDto.pkgExceptionInsertDtos.forEach(item => {
            delete item['stopSituationArray']
        })
        pkgExceptionSaveRequestDto.pkgExceptionUpdateDtos.forEach(item => {
            delete item['stopSituationArray']
        })

        return {
            pkgDeviceSaveRequestDto,
            pkgExceptionSaveRequestDto
        }
    }

    getStopType() {
        COMMON_API.DICTQUERY_API({
            dictType: 'COMMON_HALT_TYPE'
        }).then(({ data }) => {
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
            data.data.forEach((item) => {
                this.abnormalHaltOptions.push({
                    dictValue: item.dictValue,
                    dictCode: item.dictCode
                })
            })
        });
    }

    changeStopTypeOption(row) {
        if (row.stopType === 'PLAN_HALT') {
            row.stopMode = 'CONTINUE_HALT'
            row.exceptionCount = 1
            row.fzExceptionCount = true
            row.stopSituationArray = JSON.parse(JSON.stringify(this.planHaltOptions))
            row.stopReasonArray = []
            row.stopSituation = ''
            row.stopReason = ''
        } else {
            row.stopMode = ''
            row.exceptionCount = 0
            row.fzExceptionCount = false
            row.stopSituationArray = JSON.parse(JSON.stringify(this.abnormalHaltOptions))
            row.stopReasonArray = []
            row.stopSituation = ''
            row.stopReason = ''
        }
    }


    changeStopModeDefaultOption(row) {
        if (row.stopType === 'PLAN_HALT') {
            row.stopMode = 'CONTINUE_HALT'
            row.fzExceptionCount = true
            row.stopSituationArray = JSON.parse(JSON.stringify(this.planHaltOptions))
        } else {
            row.fzExceptionCount = false
            row.stopSituationArray = JSON.parse(JSON.stringify(this.abnormalHaltOptions))
        }
    }

    changeStopModeOption(row) {
        if (row.stopMode === 'CONTINUE_HALT') {
            row.exceptionCount = 1

        } else {
            row.exceptionCount = 0
            row.duration = 0
        }
    }

    changeStopReasonOption(row) {
        row.stopReasonArray = []
        row.stopReason = ''
        if (row.stopSituation === 'PLAN_HALT' || row.stopSituation === 'MAINTENCE' || row.stopSituation === 'RECOVERY' || row.stopSituation === 'SHUTDOWN' || row.stopSituation === 'FAULT') {
            row.fzReasonOptions = false
            COMMON_API.DEVICELIST_API({
                deptId: this.productLine,
                current: 1,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                size: 99999
            }).then(({ data }) => {
                data.data.records.forEach((item) => {
                    row.stopReasonArray.push({
                        dictValue: item.deviceName,
                        dictCode: item.deviceNo
                    })
                })
            });
            row.exceptionInfo = ''
        } else if (row.stopSituation === 'EXPERIMENT' || row.stopSituation === 'POOR_PROCESS' || row.stopSituation === 'WAIT' || row.stopSituation === 'ENERGY') {
            row.fzReasonOptions = false
            COMMON_API.DICTQUERY_API({
                dictType: row.stopSituation
            }).then(({ data }) => {
                data.data.forEach((item) => {
                    row.stopReasonArray.push({
                        dictValue: item.dictValue,
                        dictCode: item.dictCode
                    })
                })
            });
            row.exceptionInfo = ''
        } else {
            row.fzReasonOptions = true
            row.stopReasonArray = []
        }
    }

    changeStopReasonDefaultOption(row) {
        row.stopReasonArray = []
        if (row.stopSituation === 'PLAN_HALT' || row.stopSituation === 'MAINTENCE' || row.stopSituation === 'RECOVERY' || row.stopSituation === 'SHUTDOWN' || row.stopSituation === 'FAULT') {
            row.fzReasonOptions = false
            COMMON_API.DEVICELIST_API({
                deptId: this.productLine,
                current: 1,
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                size: 99999
            }).then(({ data }) => {
                data.data.records.forEach((item) => {
                    row.stopReasonArray.push({
                        dictValue: item.deviceName,
                        dictCode: item.deviceNo
                    })
                })
            });
        } else if (row.stopSituation === 'EXPERIMENT' || row.stopSituation === 'POOR_PROCESS' || row.stopSituation === 'WAIT' || row.stopSituation === 'ENERGY') {
            row.fzReasonOptions = false
            COMMON_API.DICTQUERY_API({
                dictType: row.stopSituation
            }).then(({ data }) => {
                data.data.forEach((item) => {
                    row.stopReasonArray.push({
                        dictValue: item.dictValue,
                        dictCode: item.dictCode
                    })
                })
            });
        } else {
            row.fzReasonOptions = true
            row.stopReasonArray = []
        }
    }

    operationHour(row, index): number {
        let num
        if (row.date[1] !== '' && row.date[0] !== '') {
            num = accDiv((new Date(row.date[1]).getTime() - new Date(row.date[0]).getTime()), 3600000).toFixed(2)
        } else {
            num = 0
        }
        // if (num <= 0) {
        //     num = 0
        // }
        this.firstFormDataGroup[index].duration = num

        return num
    }

    stopMin(row, index): number {
        let num
        if (row.date[0] !== '' && row.date[1] !== '') {
            num = accDiv((new Date(row.date[1]).getTime() - new Date(row.date[0]).getTime()), 60000).toFixed(2)
        } else {
            num = 0
        }
        // if (num <= 0) {
        //     num = 0
        // }
        this.secondFormDataGroup[index].duration = num

        return num
    }

    addNewFirstDataRow() {
        const sole: FirstDataTable = {
            classes: '',
            startDate: '',
            endDate: '',
            date: [dateFormat(new Date(), 'yyyy-MM-dd hh:mm'), dateFormat(new Date(), 'yyyy-MM-dd hh:mm')],
            duration: 0,
            durationUnit: 'H',
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber(),
            delFlag: 0
        }
        this.firstFormDataGroup.push(sole);
        this.setValidate(this.firstFormDataGroup, this.ruleFirstForm)
    }

    addSecondDataRow() {
        const sole: SecondDataTable = {
            classes: '',
            stopType: '',
            stopMode: '',
            date: [dateFormat(new Date(), 'yyyy-MM-dd hh:mm'), dateFormat(new Date(), 'yyyy-MM-dd hh:mm')],
            startDate: '',
            endDate: '',
            duration: 0,
            delFlag: 0,
            durationUnit: 'MIN',
            exceptionCount: 0,
            stopSituation: '',
            stopReason: '',
            exceptionInfo: '',
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber()
        }
        this.secondFormDataGroup.push(sole);
        this.setValidate(this.secondFormDataGroup, this.ruleSecondForm)
    }

    rowDelFlag({ row }) {
        if (row.delFlag === 1) {
            return 'rowDel';
        }
        return '';
    }

    rowStopDelFlag({ row }) {
        if (row.delFlag === 1) {
            return 'rowDel';
        }
        return '';
    }

    removeFirstDataRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            row.delFlag = 1;
        });
    }

    removeSecondDataRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            row.delFlag = 1;
        });
    }

    get computedFirstDataTotal(): number {
        let total = 0;
        // const reducer = (accumulator, currentValue) => accumulator + currentValue;
        // if (this.firstFormDataGroup.length !== 0) {
        //     total = this.firstFormDataGroup.map(item => Number(item.duration)).reduce(reducer) as number
        // }


        this.firstFormDataGroup.map((item) => {
            if (item.delFlag !== 1) {
                total = _.add(total, Number(item.duration));
            }
        });
        return total;
    }

    get computedSecondDataTotal(): number {
        let total = 0;
        // const reducer = (accumulator, currentValue) => accumulator + currentValue;
        // if (this.secondFormDataGroup.length !== 0) {
        //     total = this.secondFormDataGroup.map(item => Number(item.duration)).reduce(reducer) as number
        // }
        // return total

        this.secondFormDataGroup.map((item) => {
            if (item.delFlag !== 1) {
                total = _.add(total, Number(item.duration));
            }
        });
        return total;


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
    date: string[];
    endDate?: string;
    duration?: number;
    remark?: string;
    durationUnit?: string;
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
    date: string[];
    durationUnit?: string;
    endDate?: string;
    duration?: number;
    delFlag?: number;
    fzExceptionCount?: boolean;
    fzReasonOptions?: boolean;
    exceptionCount?: number;
    stopSituation?: string;
    stopReason?: string;
    stopReasonArray?: Option[];
    stopSituationArray?: Option[];
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
