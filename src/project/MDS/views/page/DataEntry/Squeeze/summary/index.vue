<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="flex">
                <el-col :span="18">
                    <el-form :inline="true" :model="formHeader" size="small" label-width="70px" class="topform multi_row">
                        <el-form-item label="生产工厂：">
                            <el-select v-model="formHeader.factory" placeholder="请选择" style="width: 180px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                                <el-option label="请选择" value="" />
                                <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.productDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p class="el-input" style="width: 180px;">
                                {{ formHeader.changer || '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <p class="el-input" style="width: 180px;">
                                {{ formHeader.changed || '' }}
                            </p>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="6" style="font-size: 14px; line-height: 32px;">
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
                    <div style="width: 100%; margin-top: 10px; text-align: right;">
                        <template style="float: right; margin-left: 10px;">
                            <el-button v-if="isAuth('mid:prsOrder:orderList')" type="primary" size="small" @click="GetList">
                                查询
                            </el-button>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <div v-show="isSerch">
            <el-tabs id="OutTabs" ref="tabs" v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" @tab-click="tabClick">
                <el-tab-pane name="1">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="statusArr[1].status === 'noPass' ? '不通过' : statusArr[1].status === 'saved' ? '已保存' : statusArr[1].status === 'submit' ? '已提交' : statusArr[1].status === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: statusArr[1].status === 'noPass' ? 'red' : '',
                                }"
                                style="font-size: 14px;"
                            >物料领用</el-button>
                        </el-tooltip>
                    </span>
                    <materiel ref="materielref" :is-redact="isRedact" :fumet="fumet" :serch-sap-list="SerchSapListM" @PoTest="PoTest" />
                </el-tab-pane>
                <el-tab-pane name="2">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="statusArr[0].status === 'noPass' ? '不通过' : statusArr[0].status === 'saved' ? '已保存' : statusArr[0].status === 'submit' ? '已提交' : statusArr[0].status === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: statusArr[0].status === 'noPass' ? 'red' : '',
                                }"
                                style="font-size: 14px;"
                            >申请订单</el-button>
                        </el-tooltip>
                    </span>
                    <apply-order
                        ref="applyorder"
                        :po-test-var="PoTestVar"
                        :is-redact="isRedact"
                        :order-audit="orderAudit"
                        :fumet="orderFumet"
                        :serch-sap-list="SerchSapList"
                        :version-list="VersionList"
                        :order-type-list="orderTypeList"
                        @GetFunet="GetFunet"
                        @ApplyOrder="ApplyOrder"
                        @GetList="GetList"
                    />
                </el-tab-pane>
                <el-tab-pane name="3">
                    <span slot="label" class="spanview">
                        <el-tooltip class="item" effect="dark" :content="statusArr[2].status === 'noPass' ? '不通过' : statusArr[2].status === 'saved' ? '已保存' : statusArr[2].status === 'submit' ? '已提交' : statusArr[2].status === 'checked' ? '通过' : '未录入'" placement="top-start">
                            <el-button
                                :style="{
                                    color: statusArr[2].status === 'noPass' ? 'red' : '',
                                }"
                                style="font-size: 14px;"
                            >工时计算</el-button>
                        </el-tooltip>
                    </span>
                    <man-hour ref="manhour" :is-redact="isRedact" :form-header="formHeader" @GetList="GetList" />
                </el-tab-pane>
            </el-tabs>
        </div>
        <redact-box v-if="isSerch">
            <template slot="button">
                <el-button v-if="isSerch && orderStatus !== 'submit' && orderStatus !== 'checked' && isAuth('mid:prsOrder:updateOrder')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <template v-if="isRedact" style="float: right; margin-left: 10px;">
                    <el-button v-if="isAuth('mid:prsOrder:updateOrder')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                        保存
                    </el-button>
                    <el-button v-if="isAuth('mid:prsOrder:updateOrder')" type="primary" size="small" @click="SubmitForm">
                        提交
                    </el-button>
                </template>
            </template>
        </redact-box>
    </div>
</template>

