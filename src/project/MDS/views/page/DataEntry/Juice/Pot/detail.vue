<template>
    <div class="header_main">
        <el-card class="searchCard">
            <el-row type="flex">
                <el-col class="header_pot" style="width: 160px;">
                    <p class="header_pot_label">
                        罐号：{{ formData.HOLDER_NAME ? formData.HOLDER_NAME : '' }}
                    </p>
                    <div class="header_pot_image">
                        <div class="header_pot_image_content" />
                    </div>
                </el-col>
                <el-col>
                    <el-form :inline="true" size="small" labelWidth="84px" class="topforms topformsde" style="margin-top: 30px;">
                        <el-form-item label="生产车间：">
                            <p class="el-input">
                                {{ formData.WORK_SHOP ? formData.WORK_SHOP : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="容器类型：">
                            <p class="el-input">
                                {{ formData.HOLDER_TYPE }}
                            </p>
                        </el-form-item>
                        <el-form-item label="容器编号：">
                            <p class="el-input">
                                {{ formData.HOLDER_NAME }}
                            </p>
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <el-tooltip class="item" effect="dark" :content="(formData.MATERIAL_CODE || '') + ' ' + (formData.MATERIAL_NAME || '')" placement="top">
                                <p class="el-input" style="text-overflow: ellipsis;">
                                    {{ formData.MATERIAL_CODE }}
                                    {{ formData.MATERIAL_NAME }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="半成品类别：">
                            <p class="el-input">
                                {{ formData.TYPE }}
                            </p>
                        </el-form-item>
                        <el-form-item label="库存数量：">
                            <p class="el-input">
                                {{ formData.AMOUNT }}
                            </p>
                        </el-form-item>
                        <el-form-item label="满罐日期：">
                            <p class="el-input">
                                {{ formData.FULL_DATE }}
                            </p>
                        </el-form-item>
                        <el-form-item label="存储天数：">
                            <p class="el-input">
                                {{ formData.days }}
                            </p>
                        </el-form-item>
                        <el-form-item label="状态：" class="noneBorder">
                            <el-radio-group v-model="formData.TYPE_STATUS" :disabled="true">
                                <el-radio label="1">
                                    正常
                                </el-radio>
                                <el-radio label="0">
                                    冻结
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="searchCard newCard" style="margin-top: 5px;">
            <el-tabs v-model="activeName" class="NewDaatTtabs" type="border-card">
                <el-tab-pane name="1">
                    <span slot="label" class="spanview">当前订单信息</span>
                    <el-table headerRowClassName="tableHead" :data="dataListOrder" border tooltipEffect="dark">
                        <el-table-column type="index" label="序号" width="55" :index="indexOrderMethod" />
                        <el-table-column label="车间" :showOverflowTooltip="true" prop="WORK_SHOP" width="90" />
                        <el-table-column label="物料" :showOverflowTooltip="true" width="160">
                            <template slot-scope="scope">
                                {{ scope.row.MATERIAL_CODE }}{{ scope.row.MATERIAL_NAME }}
                            </template>
                        </el-table-column>
                        <el-table-column label="类别" :showOverflowTooltip="true" prop="TYPE" width="70" />
                        <el-table-column label="移动类型" :showOverflowTooltip="true" prop="move" width="80" />
                        <el-table-column label="来源" :showOverflowTooltip="true" prop="source" width="70" />
                        <el-table-column label="物料批次" :showOverflowTooltip="true" prop="BATCH" width="110" />
                        <el-table-column label="来源批次" :showOverflowTooltip="true" prop="IN_BATCH" width="110" />
                        <el-table-column label="数量" :showOverflowTooltip="true" prop="IN_POT_AMOUNT" width="80" />
                        <el-table-column label="单位" :showOverflowTooltip="true" prop="UNIT" width="50" />
                        <el-table-column label="满罐日期" :showOverflowTooltip="true" prop="FULL_POT_DATE" width="160" />
                        <el-table-column label="单号" :showOverflowTooltip="true" prop="ORDER_NO" width="120" />
                        <el-table-column label="订单类型" :showOverflowTooltip="true" prop="ORDER_TYPE" width="80" />
                        <el-table-column label="领用人" :showOverflowTooltip="true" prop="CREATOR" width="120" />
                        <el-table-column label="领用时间" :showOverflowTooltip="true" prop="CREATED" width="120" />
                    </el-table>
                    <el-row>
                        <el-pagination :currentPage="dataCurrPage" :pageSizes="[10, 20, 50]" :pageSize="dataPageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataTotalCount" @size-change="handleDataSizeChange" @current-change="handleDataCurrentChange" />
                    </el-row>
                </el-tab-pane>
                <el-tab-pane name="2">
                    <span slot="label" class="spanview">当前领用信息</span>
                    <el-table headerRowClassName="tableHead" :data="dataListUse" border tooltipEffect="dark">
                        <el-table-column type="index" label="序号" width="55" :index="indexUseMethod" />
                        <el-table-column label="车间" :showOverflowTooltip="true" prop="WORK_SHOP" width="90" />
                        <el-table-column label="物料" :showOverflowTooltip="true" width="160">
                            <template slot-scope="scope">
                                {{ scope.row.MATERIAL_CODE }}{{ scope.row.MATERIAL_NAME }}
                            </template>
                        </el-table-column>
                        <el-table-column label="类别" :showOverflowTooltip="true" prop="RECEIVE_TYPE" width="70" />
                        <el-table-column label="移动类型" :showOverflowTooltip="true" prop="move" width="80" />
                        <el-table-column label="领用" :showOverflowTooltip="true" prop="source" width="70" />
                        <el-table-column label="物料批次" :showOverflowTooltip="true" prop="BATCH" width="110" />
                        <el-table-column label="来源批次" :showOverflowTooltip="true" prop="RECEIVE_BATCH" width="110" />
                        <el-table-column label="数量" :showOverflowTooltip="true" prop="RECEIVE_AMOUNT" width="80" />
                        <el-table-column label="单位" :showOverflowTooltip="true" prop="UNIT" width="50" />
                        <el-table-column label="满罐日期" :showOverflowTooltip="true" prop="FULL_DATE" width="160" />
                        <el-table-column label="单号" :showOverflowTooltip="true" prop="ORDER_NO" width="120" />
                        <el-table-column label="订单类型" :showOverflowTooltip="true" prop="ORDER_TYPE" width="80" />
                        <el-table-column label="领用人" :showOverflowTooltip="true" prop="CREATOR" width="120" />
                        <el-table-column label="领用时间" :showOverflowTooltip="true" prop="CREATED" width="120" />
                    </el-table>
                    <el-row>
                        <el-pagination :currentPage="dataUseCurrPage" :pageSizes="[10, 20, 50]" :pageSize="dataUsePageSize" layout="total, sizes, prev, pager, next, jumper" :total="dataUseTotalCount" @size-change="handleUseDataSizeChange" @current-change="handleUseDataCurrentChange" />
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
import { JUICE_API } from '@/api/api';
export default {
    name: 'Ferdetails',
    components: {},
    data() {
        return {
            formData: {
                frozenStatus: '1'
            },
            activeName: '1',
            dataListOrder: [],
            dataListUse: [],
            dataCurrPage: 1,
            dataPageSize: 10,
            dataTotalCount: 0,
            dataUseCurrPage: 1,
            dataUsePageSize: 10,
            dataUseTotalCount: 0
        };
    },
    computed: {},
    mounted() {
        this.Getdetail();
    },
    methods: {
        // 获取基础信息
        Getdetail() {
            this.$http(`${JUICE_API.JUICE_JUICE_DETAIL}`, 'POST', {
                holderId: this.$store.state.common.Juice.HOLDER_ID,
                batch: this.$store.state.common.Juice.BATCH
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formData = data.juiceItem.head;
                    this.formData.TYPE_STATUS = this.formData.TYPE_STATUS === null ? '1' : this.formData.TYPE_STATUS;
                    this.dataListOrderAll = data.juiceItem.infoEnter;
                    this.dataListUseAll = data.juiceItem.infoOut;
                    this.dataTotalCount = data.juiceItem.infoEnter.length;
                    this.dataUseTotalCount = data.juiceItem.infoOut.length;
                    this.dataListOrder = data.juiceItem.infoEnter.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
                    this.dataListUse = data.juiceItem.infoOut.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (this.dataUseCurrPage - 1) * this.dataUsePageSize + this.dataUsePageSize);
                } else {
                    this.$error_SHINHO(data.msg);
                }
            });
        },
        // 序号
        indexOrderMethod(index) {
            return index + 1 + (Number(this.dataCurrPage) - 1) * (Number(this.dataPageSize));
        },
        // 序号
        indexUseMethod(index) {
            return index + 1 + (Number(this.dataUseCurrPage) - 1) * (Number(this.dataUsePageSize));
        },
        handleDataSizeChange(val) {
            this.dataPageSize = val;
            this.dataCurrPage = 1;
            this.dataListOrder = this.dataListOrderAll.slice((this.dataCurrPage - 1) * this.dataPageSize, (this.dataCurrPage - 1) * this.dataPageSize + this.dataPageSize);
        },
        handleDataCurrentChange(val) {
            this.dataCurrPage = val;
            this.dataListOrder = this.dataListOrderAll.slice((this.dataCurrPage - 1) * this.dataPageSize, (val - 1) * this.dataPageSize + this.dataPageSize);
        },
        handleUseDataSizeChange(val) {
            this.dataUsePageSize = val;
            this.dataUseCurrPage = 1;
            this.dataListUse = this.dataListUseAll.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (this.dataUseCurrPage - 1) * this.dataUsePageSize + this.dataUsePageSize);
        },
        handleUseDataCurrentChange(val) {
            this.dataUseCurrPage = val;
            this.dataListUse = this.dataListUseAll.slice((this.dataUseCurrPage - 1) * this.dataUsePageSize, (val - 1) * this.dataUsePageSize + this.dataUsePageSize);
        }
    }
};
</script>

<style lang="scss">
.topformsde {
    .el-form-item__content {
        height: 32px;
        border-bottom: 1px solid #d8d8d8;
    }

    .noneBorder {
        .el-form-item__content {
            border-bottom: none;
        }
    }

    .el-input {
        width: 145px !important;
        overflow: hidden;
        line-height: 32px;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.header_pot {
    width: 160px;

    &_label {
        margin-bottom: 15px;
        color: rgba(102, 102, 102, 1);
        font-weight: 400;
        font-size: 18px;
    }

    &_image {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 160px;
        height: 190px;
        background: url("~@/assets/img/ferPot.png") no-repeat center center;
        background-size: contain;

        &_content {
            width: 84px;
            height: 90px;
            margin-bottom: 8px;
            background: linear-gradient(#35c3ff, #1890ff);
        }
    }
}
</style>
