<template>
    <div class="header_main">
        <el-card class="searchCards searchCard">
            <el-row type="flex">
                <el-col>
                    <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="marbottom multi_row">
                        <el-form-item label="生产车间：">
                            <p class="input_bottom">
                                {{ formHeader.workShopName }}
                            </p>
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <p
                                :style="{
                                    color: formHeader.exportMaterial !== '' ? '#FFBF00' : '',
                                }"
                                class="input_bottom"
                            >
                                {{ formHeader.orderNo }}
                            </p>
                        </el-form-item>
                        <el-form-item label="生产品项：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.materialCode + ' ' + formHeader.materialName" placement="top-start">
                                <p
                                    :style="{
                                        'font-size': '12px',
                                        color: formHeader.exportMaterial !== '' ? '#FFBF00' : '',
                                    }"
                                    class="input_bottom"
                                >
                                    {{ (formHeader.materialCode || '') + ' ' + (formHeader.materialName || '') }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="计划产量：">
                            <p class="input_bottom">
                                {{ (formHeader.planOutput || '') + ' ' + (formHeader.outputUnit || '') }}
                            </p>
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <p class="input_bottom">
                                {{ formHeader.orderDate }}
                            </p>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.productDate" size="small" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 145px;" />
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p class="input_bottom">
                                {{ formHeader.changer }}
                            </p>
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <p class="input_bottom">
                                {{ formHeader.changed }}
                            </p>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col style="max-width: 160px; height: 30px;">
                    <div
                        style=" float: right; padding-top: 0; font-size: 14px; line-height: 25px;"
                        :style="{
                            color: orderStatus === 'noPass' ? 'red' : '',
                        }"
                    >
                        <span
                            style=" float: left; width: 5px; height: 5px; margin-top: 7px; margin-right: 3px; background: #1890ff; border-radius: 50%;"
                            :style="{
                                background: orderStatus === 'noPass' ? 'red' : '#1890FF',
                            }"
                        />订单状态：{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : '未录入' }}
                    </div>
                </el-col>
            </el-row>
            <div class="toggleSearchBottom">
                <i class="el-icon-caret-top" />
            </div>
        </el-card>
        <div class="main" style="padding: 0;">
            <div class="tableCard">
                <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                    <i class="el-icon-caret-bottom" />
                </div>
            </div>
            <el-tabs ref="tabs" v-model="activeName" type="border-card" class="NewDaatTtabs tabsPages" @tab-click="tabClick">
                <el-tab-pane name="1">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="EquState === 'noPass' ? '不通过' : EquState === 'saved' ? '已保存' : EquState === 'submit' ? '已提交' : EquState === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: EquState === 'noPass' ? 'red' : '',
                                }"
                            >设备工时</el-button>
                        </el-tooltip>
                    </span>
                    <Equ-workinghours ref="equworkinghours" :is-redact="isRedact" :form-header="formHeader" @setEquState="setEquState" />
                </el-tab-pane>
                <el-tab-pane name="2">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="caftStatus === 'noPass' ? '不通过' : caftStatus === 'saved' ? '已保存' : caftStatus === 'submit' ? '已提交' : caftStatus === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: caftStatus === 'noPass' ? 'red' : '',
                                }"
                            >工艺控制</el-button>
                        </el-tooltip>
                    </span>
                    <Craft ref="craft" :is-redact="isRedact" @setCraftStatus="setCraftStatus" />
                </el-tab-pane>
                <el-tab-pane name="3">
                    <span slot="label" class="spanview">
                        <el-button>异常记录</el-button>
                    </span>
                    <exc-record ref="excrecord" :is-redact="isRedact" :order="formHeader" />
                </el-tab-pane>
                <el-tab-pane name="4">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="materialStatus === 'noPass' ? '不通过' : materialStatus === 'saved' ? '已保存' : materialStatus === 'submit' ? '已提交' : materialStatus === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: materialStatus === 'noPass' ? 'red' : '',
                                }"
                            >物料领用</el-button>
                        </el-tooltip>
                    </span>
                    <Material ref="material" :is-redact="isRedact" @setMaterialStatus="setMaterialStatus" />
                </el-tab-pane>
                <el-tab-pane name="5">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="instorageState === 'noPass' ? '不通过' : instorageState === 'saved' ? '已保存' : instorageState === 'submit' ? '已提交' : instorageState === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: instorageState === 'noPass' ? 'red' : '',
                                }"
                            >生产入库</el-button>
                        </el-tooltip>
                    </span>
                    <in-storage ref="instorage" :is-redact="isRedact" :form-header="formHeader" @setInstorageState="setInstorageState" />
                </el-tab-pane>
                <el-tab-pane name="6">
                    <span slot="label" class="spanview">
                        <el-button>文本记录</el-button>
                    </span>
                    <text-record ref="textrecord" :is-redact="isRedact" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <redact-box>
            <template slot="button">
                <el-button v-if="orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('filter:instorage:mySaveOrUpdate')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact" style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('filter:instorage:mySaveOrUpdate')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('filter:instorage:submit')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { FILTRATION_API } from '@/api/api';
