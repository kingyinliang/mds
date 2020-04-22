<template>
    <div>
        <data-entry
            ref="dataEntry"
            :redact-auth="'kjm:bean:material:update'"
            :save-auth="'kjm:bean:material:update'"
            :submit-auth="'kjm:bean:material:update'"
            :submit-rules="submitRules"
            :saved-rules="savedRules"
            :saved-datas="savedDatas"
            :submit-datas="submitDatas"
            :order-status="orderStatus"
            :header-base="headerBase"
            :form-header="formHeader"
            :tabs="tabs"
            @success="GetheadList"
        >
            <template slot="1" slot-scope="data">
                <Material ref="material" :is-redact="data.isRedact" :form-header="formHeader" @setApplyMaterielState="setApplyMaterielState" @HeadUpdate="HeadUpdate" />
            </template>
            <template slot="2" slot-scope="data">
                <Craft ref="craft" :is-redact="data.isRedact" :form-header="formHeader" @setApplyCraftState="setApplyCraftState" />
            </template>
            <template slot="3" slot-scope="data">
                <exc-record ref="excrecord" :is-redact="data.isRedact" :order="formHeader" />
            </template>
            <template slot="4" slot-scope="data">
                <text-record ref="textrecord" :is-redact="data.isRedact" />
            </template>
        </data-entry>
    </div>
</template>

