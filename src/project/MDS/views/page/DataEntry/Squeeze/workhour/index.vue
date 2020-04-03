<template>
    <div>
        <div class="header_main">
            <el-card class="searchCard">
                <el-row type="flex">
                    <el-col :span="18">
                        <el-form :inline="true" :model="formHeader" size="small" labelWidth="70px" class="topform multi_row">
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
                                <el-date-picker v-model="formHeader.inKjmDate" type="date" valueFormat="yyyy-MM-dd" format="yyyy.MM.dd" placeholder="选择" style="width: 180px;" />
                            </el-form-item>
                            <el-form-item label="生产工序：">
                                <el-select v-model="formHeader.deptId" placeholder="请选择" style="width: 180px;">
                                    <el-option label="请选择" value="" />
                                    <el-option v-for="(item, index) in deptId" :key="index" :label="item.deptName" :value="item.deptId" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="提交人员：">
                                <p class="el-input" style="width: 180px;">
                                    {{ headList.changer }}
                                </p>
                            </el-form-item>
                            <el-form-item label="提交时间：">
                                <p class="el-input" style="width: 180px;">
                                    {{ headList.changed }}
                                </p>
                            </el-form-item>
                        </el-form>
                    </el-col>
                    <el-col :span="6" style="font-size: 14px; line-height: 32px;">
                        <div style=" float: right; overflow: hidden; text-align: left;">
                            <span
                                class="point"
                                :style="{
                                    background: headList.status === 'noPass' ? 'red' : headList.status === 'saved' ? '#1890f' : headList.status === 'submit' ? '#1890ff' : headList.status === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)',
                                }"
                            />状态：
                            <span
                                :style="{
                                    color: headList.status === 'noPass' ? 'red' : '',
                                }"
                            >{{ headList.status === 'noPass' ? '审核不通过' : headList.status === 'saved' ? '已保存' : headList.status === 'submit' ? '已提交' : headList.status === 'checked' ? '通过' : headList.status === '已同步' ? '未录入' : headList.status }}</span>
                        </div>
                        <div style="clear: both;" />
                        <div style="width: 100%; margin-top: 10px; text-align: right;">
                            <template style="float: right; margin-left: 10px;">
                                <el-button v-if="isAuth('prs:timeSheet:list')" type="primary" size="small" @click="GetTimeList">
                                    查询
                                </el-button>
                                <el-button v-if="searchCard && headList.status !== 'submit' && headList.status !== 'checked' && isAuth('prs:timeSheet:update')" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                                    {{ isRedact ? '取消' : '编辑' }}
                                </el-button>
                            </template>
                            <template v-if="isRedact && searchCard" style="float: right; margin-left: 10px;">
                                <el-button v-if="isAuth('prs:timeSheet:update')" type="primary" size="small" @click="savedOrSubmitForm('saved')">
                                    保存
                                </el-button>
                                <el-button v-if="isAuth('prs:timeSheet:update')" type="primary" size="small" @click="SubmitForm">
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
            <div class="tableCard">
                <div class="toggleSearchTop" style=" position: relative; margin-bottom: 8px; background-color: white; border-radius: 5px;">
                    <i class="el-icon-caret-bottom" />
                </div>
            </div>
            <div v-show="searchCard">
                <el-card class="box-cards NewDaatTtabs">
                    <el-card style=" position: relative; margin-bottom: 10px;" class="readyCard">
                        <el-form ref="timesForm" :inline="true" :model="readyTimeDate" size="small" labelWidth="125px">
                            <div class="clearfix">
                                <h3 style=" float: left; font-weight: 600; font-size: 14px; line-height: 32px;">
                                    准备时间（分钟：min）
                                </h3>
                                <el-button type="text" class="readyshiftBtn manHour" name="manHourReady" style="bottom: 15px;">
                                    收起<i class="el-icon-caret-top" />
                                </el-button>
                                <el-form-item label="班次：" style="float: right; margin-right: 60px; margin-bottom: 10px;">
                                    <el-select v-model="readyTimeDate.classes" placeholder="请选择" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))">
                                        <el-option label="白班" value="白班" />
                                        <el-option label="中班" value="中班" />
                                        <el-option label="夜班" value="夜班" />
                                        <el-option label="多班" value="多班" />
                                    </el-select>
                                </el-form-item>
                            </div>
                            <div class="manHourReadyBox">
                                <el-row v-if="readyTimeDate.classes === '白班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                                    <el-form-item label="交接班（白班）：">
                                        <el-input v-model="readyTimeDate.dayChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="班前会：" labelWidth="80px">
                                        <el-input v-model="readyTimeDate.dayChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="生产前准备：" labelWidth="100px">
                                        <el-input v-model="readyTimeDate.dayChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="生产后清场：" labelWidth="100px">
                                        <el-input v-model="readyTimeDate.dayChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                </el-row>
                                <el-row v-if="readyTimeDate.classes === '中班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                                    <el-form-item label="交接班（中班）：">
                                        <el-input v-model="readyTimeDate.midChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="班前会：" labelWidth="80px">
                                        <el-input v-model="readyTimeDate.midChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="生产前准备：" labelWidth="100px">
                                        <el-input v-model="readyTimeDate.midChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="生产后清场：" labelWidth="100px">
                                        <el-input v-model="readyTimeDate.midChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                </el-row>
                                <el-row v-if="readyTimeDate.classes === '夜班' || readyTimeDate.classes === '多班' || !readyTimeDate.classes">
                                    <el-form-item label="交接班（夜班）：">
                                        <el-input v-model="readyTimeDate.nightChange" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="班前会：" labelWidth="80px">
                                        <el-input v-model="readyTimeDate.nightChangeBefore" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="生产前准备：" labelWidth="100px">
                                        <el-input v-model="readyTimeDate.nightChangePre" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                    <el-form-item label="生产后清场：" labelWidth="100px">
                                        <el-input v-model="readyTimeDate.nightChangeAfter" placeholder="手工录入" :disabled="!(isRedact && (readyTimeDate.status === 'noPass' || readyTimeDate.status === 'saved' || readyTimeDate.status === ''))" />
                                    </el-form-item>
                                </el-row>
                            </div>
                        </el-form>
                    </el-card>
                    <el-card style="margin-bottom: 10px;">
                        <h3 style=" font-weight: 600; font-size: 14px; line-height: 32px;">
                            人员(小时:H)
                        </h3>
                        <worker ref="workerref" :isRedact="isRedact" :order="userOrder" />
                    </el-card>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script>
