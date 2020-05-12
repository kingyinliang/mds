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
                <el-form :model="item" size="small" label-position="right" label-width="85px">
                    <div class="packaging__main__item">
                        <div class="packaging__main__item__title clearfix">
                            <p class="packaging__main__item__title__left">
                                产线：<span class="packaging__main__item__title__left__proLine">A#</span>产线
                            </p>
                            <p class="packaging__main__item__title__right">
                                <span>状态：已保存</span>
                            </p>
                        </div>
                        <div class="packaging__main__item__main">
                            <div class="packaging__main__item__main__left">
                                <img src="../../assets/img/sixMonth.jpg" alt="">
                            </div>
                            <div class="packaging__main__item__main__right">
                                <el-form-item label="生产订单：">
                                    <el-input />
                                </el-form-item>
                                <el-form-item label="生产物料：">
                                    <el-input disabled />
                                </el-form-item>
                                <el-form-item label="订单产量：">
                                    <el-input disabled />
                                </el-form-item>
                                <el-form-item label="实际产量：">
                                    <el-input disabled />
                                </el-form-item>
                                <div class="packaging__main__item__main__right__btn">
                                    <el-button size="small" type="primary">
                                        生产数据
                                    </el-button>
                                    <el-button size="small" type="primary">
                                        检查数据
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
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

        getDataList() {
        //    c
        }
    }
</script>

<style lang="scss" scoped>
@import "common/scss/_variables.scss";
.packaging__main {
    &__item {
        padding: 10px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(232, 232, 232, 1);
        border-radius: 8px;
        box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
        &__title {
            margin-bottom: 20px;
            &__left {
                float: left;
                &::before {
                    display: inline-block;
                    width: 4px;
                    height: 12px;
                    background-color: $main-color;
                    border-radius: 2px;
                    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
                    content: "";
                }
                &__proLine {
                    color: #f05c4a;
                }
            }
            &__right {
                position: relative;
                float: right;
                padding-left: 10px;
                font-size: 12px;
                line-height: 18px;
                &::before {
                    position: absolute;
                    top: 6px;
                    left: 0;
                    width: 6px;
                    height: 6px;
                    background: rgba(126, 211, 33, 1);
                    border-radius: 50%;
                    box-shadow: 3px 3px 5px 0 rgba(0, 0, 0, 0.1);
                    content: "";
                }
            }
        }
        &__main {
            display: flex;
            &__left {
                width: 160px;
                height: 200px;
                overflow: hidden;
                border-radius: 8px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            &__right {
                flex: 1;
                &__btn {
                    text-align: right;
                }

                ::v-deep .el-form-item { /* stylelint-disable-line */
                    margin-bottom: 10px;
                }
                ::v-deep .el-button--primary{ /* stylelint-disable-line */
                    padding: 5px 8px;
                    font-size: 14px;
                    line-height: 20px;
                }
            }
        }
    }
}
</style>
