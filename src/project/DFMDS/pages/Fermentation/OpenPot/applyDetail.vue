<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            :order-status-show="false"
            :head-show="false"
        >
            <template slot="headerCard">
                <mds-card title="申请基本信息" :name="'head'">
                    <el-form :inline="true" :model="formHeader" size="small" class="dataEntry-head-base__form" label-width="100px">
                        <el-row>
                            <em style="padding-left: 40px;" />
                            <el-form-item>
                                <el-radio v-model="formHeader.consumeType" label="1">
                                    本罐单调
                                </el-radio>
                                <el-radio v-model="formHeader.consumeType" label="0">
                                    换罐混调
                                </el-radio>
                            </el-form-item>
                        </el-row>
                        <el-form-item label="生产车间：">
                            <el-select v-model="formHeader.fermentPotNo" placeholder="请选择" style="width: 120px;" clearable>
                                <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请物料：">
                            <el-select v-model="formHeader.fermentPotNo" placeholder="请选择" style="width: 120px;" clearable>
                                <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请数量：">
                            <el-input v-model="formHeader.stePotName" placeholder="手动输入" style="width: 120px;" />
                        </el-form-item>
                        <el-form-item label="调酱容器：">
                            <el-select v-model="formHeader.fermentPotNo" placeholder="请选择" style="width: 120px;" clearable>
                                <el-option v-for="(item, index) in potArr" :key="index" :label="item.holderName" :value="item.holderNo" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开罐单号：">
                            <p>{{ formHeader.stePotName }}</p>
                        </el-form-item>
                        <el-form-item label="状态：">
                            <p>{{ formHeader.stePotName }}</p>
                        </el-form-item>
                        <el-form-item label="操作人：">
                            <p>{{ formHeader.stePotName }}</p>
                        </el-form-item>
                        <el-form-item label="操作时间：">
                            <p>{{ formHeader.stePotName }}</p>
                        </el-form-item>
                        <el-row style="display: flex;">
                            <label class="el-form-item__label" style="width: 100px;">备注：</label>
                            <div style="flex: 1;">
                                <el-input v-model="formHeader.stePotName" placeholder="手动输入" style="width: 100%;" />
                            </div>
                        </el-row>
                    </el-form>
                </mds-card>
            </template>
            <template slot="contentBox">
                <mds-card title="申请反馈信息" :name="'bottom'">
                    <el-table header-row-class-name="tableHead" class="newTable" :data="tableData" border tooltip-effect="dark">
                        <el-table-column type="index" label="序号" width="50px" />
                        <el-table-column label="状态" prop="materialUnit" min-width="50" :show-overflow-tooltip="true" />
                        <el-table-column label="车间" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="容器号" prop="materialUnit" min-width="80" :show-overflow-tooltip="true" />
                        <el-table-column label="使用说明" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="订单类型" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="发酵天数/天" prop="materialUnit" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="物料" prop="materialUnit" min-width="120" :show-overflow-tooltip="true" />
                        <el-table-column label="熟酱状态" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="数量（KG）" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="入库日期" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="批次" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="备注" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="确认人员" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="确认时间" prop="materialUnit" min-width="100" :show-overflow-tooltip="true" />
                    </el-table>
                </mds-card>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';

    @Component
    export default class ApplyDetail extends Vue {
        formHeader = {}
        tableData = []
    }
</script>

<style scoped>

</style>
