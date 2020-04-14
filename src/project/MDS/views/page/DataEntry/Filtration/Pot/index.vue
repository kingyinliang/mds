<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-form :inline="true" size="small" :model="formHeader" label-width="70px" class="topform marbottom sole_row">
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
                <el-form-item label="罐号：">
                    <el-select v-model="formHeader.holderId" filterable placeholder="请选择" style="width: 180px;">
                        <el-option label="请选择" value="" />
                        <el-option v-for="(sole, index) in PotList" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('filter:holder:list')" type="primary" size="small" style="float: right;" @click="GetDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-show="fastS" class="searchCard newCard ferCard" style="margin-top: 5px;">
            <h3 style=" margin-bottom: 8px; color: black;">
                <i class="iconfont factory-liebiao" style=" margin-right: 10px; color: #666;" />成品罐区
                <i v-if="isAuth('ste:semi:reportForm')" class="gotop" @click="goPot"><a>杀菌罐区库存情况>></a></i>
            </h3>
            <el-row class="dataList" :gutter="10" style="min-height: 150px;">
                <el-col v-for="(item, index) in dataList" :key="index" :span="4">
                    <el-card class="dataList_item">
                        <h3 class="dataList_item_tit">
                            {{ item.holderNo }}
                            <span style="color: #333; font-weight: 400; font-size: 14px;">
                                -{{ item.holderStatus === '0' ? '空罐' : item.holderStatus === '1' ? '入库中' : item.holderStatus === '2' ? '满罐' : item.holderStatus === '3' ? '领用中' : item.holderStatus === '4' ? '领用完' : '' }}
                            </span>
                            <span v-if="isAuth('filter:holder:list')" class="dataList_item_a" style="font-size: 14px;" @click="godetails(item)">详情>></span>
                        </h3>
                        <div class="dataList_item_pot clearfix" style="position: relative;">
                            <img v-if="item.isRdSign === '1'" src="@/assets/img/RD.png" alt="" style="position: absolute; top: 10px; left: 10px;">
                            <div class="dataList_item_pot_box">
                                <div class="dataList_item_pot_box1">
                                    <div class="dataList_item_pot_box_item2" :style="`height:${item.holderStatus === '0' ? 0 : item.amount < 0 ? 0 : ((item.amount * 1) / (item.holderHold * 1)) * 100}%`" />
                                    <div v-if="item.holderStatus !== '0'" class="dataList_item_pot_box_detail">
                                        <p>{{ item.batch || '' }}</p>
                                        <p>
                                            {{ (item.materialCode || '') + ' ' + (item.materialName || '') }}
                                        </p>
                                        <p v-if="item.amount">
                                            {{ (item.amount * 10) / 10000 || '' }}方
                                        </p>
                                        <p v-if="item.timeLength">
                                            {{ item.timeLength || '' }}H
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <el-row class="dataList_item_btn">
                            <el-col :span="8" class="dataList_item_btn_item">
                                <p @click="clearPot(item)">
                                    清罐
                                </p>
                            </el-col>
                            <el-col
                                :span="8"
                                class="dataList_item_btn_item"
                            >
                                <p @click="JBSdialog(item)">
                                    <i class="dataList_item_btn_item_bor" />JBS出库
                                </p>
                            </el-col>
                            <el-col
                                :span="8"
                                class="dataList_item_btn_item"
                            >
                                <p @click="TurnSavedialog(item)">
                                    <i class="dataList_item_btn_item_bor" />转储
                                </p>
                            </el-col>
                        </el-row>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog width="400px" title="JBS出库" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="JBSVisible">
            <el-form ref="JBSdataForm" :model="JBSdataForm" :rules="JBSdataRule" label-width="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="JBS()" @submit.native.prevent>
                <el-form-item label="领用罐号：" prop="receiveHolderId">
                    <p>{{ JBSdataForm.holderName }}</p>
                </el-form-item>
                <el-form-item label="物料：" prop="materialCode">
                    <p>
                        {{ JBSdataForm.materialCode + ' ' + JBSdataForm.materialName }}
                    </p>
                </el-form-item>
                <el-form-item label="批次：" prop="batch">
                    <p>{{ JBSdataForm.batch }}</p>
                </el-form-item>
                <el-form-item label="领用量(方)：" prop="receiveAmount">
                    <el-input v-model="JBSdataForm.receiveAmount" size="small" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="打入罐类别：" prop="inHolderType">
                    <el-select v-model="JBSdataForm.inHolderType" filterable placeholder="请选择" @change="GetHolderType(JBSdataForm.inHolderType)">
                        <el-option v-for="(sole, index) in InHolderType" :key="index" :value="sole.code" :label="sole.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="打入罐号：" prop="inHolderId">
                    <el-select v-model="JBSdataForm.inHolderId" filterable placeholder="请选择">
                        <el-option v-for="(sole, index) in Holder" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否满罐：">
                    <el-select v-model="JBSdataForm.isFull" filterable placeholder="请选择" style="width: 100%;">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="满罐日期：">
                    <el-date-picker v-model="JBSdataForm.fullDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="请选择日期" style="width: 190px;" />
                </el-form-item>
                <el-form-item label="操作时间：">
                    <p>{{ JBSdataForm.changed }}</p>
                </el-form-item>
                <el-form-item label="操作人：">
                    <p>
                        {{ (JBSdataForm.changer = $store.state.user.realName + '（' + this.$store.state.user.name + '）') }}
                    </p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="JBSVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="JBS()">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog width="400px" title="转储" class="ShinHoDialog" :close-on-click-modal="false" :visible.sync="TurnSaveVisible">
            <el-form ref="TurnSavedataForm" :model="TurnSavedataForm" :rules="TurnSavedataRule" label-width="110px" size="small" style="width: 300px; margin: auto;" @keyup.enter.native="TurnSave()" @submit.native.prevent>
                <el-form-item label="领用罐号：" prop="receiveHolderId">
                    <p>{{ TurnSavedataForm.holderName }}</p>
                </el-form-item>
                <el-form-item label="物料：" prop="materialCode">
                    <p>
                        {{ TurnSavedataForm.materialCode + ' ' + TurnSavedataForm.materialName }}
                    </p>
                </el-form-item>
                <el-form-item label="批次：" prop="batch">
                    <p>{{ TurnSavedataForm.batch }}</p>
                </el-form-item>
                <el-form-item label="领用量(方)：" prop="receiveAmount">
                    <el-input v-model="TurnSavedataForm.receiveAmount" size="small" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="打入罐类别：" prop="inHolderType">
                    <el-select v-model="TurnSavedataForm.inHolderType" filterable placeholder="请选择" @change="GetHolderType1(TurnSavedataForm)">
                        <el-option value="006" label="半成品罐" />
                        <el-option value="007" label="成品罐" />
                    </el-select>
                </el-form-item>
                <el-form-item label="打入罐号：" prop="inHolderId">
                    <el-select v-model="TurnSavedataForm.inHolderId" filterable placeholder="请选择">
                        <el-option v-for="(sole, index) in Holder" :key="index" :value="sole.holderId" :label="sole.holderName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否满罐：">
                    <el-select v-model="TurnSavedataForm.isFull" filterable placeholder="请选择" style="width: 100%;">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="满罐日期：">
                    <el-date-picker v-model="TurnSavedataForm.fullDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" placeholder="请选择日期" style="width: 190px;" />
                </el-form-item>
                <el-form-item label="操作时间：">
                    <p>{{ TurnSavedataForm.changed }}</p>
                </el-form-item>
                <el-form-item label="操作人：">
                    <p>
                        {{ (TurnSavedataForm.changer = $store.state.user.realName + '（' + this.$store.state.user.name + '）') }}
                    </p>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="TurnSaveVisible = false">取消</el-button>
                <el-button type="primary" size="small" @click="TurnSave()">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getFactory, getWorkshop, dateFormat } from '@/net/validate';
