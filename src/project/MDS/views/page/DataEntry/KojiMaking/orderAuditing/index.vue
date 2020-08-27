<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatus"
            :tabs="tabs"
            submit-auth="sys:midTimeSheet:udpate"
            :not-permit-submit-status="notPermitSubmitStatus"
            :submit-rules="submitRules"
            :submit-datas="submitDatas"
            :only-submit="true"
            @success="getList"
        >
            <template slot="1">
                <div>
                    <mds-card title="报工工时" :name="'baogonggognshi'">
                        <template slot="titleBtn">
                            <div style="float: right;">
                                <el-button v-if="formHeader.orderStatus !== 'submit' && formHeader.orderStatus !== 'checked'&& isAuth('sys:midTimeSheet:udpate')" type="primary" style="float: right;" size="small" @click="GetTime">
                                    获取工时
                                </el-button>
                            </div>
                        </template>
                        <el-table header-row-class-name="tableHead" class="newTable" :data="workHourList" border tooltip-effect="dark">
                            <el-table-column type="index" width="55" label="序号" fixed />
                            <el-table-column label="工序" min-width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.productLineName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="曲房" min-width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.houseName }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="准备工时"
                                min-width="100"
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.confActivity1 }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="60" label="单位">
                                <template slot-scope="scope">
                                    {{ scope.row.confActiUnit1 }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="140" label="人工工时">
                                <template slot-scope="scope">
                                    {{ scope.row.confActivity3 }}
                                </template>
                            </el-table-column>
                            <el-table-column label="单位" min-width="60">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.confActiUnit3 }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="机器工时" min-width="140">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.confActivity2" size="small" type="number" placeholder="手工录入" :disabled="scope.row.disabled" />
                                </template>
                            </el-table-column>
                            <el-table-column label="单位" min-width="60">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.confActiUnit2 }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="备注">
                                <template slot-scope="scope">
                                    {{ scope.row.remark }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                min-width="145"
                            >
                                <template slot-scope="scope">
                                    <el-button v-if="scope.row.disabled && isAuth('sys:midTimeSheet:udpate')" style="float: left;" type="primary" size="small" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit'" @click="enbaleEdit(scope.row)">
                                        编辑
                                    </el-button>
                                    <el-button v-if="!scope.row.disabled && isAuth('sys:midTimeSheet:udpate')" style="float: left;" type="primary" size="small" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit'" @click="saveWorkHour(scope.row)">
                                        保存
                                    </el-button>
                                    <el-button v-if="isAuth('sys:midTimeSheet:udpate')" style="float: right;" type="primary" size="small" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit' || (scope.row.status === 'noPass' && scope.row.isVerBack === '1')" @click="goBack('报工工时', scope.row)">
                                        退回
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </mds-card>
                    <auditLog :table-data="workHourAuditList" />
                </div>
            </template>
            <template slot="2">
                <div>
                    <mds-card title="生产入库" :name="'shengchanruku'">
                        <el-table header-row-class-name="tableHead" class="newTable" :data="inStockList" border tooltip-effect="dark">
                            <el-table-column type="index" min-width="55" label="序号" fixed />
                            <el-table-column label="制曲日期" min-width="100" prop="inKjmDate" />
                            <el-table-column label="曲房" min-width="100" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.houseName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="豆粕量(KG)" min-width="100">
                                <template slot-scope="scope">
                                    {{ scope.row.pulpWeight }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="麦粉量(KG)"
                                min-width="100"
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.wheatWeight }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="90" label="盐水量">
                                <template slot-scope="scope">
                                    {{ scope.row.saltWaterWeight }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="180" label="入库物料">
                                <template slot-scope="scope">
                                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="入库量" min-width="90">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.sauceWeight }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="入库批次" min-width="120">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.batch }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="单位" min-width="60">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.unit }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作人" min-width="145">
                                <template slot-scope="scope">
                                    {{ scope.row.changer }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作时间" min-width="160">
                                <template slot-scope="scope">
                                    {{ scope.row.changed }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="80"
                            >
                                <template slot-scope="scope">
                                    <el-button v-if="isAuth('sys:midTimeSheet:udpate')" style="float: right;" type="primary" size="small" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit' || (scope.row.status === 'noPass' && scope.row.isVerBack === '1')" @click="goBack('生产入库', scope.row)">
                                        退回
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row style="margin-top: 20px;">
                            <el-col>
                                <div>
                                    <span>入库数合计：</span>{{ totalInstock }} L
                                    <span>&nbsp;&nbsp;实际入库数：</span><el-input v-model.number="realInAmount" size="small" type="number" style="display: inline-block; width: 150px;" :disabled="!isEdit" /> L
                                </div>
                            </el-col>
                        </el-row>
                    </mds-card>
                </div>
            </template>
            <template slot="3">
                <div>
                    <mds-card title="物料领用" :name="'shengchanruku'">
                        <el-table header-row-class-name="tableHead" class="newTable" :data="applyMaterieList" border tooltip-effect="dark">
                            <el-table-column type="index" width="55" label="序号" fixed />
                            <el-table-column label="制曲日期" min-width="100" prop="inKjmDate" />
                            <el-table-column label="曲房" min-width="90" :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.houseName }}
                                </template>
                            </el-table-column>
                            <el-table-column label="物料" show-overflow-tooltip min-width="150">
                                <template slot-scope="scope">
                                    {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="领用容器"
                                min-width="120"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    {{ scope.row.holderName }}
                                </template>
                            </el-table-column>
                            <el-table-column min-width="140" label="批次">
                                <template slot-scope="scope">
                                    <el-input v-model.number="scope.row.batch" size="small" maxlength="10" placeholder="手工录入" :disabled="scope.row.disabled" />
                                </template>
                            </el-table-column>
                            <el-table-column min-width="90" label="数量">
                                <template slot-scope="scope">
                                    {{ scope.row.entryQnt }}
                                </template>
                            </el-table-column>
                            <el-table-column label="单位" min-width="60">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.entryUom ? (scope.row.entryUom === 'box' ? '盒' : scope.row.entryUom === 'L' ? '升' : scope.row.entryUom === 'KG' ? '千克' : scope.row.entryUom) : '' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作人" min-width="145">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.changer }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作时间" min-width="160">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.changed }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="操作" min-width="80">
                                <template slot-scope="scope">
                                    <em v-if="scope.row.materialCode === 'M040000001'">
                                        <el-button v-if="scope.row.disabled" style="float: right;" type="primary" size="small" :disabled="!(scope.row.materialCode === 'M040000001' && (scope.row.status === 'saved' || scope.row.status === 'noPass'))" @click="materialEnbaleEdit(scope.row)">编辑</el-button>
                                        <el-button v-if="!scope.row.disabled" style="float: right;" type="primary" size="small" @click="materialSaveWorkHour(scope.row)">保存</el-button>
                                    </em>
                                    <em v-else>
                                        <el-button v-if="isAuth('sys:midTimeSheet:udpate')" style="float: right;" type="primary" size="small" :disabled="scope.row.status === 'checked' || scope.row.status === 'submit' || (scope.row.status === 'noPass' && scope.row.isVerBack === '1')" @click="goBack('物料领用', scope.row)">退回</el-button>
                                    </em>
                                </template>
                            </el-table-column>
                        </el-table>
                    </mds-card>
                    <auditLog :table-data="applyMaterieAuditList" />
                </div>
            </template>
            <template slot="4">
                <div>
                    <mds-card title="文本记录" :name="'shengchanruku'">
                        <text-record ref="textrecord" :is-redact="true" />
                    </mds-card>
                </div>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { KJM_API } from '@/api/api';
