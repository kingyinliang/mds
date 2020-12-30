<template>
    <mds-card :title="'录入数据单位：MIN'" :name="'exc'" :icon-bg="'#f05c4a'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="AddExcDate()">
                    新增
                </el-button>
            </div>
        </template>
        <el-table header-row-class-name="tableHead" class="newTable" :data="excList" :row-class-name="RowDelFlag" border tooltip-effect="dark" style="min-height: 90px;">
            <el-table-column type="index" :index="index => getIndexMethod(index, excList)" label="序号" width="55" fixed />
            <el-table-column min-width="100">
                <template slot="header">
                    <span class="notNull">* </span>班次
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.classes" size="small" :disabled="!isRedact" clearable>
                        <el-option v-for="item in classesOptions" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column min-width="120">
                <template slot="header">
                    <span class="notNull">* </span>异常情况
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.exceptionSituation" size="small" :disabled="!isRedact" @change="changeExc($event, scope.row)">
                        <el-option v-for="item in abnormalList" :key="item.dictCode" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column min-width="200">
                <template slot="header">
                    <span class="notNull">* </span>开始时间
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 170px;" />
                </template>
            </el-table-column>
            <el-table-column min-width="200">
                <template slot="header">
                    <span class="notNull">* </span>结束时间
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 170px;" />
                </template>
            </el-table-column>
            <el-table-column label="时长" min-width="100">
                <template slot-scope="scope">
                    {{ (scope.row.duration = Number(workTime(scope.row.endDate, scope.row.startDate, scope.row))) }}
                </template>
            </el-table-column>
            <el-table-column min-width="80" label="单位" prop="durationUnit" />
            <el-table-column min-width="140">
                <template slot="header">
                    <span class="notNull">* </span>异常原因
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.exceptionReason" filterable size="small" :disabled="!isRedact || scope.row.exceptionSituation === 'AB_OTHERS'">
                        <el-option v-for="(item, index) in scope.row.excReasonList" :key="index" :label="item.dictValue" :value="item.dictCode" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="异常描述" min-width="220">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :disabled="scope.row.exceptionInfo===''" :content="scope.row.exceptionInfo" placement="top-start">
                        <el-input v-model.trim="scope.row.exceptionInfo" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="备注" min-width="200">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :disabled="scope.row.remark===''" :content="scope.row.remark" placement="top-start">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="操作人" width="140">
                <template slot-scope="scope">
                    {{ scope.row.changer }}
                </template>
            </el-table-column>
            <el-table-column label="操作时间" width="170">
                <template slot-scope="scope">
                    {{ scope.row.changed }}
                </template>
            </el-table-column>
            <el-table-column width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="solerow">
            <div>
                总异常时间：
            </div>
            <div class="input_bottom">
                {{ totalMin }} MIN
            </div>
        </el-row>
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { dateFormat, getUserNameNumber, getDateDiff, accAdd } from 'utils/utils';
    import { COMMON_API, KOJI_API } from 'common/api/api';
    import _ from 'lodash';

    @Component({
        name: 'ExcRecord'
    })
    export default class ExcRecord extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact;
        @Prop({ type: Object, default: {} }) formHeader;

        classesOptions: object[] = [];
        abnormalList: object[] = [];
        excReasonList = [];
        excList: ExcList[] = [];
        excListOrg: ExcList[] = [];
        excReasonTotal: ExcReasonTotal = {
            FAULTSHUTDOWN: [],
            POORPROCESSWAIT: [],
            ENERGY: []
        };

        // 获取总异常时间
        get totalMin() {
            let MinNum = 0;
            this.excList.map((item: ExcList) => {
                if (item.delFlag !== 1) {
                    MinNum = accAdd(MinNum, item.duration);
                }
            });
            return MinNum;
        }

        init(formHeader, tagName) {
            const net1 = new Promise(resolve => {
                this.getexcReasonTwo(formHeader, resolve);
            });
            const net2 = new Promise(resolve => {
                this.getexcReasonThree(formHeader, resolve);
            });
            Promise.all([net1, net2]).then(() => {
                COMMON_API.DEVICE_LISTBYTYPE_API({ deptId: formHeader.workShop }).then(({ data }) => {
                    this.excReasonTotal.FAULTSHUTDOWN = []
                    data.data.map(item => {
                        this.excReasonTotal.FAULTSHUTDOWN.push({
                            dictValue: item.deviceName,
                            dictCode: item.deviceNo
                        });
                    });
                    this.getClassesList();
                    this.getAbnormalList();
                    this.getExcList(formHeader, tagName);
                });
            });
        }

        // 异常原因
        getexcReasonTwo(formHeader, resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'WAIT' }).then(({ data }) => {
                this.excReasonTotal.POORPROCESSWAIT = data.data;
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常原因
        getexcReasonThree(formHeader, resolve) {
            COMMON_API.DICTQUERY_API({ dictType: 'ENERGY' }).then(({ data }) => {
                this.excReasonTotal.ENERGY = data.data;
            });
            if (resolve) {
                resolve('resolve');
            }
        }

        // 查询异常记录列表
        getExcList(formHeader, tagName) {
            KOJI_API.KOJI_EXCEPTION_QUERY_API({
                kojiOrderNo: formHeader.kojiOrderNo,
                orderNo: formHeader.orderNo,
                exceptionStage: tagName
            }).then(({ data }) => {
                this.excList = data.data;
                this.excList.map(item => {
                    if (item.exceptionSituation === 'FAULT' || item.exceptionSituation === 'SHUTDOWN') {
                        item.excReasonList = this.excReasonTotal.FAULTSHUTDOWN;
                    } else if (item.exceptionSituation === 'POOR_PROCESS' || item.exceptionSituation === 'WAIT') {
                        item.excReasonList = this.excReasonTotal.POORPROCESSWAIT;
                    } else if (item.exceptionSituation === 'ENERGY') {
                        item.excReasonList = this.excReasonTotal.ENERGY;
                    }
                    item.delFlag = 0;
                });
                this.excListOrg = JSON.parse(JSON.stringify(this.excList));
            });
        }

        // 班次
        getClassesList() {
            COMMON_API.DICTQUERY_CLASSLIST_API({}).then(({ data }) => {
                this.classesOptions = data.data;
            });
        }

        // 异常
        getAbnormalList() {
            COMMON_API.DICTQUERY_API({ dictType: 'ABNORMAL_HALT' }).then(({ data }) => {
                this.abnormalList = data.data;
            });
        }

        AddExcDate() {
            this.excList.push({
                classes: '',
                exceptionSituation: '',
                startDate: '',
                endDate: '',
                duration: 0,
                durationUnit: 'MIN',
                exceptionReason: '',
                exceptionInfo: '',
                remark: '',
                excReasonList: [],
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0
            });
        }

        //异常原因
        changeExc(val, row) {
            row.exceptionReason = '';
            if (val === 'FAULT' || val === 'SHUTDOWN') {
                row.excReasonList = this.excReasonTotal.FAULTSHUTDOWN;
            } else if (val === 'POOR_PROCESS' || val === 'WAIT') {
                row.excReasonList = this.excReasonTotal.POORPROCESSWAIT;
            } else if (val === 'ENERGY') {
                row.excReasonList = this.excReasonTotal.ENERGY;
            }
        }

        getSavedOrSubmitData(formHeader, tagName) {
            const ids: string[] = [];
            const InsertDto: ExcList[] = [];
            const UpdateDto: ExcList[] = [];
            this.excList.map((item: ExcList) => {
                item.kojiOrderNo = formHeader.kojiOrderNo;
                item.exceptionStage = tagName;
                item.orderId = formHeader.orderId;
                item.orderNo = formHeader.orderNo;
                item.potOrderId = formHeader.id;
                item.potOrderNo = formHeader.potOrderNo || '';
            });
            this.excList.forEach((item, index) => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        ids.push(item.id);
                    }
                } else if (item.id) {
                    if (!_.isEqual(this.excListOrg[index], item)) {
                        UpdateDto.push(item);
                    }
                } else {
                    InsertDto.push(item);
                }
            });
            return {
                ids,
                InsertDto,
                UpdateDto
            };
        }

        ruleSubmit() {
            // if (this.excList.filter(it => it.delFlag !== 1).length === 0) {
            //     this.$warningToast('请录入异常记录页签数据');
            //     return false;
            // }
            for (const item of this.excList.filter(it => it.delFlag !== 1)) {
                if (!item.classes || !item.exceptionSituation || !item.startDate || !item.endDate) {
                    this.$warningToast('请填写异常记录页签必填项');
                    return false;
                }
                if (item.exceptionSituation !== 'AB_OTHERS' && !item.exceptionReason) {
                    this.$warningToast('请填写异常记录页签必填项');
                    return false;
                }
                if (item.duration && item.duration <= 0) {
                    this.$warningToast('结束时间不能小于或等于开始时间');
                    return false;
                }
            }
            return true;
        }

        removeRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$set(row, 'delFlag', 1)
                this.$successToast('删除成功');
            });
        }

        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        workTime(end, start, row) {
            let diff = '0';
            if (end && start && row.delFlag !== 1) {
                diff = getDateDiff(start, end, 'minute');
            }
            return diff;
        }
    }

    interface ExcList {
        id?: string;
        classes?: string;
        exceptionSituation?: string;
        startDate?: string;
        endDate?: string;
        duration?: number;
        durationUnit?: string;
        exceptionReason?: string;
        exceptionInfo?: string;
        remark?: string;
        changed?: string;
        changer?: string;
        delFlag?: number;
        exceptionStage?: string;
        orderId?: string;
        orderNo?: string;
        potOrderId?: string;
        potOrderNo?: string;
        excReasonList?: object[];
        kojiOrderNo?: string;
    }
    interface ExcReasonTotal {
        FAULTSHUTDOWN: object[];
        POORPROCESSWAIT: object[];
        ENERGY: object[];
    }
    interface Reason {
        dictCode?: string;
        dictId?: string;
        dictValue?: string;
        factoryName?: string;
        id?: string;
    }
</script>

<style scoped></style>