import { BASICDATA_API, KJM_API, SQU_API } from '@/api/api';
import { headanimation, Readyanimation, getNewDate } from '@/net/validate';
import Worker from '@/views/components/Worker';
export default {
    name: 'Index',
    components: {
        Worker
    },
    data() {
        return {
            uid: '',
            isRedact: false,
            searchCard: false,
            factory: [],
            workshop: [],
            deptId: [],
            userOrder: {
                orderId: '',
                factory: ''
            },
            headList: {},
            formHeader: {
                status: '',
                factory: '',
                workShop: '',
                inKjmDate: getNewDate(),
                deptId: '',
                inKjmBatch: ''
            },
            inKjmBatch: '',
            readyTimeDate: {
                id: '',
                status: '',
                classes: '多班',
                dayChange: '',
                dayChangeBefore: '',
                dayChangePre: '',
                dayChangeAfter: '',
                midChange: '',
                midChangeBefore: '',
                midChangePre: '',
                midChangeAfter: '',
                nightChange: '',
                nightChangeBefore: '',
                nightChangePre: '',
                nightChangeAfter: ''
            },
            readyTimeDate1: {
                id: '',
                status: '',
                classes: '多班',
                dayChange: '',
                dayChangeBefore: '',
                dayChangePre: '',
                dayChangeAfter: '',
                midChange: '',
                midChangeBefore: '',
                midChangePre: '',
                midChangeAfter: '',
                nightChange: '',
                nightChangeBefore: '',
                nightChangePre: '',
                nightChangeAfter: ''
            },
            userList: []
        };
    },
    computed: {},
    watch: {
        'formHeader.factory'(n) {
            this.Getdeptbyid(n);
        },
        'formHeader.workShop'(n) {
            if (n) {
                this.GetParentline(n);
            }
        }
    },
    mounted() {
        headanimation(this.$);
        Readyanimation(this.$);
        this.Getdeptcode();
    },
    methods: {
        // 查询
        GetTimeList() {
            if (this.formHeader.factory === '' || this.formHeader.workShop === '' || this.formHeader.inKjmDate === '' || this.formHeader.deptId === '') {
                this.$warningTost('请填写查询选项');
                return false;
            }
            this.searchCard = false;
            this.searchCard = true;
            this.isRedact = false;
            this.uid = '';
            this.$http(`${SQU_API.PRS_TIME_LIST_API}`, 'POST', {
                deptId: this.formHeader.deptId,
                factory: this.formHeader.factory,
                inKjmDate: this.formHeader.inKjmDate,
                workShop: this.formHeader.workShop
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.userOrder.factory = this.formHeader.factory;
                    if (data.headList.length === 0) {
                        this.uid = this.uuid(32, 62);
                        this.readyTimeDate = JSON.parse(JSON.stringify(this.readyTimeDate1));
                        this.userOrder.orderId = this.uid;
                        this.headList = this.formHeader;
                        this.headList.status = '';
                        this.$refs.workerref.GetTimeUserList(data.userList);
                        this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory);
                        this.$refs.workerref.getTree(this.formHeader.factory);
                        this.$refs.workerref.GetProductShift(this.formHeader.factory);
                    } else {
                        if (data.readyList.length === 0) {
                            this.readyTimeDate = this.readyTimeDate1;
                        } else {
                            this.readyTimeDate = data.readyList[0];
                        }
                        this.headList = data.headList[0];
                        this.userOrder.orderId = data.headList[0].id;
                        this.$refs.workerref.GetTimeUserList(data.userList);
                        this.$refs.workerref.GetTeam(this.formHeader.workShop, this.formHeader.factory);
                        this.$refs.workerref.getTree(this.formHeader.factory);
                        this.$refs.workerref.GetProductShift(this.formHeader.factory);
                    }
                    this.inKjmBatch = data.inKjmBatch;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 保存
        savedOrSubmitForm(str) {
            const headSave = new Promise((resolve, reject) => {
                this.HeadSave(str, resolve, reject);
            });
            const readySave = new Promise((resolve, reject) => {
                this.ReadyTimeSave(str, resolve, reject);
            });
            const userSave = new Promise((resolve, reject) => {
                this.$refs.workerref.UpdateUser(str, resolve, reject);
            });
            if (str === 'submit') {
                const saveNet = Promise.all([headSave, readySave, userSave]);
                saveNet.then(
                    () => {
                        // let submit = new Promise((resolve, reject) => {
                        //   this.manHourSubmit(str, resolve, reject)
                        // })
                        // let submitNet = Promise.all([submit])
                        // submitNet.then(function () {
                        this.GetTimeList();
                        this.$notify({
                            title: '成功',
                            message: '提交成功',
                            type: 'success'
                        });
                        // }, err => {
                        //   this.$message.error(err)
                        // })
                    },
                    err => {
                        this.$error_SHINHO(err);
                    }
                );
            } else if (str === 'saved') {
                const saveNet = Promise.all([headSave, readySave, userSave]);
                saveNet.then(
                    () => {
                        this.GetTimeList();
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                    },
                    err => {
                        this.$error_SHINHO(err);
                    }
                );
            }
        },
        SubmitForm() {
            if (!this.readyTimeRul()) {
                return false;
            }
            if (!this.$refs.workerref.userrul()) {
                return false;
            }
            this.$confirm('确认提交该订单, 是否继续?', '提交订单', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.savedOrSubmitForm('submit');
            });
        },
        // 提交
        manHourSubmit(str, resolve, reject) {
            this.$http(`${KJM_API.OUTTIMEHEADSUBMIT_API}`, 'POST', [this.readyTimeDate, this.$refs.workerref.GetUser(), this.headList]).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                    if (reject) {
                        reject('提交' + data.msg);
                    }
                }
            });
        },
        // 表头保存
        HeadSave(str, resolve, reject) {
            if (this.uid) {
                this.headList.id = this.uid;
                this.headList.addOrupdate = '0';
            }
            this.headList.status = str;
            this.headList.inKjmBatch = String(this.inKjmBatch);
            console.log(this.headList);
            this.$http(`${SQU_API.PRS_TIMESHEET_UPDATE_API}`, 'POST', this.headList).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                    if (reject) {
                        reject('表头保存' + data.msg);
                    }
                }
            });
        },
        // 准备时间保存
        ReadyTimeSave(str, resolve, reject) {
            if (this.uid) {
                this.readyTimeDate.orderId = this.uid;
            } else {
                this.readyTimeDate.orderId = this.headList.id;
            }
            this.readyTimeDate.status = str;
            this.readyTimeDate.dayChange = this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0 ? String(this.readyTimeDate.dayChange) : this.readyTimeDate.dayChange;
            this.readyTimeDate.dayChangeBefore = this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0 ? String(this.readyTimeDate.dayChangeBefore) : this.readyTimeDate.dayChangeBefore;
            this.readyTimeDate.dayChangePre = this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0 ? String(this.readyTimeDate.dayChangePre) : this.readyTimeDate.dayChangePre;
            this.readyTimeDate.dayChangeAfter = this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0 ? String(this.readyTimeDate.dayChangeAfter) : this.readyTimeDate.dayChangeAfter;
            this.readyTimeDate.midChange = this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0 ? String(this.readyTimeDate.midChange) : this.readyTimeDate.midChange;
            this.readyTimeDate.midChangeBefore = this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0 ? String(this.readyTimeDate.midChangeBefore) : this.readyTimeDate.midChangeBefore;
            this.readyTimeDate.midChangePre = this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0 ? String(this.readyTimeDate.midChangePre) : this.readyTimeDate.midChangePre;
            this.readyTimeDate.midChangeAfter = this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0 ? String(this.readyTimeDate.midChangeAfter) : this.readyTimeDate.midChangeAfter;
            this.readyTimeDate.nightChange = this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0 ? String(this.readyTimeDate.nightChange) : this.readyTimeDate.nightChange;
            this.readyTimeDate.nightChangeBefore = this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0 ? String(this.readyTimeDate.nightChangeBefore) : this.readyTimeDate.nightChangeBefore;
            this.readyTimeDate.nightChangePre = this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0 ? String(this.readyTimeDate.nightChangePre) : this.readyTimeDate.nightChangePre;
            this.readyTimeDate.nightChangeAfter = this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0 ? String(this.readyTimeDate.nightChangeAfter) : this.readyTimeDate.nightChangeAfter;
            this.$http(`${KJM_API.OUTTIMEREADYSAVE_API}`, 'POST', this.readyTimeDate).then(({ data }) => {
                if (data.code === 0) {
                    if (resolve) {
                        resolve('resolve');
                    }
                } else {
                    this.$error_SHINHO(data.msg);
                    if (reject) {
                        reject('准备时间保存' + data.msg);
                    }
                }
            });
        },
        // 校验
        readyTimeRul() {
            let ty = true;
            const day =
                (this.readyTimeDate.dayChange || this.readyTimeDate.dayChange === 0) &&
                (this.readyTimeDate.dayChangeBefore || this.readyTimeDate.dayChangeBefore === 0) &&
                (this.readyTimeDate.dayChangePre || this.readyTimeDate.dayChangePre === 0) &&
                (this.readyTimeDate.dayChangeAfter || this.readyTimeDate.dayChangeAfter === 0);
            const mid =
                (this.readyTimeDate.midChange || this.readyTimeDate.midChange === 0) &&
                (this.readyTimeDate.midChangeBefore || this.readyTimeDate.midChangeBefore === 0) &&
                (this.readyTimeDate.midChangePre || this.readyTimeDate.midChangePre === 0) &&
                (this.readyTimeDate.midChangeAfter || this.readyTimeDate.midChangeAfter === 0);
            const night =
                (this.readyTimeDate.nightChange || this.readyTimeDate.nightChange === 0) &&
                (this.readyTimeDate.nightChangeBefore || this.readyTimeDate.nightChangeBefore === 0) &&
                (this.readyTimeDate.nightChangePre || this.readyTimeDate.nightChangePre === 0) &&
                (this.readyTimeDate.nightChangeAfter || this.readyTimeDate.nightChangeAfter === 0);
            if (this.readyTimeDate.classes === '白班') {
                if (day) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间白班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '中班') {
                if (mid) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间中班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '夜班') {
                if (night) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间夜班必填项未填写完全');
                    return false;
                }
            } else if (this.readyTimeDate.classes === '多班') {
                if (day && night) {
                    //
                } else {
                    ty = false;
                    this.$warningTost('准备时间多班必填项未填写完全');
                    return false;
                }
            }
            return ty;
        },
        // 获取工厂
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST', {}, false, false, false).then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            this.formHeader.workShop = '';
            this.formHeader.deptId = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '压榨' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        this.formHeader.workShop = data.typeList[0].deptId;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        },
        // 获取产线
        GetParentline(id) {
            this.formHeader.deptId = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYPARENTID1_API}`, 'POST', { parentId: id, deptType: 'process' }, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        this.deptId = data.childList;
                        this.formHeader.deptId = data.childList[0].deptId;
                    } else {
                        this.$error_SHINHO(data.msg);
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.manHour {
    position: absolute;
    right: 10px;
    bottom: 8px;
    z-index: 999;
}
</style>

<style lang="scss">
.box-cards {
    .el-card__body {
        padding: 12px !important;
    }
}

.readyCard {
    input {
        width: 147px !important;
    }
}
</style>
