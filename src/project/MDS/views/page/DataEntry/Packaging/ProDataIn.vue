<template>
    <el-col>
        <div class="header_main">
            <el-card class="searchCard newCard" style="margin: 0;">
                <el-row type="flex">
                    <el-col>
                        <form-header ref="formheader" :form-header="formHeader" :is-redact="isRedact" :pro="true" />
                    </el-col>
                    <el-col :span="8" style="font-size: 14px; line-height: 32px;">
                        <div style=" float: right; overflow: hidden; text-align: left;">
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
                        <div style="clear: both;" />
                        <div style="width: 100%; margin-top: 50px; text-align: right;">
                            <template style="float: right; margin-bottom: 13px;">
                                <el-button
                                    type="primary"
                                    size="small"
                                    @click="
                                        $router.push({
                                            path: '/DataEntry-Packaging-index',
                                        })
                                    "
                                >
                                    返回
                                </el-button>
                                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('pkg:order:update')" type="primary" size="small" @click="isRedact = !isRedact">
                                    {{ isRedact ? '取消' : '编辑' }}
                                </el-button>
                            </template>
                            <template v-if="isRedact" style="float: right;">
                                <el-button type="primary" size="small" @click="savedOrSubmitForm('saved')">
                                    保存
                                </el-button>
                                <el-button type="primary" size="small" @click="Submitdialog">
                                    提交
                                </el-button>
                            </template>
                        </div>
                    </el-col>
                </el-row>
                <div class="toggleSearchBottom">
                    <i class="el-icon-caret-top" />
                </div>
            </el-card>
        </div>
        <div class="main">
            <el-card class="tableCard">
                <div class="toggleSearchTop">
                    <i class="el-icon-caret-bottom" />
                </div>
                <el-tabs id="pkg" v-model="activeName">
                    <el-tab-pane name="1">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="readyState === 'noPass' ? '不通过' : readyState === 'saved' ? '已保存' : readyState === 'submit' ? '已提交' : readyState === 'checked' ? '通过' : '未录入'" placement="top-start">
                                <el-button
                                    :style="{
                                        color: readyState === 'noPass' ? 'red' : '',
                                    }"
                                >准备时间</el-button>
                            </el-tooltip>
                        </span>
                        <ready-times ref="readytimes" :is-redact="isRedact" :order="formHeader" @GetReadyStatus="GetReadyStatus" />
                    </el-tab-pane>
                    <el-tab-pane name="2">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="readyState === 'noPass' ? '不通过' : readyState === 'saved' ? '已保存' : readyState === 'submit' ? '已提交' : readyState === 'checked' ? '通过' : '未录入'" placement="top-start">
                                <el-button
                                    :style="{
                                        color: readyState === 'noPass' ? 'red' : '',
                                    }"
                                >人员</el-button>
                            </el-tooltip>
                        </span>
                        <worker ref="workerref" :is-redact="isRedact" :order="formHeader" />
                    </el-tab-pane>
                    <el-tab-pane name="3">
                        <span slot="label" class="spanview">
                            <el-button>异常记录</el-button>
                        </span>
                        <exc-record ref="excrecord" :is-redact="isRedact" :order="formHeader" />
                    </el-tab-pane>
                    <el-tab-pane name="4">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="instorageState === 'noPass' ? '不通过' : instorageState === 'saved' ? '已保存' : instorageState === 'submit' ? '已提交' : instorageState === 'checked' ? '通过' : '未录入'" placement="top-start">
                                <el-button
                                    :style="{
                                        color: instorageState === 'noPass' ? 'red' : '',
                                    }"
                                >生产入库</el-button>
                            </el-tooltip>
                        </span>
                        <in-storage ref="instorage" :is-redact="isRedact" :order="formHeader" :ratio="ratio" @GetinstorageState="GetinstorageState" />
                    </el-tab-pane>
                    <el-tab-pane name="5">
                        <span slot="label" class="spanview">
                            <el-tooltip class="item" effect="dark" :content="listbomStatus === 'noPass' ? '不通过' : listbomStatus === 'saved' ? '已保存' : listbomStatus === 'submit' ? '已提交' : listbomStatus === 'checked' ? '通过' : '未录入'" placement="top-start">
                                <el-button
                                    :style="{
                                        color: listbomStatus === 'noPass' ? 'red' : '',
                                    }"
                                >物料领用</el-button>
                            </el-tooltip>
                        </span>
                        <list-bom ref="listbom" :is-redact="isRedact" :order="formHeader" @GetlistbomStatus="GetlistbomStatus" />
                    </el-tab-pane>
                    <el-tab-pane v-if="formHeader.properties !== '二合一&礼盒产线'" name="6">
                        <span slot="label" class="spanview">
                            <el-button>待杀菌数量</el-button>
                        </span>
                        <germs ref="germs" :is-redact="isRedact" />
                    </el-tab-pane>
                    <el-tab-pane name="7">
                        <span slot="label" class="spanview">
                            <el-button>文本记录</el-button>
                        </span>
                        <text-record ref="textrecord" :is-redact="isRedact" />
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
        <el-dialog width="400px" title="分批提交" :close-on-click-modal="false" :visible.sync="visible">
            <p style="margin-bottom: 20px; font-size: 18px;">
                本次提交是否提交全部数据
            </p>
            <el-radio v-model="submitRadio" label="1" style="font-size: 18px;">
                紧急提交
            </el-radio>
            <el-radio v-model="submitRadio" label="2">
                正常提交
            </el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button type="primary" @click="SubmitForm()">确定</el-button>
            </span>
        </el-dialog>
    </el-col>
