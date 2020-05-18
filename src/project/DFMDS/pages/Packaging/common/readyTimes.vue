<template>
    <div>
        <mds-card :title="'准备工时(单位：min)'" :name="'readyTimes'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-select v-model="readyType" size="small">
                        <el-option v-for="(item, index) in classList" :key="index" :value="item.name" :label="item.name" />
                    </el-select>
                </div>
            </template>
            <div v-if="readyType === '白班' || readyType === '多班'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />白班</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="formInline" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="readyType === '中班' || readyType === '多班'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />中班</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="formInline" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span v-if="readyType === '中班'" class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="readyType === '中班'" class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="readyType === '中班'" class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="readyType === '中班'" class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span v-if="readyType === '中班'" class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div v-if="readyType === '夜班' || readyType === '多班'" class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />夜班</h3>
                </div>
                <el-row>
                    <el-form :inline="true" :model="formInline" label-width="92px">
                        <el-form-item>
                            <template slot="label">
                                <span class="notNull">*</span>参与人数：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>交接班：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>班前会：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产前准备：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="">
                            <template slot="label">
                                <span class="notNull">*</span>生产后清场：
                            </template>
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="品质保证：">
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                        <el-form-item label="切换时间：">
                            <el-input v-model="formInline.user" placeholder="请输入" size="small" />
                        </el-form-item>
                    </el-form>
                </el-row>
            </div>
            <div class="marginL10px">
                <div class="box-card-title clearfix">
                    <h3><i class="point-icon" />备注</h3>
                </div>
                <el-row>
                    <el-input v-model="formInline.Text" type="textarea" class="textarea" style="width: 100%; height: 100px;" />
                </el-row>
            </div>
        </mds-card>
        <audit-log :table-data="ReadAudit" />
    </div>
</template>

<script>
export default {
    name: 'ReadyTimes',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {},
    data() {
        return {
            classList: [
                {
                    name: '白班',
                    value: '白班'
                }, {
                    name: '中班',
                    value: '中班'
                }, {
                    name: '夜班',
                    value: '夜班'
                }, {
                    name: '多班',
                    value: '多班'
                }
            ],
            readyType: '白班',
            formInline: {},
            ReadAudit: []
        }
    },
    methods: {
    }
}
</script>
