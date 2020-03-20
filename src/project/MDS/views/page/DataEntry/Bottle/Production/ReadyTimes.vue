<template>
    <div>
        <el-card style="margin-bottom: 10px; position: relative;" class="newCard">
            <el-form ref="timesForm" :inline="true" :model="readyTimeDate" size="small" labelWidth="125px">
                <el-row class="clearfix">
                    <h3 style="font-size: 14px; line-height: 32px; font-weight: 600; float: left;">
                        准备时间（分钟：min）
                    </h3>
                    <el-form-item label="班次：" style="float: right; margin-right: 0; margin-bottom: 10px;">
                        <el-select v-model="readyTimeDate.classes" size="mini" style="width: 130px;" placeholder="请选择" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))">
                            <el-option label="白班" value="白班" />
                            <el-option label="中班" value="中班" />
                            <el-option label="夜班" value="夜班" />
                            <el-option label="多班" value="多班" />
                        </el-select>
                    </el-form-item>
                </el-row>
                <div class="manHourReadyBox">
                    <el-row v-if="readyTimeDate.classes === '白班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                        <el-form-item label="交接班（白班）：">
                            <el-input v-model="readyTimeDate.dayChange" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="班前会：" labelWidth="80px">
                            <el-input v-model="readyTimeDate.dayChangeBefore" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="生产前准备：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.dayChangePre" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="生产后清场：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.dayChangeAfter" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                    </el-row>
                    <el-row v-if="readyTimeDate.classes === '中班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                        <el-form-item label="交接班（中班）：">
                            <el-input v-model="readyTimeDate.midChange" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="班前会：" labelWidth="80px">
                            <el-input v-model="readyTimeDate.midChangeBefore" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="生产前准备：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.midChangePre" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="生产后清场：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.midChangeAfter" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                    </el-row>
                    <el-row v-if="readyTimeDate.classes === '夜班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                        <el-form-item label="交接班（夜班）：">
                            <el-input v-model="readyTimeDate.nightChange" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="班前会：" labelWidth="80px">
                            <el-input v-model="readyTimeDate.nightChangeBefore" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="生产前准备：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.nightChangePre" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                        <el-form-item label="生产后清场：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.nightChangeAfter" size="mini" style="width: 130px;" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="交接班事项：" labelWidth="100px">
                            <el-input v-model="readyTimeDate.matters" type="textarea" size="mini" style="width: 870px;" :rows="3" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                        </el-form-item>
                    </el-row>
                </div>
            </el-form>
        </el-card>
        <el-card style="margin-bottom: 10px; position: relative;" class="newCard">
            <h3 style="font-size: 14px; line-height: 32px; font-weight: 600; float: none;">
                设备时间（分钟：min）
            </h3>
            <el-row type="flex">
                <el-col style="width: 160px;">
                    <div class="equ">
                        <img src="@/assets/img/bottle.png" style="width: 154px;">
                        <el-row class="equ_btn_row">
                            <el-col
                                :span="12"
                                class="equ_btn"
                            >
                                <div @click="setVisible('吹瓶')">
                                    吹瓶
                                </div>
                            </el-col>
                            <el-col
                                :span="12"
                                class="equ_btn"
                                style="border-left: 1px solid #eee;"
                            >
                                <div @click="setVisible('上瓶')">
                                    上瓶
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col style="max-width: 942px;">
                    <el-table headerRowClassName="tableHead" :rowClassName="RowDelFlag" :data="dataList" border tooltipEffect="dark" @row-dblclick="updateRow">
                        <el-table-column type="index" label="序号" width="55" />
                        <el-table-column label="班次" :showOverflowTooltip="true" prop="classesName" width="70" />
                        <el-table-column label="工作内容" :showOverflowTooltip="true" prop="content" width="110" />
                        <el-table-column label="开始时间" :showOverflowTooltip="true" prop="startDate" width="130" />
                        <el-table-column label="结束时间" :showOverflowTooltip="true" prop="endDate" width="130" />
                        <el-table-column label="时长" :showOverflowTooltip="true" prop="dateLength" width="80" />
                        <el-table-column label="备注" :showOverflowTooltip="true" prop="remark" width="100" />
                        <el-table-column label="操作时间" :showOverflowTooltip="true" prop="changed" width="105" />
                        <el-table-column label="操作人" :showOverflowTooltip="true" prop="changer" width="105" />
                        <el-table-column label="操作" :showOverflowTooltip="true" width="70" fixed="right">
                            <template slot-scope="scope">
                                <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delData(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <auditLog :tableData="TimeAudit" />
        <el-dialog width="400px" :title="dataForm.content" class="ShinHoDialog" :closeOnClickModal="false" :visible.sync="visible">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" labelWidth="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="Confirmed()" @submit.native.prevent>
                <el-form-item label="班次：" prop="classes">
                    <el-select v-model="dataForm.classes" size="mini" placeholder="请选择" style="width: 160px;" @change="ChangeProductShift">
                        <el-option v-for="(iteam, index) in productShift" :key="index" :label="iteam.value" :value="iteam.code" />
                    </el-select>
                </el-form-item>
                <el-form-item label="工作内容：" prop="content">
                    {{ dataForm.content }}
                </el-form-item>
                <el-form-item label="开始时间：" prop="startDate">
                    <el-date-picker v-model="dataForm.startDate" size="mini" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" style="width: 160px;" />
                </el-form-item>
                <el-form-item label="结束时间：">
                    <el-date-picker v-model="dataForm.endDate" size="mini" type="datetime" valueFormat="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" style="width: 160px;" />
                </el-form-item>
                <el-form-item label="时长：">
                    {{ (dataForm.dateLength = mistiming(dataForm.endDate, dataForm.startDate)) }}
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="dataForm.remark" placeholder="手工录入" size="mini" style="width: 160px;" />
                </el-form-item>
                <el-form-item label="操作时间：">
                    {{ dataForm.changed }}
                </el-form-item>
                <el-form-item label="操作人：">
                    {{ dataForm.changer }}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="Confirmed()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { dateFormat, toDate } from '@/net/validate';
import { BOTTLE_API } from '@/api/api';
export default {
    name: 'ReadyTimes',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean,
            default() {
                return false;
            }
        },
        productShift: {
            type: Array,
            default: () => []
        },
        formHeader: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            visible: false,
            isUpdate: false,
            readyTimeDate: {
                id: '',
                status: '',
                classes: '多班',
                matters: '',
                dayChange: '',
                dayChangeBefore: '',
                dayChangePre: '',
                dayChangeAfter: '',
                midChange: '',
                midChangeBefore: '',
                midChangePre: '',
                midChangeAfter: '',
                nightChange: '',
                nightChangeBefore: '',
                nightChangePre: '',
                nightChangeAfter: ''
            },
            dataList: [],
            TimeAudit: [],
            dataForm: {},
            dataRule: {
                classes: [{ required: true, message: '班次必填', trigger: 'blur' }],
                content: [{ required: true, message: '工作内容必填', trigger: 'blur' }],
                startDate: [{ required: true, message: '开始时间必填', trigger: 'blur' }]
            }
        };
    },
    computed: {
        mistiming: function() {
            return function(end, start) {
                if (end && start) {
                    return Number(((toDate(end) - toDate(start)) / 60000).toFixed(2));
                }
            };
        }
    },
    methods: {
        // 获取准备工时列表
        /* eslint-disable @typescript-eslint/camelcase*/
        getDataList() {
            let status = '';
            this.$http(`${BOTTLE_API.BOTTLE_PRO_READYTIME_LIST}`, 'POST', {
                order_id: this.$store.state.common.bottle.ProOrderId
            })
                .then(({ data }) => {
                    if (data.code === 0) {
                        if (data.listTime.length > 0) {
                            this.readyTimeDate = data.listTime[0];
                            status = data.listTime[0].status;
                        }
                        this.dataList = data.listMachine;
                        this.TimeAudit = data.vrList;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                })
                .finally(() => {
                    this.$emit('SetReadyStatus', status);
                });
        },
        /* eslint-enable @typescript-eslint/camelcase*/
        // 弹窗确认
        Confirmed() {
            // if (this.dataForm.dateLength * 1 > 0) {} else {
            //   this.$message.error('时长必须大于0')
            //   return false
            // }
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    if (this.isUpdate) {
                        Reflect.ownKeys(this.dataForm).forEach(key => {
                            this.rowData[key] = this.dataForm[key];
                        });
                    } else {
                        this.dataList.push(this.dataForm);
                    }
                    this.isUpdate = false;
                    this.visible = false;
                }
            });
        },
        // 表格双击修改
        updateRow(row) {
            if ((row.status === '' || row.status === 'saved' || row.status === 'noPass') && this.isRedact) {
                this.visible = true;
                this.isUpdate = true;
                this.dataForm = JSON.parse(JSON.stringify(row));
                this.rowData = row;
            }
        },
        // 吹瓶上瓶点击
        setVisible(str) {
            if (this.isRedact) {
                this.visible = true;
                this.dataForm = {
                    id: '',
                    orderId: this.$store.state.common.bottle.ProOrderId,
                    status: '',
                    delFlag: '0',
                    classes: '',
                    dateLength: '',
                    classesName: '',
                    content: str,
                    startDate: '',
                    endDate: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    changer: this.$store.state.user.realName + '（' + this.$store.state.user.name + '）',
                    remark: ''
                };
            }
        },
        // 班次下拉
        ChangeProductShift() {
            this.dataForm.classesName = this.productShift.filter(item => item.code === this.dataForm.classes)[0].value;
        },
        // 修改准备时间
        UpdateReady(str, resolve, reject) {
            this.readyTimeDate.orderId = this.formHeader.orderId;
            this.readyTimeDate.dayChange = this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0 ? String(this.readyTimeDate.dayChange) : this.readyTimeDate.dayChange;
            this.readyTimeDate.dayChangeBefore = this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0 ? String(this.readyTimeDate.dayChangeBefore) : this.readyTimeDate.dayChangeBefore;
            this.readyTimeDate.dayChangePre = this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0 ? String(this.readyTimeDate.dayChangePre) : this.readyTimeDate.dayChangePre;
            this.readyTimeDate.dayChangeAfter = this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0 ? String(this.readyTimeDate.dayChangeAfter) : this.readyTimeDate.dayChangeAfter;
            this.readyTimeDate.midChange = this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0 ? String(this.readyTimeDate.midChange) : this.readyTimeDate.midChange;
            this.readyTimeDate.midChangeBefore = this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0 ? String(this.readyTimeDate.midChangeBefore) : this.readyTimeDate.midChangeBefore;
            this.readyTimeDate.midChangePre = this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0 ? String(this.readyTimeDate.midChangePre) : this.readyTimeDate.midChangePre;
            this.readyTimeDate.midChangeAfter = this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0 ? String(this.readyTimeDate.midChangeAfter) : this.readyTimeDate.midChangeAfter;
            this.readyTimeDate.nightChange = this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0 ? String(this.readyTimeDate.nightChange) : this.readyTimeDate.nightChange;
            this.readyTimeDate.nightChangeBefore = this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0 ? String(this.readyTimeDate.nightChangeBefore) : this.readyTimeDate.nightChangeBefore;
            this.readyTimeDate.nightChangePre = this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0 ? String(this.readyTimeDate.nightChangePre) : this.readyTimeDate.nightChangePre;
            this.readyTimeDate.nightChangeAfter = this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0 ? String(this.readyTimeDate.nightChangeAfter) : this.readyTimeDate.nightChangeAfter;
            if (!this.readyTimeDate.status) {
                this.readyTimeDate.status = str;
            } else if (this.readyTimeDate.status === 'saved') {
                    this.readyTimeDate.status = str;
                } else if (this.readyTimeDate.status === 'noPass' && str === 'submit') {
                    this.readyTimeDate.status = str;
                }
            this.$http(`${BOTTLE_API.BOTTLE_PRO_READY_UPDATE}`, 'POST', this.readyTimeDate).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                    if (resolve) {
                        reject('修改准备时间' + data.msg);
                    }
                }
            });
        },
        // 修改设备时间
        UpdateDevice(str, resolve, reject) {
            this.dataList.forEach(item => {
                if (item.status) {
                    if (item.status === 'saved') {
                        item.status = str;
                    } else if (item.status === 'noPass' && str === 'submit') {
                        item.status = str;
                    }
                } else {
                    item.status = str;
                }
            });
            this.$http(`${BOTTLE_API.BOTTLE_PRO_DEVICE_UPDATE}`, 'POST', this.dataList).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                    if (reject) {
                        reject('修改设备时间' + data.msg);
                    }
                }
            });
        },
        // 校验
        dataRul() {
            let ty = true;
            const day =
                (this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) &&
                (this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) &&
                (this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) &&
                (this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0);
            const mid =
                (this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) &&
                (this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) &&
                (this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) &&
                (this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0);
            const night =
                (this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) &&
                (this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) &&
                (this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) &&
                (this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0);
            if (this.readyTimeDate.classes === '白班') {
                if (day) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间白班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '中班') {
                if (mid) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间中班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '夜班') {
                if (night) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间夜班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '多班') {
                if (day && night) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间多班必填项未填写完全');
                    return false;
                }
            }
            this.dataList.forEach(item => {
                if (item.delFlag !== '1') {
                    if (!(item.classes && item.content && item.startDate)) {
                        ty = false;
                        this.$warningTost('设备时间必填项未填');
                        return false;
                    }
                    if (Number(item.dateLength) <= 0) {
                        ty = false;
                        this.$warningTost('设备时间工时不大于0');
                        return false;
                    }
                }
            });
            return ty;
        },
        delData(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        }
    }
};
</script>

<style lang="scss" scoped>
.equ {
    width: 154px;
    height: 246px;
    position: relative;
    border: 1px solid #eee;
    border-radius: 5px;
    margin-right: 5px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
    overflow: hidden;
    img {
        margin-top: 40px;
    }
    &_btn {
        cursor: pointer;
        font-size: 14px;
        border-top: 1px solid #eee;
        text-align: center;
        line-height: 40px;
        color: black;
        &_row {
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        &:hover {
            background: #1890ff;
            color: white;
        }
    }
}
</style>