import { FILTRATION_API, BASICDATA_API, STERILIZED_API } from '@/api/api';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            fastS: false,
            JBSVisible: false,
            TurnSaveVisible: false,
            formHeader: {
                factory: '',
                workShop: '',
                holderId: ''
            },
            factory: [],
            workshop: [],
            PotList: [],
            InHolderType: [],
            Holder: [],
            dataList: [],
            JBSdataForm: {},
            JBSdataRule: {
                receiveHolderId: [
                    {
                        required: true,
                        message: '领用罐号不能为空',
                        trigger: 'blur'
                    }
                ],
                materialCode: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                batch: [{ required: true, message: '批次不能为空', trigger: 'blur' }],
                receiveAmount: [
                    {
                        required: true,
                        message: '领用量不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderType: [
                    {
                        required: true,
                        message: '打入罐类别不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderId: [
                    {
                        required: true,
                        message: '打入罐号不能为空',
                        trigger: 'blur'
                    }
                ]
            },
            TurnSavedataForm: {},
            TurnSavedataRule: {
                receiveHolderId: [
                    {
                        required: true,
                        message: '领用罐号不能为空',
                        trigger: 'blur'
                    }
                ],
                materialCode: [{ required: true, message: '物料不能为空', trigger: 'blur' }],
                batch: [{ required: true, message: '批次不能为空', trigger: 'blur' }],
                receiveAmount: [
                    {
                        required: true,
                        message: '领用量不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderType: [
                    {
                        required: true,
                        message: '打入罐类别不能为空',
                        trigger: 'blur'
                    }
                ],
                inHolderId: [
                    {
                        required: true,
                        message: '打入罐号不能为空',
                        trigger: 'blur'
                    }
                ]
            }
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.formHeader.workShop = '';
            getWorkshop(this, n, '过滤');
            this.GetInHolderType(n);
        },
        'formHeader.workShop'(n) {
            this.formHeader.holderId = '';
            if (n) {
                this.getPot(n);
            }
        }
    },
    mounted() {
        getFactory(this);
    },
    methods: {
        goPot() {
            this.$store.state.common.PotReportForms.factory = this.formHeader.factory;
            this.$store.state.common.PotReportForms.workShop = this.formHeader.workShop;
            this.$store.state.common.PotReportForms.type = 'filterHolder';
            this.$store.state.common.mainTabs = this.$store.state.common.mainTabs.filter(item => item.name !== 'DataEntry-PotReportForms-index');
            setTimeout(() => {
                this.$router.push({ name: `DataEntry-PotReportForms-index` });
            }, 100);
        },
        // 查询
        GetDataList() {
            if (!this.formHeader.factory) {
                this.$warningTost('工厂必填');
                return false;
            }
            this.$http(`${FILTRATION_API.FILTER_POT_LIST_API}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    this.fastS = true;
                    this.dataList = data.list;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        // 去详情
        godetails(item) {
            this.$store.state.common.filtrationPot = item;
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'DataEntry-Filtration-Pot-detail');
            setTimeout(() => {
                this.$router.push({ name: `DataEntry-Filtration-Pot-detail` });
            }, 100);
        },
        // 清罐
        clearPot(item) {
            if (!this.isAuth('filter:holder:cleanProHolder')) {
                this.$warningTost('无权限操作');
                return false;
            }
            if (item.holderStatus === '0') {
                this.$warningTost('该罐暂不可进行清罐操作');
                return false;
            }
            if (item.holderStatus !== '4') {
                this.$warningTost('未领用完不能清罐');
                return false;
            }
            this.$confirm('清罐后，账务将清零，请确认实物已空！', '清罐确认', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http(`${FILTRATION_API.FILTER_POT_CLEAN_API}`, 'POST', item).then(({ data }) => {
                    if (data.code === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.GetDataList();
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            }).catch(() => {
                // this.$infoTost('已取消删除');
            });
        },
        // JBS弹窗
        JBSdialog(item) {
            if (!this.isAuth('filter:holder:jbsOut')) {
                this.$notify.error({ title: '错误', message: '无权限操作' });
                return false;
            }
            this.JBSVisible = true;
            this.Holder = [];
            this.JBSdataForm = {
                factory: this.formHeader.factory,
                workShop: this.formHeader.workShop,
                receiveHolderId: item.holderId,
                holderName: item.holderName,
                materialCode: item.materialCode,
                materialName: item.materialName,
                batch: item.batch,
                receiveAmount: '',
                unit: '',
                inHolderType: '',
                inHolderId: '',
                isFull: '0',
                fullDate: '',
                remark: '',
                changer: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            };
        },
        // 转储弹窗
        TurnSavedialog(item) {
            if (!this.isAuth('filter:holder:dumpMaterial')) {
                this.$notify.error({ title: '错误', message: '无权限操作' });
                return false;
            }
            this.TurnSaveVisible = true;
            this.Holder = [];
            this.TurnSavedataForm = {
                receiveHolderId: item.holderId,
                holderName: item.holderName,
                materialCode: item.materialCode,
                materialName: item.materialName,
                batch: item.batch,
                receiveAmount: '',
                unit: '',
                inHolderType: '',
                inHolderId: '',
                isFull: '0',
                fullDate: '',
                remark: '',
                changer: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            };
        },
        // JBS确认
        JBS() {
            if (this.JBSdataForm.isFull === '1') {
                if (!this.JBSdataForm.fullDate) {
                    this.$warningTost('满罐时间必填');
                    return;
                }
            }
            this.$refs.JBSdataForm.validate(valid => {
                if (valid) {
                    this.$http(`${FILTRATION_API.FILTER_JBS_API}`, 'POST', this.JBSdataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.JBSVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetDataList();
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
                }
            });
        },
        // 转储确认
        TurnSave() {
            if (this.TurnSavedataForm.isFull === '1') {
                if (!this.TurnSavedataForm.fullDate) {
                    this.$warningTost('满罐时间必填');
                    return;
                }
            }
            this.$refs.TurnSavedataForm.validate(valid => {
                if (valid) {
                    this.$http(`${FILTRATION_API.FILTER_TURNSAVE_API}`, 'POST', this.TurnSavedataForm).then(({ data }) => {
                        if (data.code === 0) {
                            this.TurnSaveVisible = false;
                            this.$notify({
                                title: '成功',
                                message: '操作成功',
                                type: 'success'
                            });
                            this.GetDataList();
                        } else {
                            this.$errorTost(data.msg);
                        }
                    });
                }
            });
        },
        // 获取罐号
        GetHolderType(holderType) {
            this.$http(`${FILTRATION_API.FILTER_HOLDER_LIST_API}`, 'POST', { factory: this.formHeader.factory, holderType: holderType }, false, false, false).then(({ data }) => {
                this.Holder = data.list;
            });
        },
        GetHolderType1(row) {
            this.$http(
                `${STERILIZED_API.SEMIFINIS_DROPDOWN_LIST}`,
                'POST',
                {
                    factory: this.formHeader.factory,
                    materialCode: row.materialCode,
                    batch: row.batch,
                    code: row.inHolderType,
                    holderId: row.receiveHolderId
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.Holder = data.list;
            });
        },
        // 打入罐类别
        GetInHolderType() {
            this.$http(`${FILTRATION_API.FILTER_INHOLDERTYPE_LIST_API}`, 'POST', { factory: this.formHeader.factory }, false, false, false).then(({ data }) => {
                this.InHolderType = data.list;
            });
        },
        // 罐下拉
        getPot() {
            this.$http(
                `${BASICDATA_API.BASEHOLDERLIST_API}`,
                'POST',
                {
                    factory: this.formHeader.factory,
                    workShop: this.formHeader.workShop
                },
                false,
                false,
                false
            ).then(({ data }) => {
                this.PotList = data.holderList;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.ferCard {
    .el-card__body {
        padding: 7px;
    }
    .cardTit {
        padding-bottom: 10px;
        color: black;
        font-weight: 400;
        font-size: 16px;
        border-bottom: 1px solid #e9e9e9;
    }
    .gotop {
        float: right;
        color: #1890ff;
        font-size: 14px;
        cursor: pointer;
        i {
            &::before {
                color: #1890ff;
            }
        }
    }
}
.dataList {
    margin-top: 10px;
    &_item {
        margin-bottom: 10px;
        &_tit {
            padding: 0 10px;
            color: black;
            font-weight: 600;
            font-size: 16px;
            line-height: 45px;
            border-bottom: 1px solid #e8e8e8;
        }
        &_a {
            float: right;
            color: #1890ff;
            cursor: pointer;
        }
        &_pot {
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding: 17px 10px 10px;
            overflow: hidden;
            &_box1 {
                position: relative;
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                width: 102px;
                height: 197px;
                overflow: hidden;
            }
            &_box {
                display: flex;
                flex-wrap: wrap;
                align-content: flex-end;
                float: left;
                width: 120px;
                min-width: 120px;
                height: 229px;
                padding: 25px 9px 9px;
                overflow: hidden;
                color: white;
                background: url("~@/assets/img/ferPot.png") no-repeat;
                background-size: contain;
                &_detail {
                    position: absolute;
                    top: 70px;
                    left: 3px;
                    width: 100%;
                    color: black;
                    font-size: 14px;
                }
                &_item2,
                &_item1 {
                    position: absolute;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 50px;
                    overflow: hidden;
                    font-size: 14px;
                    background: #69c0ff;
                    &::before,
                    &::after {
                        position: absolute;
                        left: 50%;
                        min-width: 175px;
                        min-height: 165px;
                        background: #fff;
                        animation: roateTwo 10s linear infinite;
                        content: "";
                    }
                    &::before {
                        top: -158px;
                        border-radius: 45%;
                    }
                    &::after {
                        top: -152px;
                        border-radius: 47%;
                        opacity: 0.5;
                    }
                }
                &_item2 {
                    height: 100px;
                    background: #1890ff;
                }
                &:hover &_item1::before,
                &:hover &_item1::after,
                &:hover &_item2::before,
                &:hover &_item2::after {
                    animation: roateOne 10s linear infinite;
                }
            }
            &_detail {
                float: left;
                max-width: 112px;
                height: auto;
                margin-top: 25px;
                margin-left: 10px;
                padding: 5px;
                color: #333;
                font-size: 14px;
                line-height: 18px;
                border: 1px solid #1890ff;
                border-radius: 4px;
            }
        }
    }
}

@keyframes roateOne {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    50% {
        transform: translate(-50%, -1%) rotateZ(180deg);
    }
    100% {
        transform: translate(-50%, -0%) rotateZ(360deg);
    }
}

@keyframes roateTwo {
    0% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    50% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
    100% {
        transform: translate(-50%, -0%) rotateZ(0deg);
    }
}
</style>
