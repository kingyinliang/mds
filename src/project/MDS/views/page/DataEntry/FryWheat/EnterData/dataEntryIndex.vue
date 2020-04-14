<template>
    <el-col>
        <data-entry
            ref="dataEntry"
            :redact-auth="'wht:order:update'"
            :save-auth="'wht:order:update'"
            :submit-auth="'sys:whtInStorage:submit'"
            :order-status="orderStatus"
            :submit-rules="submitRules"
            :saved-rules="savedRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            @success="GetOrderList"
            @updateProductDate="updateProductDate"
        >
            <template slot="1" slot-scope="data">
                <ready-time ref="readytime" :is-redact="data.isRedact" :form-header="formHeader" @SetReadyStatus="SetReadyStatus" />
            </template>
            <template slot="2" slot-scope="data">
                <worker ref="workerref" :is-redact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="3" slot-scope="data">
                <exc-record ref="excrecord" :is-redact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="4" slot-scope="data">
                <in-stock ref="instock" :is-redact="data.isRedact" :order="formHeader" :in-storage-state="inStorageState" @setInStorageState="setInStorageState" />
            </template>
            <template slot="5" slot-scope="data">
                <apply-materiel ref="applymateriel" :is-redact="data.isRedact" :order="formHeader" :apply-materiel-state="applyMaterielState" @setApplyMaterielState="setApplyMaterielState" />
            </template>
            <template slot="6" slot-scope="data">
                <text-record ref="textrecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </el-col>
</template>

