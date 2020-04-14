<template>
    <el-form :inline="true" :model="formHeader" size="small" label-width="75px" class="topform marbottom">
        <el-form-item label="生产车间：">
            <p class="input_bottom">
                {{ formHeader.workShopName || '' }}
            </p>
        </el-form-item>
        <el-form-item label="产线：">
            <p class="input_bottom">
                {{ formHeader.productLineName || '' }}
            </p>
        </el-form-item>
        <el-form-item label="订单号：">
            <p class="input_bottom">
                {{ formHeader.orderNo || '' }}
            </p>
        </el-form-item>
        <el-form-item label="订单日期：">
            <p class="input_bottom">
                {{ formHeader.orderDate || '' }}
            </p>
        </el-form-item>
        <el-form-item label="生产品项：">
            <p class="input_bottom">
                {{ formHeader.materialCode + ' ' + formHeader.materialName }}
            </p>
        </el-form-item>
        <el-form-item label="计划产量：">
            <p class="input_bottom">
                {{ formHeader.planOutput || '' }}
            </p>
        </el-form-item>
        <el-form-item label="生产日期：">
            <el-date-picker v-model="formHeader.productDate" size="mini" type="date" :disabled="!isRedact" value-format="yyyy-MM-dd" format="yyyy-MM-dd" style="width: 145px;" />
        </el-form-item>
        <el-form-item label="提交人员：">
            <p class="input_bottom">
                {{ formHeader.changer || '' }}
            </p>
        </el-form-item>
        <el-form-item label="提交时间：">
            <p class="input_bottom">
                {{ formHeader.changed || '' }}
            </p>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    name: 'FormHead',
    components: {},
    props: {
        isRedact: {
            type: Boolean,
            default() {
                return false;
            }
        },
        formHeader: {
            type: Object,
            default: function() { return {} }
        }
    },
    data() {
        return {};
    },
    computed: {},
    methods: {}
};
</script>

<style lang="scss" scoped>
.input_bottom {
    width: 145px !important;
    overflow: hidden;
    line-height: 32px;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
