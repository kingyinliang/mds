<template>
    <mds-card :title="'录入数据单位：MIN'" :name="'exc'" :icon-bg="'#f05c4a'">
        <template slot="titleBtn">
            <div style="float: right;">
                <el-button type="primary" size="small" :disabled="!isRedact" @click="AddExcDate(ExcDate)">
                    新增
                </el-button>
            </div>
        </template>
        <el-table header-row-class-name="tableHead" class="newTable" :data="ExcDate" border tooltip-effect="dark">
            <el-table-column type="index" label="序号" width="50px" fixed />
            <el-table-column>
                <template slot="header">
                    <span class="notNull">* </span>班次
                </template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <span class="notNull">* </span>异常情况
                </template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <span class="notNull">* </span>开始时间
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
                </template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <span class="notNull">* </span>结束时间
                </template>
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
                </template>
            </el-table-column>
            <el-table-column label="时长">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                </template>
            </el-table-column>
            <el-table-column label="单位">
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                </template>
            </el-table-column>
            <el-table-column>
                <template slot="header">
                    <span class="notNull">* </span>异常原因
                </template>
                <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                </template>
            </el-table-column>
            <el-table-column label="异常描述">
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
            <el-table-column width="70" fixed="right">
                <template slot-scope="scope">
                    <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </mds-card>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component({
        name: 'ExcRecord'
    })
    export default class ExcRecord extends Vue {
        @Prop({ type: Boolean, default: false }) isRedact

        ExcDate = [];

        AddExcDate(data) {
            console.log(data);
        }
    }
</script>

<style scoped>

</style>
