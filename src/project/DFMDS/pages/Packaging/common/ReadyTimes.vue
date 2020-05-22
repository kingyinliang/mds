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
                    <el-form :inline="true" :model="formInline" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model="formInline.dayUser" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model="formInline.dayShift" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model="formInline.dayMeeting" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model="formInline.dayPrepaired" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model="formInline.dayClear" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model="formInline.dayQuality" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model="formInline.dayChange" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="formInline.classes === 'A' || formInline.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classList ? classList.find((item)=> item.dictCode === 'A').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="formInline" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model="formInline.midUser" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model="formInline.midShift" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model="formInline.midMeeting" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model="formInline.midPrepaired" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="formInline.classes === '中班'" class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model="formInline.midClear" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model="formInline.midQualiry" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model="formInline.midChange" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="formInline.classes === 'N' || formInline.classes === 'D'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />{{ classList ? classList.find((item)=> item.dictCode === 'N').dictValue : '' }}</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="formInline" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model="formInline.nightUser" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model="formInline.nightShift" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model="formInline.nightMeeting" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model="formInline.nightPrepaired" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model="formInline.nightClear" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model="formInline.nightQuality" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model="formInline.nightChange" placeholder="请输入" size="small" />
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
        <audit-log :table-data="ReadAudit" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PKG_API } from 'common/api/api';

@Component({
    name: 'ReadyTimes',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    }
    })

export default class ReadyTimes extends Vue {

    formInline= {}
    ReadAudit= []

    @Prop({ default: [] }) classList: object[]

    getDataList(orderNo: string) {
        PKG_API.PKG_READYTIME_QUERY_API({ orderNo: orderNo }).then(({ data }) => {
            if (data.code === 200) {
                this.formInline = data.data
                if (data.data.classes === '') {
                    this.formInline['classes'] = 'M';
                }
            }
        });
    }

}
</script>
