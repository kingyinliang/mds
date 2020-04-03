<template>
    <div class="header_main">
        <el-card class="searchCard  newCard">
            <el-row type="flex">
                <el-col class="header_pot" style="width: 160px;">
                    <p class="header_pot_label">
                        罐号：{{ formData.holderName ? formData.holderName : '' }}
                    </p>
                    <div class="header_pot_image">
                        <div class="header_pot_image_content" />
                    </div>
                </el-col>
                <el-col>
                    <el-form :inline="true" size="small" labelWidth="70px" class="topforms topformsde multi_row">
                        <el-form-item label="生产工厂：">
                            <el-tooltip class="item" effect="dark" :content="formData.factoryName ? formData.factoryName : ''" placement="top">
                                <p class="el-input">
                                    {{ formData.factoryName ? formData.factoryName : '' }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产车间：">
                            <p class="el-input">
                                {{ formData.workShopName ? formData.workShopName : '' }}
                            </p>
                        </el-form-item>
                        <el-form-item label="当前库存：">
                            <p class="el-input">
                                {{ formData.amount + formData.unit }}
                            </p>
                        </el-form-item>
                        <el-form-item label="容量：">
                            <p class="el-input">
                                {{ (formData.holderHold || '') + (formData.unit || '') }}
                            </p>
                        </el-form-item>
                        <el-form-item label="当前物料：">
                            <el-tooltip class="item" effect="dark" :content="(formData.materialCode ? formData.materialCode : '') + ' ' + (formData.materialName ? formData.materialName : '')" placement="top">
                                <p class="el-input">
                                    {{ (formData.materialCode ? formData.materialCode : '') + ' ' + (formData.materialName ? formData.materialName : '') }}
                                </p>
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <el-tabs v-model="activeName" class="NewDaatTtabs" type="border-card" style="margin-top: 5px;">
            <el-tab-pane name="1">
                <span slot="label" class="spanview">当前数据</span>
                <el-table headerRowClassName="tableHead" :data="dataList" border tooltipEffect="dark">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column label="成品罐号" :showOverflowTooltip="true" prop="holderNo" width="80" />
                    <el-table-column label="物料" :showOverflowTooltip="true" prop="orderNo" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="成品批次" :showOverflowTooltip="true" prop="batch" width="110" />
                    <el-table-column label="移动数量" :showOverflowTooltip="true" prop="moveAmount" width="85" />
                    <el-table-column label="移动类型" :showOverflowTooltip="true" prop="moveType" width="85" />
                    <el-table-column label="单位" :showOverflowTooltip="true" prop="unit" width="60" />
                    <el-table-column label="订单号" :showOverflowTooltip="true" prop="orderNo" width="120" />
                    <el-table-column label="出/入罐类别" :showOverflowTooltip="true" prop="inHolderType" width="110" />
                    <el-table-column label="出/入罐号" :showOverflowTooltip="true" prop="inHolderNo" width="110" />
                    <el-table-column label="备注" :showOverflowTooltip="true" prop="remark" width="100" />
                    <el-table-column label="操作时间" :showOverflowTooltip="true" prop="changed" width="110" />
                    <el-table-column label="操作人" :showOverflowTooltip="true" prop="changer" width="110" />
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label" class="spanview">历史数据</span>
                <el-table headerRowClassName="tableHead" :data="dataListRe" border tooltipEffect="dark">
                    <el-table-column type="index" label="序号" width="55" />
                    <el-table-column label="成品罐号" :showOverflowTooltip="true" prop="holderNo" width="80" />
                    <el-table-column label="物料" :showOverflowTooltip="true" prop="orderNo" width="160">
                        <template slot-scope="scope">
                            {{ scope.row.materialCode }}
                            {{ scope.row.materialName }}
                        </template>
                    </el-table-column>
                    <el-table-column label="成品批次" :showOverflowTooltip="true" prop="batch" width="110" />
                    <el-table-column label="移动数量" :showOverflowTooltip="true" prop="moveAmount" width="85" />
                    <el-table-column label="移动类型" :showOverflowTooltip="true" prop="moveType" width="85" />
                    <el-table-column label="单位" :showOverflowTooltip="true" prop="unit" width="60" />
                    <el-table-column label="订单号" :showOverflowTooltip="true" prop="orderNo" width="120" />
                    <el-table-column label="出/入罐类别" :showOverflowTooltip="true" prop="inHolderType" width="110" />
                    <el-table-column label="出/入罐号" :showOverflowTooltip="true" prop="inHolderNo" width="110" />
                    <el-table-column label="备注" :showOverflowTooltip="true" prop="remark" width="100" />
                    <el-table-column label="操作时间" :showOverflowTooltip="true" prop="changed" width="110" />
                    <el-table-column label="操作人" :showOverflowTooltip="true" prop="changer" width="110" />
                </el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import { FILTRATION_API } from '@/api/api';
export default {
    name: 'Detail',
    components: {},
    data() {
        return {
            formData: {},
            activeName: '1',
            dataList: [],
            dataListRe: []
        };
    },
    computed: {},
    mounted() {
        this.GetDataList();
    },
    methods: {
        GetDataList() {
            this.$http(`${FILTRATION_API.FILTER_POT_DETAIL_API}`, 'POST', this.$store.state.common.filtrationPot).then(({ data }) => {
                if (data.code === 0) {
                    this.formData = data.list[0];
                    this.dataList = data.current;
                    this.dataListRe = data.history;
                } else {
                    this.$error_SHINHO(data.msg);
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
