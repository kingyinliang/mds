<template>
    <div>
        <mds-card title="时间(单位:min)" :pack-up="false">
            <el-form :inline="true" :model="craftInfo" label-width="115px">
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>入料开始时间：
                    </template>
                    <el-date-picker v-model="craftInfo.feedStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>入料结束时间：
                    </template>
                    <el-date-picker v-model="craftInfo.feeEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>升温开始时间：
                    </template>
                    <el-date-picker v-model="craftInfo.riseStartDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>升温结束时间：
                    </template>
                    <el-date-picker v-model="craftInfo.riseEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 175px;" />
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card title="杀菌时间及温度" name="table1" icon-bg="#ffbf00">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRow()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftTable" :row-class-name="RowDelFlag" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>类型
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.controlType" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;" @change="controlTypeChange($event, scope.row)">
                            <el-option v-for="(subItem, index) in controlTypeList" :key="index" :label="subItem.dictValue" :value="subItem.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header" min-width="100">
                        <span class="notNull">* </span>阶段
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.controlStage" placeholder="请选择" :disabled="!isRedact" size="small" style="width: 100%;">
                            <el-option v-for="(subItem, index) in scope.row.controlStageList" :key="index" :label="subItem.dictValue" :value="subItem.dictCode" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="120">
                    <template slot="header">
                        <span class="notNull">* </span>记录时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.recordDate" type="datetime" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择" :disabled="!isRedact" style="width: 180px;" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="温度(℃)">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.temp" size="small" placeholder="请输入" :disabled="!isRedact" />
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
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :inline="true" :model="craftInfo" style="margin-top: 5px;">
                <el-form-item label="保温阶段-ZK：" style="margin-bottom: 5px;">
                    <el-radio-group v-model="craftInfo.keepZkFlag" :disabled="!isRedact">
                        <el-radio label="Y">
                            是
                        </el-radio>
                        <el-radio label="N">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="降温阶段-ZK：" label-width="150px" style="margin-bottom: 5px;">
                    <el-radio-group v-model="craftInfo.coolZkFlag" :disabled="!isRedact">
                        <el-radio label="Y">
                            是
                        </el-radio>
                        <el-radio label="N">
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </mds-card>
        <audit-log :table-data="craftAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { COMMON_API, STE_API } from 'common/api/api';
import { dateFormat, getUserNameNumber } from 'utils/utils';
import _ from 'lodash';

@Component
export default class Crafts extends Vue {
    @Prop({ default: false }) isRedact: boolean;

    controlTypeList = [];
    craftAudit = [];
    craftTable: CraftList[] = [];
    craftTableOrg: CraftList[] = [];
    craftInfo: Craft = {
        keepZkFlag: 'N',
        coolZkFlag: 'N'
    };

    doAction = '';

    init(formHeader) {
        this.getControlTypeList();
        STE_API.STE_DETAIL_CRAFT_INFO_API({
            potOrderNo: formHeader.potOrderNo
        }).then(({ data }) => {
            if (data.data === null) {
                this.doAction = 'insert';
            } else {
                this.doAction = 'update';
                this.craftInfo = data.data
                this.craftTable = data.data.item
                this.craftTableOrg = JSON.parse(JSON.stringify(data.data.item))
                this.craftTable.map(item => {
                    this.controlTypeChange(item.controlType, item, 'init');
                })
            }
        });
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
        let isStage = 0;
        for (const item of this.craftTable.filter(it => it.delFlag !== 1)) {
            if (!item.controlType || !item.controlStage || !item.recordDate) {
                this.$warningToast('请填写工艺控制页签杀菌时间及温度类型、阶段、记录时间');
                return false;
            }
            if (item.controlStage === 'HEAT_START' || item.controlStage === 'HEAT_END' || item.controlStage === 'DISCHARGE_START' || item.controlStage === 'DISCHARGE_END') {
                isStage++;
            }
        }
        if (isStage < 4) {
            this.$warningToast('请填写工艺控制页签保温开始时间、保温结束时间、出料开始时间、出料结束时间');
            return false;
        }
        return true;
    }

    // 类型拉取
    getControlTypeList() {
        COMMON_API.DICTQUERY_API({ dictType: 'CRAFT_PHASE' }).then(({ data }) => {
            this.controlTypeList = data.data
        });
    }

    // 阶段拉取
    controlTypeChange(dictType, row, type?) {
        if (type !== 'init') {
            row.controlStage = '';
        }
        if (dictType) {
            COMMON_API.DICTQUERY_API({ dictType: dictType }).then(({ data }) => {
                row.controlStageList = data.data
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
        this.craftTable.map((item) => {
            item.potOrderNo = formHeader.potOrderNo
        })
        // this.craftInfo['steItem'] = this.craftTable;
        this.craftInfo['potOrderId'] = formHeader.id;
        this.craftInfo['potOrderNo'] = formHeader.potOrderNo;
        const ids: string[] = [];
        let steControlInsertDto = {};
        let steControlUpdateDto = {};
        let insertItem: CraftList[] = [];
        let updateItem: CraftList[] = [];
        this.craftTable.forEach((item, index) => {
            if (item.delFlag === 1) {
                if (item.id) {
                    ids.push(item.id)
                }
            } else if (item.id) {
                if (!_.isEqual(this.craftTableOrg[index], item)) {
                    updateItem.push(item)
                }
            } else {
                insertItem.push(item)
            }
        })
        if (this.doAction === 'insert') {
            steControlInsertDto = this.craftInfo;
            insertItem = this.craftTable;
        } else {
            steControlUpdateDto = this.craftInfo;
            updateItem = this.craftTable;
        }
        return {
            steControlInsertDto,
            steControlUpdateDto,
            ids,
            insertItem,
            updateItem
        }
    }

    removeRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$set(row, 'delFlag', 1)
            this.$successToast('删除成功');
        })
    }

    RowDelFlag({ row }) {
        if (row.delFlag === 1) {
            return 'rowDel';
        }
        return '';
    }
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

<style scoped>

</style>
