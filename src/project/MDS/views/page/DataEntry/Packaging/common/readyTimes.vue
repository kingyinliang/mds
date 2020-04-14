<template>
    <el-form ref="timesForm" :inline="true" :model="readyDate" size="small" label-width="125px">
        <div class="clearfix topBox">
            <h3>录入数据单位：MIN</h3>
            <el-form-item v-if="readyDate.isCause === '1'" label="班次：" style="float: right; width: 162px;" label-width="60px">
                <el-select v-model="readyDate.classes" style="width: 100px;" placeholder="请选择" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))">
                    <el-option label="白班" value="白班" />
                    <el-option label="中班" value="中班" />
                    <el-option label="夜班" value="夜班" />
                    <el-option label="多班" value="多班" />
                </el-select>
            </el-form-item>
            <el-form-item label="是否停线交接班：" style="float: right; width: 230px;">
                <el-select v-model="readyDate.isCause" style="width: 100px;" placeholder="是否停线交接班" disabled>
                    <el-option label="是" value="1" />
                    <el-option label="否" value="0" />
                </el-select>
            </el-form-item>
        </div>
        <el-card v-if="readyDate.classes === '' || readyDate.classes === '白班' || readyDate.classes === '多班'" class="box-card">
            <div slot="header" class="clearfix">
                白班录入
                <span class="readyshiftBtn dayshift" name="dayshift">收起<i class="el-icon-caret-top" /></span>
            </div>
            <div class="dayshiftBox">
                <el-form-item label="工作开始时间：">
                    <el-date-picker
                        v-model="readyDate.dayStartDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="开线时间：">
                    <el-date-picker
                        v-model="readyDate.dayStartLineDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="切换时间：">
                    <el-input v-model="readyDate.dayChange" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" placeholder="手工录入" />
                </el-form-item>
                <el-form-item label="工作结束时间：">
                    <el-date-picker
                        v-model="readyDate.dayEndDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="停线时间：">
                    <el-date-picker
                        v-model="readyDate.dayCauseDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="用餐时间：">
                    <el-input v-model="readyDate.dayDinner" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" placeholder="手工录入" />
                </el-form-item>
            </div>
        </el-card>
        <el-card v-if="readyDate.isCause == '1' && (readyDate.classes === '' || readyDate.classes === '中班' || readyDate.classes === '多班')" class="box-card">
            <div slot="header" class="clearfix">
                中班录入
                <span class="readyshiftBtn middleshift" name="middleshift">收起 <i class="el-icon-caret-top" /></span>
            </div>
            <div class="middleshiftBox">
                <el-form-item label="工作开始时间：">
                    <el-date-picker
                        v-model="readyDate.midStartDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="开线时间：">
                    <el-date-picker
                        v-model="readyDate.midStartLineDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="切换时间：">
                    <el-input v-model="readyDate.midChange" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
                </el-form-item>
                <el-form-item label="工作结束时间：">
                    <el-date-picker
                        v-model="readyDate.midEndDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="停线时间：">
                    <el-date-picker
                        v-model="readyDate.midCauseDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="用餐时间：">
                    <el-input v-model="readyDate.midDinner" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
                </el-form-item>
            </div>
        </el-card>
        <el-card v-if="readyDate.isCause == '1' && (readyDate.classes === '' || readyDate.classes === '夜班' || readyDate.classes === '多班')" class="box-card">
            <div slot="header" class="clearfix">
                夜班录入
                <span class="readyshiftBtn nightshift" name="nightshift">收起 <i class="el-icon-caret-top" /></span>
            </div>
            <div class="nightshiftBox">
                <el-form-item label="工作开始时间：">
                    <el-date-picker
                        v-model="readyDate.nightStartDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="开线时间：">
                    <el-date-picker
                        v-model="readyDate.nightStartLineDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="切换时间：">
                    <el-input v-model="readyDate.nightChange" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
                </el-form-item>
                <el-form-item label="工作结束时间：">
                    <el-date-picker
                        v-model="readyDate.nightEndDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="停线时间：">
                    <el-date-picker
                        v-model="readyDate.nightCauseDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        format="yyyy.MM.dd HH:mm"
                        placeholder="选择"
                        :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))"
                        style="width: 184px;"
                    />
                </el-form-item>
                <el-form-item label="用餐时间：">
                    <el-input v-model="readyDate.nightDinner" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
                </el-form-item>
            </div>
        </el-card>
        <div style="padding: 20px;">
            <el-form-item label="交接班：">
                <el-input v-model="readyDate.shift" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
            </el-form-item>
            <el-form-item label="班前会：">
                <el-input v-model="readyDate.meeting" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
            </el-form-item>
            <el-form-item label="生产前准备：">
                <el-input v-model="readyDate.prepared" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
            </el-form-item>
            <el-form-item label="生产后清场：">
                <el-input v-model="readyDate.clear" placeholder="手工录入" :disabled="!(isRedact && (readyDate.status === 'noPass' || readyDate.status === 'saved' || readyDate.status === ''))" />
            </el-form-item>
        </div>
        <audit-log :table-data="ReadAudit" />
    </el-form>
