<template>
    <el-col>
        <data-entry
            ref="dataEntry"
            :redact-auth="'sys:whtPwMaterial:update'"
            :save-auth="'sys:whtPwMaterial:update'"
            :submit-auth="'sys:whtPwMaterial:update'"
            :order-status="orderStatus"
            :form-header="formHeader"
            :header-base="headerBase"
            :tabs="tabs"
            :before-leave="beforeLeave"
            :saved-rules="savedRules"
            :submit-rules="submitRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            @updateProductDate="updateProductDate"
            @success="GetOrderList"
        >
            <template slot="1" slot-scope="data">
                <pw-apply-materiel ref="pwapplymateriel" :is-redact="data.isRedact" :order="formHeader" :appy-materiel-state="appyMaterielState" @updateOrderInfo="updateOrderInfo" @setAppyMaterielState="setAppyMaterielState" />
            </template>
            <template slot="2" slot-scope="data">
                <pw-time ref="pwtime" :is-redact="data.isRedact" :order="formHeader" @SetReadyStatus="SetReadyStatus" />
            </template>
            <template slot="3" slot-scope="data">
                <exc-record ref="excrecord" :is-redact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="4" slot-scope="data">
                <text-record ref="textrecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </el-col>
</template>

<script>
import { WHT_API } from '@/api/api';
import { headanimation } from '@/net/validate';
import ExcRecord from '@/views/components/ExcRecord';
import PwTime from '../common/pwTime';
import PwApplyMateriel from '../common/pwApplyMateriel';
import TextRecord from '@/views/components/TextRecord';
import { AsyncHook } from '@/utils/index.js';
export default {
    name: 'DataEntryIndex',
    components: {
        ExcRecord,
        TextRecord,
        PwTime,
        PwApplyMateriel
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
                    type: 'tooltip',
                    icon: 'factory-pinleiguanli',
                    label: '生产品项',
                    value: ['materialCode', 'materialName']
                },
                {
                    type: 'p',
                    icon: 'factory-dingdan',
                    label: '订单日期',
                    value: 'orderDate'
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
                    label: '物料领用',
                    status: '未录入'
                },
                {
                    label: '工时录入',
                    status: '未录入'
                },
                {
                    label: '异常记录'
                },
                {
                    label: '文本记录'
                }
            ],
            beforeLeave: (activeName) => {
                if (!this.enableOpt && activeName !== '1') {
                    this.$warningToast('请申请订单之后操作');
                    return false;
                }
                return true;
            },
            savedRules: () => {
                return [this.$refs.pwapplymateriel.saveAndSubmitRule];
            },
            submitRules: () => {
                return [this.$refs.pwapplymateriel.saveAndSubmitRule, this.$refs.pwtime.timerul, this.$refs.excrecord.excrul, this.$refs.pwapplymateriel.validate];
            },
            savedDatas: str => {
                return AsyncHook([
                    [this.OrderUpdate, [str]],
                    [this.$refs.excrecord.saveOrSubmitExc, [this.formHeader.orderId, str]],
                    [this.$refs.pwapplymateriel.saveMateriel, []],
                    [this.$refs.textrecord.UpdateText, [this.formHeader, str]],
                    [this.$refs.pwtime.PwTimeUpdate, [str]]
                ]);
            },
            submitDatas: str => {
                return AsyncHook(
                    [
                        [this.OrderUpdate, [str]],
                        [this.$refs.excrecord.saveOrSubmitExc, [this.formHeader.orderId, str]],
                        [this.$refs.textrecord.UpdateText, [this.formHeader, str]],
                        [this.$refs.pwtime.PwTimeUpdate, [str]]
                    ],
                    [
                        [this.$refs.pwapplymateriel.submitMateriel, []],
                        [this.Timeupdate, []]
                    ]
                );
            },
            orderStatus: '',
            isRedact: false,
            orderNo: '',
            productDate: '',
            workShop: '',
            formHeader: {
                orderNo: this.$store.state.common.PWorder.orderNo,
                orderId: this.$store.state.common.PWorder.orderId,
                factory: this.$store.state.common.FWfactoryid,
                factoryName: this.$store.state.common.FWfactoryName,
                workShop: this.$store.state.common.FWworkShop,
                workShopName: this.$store.state.common.FWworkShopName,
                productLine: this.$store.state.common.PWorder.productLine,
                productLineName: this.$store.state.common.PWorder.productLineName,
                // yyyy-MM-dd
                // productDate: `${this.$store.state.common.PWorder.productDate.substring(0, 4)}-${this.$store.state.common.PWorder.productDate.substring(4, 6)}-${this.$store.state.common.PWorder.productDate.substring(6, 8)}`
                productDate: this.$store.state.common.PWorder.productDate
            },
            activeName: '1',
            // save / submit 是否可用
            enableOpt: false,
            // 物料领用
            appyMaterielState: '',
            // 准备时间
            readyState: ''
        };
    },
    computed: {
        PWorderNo: {
            get() {
                return this.$store.state.common.PWorder.orderNo;
            },
            set(val) {
                this.$store.commit('common/updatePWorderNo', val);
            }
        },
        PWorderId: {
            get() {
                return this.$store.state.common.PWorder.orderId;
            },
            set(val) {
                this.$store.commit('common/updatePWorderId', val);
            }
        },
        FWworkShop: {
            get() {
                return this.$store.state.common.FWworkShop;
            },
            set(val) {
                this.$store.commit('common/updateFWWorkShop', val);
            }
        },
        PWproductDate: {
            get() {
                return this.$store.state.common.PWorder.productDate;
            },
            set(val) {
                this.$store.commit('common/updatePWproductDate', val);
            }
        }
    },
    watch: {
        orderNo(n) {
            // 申请订单之后触发全局刷新
            if (n) {
                // 有订单号情况下才可用
                this.enableOpt = true;
            }
            this.GetOrderList();
        }
    },
    mounted() {
        headanimation(this.$);
        this.orderNo = this.PWorderNo;
        // yyyyMMdd
        this.productDate = this.$store.state.common.PWorder.productDate;
        this.workShop = this.FWworkShop;
        this.GetOrderList();
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        // beforeLeave (activeName, oldActiveName) {
        //   if (!this.enableOpt && activeName !== '1') {
        //     this.$errorToast('请申请订单之后操作')
        //     return false
        //   }
        //   return true
        // },
        // 获取表头
        GetOrderList() {
            this.isRedact = false;
            this.$refs.pwapplymateriel.GetWheatCangList(this.$store.state.common.FWfactoryid, this.$store.state.common.FWworkShop);
            if (this.orderNo) {
                // 有订单号
                this.$http(`${WHT_API.CINDEXORDERLIST_API}`, 'POST', {
                    workShop: this.workShop,
                    productDate: this.productDate,
                    orderNo: this.orderNo
                }).then(({ data }) => {
                    // 2018-06-27
                    this.formHeader = data.list[0];
                    this.orderStatus = data.list[0].orderStatus;
                    // console.log('this.formHeader', JSON.stringify(this.formHeader))
                    this.$refs.pwapplymateriel.getMaterielDataList(this.formHeader.orderId);
                    this.$refs.pwapplymateriel.getDictList(this.$store.state.common.FWfactoryid);
                    this.$refs.pwtime.GetPwTimeList();
                });
            } else {
                this.$refs.pwapplymateriel.getDictList(this.$store.state.common.FWfactoryid);
            }
        },
        // 修改表头
        OrderUpdate(str, resolve) {
            let countOutput = 0;
            this.$refs.pwapplymateriel.materielDataList.forEach(item => {
                countOutput += parseInt(item.inStorageWeight, 10);
            });
            this.formHeader.orderStatus = str;
            this.formHeader.countOutputUnit = 'KG';
            this.formHeader.countOutput = String(countOutput);
            this.formHeader.realOutput = String(countOutput);
            this.formHeader.expAllDate = this.$refs.excrecord.ExcNum;
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
        // 保存
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
                if (!this.$refs.pwtime.timerul()) {
                    return false;
                }
                if (!this.$refs.excrecord.excrul()) {
                    return false;
                }
                if (!this.$refs.pwapplymateriel.validate('submit')) {
                    return false;
                }
            }
            const net0 = new Promise((resolve) => {
                this.OrderUpdate(str, resolve);
            });
            const net1 = new Promise((resolve) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve);
            });
            const net3 = new Promise((resolve) => {
                this.$refs.textrecord.UpdateText(this.formHeader, str, resolve);
            });
            const net4 = new Promise((resolve) => {
                this.$refs.pwtime.PwTimeUpdate(str, resolve);
            });
            if (str === 'submit') {
                const net10 = Promise.all([net0, net1, net3, net4]);
                net10.then(() => {
                    const net5 = new Promise((resolve) => {
                        this.$refs.pwapplymateriel.submitMateriel(resolve);
                    });
                    const net6 = new Promise((resolve) => {
                        this.Timeupdate(resolve);
                    });
                    const net12 = Promise.all([net5, net6]);
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
                const net2 = new Promise((resolve) => {
                    this.$refs.pwapplymateriel.saveMateriel(resolve);
                });
                const net10 = Promise.all([net0, net1, net2, net3, net4]);
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
        // 工时提交
        Timeupdate(resolve) {
            this.$http(WHT_API.PWMATERIELTIMESUBMIT_API, 'POST', [
                this.$refs.pwtime.pwTimeDate[0],
                {
                    orderId: this.formHeader.orderId,
                    outputUnit: this.formHeader.outputUnit,
                    realOutput: this.formHeader.realOutput,
                    countOutput: this.formHeader.countOutput,
                    countOutputUnit: this.formHeader.countOutputUnit,
                    productDate: this.formHeader.productDate
                }
            ]).then(({ data }) => {
                if (data.code !== 0) {
                    this.$errorToast(data.msg);
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        },
        updateOrderInfo: function(orderInfo) {
            // 申请订单之后，订单号回写
            this.orderNo = orderInfo.orderNo;
            // 更新common store
            this.PWorderNo = orderInfo.orderNo;
            this.PWorderId = orderInfo.orderId;
        },
        updateProductDate: function(dataStr) {
            if (dataStr) {
                const data = dataStr.replace(/-/g, '');
                this.productDate = data;
                // 更新common store
                this.PWproductDate = data;
            }
        },
        setAppyMaterielState: function(state) {
            this.appyMaterielState = state;
            this.tabs[0].status = state;
            this.$refs.dataEntry.updateTabs();
            // 强制tabs刷新
            // this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
        },
        // 准备时间状态
        SetReadyStatus(status) {
            this.readyState = status;
            this.tabs[1].status = status;
            this.$refs.dataEntry.updateTabs();
            // this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName) - 1])
        }
    }
};
</script>

<style lang="scss">
#DaatTtabs {
    border-top: 1px solid #e8e8e8;
    h3 {
        float: left;
        font-weight: 600;
        font-size: 16px;
    }
    span {
        .el-button {
            padding: 0;
            font-size: 16px;
            background-color: inherit;
            border: none;
        }
    }
    .el-tabs__item {
        height: 40px;
        line-height: 40px;
    }
    table {
        .el-form-item {
            margin-bottom: 0;
        }
    }
    .notNull {
        color: red;
    }
    .el-table .warning-row > td {
        background: #bbb !important;
        background-color: #bbb !important;
    }
    .el-table .warning-row:hover > td {
        background: #bbb !important;
        background-color: #bbb !important;
    }
}
.required {
    position: relative;
    padding-left: 15px;
    .reqI {
        position: absolute;
        left: 0;
        color: red;
        line-height: 32px;
    }
}
</style>
