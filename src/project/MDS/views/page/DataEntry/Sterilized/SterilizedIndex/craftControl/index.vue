<template>
    <div class="header_main">
        <el-card class="searchCard" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <form-head :form-header="formHeader" />
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
                    <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('ste:tec:mySaveOrUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                </template>
                <template v-if="isRedact" style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('ste:tec:mySaveOrUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('ste:tec:mySaveOrUpdate')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </el-row>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs" type="border-card">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    工艺控制
                </span>
                <el-form ref="dataForm" :inline="true" size="small" :model="crafData" :rules="dataRule" class="topform">
                    <el-form-item label="原汁换热介质：" label-width="120px">
                        <el-checkbox-group v-model="crafData.hotMedium" :disabled="!isRedact" style="width: 170px;">
                            <el-checkbox label="热水" name="type" />
                            <el-checkbox label="酱油" name="type" />
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="热水温度：" label-width="110px">
                        <el-input v-model="crafData.hotTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px;" />
                    </el-form-item>
                    <el-form-item label="酱油温度：" label-width="80px">
                        <el-input v-model="crafData.sauceTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px;" />
                    </el-form-item>
                    <el-form-item label="原汁入锅温度：" prop="originalTemp" label-width="120px">
                        <el-input v-model="crafData.originalTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 170px;" />
                    </el-form-item>
                    <el-form-item label="升温开始时间：" prop="upStartTime">
                        <el-date-picker v-model="crafData.upStartTime" type="datetime" placeholder="选择日期" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" style="width: 180px;" />
                    </el-form-item>
                    <div style="padding: 8px 12px;">
                        <el-form-item label="冷却开始时间：" prop="coolingStartTime">
                            <el-date-picker v-model="crafData.coolingStartTime" type="datetime" placeholder="选择日期" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" style="width: 170px;" />
                        </el-form-item>
                        <el-form-item label="机械温度：" label-width="108px">
                            <el-input v-model="crafData.mechanicalTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item label="出料温度：" prop="dischargeTemp">
                            <el-input v-model="crafData.dischargeTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item label="冷却结束时间：" prop="coolingEndTime">
                            <el-date-picker v-model="crafData.coolingEndTime" type="datetime" placeholder="选择日期" :disabled="!isRedact" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" style="width: 170px;" />
                        </el-form-item>
                        <el-form-item label="数显温度：" label-width="108px">
                            <el-input v-model="crafData.displayTemp" :disabled="!isRedact" placeholder="手工录入" size="small" style="width: 180px;" />
                        </el-form-item>
                        <el-row>
                            <h3> <i class="iconfont factory-shezhi" />保温时间及屏显温度 </h3>
                            <el-button type="primary" size="small" style="float: right;" :disabled="!isRedact" @click="addresult()">
                                新增
                            </el-button>
                        </el-row>
                        <el-table header-row-class-name="tableHead" :data="crafData.result" :row-class-name="RowDelFlag" border tooltip-effect="dark">
                            <el-table-column width="55" label="序号" type="index" />
                            <el-table-column label="屏显温度(℃)">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.temp" :disabled="!isRedact" placeholder="手工录入" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="记录时间">
                                <template slot-scope="scope">
                                    <el-date-picker v-model="scope.row.logTime" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy.MM.dd HH:mm" size="small" placeholder="选择日期" :disabled="!isRedact" @change="changeDate(scope.row)" />
                                </template>
                            </el-table-column>
                            <el-table-column label="备注">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.remark" :disabled="!isRedact" placeholder="手工录入" size="small" />
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="small" :disabled="!isRedact" @click="dellist(scope.row)">
                                        删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-form>
                <audit-log :table-data="DataAudit" />
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
            crafData: {
                changed: '',
                changer: '',
                coolingEndTime: '',
                coolingStartTime: '',
                created: '',
                creator: '',
                delFlag: '0',
                dischargeTemp: '',
                displayTemp: '',
                hotMedium: ['热水'],
                hotTemp: '',
                id: '',
                mechanicalTemp: '',
                orderId: '',
                originalTemp: '',
                remark: '',
                sauceTemp: '',
                status: '',
                upStartTime: '',
                result: []
            },
            DataAudit: [],
            dataRule: {
                // hotMedium: [
                //   { required: true, message: '原汁换热介质不能为空', trigger: 'blur' }
                // ],
                originalTemp: [
                    {
                        required: true,
                        message: '原汁入锅温度不能为空',
                        trigger: 'blur'
                    }
                ],
                upStartTime: [
                    {
                        required: true,
                        message: '升温开始时间不能为空',
                        trigger: 'blur'
                    }
                ],
                dischargeTemp: [
                    {
                        required: true,
                        message: '出料温度不能为空',
                        trigger: 'blur'
                    }
                ],
                coolingStartTime: [
                    {
                        required: true,
                        message: '冷却开始时间不能为空',
                        trigger: 'blur'
                    }
                ],
                coolingEndTime: [
                    {
                        required: true,
                        message: '冷却结束时间不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {},
    mounted() {
        this.getOrderHead();
    },
    methods: {
        indexMethod(index) {
            return index * 2;
        },
        changeDate(row) {
            if (row.logTime === null) {
                row.logTime = '';
            }
        },
        // 获取工艺数据
        getCraft() {
            this.$http(`${STERILIZED_API.STE_ENTER_CRAF_LIST_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.craftOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.list) {
                        this.crafData = data.list;
                        this.DataAudit = data.vList;
                        if (this.crafData.result.length === 0) {
                            this.crafData.result.push({
                                changed: '',
                                changer: '',
                                created: '',
                                logTime: '',
                                creator: '',
                                delFlag: '0',
                                id: '',
                                remark: '',
                                serialNumber: '',
                                techId: '',
                                temp: ''
                            });
                        } else {
                            console.log(this.crafData.result)
                        }
                        this.crafData.hotMedium = this.crafData.hotMedium.split(',');
                    } else {
                        this.crafData.result.push({
                            changed: '',
                            changer: '',
                            created: '',
                            logTime: '',
                            creator: '',
                            delFlag: '0',
                            id: '',
                            remark: '',
                            serialNumber: '',
                            techId: '',
                            temp: ''
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 新增
        addresult() {
            const NewDataList = this.crafData.result.filter(item => {
                return item.delFlag === '0';
            });
            if (NewDataList.length === 0) {
                this.crafData.result.push({
                    changed: '',
                    changer: '',
                    created: '',
                    logTime: '',
                    creator: '',
                    delFlag: '0',
                    id: '',
                    remark: '',
                    serialNumber: '',
                    techId: '',
                    temp: ''
                });
            } else {
                const AddData = JSON.parse(JSON.stringify(NewDataList[NewDataList.length - 1]));
                AddData.id = '';
                this.crafData.result.push(AddData);
            }
        },
        // 删除
        dellist(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = '1';
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        //  RowDelFlag
        RowDelFlag({ row }) {
            if (row.delFlag === '1') {
                return 'rowDel';
            }
                return '';

        },
        // 修改工艺数据
        UpdateCraft(str, resolve, reject) {
            if (this.crafData.status) {
                if (this.crafData.status === 'saved') {
                    this.crafData.status = str;
                } else if (this.crafData.status === 'noPass' && str === 'submit') {
                    this.crafData.status = str;
                }
            } else {
                this.crafData.status = str;
            }
            this.crafData.orderId = this.formHeader.orderId;
            this.crafData.hotMedium = this.crafData.hotMedium.join(',');
            this.$http(`${STERILIZED_API.STE_ENTER_CRAF_UPDATE_API}`, 'POST', this.crafData).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('工艺保存' + data.msg);
                    }
            });
        },
        // 工艺提交
        SbumitCarft(str, resolve, reject) {
            this.$http(`${STERILIZED_API.STE_ENTER_CRAF_SUBMIT_API}`, 'POST', {
                orderId: this.formHeader.orderId,
                upStartTime: this.crafData.upStartTime,
                coolingEndTime: this.crafData.coolingEndTime
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('工艺保存' + data.msg);
                    }
            });
        },
        // 校验
        dataRul() {
            let ty = true;
            if (this.crafData.hotMedium.length > 0) {
                this.crafData.hotMedium.forEach(item => {
                    if (item === '酱油') {
                        if (!this.crafData.sauceTemp) {
                            ty = false;
                            this.$warningToast('酱油温度必填');
                        }
                    } else if (item === '热水') {
                        if (!this.crafData.hotTemp) {
                            ty = false;
                            this.$warningToast('热水温度必填');
                        }
                    }
                });
            }
            this.crafData.result.forEach(item => {
                if (!item.temp) {
                    ty = false;
                    this.$warningToast('屏显温度必填');
                }
                if (!item.logTime) {
                    ty = false;
                    this.$warningToast('记录时间必填');
                }
            });
            return ty;
        },
        // 保存提交
        SubmitForm() {
            if (!this.dataRul()) {
                return;
            }
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.savedOrSubmitForm('submit');
                    }).catch(() => {
                        // this.$infoToast('已取消删除');
                    });
                }
            });
        },
        savedOrSubmitForm(str) {
            if (str === 'submit') {
                if (!this.dataRul()) {
                    return;
                }
            }
            const net1 = new Promise((resolve, reject) => {
                this.Stesave.excUpdate(this, 'Craft', resolve, reject);
            });
            const net2 = new Promise((resolve, reject) => {
                this.Stesave.textUpdate(this, 'Craft', resolve, reject);
            });
            const net3 = new Promise((resolve, reject) => {
                this.UpdateCraft(str, resolve, reject);
            });
            if (str === 'submit') {
                const net4 = new Promise((resolve, reject) => {
                    this.SbumitCarft(str, resolve, reject);
                });
                const submitNet = Promise.all([net1, net2, net3, net4]);
                submitNet
                    .then(() => {
                        const net0 = new Promise((resolve, reject) => {
                            this.Stesave.orderUpdate(this, 'techStatus', str, resolve, reject);
                        });
                        net0.then(() => {
                            const net99 = new Promise((resolve, reject) => {
                                this.GetSubmit(str, resolve, reject);
                            });
                            net99.then(() => {
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.getOrderHead();
                            });
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
                            this.Stesave.orderUpdate(this, 'techStatus', str, resolve, reject);
                        });
                        net0.then(() => {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            this.getOrderHead();
                        }).catch(err => {
                            this.$notify.error({ title: '错误', message: err });
                        });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            }
        },
        GetSubmit(str, resolve, reject) {
            this.crafData.orderId = this.formHeader.orderId;
            this.$http(`${STERILIZED_API.CRAFTCONTROLSUBMIT}`, 'POST', this.crafData).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('工艺保存' + data.msg);
                    }
            });
        },
        /* eslint-disable @typescript-eslint/camelcase */
        // 获取订单表头
        getOrderHead() {
            this.$http(`${STERILIZED_API.STE_ORDER_HEAD_API}`, 'POST', {
                orderId: this.$store.state.common.sterilized.craftOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.isRedact = false;
                    this.formHeader = data.list[0];
                    this.orderStatus = this.formHeader.techStatus;
                    this.Stesave = new Stesave(this.formHeader);
                    this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    if (this.formHeader.status !== '') {
                        this.getCraft();
                        this.$refs.excrecord.GetExcDate({
                            order_id: this.formHeader.orderId,
                            sign: 'Craft'
                        });
                        this.$refs.textrecord.GetText({
                            order_id: this.formHeader.orderId,
                            sign: 'Craft'
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

<style scoped></style>