<script>
import { SYSTEMSETUP_API, BASICDATA_API, SQU_API } from '@/api/api';
import ApplyOrder from './applyOrder';
import Materiel from './material';
import ManHour from './manHour';
import { dateFormat, GetStatus } from '@/net/validate';
export default {
    name: 'Index',
    components: {
        ApplyOrder,
        Materiel,
        ManHour
    },
    data() {
        return {
            isRedact: false,
            isSerch: false,
            activeName: '1',
            orderStatus: '',
            orderS: '',
            factory: [],
            workshop: [],
            orderTypeList: [],
            VersionList: [],
            formHeader: {
                factory: '',
                workShop: '',
                productDate: dateFormat(new Date(), 'yyyy-MM-dd')
            },
            SerchSapList: [],
            SerchSapListM: [],
            orderFumet: [],
            orderAudit: [],
            fumet: [],
            statusArr: [{ status: '' }, { status: '' }, { status: '' }],
            PoTestVar: {}
        };
    },
    computed: {},
    watch: {
        'formHeader.factory'(n) {
            this.getDictList(n);
            this.getVersionList(n);
            this.Getdeptbyid(n);
        }
    },
    mounted() {
        this.Getdeptcode();
    },
    methods: {
        tabClick(val) {
            this.$refs.tabs.setCurrentName(val.name);
        },
        dataRul(data) {
            let ty = true;
            data.forEach(item => {
                const datas = this.$refs.materielref.SumDate.filter(it => it.delFlag !== '1' && it.material.midPrsOrderId === item.id && !it.material.childPotNo);
                if (datas.length > 0) {
                    ty = false;
                    this.$warningToast(item.potNoName + '原汁罐没有匹配发酵罐，不能申请订单！');
                    return false;
                }
            });
            return ty;
        },
        // 申请订单
        ApplyOrder(paras) {
            if (paras.length === 0) {
                this.$warningToast('请选择订单');
                return;
            }
            if (!this.dataRul(paras)) {
                return false;
            }
            if (!this.$refs.materielref.AmountRul()) {
                return;
            }
            const updateMaterial = new Promise((resolve, reject) => {
                this.$refs.materielref.updateMaterial('saved', resolve, reject);
            });
            updateMaterial.then(() => {
                paras.forEach((item) => {
                    item.materialCode = item.material.substring(0, item.material.indexOf(' '));
                    item.materialName = item.material.substring(item.material.indexOf(' ') + 1);
                });
                this.$http(`${SQU_API.SUM_APPLYORDER_API}`, 'POST', paras).then(({ data }) => {
                    if (data.code === 0) {
                        this.$successToast('申请成功');
                        this.GetList();
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            });
        },
        GetList() {
            if (!this.formHeader.factory) {
                this.$warningToast('请选择工厂');
                return;
            }
            if (!this.formHeader.workShop) {
                this.$warningToast('请选择车间');
                return;
            }
            if (!this.formHeader.productDate) {
                this.$warningToast('请选择生产日期');
                return;
            }
            this.isRedact = false;
            this.getMaterial(this.formHeader.factory);
            this.getMaterialM(this.formHeader.factory);
            this.GetFunet();
        },
        // 获取原汁信息
        GetFunet() {
            this.$http(`${SQU_API.SUM_FUMET_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.isSerch = false;
                    data.orderList.forEach((item) => {
                        if (!item.materialCode) {
                            item.material = '';
                        } else {
                            item.material = item.materialCode + ' ' + item.materialName;
                        }
                    });
                    this.orderS = GetStatus(data.orderList);
                    this.orderFumet = data.orderList;
                    this.orderAudit = data.orderAudit;
                    this.fumet = data.orderList;
                    if (data.orderList.length !== 0) {
                        this.formHeader.changed = data.orderList[0].changed;
                        this.formHeader.changer = data.orderList[0].changer;
                    }
                    const list0 = new Promise((resolve, reject) => {
                        this.$refs.materielref.getPot(this.formHeader, resolve, reject);
                    });
                    Promise.all([list0]).then(() => {
                        const list1 = new Promise((resolve, reject) => {
                            this.$refs.materielref.getMaterialList(this.formHeader, resolve, reject);
                        });
                        const list2 = new Promise((resolve, reject) => {
                            this.$refs.manhour.GetTimeList(this.formHeader, resolve, reject);
                        });
                        Promise.all([list1, list2]).then(() => {
                            this.GetOrderStatus();
                        });
                    });
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 订单状态
        GetOrderStatus() {
            this.statusArr[0].status = this.orderS;
            this.statusArr[1].status = this.$refs.materielref.materialS;
            this.statusArr[2].status = this.$refs.manhour.timeS;
            this.orderStatus = GetStatus(this.statusArr);
            this.$refs.tabs.handleTabClick(this.$refs.tabs.panes[parseInt(this.$refs.tabs.currentName, 10) - 1]);
            this.isSerch = true;
        },
        // 保存or提交
        savedOrSubmitForm(str) {
            // eslint-disable-next-line
            setTimeout(() => {}, 100)
            if (str === 'saved') {
                if (!this.$refs.materielref.AmountRul()) {
                    return;
                }
            }
            const updateMaterial = new Promise((resolve, reject) => {
                this.$refs.materielref.updateMaterial(str, resolve, reject);
            });
            if (str === 'submit') {
                updateMaterial.then(() => {
                    const updateApplyorder = new Promise((resolve, reject) => {
                        this.$refs.applyorder.UpdateOrder(str, resolve, reject);
                    });
                    const UpdateTime = new Promise((resolve, reject) => {
                        this.$refs.manhour.UpdateTime(str, resolve, reject);
                    });
                    const saveNet = Promise.all([updateApplyorder, UpdateTime]);
                    saveNet.then(() => {
                        const SubmitApplyorder = new Promise((resolve, reject) => {
                            this.$refs.applyorder.UpdateOrder(str, resolve, reject, true);
                        });
                        const SubmitMaterial = new Promise((resolve, reject) => {
                            this.$refs.materielref.updateMaterial(str, resolve, reject, true);
                        });
                        const SubmitTime = new Promise((resolve, reject) => {
                            this.$refs.manhour.UpdateTime(str, resolve, reject, true);
                        });
                        const SubmitNet = Promise.all([SubmitApplyorder, SubmitMaterial, SubmitTime]);
                        SubmitNet.then(
                            () => {
                                this.isRedact = false;
                                this.$notify({
                                    title: '成功',
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.GetList();
                            },
                            err => {
                                this.$errorToast(err);
                            }
                        );
                    });
                });
            } else {
                updateMaterial.then(() => {
                    const updateApplyorder = new Promise((resolve, reject) => {
                        this.$refs.applyorder.UpdateOrder(str, resolve, reject);
                    });
                    const UpdateTime = new Promise((resolve, reject) => {
                        this.$refs.manhour.UpdateTime(str, resolve, reject);
                    });
                    const saveNet = Promise.all([updateApplyorder, UpdateTime]);
                    saveNet.then(
                        () => {
                            this.isRedact = false;
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            this.GetList();
                        },
                        err => {
                            this.$errorToast(err);
                        }
                    );
                });
            }
        },
        // 提交
        SubmitForm() {
            if (!this.$refs.applyorder.applyorderRul()) {
                return;
            }
            if (!this.$refs.materielref.materialRul()) {
                return;
            }
            if (!this.$refs.manhour.ManHourRul()) {
                return;
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
        // 获取物料下拉
        getMaterial(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: factory, type: 'YA_M_MATERIAL' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.SerchSapList = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取物料下拉
        getMaterialM(factory) {
            this.$http(`${SYSTEMSETUP_API.PARAMETERLIST_API}`, 'POST', { factory: factory, type: 'YZ_ZUJIAN_MATERIAL' }, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.SerchSapListM = data.dicList;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        getDictList(factory) {
            const params = { types: ['order_type'], factory };
            this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.orderTypeList = data.dicList[0].prolist;
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        getVersionList(factory) {
            const params = { types: ['yzpro_version'], factory };
            this.$http(`${SYSTEMSETUP_API.PARAMETERSLIST_API}`, 'POST', params)
                .then(({ data }) => {
                    if (data.code === 0) {
                        this.VersionList = data.dicList[0].prolist;
                    } else {
                        this.$errorToast(data.msg);
                    }
                })
                .catch(error => {
                    console.log('catch data::', error);
                });
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.formHeader.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '压榨' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList[0]) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        PoTest(data) {
            this.PoTestVar = data;
        }
    }
};
</script>

<style lang="scss" scoped></style>
