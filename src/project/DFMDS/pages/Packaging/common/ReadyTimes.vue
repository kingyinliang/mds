<template>
    <div>
        <mds-card :title="'准备工时(单位：min)'" :name="'readyTimes'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-select v-model="formInline.classes" size="small">
                        <el-option v-for="(item, index) in classList" :key="index" :value="item.dictCode" :label="item.dictValue" />
                    </el-select>
                </div>
            </template>
            <div v-if="formInline.classes === 'M' || formInline.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classList ? classList.find((item)=> item.dictCode === 'M').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="currentFormDataGroup" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model.number="formInline.dayUser" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model.number="formInline.dayShift" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model.number="formInline.dayMeeting" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model.number="formInline.dayPrepaired" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model.number="formInline.dayClear" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model.number="formInline.dayQuality" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model.number="formInline.dayChange" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="formInline.classes === 'A' || formInline.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classList ? classList.find((item)=> item.dictCode === 'A').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="currentFormDataGroup" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model.number="formInline.midUser" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model.number="formInline.midShift" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model.number="formInline.midMeeting" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model.number="formInline.midPrepaired" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model.number="formInline.midClear" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model.number="formInline.midQualiry" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model.number="formInline.midChange" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="formInline.classes === 'N' || formInline.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classList ? classList.find((item)=> item.dictCode === 'N').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="currentFormDataGroup" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model.number="formInline.nightUser" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model.number="formInline.nightShift" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model.number="formInline.nightMeeting" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model.number="formInline.nightPrepaired" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model.number="formInline.nightClear" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model.number="formInline.nightQuality" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model.number="formInline.nightChange" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />备注</h3>
                </div>
                <el-row>
                    <el-input v-model="formInline.remark" type="textarea" class="textarea" style="width: 100%; height: 100px;" />
                </el-row>
            </div>
        </mds-card>
        <audit-log :table-data="readAudit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { COMMON_API } from 'common/api/api';

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

    formInline= {}
    readAudit= []
    classList: object[]= []
    // @Prop({ default: [] }) classList: object[]

    // getDataList(formHeader: object) {
    //     PKG_API.PKG_READYTIME_QUERY_API({ factory: formHeader['factory'], orderNo: formHeader['orderNo'] }).then(({ data }) => {
    //         if (data.code === 200) {
    //             this.formInline = data.data
    //             if (data.data.classes === '') {
    //                 this.formInline['classes'] = 'M';
    //             }
    //         }
    //     });
    // }
    created() {
        // 班次拉取
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
            this.classList = data.data
        });
    }

    returnDataGroup() {
        // this.readyTimesData = JSON.parse(JSON.stringify(this.currentFormDataGroup))
        // return this.readyTimesData
    }
}
interface ReadyTimesData {
    checkStatus?: string; //审核状态(T:已同步，N:未录入、S:已保存、P:待审核、C:已审核、P:已过账、R:已退回)
    classes?: string; // 班次
    dayChange?: number; // 白班切换时间
    dayClear?: number; // 生产后清场
    dayMeeting?: number; // 班前会
    dayPrepaired?: number; // 生产前准备
    dayQuality?: number; // 白班品质保证
    dayShift?: number; // 交接班
    dayUser?: number; // 白班参与人数
    factory?: string; // 工厂 #
    funcCode?: string; // 功能code(暂时可不填)
    id?: string; // 主键ID  #
    midChange?: number; // 中班切换时间
    midClear?: number; // 生产后清场
    midMeeting?: number; // 班前会
    midPrepaired?: number; // 生产前准备
    midQualiry?: number; // 中班品质保证
    midShift?: number; // 交接班
    midUser?: number; // 中班参与人数
    nightChange?: number; // 夜班切换时间
    nightClear?: number; // 生产后清场
    nightMeeting?: number; // 班前会
    nightPrepaired?: number; // 生产前准备
    nightQuality?: number; // 夜班品质保证
    nightShift?: number; // 交接班
    nightUser?: number; // 夜班参与人数
    orderId?: string; // 所属订单ID
    orderNo?: string; // 订单号
    remark?: string; // 备注
}
</script>
