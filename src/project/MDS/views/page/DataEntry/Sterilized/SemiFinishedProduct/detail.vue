<template>
    <div class="header_main">
        <el-card class="searchCard  newCard">
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
                    <el-form :inline="true" size="small" label-width="70px" class="topforms topformsde multi_row">
                        <el-form-item label="生产工厂：">
                            <el-tooltip class="item" effect="dark" :content="formData.DEPT_NAME ? formData.DEPT_NAME : ''" placement="top">
                                <p class="el-input">
                                    {{ formData.DEPT_NAME ? formData.DEPT_NAME : '' }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <p class="el-input">
                                {{ formData.WORK_SHOP ? formData.WORK_SHOP : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="当前库存：">
                            <p class="el-input">
                                {{ formData.AMOUNT }} 方
                            </p>
                        </el-form-item>
                        <el-form-item label="容量：">
                            <p class="el-input">
                                {{ formData.HOLDER_HOLD || '' }} 方
                            </p>
                        </el-form-item>
                        <el-form-item label="当前物料：">
                            <el-tooltip class="item" effect="dark" :content="(formData.MATERIAL_CODE ? formData.MATERIAL_CODE : '') + ' ' + (formData.MATERIAL_NAME ? formData.MATERIAL_NAME : '')" placement="top">
                                <p class="el-input">
                                    {{ (formData.MATERIAL_CODE ? formData.MATERIAL_CODE : '') + ' ' + (formData.MATERIAL_NAME ? formData.MATERIAL_NAME : '') }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs v-model="activeName" class="NewDaatTtabs tabsPages" type="border-card" style="margin-top: 5px;">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">当前数据</span>
                <el-table header-row-class-name="tableHead" class="newTable" :data="dataList" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column label="半成品罐号" :show-overflow-tooltip="true" prop="HOLDER_NAME" min-width="120" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" prop="orderNo" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.MATERIAL_CODE }}
                            {{ scope.row.MATERIAL_NAME }}
                        </template>
                    </el-table-column>
                    <el-table-column label="半成品批次" :show-overflow-tooltip="true" prop="BATCH" min-width="110" />
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" prop="AMOUNT" min-width="85" />
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="DATA_TYPE" min-width="85" />
                    <el-table-column label="单位" :show-overflow-tooltip="true" prop="UNIT" min-width="60" />
                    <el-table-column label="订单号" :show-overflow-tooltip="true" prop="ORDER_NO" min-width="120" />
                    <el-table-column label="出/入罐类别" :show-overflow-tooltip="true" prop="HOLDER_TYPE" min-width="110" />
                    <el-table-column label="出/入罐号" :show-overflow-tooltip="true" prop="IN_HOLDER_NO" min-width="110" />
                    <el-table-column label="备注" :show-overflow-tooltip="true" prop="REMARK" min-width="100" />
                    <el-table-column label="操作时间" :show-overflow-tooltip="true" prop="CHANGED" min-width="160" />
                    <el-table-column label="操作人" :show-overflow-tooltip="true" prop="CHANGER" min-width="140" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">历史数据</span>
                <el-table header-row-class-name="tableHead" class="newTable" :data="dataHistory" border tooltip-effect="dark">
                    <el-table-column type="index" label="序号" width="55" fixed />
                    <el-table-column label="半成品罐号" :show-overflow-tooltip="true" prop="HOLDER_NAME" min-width="110" />
                    <el-table-column label="物料" :show-overflow-tooltip="true" prop="orderNo" min-width="220">
                        <template slot-scope="scope">
                            {{ scope.row.MATERIAL_CODE }}
                            {{ scope.row.MATERIAL_NAME }}
                        </template>
                    </el-table-column>
                    <el-table-column label="半成品批次" :show-overflow-tooltip="true" prop="BATCH" min-width="110" />
                    <el-table-column label="移动数量" :show-overflow-tooltip="true" prop="AMOUNT" min-width="85" />
                    <el-table-column label="移动类型" :show-overflow-tooltip="true" prop="DATA_TYPE" min-width="85" />
                    <el-table-column label="单位" :show-overflow-tooltip="true" prop="UNIT" min-width="60" />
                    <el-table-column label="订单号" :show-overflow-tooltip="true" prop="ORDER_NO" min-width="120" />
                    <el-table-column label="出/入罐类别" :show-overflow-tooltip="true" prop="HOLDER_TYPE" min-width="110" />
                    <el-table-column label="出/入罐号" :show-overflow-tooltip="true" prop="IN_HOLDER_NO" min-width="110" />
                    <el-table-column label="备注" :show-overflow-tooltip="true" prop="REMARK" min-width="100" />
                    <el-table-column label="操作时间" :show-overflow-tooltip="true" prop="CHANGED" min-width="160" />
                    <el-table-column label="操作人" :show-overflow-tooltip="true" prop="CHANGER" min-width="140" />
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { STERILIZED_API } from '@/api/api';
export default {
    name: 'Detail',
    components: {},
    data() {
        return {
            formData: {},
            activeName: '1',
            dataList: [],
            dataListRe: [],
            dataHistory: []
        };
    },
    computed: {},
    mounted() {
        this.GetDataList();
    },
    methods: {
        GetDataList() {
            this.$http(`${STERILIZED_API.SEMIFINIS_DROPDOWN_DETAIL}`, 'POST', {
                holderId: this.$store.state.common.sterilized.holderId
            }).then(({ data }) => {
                if (data.code === 0) {
                    this.formData = data.List.head;
                    this.dataList = data.List.info;
                    this.dataListRe = data.List.historyInfo;
                    data.List.historyInfo.map(item => {
                        item.map(items => {
                            this.dataHistory.push(items);
                        });
                    });
                } else {
                    this.$errorToast(data.msg);
                }
            });
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
</style>
<style lang="scss" scoped>
.header_pot {
    width: 160px;
    &_label {
        margin-bottom: 15px;
        color: rgba(102, 102, 102, 1);
        font-weight: 400;
        font-size: 14px;
    }
    &_image {
        display: flex;
        align-items: flex-end;
        justify-content: center;
        width: 70px;
        height: 100px;
        margin-left: 20px;
        background: url("~@/assets/img/ferPot.png") no-repeat center center;
        background-size: contain;
        &_content {
            width: 42px;
            height: 45px;
            margin-bottom: 4px;
            background: linear-gradient(#35c3ff, #1890ff);
        }
    }
}
</style>
