<template>
    <div>
        <mds-card :title="'准备工时(单位：min)'" :name="'readyTimes'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-select v-model="currentFormDataGroup.classes" size="small" style="width: 100px;" :disabled="!isRedact" clearable>
                        <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                    </el-select>
                </div>
            </template>
            <div v-if="currentFormDataGroup.classes === 'M' || currentFormDataGroup.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classesOptions ? classesOptions.find((item)=> item.dictCode === 'M').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="currentFormDataGroup" label-width="100px">
                        <el-form-item
                            prop="dayUser"
                            :rules="[
                                { required: true, message: '请输入人数'}
                            ]"
                        >
                            <template slot="label">
                                参与人数：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.dayUser" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="dayShift"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                交接班：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.dayShift" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="dayMeeting"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                班前会：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.dayMeeting" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="dayPrepaired"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                生产前准备：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.dayPrepaired" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="dayClear"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                生产后清场：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.dayClear" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model.number="currentFormDataGroup.dayQuality" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model.number="currentFormDataGroup.dayChange" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="currentFormDataGroup.classes === 'A' || currentFormDataGroup.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classesOptions ? classesOptions.find((item)=> item.dictCode === 'A').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="currentFormDataGroup" label-width="100px">
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="currentFormDataGroup.classes === '中班'" class="notNull" />参与人数：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.midUser" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="currentFormDataGroup.classes === '中班'" class="notNull" />交接班：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.midShift" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="currentFormDataGroup.classes === '中班'" class="notNull" />班前会：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.midMeeting" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="currentFormDataGroup.classes === '中班'" class="notNull" />生产前准备：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.midPrepaired" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="currentFormDataGroup.classes === '中班'" class="notNull" />生产后清场：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.midClear" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model.number="currentFormDataGroup.midQualiry" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model.number="currentFormDataGroup.midChange" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="currentFormDataGroup.classes === 'N' || currentFormDataGroup.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classesOptions ? classesOptions.find((item)=> item.dictCode === 'N').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="currentFormDataGroup" label-width="100px">
                        <el-form-item
                            prop="nightUser"
                            :rules="[
                                { required: true, message: '请输入人数'}
                            ]"
                        >
                            <template slot="label">
                                参与人数：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.nightUser" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="nightUser"
                            :rules="[
                                { required: true, message: '请输入人数'}
                            ]"
                        >
                            <template slot="label">
                                交接班：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.nightShift" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="nightMeeting"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                班前会：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.nightMeeting" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="nightPrepaired"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                生产前准备：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.nightPrepaired" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item
                            prop="nightClear"
                            :rules="[
                                { required: true, message: '请输入'},
                            ]"
                        >
                            <template slot="label">
                                生产后清场：
                            </template>
                            <el-input v-model.number="currentFormDataGroup.nightClear" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model.number="currentFormDataGroup.nightQuality" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model.number="currentFormDataGroup.nightChange" placeholder="请输入" size="small" :disabled="!isRedact" clearable oninput="value=value.replace(/\D*/g,'')" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />备注</h3>
                </div>
                <el-row>
                    <el-input v-model="currentFormDataGroup.remark" type="textarea" class="textarea" style="width: 100%; height: 100px;" :disabled="!isRedact" />
                </el-row>
            </div>
        </mds-card>
        <audit-log :table-data="readAudit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
// import { COMMON_API } from 'common/api/api';
import _ from 'lodash';

@Component({
    name: 'ReadyTimes',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    }
    })