</template>

<script>
import { PACKAGING_API } from '@/api/api';
import { toDate, Readyanimation } from '@/net/validate';
export default {
    name: 'ReadyTimes',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    },
    props: {
        isRedact: {
            type: Boolean
        },
        order: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {
            readyDate: {
                classes: '多班',
                id: '',
                status: '',
                orderId: '',
                isCause: '1',
                dayStartDate: '',
                dayStartLineDate: '',
                dayChange: '',
                dayDinner: '',
                dayCauseDate: '',
                dayEndDate: '',
                midCauseDate: '',
                midChange: '',
                midDinner: '',
                midEndDate: '',
                midStartDate: '',
                midStartLineDate: '',
                nightCauseDate: '',
                nightChange: '',
                nightDinner: '',
                nightEndDate: '',
                nightStartDate: '',
                nightStartLineDate: '',
                shift: '',
                meeting: '',
                prepared: '',
                clear: ''
            },
            ReadAudit: [],
            readyStatus: true
        };
    },
    computed: {},
    watch: {
        'readyDate.classes'(val) {
            if (val === '白班') {
                this.readyDate.midCauseDate = null;
                this.readyDate.midChange = null;
                this.readyDate.midDinner = null;
                this.readyDate.midEndDate = null;
                this.readyDate.midStartDate = null;
                this.readyDate.midStartLineDate = null;
                this.readyDate.nightCauseDate = null;
                this.readyDate.nightChange = null;
                this.readyDate.nightDinner = null;
                this.readyDate.nightEndDate = null;
                this.readyDate.nightStartDate = null;
                this.readyDate.nightStartLineDate = null;
            } else if (val === '中班') {
                this.readyDate.dayStartDate = null;
                this.readyDate.dayStartLineDate = null;
                this.readyDate.dayChange = null;
                this.readyDate.dayDinner = null;
                this.readyDate.dayCauseDate = null;
                this.readyDate.dayEndDate = null;
                this.readyDate.nightCauseDate = null;
                this.readyDate.nightChange = null;
                this.readyDate.nightDinner = null;
                this.readyDate.nightEndDate = null;
                this.readyDate.nightStartDate = null;
                this.readyDate.nightStartLineDate = null;
            } else if (val === '夜班') {
                this.readyDate.dayStartDate = null;
                this.readyDate.dayStartLineDate = null;
                this.readyDate.dayChange = null;
                this.readyDate.dayDinner = null;
                this.readyDate.dayCauseDate = null;
                this.readyDate.dayEndDate = null;
                this.readyDate.midCauseDate = null;
                this.readyDate.midChange = null;
                this.readyDate.midDinner = null;
                this.readyDate.midEndDate = null;
                this.readyDate.midStartDate = null;
                this.readyDate.midStartLineDate = null;
            } else if (val === '多班') {
                this.readyDate.midCauseDate = null;
                this.readyDate.midChange = null;
                this.readyDate.midDinner = null;
                this.readyDate.midEndDate = null;
                this.readyDate.midStartDate = null;
                this.readyDate.midStartLineDate = null;
            }
        }
    },
    mounted() {
        Readyanimation(this.$);
    },
    methods: {
        // 获取包装车间准备时间列表
        /* eslint-disable @typescript-eslint/camelcase */
        Getpkgready(id) {
            this.$http(`${PACKAGING_API.PKGREADYLIST_API}`, 'POST', {
                order_id: id
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.listForm.length > 0) {
                        this.$emit('GetReadyStatus', data.listForm[0].status);
                        this.readyDate = data.listForm[0];
                        this.ReadAudit = data.listApproval;
                    }
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        /* eslint-denable @typescript-eslint/camelcase */
        readyrul() {
            let ty = true;
            if (this.order.workShopName !== '组装车间2（礼盒）') {
                if (this.readyDate.classes === '白班') {
                    if (this.readyDate.dayStartLineDate && this.readyDate.dayStartDate && (this.readyDate.dayDinner || this.readyDate.dayDinner === 0) && this.readyDate.dayCauseDate && this.readyDate.dayEndDate) {
                        if ((toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000 < 0) {
                            ty = false;
                            this.$warningTost('准备时间白班工作结束时间不能早于停线时间');
                            return false;
                        }
                        if (
                            (toDate(this.readyDate.dayStartLineDate) - toDate(this.readyDate.dayStartDate)) / 60000 >= 0 &&
                            (toDate(this.readyDate.dayCauseDate) - toDate(this.readyDate.dayStartLineDate)) / 60000 > 0 &&
                            (toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000 >= 0
                        ) {
                            //
                        } else {
                            ty = false;
                            this.$warningTost('准备时间白班工作开始时间<=开线时间<停线时间<=工作结束时间');
                            return false;
                        }
                    } else {
                        ty = false;
                        this.$warningTost('准备时间白班必填字段未填');
                        return false;
                    }
                } else if (this.readyDate.classes === '中班') {
                    if (this.readyDate.midCauseDate && this.readyDate.midStartDate && (this.readyDate.midDinner || this.readyDate.midDinner === 0) && this.readyDate.midCauseDate && this.readyDate.midEndDate) {
                        if ((toDate(this.readyDate.midEndDate) - toDate(this.readyDate.midCauseDate)) / 60000 < 0) {
                            ty = false;
                            this.$warningTost('准备时间中班工作结束时间不能早于停线时间');
                            return false;
                        }
                        if (
                            (toDate(this.readyDate.midStartLineDate) - toDate(this.readyDate.midStartDate)) / 60000 >= 0 &&
                            (toDate(this.readyDate.midCauseDate) - toDate(this.readyDate.midStartLineDate)) / 60000 > 0 &&
                            (toDate(this.readyDate.midEndDate) - toDate(this.readyDate.midCauseDate)) / 60000 >= 0
                        ) {
                            //
                        } else {
                            ty = false;
                            this.$warningTost('准备时间中班工作开始时间<=开线时间<停线时间<=工作结束时间');
                            return false;
                        }
                    } else {
                        ty = false;
                        this.$warningTost('准备时间中班必填字段未填');
                        return false;
                    }
                } else if (this.readyDate.classes === '夜班') {
                    if (this.readyDate.nightStartLineDate && this.readyDate.nightStartDate && (this.readyDate.nightDinner || this.readyDate.nightDinner === 0) && this.readyDate.nightCauseDate && this.readyDate.nightEndDate) {
                        if ((toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000 < 0) {
                            ty = false;
                            this.$warningTost('准备时间夜班工作结束时间不能早于停线时间');
                            return false;
                        }
                        if (
                            (toDate(this.readyDate.nightStartLineDate) - toDate(this.readyDate.nightStartDate)) / 60000 >= 0 &&
                            (toDate(this.readyDate.nightCauseDate) - toDate(this.readyDate.nightStartLineDate)) / 60000 > 0 &&
                            (toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000 >= 0
                        ) {
                            //
                        } else {
                            ty = false;
                            this.$warningTost('准备时间夜班工作开始时间<=开线时间<停线时间<=工作结束时间');
                            return false;
                        }
                    } else {
                        ty = false;
                        this.$warningTost('准备时间夜班必填字段未填');
                        return false;
                    }
                } else if (this.readyDate.classes === '多班') {
                    if (
                        this.readyDate.dayStartLineDate &&
                        this.readyDate.dayStartDate &&
                        (this.readyDate.dayDinner || this.readyDate.dayDinner === 0) &&
                        this.readyDate.dayCauseDate &&
                        this.readyDate.dayEndDate &&
                        this.readyDate.nightStartLineDate &&
                        this.readyDate.nightStartDate &&
                        (this.readyDate.nightDinner || this.readyDate.nightDinner === 0) &&
                        this.readyDate.nightCauseDate &&
                        this.readyDate.nightEndDate
                    ) {
                        if ((toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000 < 0) {
                            ty = false;
                            this.$warningTost('准备时间白班工作结束时间不能早于停线时间');
                            return false;
                        }
                        if ((toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000 < 0) {
                            ty = false;
                            this.$warningTost('准备时间夜班工作结束时间不能早于停线时间');
                            return false;
                        }
                        if (
                            (toDate(this.readyDate.dayStartLineDate) - toDate(this.readyDate.dayStartDate)) / 60000 >= 0 &&
                            (toDate(this.readyDate.dayCauseDate) - toDate(this.readyDate.dayStartLineDate)) / 60000 > 0 &&
                            (toDate(this.readyDate.dayEndDate) - toDate(this.readyDate.dayCauseDate)) / 60000 >= 0
                        ) {
                            //
                        } else {
                            ty = false;
                            this.$warningTost('准备时间白班工作开始时间<=开线时间<停线时间<=工作结束时间');
                            return false;
                        }
                        if (
                            (toDate(this.readyDate.nightStartLineDate) - toDate(this.readyDate.nightStartDate)) / 60000 >= 0 &&
                            (toDate(this.readyDate.nightCauseDate) - toDate(this.readyDate.nightStartLineDate)) / 60000 > 0 &&
                            (toDate(this.readyDate.nightEndDate) - toDate(this.readyDate.nightCauseDate)) / 60000 >= 0
                        ) {
                            //
                        } else {
                            ty = false;
                            this.$warningTost('准备时间夜班工作开始时间<=开线时间<停线时间<=工作结束时间');
                            return false;
                        }
                    } else {
                        ty = false;
                        this.$warningTost('准备时间白班和夜班必填字段未填');
                        return false;
                    }
                }
            }
            return ty;
        },
        // 修改准备时间
        UpdateReady(id, str, resolve, reject) {
            this.readyDate.orderId = id;
            if (!this.readyDate.status) {
                this.readyDate.status = str;
            } else if (this.readyDate.status === 'saved') {
                    this.readyDate.status = str;
                } else if (this.readyDate.status === 'noPass' && str === 'submit') {
                    this.readyDate.status = str;
                }
            this.$http(`${PACKAGING_API.PKGREADYUPDATE_API}`, 'POST', this.readyDate)
                .then(({ data }) => {
                    if (data.code !== 0) {
                        this.$errorTost(data.msg);
                    }
                    if (resolve) {
                        resolve('resolve');
                    }
                })
                .catch(() => {
                    if (resolve) {
                        reject('reject');
                    }
                });
        }
    }
};
</script>

<style lang="scss" scoped>
.readyshiftBtn {
    color: #3a8ee6;
    font-weight: 400;
    cursor: pointer;
}
</style>
