<template>
    <div>
        <mds-card title="运行情况" :name="'equipment'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addRow(dataList)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="dataList" :row-class-name="rowDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="55" />
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item, index) in classesOptions" :key="index" :value="item.name" :label="item.name" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" min-width="160">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.timestart" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 175px;" />
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" min-width="160">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.timesend" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 175px;" />
                    </template>
                </el-table-column>
                <el-table-column label="运行时长(H)" min-width="90" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.sealingPlug" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入备注" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" min-width="120" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" min-width="140" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    总运行时间：
                </div>
                <div class="input_bottom">
                    {{ computedSoy }}
                </div>
            </el-row>
        </mds-card>
        <mds-card title="停机情况" :name="'equipmentStop'">
            <template slot="titleBtn">
                <div style="float: right;">
                    <el-button type="primary" size="small" @click="addStopRow(dataStopList)">
                        新增
                    </el-button>
                </div>
            </template>
            <el-table class="newTable" :data="dataStopList" :row-class-name="rowStopDelFlag" header-row-class-name="tableHead" border style="width: 100%; max-height: 200px;">
                <el-table-column label="序号" type="index" width="55" />
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>班次
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机类型
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机方式
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="160" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>开始时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.timestart" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 180px;" />
                    </template>
                </el-table-column>
                <el-table-column min-width="160" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>结束时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.timesend" type="datetime" size="small" value-format="yyyy-MM-dd HH:mm" format="yyyy-MM-dd HH:mm" placeholder="选择时间" style="width: 180px;" />
                    </template>
                </el-table-column>
                <el-table-column label="时长(MIN)" min-width="90" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.sealingPlug" size="small" />
                    </template>
                </el-table-column>
                <el-table-column min-width="90" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>次数
                    </template>
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.sealingPlug" size="small" placeholder="输入次数" />
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机情况
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column min-width="100" :show-overflow-tooltip="true">
                    <template slot="header">
                        <span class="notNull">*</span>停机原因
                    </template>
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.classes" size="small">
                            <el-option v-for="(item) in classesOptions" :key="item.dictCode" :value="item.dictCode" :label="item.dictValue" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="描述" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column label="备注" min-width="100" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="输入数量" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" min-width="120" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" min-width="140" :show-overflow-tooltip="true" />
                <el-table-column fixed="right" label="操作" width="80" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" @click="delStopRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="solerow">
                <div>
                    总停线时间：
                </div>
                <div class="input_bottom">
                    {{ computedSoy }} MIN
                </div>
            </el-row>
        </mds-card>
        <audit-log :table-data="readAudit" />
    </div>
</template>


<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { COMMON_API, PKG_API } from 'common/api/api';
import { dateFormat, accAdd, getUserNameNumber } from 'utils/utils';

@Component({
    name: 'Equipment',
    components: {
        AuditLog: resolve => {
            require(['@/views/components/AuditLog'], resolve);
        }
    }
})

export default class PendingNum extends Vue {
    classesOptions: object[] = []

    dataList: ValueObject[] = [];
    dataStopList: ValueObject[] = [];
    readAudit = []

    created() {
        COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CLASSES' }).then(({ data }) => {
            data.data.forEach((item) => {
                this.classesOptions.push({
                    dictValue: item.dictValue,
                    dictCode: item.dictCode
                })
            })
        });
    }

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

    addStopRow() {
        const sole = {
             classes: ''
        }
        this.dataStopList.push(sole);
    }

    rowDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
        return '';
    }

    rowStopDelFlag({ row }) {
        if (row.delFlag === '1') {
            return 'rowDel';
        }
        return '';
    }

    delRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.dataList.splice(this.dataList.indexOf(row), 1);
        });
    }

    delStopRow(row) {
        this.$confirm('是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.dataStopList.splice(this.dataStopList.indexOf(row), 1);
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
