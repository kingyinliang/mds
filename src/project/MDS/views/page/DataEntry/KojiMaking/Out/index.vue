<template>
    <div>
        <data-entry
            ref="dataEntry"
            :redact-auth="'sys:kjmOutMaterial:mySaveOrUpdate'"
            :save-auth="'sys:kjmOutMaterial:mySaveOrUpdate'"
            :submit-auth="'sys:kjmOutMaterial:mySaveOrUpdate'"
            :submit-rules="submitRules"
            :saved-rules="savedRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            :order-status="orderStatus"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            @success="GetOrderList"
        >
            <template slot="1" slot-scope="data">
                <meateriel ref="meateriel" :is-redact="data.isRedact" :form-header="formHeader" @GetMaterielStatus="GetMaterielStatus" @SetMeaterielNum="SetMeaterielNum" />
            </template>
            <template slot="2" slot-scope="data">
                <in-stock ref="outinstorage" :is-redact="data.isRedact" :form-header="formHeader" @GetInStockStatus="GetInStockStatus" />
            </template>
            <template slot="3" slot-scope="data">
                <craft-control ref="outtech" :is-redact="data.isRedact" :form-header="formHeader" @GetCraftControlStatus="GetCraftControlStatus" />
            </template>
            <template slot="4" slot-scope="data">
                <exc-record ref="excrecord" :is-redact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="5" slot-scope="data">
                <text-record ref="textrecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script>
    import { BASICDATA_API, KJM_API } from '@/api/api';
    import { headanimation } from '@/net/validate';
    import Meateriel from './Outcomponents/materiel';
    import InStock from './Outcomponents/inStock';
    import CraftControl from './Outcomponents/craftControl';
    import ExcRecord from '@/views/components/ExcRecord';
    import TextRecord from '@/views/components/TextRecord';
    import { AsyncHook } from '@/utils/index.js';
    export default {
        name: 'Index',
        components: {
            Meateriel,
            InStock,
            CraftControl,
            ExcRecord,
            TextRecord
        },
        data() {
            return {
                headerBase: [
                    { type: 'p', icon: 'factory-shengchanchejian', label: '生产车间', value: 'workShopName' },
                    { type: 'p', icon: 'factory--ICONxiugai_chepaihaoma', label: '制曲房号', value: 'houseName' },
                    { type: 'p', icon: 'factory-bianhao', label: '订单编号', value: 'orderNo' },
                    { type: 'tooltip', icon: 'factory-pinleiguanli', label: '生产品项', value: ['materialCode', 'materialName'] },
                    { type: 'p', icon: 'factory-dingdan', label: '生产日期', value: 'productDate' },
                    { type: 'p', icon: 'factory-xianchangrenyuan', label: '提交人员', value: 'changer' },
                    { type: 'tooltip', icon: 'factory-riqi', label: '提交时间', value: 'changed' },
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
                    { type: 'p', icon: 'factory-bianhaoguize', label: '连续蒸煮号', value: 'cookingName' }
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
                        // let that = this
                        // let meaterielStock = new Promise((resolve, reject) => {
                        //   that.$refs.meateriel.getRepertory(str, resolve, reject)
                        // })
                        // return meaterielStock.then((data) => {
                        // if (data === 1) {
                        //   that.$warningToast('原料领用库存量不能为负')
                        //   return false
                        // }
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
                        // })
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
                        // let that = this
                        // let meaterielStock = new Promise((resolve, reject) => {
                        //   that.$refs.meateriel.getRepertory(str, resolve, reject)
                        // })
                        // return meaterielStock.then((data) => {
                        // if (data === 1) {
                        //   that.$warningToast('原料领用库存量不能为负')
                        //   return false
                        // }
                        return AsyncHook(
                            [
                                // [this.UpdateOrderHead, [str]],
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
                        // })
                    }
                        return AsyncHook(
                            [
                                // [this.UpdateOrderHead, [str]],
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
            /* eslint-disable @typescript-eslint/camelcase*/
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
                    this.$errorToast(data.msg);
                }
                this.visible = false;
            });
            /* eslint-enable @typescript-eslint/camelcase*/
        },
        methods: {
            tabClick(val) {
                this.$refs.tabs.setCurrentName(val.name);
            },
            // 获取表头
            /* eslint-disable @typescript-eslint/camelcase*/
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
                        this.$errorToast(data.msg);
                    }
                });
            },
            /* eslint-enable @typescript-eslint/camelcase*/
            // 修改表头
            UpdateOrderHead(str, resolve, reject) {
                this.formHeader.outStatus = str;
                this.$http(`${KJM_API.FORMHEADUPDATE_API}`, 'POST', this.formHeader).then(({ data }) => {
                    if (data.code === 0) {
                        if (resolve) {
                            resolve('resolve');
                        }
                    } else {
                        this.$notify.error({ title: '错误', message: '保存表头' + data.msg });
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
                /* eslint-disable @typescript-eslint/no-unused-vars*/
                if (this.formHeader.materialCode === 'SS02010001') {
                    const meaterielStock = new Promise((resolve, reject) => {
                        // this.$refs.meateriel.getRepertory(str, resolve, reject)
                    });
                    meaterielStock.then((data) => {
                        if (data === 1) {
                            this.$warningToast('原料领用库存量不能为负');
                            return false;
                        }
                        this.CommonFunction(str);
                    });
                } else {
                    this.CommonFunction(str);
                }
                /* eslint-enable @typescript-eslint/no-unused-vars*/
            },
            CommonFunction(str) {
                const excSaveNet = new Promise((resolve, reject) => {
                    this.$refs.excrecord.saveOrSubmitExc(
                        {
                            orderId: this.formHeader.orderId,
                            orderHouseId: this.formHeader.id,
                            blongProc: this.formHeader.prolineId
                        },
                        str,
                        resolve,
                        reject
                    );
                });
                const textSaveNet = new Promise((resolve, reject) => {
                    this.$refs.textrecord.UpdateText(
                        {
                            orderId: this.formHeader.orderId,
                            orderHouseId: this.formHeader.id,
                            blongProc: this.formHeader.prolineId
                        },
                        str,
                        resolve,
                        reject
                    );
                });
                const OrderHeadSaveNet = new Promise((resolve, reject) => {
                    this.UpdateOrderHead(str, resolve, reject);
                });
                if (str === 'submit') {
                    const saveNet = Promise.all([OrderHeadSaveNet, excSaveNet, textSaveNet]);
                    saveNet.then(() => {
                        const meaterielSubmit = new Promise((resolve, reject) => {
                            this.$refs.meateriel.SaveOrSubmitMateriel(str, resolve, reject);
                        });
                        const InstockSubmit = new Promise((resolve, reject) => {
                            this.$refs.outinstorage.SaveOrSubmitInStock(str, resolve, reject);
                        });
                        const submitNet = Promise.all([meaterielSubmit, InstockSubmit]);
                        submitNet.then(
                            () => {
                                this.GetOrderList();
                                this.$notify({ title: '成功', message: '提交成功', type: 'success' });
                            },
                            err => {
                                this.$errorToast(err);
                            }
                        );
                    });
                } else {
                    const meaterielSave = new Promise((resolve, reject) => {
                        this.$refs.meateriel.SaveOrSubmitMateriel(str, resolve, reject);
                    });
                    const InstockSave = new Promise((resolve, reject) => {
                        this.$refs.outinstorage.SaveOrSubmitInStock(str, resolve, reject);
                    });
                    const saveNet = Promise.all([OrderHeadSaveNet, meaterielSave, InstockSave, excSaveNet, textSaveNet]);
                    saveNet.then(
                        () => {
                            this.GetOrderList();
                            this.$notify({ title: '成功', message: '保存成功', type: 'success' });
                        },
                        err => {
                            this.$errorToast(err);
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
                }).catch(() => {
                    // this.$infoToast('已取消删除');
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
                this.$nextTick(() => {
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