export default class ReadyTimes extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact
    @Prop({
        type: Array,
        default: [{
            dictValue: '',
            dictCode: ''
        }]
        }) classesOptions

    currentFormDataGroup: ReadyTimesData= {}
    orgFormDataGroup: ReadyTimesData= {} // 用于比对的原始 data object
    readAudit= []
    isChange=false // data 是否有异动
    isNewForm=false // 是否初次
    $refs: {
        currentFormDataGrou: HTMLFormElement;
    }


    init(dataGroup) {
        // console.log('ReadyTimes带进来的 data')
        // console.log(dataGroup)
        if (dataGroup !== null) {
            this.currentFormDataGroup = dataGroup
            this.orgFormDataGroup = JSON.parse(JSON.stringify(dataGroup))
            this.isNewForm = false
        } else {
            this.isNewForm = true
        }
    }

    executeSave() {
        if (this.isNewForm) {
            if (this.isChange) {
                return true
            }
            return false
        }

        this.isChange = _.isEqual(this.orgFormDataGroup, this.currentFormDataGroup)
        if (this.isChange) {
            this.$message('文本记录未更异动');
            return false
        }
            this.$message('文本记录有更新');
            return true
    }

    returnDataGroup() {
        if (this.currentFormDataGroup.classes === 'M') {
            this.currentFormDataGroup.midChange = null
            this.currentFormDataGroup.midClear = null
            this.currentFormDataGroup.midMeeting = null
            this.currentFormDataGroup.midPrepaired = null
            this.currentFormDataGroup.midQualiry = null
            this.currentFormDataGroup.midShift = null
            this.currentFormDataGroup.midUser = null
            this.currentFormDataGroup.nightChange = null
            this.currentFormDataGroup.nightClear = null
            this.currentFormDataGroup.nightMeeting = null
            this.currentFormDataGroup.nightPrepaired = null
            this.currentFormDataGroup.nightQuality = null
            this.currentFormDataGroup.nightShift = null
            this.currentFormDataGroup.nightUser = null
        } else if (this.currentFormDataGroup.classes === 'A') {
            this.currentFormDataGroup.dayChange = null
            this.currentFormDataGroup.dayClear = null
            this.currentFormDataGroup.dayMeeting = null
            this.currentFormDataGroup.dayPrepaired = null
            this.currentFormDataGroup.dayQuality = null
            this.currentFormDataGroup.dayShift = null
            this.currentFormDataGroup.dayUser = null
            this.currentFormDataGroup.nightChange = null
            this.currentFormDataGroup.nightClear = null
            this.currentFormDataGroup.nightMeeting = null
            this.currentFormDataGroup.nightPrepaired = null
            this.currentFormDataGroup.nightQuality = null
            this.currentFormDataGroup.nightShift = null
            this.currentFormDataGroup.nightUser = null
        } else if (this.currentFormDataGroup.classes === 'N') {
            this.currentFormDataGroup.dayChange = null
            this.currentFormDataGroup.dayClear = null
            this.currentFormDataGroup.dayMeeting = null
            this.currentFormDataGroup.dayPrepaired = null
            this.currentFormDataGroup.dayQuality = null
            this.currentFormDataGroup.dayShift = null
            this.currentFormDataGroup.dayUser = null
            this.currentFormDataGroup.midChange = null
            this.currentFormDataGroup.midClear = null
            this.currentFormDataGroup.midMeeting = null
            this.currentFormDataGroup.midPrepaired = null
            this.currentFormDataGroup.midQualiry = null
            this.currentFormDataGroup.midShift = null
            this.currentFormDataGroup.midUser = null
        } else {
            //
        }

        return JSON.parse(JSON.stringify(this.currentFormDataGroup))
    }
}
interface ReadyTimesData {
    checkStatus?: string; //审核状态(T:已同步，N:未录入、S:已保存、P:待审核、C:已审核、P:已过账、R:已退回)
    classes?: string; // 班次
    dayChange?: number | null; // 白班切换时间
    dayClear?: number | null; // 生产后清场
    dayMeeting?: number | null; // 班前会
    dayPrepaired?: number | null; // 生产前准备
    dayQuality?: number | null; // 白班品质保证
    dayShift?: number | null; // 交接班
    dayUser?: number | null; // 白班参与人数
    factory?: string; // 工厂 #
    funcCode?: string; // 功能code(暂时可不填)
    id?: string; // 主键ID  #
    midChange?: number | null; // 中班切换时间
    midClear?: number | null; // 生产后清场
    midMeeting?: number | null; // 班前会
    midPrepaired?: number | null; // 生产前准备
    midQualiry?: number | null; // 中班品质保证
    midShift?: number | null; // 交接班
    midUser?: number | null; // 中班参与人数
    nightChange?: number | null; // 夜班切换时间
    nightClear?: number | null; // 生产后清场
    nightMeeting?: number | null; // 班前会
    nightPrepaired?: number | null; // 生产前准备
    nightQuality?: number | null; // 夜班品质保证
    nightShift?: number | null; // 交接班
    nightUser?: number | null; // 夜班参与人数
    orderId?: string; // 所属订单ID
    orderNo?: string; // 订单号
    remark?: string; // 备注
}
</script>
