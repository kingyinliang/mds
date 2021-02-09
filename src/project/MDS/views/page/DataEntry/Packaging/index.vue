<template>
    <div class="header_main">
        <el-card class="searchCard ferCard">
            <el-form ref="" :model="plantList" size="small" class="sole_row clearfix" :inline="true" label-width="70px" @keyup.enter.native="GetOrderList()" @submit.native.prevent>
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factoryid" placeholder="请选择">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in factory" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="plantList.workShop" placeholder="请选择" class="width140px" @change="setworkShopname">
                        <el-option v-for="(item, index) in workshop" :key="index" :label="item.deptName" :value="item.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="日期：" label-width="45px">
                    <el-date-picker v-model="plantList.productDate" type="date" placeholder="请选择" value-format="yyyyMMdd" style="width: 140px;" />
                </el-form-item>
                <el-form-item label="订单：" label-width="45px">
                    <el-input v-model="plantList.orderNo" type="text" clearable style="width: 140px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button type="primary" @click="GetOrderList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card v-if="list.length" style="margin-top: 5px;">
            <el-row class="home_card__main" :gutter="10">
                <el-col v-for="(item, index) in list" :key="index" :span="8" style="margin-bottom: 10px;">
                    <el-form :model="item" size="small" label-position="right" label-width="85px">
                        <div class="home_card__main__item">
                            <div class="home_card__main__item__title clearfix">
                                <p class="home_card__main__item__title__left">
                                    产线：<span class="home_card__main__item__title__left__proLine">{{ item.productLineName }}</span>
                                </p>
                                <p v-if="item.orderNo!==''" class="home_card__main__item__title__right" :class="{'home_card__main__item__title__right--R': item.orderStatus === 'noPass'}">
                                    <span>状态：{{ item.orderStatus === 'submit' ? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass' ? '审核不通过' : item.orderStatus === 'saved' ? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus }}</span>
                                </p>
                            </div>
                            <div class="home_card__main__item__main">
                                <div class="home_card__main__item__main__left">
                                    <img :src="'data:image/gif;base64,' + item.img" alt="">
                                </div>
                                <div class="home_card__main__item__main__right">
                                    <el-form-item label="生产订单：">
                                        <el-select v-model="item.orderNo" placeholder="请选择" style="width: 100%;" @change="orderchange(item)">
                                            <el-option v-for="(subItem, subIndex) in item.order_arr" :key="subIndex" :label="subItem" :value="subItem" />
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="生产物料：">
                                        <div class="disabled-input el-input el-input--small is-disabled">
                                            <el-tooltip class="item" effect="dark" :content="item.orderNo? `${item.materialName} ${item.materialCode}` : ''" placement="top">
                                                <span class="el-input__inner">{{ item.materialName + ' ' + item.materialCode }}</span>
                                            </el-tooltip>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="订单产量：">
                                        <div class="disabled-input el-input el-input--small is-disabled">
                                            <span class="el-input__inner">{{ item.planOutput + ' ' + item.outputUnit }}</span>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="实际产量：">
                                        <div class="disabled-input el-input el-input--small is-disabled">
                                            <span class="el-input__inner">{{ item.realOutput ? item.realOutput + item.outputUnit : '0' + ' ' + item.outputUnit }}</span>
                                        </div>
                                    </el-form-item>
                                    <div class="home_card__main__item__main__right__btn">
                                        <el-button v-if="isAuth('pkg:order:list')" :disabled="item.activeOrderNo===''" size="small" type="primary" @click="goPro(item)">
                                            生产数据
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script>
import { BASICDATA_API, PACKAGING_API } from '@/api/api';
import { orderList } from '@/net/validate';
export default {
    name: 'Index',
    components: {},
    data() {
        return {
            factory: [],
            workshop: [],
            plantList: {
                factoryid: this.$store.state.common.Pkgfactoryid,
                workShop: this.$store.state.common.PkgworkShop,
                orderNo: '',
                productDate: ''
            },
            list: [],
            workShop: '',
            productDate: '',
            factoryid: '',
            workShopname: ''
        };
    },
    computed: {
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        },
        mainTabsActiveName: {
            get() {
                return this.$store.state.common.mainTabsActiveName;
            },
            set(val) {
                this.$store.commit('common/updateMainTabsActiveName', val);
            }
        },
        Pkgfactoryid: {
            get() {
                return this.$store.state.common.Pkgfactoryid;
            },
            set(val) {
                this.$store.commit('common/updateFactoryid', val);
            }
        },
        PkgworkShop: {
            get() {
                return this.$store.state.common.PkgworkShop;
            },
            set(val) {
                this.$store.commit('common/updateWorkShop', val);
            }
        },
        PkgproductDate: {
            get() {
                return this.$store.state.common.PkgproductDate;
            },
            set(val) {
                this.$store.commit('common/updateProductDate', val);
            }
        },
        PkgorderNo: {
            get() {
                return this.$store.state.common.PkgorderNo;
            },
            set(val) {
                this.$store.commit('common/updateOrderNo', val);
            }
        }
    },
    watch: {
        'plantList.factoryid'(n) {
            this.plantList.workShop = '';
            this.Getdeptbyid(n);
        }
    },
    mounted() {
        if (this.PkgproductDate === '') {
            this.plantList.productDate =
                new Date(new Date() - 24 * 60 * 60 * 1000).getFullYear().toString() +
                (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1 >= 10 ? (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1).toString() : '0' + (new Date(new Date() - 24 * 60 * 60 * 1000).getMonth() + 1)) +
                (new Date(new Date() - 24 * 60 * 60 * 1000).getDate() >= 10 ? new Date(new Date() - 24 * 60 * 60 * 1000).getDate().toString() : '0' + new Date(new Date() - 24 * 60 * 60 * 1000).getDate());
        } else {
            this.plantList.productDate = this.PkgproductDate;
        }
        this.Getdeptcode();
        this.Getdeptbyid(this.plantList.factoryid);
    },
    methods: {
        // 获取工厂,ceshi
        Getdeptcode() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factory = data.typeList;
                    if (!this.plantList.factoryid) {
                        this.plantList.factoryid = data.typeList[0].deptId;
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 获取车间
        Getdeptbyid(id) {
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '包装 组装'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshop = data.typeList;
                        if (data.typeList.length > 0 && !this.plantList.workShop) {
                            this.plantList.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 获取列表
        GetOrderList() {
            if (this.plantList.workShop) {
                if ((this.plantList.productDate === '' || !this.plantList.productDate) && this.plantList.orderNo === '') {
                    this.$warningToast('日期或订单请选填一项');
                    return false;
                }
                this.$http(`${PACKAGING_API.PKGORDELIST_API}`, 'POST', {
                    factory: this.plantList.factoryid,
                    workShop: this.plantList.workShop,
                    productDate: this.plantList.productDate,
                    orderNo: this.plantList.orderNo
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.Pkgfactoryid = this.plantList.factoryid;
                        this.PkgworkShop = this.plantList.workShop;
                        this.PkgproductDate = this.plantList.productDate;
                        this.list = orderList(data.list);
                        this.workShop = this.plantList.workShop;
                        this.productDate = this.plantList.productDate;
                        this.factoryid = this.plantList.factoryid;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.$warningToast('请选择车间');
            }
        },
        // 订单号下拉
        orderchange(row) {
            if (row.orderNo && row.orderNo !== row.orderNo2) {
                this.$http(
                    `${PACKAGING_API.PKGORDELIST_API}`,
                    'POST',
                    {
                        factory: this.factoryid,
                        workShop: this.workShop,
                        productDate: this.productDate,
                        orderNo: row.orderNo
                    },
                    false,
                    false,
                    false
                ).then(({ data }) => {
                    if (data.code === 0) {
                        row.orderNo2 = row.orderNo;
                        row.materialCode = data.list[0].materialCode;
                        row.materialName = data.list[0].materialName;
                        row.planOutput = data.list[0].planOutput;
                        row.orderStatus = data.list[0].orderStatus;
                        row.outputUnit = data.list[0].outputUnit;
                        row.properties = data.list[0].properties;
                        row.realOutput = data.list[0].realOutput;
                        row.plan = data.list[0].plan;
                    } else {
                        this.$errorToast(data.msg);
                    }
                });
            }
        },
        // 数据处理
        /* eslint-disable @typescript-eslint/camelcase */
        // orderList(data) {
        //     const result = [];
        //     for (let i = 0; i < data.length; i++) {
        //         const orderNo = [data[i].orderNo];
        //         for (let j = i + 1; j < data.length; j++) {
        //             if (data[i].productLine === data[j].productLine) {
        //                 j = ++i;
        //                 orderNo.push(data[j].orderNo);
        //             }
        //         }
        //         let orderNos = '';
        //         if (orderNo.length === 1) {
        //             orderNos = orderNo[0];
        //         } else {
        //             orderNos = '';
        //         }
        //         result.push({
        //             img: data[i].img,
        //             productLine: data[i].productLine,
        //             productLineName: data[i].productLineName,
        //             orderNo: orderNos,
        //             orderNo2: '',
        //             order_arr: orderNo,
        //             realOutput: '',
        //             materialCode: '',
        //             materialName: '',
        //             orderStatus: '',
        //             planOutput: '',
        //             outputUnit: '',
        //             properties: ''
        //         });
        //     }
        //     return result;
        // },
        /* eslint-enable @typescript-eslint/camelcase */
        setworkShopname(val) {
            this.workShopname = val;
        },
        // 数据录入
        goPro(item) {
            if (item.orderNo && item.properties) {
                this.PkgorderNo = item.orderNo;
                this.PkgproductDate = this.productDate;
                this.PkgworkShop = this.workShop;
                this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'MDS-views-page-DataEntry-Packaging-ProDataIn');
                setTimeout(() => {
                    this.$router.push({ name: `MDS-views-page-DataEntry-Packaging-ProDataIn` });
                }, 100);
            } else {
                this.$warningToast('请选择订单号');
            }
        }
    }
};
</script>
<style lang="scss">
.itemForm .el-form-item__content {
    height: auto;
}
</style>
<style lang="scss" scoped>
.hiddenP {
    max-height: 64px;
    margin-top: 0 !important;
    overflow: hidden;
}
.box-card {
    .pro-line {
        border-bottom: 1px solid #dcdfe6;
    }
    .pro-line p {
        color: red;
        font-size: 16px;
        letter-spacing: 0.1em;
    }
    b {
        float: left;
        font-size: 16px;
        line-height: 32px;
    }
    .item {
        display: flex;
        margin-top: 20px;
        img {
            float: left;
            width: 220px;
            height: 220px;
            margin-right: 20px;
            border: 1px solid #dcdfe6;
            border-radius: 6px;
        }
        .itemForm {
            flex: 1;
            p {
                color: #8a979e;
            }
        }
    }
}
</style>
