<!-- 工时录入 -->
<template lang="pug">
    div.header_main
        el-card.searchCard
            el-row.flex
                el-col(:span="22")
                    el-form(:inline="true" :model="formHeader" size="small" label-width="80px" class="topform multi_row")
                        el-form-item
                            template(slot="label")
                                span(class="notNull") *
                                span 生产车间：
                            el-select(v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;")
                                el-option(v-for="(item, index) in workshopList" :key="index" :label="item.deptName" :value="item.id")
                        el-form-item
                            template(slot="label")
                                span(class="notNull") *
                                span 生产日期：
                            el-date-picker(v-model="formHeader.productDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" style="width: 180px;")
                        el-form-item
                            template(slot="label")
                                span(class="notNull") *
                                span 工序：
                            el-select(v-model="formHeader.productProcess" placeholder="请选择" style="width: 180px;")
                                el-option(v-for="(item, index) in productProcessList" :key="index" :label="item.dictValue" :value="item.dictCode")
                        el-form-item(label="提交人员：")
                            p(class="input_border_bg" style="width: 180px;") {{ formHeader.changer }}
                        el-form-item(label="提交时间：")
                            p(class="input_border_bg" style="width: 180px;") {{ formHeader.changed }}
                el-col(:span="2" style="font-size: 14px; line-height: 32px;")
                    div(style="display: flex;flex-direction: row;justify-content: flex-end;align-items: center;")
                        span.dot(:style="{background: formHeader.checkStatus === 'R' ? 'red' : formHeader.checkStatus === 'S' ? '#1890f' : formHeader.checkStatus === 'M' ? '#1890ff' : formHeader.checkStatus === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)'}")
                        span {{'状态：'}}
                        span(:style="{color: formHeader.checkStatus === 'R' ? 'red' : ''}") {{ formHeader.checkStatusName }}
                    div(style="width: 100%; margin-top: 10px; text-align: right;")
                        template(style="float: right; margin-left: 10px;")
                            el-button(v-if="isAuth('steTimeQuery')" type="primary" size="small" @click="getList()") 查询
        div(v-show="searchCard")
            ready-time(ref="readyTime" :is-redact="isRedact" :status="this.formHeader.checkStatus" style="margin-top: 10px;")
            work-hour(ref="workHour" :is-redact="isRedact" :status="this.formHeader.checkStatus")
            audit-log(:table-data="manHourAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true")
        redact-box(v-if="!(formHeader.checkStatus === 'C' || formHeader.checkStatus === 'D' || formHeader.checkStatus === 'P' || formHeader.checkStatus ==='M')" :disabled="redactBoxDisable" :is-redact.sync='isRedact' redact-auth="steTimeEdit" save-auth="steTimeSave" submit-auth="steTimeSubmit" :urgent-submit="false" :submit-rules="submitRules" :saved-rules="savedRules" :saved-datas="savedDatas" :submit-datas="submitDatas")
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
// import { COMMON_API, AUDIT_API, KOJI_API } from 'common/api/api';
import { COMMON_API } from 'common/api/api';
import { dateFormat } from 'utils/utils';
import ReadyTime from 'components/ReadyTimes.vue';
import OfficialWorker from 'components/OfficialWorker.vue';
import LoanedPersonnel from 'components/LoanedPersonnel.vue';
import TemporaryWorker from 'components/TemporaryWorker.vue';
import RedactBox from 'components/RedactBox.vue' // 下方状态 bar
import FER_API from 'src/common/api/fer';
@Component({
    name: 'TimeEntry',
    components: {
        ReadyTime,
        OfficialWorker,
        LoanedPersonnel,
        TemporaryWorker,
        RedactBox
    }
})
export default class TimeEntry extends Vue {
    $refs: {
        readyTime: HTMLFormElement;
        workHour: HTMLFormElement;
    }

    checkStatus: CheckStatus[] =[]

    formHeader = {
        workShop: '',
        productDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        productProcess: '',
        checkStatus: '',
        checkStatusName: '',
        orderId: '',
        materialCode: '',
        materialName: '',
        changer: '',
        changed: ''
    }

    redactBoxDisable=true


    isRedact = false;
    workshopList = [];
    productProcessList: OrderList[] = [];
    searchCard = true;
    classesOptions: object[] = [];
    manHourAudit = [];
    timeSheetResponseDto = '';
    userResponseDto: object[] = [];

    mounted() {
        this.getCheckStatus(); // audit status list
        this.getWorkshopList(); // workshop list
        this.getProductProcess();
        this.$refs.readyTime.init();
        this.$refs.workHour.init();
    }

    // @Watch('formHeader.workShop')
    // watchWorkShop() {
    //     this.getProductProcess()
    // }

    @Watch('formHeader.productDate')
    watchProductDate() {
        // this.getOrderList();
    }

    @Watch('formHeader.productProcess')
    watchProcess() {

        // const productProcessSole = this.productProcessList.find((item: OrderList) => item.productProcess === this.formHeader.productProcess)
        // if (productProcessSole) {
        //     // this.formHeader['orderId'] = this.productProcessList.find((item: OrderList) => item.productProcess === this.formHeader.productProcess)['id'];
        //     this.formHeader.orderId = productProcessSole.id;
        //     this.formHeader.materialCode = productProcessSole.materialCode;
        //     this.formHeader.materialName = productProcessSole.materialName;
        //     // this.searchCard = false;
        //     this.isRedact = false;
        // }

        // this.$refs.readyTime.changeList({});
        // this.$refs.workHour.changeList({});
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
            deptName: '发酵'
        }).then(({ data }) => {
            this.workshopList = data.data;
            if (data.data.length !== 0) {
                this.formHeader.workShop = data.data[0]['id'];
            }
        })
    }

    // 获取工序
    getProductProcess() {
        COMMON_API.DICTIONARY_ITEM_DROPDOWN_POST_API({
            dictType: 'FER_PROCESS_STAGE' // 发酵工序段
        }).then(({ data }) => {
            this.productProcessList = data.data;
        });
    }

    // 获取审核状态 list
    getCheckStatus() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
            this.checkStatus = data.data;
        });
    }


    // 订单拉取
    // getOrderList() {
    //     this.formHeader.productProcess = '';
    //     KOJI_API.KOJI_TIMESHEET_QUERY_API({
    //         workShop: this.formHeader.workShop,
    //         productDate: this.formHeader.productDate
    //     }).then(({ data }) => {
    //         if (data.code === 200) {
    //             this.productProcessList = data.data;
    //             if (this.productProcessList.length !== 0) {
    //                 this.formHeader.productProcess = this.productProcessList[0]['productProcess'];
    //             }
    //         }
    //     })
    // }

    // 查询
    getList() {
        if (this.formHeader.workShop === '' || this.formHeader.productDate === '' || this.formHeader.productProcess === '') {
            this.$infoToast('请选择查询必填项');
            return false;
        }
        FER_API.FER_TIME_SHEET_QUERY_API(this.formHeader).then(({ data }) => {
                console.log('data')
                console.log(data)
                // this.searchCard = true;
                if (data.data.ferTimeSheetResponseDto === null && data.data.ferUserDtos.length === 0) {
                    this.$infoToast('暂无任何内容');
                    this.formHeader.checkStatus = '';
                    this.formHeader.checkStatusName = '';
                    this.formHeader.changed = '';
                    this.formHeader.changer = '';
                    this.$refs.readyTime.changeList({});
                    this.$refs.workHour.changeList([]);
                } else {
                    this.formHeader.checkStatus = data.data.ferTimeSheetResponseDto.status;
                    this.formHeader.checkStatusName = this.checkStatus.filter(item => item.dictCode === this.formHeader.checkStatus)[0].dictValue
                    this.formHeader.changed = data.data.changed;
                    this.formHeader.changer = data.data.changer;
                    this.$refs.readyTime.changeList(data.data.ferTimeSheetResponseDto);
                    this.$refs.workHour.changeList(data.data.ferUserDtos);
                }


        })
        this.redactBoxDisable = false
        // AUDIT_API.AUDIT_LOG_LIST_API({
        //     productProcess: this.formHeader.productProcess,
        //     verifyType: 'TIMESHEET'
        // }).then(({ data }) => {
        //     this.manHourAudit = data.data;
        //     this.redactBoxDisable = false
        // })
    }

    // 保存
    savedDatas() {
        const timeSheetRequest = this.$refs.readyTime.savedData(this.formHeader);
        const userRequest = this.$refs.workHour.savedData(this.formHeader);

        // !! 不统一之特例处理
        this.$set(timeSheetRequest, 'workShop', this.formHeader.workShop)
        this.$set(timeSheetRequest, 'productDate', this.formHeader.productDate)
        this.$set(timeSheetRequest, 'productProcess', this.formHeader.productProcess)

        if (userRequest.userInsertDto.length !== 0) {
            userRequest.userInsertDto.forEach(item => {
                this.$set(item, 'workShop', this.formHeader.workShop)
                this.$set(item, 'productDate', this.formHeader.productDate)
                this.$set(item, 'productProcess', this.formHeader.productProcess)
            })
        }

        if (userRequest.userUpdateDto.length !== 0) {
            userRequest.userUpdateDto.forEach(item => {
                this.$set(item, 'workShop', this.formHeader.workShop)
                this.$set(item, 'productDate', this.formHeader.productDate)
                this.$set(item, 'productProcess', this.formHeader.productProcess)
            })
        }


        return new Promise((resolve) => {
                FER_API.FER_TIME_SHEET_SAVE_API({
                    ferTimeSheetInsertDto: timeSheetRequest,
                    userInsertDtos: userRequest.userInsertDto,
                    userRemoveIds: userRequest.ids,
                    userUpdateDtos: userRequest.userUpdateDto
                }).then(() => {
                    this.getList()
                    resolve()
                })
            })

        // return KOJI_API.KOJI_TIMESHEET_SAVE_API({
        //     kojiTimeSheetInsertDto: timeSheetRequest,
        //     userInsertDtos: userRequest.userInsertDto,
        //     userRemoveIds: userRequest.ids,
        //     userUpdateDtos: userRequest.userUpdateDto
        // })
    }

    // 提交
    submitDatas() {
        if (this.$refs.readyTime.ruleSubmit() && this.$refs.workHour.ruleSubmit()) {
            const timeSheetRequest = this.$refs.readyTime.savedData(this.formHeader);
            const userRequest = this.$refs.workHour.savedData(this.formHeader);

            // !! 不统一之特例处理
            this.$set(timeSheetRequest, 'workShop', this.formHeader.workShop)
            this.$set(timeSheetRequest, 'productDate', this.formHeader.productDate)
            this.$set(timeSheetRequest, 'productProcess', this.formHeader.productProcess)

            if (userRequest.userInsertDto.length !== 0) {
                userRequest.userInsertDto.forEach(item => {
                    this.$set(item, 'workShop', this.formHeader.workShop)
                    this.$set(item, 'productDate', this.formHeader.productDate)
                    this.$set(item, 'productProcess', this.formHeader.productProcess)
                })
            }

            if (userRequest.userUpdateDto.length !== 0) {
                userRequest.userUpdateDto.forEach(item => {
                    this.$set(item, 'workShop', this.formHeader.workShop)
                    this.$set(item, 'productDate', this.formHeader.productDate)
                    this.$set(item, 'productProcess', this.formHeader.productProcess)
                })
            }


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

            return new Promise((resolve) => {
                FER_API.FER_TIME_SHEET_SUBMIT_API({
                    ferTimeSheetInsertDto: timeSheetRequest,
                    userInsertDtos: userRequest.userInsertDto,
                    userRemoveIds: userRequest.ids,
                    userUpdateDtos: userRequest.userUpdateDto
                }).then(() => {
                    this.getList()
                    resolve()
                })
            })

            // KOJI_API.KOJI_TIMESHEET_SUBMIT_API({
            //     kojiTimeSheetInsertDto: timeSheetRequest,
            //     userInsertDtos: userRequest.userInsertDto,
            //     userRemoveIds: userRequest.ids,
            //     userUpdateDtos: userRequest.userUpdateDto
            // }).then(() => {
            //     this.getList()
            // })
        }
    }

    // {redact-box} 提交需跑的验证 function
    submitRules(): Function[] {
        return [this.$refs.readyTime.ruleSubmit, this.$refs.workHour.ruleSubmit]
    }

    // {redact-box} 保存需跑的验证 function
    savedRules(): Function[] {
        return []
    }
}
interface OrderList{
    id: string;
    productProcess: string;
    materialCode: string;
    materialName: string;
}
interface CheckStatus{
    dictCode: string;
    dictId?: string;
    dictValue: string;
    factoryName?: string;
    id?: string;
}
</script>

<style lang="scss"  scoped>

.dot {
    display: inline-block;
    width: 5px;
    height: 5px;
    margin-right: 8px;
    line-height: 16px;
    border-radius: 50%;
}
</style>

