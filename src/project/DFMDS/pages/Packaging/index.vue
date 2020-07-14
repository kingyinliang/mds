<template>
    <div class="packaging header_main">
        <query-table
            ref="queryTable"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
        >
            <template slot="home">
                <el-row class="home_card__main" :gutter="10">
                    <el-col v-for="(item, index) in queryResultList" :key="index" :span="8" style="margin-bottom: 10px;">
                        <el-form :model="item" size="small" label-position="right" label-width="85px">
                            <div class="home_card__main__item">
                                <div class="home_card__main__item__title clearfix">
                                    <p class="home_card__main__item__title__left">
                                        产线：<span class="home_card__main__item__title__left__proLine">{{ item.productLineName }}</span>产线
                                    </p>
                                    <p v-if="item.activeOrderNo!==''" class="home_card__main__item__title__right">
                                        <span>状态：{{ item.activeOrderMap? item.activeOrderMap.orderStatusValue : '' }}</span>
                                    </p>
                                </div>
                                <div class="home_card__main__item__main">
                                    <div class="home_card__main__item__main__left">
                                        <img :src="item.img" alt="">
                                    </div>
                                    <div class="home_card__main__item__main__right">
                                        <el-form-item label="生产订单：">
                                            <el-select v-model="item.activeOrderNo" placeholder="请选择" style="width: 100%;" @change="orderchange(item)">
                                                <el-option v-for="(subItem, subIndex) in item.orderNoList" :key="subIndex" :label="subItem" :value="subItem" />
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="生产物料：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <el-tooltip class="item" effect="dark" :content="item.activeOrderMap? `${item.activeOrderMap.materialCode} ${item.activeOrderMap.materialName}` : ''" placement="top">
                                                    <span class="el-input__inner">{{ item.activeOrderMap? `${item.activeOrderMap.materialCode} ${item.activeOrderMap.materialName}` : '' }}</span>
                                                </el-tooltip>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="订单产量：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.activeOrderMap && item.activeOrderMap.planOutput? `${item.activeOrderMap.planOutput} ${item.activeOrderMap.outputUnit}` : `0${item.activeOrderMap.outputUnit}` }}</span>
                                            </div>
                                        </el-form-item>
                                        <el-form-item label="实际产量：">
                                            <div class="disabled-input el-input el-input--small is-disabled">
                                                <span class="el-input__inner">{{ item.activeOrderMap && item.activeOrderMap.realOutput? `${item.activeOrderMap.realOutput} ${item.activeOrderMap.outputUnit}` : `0${item.activeOrderMap.outputUnit}` }}</span>
                                            </div>
                                        </el-form-item>
                                        <div class="home_card__main__item__main__right__btn">
                                            <el-button :disabled="item.activeOrderNo===''" size="small" type="primary" @click="goDataEntry(item)">
                                                生产数据
                                            </el-button>
                                            <el-button :disabled="item.activeOrderNo===''" size="small" type="primary" @click="goCheckData(item)">
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
        queryResultList: PkgObj[] = [];
        checkStatus: object[]=[];

        // 数据字典 - 取审核列表
        created() {
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
                this.checkStatus = data.data
            });
        }

        // 查询表头
        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '包装'
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
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'date-picker',
                label: '生产日期',
                prop: 'productDate',
                valueFormat: 'yyyy-MM-dd hh:mm:ss',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss')
            },
            {
                type: 'input',
                label: '生产订单',
                prop: 'orderNo'
            }
        ];

        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ];

        // 查询请求
        listInterface = params => {
            params.current = 1;
            params.size = 10;
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            return PKG_API.PKG_HOME_LIST_API(params);
        }

        setData(data) {
            if (data.data.length !== 0) {
                const tempData = JSON.parse(JSON.stringify(data.data))
                tempData.forEach((item, index) => {
                    if (item !== null) {
                        if (item.orderNoList.length === 1) {
                            item.activeOrderNo = item.orderNoList[0];
                            item.activeOrderMap = item.pkgOrderMap[item.orderNoList[0]];
                            this.orderchange(item);
                        } else {
                            item.activeOrderNo = '';
                            item.activeOrderMap = {
                                outputUnit: '',
                                planOutput: '',
                                realOutput: '',
                                materialCode: '',
                                materialName: ''
                            }
                        }
                    } else {
                        tempData.splice(index, 1)
                    }
                })
                getS3Img(tempData, 'productLineImage')
                this.queryResultList = tempData
            } else {
                this.queryResultList = [];
                this.$infoToast('暂无任何内容');
            }

        }

        orderchange(item) {
            if (item.activeOrderNo !== '') {
                item.activeOrderMap = item.pkgOrderMap[item.activeOrderNo]
                this.checkStatus.forEach((element: OrderStatus) => {
                    if (item.activeOrderMap.orderStatus === element.dictCode) {
                        item.activeOrderMap.orderStatusValue = element.dictValue
                    }
                });
            }
        }

        goDataEntry(item) {
            this.$store.commit('packaging/updatePackDetail', item.activeOrderMap);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Packaging-detail'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Packaging-detail`
                });
            }, 100);
        }

        goCheckData(item) {
            this.$store.commit('packaging/updatePackCheckData', item.activeOrderMap);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Packaging-CheckData'))
            setTimeout(() => {
                this.$router.push({ name: `DFMDS-pages-Packaging-CheckData` });
            }, 100);
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
    interface OrderStatus {
        dictCode?: string;
        dictId?: string;
        dictValue?: string;
        factoryName?: string;
    }
</script>

<style lang="scss" scoped>
</style>
