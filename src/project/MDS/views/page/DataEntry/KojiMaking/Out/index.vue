<template>
    <div>
        <data-entry
            ref="dataEntry"
            :redactAuth="'sys:kjmOutMaterial:mySaveOrUpdate'"
            :saveAuth="'sys:kjmOutMaterial:mySaveOrUpdate'"
            :submitAuth="'sys:kjmOutMaterial:mySaveOrUpdate'"
            :submitRules="submitRules"
            :savedRules="savedRules"
            :savedDatas="savedDatas"
            :submitDatas="submitDatas"
            :orderStatus="orderStatus"
            :headerBase="headerBase"
            :formHeader="formHeader"
            :tabs="tabs"
            @success="GetOrderList"
        >
            <template slot="1" slot-scope="data">
                <meateriel ref="meateriel" :isRedact="data.isRedact" :formHeader="formHeader" @GetMaterielStatus="GetMaterielStatus" @SetMeaterielNum="SetMeaterielNum" />
            </template>
            <template slot="2" slot-scope="data">
                <in-stock ref="outinstorage" :isRedact="data.isRedact" :formHeader="formHeader" @GetInStockStatus="GetInStockStatus" />
            </template>
            <template slot="3" slot-scope="data">
                <craft-control ref="outtech" :isRedact="data.isRedact" :formHeader="formHeader" @GetCraftControlStatus="GetCraftControlStatus" />
            </template>
            <template slot="4" slot-scope="data">
                <exc-record ref="excrecord" :isRedact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="5" slot-scope="data">
                <text-record ref="textrecord" :isRedact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script>
