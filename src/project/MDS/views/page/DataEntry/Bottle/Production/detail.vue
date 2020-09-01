<template>
    <div class="header_main">
        <el-card class="searchCard queryHead" style="margin-bottom: 5px;">
            <el-row type="flex">
                <el-col>
                    <form-head :form-header="formHeader" :is-redact="isRedact" />
                </el-col>
                <el-col style=" position: relative; width: 244px;" class="clearfix">
                    <el-row class="clearfix">
                        <div style="float: right; font-size: 14px; line-height: 31px;">
                            <span
                                class="point"
                                :style="{
                                    background: orderStatus === 'noPass' ? 'red' : orderStatus === 'saved' ? '#1890f' : orderStatus === 'submit' ? '#1890ff' : orderStatus === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)',
                                }"
                            />订单状态：
                            <span
                                :style="{
                                    color: orderStatus === 'noPass' ? 'red' : '',
                                }"
                            >{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : orderStatus }}</span>
                        </div>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" @tab-click="tabClick">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="readyState === 'noPass' ? '不通过' : readyState === 'saved' ? '已保存' : readyState === 'submit' ? '已提交' : readyState === 'checked' ? '通过' : '未录入'" placement="top-start">
                        <em
                            :style="{
                                color: readyState === 'noPass' ? 'red' : '',
                            }"
                        >准备时间</em>
                    </el-tooltip>
                </span>
                <ready-times ref="readytimes" :is-redact="isRedact" :form-header="formHeader" :product-shift="productShift" @SetReadyStatus="SetReadyStatus" />
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="readyState === 'noPass' ? '不通过' : readyState === 'saved' ? '已保存' : readyState === 'submit' ? '已提交' : readyState === 'checked' ? '通过' : '未录入'" placement="top-start">
                        <em
                            :style="{
                                color: readyState === 'noPass' ? 'red' : '',
                            }"
                        >人员</em>
                    </el-tooltip>
                </span>
                <worker ref="workerref" :is-redact="isRedact" :order="formHeader" :attendance="Attendance" :att="true" />
            </el-tab-pane>
            <el-tab-pane name="3">
                <span slot="label" class="spanview">投胚记录</span>
                <record ref="record" :is-redact="isRedact" :supplier="Supplier" />
            </el-tab-pane>
            <el-tab-pane name="4">
                <span slot="label" class="spanview">异常记录</span>
                <exc-record ref="excrecord" :is-redact="isRedact" :order="formHeader" />
            </el-tab-pane>
            <el-tab-pane name="5">
                <span slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="inStorageState === 'noPass' ? '不通过' : inStorageState === 'saved' ? '已保存' : inStorageState === 'submit' ? '已提交' : inStorageState === 'checked' ? '通过' : '未录入'" placement="top-start">
                        <em
                            :style="{
                                color: inStorageState === 'noPass' ? 'red' : '',
                            }"
                        >生产入库</em>
                    </el-tooltip>
                </span>
                <in-storage ref="instorage" :is-redact="isRedact" :product-shift="productShift" @setInStorageState="setInStorageState" @SetMeaterielNum="SetMeaterielNum" />
            </el-tab-pane>
            <el-tab-pane name="6">
                <span slot="label" class="spanview">
                    <el-tooltip class="item" effect="dark" :content="applyMaterielState === 'noPass' ? '不通过' : applyMaterielState === 'saved' ? '已保存' : applyMaterielState === 'submit' ? '已提交' : applyMaterielState === 'checked' ? '通过' : '未录入'" placement="top-start">
                        <em
                            :style="{
                                color: applyMaterielState === 'noPass' ? 'red' : '',
                            }"
                        >物料领用</em>
                    </el-tooltip>
                </span>
                <material ref="material" :is-redact="isRedact" :supplier="Supplier" @SetMeaterielNum="SetMeaterielNum" @setApplyMaterielState="setApplyMaterielState" />
            </el-tab-pane>
            <el-tab-pane name="7">
                <span slot="label" class="spanview">文本记录</span>
                <text-record ref="textrecord" :is-redact="isRedact" />
            </el-tab-pane>
        </el-tabs>
        <redact-box>
            <template slot="button">
                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('bottle:inStorage:mySaveOrUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact">
                    <el-button v-if="isAuth('bottle:inStorage:mySaveOrUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('bottle:inStorage:submit')" type="primary" size="small" @click="SubmitForm">
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
import Worker from '@/views/components/Worker';
import ReadyTimes from './ReadyTimes';
import Record from './Record';
import Material from './Material';
import InStorage from './InStorage';
import { BOTTLE_API, SYSTEMSETUP_API } from '@/api/api';
export default {
    name: 'Detail',
    components: {
        ReadyTimes,
        Worker,
        Record,
        InStorage,
        Material,
        ExcRecord,
        TextRecord,
        FormHead: resolve => {
            require(['./formHead'], resolve);
        }
    },
    data() {
        return {
            isRedact: false,
            orderStatus: '',
            activeName: '1',
            formHeader: {},
            readyState: '',
            inStorageState: '',
            applyMaterielState: '',
            Supplier: [],
            productShift: [],
            Attendance: []
        };
    },
    computed: {},
    mounted() {
        this.getHead();
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        // 准备时间状态
        SetReadyStatus(status) {
            this.readyState = status;
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        // 入库状态
        setInStorageState(status) {
            this.inStorageState = status;
            // 强制刷新tabs
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        // 物料状态
        setApplyMaterielState(status) {
            this.applyMaterielState = status;
            // 强制刷新tabs
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        SetMeaterielNum(num) {
            // this.$refs.outtech.GetsaltWaterUsed(num)
            // this.$refs.material.setNum(num)
            this.$refs.instorage.setNum(num);
        },
        // 获取表头
        getHead() {
            this.isRedact = false;
            this.$http(`${BOTTLE_API.BOTTLE_PRO_HEAD}`, 'POST', {
                orderId: this.$store.state.common.bottle.ProOrderId,
                type: 'production'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formHeader = data.headInfo;
                    this.orderStatus = data.headInfo.orderStatus;
                    this.GetSupplier(this.formHeader.factory); // 供应商
                    this.GetProductShift(this.formHeader.factory); // 生产班次
                    this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory);
                    this.$refs.workerref.getTree(this.formHeader.factory);
                    this.$refs.workerref.GetProductShift(this.formHeader.factory);
                    this.$refs.workerref.GetMaterails(this.formHeader.productLine, this.formHeader.productDate);
                    if (this.formHeader.orderStatus) {
                        this.$refs.readytimes.getDataList();
                        this.$refs.record.getDataList();
                        this.$refs.instorage.getDataList();
                        this.$refs.material.getDataList(this.formHeader);
                        this.GetUser();
                        this.$refs.excrecord.GetExcDate(this.formHeader.orderId);
                        this.$refs.textrecord.GetText(this.formHeader.orderId);
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取人员
        GetUser() {
            this.$http(`${BOTTLE_API.BOTTLE_PRO_USER_LIST}`, 'POST', {
                orderId: this.$store.state.common.bottle.ProOrderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.$refs.workerref.GetTimeUserList(data.listuser, data.vrList);
                    this.Attendance = data.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 修改表头
        UpdateHead(str, resolve, reject) {
            if (this.formHeader.orderStatus) {
                if (this.formHeader.orderStatus === 'saved' || this.formHeader.orderStatus === '已同步') {
                    this.formHeader.orderStatus = str;
                } else if (this.formHeader.orderStatus === 'noPass' && str === 'submit') {
                    this.formHeader.orderStatus = str;
                }
            } else {
                this.formHeader.orderStatus = str;
            }
            this.formHeader.countOutput = this.$refs.instorage.sumNum;
            this.formHeader.countMan = this.$refs.workerref.countMan;
            this.formHeader.expAllDate = this.$refs.excrecord.ExcNum;
            this.formHeader.germs = this.$refs.excrecord.GermsNum;
            this.$http(`${BOTTLE_API.BOTTLE_PRO_HEAD_UPDATE}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('表头修改' + data.msg);
                    }
            });
        },
        // 保存提交
        SubmitForm() {
            if (!this.$refs.readytimes.dataRul()) {
                return false;
            }
            if (!this.$refs.workerref.userrul()) {
                return false;
            }
            if (!this.$refs.record.dataRul()) {
                return false;
            }
            if (!this.$refs.excrecord.excrul()) {
                return false;
            }
            if (!this.$refs.instorage.dataRul()) {
                return false;
            }
            if (!this.$refs.material.dataRul()) {
                return false;
            }
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
            const updateHead = new Promise((resolve, reject) => {
                this.UpdateHead(str, resolve, reject);
            });
            const updateReady = new Promise((resolve, reject) => {
                this.$refs.readytimes.UpdateReady(str, resolve, reject);
            });
            const updateDevice = new Promise((resolve, reject) => {
                this.$refs.readytimes.UpdateDevice(str, resolve, reject);
            });
            const updateRecord = new Promise((resolve, reject) => {
                this.$refs.record.SaveData(str, resolve, reject);
            });
            const updateIn = new Promise((resolve, reject) => {
                this.$refs.instorage.SaveOrSubmitData(str, resolve, reject);
            });
            const updateMaterial = new Promise((resolve, reject) => {
                this.$refs.material.SaveOrSubmitData(str, resolve, reject);
            });
            const updateUser = new Promise((resolve, reject) => {
                this.$refs.workerref.BottleUpdateUser(str, resolve, reject);
            });
            const updateUserAtt = new Promise((resolve, reject) => {
                this.$refs.workerref.BottleUpdateAtt(str, resolve, reject);
            });
            const updateExc = new Promise((resolve, reject) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve, reject);
            });
            const updateText = new Promise((resolve, reject) => {
                this.$refs.textrecord.UpdateText(this.formHeader, str, resolve, reject);
            });
            if (str === 'saved') {
                const savedNet = Promise.all([updateHead, updateReady, updateDevice, updateRecord, updateIn, updateMaterial, updateUser, updateUserAtt, updateExc, updateText]);
                savedNet
                    .then(() => {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.getHead();
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            } else {
                const savedNet = Promise.all([updateReady, updateDevice, updateRecord]);
                savedNet
                    .then(() => {
                        const SubmitRecord = new Promise((resolve, reject) => {
                            this.$refs.record.SubmitData(str, resolve, reject);
                        });
                        const SubmitTime = new Promise((resolve, reject) => {
                            this.ProHours(resolve, reject);
                        });
                        const SubmitNet = Promise.all([updateHead, SubmitTime, SubmitRecord, updateIn, updateMaterial, updateUser, updateUserAtt, updateExc, updateText]);
                        SubmitNet.then(() => {
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.getHead();
                        }).catch(err => {
                            this.$notify.error({ title: '错误', message: err });
                        });
                    })
                    .catch(err => {
                        this.$notify.error({ title: '错误', message: err });
                    });
            }
        },
        // 工时提交
        ProHours(resolve, reject) {
            const paras = [
                this.$refs.readytimes.readyTimeDate,
                this.$refs.readytimes.dataList,
                this.$refs.workerref.WorkerDate,
                {
                    orderId: this.formHeader.orderId,
                    countOutput: String(this.$refs.instorage.sumNum),
                    countOutputUnit: 'EA',
                    productDate: this.formHeader.productDate
                }
            ];
            this.$http(`${BOTTLE_API.BOTTLE_PRO_READYTIME_SUBMIT}`, 'POST', paras).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$errorToast(data.msg);
                    if (reject) {
                        reject('工时提交' + data.msg);
                    }
                }
            });
        },
        // 获取生产班次
        GetProductShift(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: factory,
                type: 'product_shift'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.productShift = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取供应商
        GetSupplier(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', {
                factory: factory,
                type: 'supplier_bottle'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.Supplier = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        }
    }
};
</script>

<style scoped></style>
