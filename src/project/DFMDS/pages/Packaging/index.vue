<template>
    <div class="packaging header_main">
        <el-card class="searchCard" style="margin-bottom: 10px;">
            <el-form :model="queryForm" size="small" :inline="true" label-width="70px" class="sole_row clearfix">
                <el-form-item label="生产车间：">
                    <el-select v-model="queryForm.workShop" style="width: 170px;" placeholder="请选择生产车间">
                        <el-option v-for="(opt, optIndex) in optionLists.workShop" :key="optIndex" :label="opt.deptName" :value="opt.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产产线：">
                    <el-select v-model="queryForm.productLine" style="width: 170px;" placeholder="请选择生产产线">
                        <el-option v-for="(opt, optIndex) in optionLists.productLine" :key="optIndex" :label="opt.deptName" :value="opt.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产订单：">
                    <el-input v-model="queryForm.orderNo" style="width: 170px;" />
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="queryForm.startDate" type="date" style="width: 170px;" />
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button type="primary" size="small" @click="getDataList(true)">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row class="packaging__main" :gutter="10">
            <el-col v-for="item in 4" :key="item" :span="8" style="margin-bottom: 10px;">
                <div class="packaging__main__item">
                    <div class="packaging__main__item__title clearfix">
                        <p class="packaging__main__item__title__left">
                            产线：<span>A#</span>产线
                        </p>
                        <p class="packaging__main__item__title__right" />
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { COMMON_API } from 'common/api/api';

    @Component({
        components: {
        }
    })
    export default class PackagingIndex extends Vue {
        queryForm = {}
        optionLists = {
            workShop: [],
            productLine: []
        }

        getDataList(a) {
        //    c
        }
    }
</script>

<style lang="scss" scoped>
.packaging__main {
    &__item {
        padding: 10px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(232, 232, 232, 1);
        border-radius: 8px;
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
        &__title {
            &__left {
                padding-left: 10px;
                &::after {
                    width: 4px;
                }
            }
        }
    }
}
</style>