</template>

<script>
import { PACKAGING_API } from '@/api/api';
import { headanimation } from '@/net/validate';
import FormHeader from '@/views/components/FormHeader';
import ReadyTimes from './common/readyTimes';
import Worker from '@/views/components/Worker';
import ExcRecord from '@/views/components/ExcRecord';
import InStorage from './common/inStorage';
import ListBom from './common/listBom';
import Germs from './common/Germs';
import TextRecord from '@/views/components/TextRecord';
export default {
    name: 'ProDataIn',
    components: {
        FormHeader,
        ReadyTimes,
        Worker,
        ExcRecord,
        InStorage,
        ListBom,
        Germs,
        TextRecord
    },
    data() {
        return {
            lodingS: false,
            isRedact: false,
            orderStatus: '',
            factory: '',
            orderNo: '',
            productDate: '',
            workShop: '',
            formHeader: {
                productDate: ''
            },
            readyState: '',
            instorageState: '',
            listbomStatus: '',
            ratio: {
                basicUnit: '',
                productUnit: '',
                productUnitName: '',
                basicUnitName: '',
                ratio: null
            },
            activeName: '1',
            visible: false,
            submitRadio: '2'
        };
    },
    computed: {
        PkgworkShop: {
            get() {
                return this.$store.state.common.PkgworkShop;
            },
            set(val) {
                this.$store.commit('common/updateWorkShop', val);
            }
        },
        PkgproductDate: {
            get() {
                return this.$store.state.common.PkgproductDate;
            },
            set(val) {
                this.$store.commit('common/updateProductDate', val);
            }
        },
        PkgorderNo: {
            get() {
                return this.$store.state.common.PkgorderNo;
            },
            set(val) {
                this.$store.commit('common/updateOrderNo', val);
            }
        },
        Pkgfactoryid: {
            get() {
                return this.$store.state.common.Pkgfactoryid;
            },
            set(val) {
                this.$store.commit('common/updateFactoryid', val);
            }
        }
    },
    mounted() {
        headanimation(this.$);
        this.factory = this.Pkgfactoryid;
        this.orderNo = this.PkgorderNo;
        this.productDate = this.PkgproductDate;
        this.workShop = this.PkgworkShop;
        this.GetOrderList();
    },
    methods: {
        // 获取比例
        GetRatio() {
            this.$http(`${PACKAGING_API.PKGBILI_API}`, 'POST', {
                materialCode: this.formHeader.materialCode,
                factory: this.formHeader.factory
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.sme) {
                        this.ratio.ratio = data.sme.ratio;
                        this.ratio.basicUnit = data.sme.basicUnit;
                        this.ratio.productUnit = data.sme.productUnit;
                        this.ratio.productUnitName = data.sme.productUnitName;
                        this.ratio.basicUnitName = data.sme.basicUnitName;
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '比例获取失败'
                        });
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取表头
        GetOrderList() {
            this.$http(
                `${PACKAGING_API.PKGORDELIST_API}`,
                'POST',
                {
                    factory: this.factory,
                    workShop: this.workShop,
                    productDate: this.productDate,
                    orderNo: this.orderNo
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.formHeader = data.list[0];
                this.orderStatus = data.list[0].orderStatus;
                this.GetRatio();
                this.$refs.listbom.GetPot(this.formHeader.factory, this.formHeader.orderNo);
                this.$refs.formheader.getLin(this.formHeader.workShop);
                this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                this.$refs.excrecord.getDataList(this.formHeader.factory);
                // this.$refs.excrecord.GetProductShift(this.formHeader.factory)
                this.$refs.workerref.GetTeam(false, this.formHeader.factory);
                this.$refs.workerref.getTree(this.formHeader.factory);
                this.$refs.workerref.GetProductShift(this.formHeader.factory);
                this.$refs.instorage.GetProductShift(this.formHeader.factory);
                if (this.formHeader.properties !== '二合一&礼盒产线') {
                    this.$refs.germs.GetProductShift(this.formHeader.factory);
                }
                if (this.orderStatus !== '已同步') {
                    this.$refs.readytimes.Getpkgready(this.formHeader.orderId);
                    this.$refs.workerref.GetUserList(this.formHeader.orderId);
                    this.$refs.excrecord.GetExcDate(this.formHeader.orderId);
                    this.$refs.instorage.Getpkgin(this.formHeader);
                    this.$refs.listbom.GetpkgSap(this.formHeader);
                    if (this.formHeader.properties !== '二合一&礼盒产线') {
                        this.$refs.germs.GetpkgGerms(this.formHeader.orderId);
                    }
                    this.$refs.textrecord.GetText(this.formHeader.orderId);
                } else {
                    this.$refs.listbom.GetpkgSap(this.formHeader, data);
                }
            });
        },
        // 修改表头
        UpdateformHeader(str, resolve, reject) {
            this.formHeader.orderStatus = str;
            this.formHeader.realOutput = this.$refs.instorage.countOutputNum / this.ratio.ratio;
            this.formHeader.countOutputUnit = this.ratio.basicUnit; // 生产入库单位
            this.formHeader.countOutput = this.$refs.instorage.countOutputNum;
            this.formHeader.countMan = this.$refs.workerref.countMan;
            this.formHeader.expAllDate = this.$refs.excrecord.ExcNum;
            this.formHeader.germs = this.$refs.excrecord.GermsNum;
            if (str !== 'saved') {
                this.formHeader.operator = `${this.realName}(${this.userName})`;
                this.formHeader.operDate = new Date().getFullYear().Toastring() + '-' + (new Date().getMonth() + 1).Toastring() + '-' + new Date().getDay().Toastring();
            }
            this.$http(`${PACKAGING_API.PKGORDERUPDATE_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.PkgproductDate = this.formHeader.productDate.replace(/-/g, '');
                    this.productDate = this.formHeader.productDate.replace(/-/g, '');
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    if (reject) {
                        reject('保存表头' + data.msg);
                    }
                    this.$notify.error({
                        title: '错误',
                        message: '保存表头' + data.msg
                    });
                }
            });
        },
        // 保存 or 提交
        Submitdialog() {
            this.visible = true;
        },
        SubmitForm() {
            if (!this.$refs.instorage.inrul()) {
                return false;
            }
            if (this.submitRadio === '2') {
                this.formHeader.isUrgent = '0';
                this.savedOrSubmitForm('submit');
            } else if (this.submitRadio === '1') {
                this.$refs.listbom.ListbomsRule('saved');
                this.formHeader.isUrgent = '1';
                const net0 = new Promise((resolve, reject) => {
                    this.UpdateformHeader('saved', resolve, reject);
                });
                const net1 = new Promise((resolve, reject) => {
                    this.$refs.instorage.submitIn(this.formHeader.orderId, 'submit', resolve, reject);
                });
                const SubmitNet = Promise.all([net0, net1]);
                SubmitNet.then(() => {
                    this.isRedact = false;
                    this.visible = false;
                    this.GetOrderList();
                    this.$notify({
                        title: '成功',
                        message: '提交成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$errorToast('网络请求失败，请刷新重试');
                    this.isRedact = false;
                    this.visible = false;
                });
            }
        },
        savedOrSubmitForm(str) {
            if (str === 'submit') {
                if (!this.$refs.readytimes.readyrul()) {
                    return false;
                }
                if (!this.$refs.workerref.userrul()) {
                    return false;
                }
                if (!this.$refs.excrecord.excrul()) {
                    return false;
                }
                if (!this.$refs.instorage.inrul()) {
                    return false;
                }
                if (!this.$refs.listbom.saprul(str)) {
                    return false;
                }
                if (this.formHeader.factoryCode !== '6010') {
                    if (!this.$refs.listbom.bomRule(str)) {
                        return false;
                    }
                }
                if (!this.$refs.listbom.ListbomsRule(str)) {
                    return false;
                }
            } else if (str === 'saved') {
                if (this.formHeader.factoryCode !== '6010') {
                    if (!this.$refs.listbom.bomRule(str)) {
                        return false;
                    }
                }
                if (!this.$refs.listbom.ListbomsRule(str)) {
                    return false;
                }
            }
            this.lodingS = true;
            const net0 = new Promise((resolve, reject) => {
                this.UpdateformHeader(str, resolve, reject);
            });
            const net1 = new Promise((resolve, reject) => {
                this.$refs.readytimes.UpdateReady(this.formHeader.orderId, str, resolve, reject);
            });
            const net2 = new Promise((resolve, reject) => {
                this.$refs.workerref.UpdateUser(str, resolve, reject);
            });
            const net3 = new Promise((resolve, reject) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve, reject);
            });
            const net5 = new Promise((resolve, reject) => {
                this.$refs.listbom.UpdateSap(str, resolve, reject);
            });
            let net6;
            if (this.formHeader.properties !== '二合一&礼盒产线') {
                net6 = new Promise((resolve, reject) => {
                    this.$refs.germs.UpdateGerms(this.formHeader.orderId, str, resolve, reject);
                });
            }
            const net7 = new Promise((resolve, reject) => {
                this.$refs.textrecord.UpdateText(this.formHeader, str, resolve, reject);
            });
            if (str === 'submit') {
                let net11;
                if (this.formHeader.properties !== '二合一&礼盒产线') {
                    net11 = Promise.all([net0, net1, net2, net3, net5, net6, net7]);
                } else {
                    net11 = Promise.all([net0, net1, net2, net3, net5, net7]);
                }
                net11
                    .then(() => {
                        const net8 = new Promise((resolve, reject) => {
                            this.ProHours(resolve, reject);
                        });
                        const net9 = new Promise((resolve, reject) => {
                            this.$refs.instorage.submitIn(this.formHeader.orderId, str, resolve, reject);
                        });
                        const net10 = new Promise((resolve, reject) => {
                            this.$refs.listbom.subSap(resolve, reject);
                        });
                        const net12 = Promise.all([net8, net9, net10]);
                        net12
                            .then(() => {
                                this.isRedact = false;
                                this.visible = false;
                                this.GetOrderList();
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                            })
                            .catch(() => {
                                this.$errorToast('网络请求失败，请刷新重试');
                                this.isRedact = false;
                                this.visible = false;
                            });
                    })
                    .catch(() => {
                        this.$errorToast('网络请求失败，请刷新重试');
                        this.isRedact = false;
                        this.visible = false;
                    });
            } else {
                let net11;
                const net4 = new Promise((resolve, reject) => {
                    this.$refs.instorage.UpdateIn(this.formHeader.orderId, str, resolve, reject);
                });
                if (this.formHeader.properties !== '二合一&礼盒产线') {
                    net11 = Promise.all([net0, net1, net2, net3, net4, net5, net6, net7]);
                } else {
                    net11 = Promise.all([net0, net1, net2, net3, net4, net5, net7]);
                }
                net11
                    .then(() => {
                        this.isRedact = false;
                        this.GetOrderList();
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.visible = false;
                    })
                    .catch(() => {
                        this.$errorToast('网络请求失败，请刷新重试');
                        this.isRedact = false;
                        this.visible = false;
                    });
            }
        },
        // 报工提交
        ProHours(resolve) {
            if (this.$refs.readytimes.readyDate.isCause === '1') {
                this.$refs.readytimes.readyDate.dayDinner = (this.$refs.readytimes.readyDate.dayDinner === null ? null : String(this.$refs.readytimes.readyDate.dayDinner));
                this.$refs.readytimes.readyDate.midDinner = (this.$refs.readytimes.readyDate.midDinner === null ? null : String(this.$refs.readytimes.readyDate.midDinner));
                this.$refs.readytimes.readyDate.nightDinner = (this.$refs.readytimes.readyDate.nightDinner === null ? null : String(this.$refs.readytimes.readyDate.nightDinner));
            } else {
                this.$refs.readytimes.readyDate.dayDinner = String(this.$refs.readytimes.readyDate.dayDinner);
            }
            const paras = [
                this.$refs.readytimes.readyDate,
                { countMan: this.$refs.workerref.countMan.Toastring() },
                this.$refs.workerref.WorkerDate,
                this.$refs.excrecord.ExcDate,
                {
                    orderId: this.formHeader.orderId,
                    outputUnit: this.formHeader.outputUnit,
                    realOutput: String(this.formHeader.realOutput),
                    countOutput: this.$refs.instorage.countOutputNum.Toastring(),
                    countOutputUnit: this.ratio.basicUnit,
                    productDate: this.formHeader.productDate
                }
            ];
            this.$http(`${PACKAGING_API.PKGSAVEFORM_API}`, 'POST', paras).then(({ data }) => {
                if (data.code !== 0) {
                    this.$errorToast(data.msg);
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        // 准备时间状态
        GetReadyStatus(status) {
            this.readyState = status;
        },
        // 入库状态
        GetinstorageState(status) {
            this.instorageState = status;
        },
        // 物料状态
        GetlistbomStatus(status) {
            this.listbomStatus = status;
        }
    }
};
</script>

<style scoped></style>
