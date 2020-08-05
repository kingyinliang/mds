<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="flex">
                <el-col :span="22">
                    <el-form :inline="true" :model="formHeader" size="small" label-width="80px" class="topform multi_row">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>生产车间：
                            </template>
                            <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                                <el-option v-for="(item, index) in workshopList" :key="index" :label="item.deptName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>生产日期：
                            </template>
                            <el-date-picker v-model="formHeader.productDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>生产订单：
                            </template>
                            <el-select v-model="formHeader.orderNo" placeholder="请选择" style="width: 180px;">
                                <el-option v-for="(item, index) in orderNoList" :key="index" :label="item.orderNo" :value="item.orderNo" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <p class="input_border_bg" style="width: 180px;">
                                {{ formHeader.materialCode }} {{ formHeader.materialName }}
                            </p>
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p class="input_border_bg" style="width: 180px;">
                                {{ formHeader.changer }}
                            </p>
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <p class="input_border_bg" style="width: 180px;">
                                {{ formHeader.changed }}
                            </p>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="2" style="font-size: 14px; line-height: 32px;">
                    <div style=" float: right; overflow: hidden; text-align: left;">
                        <span
                            class="point"
                            :style="{
                                background: formHeader.checkStatus === 'R' ? 'red' : formHeader.checkStatus === 'S' ? '#1890f' : formHeader.checkStatus === 'M' ? '#1890ff' : formHeader.checkStatus === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)',
                            }"
                        />状态：
                        <span
                            :style="{
                                color: formHeader.checkStatus === 'R' ? 'red' : '',
                            }"
                        >{{ formHeader.checkStatusName }}</span>
                    </div>
                    <div style="clear: both;" />
                    <div style="width: 100%; margin-top: 10px; text-align: right;">
                        <template style="float: right; margin-left: 10px;">
                            <el-button v-if="isAuth('steTimeQuery')" type="primary" size="small" @click="getList()">
                                查询
                            </el-button>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <div v-show="searchCard">
            <ready-time ref="readyTime" :is-redact="isRedact" style="margin-top: 10px;" />
            <work-hour ref="workHour" :is-redact="isRedact" />
            <audit-log :table-data="manHourAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
            <redact-box>
                <template slot="button">
                    <el-button v-if="searchCard && formHeader.checkStatus !== 'M' && isAuth('steTimeEdit')" type="primary" class="button" size="small" @click="changeIsRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                    <template v-if="isRedact && searchCard" style="float: right; margin-left: 10px;">
                        <el-button v-if="isAuth('steTimeSave')" type="primary" size="small" @click="savedDatas()">
                            保存
                        </el-button>
                        <el-button v-if="isAuth('steTimeSubmit')" type="primary" size="small" @click="submitDatas()">
                            提交
                        </el-button>
                    </template>
                </template>
            </redact-box>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import { COMMON_API, STE_API, AUDIT_API } from 'common/api/api';
import { dateFormat } from 'utils/utils';
import ReadyTime from 'components/ReadyTimes.vue';
import OfficialWorker from 'components/OfficialWorker.vue';
import LoanedPersonnel from 'components/LoanedPersonnel.vue';
import TemporaryWorker from 'components/TemporaryWorker.vue';
@Component({
    name: 'manHour',
    components: {
        ReadyTime,
        OfficialWorker,
        LoanedPersonnel,
        TemporaryWorker
    }
})
export default class ManHour extends Vue {
    $refs: {
        readyTime: HTMLFormElement;
        workHour: HTMLFormElement;
    }

    formHeader = {
        workShop: '',
        productDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        orderNo: '',
        checkStatus: '',
        checkStatusName: '',
        orderId: '',
        materialCode: '',
        materialName: '',
        changer: '',
        changed: ''
    }

    isRedact = false;
    workshopList = [];
    orderNoList: OrderList[] = [];
    searchCard = false;
    classesOptions: object[] = [];
    manHourAudit = [];
    timeSheetResponseDto = '';
    userResponseDto: object[] = [];

    mounted() {
        this.getWorkshopList();
        this.$refs.readyTime.init();
        this.$refs.workHour.init();
    }

    @Watch('formHeader.workShop')
    watchWorkShop() {
        this.getOrderList();
    }

