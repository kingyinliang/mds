<template>
    <div>
        <mds-card title="待处理数量(单位：KG)" :name="'productPeople'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addRow(DataList)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="DataList" :row-class-name="RowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="60" />
                <el-table-column width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item, index) in classList" :key="index" :value="item.name" :label="item.name" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="线上不良" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.onlineBad" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="挤料" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.pressMaterial" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="测密封堵" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.sealingPlug" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="废酱" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.wasteSauce" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="设备残留" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.deviceLoss" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="其他" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.other" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column fixed="right" label="操作" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delPendingNum(scope.row)">
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
                    {{ computedSoy }}
                </div>
                <div>
                    报废酱小计：
                </div>
                <div class="input_bottom">
                    {{ computedScrap }}
                </div>
                <div>
                    总计：
                </div>
                <div class="input_bottom">
                    {{ computedTotal }}
                </div>
            </el-row>
        </mds-card>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { dateFormat, accAdd } from 'utils/utils';

@Component({})

export default class PendingNum extends Vue {
    classList = [
        {
            name: '白班'
        }, {
            name: '中班'
        }, {
            name: '夜班'
        }
    ]

    DataList: object[] = [];
    ReadAudit = []

    addRow() {
        const sole: ValueObject = {
            classes: '',
            onlineBad: 0,
            pressMaterial: 0,
            sealingPlug: 0,
            wasteSauce: 0,
            deviceLoss: 0,
            other: 0,
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: sessionStorage.getItem('realName') + `(${sessionStorage.getItem('userName')})`,
            delFlag: 0
        }
        this.DataList.push(sole);
    }

    RowDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
        return '';
    }

    delPendingNum(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.DataList.splice(this.DataList.indexOf(row), 1);
        });
    }

    get computedSoy() {
        let Soynum = 0;
        this.DataList.map((item: ValueObject) => {
            if (item.delFlag === 0) {
                Soynum = accAdd(Soynum, accAdd(accAdd(item.onlineBad, item.pressMaterial), item.sealingPlug));
            }
        });
        return Soynum;
    }

    get computedScrap() {
        let ScrapNum = 0;
        this.DataList.map((item: ValueObject) => {
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

interface ValueObject {
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
