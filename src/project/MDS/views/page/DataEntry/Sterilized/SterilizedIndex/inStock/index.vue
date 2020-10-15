<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <form-head :form-header="formHeader" />
                </el-col>
                <el-col style="width: 100px;">
                    <div
                        style=" float: right; padding-top: 0; line-height: 25px;"
                        :style="{
                            color: orderStatus === 'noPass' ? 'red' : '',
                        }"
                    >
                        <span
                            style=" float: left; width: 5px; height: 5px; margin-top: 10px; margin-right: 3px; background: #1890ff; border-radius: 50%;"
                            :style="{
                                background: orderStatus === 'noPass' ? 'red' : '#1890FF',
                            }"
                        />{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : '未录入' }}
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    杀菌入库
                </span>
                <div class="inStorage_card">
                    <div class="inStorage_card_left" style="width: 158px;">
                        <p>杀菌罐</p>
                        <div style=" position: relative; padding: 0 10px; text-align: center;">
                            <img src="@/assets/img/ferPot.png" alt="" style="width: 110px; height: 188px;">
                            <div class="pot-detail">
                                <p>{{ PotDetail.batch }}</p>
                                <p>{{ PotDetail.amount }}</p>
                                <p>{{ PotDetail.material }}</p>
                            </div>
                        </div>
                        <el-button type="text" class="button" size="small" :disabled="!(isRedact && orderStatus !== 'submit' && orderStatus !== 'checked')" @click="showDialog()">
                            入罐
                        </el-button>
                    </div>
                    <div style="flex: 1; min-width: 990px; margin-left: 10px;">
                        <el-table header-row-class-name="tableHead" class="newTable" :data="InStorageDate" border tooltip-effect="dark" :row-class-name="RowDelFlag" @row-dblclick="updateRow">
                            <el-table-column type="index" width="50" label="序号" :show-overflow-tooltip="true" fixed />
                            <el-table-column label="日期" min-width="150" prop="date" :show-overflow-tooltip="true" />
                            <el-table-column label="半成品罐号" min-width="130" prop="holderName" :show-overflow-tooltip="true" />
                            <el-table-column label="半成品批次" min-width="110" prop="batch" :show-overflow-tooltip="true" />
                            <el-table-column label="入罐数量" min-width="80" prop="inAmount" :show-overflow-tooltip="true" />
                            <el-table-column label="满罐数量" min-width="80" prop="fullAmount" :show-overflow-tooltip="true" />
                            <el-table-column label="单位" min-width="50" prop="unit" :show-overflow-tooltip="true" />
                            <el-table-column label="罐内库存" min-width="80" prop="inTankAmount" :show-overflow-tooltip="true" />
                            <el-table-column label="满罐" min-width="60" prop="isFull" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.isFull === '1' ? '是' : '否' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="满罐时间" min-width="120" prop="fullDate" :show-overflow-tooltip="true" />
                            <el-table-column label="备注" min-width="120" prop="remark" :show-overflow-tooltip="true" />
                            <el-table-column label="操作人" min-width="140" prop="changer" :show-overflow-tooltip="true" />
                            <el-table-column label="操作时间" min-width="160" prop="changed" :show-overflow-tooltip="true" />
                            <el-table-column label="操作" fixed="right" width="50" prop="changer" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delRow(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <audit-log :table-data="DataAudit" style="margin-top: 10px;" />
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    异常记录
                </span>
                <exc-record ref="excrecord" :is-redact="isRedact" :order="formHeader" />
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label" class="spanview">
                    文本记录
                </span>
                <text-record ref="textrecord" :is-redact="isRedact" />
            </el-tab-pane>
        </el-tabs>
        <el-dialog width="400px" title="入罐" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="visible">
            <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="dataFormSubmit()" @submit.native.prevent>
                <el-form-item label="半成品罐号：" prop="holderId">
                    <el-select v-model="dataForm.holderId" filterable placeholder="请选择" style="width: 100%;" @change="PotinTankAmount">
                        <el-option v-for="(item, index) in PotList" :key="index" :label="item.holderName" :value="item.holderId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="批次：" prop="batch">
                    <el-input v-model="dataForm.batch" placeholder="请输入" :disabled="PotObject.batch" maxlength="10" />
                </el-form-item>
                <el-form-item label="入罐数量：">
                    <el-input v-model="dataForm.inAmount" placeholder="请输入" @change="PotinTankAmount1" />
                </el-form-item>
                <el-form-item label="单位：">
                    {{ (dataForm.unit = '方') }}
                </el-form-item>
                <el-form-item label="罐内库存：">
                    <el-input v-model="dataForm.inTankAmount" placeholder="请输入" :disabled="PotObject.inTankAmount" />
                </el-form-item>
                <el-form-item label="是否满罐：" prop="isFull">
                    <el-select v-model="dataForm.isFull" filterable placeholder="请选择" style="width: 100%;">
                        <el-option label="请选择" value="" />
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="满罐时间：">
                    <el-date-picker v-model="dataForm.fullDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="选择" style="width: 190px;" />
                </el-form-item>
                <el-form-item label="备注：">
                    <el-input v-model="dataForm.remark" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="操作人：">
                    {{ dataForm.changer }}
                </el-form-item>
                <el-form-item label="操作时间：">
                    {{ dataForm.changed }}
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="visible = false">取消</el-button>
                <el-button type="primary" size="small" :disabled="PotObject.maxStatus" @click="addIn()">确定</el-button>
            </span>
        </el-dialog>
        <redact-box>
            <template slot="button">
                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('ste:inStorage:mySaveOrUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button v-if="isAuth('ste:inStorage:mySaveOrUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('ste:inStorage:submit')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
import { STERILIZED_API } from '@/api/api';
import { Stesave, dateFormat, accDiv, accAdd } from '@/net/validate';
export default {
    name: 'Index',
    components: {
        ExcRecord,
        TextRecord,
        FormHead: resolve => {
            require(['../components/formHead'], resolve);
        },
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    data() {
        return {
            visible: false,
            isRedact: false,
            formHeader: {},
            activeName: '1',
            orderStatus: '',
            dataForm: {},
            rowData: {},
            isUpdate: false,
            oldInAmount: 0,
            PotList: [],
            InStorageDate: [],
            DataAudit: [],
            dataRule: {
                holderId: [
                    {
                        required: true,
                        message: '成品罐号不能为空',
                        trigger: 'blur'
                    }
                ],
                batch: [
                    {
                        required: true,
                        message: '批次不能为空',
                        trigger: 'blur'
                    },
                    {
                        min: 10,
                        max: 10,
                        message: '批次长度为10 个字符',
                        trigger: 'blur'
                    }
                ],
                isFull: [
                    {
                        required: true,
                        message: '是否满罐不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            PotDetail: {},
            PotObject: {
                inTankAmount: false,
                batch: false,
                maxStatus: false
            }
        };
    },
    computed: {},
    mounted() {
        this.GetOrderHead();
    },
    methods: {
        // 数据列表
        GetDataList() {
            this.$http(`${STERILIZED_API.STE_ENTER_IN_LIST_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.inOrderId,
                factory: this.$store.state.common.sterilized.inFactory,
                orderNo: this.$store.state.common.sterilized.inOrderNo
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.InStorageDate = data.list;
                    this.DataAudit = data.vList;
                    if (this.InStorageDate.length > 0) {
                        this.PotDetail = {
                            amount: this.InStorageDate[0].inTankAmount + this.InStorageDate[0].unit,
                            batch: this.InStorageDate[0].batch,
                            material: this.InStorageDate[0].materialName + ' ' + this.InStorageDate[0].materialCode
                        };
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 入罐弹窗
        showDialog() {
            this.visible = true;
            this.isUpdate = false;
            this.dataForm = {
                holderId: '',
                batch: '',
                inAmount: accDiv(this.formHeader.planOutput, 1000),
                unit: '',
                inTankAmount: '',
                isFull: '',
                remark: '',
                fullDate: '',
                date: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                orderId: this.formHeader.orderId,
                status: '',
                delFlag: '0',
                materialCode: this.formHeader.materialCode,
                materialName: this.formHeader.materialName,
                id: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: this.$store.state.user.realName + '（' + this.$store.state.user.name + '）'
            };
        },
        PotinTankAmount1() {
            if (this.dataForm.holderId) {
                this.dataForm.inTankAmount = Number((this.PotList.filter(item => item.holderId === this.dataForm.holderId)[0].amount ? this.PotList.filter(item => item.holderId === this.dataForm.holderId)[0].amount + Number(this.dataForm.inAmount) : 0 + Number(this.dataForm.inAmount)).toFixed(2));
            }
        },
        PotinTankAmount(id) {
            if (this.isUpdate) {
                this.dataForm.inTankAmount = Number((this.PotList.filter(item => item.holderId === id)[0].amount ? this.PotList.filter(item => item.holderId === id)[0].amount + Number(this.dataForm.inAmount) - this.oldInAmount : 0 + Number(this.dataForm.inAmount)).toFixed(2));
            } else {
                this.dataForm.inTankAmount = Number((this.PotList.filter(item => item.holderId === id)[0].amount ? this.PotList.filter(item => item.holderId === id)[0].amount + Number(this.dataForm.inAmount) : 0 + Number(this.dataForm.inAmount)).toFixed(2));
            }
            this.dataForm.batch = this.PotList.filter(item => item.holderId === id)[0].batch;
            this.PotObject.inTankAmount = true;
            // if (this.dataForm.inTankAmount) {
            //   this.PotObject.inTankAmount = true
            // } else {
            //   this.PotObject.inTankAmount = false
            // }
            if (this.dataForm.batch) {
                if (this.PotList.filter(item => item.holderId === id)[0].isEmpty === '1') {
                    this.PotObject.batch = false;
                } else {
                    this.PotObject.batch = true;
                }
            } else {
                this.PotObject.batch = false;
            }
        },
        // 弹窗确认
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
                            item.amount = this.dataForm.inTankAmount;
                            item.batch = this.dataForm.batch;
                        }
                    });
                    if (this.isUpdate) {
                        Reflect.ownKeys(this.dataForm).forEach(key => {
                            this.rowData[key] = this.dataForm[key];
                        });
                    } else {
                        this.InStorageDate.push(this.dataForm);
                    }
                    this.isUpdate = false;
                    this.visible = false;
                    if (this.InStorageDate.length > 0) {
                        if (this.InStorageDate.filter(item => item.delFlag !== '1').length > 0) {
                            this.PotDetail = {
                                amount: this.InStorageDate.filter(item => item.delFlag !== '1')[0].inTankAmount + this.InStorageDate[0].unit,
                                batch: this.InStorageDate.filter(item => item.delFlag !== '1')[0].batch,
                                material: this.InStorageDate.filter(item => item.delFlag !== '1')[0].materialName + ' ' + this.InStorageDate.filter(item => item.delFlag !== '1')[0].materialCode
                            };
                        } else {
                            this.PotDetail = {
                                amount: '',
                                batch: '',
                                material: ''
                            };
                        }
                    }
                }
            });
        },
        // 表格双击修改
        updateRow(row) {
            if ((row.status === '' || row.status === 'saved' || row.status === 'noPass') && this.isRedact) {
                this.visible = true;
                this.isUpdate = true;
                this.oldInAmount = row.inAmount;
                this.dataForm = JSON.parse(JSON.stringify(row));
                this.rowData = row;
                this.PotinTankAmount(this.dataForm.holderId);
            }
        },
        // 罐列表
        GetPotList() {
            this.$http(`${STERILIZED_API.STE_ENTER_IN_POT_LIST_API}`, 'POST', {
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop,
                orderId: this.formHeader.orderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.PotList = data.halfList;
                    if (this.formHeader.status !== '') {
                        this.GetDataList();
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 保存提交
        SubmitForm() {
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        savedOrSubmitForm(str) {
            if (str === 'submit') {
                let inAmountSum = 0;
                for (const item of this.InStorageDate) {
                    inAmountSum = accAdd(inAmountSum, item.inAmount);
                }
                if (inAmountSum <= 0) {
                    this.$errorToast('杀菌入库入罐数量必须大于0');
                    return false;
                }
            }
            const net1 = new Promise((resolve, reject) => {
                this.Stesave.excUpdate(this, 'In', resolve, reject);
            });
            const net2 = new Promise((resolve, reject) => {
                this.Stesave.textUpdate(this, 'In', resolve, reject);
            });
            const net3 = new Promise((resolve, reject) => {
                this.UpdateIn(str, resolve, reject);
            });
            if (str === 'submit') {
                const submitNet = Promise.all([net1, net2, net3]);
                submitNet
                    .then(() => {
                        const net0 = new Promise((resolve, reject) => {
                            this.Stesave.orderUpdate(this, 'insStatus', str, resolve, reject);
                        });
                        const net99 = new Promise((resolve, reject) => {
                            this.GetSumit(str, resolve, reject);
                        });
                        const net991 = Promise.all([net0, net99]);
                        net991
                            .then(() => {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.GetOrderHead();
                            })
                            .catch(err => {
                                this.$notify.error({
                                    title: '错误',
                                    message: err
                                });
                            });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            } else {
                const savedNet = Promise.all([net1, net2, net3]);
                savedNet
                    .then(() => {
                        const net0 = new Promise((resolve, reject) => {
                            this.Stesave.orderUpdate(this, 'insStatus', str, resolve, reject);
                        });
                        net0.then(() => {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            this.GetOrderHead();
                        });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            }
        },
        // 提交
        GetSumit(str, resolve, reject) {
            this.$http(`${STERILIZED_API.STE_ENTER_SUBMIT}`, 'POST', this.InStorageDate).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                    reject('杀菌入库' + data.msg);
                }
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
            this.$http(`${str === 'saved' ? STERILIZED_API.STE_ENTER_IN_UPDATE_API : STERILIZED_API.STE_ENTER_IN_SUBMIT_API}`, 'POST', this.InStorageDate).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                    reject('杀菌入库' + data.msg);
                }
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
            return '';
        },
        delRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
                this.PotList.forEach(item => {
                    if (item.holderId === row.holderId) {
                        item.amount = Number(item.amount) - Number(row.inAmount);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        // 获取订单表头
        /* eslint-disable @typescript-eslint/camelcase */
        GetOrderHead() {
            this.$http(`${STERILIZED_API.STE_ORDER_HEAD_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.inOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.isRedact = false;
                    this.formHeader = data.list[0];
                    this.orderStatus = data.list[0].insStatus;
                    this.Stesave = new Stesave(this.formHeader);
                    this.GetPotList();
                    this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    if (this.formHeader.status !== '') {
                        this.$refs.excrecord.GetExcDate({
                            order_id: this.formHeader.orderId,
                            sign: 'In'
                        });
                        this.$refs.textrecord.GetText({
                            order_id: this.formHeader.orderId,
                            sign: 'In'
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        }
        /* eslint-enable @typescript-eslint/camelcase */
    }
};
</script>

<style lang="scss">
.instorage-card-left_btn {
    width: 100%;
    margin-top: 10px !important;
    border-radius: 0 0 6px 6px !important;
}

.instorage-card-left_btn:hover {
    color: white !important;
    background: #1890ff !important;
}
</style>
<style lang="scss" scoped>
.inStorage_card {
    display: flex;
    .button {
        width: 100%;
        margin-top: 10px;
        padding: 0;
        line-height: 32px;
        background: #f7f9fa;
        border: none;
    }
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
        &_btn {
            width: 100%;
            margin-top: 10px;
            background: #f7f9fa;
        }
    }
}
.pot-detail {
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