    @Watch('formHeader.orderNo')
    watchOrderNo() {
        const orderNoSole = this.orderNoList.find((item: OrderList) => item.orderNo === this.formHeader.orderNo)
        if (orderNoSole) {
            // this.formHeader['orderId'] = this.orderNoList.find((item: OrderList) => item.orderNo === this.formHeader.orderNo)['id'];
            this.formHeader.orderId = orderNoSole.id;
            this.formHeader.materialCode = orderNoSole.materialCode;
            this.formHeader.materialName = orderNoSole.materialName;
            this.searchCard = false;
            this.isRedact = false;
        }
    }

    changeIsRedact() {
        if (this.isRedact === true) {
            this.getList();
        }
        this.isRedact = !this.isRedact
    }

    // 车间
    getWorkshopList() {
        COMMON_API.ORG_QUERY_WORKSHOP_API({
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            deptType: ['WORK_SHOP'],
            deptName: '杀菌'
        }).then(({ data }) => {
            if (data.code === 200) {
                this.workshopList = data.data;
                if (data.data.length !== 0) {
                    this.formHeader.workShop = data.data[0]['id'];
                }
            }
        })
    }

    // 订单拉取
    getOrderList() {
        COMMON_API.ORDER_LIST_QUERY_API(this.formHeader).then(({ data }) => {
            if (data.code === 200) {
                this.orderNoList = data.data;
                if (this.orderNoList.length !== 0) {
                    this.formHeader.orderNo = this.orderNoList[0]['orderNo'];
                }
            }
        })
    }

    // 查询
    getList() {
        if (this.formHeader.workShop === '' || this.formHeader.productDate === '' || this.formHeader.orderNo === '') {
            this.$infoToast('请选择查询必填项');
            return false;
        }
        STE_API.STE_TIMESHEET_QUERY_API(this.formHeader).then(({ data }) => {
            if (data.code === 200) {
                this.searchCard = true;
                if (data.data.steTimeSheetResponseDto === null) {
                    this.formHeader.checkStatus = '';
                    this.formHeader.checkStatusName = '';
                } else {
                    this.formHeader.checkStatus = data.data.steTimeSheetResponseDto.checkStatus;
                    this.formHeader.checkStatusName = data.data.steTimeSheetResponseDto.checkStatusName;
                }
                this.formHeader.changed = data.data.changed;
                this.formHeader.changer = data.data.changer;
                this.$refs.readyTime.changeList(data.data.steTimeSheetResponseDto);
                this.$refs.workHour.changeList(data.data.steUserResponseDto);
            }
        })
        AUDIT_API.AUDIT_LOG_LIST_API({
            orderNo: this.formHeader.orderNo,
            verifyType: 'TIMESHEET'
        }).then(({ data }) => {
            this.manHourAudit = data.data;
        })
    }

    // 保存
    savedDatas() {
        const timeSheetRequest = this.$refs.readyTime.savedData(this.formHeader);
        const userRequest = this.$refs.workHour.savedData(this.formHeader);
        STE_API.STE_TIMESHEET_SAVE_API({
            orderNo: this.formHeader.orderNo,
            steTimeSheetInsertDto: timeSheetRequest,
            steUserInsertDto: userRequest.userInsertDto,
            steUserUpdateDto: userRequest.userUpdateDto,
            ids: userRequest.ids
        }).then(({ data }) => {
            if (data.code === 200) {
                this.getList();
                this.isRedact = false;
            }
        })
    }

    // 提交
    submitDatas() {
        if (this.$refs.readyTime.ruleSubmit() && this.$refs.workHour.ruleSubmit()) {
            const timeSheetRequest = this.$refs.readyTime.savedData(this.formHeader);
            const workClass = this.$refs.workHour.uniquenessClasses();
            if (timeSheetRequest.classes === 'D') { // 多班
                if (workClass.length < 2) {
                    this.$warningToast('人员统计班次与准备工时不一致');
                    return false;
                }
            } else if (workClass.length !== 1 || timeSheetRequest.classes !== workClass[0]) {
                    this.$warningToast('人员统计班次与准备工时不一致');
                    return false;
                }
            const userRequest = this.$refs.workHour.savedData(this.formHeader);
            STE_API.STE_TIMESHEET_SUBMIT_API({
                orderNo: this.formHeader.orderNo,
                steTimeSheetInsertDto: timeSheetRequest,
                steUserInsertDto: userRequest.userInsertDto,
                steUserUpdateDto: userRequest.userUpdateDto,
                ids: userRequest.ids
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.getList();
                    this.isRedact = false;
                }
            })
        }
    }
}
interface OrderList{
    id: string;
    orderNo: string;
    materialCode: string;
    materialName: string;
}
</script>
