<template>
    <mds-card title="待处理数量(单位：KG)" :name="'productPeople'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewDataRow()">
                    新增
                </el-button>
            </div>
        </template>
        <el-table class="newTable" :data="currentFormDataGroup" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;" @cell-click="compareChange">
            <el-table-column label="序号" type="index" width="60" fixed />
            <el-table-column width="100" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">*</span>班次
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact" @change="compareChange(scope.row)">
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
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="removeDataRow(scope.$index)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row class="solerow">
            <div>
                带杀菌酱小计：
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
// import { COMMON_API } from 'common/api/api';
import { dateFormat, accAdd, getUserNameNumber } from 'utils/utils';
import _ from 'lodash';

@Component({
    name: 'PendingNum'
})

export default class PendingNum extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact
    @Prop({ type: Array, default: [] }) classesOptions

    // 常有变数
    currentFormDataGroup: CurrentDataTable[] = [] // 主 data
    orgFormDataGroup: CurrentDataTable[] = [] // 主 data 复制
    waitedDataDelete: string[]= [] // 入库删除集合
    waitedDataInsert: CurrentDataTable[] = [] // 入库新增集合
    waitedDataUpdate: CurrentDataTable[] =[] // 入库修改集合
    tabChangedState=[0, 0, 0] // 增,删,改


    init(dataGroup) {
        this.waitedDataDelete = [];
        this.waitedDataInsert = [];
        this.waitedDataUpdate = [];
        this.tabChangedState = [0, 0, 0]
        console.log('PendingNum带进来的 data')
        console.log(dataGroup)
        if (dataGroup !== null) {
            this.currentFormDataGroup = JSON.parse(JSON.stringify(dataGroup))
            this.currentFormDataGroup.forEach((item) => {
                item.editedMark = false
            })
            this.orgFormDataGroup = JSON.parse(JSON.stringify(this.currentFormDataGroup))
        }
    }

    tabChangeState() {
        console.log('查询 waitedDataInsert 增删改状态')
        console.log(this.tabChangedState)
        return !(this.tabChangedState[0] === 0 && this.tabChangedState[1] === 0 && this.tabChangedState[2] === 0)
    }

    returnDataGroup() {
        this.waitedDataInsert = [];
        this.waitedDataUpdate = [];
        this.currentFormDataGroup.forEach(item => {
            if (item.id) {
                if (item.editedMark === true) {
                    delete item.editedMark
                    this.waitedDataUpdate.push(item)
                }
            } else {
                this.waitedDataInsert.push(item)
            }
        })

        return {
            deleteData: this.waitedDataDelete,
            insertData: this.waitedDataInsert,
            updateData: this.waitedDataUpdate
        }
    }


    compareChange(row) {
        if (row.id && row.editedMark === false) {
        this.orgFormDataGroup.forEach((item) => {
            if (item.id === row.id) {
                    console.log(item)
                    console.log(row)
                    console.log(_.isEqual(row, item))
                    if (!_.isEqual(row, item)) {
                        row.editedMark = true
                        this.tabChangedState[2] += 1
                        console.log(row.editedMark)
                    }
                }
            })
        }
        console.log('增删改状态')
        console.log(this.tabChangedState)
    }

    compareRow(row) {
        this.orgFormDataGroup.forEach((item) => {
            if (row.editedMark === false) {
                if (item.id === row.id) {
                    console.log(item)
                    console.log(row)
                    console.log(_.isEqual(row, item))
                    if (!_.isEqual(row, item)) {
                        row.editedMark = true
                        this.tabChangedState[2] += 1
                        console.log(row.editedMark)
                    }
                }
            }
        })
        console.log('增删改状态')
        console.log(this.tabChangedState)
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
        this.tabChangedState[0] += 1
        this.currentFormDataGroup.push(sole);
    }

    rowDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
        return '';
    }

    removeDataRow(index) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            if (Object.prototype.hasOwnProperty.call(this.currentFormDataGroup[index], 'id')) {
                this.tabChangedState[1] += 1
                this.waitedDataDelete.push((this.currentFormDataGroup[index].id) as string)
            } else {
                this.tabChangedState[0] -= 1
            }
            this.currentFormDataGroup.splice(index, 1);
        });
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
        Total = accAdd(this.computedSoy, this.computedScrap)
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
