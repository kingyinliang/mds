<template>
    <mds-card title="待处理数量(单位：KG)" :name="'productPeople'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewDataRow()">
                    新增
                </el-button>
            </div>
        </template>
        <el-table class="newTable" :data="currentFormDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
            <el-table-column label="序号" type="index" width="60" fixed />
            <el-table-column width="100" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">*</span>班次
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact">
                        <el-option v-for="item in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="线上不良" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.onlineBad" size="small" placeholder="输入数量" oninput="value=value.replace(/\D*/g,'')" />
                </template>
            </el-table-column>
            <el-table-column label="挤料" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.pressMaterial" size="small" placeholder="输入数量" oninput="value=value.replace(/\D*/g,'')" />
                </template>
            </el-table-column>
            <el-table-column label="测密封度" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.sealingPlug" size="small" placeholder="输入数量" oninput="value=value.replace(/\D*/g,'')" />
                </template>
            </el-table-column>
            <el-table-column label="废酱" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.wasteSauce" size="small" placeholder="输入数量" oninput="value=value.replace(/\D*/g,'')" />
                </template>
            </el-table-column>
            <el-table-column label="设备残留" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.deviceLoss" size="small" placeholder="输入数量" oninput="value=value.replace(/\D*/g,'')" />
                </template>
            </el-table-column>
            <el-table-column label="其他" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.other" size="small" placeholder="输入数量" oninput="value=value.replace(/\D*/g,'')" />
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true" width="160">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
                </template>
            </el-table-column>
            <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" min-width="160" />
            <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" min-width="160" />
            <el-table-column fixed="right" label="操作" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="solerow">
            <div>
                待杀菌酱小计：
            </div>
            <div class="input_bottom">
                {{ computedSoy }} KG
            </div>
            <div>
                报废酱小计：
            </div>
            <div class="input_bottom">
                {{ computedScrap }} KG
            </div>
            <div>
                总计：
            </div>
            <div class="input_bottom">
                {{ computedTotal }} KG
            </div>
        </el-row>
    </mds-card>
</template>


<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { PKG_API } from 'common/api/api';
import { dateFormat, accAdd, getUserNameNumber, dataEntryData } from 'utils/utils';

@Component({
    name: 'PendingNum'
})

export default class PendingNum extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact
    @Prop({ type: Array, default: [] }) classesOptions

    // 常有变数
    currentFormDataGroup: CurrentDataTable[] = [] // 主 data
    orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制


    init(formHeader) {
        PKG_API.PKG_PENDGNUM_QUERY_API({ // 待杀菌检测-查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            if (data.data !== null) {
                this.currentFormDataGroup = JSON.parse(JSON.stringify(data.data));
                this.orgFormDataGroup = JSON.parse(JSON.stringify(data.data));
            }
        })
    }

    savedData(formHeader) {
        const germsDelete = [];
        const germsInsert = [];
        const germsUpdate = [];

        dataEntryData(formHeader, this.currentFormDataGroup, this.orgFormDataGroup, germsDelete, germsInsert, germsUpdate);

        return {
            germsDelete,
            germsInsert,
            germsUpdate
        }
    }

    addNewDataRow() {
        const sole: CurrentDataTable = {
            classes: '',
            onlineBad: 0,
            pressMaterial: 0,
            sealingPlug: 0,
            wasteSauce: 0,
            deviceLoss: 0,
            other: 0,
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber(),
            delFlag: 0
        }
        this.currentFormDataGroup.push(sole);
    }

    rowDelFlag({ row }) {
        if (row.delFlag === 1) {
            return 'rowDel';
        }
        return '';
    }

    removeDataRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            row.delFlag = 1;
        });
    }

    ruleSubmit() {
        let currentFormDataGroupNew: CurrentDataTable[] = [];
        currentFormDataGroupNew = this.currentFormDataGroup.filter(item => item.delFlag === 0);
        if (currentFormDataGroupNew.length === 0) {
            this.$warningToast('请录入待处理数');
            return false
        }
        for (const item of currentFormDataGroupNew) {
            if (!item.classes) {
                this.$warningToast('请填写待处理数必填项');
                return false
            }
        }
        return true
    }

    get computedSoy() {
        let Soynum = 0;
        this.currentFormDataGroup.map((item: CurrentDataTable) => {
            if (item.delFlag === 0) {
                Soynum = accAdd(Soynum, accAdd(accAdd(item.onlineBad, item.pressMaterial), item.sealingPlug));
            }
        });
        return Soynum;
    }

    get computedScrap() {
        let ScrapNum = 0;
        this.currentFormDataGroup.map((item: CurrentDataTable) => {
            if (item.delFlag === 0) {
                ScrapNum = accAdd(ScrapNum, accAdd(item.wasteSauce, item.deviceLoss));
            }
        });
        return ScrapNum;
    }

    get computedTotal() {
        let Total = 0;
        let other = 0;
        this.currentFormDataGroup.map((item: CurrentDataTable) => {
            if (item.delFlag === 0) {
                other = accAdd(other, item.other);
            }
        });
        Total = accAdd(accAdd(this.computedSoy, this.computedScrap), other);
        return Total;
    }
}

interface CurrentDataTable {
    classes?: string;
    onlineBad?: number;
    pressMaterial?: number;
    sealingPlug?: number;
    wasteSauce?: number;
    deviceLoss?: number;
    other?: number;
    remark?: string;
    changed?: string;
    changer?: string;
    delFlag?: number;
    editedMark?: boolean;
    id?: string;
}
</script>

<style lang="scss" scoped>
.solerow {
    margin-top: 5px;
    line-height: 33px;
    div {
        float: left;
    }
    .input_bottom {
        margin-right: 50px;
    }
}
</style>
