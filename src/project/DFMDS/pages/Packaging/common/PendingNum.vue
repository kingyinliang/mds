<template>
    <mds-card title="待处理数量(单位：KG)" :name="'productPeople'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="addNewDataRow()">
                    新增
                </el-button>
            </div>
        </template>
        <el-table class="newTable" :data="currentDataTable" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
            <el-table-column label="序号" type="index" width="60" fixed />
            <el-table-column width="100" :show-overflow-tooltip="true">
                <template slot="header">
                    <span class="notNull">*</span>班次
                </template>
                <template slot-scope="scope">
                    <el-select v-model="scope.row.classes" placeholder="请选择" size="small" :disabled="!isRedact" @change="compareRow(scope.row)">
                        <el-option v-for="item in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="线上不良" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.onlineBad" size="small" placeholder="输入数量" />
                </template>
            </el-table-column>
            <el-table-column label="挤料" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.pressMaterial" size="small" placeholder="输入数量" />
                </template>
            </el-table-column>
            <el-table-column label="测密封度" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.sealingPlug" size="small" placeholder="输入数量" />
                </template>
            </el-table-column>
            <el-table-column label="废酱" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.wasteSauce" size="small" placeholder="输入数量" />
                </template>
            </el-table-column>
            <el-table-column label="设备残留" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.deviceLoss" size="small" placeholder="输入数量" />
                </template>
            </el-table-column>
            <el-table-column label="其他" :show-overflow-tooltip="true" width="100">
                <template slot-scope="scope">
                    <el-input v-model.number="scope.row.other" size="small" placeholder="输入数量" />
                </template>
            </el-table-column>
            <el-table-column label="备注" :show-overflow-tooltip="true" width="100">
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
import { COMMON_API } from 'common/api/api';
import { dateFormat, accAdd, getUserNameNumber } from 'utils/utils';

@Component({
    name: 'PendingNum'
})

export default class PendingNum extends Vue {
    @Prop({ type: Boolean, default: false }) isRedact

    currentDataTable: CurrentDataTable[] = [];
    classesOptions: object[]=[];

    created() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
            data.data.forEach((item) => {
                if (item.dictValue !== '多班') {
                    this.classesOptions.push({
                        dictValue: item.dictValue,
                        dictCode: item.dictCode
                    })
                }
            })
        });
    }

    init(dataGroup) {
        console.log('ProductInStore带进来的 data')
        console.log(dataGroup)
        this.currentFormDataGroup = JSON.parse(JSON.stringify(dataGroup.inStorages))
        // this.basicUnitName = dataGroup.basicUnitName
        // this.ratio = dataGroup.ratio
        // this.unitOptions.push({ key: dataGroup.basicUnit, value: dataGroup.basicUnitName })
        // this.unitOptions.push({ key: dataGroup.productUnit, value: dataGroup.productUnitName })
    }

    compareRow(row) {
        // this.orgFormDataGroup.forEach((item) => {
        //     if (row.editedMark === false) {
        //         if (item.id === row.id) {
        //             console.log(item)
        //             console.log(row)
        //             console.log(_.isEqual(row, item))
        //             if (!_.isEqual(row, item)) {
        //                 row.editedMark = true
        //                 console.log(row.editedMark)
        //             }
        //         }
        //     }
        // })
    }

    addNewDataRow() {
        const sole: CurrentDataTable = {
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
        this.currentDataTable.push(sole);
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
            this.currentDataTable.splice(index, 1);
        });
    }

    get computedSoy() {
        let Soynum = 0;
        this.currentDataTable.map((item: CurrentDataTable) => {
            if (item.delFlag === 0) {
                Soynum = accAdd(Soynum, accAdd(accAdd(item.onlineBad, item.pressMaterial), item.sealingPlug));
            }
        });
        return Soynum;
    }

    get computedScrap() {
        let ScrapNum = 0;
        this.currentDataTable.map((item: CurrentDataTable) => {
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
