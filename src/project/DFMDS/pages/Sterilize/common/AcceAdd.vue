<template>
    <div>
        <mds-card title="煮料锅/混合罐领用" name="table">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRow()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="acceTable1" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>煮料锅/混合罐号
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>配置日期
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>煮料锅序
                    </template>
                </el-table-column>
                <el-table-column prop="aiShelves" label="煮料锅单" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="煮料锅生产物料" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="剩余锅数" :show-overflow-tooltip="true" />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                </el-table-column>
                <el-table-column prop="aiShelves" label="剩余库存" :show-overflow-tooltip="true" />
                <el-table-column prop="aiShelves" label="单位" :show-overflow-tooltip="true" />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                </el-table-column>
                <el-table-column prop="aiShelves" label="转运罐号" :show-overflow-tooltip="true" />
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <mds-card title="辅料领用" name="table1" icon-bg="#ffbf00">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRow()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="acceTable2" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="领用物料" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column prop="aiShelves" label="单位" :show-overflow-tooltip="true" />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用批次
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="称取盒编号">
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
        <mds-card title="增补料" name="table2" icon-bg="#5BD171">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRow()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="acceTable3" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="领用物料" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                </el-table-column>
                <el-table-column prop="aiShelves" label="单位" :show-overflow-tooltip="true" />
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用批次
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.expEndDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.remark" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="changer" label="操作人" :show-overflow-tooltip="true" />
                <el-table-column prop="changed" label="操作时间" :show-overflow-tooltip="true" />
                <el-table-column width="70" fixed="right">
                    <template slot-scope="scope">
                        <el-button class="delBtn" type="text" icon="el-icon-delete" size="mini" :disabled="!isRedact" @click="removeDataRow(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </mds-card>
        <audit-log :table-data="acceAddAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
    </div>
</template>

<script lang="ts">
    import { Vue, Component, Prop } from 'vue-property-decorator';

    @Component
    export default class AcceAdd extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        acceAddAudit = [];
        acceTable1 = [];
        acceTable2 = [];
        acceTable3 = [];

        addDataRow() {
            console.log(1);
        }
    }
</script>

<style scoped>

</style>
