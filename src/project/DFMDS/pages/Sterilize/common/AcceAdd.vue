<template>
    <div>
        <mds-card v-if="steCookingConsumeFlag !== '1'" title="煮料锅/混合罐领用" name="table">
            <template slot="titleBtn">
                <el-button type="primary" size="small" :disabled="!isRedact" style="float: right;" @click="addDataRowCookingConsume()">
                    新增
                </el-button>
            </template>
            <el-table header-row-class-name="tableHead" class="newTable" :data="steCookingConsume" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column min-width="140px">
                    <template slot="header">
                        <span class="notNull">* </span>煮料锅/混合罐号
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.potNo" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column min-width="100px">
                    <template slot="header">
                        <span class="notNull">* </span>配置日期
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.configDate" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column min-width="100px">
                    <template slot="header">
                        <span class="notNull">* </span>煮料锅序
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.cookingNum" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="cookingOrderNo" label="煮料锅单" min-width="100px" :show-overflow-tooltip="true" />
                <el-table-column prop="cookingMaterialCode" label="煮料锅生产物料" min-width="140px" :show-overflow-tooltip="true">
                    <template slot="scope">
                        {{ scope.row.cookingMaterialCode }}
                        {{ scope.row.cookingMaterialName }}
                    </template>
                </el-table-column>
                <el-table-column prop="remainderPot" label="剩余锅数" min-width="100px" :show-overflow-tooltip="true" />
                <el-table-column min-width="100px">
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.consumeAmount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="remainderAmount" label="剩余库存" min-width="100px" :show-overflow-tooltip="true" />
                <el-table-column prop="unit" label="单位" min-width="50px" :show-overflow-tooltip="true" />
                <el-table-column min-width="100px">
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.addDate" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="transferTank" label="转运罐号" min-width="100px" :show-overflow-tooltip="true" />
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
            <el-table header-row-class-name="tableHead" class="newTable" :data="steAccessoriesConsume" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="领用物料" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.useMaterialCode" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="useUnit" label="单位" :show-overflow-tooltip="true" />
                <el-table-column>
                    <template slot="scope">
                        <el-button type="text" :disabled="!(isRedact)" @click="SplitDate('steAccessoriesConsume', scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.useAmount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用批次
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.useBatch" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
                    </template>
                </el-table-column>
                <el-table-column label="称取盒编号">
                    <template slot-scope="scope">
                        <el-input v-model.trim="scope.row.useBoxNo" size="small" placeholder="请输入" :disabled="!isRedact" />
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
            <el-table header-row-class-name="tableHead" class="newTable" :data="newSteAccessoriesConsume" border tooltip-effect="dark">
                <el-table-column type="index" label="序号" width="50px" fixed />
                <el-table-column label="领用物料" width="140">
                    <template slot-scope="scope">
                        {{ scope.row.changer }}
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.useMaterialCode" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column prop="useUnit" label="单位" :show-overflow-tooltip="true" />
                <el-table-column>
                    <template slot="scope">
                        <el-button type="text" :disabled="!(isRedact)" @click="SplitDate('steAccessoriesConsume', scope.row, scope.$index)">
                            <i class="icons iconfont factory-chaifen" />拆分
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用数量
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.useAmount" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>领用批次
                    </template>
                    <template slot="scope">
                        <el-input v-model.trim="scope.row.useBatch" size="small" placeholder="请输入" :disabled="!isRedact" />
                    </template>
                </el-table-column>
                <el-table-column>
                    <template slot="header">
                        <span class="notNull">* </span>添加时间
                    </template>
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.addDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy.MM.dd HH:mm" placeholder="选择" :disabled="!isRedact" size="small" />
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
    import { STE_API } from 'common/api/api';

    @Component
    export default class AcceAdd extends Vue {
        @Prop({ default: false }) isRedact: boolean;

        steCookingConsumeFlag = '1';
        acceAddAudit = [];
        steCookingConsume: CCObj[] = [];
        OrgSteCookingConsume: CCObj[] = [];
        steAccessoriesConsume: ACObj[] = [];
        OrgSteAccessoriesConsume: ACObj[] = [];
        newSteAccessoriesConsume: ACObj[] = [];
        OrgNewSteAccessoriesConsume: ACObj[] = [];

        init(formHeader) {
            STE_API.STE_ACCE_LIST_API({
                materialCode: formHeader.materialCode,
                orderNo: formHeader.orderNo,
                potOrderNo: formHeader.potOrderNo
            }).then(({ data }) => {
                this.steCookingConsumeFlag = data.data.steCookingConsumeFlag
               this.newSteAccessoriesConsume = JSON.parse(JSON.stringify(data.data.newSteAccessoriesConsume));
               this.OrgNewSteAccessoriesConsume = JSON.parse(JSON.stringify(data.data.newSteAccessoriesConsume));
               this.steAccessoriesConsume = JSON.parse(JSON.stringify(data.data.steAccessoriesConsume));
               this.OrgSteAccessoriesConsume = JSON.parse(JSON.stringify(data.data.steAccessoriesConsume));
               this.steCookingConsume = JSON.parse(JSON.stringify(data.data.steCookingConsume));
               this.OrgSteCookingConsume = JSON.parse(JSON.stringify(data.data.steCookingConsume));
            })
        }

        // 新增  - 煮料锅/混合罐领用
        addDataRowCookingConsume() {
        //    0
            this.steCookingConsume.push({})
        }

        SplitDate(str, row, index) {
            this[str].splice(index + 1, 0, row)
        }

        removeDataRow(row) {
            console.log(row);
        }
    }
    interface ACObj {
        id?: string;
    }
    interface CCObj {
        id?: string;
    }
</script>

<style scoped>

</style>