<script>
import { KJM_API, BASICDATA_API } from '@/api/api';
import { headanimation } from '@/net/validate';
import Material from './common/material';
import Craft from './common/craft';
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
import { AsyncHook } from '@/utils/index.js';
export default {
    name: 'BoileIndex',
    components: {
        Material,
        Craft,
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
                    value: 'houseNoName'
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
                    type: 'p',
                    icon: 'factory-riqi',
                    label: '入 罐 号 ',
                    value: 'inPotNoName'
                },
                {
                    type: 'select',
                    icon: 'factory-bianhaoguize',
                    label: '连续蒸煮号',
                    value: 'cookingNoId',
                    disabled: true,
                    option: {
                        list: [],
                        label: 'holderName',
                        value: 'holderId'
                    }
                }
            ],
            tabs: [
                {
                    label: '原料领用',
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
                return [this.formHeaderRul, this.$refs.material.mainrules, this.$refs.craft.craftrules, this.$refs.excrecord.excrul];
            },
            savedRules: () => {
                return [this.formHeaderRul];
            },
            savedDatas: str => {
                this.$set(this.formHeader, 'submitStatus', 'saved');
                return AsyncHook(
                    [
                        [this.UpdateHeader, [str]],
                        [this.UpdateHeaderCreator, [str]],
                        [this.$refs.material.savemains, []],
                        [this.$refs.material.savewheats, []],
                        [this.$refs.material.savepulps, []],
                        [
                            this.$refs.excrecord.saveOrSubmitExc,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ],
                        [
                            this.$refs.textrecord.UpdateText,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ]
                    ],
                    [
                        [this.$refs.material.submitwheats, []],
                        [this.$refs.material.submitpulps, []],
                        [this.$refs.craft.updatezhu, []]
                    ],
                    [
                        [this.$refs.craft.updatelishui, []],
                        [this.$refs.craft.updatezhengzhu, []],
                        [this.$refs.craft.updatehunhe, []],
                        [this.$refs.material.savestauts, []]
                    ]
                );
            },
            submitDatas: str => {
                this.$set(this.formHeader, 'submitStatus', 'submit');
                return AsyncHook(
                    [
                        [this.UpdateHeader, [str]],
                        [this.UpdateHeaderCreator, [str]],
                        [this.$refs.material.savemains, []],
                        [this.$refs.material.savewheats, []],
                        [this.$refs.material.savepulps, []],
                        [
                            this.$refs.excrecord.saveOrSubmitExc,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ],
                        [
                            this.$refs.textrecord.UpdateText,
                            [
                                {
                                    orderId: this.formHeader.orderId,
                                    orderHouseId: this.formHeader.orderHouseId,
                                    blongProc: this.formHeader.processId
                                },
                                str
                            ]
                        ]
                    ],
                    [
                        [this.$refs.material.submitwheats, []],
                        [this.$refs.material.submitpulps, []],
                        [this.$refs.material.submitmains, []],
                        [this.$refs.craft.updatezhu, []]
                    ],
                    [
                        [this.$refs.craft.updatelishui, []],
                        [this.$refs.craft.updatezhengzhu, []],
                        [this.$refs.craft.updatehunhe, []],
                        [this.$refs.material.savestauts, []]
                    ]
                );
            },
            activeName: '1',
            formHeader: {},
            orderStatus: '',
            isRedact: false,
            formLabelWidth: '100px',
            applyMaterielState: '', // 物料状态
            applyCraftState: '', // 工艺状态
            holderList: [],
            cookingNoId: '', // 连续蒸煮号
            succmessage: '保存成功'
        };
    },
    watch: {
        applyCraftState() {
            console.log('status:' + this.applyCraftState);
        }
    },
    mounted() {
        headanimation(this.$);
        this.GetheadList();
        this.GetholderList();
    },
    methods: {
        formHeaderRul() {
            let ty = true;
            if (!this.formHeader.cookingNoId || this.formHeader.cookingNoId === '') {
                this.$warningToast('请选择连续蒸煮号');
                ty = false;
                return false;
            }
            return ty;
        },
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        HeadUpdate(str) {
            this.$http(
                `${KJM_API.DOUHEAERLIST}`,
                `POST`,
                {
                    orderHouseId: this.$store.state.common.ZQWorkshop.params.beanOrderHouseId,
                    deptName: '煮豆'
                },
                false,
                false,
                false
            ).then(res => {
                if (res.data.code === 0) {
                    this.formHeader = res.data.headList[0];
                    this.formHeader = res.data.headList[0];
                    // this.cookingNoId = this.formHeader.cookingNoName
                    this.orderStatus = res.data.headList[0].beanStatus;
                    if (str === 'wheat') {
                        this.$refs.material.getMaiholdList(this.formHeader);
                    }
                    if (str === 'soy') {
                        this.$refs.material.getDouholdList(this.formHeader);
                        this.$refs.material.GetPuplList(this.formHeader);
                    }
                    this.$refs.excrecord.GetequipmentType(this.formHeader.processId);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    this.$refs.material.partialUpdates(this.formHeader, str);
                } else {
                    this.$errorToast(res.data.msg);
                }
            });
        },
       /* eslint-disable @typescript-eslint/camelcase */
        GetheadList() {
            this.$http(
                `${KJM_API.DOUHEAERLIST}`,
                `POST`,
                {
                    orderHouseId: this.$store.state.common.ZQWorkshop.params.beanOrderHouseId,
                    deptName: '煮豆'
                },
                false,
                false,
                false
            ).then(res => {
                if (res.data.code === 0) {
                    this.formHeader = res.data.headList[0];
                    // this.cookingNoId = this.formHeader.cookingNoName
                    this.orderStatus = res.data.headList[0].beanStatus;
                    // this.$refs.material.GetrealTime(this.formHeader)
                    // this.$refs.material.GetrealWheatTime(this.formHeader)
                    this.$refs.material.getMaiholdList(this.formHeader);
                    this.$refs.material.getDouholdList(this.formHeader);
                    this.$refs.material.GetPuplList(this.formHeader);
                    this.$refs.excrecord.GetequipmentType(this.formHeader.processId);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    if (this.orderStatus !== '已同步') {
                        this.$refs.material.getList(this.formHeader);
                        this.$refs.craft.getList(this.formHeader);
                        this.$refs.excrecord.GetExcDate({
                            order_id: this.formHeader.orderId,
                            orderHouseId: this.formHeader.id,
                            blongProc: this.formHeader.processId
                        });
                        this.$refs.textrecord.GetText({
                            order_id: this.formHeader.orderId,
                            orderHouseId: this.formHeader.orderHouseId,
                            blongProc: this.formHeader.processId
                        });
                    }
                } else {
                    this.$errorToast(res.data.msg);
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 表头 连续蒸煮号
        /* eslint-disable @typescript-eslint/camelcase */
        GetholderList() {
            this.$http(
                `${BASICDATA_API.CONTAINERLIST_API}`,
                'POST',
                {
                    currPage: 1,
                    holder_type: '008',
                    pageSize: 9999,
                    type: 'holder_type'
                },
                false,
                false,
                false
            ).then(({ data }) => {
                if (data.code === 0) {
                    this.holderList = data.page.list;
                    this.headerBase[8].option.list = data.page.list;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        /* eslint-enable @typescript-eslint/camelcase */
        // 表头更改
        UpdateHeader(str, resolve, reject) {
            this.$http(`${KJM_API.DOUHEADER_API}`, 'POST', {
                cookingNoId: this.formHeader.cookingNoId,
                orderHouseId: this.formHeader.orderHouseId
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$errorToast('保存表头' + data.msg);
                    if (reject) {
                        reject('resolve');
                    }
                }
            });
        },
        UpdateHeaderCreator(str, resolve, reject) {
            this.$http(`${KJM_API.DOUMATERHEADCREATOR_API}`, 'POST', {
                orderId: this.formHeader.orderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$errorToast('保存表头' + data.msg);
                    if (reject) {
                        reject('resolve');
                    }
                }
            });
        },
        // 保存 or 提交
        SubmitForm() {
            if (!this.$refs.material.mainrules()) {
                return false;
            }
            if (!this.$refs.craft.craftrules()) {
                return false;
            }
            if (!this.$refs.excrecord.excrul()) {
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
            if (!this.cookingNoId || this.cookingNoId === '') {
                this.$warningToast('请选择连续蒸煮号');
                return false;
            }
            if (str === 'submit') {
                this.$set(this.formHeader, 'submitStatus', 'submit');
                this.succmessage = '提交成功';
            } else {
                this.$set(this.formHeader, 'submitStatus', 'saved');
            }
            const excSaveNet = new Promise((resolve, reject) => {
                this.$refs.excrecord.saveOrSubmitExc(
                    {
                        orderId: this.formHeader.orderId,
                        orderHouseId: this.formHeader.orderHouseId,
                        blongProc: this.formHeader.processId
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
                        orderHouseId: this.formHeader.orderHouseId,
                        blongProc: this.formHeader.processId
                    },
                    str,
                    resolve,
                    reject
                );
            });
            const net100 = new Promise((resolve) => {
                this.UpdateHeader(str, resolve);
            });
            const net101 = new Promise((resolve) => {
                this.UpdateHeaderCreator(str, resolve);
            });
            const net0 = new Promise((resolve, reject) => {
                this.$refs.material.savemains(resolve, reject);
            });
            const net1 = new Promise((resolve, reject) => {
                this.$refs.material.savewheats(resolve, reject);
            });
            const net2 = new Promise((resolve, reject) => {
                this.$refs.material.savepulps(resolve, reject);
            });
            const net99 = Promise.all([net100, net101, net0, net1, net2, excSaveNet, textSaveNet]);
            net99.then(() => {
                new Promise((resolve, reject) => {
                    this.$refs.craft.updatezhu(resolve, reject);
                }).then(() => {
                    const net5 = new Promise((resolve, reject) => {
                        this.$refs.craft.updatelishui(resolve, reject);
                    });
                    const net6 = new Promise((resolve, reject) => {
                        this.$refs.craft.updatezhengzhu(resolve, reject);
                    });
                    const net7 = new Promise((resolve, reject) => {
                        this.$refs.craft.updatehunhe(resolve, reject);
                    });
                    const net3 = new Promise((resolve, reject) => {
                        this.$refs.material.savestauts(resolve, reject);
                    });
                    Promise.all([net5, net6, net7, net3])
                        .then(() => {
                            this.$notify({
                                title: '成功',
                                message: this.succmessage,
                                type: 'success'
                            });
                            this.GetheadList();
                            this.isRedact = false;
                        })
                        .catch(() => {
                            this.$errorToast('网络请求失败，请刷新重试');
                        });
                });
            });
        },
        setApplyMaterielState(status) {
            this.applyMaterielState = status;
            this.tabs[0].status = status;
            // 强制刷新tabs
            this.$refs.dataEntry.updateTabs();
        },
        setApplyCraftState(status) {
            this.applyCraftState = status;
            this.tabs[1].status = status;
            // 强制刷新tabs
            this.$refs.dataEntry.updateTabs();
        }
    }
};
</script>

<style>
.rowDel {
    display: none;
}
</style>
<style lang="scss" scoped>
.input_bommom {
    width: 147px;
    overflow: hidden;
    line-height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: solid 1px #d8d8d8;
}
.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 8px;
}
.searchCard {
    .el-button--primary,
    .el-button--primary:focus {
        color: #000;
        background-color: #fff;
        border-color: #d9d9d9;
    }
    .el-button--primary:hover {
        color: #fff;
        background-color: #1890ff;
    }
    .el-button--primary:first-child {
        color: #fff;
        background-color: #1890ff;
        border-color: #1890ff;
    }
}
#DaatTtabs {
    overflow: hidden;
    border-radius: 15px;
}
.htitle {
    margin: 0 0 10px;
}
</style>
