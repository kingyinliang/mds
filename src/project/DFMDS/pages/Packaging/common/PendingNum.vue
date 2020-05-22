<template>
    <mds-card title="待处理数量(单位：KG)" :name="'productPeople'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" @click="addRow(dataList)">
                    新增
                </el-button>
            </div>
        </template>
        <el-table class="newTable" :data="dataList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
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
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { PKG_API } from 'common/api/api';
import { dateFormat, accAdd, getUserNameNumber } from 'utils/utils';

@Component({
    name: 'PendingNum'
})

export default class PendingNum extends Vue {
    classList: object[] = [
        {
            name: '白班'
        }, {
            name: '中班'
        }, {
            name: '夜班'
        }
    ]

    dataList: ValueObject[] = [];
    readAudit = []

    getDataList(formHeader: object) {
        PKG_API.PKG_PENDGNUM_QUERY_API({ factory: formHeader['factory'], orderNo: formHeader['orderNo'] }).then(({ data }) => {
            if (data.code === 200) {
                this.dataList = data.data
            }
        });
    }

    addRow() {
        const sole: ValueObject = {
            classes: '',
            onlineBad: '',
            pressMaterial: '',
            sealingPlug: '',
            wasteSauce: '',
            deviceLoss: '',
            other: '',
            remark: '',
            changed: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss'),
            changer: getUserNameNumber(),
            delFlag: 0
        }
        this.dataList.push(sole);
    }

    rowDelFlag({ row }) {
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
            this.dataList.splice(this.dataList.indexOf(row), 1);
        });
    }

    get computedSoy() {
        let Soynum = 0;
        this.dataList.map((item: ValueObject) => {
            if (item.delFlag === 0) {
                Soynum = accAdd(Soynum, accAdd(accAdd(item.onlineBad, item.pressMaterial), item.sealingPlug));
            }
        });
        return Soynum;
    }

    get computedScrap() {
        let ScrapNum = 0;
        this.dataList.map((item: ValueObject) => {
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
    onlineBad?: string;
    pressMaterial?: string;
    sealingPlug?: string;
    wasteSauce?: string;
    deviceLoss?: string;
    other?: string;
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
