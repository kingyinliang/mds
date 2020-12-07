<template>
    <div class="header_main">
        <data-entry
            ref="dataEntry"
            type="audit"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatusName"
        >
            <template slot="contentBox">
                <mds-card title="包材领用" :name="'outputworker'">
                    <el-table ref="materialS" header-row-class-name="tableHead" class="newTable" :data="tableData" :row-class-name="rowDelFlag" :span-method="spanMethod" border tooltip-effect="dark">
                        <el-table-column label="领用物料" prop="material" width="150" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode + ' ' + scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column label="单位" prop="materialUnit" width="50" :show-overflow-tooltip="true" />
                        <el-table-column label="需求用量" prop="materialUnit" width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="当前库存" prop="materialUnit" width="100" :show-overflow-tooltip="true" />
                        <el-table-column width="70">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('pkgPdInsert')" type="text" @click="SplitDate(scope.row, scope.$index)">
                                    <em class="icons iconfont factory-chaifen" />拆分
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="领料类型" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>领料类型
                            </template>
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.classes" placeholder="请选择" size="small">
                                    <el-option label="正常领料" value="正常领料" />
                                    <el-option label="补领" value="补领" />
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单领料量" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>订单领料量
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.realUsed" size="small" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column label="物料批次" min-width="140">
                            <template slot="header">
                                <span class="notNull">* </span>物料批次
                            </template>
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.realUsed" size="small" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column label="厂家" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.realUsed" size="small" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="remark" min-width="140">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.remark" size="small" placeholder="请输入" />
                            </template>
                        </el-table-column>
                        <el-table-column label="操作人" prop="changer" width="100" :show-overflow-tooltip="true" />
                        <el-table-column label="操作时间" prop="changed" width="100" :show-overflow-tooltip="true" />
                    </el-table>
                </mds-card>
            </template>
            <template slot="custom_btn">
                <el-button type="primary" size="small" @click="isRedact = !isRedact">
                    {{ isRedact ? '取消' : '编辑' }}
                </el-button>
                <el-button v-if="isRedact" type="primary" size="small" @click="saved()">
                    保存
                </el-button>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { PKG_API } from 'common/api/api';

    @Component
    export default class PickingMaterialDetail extends Vue {
        isRedact = false;
        tableData = [];
        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                icon: 'factory-shengchanxian',
                label: '生产产线',
                value: 'productLineName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '订单产量',
                value: ['planOutput', 'outputUnit']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
            },
            {
                type: 'date-picker',
                icon: 'factory-riqi1',
                label: '生产日期',
                value: 'productDate'
            }
        ];

        formHeader = {
            orderStatusName: '已同步'
        };

        mounted() {
            this.int()
        }

        int() {
            PKG_API.PKG_PICKING_MATERIAL_DETAIL_API({
                orderNo: this.$store.state.packaging.pickingDetail.orderNo,
                productLine: this.$store.state.packaging.pickingDetail.productLine
            })
        }

        rowDelFlag({ row }) {
            if (row.delFlag === 1) {
                return 'rowDel';
            }
            return '';
        }

        spanMethod() {
        //
        }

        saved() {
        //
        }
    }
</script>

<style scoped>

</style>
