<template>
    <div class="packaging header_main">
        <query-table
            ref="queryTable"
            :type="'home'"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="home">
                <el-row class="packaging__main" :gutter="10">
                    <el-col v-for="(item, index) in queryList" :key="index" :span="8" style="margin-bottom: 10px;">
                        <el-form :model="item" size="small" label-position="right" label-width="85px">
                            <div class="packaging__main__item">
                                <div class="packaging__main__item__title clearfix">
                                    <p class="packaging__main__item__title__left">
                                        产线：<span class="packaging__main__item__title__left__proLine">{{ item.productLineName }}</span>产线
                                    </p>
                                    <p class="packaging__main__item__title__right">
                                        <span>状态：已保存</span>
                                    </p>
                                </div>
                                <div class="packaging__main__item__main">
                                    <div class="packaging__main__item__main__left">
                                        <img :src="item.img" alt="">
                                    </div>
                                    <div class="packaging__main__item__main__right">
                                        <el-form-item label="生产订单：">
                                            <el-select v-model="item.activeOrderNo" placeholder="请选择" :change="orderchange(item)" style="width: 100%;" clearable>
                                                <el-option v-for="(subItem, subIndex) in item.orderNoList" :key="subIndex" :label="subItem" :value="subItem" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="生产物料：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.activeOrderMap? item.activeOrderMap.materialCode : '' }}</span>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="订单产量：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.activeOrderMap? item.activeOrderMap.countOutput : '' }}</span>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="实际产量：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.activeOrderMap? item.activeOrderMap.planOutput : '' }}</span>
                                            </div>
                                        </el-form-item>
                                        <div class="packaging__main__item__main__right__btn">
                                            <el-button :disabled="item.activeOrderNo===''" size="small" type="primary" @click="goDataEntry(item)">
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
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, PKG_API } from 'common/api/api';
    import { getS3Img, dateFormat } from 'utils/utils';

    @Component({
        components: {
        }
    })
    export default class PackagingIndex extends Vue {
        queryList: PkgObj[] = []
        workshopName =''
        productLineList: object[] = []
        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workshop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP']
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                },
                linkageProp: ['productLine']
            },
            {
                type: 'select',
                label: '生产产线',
                prop: 'productLine',
                optionsFn: val => {
                    return COMMON_API.ORG_QUERY_CHILDREN_API({
                        parentId: val || ''
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
            },
            {
                type: 'date-picker',
                label: '生产日期',
                prop: 'productDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }
        ];

        mounted() {
            //
        }

        // 查询请求
        listInterface = params => {
            params.current = 1;
            params.size = 10;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return PKG_API.PKG_HOME_LIST_API(params);
        }

        setData(data) {
            data.data.forEach(item => {
                if (item.orderNoList.length === 1) {
                    item.activeOrderNo = item.orderNoList[0]
                    item.activeOrderMap = item.pkgOrderMap[item.orderNoList[0]]
                } else {
                    item.activeOrderNo = ''
                    item.activeOrderMap = {
                        planOutput: '',
                        materialCode: '',
                        countOutput: ''
                    }
                }
            })
            getS3Img(data.data, 'productLineImage')
            this.queryList = data.data
        }

        orderchange(item) {
            item.activeOrderMap = item.pkgOrderMap[item.activeOrderNo]
        }

        goDataEntry(item) {
            console.log('item')
            console.log(item)
            COMMON_API.ORG_QUERY_WORKSHOP_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                deptType: ['WORK_SHOP']
            }).then(({ data }) => {
                const temp = data.data
                temp.forEach(element => {
                    if (element.id === item.activeOrderMap.workShop) {
                        this.workshopName = element.deptName
                    }

                });
                this.$router.push({
                    name: `DFMDS-pages-Packaging-detail`,
                    params: {
                        orderId: item.activeOrderMap.id,
                        orderNo: item.activeOrderNo,
                        productLineName: item.productLineName,
                        workShopName: this.workshopName
                    }
                });
            })
        }
    }
    interface PkgObj{
        activeOrderMap?: OrderMap;
        activeOrderNo?: string;
        orderNoList?: string[];
        pkgOrderMap?: object;
        productLineImage?: string;
        productLineName?: string;
    }
    interface OrderMap{
        materialCode?: string;
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
                min-width: 140px;
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

                ::v-deep .el-form-item__content { /* stylelint-disable-line */
                    height: 32px;
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