import { BASICDATA_API, KJM_API } from '@/api/api';
import { headanimation } from '@/net/validate';
import FormHead from './Outcomponents/formHead';
import Meateriel from './Outcomponents/materiel';
import InStock from './Outcomponents/inStock';
import CraftControl from './Outcomponents/craftControl';
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
import { AsyncHook } from '@/utils/index.js';
export default {
    name: 'Index',
    components: {
        FormHead,
        Meateriel,
        InStock,
        CraftControl,
        ExcRecord,
        TextRecord
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
                    icon: 'factory--ICONxiugai_chepaihaoma',
                    label: '制曲房号',
                    value: 'houseName'
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
                    label: '生产日期',
                    value: 'productDate'
                },
                {
                    type: 'p',
                    icon: 'factory-xianchangrenyuan',
                    label: '提交人员',
                    value: 'changer'
                },
                {
                    type: 'p',
                    icon: 'factory-riqi',
                    label: '提交时间',
                    value: 'changed'
                },
                {
                    type: 'select',
                    icon: 'factory-riqi',
                    label: '入 罐 号 ',
                    value: 'inPotNo',
                    disabled: true,
                    option: {
                        list: [],
                        label: 'holderName',
                        value: 'holderId'
                    }
                },
                {
                    type: 'p',
                    icon: 'factory-bianhaoguize',
                    label: '连续蒸煮号',
                    value: 'cookingName'
                }
            ],
            tabs: [
                {
                    label: '原料领用',
                    status: '未录入'
                },
                {
                    label: '生产入库',
                    status: '未录入'
                },
                {
                    label: '工艺控制',
                    status: '未录入'
                },
                {
                    label: '异常记录'
                },
                {
                    label: '文本记录'
                }
            ],
            submitRules: () => {
                return [this.$refs.meateriel.saveRul2, this.$refs.meateriel.saveRul, this.$refs.outinstorage.InStockRul, this.$refs.excrecord.excrul];
            },
            savedRules: () => {
                return [this.$refs.meateriel.saveRul2];
            },
            savedDatas: str => {
                if (this.formHeader.materialCode === 'SS02010001') {
                    const that = this;
                    const meaterielStock = new Promise((resolve, reject) => {
                        that.$refs.meateriel.getRepertory(str, resolve, reject);
                    });
                    return meaterielStock.then(data => {
                        if (data === 1) {
                            that.$warning_SHINHO('原料领用库存量不能为负');
                            return false;
                        }
                        return AsyncHook([
                            [this.UpdateOrderHead, [str]],
                            [this.$refs.meateriel.SaveOrSubmitMateriel, [str]],
                            [this.$refs.outinstorage.SaveOrSubmitInStock, [str]],
                            [
                                this.$refs.excrecord.saveOrSubmitExc,
                                [
                                    {
                                        orderId: this.formHeader.orderId,
                                        orderHouseId: this.formHeader.id,
                                        blongProc: this.formHeader.prolineId
                                    },
                                    str
                                ]
                            ],
                            [
                                this.$refs.textrecord.UpdateText,
                                [
                                    {
                                        orderId: this.formHeader.orderId,
                                        orderHouseId: this.formHeader.id,
                                        blongProc: this.formHeader.prolineId
                                    },
                                    str
                                ]
                            ]
                        ]);
                    });
                }
                    return AsyncHook([
                        [this.UpdateOrderHead, [str]],
                        [this.$refs.meateriel.SaveOrSubmitMateriel, [str]],
                        [this.$refs.outinstorage.SaveOrSubmitInStock, [str]],
                        [
                            this.$refs.excrecord.saveOrSubmitExc,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.id,
                                    blongProc: this.formHeader.prolineId
                                },
                                str
                            ]
                        ],
                        [
                            this.$refs.textrecord.UpdateText,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.id,
                                    blongProc: this.formHeader.prolineId
                                },
                                str
                            ]
                        ]
                    ]);

            },
            submitDatas: str => {
                if (this.formHeader.materialCode === 'SS02010001') {
                    const that = this;
                    const meaterielStock = new Promise((resolve, reject) => {
                        that.$refs.meateriel.getRepertory(str, resolve, reject);
                    });
                    return meaterielStock.then(data => {
                        if (data === 1) {
                            that.$warning_SHINHO('原料领用库存量不能为负');
                            return false;
                        }
                        return AsyncHook(
                            [
                                [this.UpdateOrderHead, [str]],
                                [
                                    this.$refs.excrecord.saveOrSubmitExc,
                                    [
                                        {
                                            orderId: this.formHeader.orderId,
                                            orderHouseId: this.formHeader.id,
                                            blongProc: this.formHeader.prolineId
                                        },
                                        str
                                    ]
                                ],
                                [
                                    this.$refs.textrecord.UpdateText,
                                    [
                                        {
                                            orderId: this.formHeader.orderId,
                                            orderHouseId: this.formHeader.id,
                                            blongProc: this.formHeader.prolineId
                                        },
                                        str
                                    ]
                                ]
                            ],
                            [
                                [this.$refs.meateriel.SaveOrSubmitMateriel, [str]],
                                [this.$refs.outinstorage.SaveOrSubmitInStock, [str]]
                            ]
                        );
                    });
                }
                    return AsyncHook(
                        [
                            [this.UpdateOrderHead, [str]],
                            [
                                this.$refs.excrecord.saveOrSubmitExc,
                                [
                                    {
                                        orderId: this.formHeader.orderId,
                                        orderHouseId: this.formHeader.id,
                                        blongProc: this.formHeader.prolineId
                                    },
                                    str
                                ]
                            ],
                            [
                                this.$refs.textrecord.UpdateText,
                                [
                                    {
                                        orderId: this.formHeader.orderId,
                                        orderHouseId: this.formHeader.id,
                                        blongProc: this.formHeader.prolineId
                                    },
                                    str
                                ]
                            ]
                        ],
                        [
                            [this.$refs.meateriel.SaveOrSubmitMateriel, [str]],
                            [this.$refs.outinstorage.SaveOrSubmitInStock, [str]]
                        ]
                    );

            },
            isRedact: false,
            formHeader: {},
            MeaterielNum: 0,
            orderStatus: '',
            activeName: '1',
            Materielstatus: '',
            InStockStatus: '',
            // 工艺控制的页签状态
            CraftControlStatus: ''
        };
    },
    computed: {
        ZQWorkshop: {
            get() {
                return this.$store.state.common.ZQWorkshop;
            }
        }
    },
    mounted() {
        headanimation(this.$);
        this.GetOrderList();
        this.$http(`${BASICDATA_API.CONTAINERLIST_API}`, 'POST', {
            currPage: 1,
            holder_type: '001',
            pageSize: 9999,
            type: 'holder_type'
        }).then(({ data }) => {
            if (data.code === 0) {
                this.headerBase[7].option.list = data.page.list;
            } else {
                this.$error_SHINHO(data.msg);
            }
            this.visible = false;
        });
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        // 获取表头
        GetOrderList() {
            this.$http(
                `${KJM_API.FORMHEAD_API}`,
                'POST',
                {
                    id: this.ZQWorkshop.params.outOrderHouseId
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.isRedact = false;
                    this.formHeader = data.list[0];
                    this.orderStatus = data.list[0].outStatus;
                    this.$refs.meateriel.GetBrineTankNo(this.formHeader);
                    this.$refs.meateriel.GetBrine(this.formHeader.factory);
                    this.$refs.outinstorage.GetThreeNum(this.formHeader);
                    this.$refs.outinstorage.GetParams(this.formHeader.factory);
                    this.$refs.outtech.selectUser(this.formHeader.prolineId);
                    this.$refs.outtech.GetTechList(this.formHeader);
                    this.$refs.excrecord.GetequipmentType(this.formHeader.prolineId);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    this.$refs.meateriel.GetmaterielDate(this.formHeader);
                    if (this.orderStatus !== '已同步') {
                        this.$refs.outinstorage.GetOutInStorage(this.formHeader);
                        this.$refs.excrecord.GetExcDate({
                            order_id: this.formHeader.orderId,
                            orderHouseId: this.formHeader.id,
                            blongProc: this.formHeader.prolineId
                        });
                        this.$refs.textrecord.GetText({
                            order_id: this.formHeader.orderId,
                            orderHouseId: this.formHeader.id,
                            blongProc: this.formHeader.prolineId
                        });
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 修改表头
        UpdateOrderHead(str, resolve, reject) {
            this.formHeader.outStatus = str;
            this.$http(`${KJM_API.FORMHEADUPDATE_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '保存表头' + data.msg
                    });
                    if (reject) {
                        reject('保存表头' + data.msg);
                    }
                }
            });
        },
        // 保存
        savedOrSubmitForm(str) {
            if (!this.$refs.meateriel.saveRul2()) {
                return false;
            }
            if (str === 'submit') {
                if (!this.$refs.meateriel.saveRul()) {
                    return false;
                }
                if (!this.$refs.outinstorage.InStockRul()) {
                    return false;
                }
                if (!this.$refs.excrecord.excrul()) {
                    return false;
                }
            }
            if (this.formHeader.materialCode === 'SS02010001') {
                const that = this;
                const meaterielStock = new Promise((resolve, reject) => {
                    that.$refs.meateriel.getRepertory(str, resolve, reject);
                });
                meaterielStock.then(function(data) {
                    if (data === 1) {
                        that.$warning_SHINHO('原料领用库存量不能为负');
                        return false;
                    }
                    that.CommonFunction(str);
                });
            } else {
                this.CommonFunction(str);
            }
        },
        CommonFunction(str) {
            const that = this;
            const excSaveNet = new Promise((resolve, reject) => {
                that.$refs.excrecord.saveOrSubmitExc(
                    {
                        orderId: that.formHeader.orderId,
                        orderHouseId: that.formHeader.id,
                        blongProc: that.formHeader.prolineId
                    },
                    str,
                    resolve,
                    reject
                );
            });
            const textSaveNet = new Promise((resolve, reject) => {
                that.$refs.textrecord.UpdateText(
                    {
                        orderId: that.formHeader.orderId,
                        orderHouseId: that.formHeader.id,
                        blongProc: that.formHeader.prolineId
                    },
                    str,
                    resolve,
                    reject
                );
            });
            const OrderHeadSaveNet = new Promise((resolve, reject) => {
                that.UpdateOrderHead(str, resolve, reject);
            });
            if (str === 'submit') {
                const saveNet = Promise.all([OrderHeadSaveNet, excSaveNet, textSaveNet]);
                saveNet.then(function() {
                    const meaterielSubmit = new Promise((resolve, reject) => {
                        that.$refs.meateriel.SaveOrSubmitMateriel(str, resolve, reject);
                    });
                    const InstockSubmit = new Promise((resolve, reject) => {
                        that.$refs.outinstorage.SaveOrSubmitInStock(str, resolve, reject);
                    });
                    const submitNet = Promise.all([meaterielSubmit, InstockSubmit]);
                    submitNet.then(
                        function() {
                            that.GetOrderList();
                            that.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                        },
                        err => {
                            that.$error_SHINHO(err);
                        }
                    );
                });
            } else {
                const meaterielSave = new Promise((resolve, reject) => {
                    that.$refs.meateriel.SaveOrSubmitMateriel(str, resolve, reject);
                });
                const InstockSave = new Promise((resolve, reject) => {
                    that.$refs.outinstorage.SaveOrSubmitInStock(str, resolve, reject);
                });
                const saveNet = Promise.all([OrderHeadSaveNet, meaterielSave, InstockSave, excSaveNet, textSaveNet]);
                saveNet.then(
                    function() {
                        that.GetOrderList();
                        that.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                    },
                    err => {
                        that.$error_SHINHO(err);
                    }
                );
            }
        },
        // 提交
        SubmitForm() {
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            });
        },
        // 原料领用状态
        GetMaterielStatus(status) {
            this.Materielstatus = status;
            this.tabs[0].status = status;
            this.$refs.dataEntry.updateTabs();
        },
        SetMeaterielNum(num) {
            // this.$refs.outtech.GetsaltWaterUsed(num)
            this.$nextTick(function() {
                this.$refs.outinstorage.setBrineNum(num);
            });
        },
        // 生产入库状态
        GetInStockStatus(status) {
            this.InStockStatus = status;
            this.tabs[1].status = status;
            this.$refs.dataEntry.updateTabs();
        },
        // 工艺控制状态
        GetCraftControlStatus(status) {
            this.CraftControlStatus = status;
            this.headerBase[7].disabled = status !== 'submit';
            this.tabs[2].status = status;
            this.$refs.dataEntry.updateTabs();
        }
    }
};
</script>

<style scoped></style>