<script>
import { WHT_API } from '@/api/api';
import { headanimation } from '@/net/validate';
import ReadyTime from '../common/readyTime';
import Worker from '@/views/components/Worker';
import ExcRecord from '@/views/components/ExcRecord';
import InStock from '../common/inStock';
import ApplyMateriel from '../common/applyMateriel';
import TextRecord from '@/views/components/TextRecord';
import { AsyncHook } from '@/utils/index.js';
export default {
    name: 'DataEntryIndex',
    components: {
        ReadyTime,
        Worker,
        ExcRecord,
        TextRecord,
        InStock,
        ApplyMateriel
    },
    data() {
        return {
            headerBase: [
                {
                    type: 'p',
                    icon: 'factory-shengchanchejian',
                    label: '生产车间',
                    value: 'workShopName'
                },
                {
                    type: 'p',
                    icon: 'factory-shengchanxian',
                    label: '生产产线',
                    value: 'productLineName'
                },
                {
                    type: 'p',
                    icon: 'factory-bianhao',
                    label: '订单编号',
                    value: 'orderNo'
                },
                {
                    type: 'p',
                    icon: 'factory-dingdan',
                    label: '订单日期',
                    value: 'orderDate'
                },
                {
                    type: 'tooltip',
                    icon: 'factory-pinleiguanli',
                    label: '生产品项',
                    value: ['materialCode', 'materialName']
                },
                {
                    type: 'p',
                    icon: 'factory--meirijihuachanliangpeizhi',
                    label: '计划产量',
                    value: ['planOutput', 'outputUnit']
                },
                {
                    type: 'p',
                    icon: 'factory-xianchangrenyuan',
                    label: '提交人员',
                    value: 'operator'
                },
                {
                    type: 'p',
                    icon: 'factory-riqi',
                    label: '提交时间',
                    value: 'operDate'
                },
                {
                    type: 'date-picker',
                    icon: 'factory-riqi1',
                    label: '生产日期',
                    value: 'productDate'
                }
            ],
            tabs: [
                {
                    label: '准备时间',
                    status: '未录入'
                },
                {
                    label: '人员',
                    status: '未录入'
                },
                {
                    label: '异常记录'
                },
                {
                    label: '生产入库',
                    status: '未录入'
                },
                {
                    label: '物料领用',
                    status: '未录入'
                },
                {
                    label: '文本记录'
                }
            ],
            orderStatus: '',
            submitRules: () => {
                return [this.$refs.readytime.Readyrul, this.$refs.workerref.userrul, this.$refs.excrecord.excrul, this.$refs.instock.validate, this.$refs.applymateriel.validate];
            },
            savedRules: () => {
                return [this.formHeaderRul];
            },
            savedDatas: str => {
                return AsyncHook([
                    [this.UpdateformHeader, [str]],
                    [this.$refs.readytime.UpdateReady, [str]],
                    [this.$refs.readytime.UpdateMachine, [str]],
                    [this.$refs.workerref.UpdateUser, [str]],
                    [this.$refs.instock.saveIn, []],
                    [this.$refs.applymateriel.saveMateriel, []],
                    [this.$refs.excrecord.saveOrSubmitExc, [this.formHeader.orderId, str]],
                    [this.$refs.textrecord.UpdateText, [this.formHeader, str]]
                ]);
            },
            submitDatas: str => {
                return AsyncHook(
                    [
                        [this.UpdateformHeader, [str]],
                        [this.$refs.readytime.UpdateReady, [str]],
                        [this.$refs.readytime.UpdateMachine, [str]],
                        [this.$refs.workerref.UpdateUser, [str]],
                        [this.$refs.excrecord.saveOrSubmitExc, [this.formHeader.orderId, str]],
                        [this.$refs.textrecord.UpdateText, [this.formHeader, str]]
                    ],
                    [
                        [this.ProHours, []],
                        [this.$refs.instock.submitIn, []],
                        [this.$refs.applymateriel.submitMateriel, []]
                    ]
                );
            },
            orderNo: '',
            productDate: '',
            workShop: '',
            formHeader: {
                orderNo: this.$store.state.common.FWorderNo,
                orderId: this.$store.state.common.FWorderId,
                factory: this.$store.state.common.FWfactoryid,
                factoryName: this.$store.state.common.FWfactoryName,
                workShop: this.$store.state.common.FWworkShop,
                workShopName: this.$store.state.common.FWworkShopName,
                // 'C6049059024F4EF08290AA40D80F1F4B',
                productLine: this.$store.state.common.FWproductLine,
                // '炒麦'
                productLineName: this.$store.state.common.FWproductLineName,
                // yyy-MM-dd
                // productDate: `${this.$store.state.common.FWproductDate.substring(0, 4)}-${this.$store.state.common.FWproductDate.substring(4, 6)}-${this.$store.state.common.FWproductDate.substring(6, 8)}`
                productDate: this.$store.state.common.FWproductDate
            },
            readyState: '',
            // 生产入库状态
            inStorageState: '',
            // 物料申请状态
            applyMaterielState: ''
        };
    },
    computed: {
        FWworkShop: {
            get() {
                return this.$store.state.common.FWworkShop;
            },
            set(val) {
                this.$store.commit('common/updateFWWorkShop', val);
            }
        },
        FWproductDate: {
            get() {
                return this.$store.state.common.FWproductDate;
            },
            set(val) {
                this.$store.commit('common/updateFWProductDate', val);
            }
        },
        FWorderNo: {
            get() {
                return this.$store.state.common.FWorderNo;
            },
            set(val) {
                this.$store.commit('common/updateFWOrderNo', val);
            }
        },
        FWorderId: {
            get() {
                return this.$store.state.common.FWorderId;
            },
            set(val) {
                this.$store.commit('common/updateFWorderId', val);
            }
        }
    },
    mounted() {
        headanimation(this.$);
        this.orderNo = this.FWorderNo;
        // yyyyMMdd
        this.productDate = this.FWproductDate;
        this.workShop = this.FWworkShop;
        this.GetOrderList();
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        // 获取表头
        GetOrderList() {
            this.$http(
                `${WHT_API.CINDEXORDERLIST_API}`,
                'POST',
                {
                    workShop: this.workShop,
                    productDate: this.productDate,
                    orderNo: this.orderNo
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.formHeader = {};
                this.formHeader = data.list[0];
                this.orderStatus = data.list[0].orderStatus;
                this.$refs.readytime.GetMachine(this.formHeader.productLine);
                this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                this.$refs.excrecord.getDataList(this.formHeader.factory);
                this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory);
                this.$refs.workerref.getTree(this.formHeader.factory);
                this.$refs.workerref.GetProductShift(this.formHeader.factory);
                this.$refs.instock.getWheatDataList(this.formHeader.orderId);
                this.$refs.instock.getBatch(this.workShop);
                this.$refs.applymateriel.getMaterielDataList(this.formHeader.orderId);
                this.$refs.applymateriel.GetWheatCang(this.formHeader);
                if (this.orderStatus !== '已同步') {
                    this.$refs.readytime.GetReadyList(this.formHeader.orderId);
                    this.$refs.workerref.GetUserList(this.formHeader.orderId);
                    this.$refs.excrecord.GetExcDate(this.formHeader.orderId);
                    this.$refs.textrecord.GetText(this.formHeader.orderId);
                }
            });
        },
        formHeaderRul() {
            let ty = true;
            if (!this.formHeader.productDate) {
                this.$warningTost('表头生产日期必填');
                ty = false;
                return false;
            }
            return ty;
        },
        // 修改表头
        UpdateformHeader(str, resolve) {
            let countOutput = 0;
            this.$refs.instock.wheatDataList.forEach(item => {
                if (item.delFlag === '0') {
                    countOutput += parseInt(item.inPortWeight, 10);
                }
            });
            this.formHeader.orderStatus = str;
            this.formHeader.realOutput = String(countOutput);
            this.formHeader.countOutputUnit = 'KG';
            this.formHeader.countOutput = String(countOutput);
            this.formHeader.countMan = this.$refs.workerref.countMan;
            this.formHeader.expAllDate = this.$refs.excrecord.ExcNum;
            this.formHeader.germs = null;
            if (str !== 'saved') {
                this.formHeader.operator = `${this.realName}(${this.userName})`;
                this.formHeader.operDate = new Date().getFullYear().toString() + '-' + (new Date().getMonth() + 1).toString() + '-' + new Date().getDay().toString();
            }
            this.$http(`${WHT_API.WHTORDERUPDATE_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '保存表头' + data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        // 保存 or 提交
        SubmitForm() {
            if (!this.$refs.readytime.Readyrul()) {
                return false;
            }
            if (!this.$refs.workerref.userrul()) {
                return false;
            }
            if (!this.$refs.excrecord.excrul()) {
                return false;
            }
            if (!this.$refs.instock.validate()) {
                return false;
            }
            if (!this.$refs.applymateriel.validate()) {
                return false;
            }
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            }).catch(() => {
                // this.$infoTost('已取消删除');
            });
        },
        savedOrSubmitForm(str) {
            if (str === 'submit') {
                if (!this.$refs.readytime.Readyrul()) {
                    return false;
                }
                if (!this.$refs.workerref.userrul()) {
                    return false;
                }
                if (!this.$refs.excrecord.excrul()) {
                    return false;
                }
                if (!this.$refs.instock.validate()) {
                    return false;
                }
                if (!this.$refs.applymateriel.validate()) {
                    return false;
                }
            }
            const net0 = new Promise((resolve) => {
                this.UpdateformHeader(str, resolve);
            });
            const net1 = new Promise((resolve) => {
                this.$refs.readytime.UpdateReady(str, resolve);
            });
            const net2 = new Promise((resolve) => {
                this.$refs.readytime.UpdateMachine(str, resolve);
            });
            const net3 = new Promise((resolve) => {
                this.$refs.workerref.UpdateUser(str, resolve);
            });
            const net4 = new Promise((resolve) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve);
            });
            const net5 = new Promise((resolve) => {
                this.$refs.textrecord.UpdateText(this.formHeader, str, resolve);
            });
            if (str === 'submit') {
                const net10 = Promise.all([net0, net1, net2, net3, net4, net5]);
                net10.then(() => {
                    const net6 = new Promise((resolve, reject) => {
                        this.ProHours(resolve, reject);
                    });
                    const net7 = new Promise((resolve) => {
                        this.$refs.instock.submitIn(resolve);
                    });
                    const net8 = new Promise((resolve) => {
                        this.$refs.applymateriel.submitMateriel(resolve);
                    });
                    const net12 = Promise.all([net6, net7, net8]);
                    net12.then(() => {
                        this.GetOrderList();
                        this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                    });
                });
            } else {
                const instock = new Promise((resolve) => {
                    this.$refs.instock.saveIn(resolve);
                });
                const material = new Promise((resolve) => {
                    this.$refs.applymateriel.saveMateriel(resolve);
                });
                const net10 = Promise.all([net0, net1, net2, net3, net4, net5, instock, material]);
                net10.then(() => {
                    this.GetOrderList();
                    this.$notify({
                        title: '成功',
                        message: '保存成功',
                        type: 'success'
                    });
                });
            }
        },
        // 报工提交
        ProHours(resolve) {
            const paras = [
                this.$refs.readytime.readyTimeDate,
                this.$refs.readytime.machineTimeData,
                this.$refs.workerref.WorkerDate,
                {
                    orderId: this.formHeader.orderId,
                    outputUnit: this.formHeader.outputUnit,
                    realOutput: this.formHeader.realOutput,
                    countOutput: this.formHeader.countOutput,
                    countOutputUnit: this.formHeader.countOutputUnit,
                    productDate: this.formHeader.productDate
                }
            ];
            this.$http(`${WHT_API.MATERIELTIMESUBMIT_API}`, 'POST', paras).then(({ data }) => {
                if (data.code !== 0) {
                    this.$errorTost(data.msg);
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        // 准备时间状态
        SetReadyStatus(status) {
            this.readyState = status;
            this.tabs[0].status = status;
            this.tabs[1].status = status;
            this.$refs.dataEntry.updateTabs();
        },
        // 入库状态
        setInStorageState(status) {
            this.inStorageState = status;
            this.tabs[3].status = status;
            this.$refs.dataEntry.updateTabs();
        },
        // 物料状态
        setApplyMaterielState(status) {
            this.applyMaterielState = status;
            this.tabs[4].status = status;
            this.$refs.dataEntry.updateTabs();
        },
        // 表头更改生产日期
        updateProductDate: function(dataStr) {
            if (dataStr) {
                const data = dataStr.replace(/-/g, '');
                this.productDate = data;
                // 更新common store
                this.FWproductDate = data;
            }
        }
    }
};
</script>

<style lang="scss"></style>