import { headanimation } from '@/net/validate';
import EquWorkinghours from './common/equWorkingHours';
import Craft from './common/craft';
import Material from './common/material';
import InStorage from './common/inStorage';
import ExcRecord from '@/views/components/ExcRecord';
import TextRecord from '@/views/components/TextRecord';
export default {
    name: 'FiltrationDetail',
    components: {
        EquWorkinghours,
        Craft,
        Material,
        InStorage,
        ExcRecord,
        TextRecord
    },
    data() {
        return {
            formHeader: {},
            isRedact: false,
            orderStatus: '',
            instorageState: '',
            EquState: '',
            caftStatus: '',
            materialStatus: '',
            activeName: '1',
            equWorkingHolderList: [],
            materialHolderList: []
        };
    },
    watch: {
        instorageState() {
            console.log('status:' + this.instorageState);
        }
    },
    mounted() {
        headanimation(this.$);
        this.GetOrder();
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        setInstorageState(status) {
            this.$refs.instorage.GetholderList(this.formHeader.factory, this.formHeader.workShop, this.formHeader.orderId);
            this.instorageState = status;
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        setEquState(status) {
            this.EquState = status;
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        setCraftStatus(status) {
            this.caftStatus = status;
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        setMaterialStatus(status) {
            this.materialStatus = status;
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
        },
        GetOrder() {
            this.$http(`${FILTRATION_API.FILTER_HOME_LIST_API}`, 'POST', {
                orderNo: this.$store.state.common.orderNo,
                orderType: '1'
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formHeader = data.list[0];
                    this.orderStatus = data.list[0].orderStatus;
                    this.$refs.instorage.getList();
                    const params = {
                        orderId: this.formHeader.orderId,
                        deptId: this.formHeader.productLine,
                        factory: this.formHeader.factory,
                        workShop: this.formHeader.workShop,
                        orderNo: this.formHeader.orderNo
                    };
                    this.$refs.craft.GetList(params);
                    this.$refs.equworkinghours.GetList(params);
                    this.$refs.equworkinghours.GetHolderList(params);
                    this.$refs.material.GetList(params);
                    this.$refs.material.GetHolderList(params);
                    this.$refs.excrecord.GetequipmentType(this.formHeader.productLine);
                    this.$refs.excrecord.getDataList(this.formHeader.factory);
                    this.$refs.excrecord.GetExcDate(this.formHeader.orderId);
                    this.$refs.textrecord.GetText(this.formHeader.orderId);
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 修改表头
        updateHead(str, resolve, reject) {
            this.formHeader.orderStatus = str;
            this.formHeader.countOutput = this.$refs.instorage.countOutputNum;
            this.$http(`${FILTRATION_API.FILTER_HOME_UPDATE_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else if (reject) {
                        reject('表头保存' + data.msg);
                    }
            });
        },
        // 保存 or 提交
        SubmitForm() {
            if (!this.$refs.equworkinghours.Readyrules()) {
                return false;
            }
            if (this.formHeader.productLineName !== '脱盐' && !this.$refs.craft.Readyrules()) {
                return false;
            }
            if (!this.$refs.material.Readyrules()) {
                return false;
            }
            if (!this.$refs.material.ReadyRepertoryRules()) {
                return false;
            }
            if (!this.$refs.instorage.countOutputNum) {
                this.$warningToast('入库数为0，不能提交');
                return false;
            }
            const materialHolderList = this.$refs.material.GetmaterialList()
            const equWorkingHolderList = this.$refs.equworkinghours.GetequWorkingList()
            const equWorkingHolderLists = equWorkingHolderList.filter(xy => xy.content === '过滤' || xy.content === '脱盐')
            if (equWorkingHolderLists.length !== 0) {
                const diffArr = [...equWorkingHolderLists].filter(x => [...materialHolderList].every(y => (y.holderId !== x.holderId)));
                const diffArrs = [...materialHolderList].filter(x => [...equWorkingHolderLists].every(y => (y.holderId !== x.holderId)));
                if (diffArr.length !== 0 || diffArrs.length !== 0) {
                    this.$warningToast('设备工时与物料领用罐号须一致');
                    return false;
                }
            }
            // this.$warningToast('可正常提交');
            // return false;
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.formHeader.countOutput = this.$refs.instorage.countOutputNum;
                const params = [this.formHeader, this.$refs.equworkinghours.dataList];
                this.$http(`${FILTRATION_API.FILTER_EQUWORKINGHOURS_SUBMIT}`, 'POST', params).then(({ data }) => {
                    if (data.code === 0) {
                        this.savedOrSubmitForm('submit');
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoToast('已取消删除');
            });
        },
        savedOrSubmitForm(str) {
            if (!this.$refs.material.ReadyRepertoryRules()) {
                return false;
            }
            const net101 = new Promise((resolve, reject) => {
                this.$refs.equworkinghours.SaveEquWorking(resolve, reject);
            });
            const net102 = new Promise((resolve) => {
                this.$refs.craft.SaveTech(str, resolve);
            });
            const headUpdate = new Promise((resolve, reject) => {
                this.updateHead(str, resolve, reject);
            });
            const net103 = new Promise((resolve) => {
                this.$refs.craft.SaveMaterial(str, resolve);
            });
            const net104 = new Promise((resolve) => {
                this.$refs.material.SaveMaterial('saved', resolve);
            });
            const excSaveNet = new Promise((resolve, reject) => {
                this.$refs.excrecord.saveOrSubmitExc(this.formHeader.orderId, str, resolve, reject);
            });
            const textSaveNet = new Promise((resolve, reject) => {
                this.$refs.textrecord.UpdateText(this.formHeader, str, resolve, reject);
            });
            const inStorage = new Promise((resolve, reject) => {
                this.$refs.instorage.UpdateIn(str, resolve, reject);
            });
            Promise.all([headUpdate, net101, net102, net103, net104, inStorage, excSaveNet, textSaveNet])
                .then(() => {
                    if (str === 'saved') {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        this.GetOrder();
                        this.isRedact = false;
                    } else {
                        const aidSubmit = new Promise((resolve, reject) => {
                            this.$refs.craft.aidSubmit(str, this.formHeader.workShop, resolve, reject);
                        });
                        Promise.all([aidSubmit])
                            .then(() => {
                                const net201 = new Promise((resolve) => {
                                    this.$refs.craft.SubmitMaterial(str, resolve);
                                });
                                const net202 = new Promise((resolve) => {
                                    this.$refs.material.SaveMaterial(str, resolve);
                                });
                                const net203 = new Promise((resolve, reject) => {
                                    this.$refs.equworkinghours.SubmitEquWorking(str, resolve, reject);
                                });
                                Promise.all([net201, net202, net203])
                                    .then(() => {
                                        this.$notify({
                                            title: '成功',
                                            message: '提交成功',
                                            type: 'success'
                                        });
                                        this.GetOrder();
                                        this.isRedact = false;
                                    })
                                    .catch(() => {
                                        this.$errorToast('1网络请求失败，请刷新重试');
                                    });
                            })
                            .catch(() => {
                                this.$errorToast('2网络请求失败，请刷新重试');
                            });
                    }
                })
                .catch((reason) => {
                    this.$errorToast('网络请求失败，请刷新重试' + reason);
                });
        },
        materilaHoldList(holderList) {
            this.materialHolderList = holderList
        }
    }
};
</script>

<style lang="scss">
.input_bottom {
    width: 150px;
    height: 33px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border-bottom: 1px solid rgba(216, 216, 216, 1);
}
</style>
