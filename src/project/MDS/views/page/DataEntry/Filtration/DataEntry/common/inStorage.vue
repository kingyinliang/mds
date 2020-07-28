<template>
    <div>
        <div class="inStorage_card">
            <div class="instorage-card">
                <div style="width: 158px;" class="inStorage_card_left">
                    <p>过滤罐</p>
                    <div style="position: relative; padding: 0 20px; text-align: center;">
                        <img src="@/assets/img/ferPot.png" alt="" style="width: 112px; height: 210px;">
                        <div class="potDetail">
                            <p>{{ PotDetail.batch }}</p>
                            <p>{{ PotDetail.amount }}</p>
                            <p>{{ PotDetail.material }}</p>
                        </div>
                    </div>
                    <el-button type="text" class="button" size="small" :disabled="!isRedact" @click="showDialog()">
                        入罐
                    </el-button>
                </div>
            </div>
            <div style="flex: 1; min-width: 1095px;">
                <el-table header-row-class-name="tableHead" class="newTable" :data="InStorageDate" border tooltip-effect="dark" :row-class-name="RowDelFlag" @row-dblclick="updateRow">
                    <el-table-column type="index" width="50" label="序号" :show-overflow-tooltip="true" fixed />
                    <el-table-column label="日期" min-width="165" prop="created" :show-overflow-tooltip="true" />
                    <el-table-column label="罐号" width="140" prop="holderName" :show-overflow-tooltip="true" />
                    <el-table-column label="批次" width="110" prop="batch" :show-overflow-tooltip="true" />
                    <el-table-column label="入罐数量" width="80" prop="inAmount" :show-overflow-tooltip="true" />
                    <el-table-column label="单位" width="50" prop="unit" :show-overflow-tooltip="true" />
                    <el-table-column label="是否满罐" width="90" prop="isFull" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.isFull === '1' ? '是' : '否' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="满罐时间" width="90" prop="fullDate" :show-overflow-tooltip="true" />
                    <el-table-column label="罐内库存" width="80" prop="holderRemaining" :show-overflow-tooltip="true" />
                    <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true" />
                    <el-table-column label="操作时间" min-width="165" prop="changed" :show-overflow-tooltip="true" />
                    <el-table-column label="操作人" min-width="160" prop="changer" :show-overflow-tooltip="true" />
                    <el-table-column label="操作" width="70" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style=" margin-top: 8px; font-size: 14px; line-height: 32px;">
                    产出数合计：{{ countOutputNum }}
                </div>
            </div>
        </div>
        <auditLog :table-data="DataAudit" style="margin-top: 10px;" />
        <el-dialog width="400px" title="入罐" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="visible">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="addIn()" @submit.native.prevent>
                <el-form-item label="罐号：" prop="holderId">
                    <el-select v-if="!dialogDisabled" v-model="dataForm.holderId" filterable placeholder="请选择" style="width: 100%;" @change="PotinTankAmount">
                        <el-option v-for="(item, index) in PotList" :key="index" :label="item.holderName" :value="item.holderId" />
                    </el-select>
                    <span v-if="dialogDisabled">{{ dataForm.holderName }}</span>
                </el-form-item>
                <el-form-item label="批次：" prop="batch">
                    <el-input v-model="dataForm.batch" placeholder="请输入" :disabled="PotObject.batch || dialogDisabled" maxlength="10" />
                </el-form-item>
                <el-form-item label="入罐数量：" prop="inAmount">
                    <el-input v-model="dataForm.inAmount" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="单位：">
                    {{ (dataForm.unit = '方') }}
                </el-form-item>
                <el-form-item label="罐内库存：">
                    <!--<el-input v-model="dataForm.holderRemaining" placeholder="请输入" :disabled="PotObject.inTankAmount || dialogDisabled"></el-input>-->
                    <el-input v-model="dataForm.holderRemaining" placeholder="请输入" disabled />
                </el-form-item>
                <el-form-item label="是否满罐：" prop="isFull">
                    <el-select v-model="dataForm.isFull" :disabled="dialogDisabled" filterable placeholder="请选择" style="width: 100%;">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="满罐时间：">
                    <el-date-picker v-model="dataForm.fullDate" type="datetime" :disabled="dialogDisabled" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="选择" style="width: 190px;" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="dataForm.remark" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="操作人：">
                    {{ (dataForm.changer = $store.state.user.realName + '（' + this.$store.state.user.name + '）') }}
                </el-form-item>
                <el-form-item label="操作时间：">
                    {{ dataForm.changed }}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" @click="addIn()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import { FILTRATION_API } from '@/api/api';
    import { dateFormat, GetStatus, accAdd, accMul } from '@/net/validate';
    export default {
        name: 'InStorage',
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
                default: () => { return {} }
            }
        },
        data() {
            return {
                visible: false,
                dataForm: {},
                rowData: {},
                PotList: [],
                InStorageDate: [],
                DataAudit: [],
                instorageState: '',
                dataRule: {
                    holderId: [{ required: true, message: '成品罐号不能为空', trigger: 'blur' }],
                    inAmount: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (value === '') {
                                    return callback(new Error('入罐数量不能为空'));
                                } else if (Number(value) <= 0) {
                                    return callback(new Error('入罐数量必须大于0'));
                                }
                                    return callback();

                            },
                            trigger: 'blur'
                        }
                    ],
                    batch: [
                        { required: true, message: '批次不能为空', trigger: 'blur' },
                        { min: 10, max: 10, message: '批次长度为10 个字符', trigger: 'blur' }
                    ],
                    isFull: [{ required: true, message: '是否满罐不能为空', trigger: 'blur' }]
                },
                dialogDisabled: false,
                PotDetail: {},
                PotObject: {
                    inTankAmount: false,
                    batch: false,
                    maxStatus: false
                },
                oldInAmount: '',
                oldHolderId: '',
                updateS: false
            };
        },
        computed: {
            countOutputNum: function() {
                let num = 0;
                this.InStorageDate.forEach(item => {
                    num = num + (item.delFlag === '0' ? Number(item.inAmount) : 0);
                });
                return num;
            }
        },
        watch: {
            'dataForm.inAmount'(n) {
                if (this.dataForm.holderId && this.PotList.filter(item => item.holderId === this.dataForm.holderId).length !== 0) {
                    if (this.updateS === false) {
                        const amounts = Number(this.PotList.find(item => item.holderId === this.dataForm.holderId).amount);
                        if (this.InStorageDate.findIndex(item => item.uid === this.dataForm.uid) === -1) {
                            this.dataForm.holderRemaining = accAdd(Number(n), amounts);
                        } else if (this.dataForm.holderId === this.oldHolderId) {
                            this.dataForm.holderRemaining = accMul(accAdd(Number(n), amounts), this.oldInAmount);
                        } else {
                            this.dataForm.holderRemaining = accAdd(Number(n), amounts);
                        }
                    } else {
                        this.updateS = false;
                    }
                }
            }
        },
        methods: {
            getList() {
                this.$http(`${FILTRATION_API.FILTER_IN_LIST_API}`, 'POST', {
                    orderId: this.$store.state.common.orderId
                })
                    .then(({ data }) => {
                        if (data.code === 0) {
                            this.InStorageDate = data.list;
                            if (this.InStorageDate.length > 0) {
                                this.PotDetail = {
                                    amount: this.InStorageDate[0].holderRemaining + this.InStorageDate[0].unit,
                                    batch: this.InStorageDate[0].batch,
                                    material: this.InStorageDate[0].materialCode + ' ' + this.InStorageDate[0].materialName
                                };
                            }
                            this.InStorageDate.map(item => {
                                item.uid = item.id;
                            });
                            this.instorageState = GetStatus(this.InStorageDate);
                            this.DataAudit = data.vrlist;
                        } else {
                            this.$errorToast(data.msg);
                        }
                    })
                    .finally(() => {
                        this.$emit('setInstorageState', this.instorageState);
                    });
            },
            // 入库修改
            UpdateIn(str, resolve, reject) {
                this.InStorageDate.forEach(item => {
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
                this.$http(`${str === 'saved' ? FILTRATION_API.FILTER_IN_UPDATE_API : FILTRATION_API.FILTER_IN_SAVE_API}`, 'POST', this.InStorageDate).then(({ data }) => {
                    if (data.code === 0) {
                        if (resolve) {
                            resolve('resolve');
                        }
                    } else if (reject) {
                        reject('过滤入库' + data.msg);
                    }
                });
            },
            // 添加和修改确认
            addIn() {
                if (this.dataForm.isFull === '1') {
                    if (!this.dataForm.fullDate) {
                        this.$warningToast('满罐时间必填');
                        return;
                    }
                }
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        this.PotList.forEach(item => {
                            if (item.holderId === this.dataForm.holderId) {
                                this.dataForm.holderName = item.holderName;
                                item.amount = this.dataForm.holderRemaining;
                                item.batch = this.dataForm.batch;
                            }
                        });
                        if (/repeat/g.test(this.dataForm.holderId)) {
                            this.dataForm.holderId = this.dataForm.holderId.substring(0, this.dataForm.holderId.indexOf('repeat'));
                        }
                        if (this.isUpdate) {
                            Reflect.ownKeys(this.dataForm).forEach(key => {
                                this.rowData[key] = this.dataForm[key];
                            });
                        } else {
                            this.InStorageDate.push(JSON.parse(JSON.stringify(this.dataForm)));
                        }
                        this.isUpdate = false;
                        this.visible = false;
                        let changeAmount = 0;
                        if (this.oldHolderId !== '' && this.oldHolderId !== this.dataForm.holderId && this.InStorageDate.findIndex(item => item.uid === this.dataForm.uid) !== -1) {
                            changeAmount = accMul(Number(this.PotList.find(item => item.holderId === this.oldHolderId).amount), Number(this.oldInAmount));
                            this.PotList.find(item => item.holderId === this.oldHolderId).amount = changeAmount;
                        }
                        this.InStorageDate.map(item => {
                            if (item.holderId === this.dataForm.holderId) {
                                item.holderRemaining = this.dataForm.holderRemaining;
                            }
                            if (this.oldHolderId !== this.dataForm.holderId && item.holderId === this.oldHolderId) {
                                item.holderRemaining = changeAmount;
                            }
                        });
                        setTimeout(() => {
                            this.dataForm.inAmount = 0;
                        }, 500);
                        if (this.InStorageDate.length > 0) {
                            this.PotDetail = {
                                amount: this.InStorageDate[0].holderRemaining + this.InStorageDate[0].unit,
                                batch: this.InStorageDate[0].batch,
                                material: this.InStorageDate[0].materialCode + ' ' + this.InStorageDate[0].materialName
                            };
                        }
                    }
                });
            },
            // 获取半成品罐
            GetholderList(factory, workShop, id) {
                this.$http(`${FILTRATION_API.FILTER_IN_POT_API}`, 'POST', {
                    factory: factory,
                    workShop: workShop,
                    orderId: id
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.PotList = data.holderList;
                        this.InStorageDate.forEach(item => {
                            if (this.PotList.filter(it => it.holderId === item.holderId).length > 0 && this.PotList.filter(it => it.holderId === item.holderId)[0].batch !== item.batch) {
                                this.PotList.push({
                                    amount: item.holderRemaining,
                                    batch: item.batch,
                                    holderId: item.holderId + 'repeat',
                                    holderName: item.holderName
                                });
                            }
                        });
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            },
            // 半成品罐下拉
            PotinTankAmount(id, st) {
                this.dataForm.holderType = this.PotList.find(item => item.holderId === id).holderType;
                if (this.PotList.filter(item => item.holderId === id).length === 0) {
                    this.dialogDisabled = true;
                } else if (st) {
                    if (this.PotList.filter(item => item.holderId === id)[0].batch !== this.dataForm.batch) {
                        this.dialogDisabled = true;
                    }
                } else {
                    //
                }
                if (this.PotList.filter(item => item.holderId === id).length !== 0) {
                    // 修改
                    const amount = Number(this.PotList.find(item => item.holderId === id).amount);
                    if (this.InStorageDate.findIndex(item => item.uid === this.dataForm.uid) === -1) {
                        this.dataForm.inAmount = 0;
                        this.dataForm.holderRemaining = amount;
                    } else if (id === this.oldHolderId) {
                        this.dataForm.holderRemaining = amount;
                    } else {
                        this.dataForm.holderRemaining = accAdd(amount, this.dataForm.inAmount);
                    }
                    if (!st) {
                        this.dataForm.batch = this.PotList.filter(item => item.holderId === id)[0].batch;
                    }
                    if (this.dataForm.holderRemaining) {
                        this.PotObject.inTankAmount = true;
                    } else {
                        this.PotObject.inTankAmount = false;
                    }
                    if (this.dataForm.batch) {
                        if (this.PotList.filter(item => item.holderId === id)[0].holderStatus === '0') {
                            this.PotObject.batch = false;
                        } else {
                            this.PotObject.batch = true;
                        }
                    } else {
                        this.PotObject.batch = false;
                    }
                }
            },
            // 入罐
            showDialog() {
                this.dialogDisabled = false;
                this.visible = true;
                this.dataForm = {
                    uid: this.uuid(),
                    id: '',
                    status: '',
                    isFull: '0',
                    serialNumber: '',
                    holderId: '',
                    batch: '',
                    inAmount: 0,
                    fullAmount: '',
                    unit: '',
                    holderRemaining: '',
                    remark: '',
                    delFlag: '0',
                    holderName: '',
                    fullDate: '',
                    changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    orderId: this.formHeader.orderId
                };
            },
            //  RowDelFlag
            RowDelFlag({ row }) {
                if (row.delFlag === '1') {
                    return 'rowDel';
                }
                return '';
            },
            // 删除
            delRow(row) {
                this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    row.delFlag = '1';
                    if (this.PotList.findIndex(item => item.holderId === row.holderId) !== -1) {
                        let changeAmount = 0;
                        // changeAmount = Number(this.PotList.find(item => (item.holderId === row.holderId || item.holderId + 'repeat' === row.holderId) && item.batch === row.batch).amount) - Number(row.inAmount)
                        changeAmount = accMul(row.holderRemaining, row.inAmount);
                        this.PotList.find(item => (item.holderId === row.holderId || item.holderId === row.holderId + 'repeat') && item.batch === row.batch).amount = changeAmount;
                        this.InStorageDate.map(item => {
                            if (item.holderId === row.holderId) {
                                item.holderRemaining = changeAmount;
                            }
                        });
                    }
                }).catch(() => {
                    // this.$infoToast('已取消删除');
                });
            },
            updateRow(row) {
                if ((row.status === '' || row.status === 'saved' || row.status === 'noPass') && this.isRedact) {
                    this.visible = true;
                    this.isUpdate = true;
                    this.dialogDisabled = false;
                    this.updateS = true;
                    this.dataForm = JSON.parse(JSON.stringify(row));
                    this.rowData = row;
                    this.oldInAmount = JSON.parse(JSON.stringify(this.dataForm.inAmount));
                    this.oldHolderId = this.dataForm.holderId;
                    this.PotinTankAmount(this.dataForm.holderId, true);
                }
            },
            GetHolderSum(holderId) {
                let sumInAmount = 0;
                this.InStorageDate.map(item => {
                    if (item.uid !== this.dataForm.uid && item.holderId === holderId) {
                        sumInAmount += Number(item.inAmount);
                    }
                });
                return sumInAmount + Number(this.PotList.find(items => items.holderId === holderId).amount);
            }
        }
    };
</script>

<style lang="scss">
    .inStorage_card_left_btn {
        width: 100%;
        margin-top: 10px;
        background: #f7f9fa;
        border-radius: 0 0 6px 6px;
    }
</style>
<style lang="scss" scoped>
    .inStorage_card {
        display: flex;
        &_left {
            width: 158px;
            margin-right: 5px;
            padding: 0;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(0, 0, 0, 0.09);
            border-radius: 6px;
            box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
            p {
                padding: 10px;
                font-size: 14px;
            }
        }
        .button {
            width: 100%;
            margin-top: 10px;
            padding: 0;
            line-height: 32px;
            background: #f7f9fa;
            border: none;
        }
    }
    .inStorage_card_left_btn:hover {
        color: #fff !important;
        background: #1890ff !important;
    }
    .potDetail {
        position: absolute;
        top: 40px;
        left: 30px;
        width: 92px;
        p {
            padding: 0;
            line-height: 20px;
        }
    }
</style>
