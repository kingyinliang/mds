<template>
    <div class="koji-process-control">
        <mds-card title="筛豆记录" name="table1" icon-bg="#487BFF">
            <div>
                <el-form :inline="true" :model="craftInfo" label-width="115px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>筛豆开始时间：
                        </template>
                        <el-date-picker v-model="craftInfo.feedStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>筛豆结束时间：
                        </template>
                        <el-date-picker v-model="craftInfo.feeEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            停机时长：
                        </template>
                        <el-input v-model="craftInfo.consumeAmount" placeholder="" :disabled="!isRedact" size="small" style="width: 175px;">
                            <span slot="suffix" class="stock-form_item_input_suffix">min</span>
                        </el-input>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="addDataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="small">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>大豆批次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.controlType" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;" @change="controlTypeChange($event, scope.row)">
                            <el-option v-for="(subItem, index) in controlTypeList" :key="index" :label="subItem.dictValue" :value="subItem.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="大豆厂家" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" min-width="100">
                        <span class="notNull">* </span>设备
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.controlStage" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;">
                            <el-option v-for="(subItem, index) in scope.row.controlStageList" :key="index" :label="subItem.dictValue" :value="subItem.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" min-width="100">
                        <span class="notNull">* </span>杂质类
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.controlStage" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;">
                            <el-option v-for="(subItem, index) in scope.row.controlStageList" :key="index" :label="subItem.dictValue" :value="subItem.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="杂质数量">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.temp" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="筛豆操作人" width="140">
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact && scope.row.userType !== 'EXTERNAL' && scope.row.userType !== 'TEMP'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</em>
                                <em>点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :inline="true" :model="craftInfo" style="margin-top: 5px;">
                <el-form-item label="杂质数量合计：" style="margin-bottom: 5px;">
                    <span>{{ '222' }} KG</span>
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card title="洗豆记录" name="table2" icon-bg="#487BFF">
            <div>
                <el-form :inline="true" :model="craftInfo" label-width="115px">
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>泡豆水洁净度：
                        </template>
                        <el-select v-model="craftInfo.moveType" class="stock-form_item_style" size="small" placeholder="请选择" clearable>
                            <el-option v-for="(item, index) in []" :key="index" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>洗豆操作人：
                        </template>
                        <span>点击选择人员</span>
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>洗豆开始时间：
                        </template>
                        <el-date-picker v-model="craftInfo.feeEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                    <el-form-item class="cleanMarginBottom">
                        <template slot="label">
                            <span class="notNull">* </span>洗豆结束时间：
                        </template>
                        <el-date-picker v-model="craftInfo.feeEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                    </el-form-item>
                </el-form>
            </div>
        </mds-card>
        <mds-card title="泡豆记录" name="table3" icon-bg="#487BFF">
            <template slot="titleBtn">
                <el-form :inline="true" :model="craftInfo" label-width="115px">
                    <el-form-item class="cleanMarginBottom floatr">
                        <el-button type="primary" size="small" :disabled="!isRedact" @click="addDataRow()">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftTable" :row-class-name="RowDelFlag" border tooltip-effect="dark" size="mini">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="泡豆罐号" width="140">
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact && scope.row.userType !== 'EXTERNAL' && scope.row.userType !== 'TEMP'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</em>
                                <em>点击选择</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>加水开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.recordDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>加水结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.recordDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="加水操作人" width="140">
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact && scope.row.userType !== 'EXTERNAL' && scope.row.userType !== 'TEMP'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</em>
                                <em>点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>排水开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.recordDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>排水结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.recordDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="排水操作人" width="140">
                    <template slot-scope="scope">
                        <div class="required" style="min-height: 32px; line-height: 32px;">
                            <span v-if="isRedact && scope.row.userType !== 'EXTERNAL' && scope.row.userType !== 'TEMP'" style="cursor: pointer;" @click="selectUser(scope.row)">
                                <em v-for="(item, index) in scope.row.userList" :key="index">{{ item }}，</em>
                                <em>点击选择人员</em>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="泡豆时长">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="160">
                    <template slot-scope="scope">
                        {{ scope.row.changed }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="craftAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        <official-worker ref="officialWorker" @changeUser="changeUser" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';
    import { COMMON_API, STE_API } from 'common/api/api';
    import { dateFormat, getUserNameNumber } from 'utils/utils';

    import OfficialWorker from 'components/OfficialWorker.vue';

    @Component({
        name: 'WashBeanMaterialCraft',
        components: {
            OfficialWorker
        }
    })
    export default class WashBeanMaterialCraft extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        controlTypeList = [];
        craftAudit = [];
        craftTable: CraftList[] = [];
        craftInfo: Craft = {
            keepZkFlag: 'N',
            coolZkFlag: 'N'
        };

        doAction = '';
        row = {};

        mounted() {
            console.log(2);
        }

        init(formHeader) {
            this.getControlTypeList();
            STE_API.STE_DETAIL_CRAFT_INFO_API({
                potOrderNo: formHeader.potOrderNo
            }).then(({ data }) => {
                if (data.data === null) {
                    this.doAction = 'insert';
                } else {
                    this.doAction = 'update';
                    this.craftInfo = data.data;
                    this.craftTable = data.data.item;
                    this.craftTable.map(item => {
                        this.controlTypeChange(item.controlType, item, 'init');
                    });
                }
            });
        }

        // 选择人员 正式借调
        selectUser(row: CurrentDataTable) {
            this.row = row;
            if (row.userType === 'FORMAL') {
                // 正式
                this.$nextTick(() => {
                    this.$refs.officialWorker.init(row.deptId, row.userList);
                });
            } else if (row.userType === 'INTERNAL' || row.userType === 'STUDY') {
                // 内部借调、学习
                this.$nextTick(() => {
                    this.$refs.loanedPersonnel.init(row.userList);
                });
            } else {
                this.$warningToast('请选择人员属性');
            }
        }

        ruleSubmit() {
            if (!this.craftInfo.feedStartDate || !this.craftInfo.feeEndDate || !this.craftInfo.riseStartDate || !this.craftInfo.riseEndDate) {
                this.$warningToast('请填写工艺控制页签时间必填项');
                return false;
            }
            if (this.craftTable.filter(it => it.delFlag !== 1).length === 0) {
                this.$warningToast('请录入工艺控制页签杀菌时间及温度数据');
                return false;
            }

            for (const item of this.craftTable.filter(it => it.delFlag !== 1)) {
                if (!item.controlType || !item.controlStage) {
                    this.$warningToast('请填写工艺控制页签杀菌时间及温度类型、阶段');
                    return false;
                }
                if ((item.controlStage === 'START' || item.controlStage === 'END' || item.controlStage === 'DISCHARGE_START' || item.controlStage === 'DISCHARGE_END') && !item.recordDate) {
                    this.$warningToast('请填写工艺控制页签杀菌时间及温度下记录时间');
                    return false;
                }
            }
            return true;
        }

        // 类型拉取
        getControlTypeList() {
            COMMON_API.DICTQUERY_API({ dictType: 'CRAFT_PHASE' }).then(({ data }) => {
                this.controlTypeList = data.data;
            });
        }

        // 阶段拉取
        controlTypeChange(dictType, row, type?) {
            if (type !== 'init') {
                row.controlStage = '';
            }
            if (dictType) {
                COMMON_API.DICTQUERY_API({ dictType: dictType }).then(({ data }) => {
                    row.controlStageList = data.data;
                });
            }
        }

        // 新增
        addDataRow() {
            this.craftTable.push({
                controlType: '',
                controlStage: '',
                recordDate: '',
                temp: '',
                remark: '',
                changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                changer: getUserNameNumber(),
                delFlag: 0,
                potOrderId: '',
                potOrderNo: ''
            });
        }

        getSavedOrSubmitData(formHeader) {
            this.craftInfo['steItem'] = this.craftTable;
            this.craftInfo['potOrderId'] = formHeader.id;
            this.craftInfo['potOrderNo'] = formHeader.potOrderNo;
            const ids: string[] = [];
            let steControlInsertDto = {};
            let steControlUpdateDto = {};
            this.craftTable.forEach(item => {
                if (item.delFlag === 1) {
                    if (item.id) {
                        ids.push(item.id);
                    }
                }
            });
            if (this.doAction === 'insert') {
                steControlInsertDto = this.craftInfo;
            } else {
                steControlUpdateDto = this.craftInfo;
            }
            return {
                steControlInsertDto,
                steControlUpdateDto,
                ids
            };
        }

        removeRow(row) {
            this.$confirm('是否删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                row.delFlag = 1;
            });
        }

        RowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }
    }

    interface CurrentDataTable {
        factory?: string;
        orderId?: string;
        orderNo?: string;
        classes?: string;
        deptId?: string;
        userType?: string;
        userList: string[];
        startDate?: string;
        dinner?: number;
        endDate?: string;
        duration?: number;
        durationUnit?: string;
        remark?: string;
        changed?: string;
        changer?: string;
        delFlag?: number;
        id?: string;
        editedMark?: boolean;
    }

    interface Craft {
        feedStartDate?: string;
        feeEndDate?: string;
        riseStartDate?: string;
        riseEndDate?: string;
        craftTable?: object[];
        coolZkFlag?: string;
        keepZkFlag?: string;
    }
    interface CraftList {
        id?: string;
        controlType?: string;
        controlStage?: string;
        recordDate?: string;
        temp?: string;
        remark?: string;
        changer?: string;
        changed?: string;
        delFlag?: number;
        potOrderId?: string;
        potOrderNo?: string;
        controlStageList?: object[];
    }
</script>

<style lang="scss" scoped>
    .koji-process-control {
        .stock-form_item_input_suffix {
            margin-right: 20px;
        }
        .cleanMarginBottom {
            margin-bottom: 10px;
        }
    }
</style>
