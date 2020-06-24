<template>
    <div>
        <el-card>
            <el-row :gutter="20">
                <el-col v-for="(item, index) in filterList" :key="index" :span="8">
                    <div class="grid-content">
                        <el-row style="flex-grow: 1;">
                            <el-col :span="10" style="padding-left: 16px;">
                                <div class="title">
                                    {{ item.deviceName }}
                                </div>
                                <div class="content">
                                    请点击下方操作按钮，<br>进行相应操作
                                </div>
                            </el-col>
                            <el-col :span="14">
                                <img src="@/assets/img/Filtration.png" alt="" style="width: 92%; margin-top: 19px; margin-bottom: 10px;">
                            </el-col>
                        </el-row>
                        <el-row class="bottom">
                            <el-col :span="8">
                                <el-button class="button" :disabled="!isRedact" @click="ShowDialog(item, '清洗')">
                                    清洗
                                </el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-button class="button" :disabled="!isRedact" @click="ShowDialog(item, '预涂')">
                                    预涂
                                </el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-button class="button" :disabled="!isRedact" @click="ShowDialog(item, '过滤')">
                                    {{ formHeader.productLineName }}
                                </el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
            </el-row>
            <el-table
                :data="dataList"
                :row-class-name="rowDelFlag"
                border
                header-row-class-name="tableHead"
                style="margin-top: 10px;"
                @row-dblclick="EditInfo"
            >
                >
                <el-table-column type="index" label="序号" width="50" fixed />
                <el-table-column label="过滤机号" prop="deviceName" width="120" />
                <el-table-column label="领用罐号" prop="holderName" width="120" show-overflow-tooltip />
                <el-table-column label="工作内容" prop="content" />
                <el-table-column label="开始时间" prop="startTime" width="140" show-overflow-tooltip />
                <el-table-column label="结束时间" prop="endTime" width="140" show-overflow-tooltip />
                <el-table-column label="时长(H)" prop="timeLength" />
                <el-table-column label="备注" prop="remark" />
                <el-table-column label="操作时间" prop="changed" width="150" show-overflow-tooltip />
                <el-table-column label="操作人" prop="changer" width="145" show-overflow-tooltip />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact || scope.row.status === 'checked' || scope.row.status === 'submit'" @click="DelRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card>
            <audit-log :table-data="recordList" />
        </el-card>
        <el-dialog :visible.sync="dialogVisible" width="400px" :close-on-click-modal="false" custom-class="dialog__class" @keyup.enter.native="SaveDialog('workInfo')">
            <div slot="title">
                {{ workInfo.deviceName }}
            </div>
            <el-form ref="workInfo" :model="workInfo" size="small" label-width="110px">
                <el-form-item label="工作内容：">
                    {{ workInfo.content }}
                </el-form-item>
                <el-form-item label="开始时间：" prop="startTime">
                    <el-date-picker v-model="workInfo.startTime" type="datetime" placeholder="选择时间" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
                </el-form-item>
                <el-form-item label="结束时间：" prop="endTime">
                    <el-date-picker v-model="workInfo.endTime" type="datetime" placeholder="选择时间" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" />
                </el-form-item>
                <el-form-item v-if="workInfo.content === '过滤'" label="领用罐号：">
                    <el-select v-model="workInfo.holderId" filterable style="width: 220px;">
                        <el-option v-for="(sole, index) in holderList" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="workInfo.remark" style="width: 220px;" />
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="SaveDialog()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { dateFormat, GetStatus } from '@/net/validate';
import { FILTRATION_API } from '@/api/api';
export default {
    name: 'Equworkinghours',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
                type: Boolean
            },
        formHeader: {
                type: Object,
                default: function() { return {} }
            }
        },
    data() {
        return {
            orderId: '',
            dialogVisible: false,
            filterList: [],
            dataList: [],
            recordList: [],
            workInfo: {},
            workInforules: {
                startTime: [
                    {
                        required: true,
                        message: '请选择开始时间',
                        trigger: 'change'
                    }
                ],
                endTime: [
                    {
                        required: true,
                        message: '请选择结束时间',
                        trigger: 'change'
                    }
                ]
            },
            equStatus: '',
            holderList: []
        };
    },
    methods: {
        GetequWorkingList() {
            let returnList
            if (this.dataList.length === 0) {
                returnList = [];
            } else {
                returnList = this.dataList.filter(item => item.delFlag === '0');
            }
            return returnList;
        },
        GetList(params) {
            this.orderId = params.orderId;
            this.$http(`${FILTRATION_API.FILTER_EQUWORKINGHOURS_LIST}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.filterList = data.listInfo.filterList;
                        this.dataList = data.listInfo.machineList;
                        this.equStatus = GetStatus(data.listInfo.machineList);
                        this.recordList = data.listInfo.record;
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .finally(() => {
                    this.$emit('setEquState', this.equStatus);
                });
        },
        GetHolderList(params) {
            this.$http(`${FILTRATION_API.FILTER_MATERIAL_HOLDERLIST}`, 'POST', params).then(({ data }) => {
                if (data.code === 0) {
                    this.holderList = data.holderList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        Readyrules() {
            let ty = true;
            let i = 0;
            this.dataList.map(item => {
                if (item.delFlag === '0') {
                    i = 1;
                }
            });
            if (i === 0) {
                ty = false;
                this.$warningToast('请录入设备工时数据');
                return false;
            }
            return ty;
        },
        ShowDialog(item, content) {
            let contentText = content;
            if (contentText === '过滤' && this.formHeader.productLineName === '脱盐') {
                contentText = '脱盐';
            }
            this.workInfo = {
                id: '',
                uid: this.uuid(),
                orderId: this.orderId,
                deviceName: item.deviceName,
                content: contentText,
                status: 'saved',
                filterMachineId: item.deviceId,
                startTime: '',
                endTime: '',
                holderId: '',
                holderName: '',
                delFlag: '0'
            };
            this.dialogVisible = true;
        },
        SaveDialog() {
            if (!this.workInfo.startTime) {
                this.$warningToast('请选择开始时间');
                return false;
            }
            if (!this.workInfo.endTime) {
                this.$warningToast('请选择结束时间');
                return false;
            }
            if (this.workInfo.content === '过滤' && !this.workInfo.holderId) {
                this.$warningToast('请选择领用罐');
                return false;
            }
            // this.$refs[formName].validate(valid => {
            //     if (valid) {
            if (this.workInfo.content === '过滤') {
                this.workInfo.holderName = this.holderList.find((item) => item.holderId === this.workInfo.holderId).holderName;
            }
            this.workInfo.timeLength = ((new Date(this.workInfo.endTime) - new Date(this.workInfo.startTime)) / 3600000).toFixed(2);
            this.workInfo.changed = dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
            this.workInfo.changer = this.$store.state.user.realName + `(${this.$store.state.user.name})`;
            // this.workInfo.remark = this.workInfo.remark;
            let currentRecord = [];
            if (Object.prototype.hasOwnProperty.call(this.workInfo, 'uid')) {
                // 新增行
                currentRecord = this.dataList.filter(data => data.uid === this.workInfo.uid);
            } else {
                // 原有行
                currentRecord = this.dataList.filter(data => data.id === this.workInfo.id);
            }
            if (currentRecord && currentRecord.length > 0) {
                Object.assign(currentRecord[0], this.workInfo);
            } else {
                this.dataList.push(this.workInfo);
            }
            this.dialogVisible = false;
                // } else {
                //     return false;
                // }
            // });
        },
        EditInfo(row) {
            if (this.isRedact === true && row.status !== 'checked' && row.status !== 'submit') {
                this.dialogVisible = true;
                const holderInfo = this.holderList.find(item => item.holderId === row.holderId)
                // eslint-disable-next-line
                if (holderInfo === undefined) {
                    this.holderList.push({
                        holderId: row.holderId,
                        holderName: row.holderName
                    })
                }
                this.workInfo = Object.assign({}, row);
            }
        },
        DelRow(row) {
            this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
                return '';

        },
        SaveEquWorking(resolve, reject) {
            this.$http(`${FILTRATION_API.FILTER_EQUWORKINGHOURS_SAVE}`, 'POST', this.dataList)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        },
        SubmitEquWorking(resolve, reject) {
            this.$http(`${FILTRATION_API.FILTER_EQUWORKINGHOURS_SUBMITONE}`, 'POST', { orderId: this.orderId })
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorToast(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        }
    }
};
</script>

<style lang="scss">
.rowDel {
    display: none;
}
.grid-content {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
    border: 1px solid rgba(233, 233, 233, 1);
    border-radius: 2px;
    .title {
        margin-top: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        font-size: 14px;
        line-height: 24px;
    }
    .content {
        margin-top: 7px;
        color: rgba(153, 153, 153, 1);
        font-weight: 400;
        font-size: 12px;
        line-height: 22px;
    }
    .bottom {
        width: 100%;
        background: rgba(247, 249, 250, 1);
        border-top: 1px solid rgba(233, 233, 233, 1);
        border-bottom: none;
        .button {
            width: 100%;
            margin: 10px 0;
            padding: 0;
            line-height: 20px;
            background: none;
            border: none;
            border-right: 1px solid #e8e8e8;
        }
    }
}
</style>
