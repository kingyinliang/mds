<!-- 包材库存管理 -->
<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth=""
            :type="'home'"
            :query-form-data="queryFormData"
            :list-interface="getDataList"
            :custom-data="true"
            @search-init="searchInit"
            @get-data-success="FnCallBackHandle"
            @created-end="createdEnd"
        >
            <template slot="home">
                <div class="item-sort-container">
                    <el-row class="home_card__main" :gutter="10">
                        <el-col v-for="item in stockInfoList" :key="item.potId" :span="6">
                            <div class="card-stock">
                                <div class="card-stock__head">
                                    <span>{{ `${item.materialGroupName} ${item.materialGroupCode}` }}</span>
                                    <el-button v-if="isAuth('')" class="floatr" type="text" @click="goDetail(item)">
                                        详情
                                    </el-button>
                                </div>
                                <div class="card-stock__content">
                                    <stock-detail-num :current-data="item" />
                                    <mds-card class="box-card" title="物料明细" :pack-up="false" :name="'fermenterTotal'">
                                        <stock-detail-table :current-data="item.materialStorageResponseDtoList" :current-location-code="currentLocationCode" />
                                    </mds-card>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </template>
        </query-table>
        <!-- <el-row>
            <el-pagination :current-page.sync="currentPage" :page-sizes="[10, 20, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="sizeChangeHandler" @current-change="currentPageChangeHanlder" />
        </el-row> -->
    </div>
</template>
<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, STOCK_API } from 'common/api/api';
    import StockDetailNum from '../common/StockDetailNum.vue';
    import StockDetailTable from '../common/StockDetailTable.vue';
    @Component({
        name: 'PackingStockManage',
        components: {
            StockDetailNum,
            StockDetailTable
        }
    })
    export default class PackingStockManage extends Vue {

        $refs: {
            queryTable: HTMLFormElement;
        };

        currentLocationCode = '';

        currentMaterialGroup: { materialGroupCode?: string; materialGroupType?: string } = {};

        // 车间详情列表
        stockInfoList: object[] = [];

        currentPage = 1;
        pageSize = 10;
        total = 0;

        queryFormData = [
            {
                type: 'select',
                label: '包材库位',
                prop: 'packageMaterialLocationCode',
                labelWidth: 90,
                rule: [
                    { required: false, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return new Promise(resolve => {
                        STOCK_API.STOCK_SYS_STORAGE_LIST_API({
                            // , 'ZFZC', 'ZROH'
                            materialTypeCodeSet: ['ZVER']
                        }).then(res => {
                            res.data.data = res.data.data.reduce((pre, cur) => {
                                !pre.find(row => row.storageLocation === cur.storageLocation) && pre.push(cur)
                                return pre
                            }, [])
                            res.data.data.sort((a, b) => a.storageLocation > b.storageLocation ? 1 : -1)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['storageLocation'],
                    value: 'storageLocation'
                }
            },
            {
                type: 'select',
                label: '物料组',
                prop: 'stoMaterialGroupId',
                labelWidth: 90,
                filterable: true,
                defaultValue: '',
                rule: [
                    { required: false, message: '请选择物料组', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    // return STOCK_API.STOCK_MATERIAL_GROUP_STORAGE_API({})
                    return STOCK_API.STOCK_STORAGE_LIST_ALL_API({})
                },
                resVal: {
                    resData: 'data',
                    label: ['materialGroupName', 'materialGroupCode'],
                    value: 'id'
                }
                // resVal: {
                //     resData: 'data',
                //     label: ['materialName', 'materialCode'],
                //     value: 'materialCode'
                // }
            },
            {
                type: 'select',
                label: '物料描述',
                prop: 'materialCode',
                labelWidth: 90,
                filterable: true,
                defaultValue: '',
                rule: [
                    { required: false, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ALLMATERIAL_API({
                        materialTypes: ['ZVER'] // 物料类型
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['materialName', 'materialCode'],
                    value: 'materialCode'
                }
            }
        ]

        createdEnd() {
            // this.$nextTick(() => {
            //     if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.productDate !== '') {
            //         this.$refs.queryTable.getDataList(true)
            //     }
            // })
        }

        searchInit() {
            const currentMaterialGroup = this.$refs.queryTable.optionLists.stoMaterialGroupId.find(row => row.id === this.$refs.queryTable.queryForm.stoMaterialGroupId)
            this.currentMaterialGroup = currentMaterialGroup || {}
        }

        // 统一车间具体信息请求成功处理
        FnCallBackHandle(data) {
            this.stockInfoList = data.data || [];
            if (this.stockInfoList.length === 0) {
                this.$infoToast('暂无任何内容');
            }
        }

        getDataList(params1) {
            // params.current = this.currentPage
            // params.size = this.pageSize
            const params = JSON.parse(JSON.stringify(params1))
            console.log(this.$refs.queryTable.queryForm, '++++++++++')
            this.currentLocationCode = this.$refs.queryTable.queryForm.packageMaterialLocationCode
            params.materialGroupCode = this.currentMaterialGroup.materialGroupCode
            params.materialGroupType = this.currentMaterialGroup.materialGroupType
            delete params.stoMaterialGroupId
            return STOCK_API.STOCK_PACKAGE_STORAGE_SUMMARY_QUERY_API(params)
        }

        // 跳转详情页
        goDetail(row) {
            console.log(row, '=========')
            // 保存当前点击的对象信息
            this.$store.commit('stock/updateStockInfo', { ...row, packageMaterialLocationCode: this.currentLocationCode });
            this.$store.commit(
                'common/updateMainTabs',
                this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Stock-PackingStockManage-detail')
            );
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Stock-PackingStockManage-detail`
                });
            }, 100);
        }

        sizeChangeHandler(val) {
            this.pageSize = val;
            this.$refs.queryTable.getDataList();
        }

        currentPageChangeHanlder(val) {
            this.currentPage = val;
            this.$refs.queryTable.getDataList();
        }
    }
</script>
<style lang="scss" scoped>
    .item-sort-container {
        margin-top: 10px;
    }
    .home_card__main {
        .card-stock {
            margin-bottom: 20px;
            background: #fff;
            border-radius: 8px;
            -webkit-box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.09);
            box-shadow: 3px 3px 4px 0 rgba(0, 0, 0, 0.09);
            .card-stock__head {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                padding: 15px 20px;
                font-size: 14px;
                border-bottom: 1px #e8e8e8 solid;
                .el-button {
                    font-size: 12px;
                    &::after {
                        content: ">>";
                    }
                }
            }
            .card-stock__content {
                .box-card {
                    padding: 8px 20px 26px !important;
                    border: 0;
                }
            }
        }
    }
</style>