import TextRecord from '@/views/components/TextRecord.vue';
import AuditLog from '@/views/components/AuditLog.vue';
import { WorkHour, InStock, Material } from '../entity/WorkHour';
import { AsyncHook } from '@/utils/index.js';
@Component({
    components: {
        TextRecord,
        AuditLog
    }
})
export default class OrderAuditing extends Vue {

    $refs: {
        dataEntry: HTMLFormElement;
        tabs: HTMLFormElement;
    }

    headerBase = [
        {
            type: 'p',
            icon: 'factory-shengchanchejian',
            label: '生产车间',
            value: 'workShopName'
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
            label: '品项',
            value: ['materialCode', 'materialName']
        },
        {
            type: 'p',
            icon: 'factory-dingdan',
            label: '计划产量',
            value: 'planOutput'
        },
        {
            type: 'p',
            icon: 'factory-riqi',
            label: '入 罐 号 ',
            value: 'inPotNoName'
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
            type: 'tooltip',
            icon: 'factory-riqi',
            label: '提交时间',
            value: 'changed'
        }
    ]

    tabs = [
        {
            label: '报工工时',
            status: '未录入'
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
    ]

    notPermitSubmitStatus = ['已同步', '已拆分', 'saved', 'submit', 'checked']

    formHeader = {
        orderId: '',
        workShop: '',
        productDate: '',
        orderNo: '',
        materialCode: '',
        materialName: '',
        planOutput: 0,
        orderStatus: '',
        workShopName: '',
        orderDate: '',
        inPotNo: '',
        inPotNoId: '',
        inPotNoName: '',
        inKjmDate: '',
        // 实际入库值
        realInAmount: 0
    }

    newForHeader = [];
    workHourList: WorkHour[] = [];
    workHourAuditList = [];
    inStockList: InStock[] = [];
    inStockAuditList = [];
    applyMaterieList: Material[] = [];
    applyMaterieAuditList = [];
    // 实际入库数量
    realInAmount = 0;
    activeName = '1';
    // 报工工时状态
    readyState = '';
    // 生产入库状态
    inStorageState = '';
    // 物料申请状态
    applyMaterielState = '';
    // inStockBatch = 0

    mounted() {
        this.getList();
    }

    get totalInstock(): number {
        let total = 0;
        for (const ele of this.inStockList) {
            total += parseFloat(ele.sauceWeight);
        }
        return parseInt(total.toString(), 10);
    }

    GetTime() {
        Vue.prototype.$http(`${KJM_API.GETKJMAKINGCHECKTIME_API}`, 'POST', this.newForHeader).then(({ data }) => {
            if (data.code === 0) {
                this.$notify({
                    title: '成功',
                    message: '成功',
                    type: 'success'
                });
                this.getList();
            } else {
                this.$notify.error({ title: '错误', message: data.msg });
            }
        });
    }

    /* eslint-disable @typescript-eslint/no-explicit-any*/
    getList() {
        // 全部页签页返回数据之后强制刷新tabs
        Promise.all([this.getFormHeader(), this.getWorkHourList(), this.getInStockList(), this.getMaterialList()]).then(() => {
            // 如果订单状态是 submit/noPass/checked 实际入库值从表头取， 否则自动从storeageList计算出
            if (this.formHeader.orderStatus === 'submit' || this.formHeader.orderStatus === 'noPass' || this.formHeader.orderStatus === 'checked') {
                this.realInAmount = this.formHeader.realInAmount;
            } else {
                this.realInAmount = this.totalInstock;
            }
            console.log('realInAmount: ' + this.realInAmount);
            // const tabs: any = this.$refs.tabs;
            // tabs.handleTabClick(tabs.panes[parseInt(tabs.currentName, 10) - 1]);
        });
    }
    /* eslint-enable @typescript-eslint/no-explicit-any*/

    get isEdit() {
        return this.formHeader.orderStatus !== 'submit' && this.formHeader.orderStatus !== 'checked';
    }

    /* eslint-disable @typescript-eslint/no-explicit-any*/
    tabClick(val: any) {
        const tabs: any = this.$refs.tabs;
        tabs.setCurrentName(val.name);
    }

    /* eslint-enable @typescript-eslint/no-explicit-any*/
    async getFormHeader() {
        const orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId;
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGHEAD_API}`, 'POST', { orderId })
            .then(res => {
                if (res.data.code === 0 && res.data.list && res.data.list.length > 0) {
                    const item = res.data.list[0];
                    this.newForHeader = res.data.list;
                    Object.assign(this.formHeader, item);
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: res.data.code === 0 ? '数据异常，请稍后再试' : res.data.msg
                    });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return 'ooooo';
    }

    async getWorkHourList() {
        const orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId;
        this.workHourList = [];
        this.workHourAuditList = [];
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKTIME_API}`, 'POST', { orderId })
            .then(res => {
                if (res.data.code === 0) {
                    let no = 0;
                    let sub = 0;
                    let che = 0;
                    let sav = 0;
                    let tobe = 0;
                    let inState = '';
                    for (const item of res.data.list) {
                        const workHour = new WorkHour(item);
                        this.workHourList.push(workHour);
                        if (item.status === 'noPass') {
                            no = no + 1;
                        } else if (item.status === 'submit') {
                            sub = sub + 1;
                        } else if (item.status === 'checked') {
                            che = che + 1;
                        } else if (item.status === 'saved') {
                            sav = sav + 1;
                        } else if (item.status === 'toBeAudited') {
                            ++tobe;
                        }
                    }
                    this.workHourAuditList = res.data.vrlist;
                    if (no > 0) {
                        inState = 'noPass';
                    } else if (tobe > 0) {
                        inState = 'toBeAudited';
                    } else if (sub > 0) {
                        inState = 'submit';
                    } else if (sav > 0) {
                        inState = 'saved';
                    } else if (che > 0) {
                        inState = 'checked';
                    }
                    this.readyState = inState;
                    this.tabs[0].status = this.readyState;
                    this.$refs.dataEntry.updateTabs();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return 'aaaaa';
    }

    async getInStockList() {
        const orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId;
        this.inStockList = [];
        this.inStockAuditList = [];
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKSTORAGE_API}`, 'POST', { orderId })
            .then(res => {
                if (res.data.code === 0) {
                    let no = 0;
                    let sub = 0;
                    let che = 0;
                    let sav = 0;
                    let tobe = 0;
                    let inState = '';
                    for (const item of res.data.list) {
                        const instorage = new InStock(item);
                        this.inStockList.push(instorage);
                        if (item.status === 'noPass') {
                            no = no + 1;
                        } else if (item.status === 'submit') {
                            sub = sub + 1;
                        } else if (item.status === 'checked') {
                            che = che + 1;
                        } else if (item.status === 'saved') {
                            sav = sav + 1;
                        } else if (item.status === 'toBeAudited') {
                            ++tobe;
                        }
                    }
                    this.inStockAuditList = res.data.vrlist;
                    if (no > 0) {
                        inState = 'noPass';
                    } else if (tobe > 0) {
                        inState = 'toBeAudited';
                    } else if (sub > 0) {
                        inState = 'submit';
                    } else if (sav > 0) {
                        inState = 'saved';
                    } else if (che > 0) {
                        inState = 'checked';
                    }
                    this.inStorageState = inState;
                    this.tabs[1].status = inState;
                    this.$refs.dataEntry.updateTabs();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return 'bbbb';
    }

    async getMaterialList() {
        const orderId = this.$store.state.common.ZQWorkshop.checkParams.orderId;
        const orderNo = this.$store.state.common.ZQWorkshop.checkParams.orderNo;
        const orderStatus = this.$store.state.common.ZQWorkshop.checkParams.orderStatus;
        this.applyMaterieList = [];
        this.applyMaterieAuditList = [];
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKMATERIALE_API}`, 'POST', {
                orderId,
                orderNo,
                orderStatus
            })
            .then(res => {
                let no = 0;
                let sub = 0;
                let che = 0;
                let sav = 0;
                let tobe = 0; // 待审核
                let inState = '';
                if (res.data.code === 0) {
                    for (const item of res.data.list) {
                        const m = new Material(item);
                        this.applyMaterieList.push(m);
                        if (item.status === 'noPass') {
                            no = no + 1;
                        } else if (item.status === 'submit') {
                            sub = sub + 1;
                        } else if (item.status === 'checked') {
                            che = che + 1;
                        } else if (item.status === 'saved') {
                            sav = sav + 1;
                        } else if (item.status === 'toBeAudited') {
                            ++tobe;
                        }
                    }
                    this.applyMaterieAuditList = res.data.vrlist;
                    if (no > 0) {
                        inState = 'noPass';
                    } else if (tobe > 0) {
                        inState = 'toBeAudited';
                    } else if (sub > 0) {
                        inState = 'submit';
                    } else if (sav > 0) {
                        inState = 'saved';
                    } else if (che > 0) {
                        inState = 'checked';
                    }
                    this.applyMaterielState = inState;
                    this.tabs[2].status = inState;
                    this.$refs.dataEntry.updateTabs();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return 'hhhhh';
    }

    enbaleEdit(row) {
        row.disabled = false;
    }

    saveWorkHour(row) {
        row.status = 'saved';
        Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKTIMESAVE_API}`, 'POST', row)
            .then(res => {
                if (res.data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '数据保存成功',
                        type: 'success'
                    });
                    this.getList();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    goBack(flag, row) {
        row.status = 'noPass';
        if (flag === '报工工时') {
            this.timeGoBack(row);
        } else if (flag === '生产入库') {
            this.storageGoBack(row);
        } else if (flag === '物料领用') {
            this.materialGoBack(row);
        }
    }

    timeGoBack(row) {
        const params = Object.assign({}, row, {
            workShop: this.formHeader.workShop,
            inKjmDate: this.formHeader.inKjmDate
        });
        Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKTIMEBACK_API}`, 'POST', params)
            .then(res => {
                if (res.data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '数据回退成功',
                        type: 'success'
                    });
                    this.getList();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    storageGoBack(row) {
        Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKSTORAGEBACK_API}`, 'POST', row)
            .then(res => {
                if (res.data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '数据回退成功',
                        type: 'success'
                    });
                    this.getList();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    materialGoBack(row) {
        Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKMATERIALEBACK_API}`, 'POST', row)
            .then(res => {
                if (res.data.code === 0) {
                    this.$notify({
                        title: '成功',
                        message: '数据回退成功',
                        type: 'success'
                    });
                    this.getList();
                } else {
                    this.$notify.error({ title: '错误', message: res.data.msg });
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    materialEnbaleEdit(row) {
        row.disabled = false;
    }

    materialSaveWorkHour(row) {
        row.status = 'saved';
        Vue.prototype
            .$http(`${KJM_API.KJMAKING_MATERIAL_SAVE_API}`, 'POST', row)
            .then(res => {
                if (res.data.code === 0) {
                    Vue.prototype.$successToast('保存成功');
                    this.getList();
                } else {
                    Vue.prototype.$errorToast(res.data.msg);
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
    }

    submitForm() {
        this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (!this.validateTime()) {
                return;
            }
            if (this.realInAmount === 0 || !this.realInAmount) {
                Vue.prototype.$errorToast('请确认实际入库数');
                return false;
            }
            // Promise.all([this.timeSubmit(), this.storageSubmit(), this.materialSubmit()]).then(() => {
            //     Promise.all([this.headSubmit()]).then(() => {
            //         this.$notify({
            //             title: '成功',
            //             message: '提交成功',
            //             type: 'success'
            //         });
            //         this.getList();
            //     });
            // });
        }).catch(() => {
            // this.$infoToast('已取消删除');
        });
    }

    validateTime() {
        if (!this.workHourList || this.workHourList.length === 0) {
            Vue.prototype.$warningToast('报工工时无数据，不可提交');
            return false;
        }
        let sum = 0;
        // let iskong = 0
        for (const item of this.workHourList) {
            let sole;
            if (item.confActivity2 === null || item.confActivity2 === '') {
                sole = 0;
            } else {
                sole = item.confActivity2;
            }
            sum += sole;
        }
        if (sum <= 0) {
            Vue.prototype.$warningToast('机器工时之和不能小于0');
            return false;
        }
        // for (let item of this.inStockList) {
        //   if (this.inStockBatch !== 0 && item.batch !== this.inStockBatch) {
        //     Vue.prototype.$warningToast('生产入库-入库批次不一致,请确认')
        //     return false
        //   } else {
        //     this.inStockBatch = item.batch
        //   }
        // }
        // for (let item of this.workHourList) {
        //   if (item.confActivity2 === '' || item.confActivity2 === null) {
        //     iskong = 1
        //     Vue.prototype.$warningToast('机器工时不能为空')
        //     return false
        //   }
        //   if (!isNaN(item.confActivity2)) {
        //     sum += item.confActivity2
        //   }
        // }
        // if (iskong === 0 && sum <= 0) {
        //   Vue.prototype.$warningToast('机器工时之和不能小于0')
        //   return false
        // }
        return true;
    }

    validateTimes() {
        let ty = true;
        if (!this.workHourList || this.workHourList.length === 0) {
            Vue.prototype.$warningToast('报工工时无数据，不可提交');
            ty = false;
            return false;
        }
        let sum = 0;
        // let iskong = 0
        for (const item of this.workHourList) {
            let sole;
            if (item.confActivity2 === null || item.confActivity2 === '') {
                sole = 0;
            } else {
                sole = item.confActivity2;
            }
            sum += sole;
        }
        if (sum <= 0) {
            Vue.prototype.$warningToast('机器工时之和不能小于0');
            ty = false;
            return false;
        }
        return ty;
    }

    async timeSubmit(resolve) {
        let realTotal;
        if (this.realInAmount > 0) {
            realTotal = this.realInAmount;
        } else {
            realTotal = this.totalInstock;
        }
        // let realTotal = this.realInAmount
        this.workHourList.forEach(function(item) {
            item.status = 'submit';
            item.countOutput = realTotal;
            item.realInAmount = realTotal;
            item.countOutputUnit = 'L';
        });
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKTIMESUBMIT_API}`, 'POST', this.workHourList)
            .then(res => {
                if (res.data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '报工工时提交失败：' + res.data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return '';
    }

    async headSubmit(resolve) {
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKHEADSUBMIT_API}`, 'POST', {
                orderId: this.formHeader.orderId,
                orderHouseId: this.inStockList[0].orderHouseId,
                countOutPut: this.inStockList[0].countOutput,
                realInAmount: this.inStockList[0].realInAmount,
                countOutputUnit: 'L'
            })
            .then(res => {
                if (res.data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '表头提交失败：' + res.data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return '';
    }

    async storageSubmit(resolve) {
        const total = this.totalInstock;
        // let realTotal = this.realInAmount
        let realTotal;
        if (this.realInAmount > 0) {
            realTotal = this.realInAmount;
        } else {
            realTotal = this.totalInstock;
        }
        this.inStockList.forEach(function(item) {
            item.status = 'submit';
            item.countOutput = total;
            item.realInAmount = realTotal;
            item.countOutputUnit = 'L';
        });
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKSTORAGESUBMIT_API}`, 'POST', this.inStockList)
            .then(res => {
                if (res.data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '生产入库提交失败：' + res.data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return '';
    }

    async materialSubmit(resolve) {
        this.applyMaterieList.forEach(function(item) {
            item.status = 'submit';
        });
        await Vue.prototype
            .$http(`${KJM_API.KJMAKINGCHECKMATERIALESUBMIT_API}`, 'POST', this.applyMaterieList)
            .then(res => {
                if (res.data.code !== 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '物料领用提交失败：' + res.data.msg
                    });
                }
                if (resolve) {
                    resolve('resolve');
                }
            })
            .catch(err => {
                console.log('catch data::', err);
            });
        return '';
    }

    submitRules() {
        return [this.validateTimes];
    }

    submitDatas() {
        if (this.realInAmount === 0 || !this.realInAmount) {
            Vue.prototype.$errorToast('请确认实际入库数');
            return false;
        }
        return AsyncHook(
            [
                [this.timeSubmit, []],
                [this.storageSubmit, []],
                [this.materialSubmit, []]
            ],
            [
                [this.headSubmit, []]
            ]
        );
    }

    // // 报工工时
    // setReadyStatus(status) {
    //     this.readyState = status;
    // }

    // // 入库状态
    // setInStorageState(status) {
    //     this.inStorageState = status;
    // }

    // // 物料状态
    // setApplyMaterielState(status) {
    //     this.applyMaterielState = status;
    // }
}
</script>
