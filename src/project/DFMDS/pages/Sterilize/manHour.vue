<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="flex">
                <el-col :span="20">
                    <el-form :inline="true" :model="formHeader" size="small" label-width="70px" class="topform multi_row">
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.workShop" placeholder="请选择" style="width: 180px;">
                                <el-option v-for="(item, index) in workshopList" :key="index" :label="item.deptName" :value="item.id" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <el-date-picker v-model="formHeader.inKjmDate" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <el-input v-model="formHeader.orderNo" placeholder="请输入" style="width: 180px;" />
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <p class="input_border_bg" style="width: 180px;">
                                {{ formHeader.material }}
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
                <el-col :span="4" style="font-size: 14px; line-height: 32px;">
                    <div style=" float: right; overflow: hidden; text-align: left;">
                        <span
                            class="point"
                            :style="{
                                background: formHeader.status === 'noPass' ? 'red' : formHeader.status === 'saved' ? '#1890f' : formHeader.status === 'submit' ? '#1890ff' : formHeader.status === '已同步' ? '#f5f7fa' : 'rgb(103, 194, 58)',
                            }"
                        />状态：
                        <span
                            :style="{
                                color: formHeader.status === 'noPass' ? 'red' : '',
                            }"
                        >{{ formHeader.status === 'noPass' ? '审核不通过' : formHeader.status === 'saved' ? '已保存' : formHeader.status === 'submit' ? '已提交' : formHeader.status === 'checked' ? '通过' : formHeader.status === '已同步' ? '未录入' : formHeader.status }}</span>
                    </div>
                    <div style="clear: both;" />
                    <div style="width: 100%; margin-top: 10px; text-align: right;">
                        <template style="float: right; margin-left: 10px;">
                            <el-button type="primary" size="small" @click="getList()">
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
            <audit-log :table-data="productPeopleAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
            <redact-box>
                <template slot="button">
                    <el-button v-if="searchCard" type="primary" class="button" size="small" @click="isRedact = !isRedact">
                        {{ isRedact ? '取消' : '编辑' }}
                    </el-button>
                    <template v-if="isRedact && searchCard" style="float: right; margin-left: 10px;">
                        <el-button type="primary" size="small" @click="savedDatas()">
                            保存
                        </el-button>
                        <el-button type="primary" size="small" @click="submitDatas()">
                            提交
                        </el-button>
                    </template>
                </template>
            </redact-box>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';
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
        inKjmDate: dateFormat(new Date(), 'yyyy-MM-dd'),
        status: ''
    }

    isRedact = false;
    workshopList = [];
    searchCard = true;
    classesOptions: object[] = [];
    productPeopleAudit = [];

    mounted() {
        this.getWorkshopList();
        this.$refs.readyTime.getClassesList();
        this.$refs.workHour.getClassesList();
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

    // 查询
    getList() {
        this.searchCard = true;
        this.$refs.workHour.init();
    }

    // 保存
    savedDatas() {
        const pkgTimeSheet = this.$refs.readyTime.savedData();
        const pkgUserSaveRequestDto = this.$refs.workHour.savedData();
        console.log(pkgTimeSheet)
        console.log(pkgUserSaveRequestDto)
    }

    // 提交
    submitDatas() {
        if (this.$refs.readyTime.ruleSubmit() && this.$refs.workHour.ruleSubmit()) {
            console.log('success');
        }
    }
}
</script>
