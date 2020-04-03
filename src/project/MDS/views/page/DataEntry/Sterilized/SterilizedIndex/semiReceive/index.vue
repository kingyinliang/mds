<template>
    <div class="header_main">
        <el-card class="searchCard  newCard" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <form-head :formHeader="formHeader" />
                </el-col>
                <el-col style="width: 100px;">
                    <div
                        style=" float: right; padding-top: 0;"
                        :style="{
                            color: orderStatus === 'noPass' ? 'red' : '',
                        }"
                    >
                        <span
                            style=" float: left; width: 5px; height: 5px; margin-top: 7px; margin-right: 3px; background: #1890ff; border-radius: 50%;"
                            :style="{
                                background: orderStatus === 'noPass' ? 'red' : '#1890FF',
                            }"
                        />{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : '未录入' }}
                    </div>
                </el-col>
            </el-row>
            <el-row style=" position: absolute; right: 20px; bottom: 10px; text-align: right;" class="buttonCss">
                <template style="float: right; margin-left: 10px;">
                    <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('ste:semiMaterial:mySaveOrUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                </template>
                <template v-if="isRedact" style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('ste:semiMaterial:mySaveOrUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('ste:semiMaterial:submit')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </el-row>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    原汁领用
                </span>
                <el-table headerRowClassName="tableHead" :data="MaterialDate" :rowClassName="RowDelFlag" border tooltipEffect="dark">
                    <el-table-column type="index" width="55" label="序号" />
                    <el-table-column label="领用物料" :showOverflowTooltip="true">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="单位" width="50" prop="unit" />
                    <el-table-column label="计划领料" width="90" prop="planAmount" />
                    <el-table-column label="操作" width="70">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" disabled @click="addData(scope.row, scope.$index)">
                                <i class="icons iconfont factory-chaifen" />拆分
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column width="130">
                        <template slot="header">
                            <i class="reqI">*</i><span>罐号</span>
                        </template>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.holderId" placeholder="请选择" filterable size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @change="setBatch(scope.row)">
                                <el-option v-for="(sole, index) in PotList" :key="index" :value="sole.holderId" :label="sole.holderName" />
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column width="200" label="罐内物料" showOverflowTooltip>
                        <template slot-scope="scope">
                            <i v-if="scope.row.holderMaterialCode !== null">{{ scope.row.holderMaterialCode + ' ' + scope.row.holderMaterialName }}</i>
                        </template>
                    </el-table-column>
                    <el-table-column width="130">
                        <template slot="header">
                            <i class="reqI">*</i><span>批次</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.batch" :disabled="!scope.row.isB" size="small" maxlength="10" />
                        </template>
                    </el-table-column>
                    <el-table-column width="130">
                        <template slot="header">
                            <i class="reqI">*</i><span>实际领料</span>
                        </template>
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.receiveAmount" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" placeholder="手工录入" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" width="110">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" placeholder="手工录入" size="small" />
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="70">
                        <template slot-scope="scope">
                            <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!(isRedact && scope.row.status !== 'submit' && scope.row.status !== 'checked')" @click="delRow(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <auditLog :tableData="DataAudit" />
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    异常记录
                </span>
                <exc-record ref="excrecord" :isRedact="isRedact" :order="formHeader" />
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label" class="spanview">
                    文本记录
                </span>
                <text-record ref="textrecord" :isRedact="isRedact" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
import { STERILIZED_API } from '@/api/api';
import { Stesave } from '@/net/validate';
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
            isRedact: false,
            formHeader: {},
            activeName: '1',
            orderStatus: '',
            PotList: [],
            DataAudit: [],
            MaterialDate: [],
            MaterialDate1: []
        };
    },
    computed: {},
    mounted() {
        this.GetOrderHead();
    },
    methods: {
        // 半成品领用list
        GetDataList() {
            this.$http(`${STERILIZED_API.STE_ENTER_MATERIAL_LIST_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.seiOrderId,
                factory: this.$store.state.common.sterilized.seiFactory,
                orderNo: this.$store.state.common.sterilized.seiOrderNo,
                materialCode: this.formHeader.materialCode
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.MaterialDate = data.list;
                    this.MaterialDate1 = JSON.parse(JSON.stringify(data.list));
                    this.DataAudit = data.vList;
                    this.MaterialDate.forEach(item => {
                        if (this.PotList.filter(it => item.holderId === it.holderId).length) {
                            //
                        } else {
                            this.PotList.push({
                                type: '1',
                                amount: item.receiveAmount,
                                holderId: item.holderId,
                                holderName: item.holderName,
                                batch: item.batch,
                                materialCode: '',
                                materialName: ''
                            });
                        }
                    });
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 拆分
        addData(row, index) {
            this.MaterialDate.splice(index + 1, 0, {
                delFlag: '0',
                holderId: '',
                id: '',
                indexNum: '',
                isSplit: '0',
                materialCode: row.materialCode,
                materialName: row.materialName,
                orderId: row.orderId,
                planAmount: row.planAmount,
                receiveAmount: null,
                remark: '',
                status: '',
                unit: row.unit,
                holderMaterialCode: '',
                holderMaterialName: ''
            });
        },
        /* eslint-disable @typescript-eslint/camelcase */
        GetPot() {
            this.$http(`${STERILIZED_API.STE_ENTER_MATERIAL_POT_LIST_API}`, 'POST', {
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.PotList = data.halfList;
                } else {
                    this.$error_SHINHO(data.msg);
                }
                if (this.formHeader.status !== '') {
                    this.GetDataList();
                    this.$refs.excrecord.GetExcDate({
                        order_id: this.formHeader.orderId,
                        sign: 'Semi'
                    });
                    this.$refs.textrecord.GetText({
                        order_id: this.formHeader.orderId,
                        sign: 'Semi'
                    });
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        setBatch(row) {
            const PotSole = this.PotList.find(item => item.holderId === row.holderId);
            if (PotSole.holderType !== '016' && PotSole.holderType !== '017' && PotSole.holderType !== '018') {
                row.isB = 0;
                if (PotSole.materialCode !== row.materialCode && PotSole.materialCode !== '') {
                    this.$warningTost('领用物料与BOM物料不一致，请确认！');
                }
            } else if (PotSole.holderType === '016' || PotSole.holderType === '017' || PotSole.holderType === '018') {
                row.isB = 1;
            } else {
                row.isB = 0;
            }
            row.holderMaterialCode = PotSole.materialCode;
            row.holderMaterialName = PotSole.materialName;
            row.holderType = PotSole.holderType;
            row.batch = this.PotList.filter(items => items.holderId === row.holderId)[0].batch;
            row.holderName = this.PotList.filter(items => items.holderId === row.holderId)[0].holderName;
            // row.receiveAmount = this.PotList.filter(items => items.holderId === row.holderId)[0].amount
        },
        delRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.MaterialDate.filter(item => item.delFlag === '0' && item.materialCode === row.materialCode).length === 1) {
                    this.$warningTost('最后一条了哦，不能再删了');
                } else {
                    row.delFlag = '1';
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
        // 保存提交
        UpdateMaterial(str, resolve, reject) {
            this.MaterialDate.forEach(item => {
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
            this.$http(`${str === 'saved' ? STERILIZED_API.STE_ENTER_MATERIAL_UPDATE_API : STERILIZED_API.STE_ENTER_MATERIAL_SUBMIT_API}`, 'POST', this.MaterialDate).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('原料领用' + data.msg);
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
            });
        },
        savedOrSubmitForm(str) {
            for (const sole of this.MaterialDate) {
                if (sole.holderType !== '' && sole.materialCode !== sole.holderMaterialCode && sole.holderMaterialCode !== '' && sole.holderMaterialCode !== null) {
                    this.$warningTost('领用物料与BOM物料不一致，请确认！');
                    return false;
                }
            }
            if (str === 'submit') {
                if (!this.dataRul()) {
                    return;
                }
            }
            for (const item of this.MaterialDate) {
                if (/原汁/g.test(item.holderName)) {
                    if (item.id) {
                        if (this.PotList.filter(it => item.holderId === it.holderId)[0].type === '1') {
                            if (this.PotList.filter(it => item.holderId === it.holderId)[0].amount < item.receiveAmount) {
                                this.$warningTost(`${item.holderName}库存不足,请调整`);
                                return false;
                            }
                        } else if (this.MaterialDate1.filter(it => it.holderId === item.holderId).length) {
                                console.log(Number(this.PotList.filter(it => item.holderId === it.holderId)[0].amount) + Number(this.MaterialDate1.filter(it => it.holderId === item.holderId)[0].receiveAmount));
                                if (Number(this.PotList.filter(it => item.holderId === it.holderId)[0].amount) + Number(this.MaterialDate1.filter(it => it.holderId === item.holderId)[0].receiveAmount) < item.receiveAmount) {
                                    this.$warningTost(`${item.holderName}库存不足,请调整`);
                                    return false;
                                }
                            } else if (this.PotList.filter(it => item.holderId === it.holderId)[0].amount < item.receiveAmount) {
                                    this.$warningTost(`${item.holderName}库存不足,请调整`);
                                    return false;
                                }
                    } else if (this.PotList.filter(it => item.holderId === it.holderId)[0].amount < item.receiveAmount) {
                            this.$warningTost(`${item.holderName}库存不足,请调整`);
                            return false;
                        }
                }
            }
            const net1 = new Promise((resolve, reject) => {
                this.Stesave.excUpdate(this, 'Semi', resolve, reject);
            });
            const net2 = new Promise((resolve, reject) => {
                this.Stesave.textUpdate(this, 'Semi', resolve, reject);
            });
            const net3 = new Promise((resolve, reject) => {
                this.UpdateMaterial(str, resolve, reject);
            });
            if (str === 'submit') {
                const submitNet = Promise.all([net1, net2, net3]);
                submitNet
                    .then(() => {
                        const net0 = new Promise((resolve, reject) => {
                            this.Stesave.orderUpdate(this, 'semiStatus', str, resolve, reject);
                        });
                        net0.then(() => {
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.GetOrderHead();
                        }).catch(err => {
                            this.$notify.error({ title: '错误', message: err });
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
                            this.Stesave.orderUpdate(this, 'semiStatus', str, resolve, reject);
                        });
                        net0.then(() => {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            this.GetOrderHead();
                        }).catch(err => {
                            this.$notify.error({ title: '错误', message: err });
                        });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            }
        },
        // 验证
        dataRul() {
            let ty = true;
            this.MaterialDate.forEach(item => {
                if (!item.isT) {
                    if (!item.holderId && /原汁/.test(item.materialName)) {
                        ty = false;
                        this.$warningTost('罐号未填');
                        return false;
                    }
                }
                if (!item.batch) {
                    ty = false;
                    this.$warningTost('批次未填');
                    return false;
                }
                if (!item.receiveAmount) {
                    ty = false;
                    this.$warningTost('实际领料未填');
                    return false;
                }
            });
            return ty;
        },
        // 获取订单表头
        GetOrderHead() {
            this.$http(`${STERILIZED_API.STE_ORDER_HEAD_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.seiOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.isRedact = false;
                    this.formHeader = data.list[0];
                    this.orderStatus = data.list[0].semiStatus;
                    this.GetPot();
                    this.Stesave = new Stesave(this.formHeader);
                    this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        }
    }
};
</script>

<style scoped></style>
