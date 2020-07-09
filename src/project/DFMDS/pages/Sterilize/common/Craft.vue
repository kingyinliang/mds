<template>
    <div>
        <mds-card title="时间(单位:min)" :pack-up="false">
            <el-form :inline="true" :model="craftData" label-width="120px">
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>入料开始时间：
                    </template>
                    <el-date-picker v-model="craftData.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 170px;" />
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>入料结束时间：
                    </template>
                    <el-date-picker v-model="craftData.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 170px;" />
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>升温开始时间：
                    </template>
                    <el-date-picker v-model="craftData.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 170px;" />
                </el-form-item>
                <el-form-item>
                    <template slot="label">
                        <span class="notNull">* </span>升温结束时间：
                    </template>
                    <el-date-picker v-model="craftData.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" style="width: 170px;" />
                </el-form-item>
            </el-form>
        </mds-card>
        <mds-card title="杀菌时间及温度" name="table1" icon-bg="#ffbf00">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRow()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="craftTable" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>类型
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>阶段
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>记录时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="温度(℃)">
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
        <audit-log :table-data="craftAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class Craft extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        craftAudit = [];
        craftTable = [];
        craftData = {
            expEndDate: ''
        };

        addDataRow() {
            console.log(1);
        }
    }
</script>

<style scoped>

</style>
