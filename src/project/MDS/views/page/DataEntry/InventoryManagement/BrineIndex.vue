<template>
    <div class="header_main">
        <el-card class="queryHead">
            <el-form :model="plantList" size="small" :inline="true" label-position="right" label-width="auto" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="plantList.factoryIDValue" class="w300" placeholder="请选择" @change="changeSearchOptions(plantList.factoryIDValue)">
                        <el-option v-for="sole in factoryList" :key="sole.deptId" :label="sole.deptName" :value="sole.deptId" />
                    </el-select>
                </el-form-item>
                <el-form-item label="库位：">
                    <el-select v-model="plantList.location" class="w200" clearable placeholder="请选择" :disabled="plantList.factoryIDValue === ''">
                        <el-option label="请选择" value="" />
                        <el-option v-for="sole in locationList" :key="sole" :label="sole" :value="sole" />
                    </el-select>
                </el-form-item>
                <el-form-item style="float: right;">
                    <el-button v-if="isAuth('kjm:saltPage:list')" type="primary" size="small" :disabled="(plantList.factoryIDValue === '')" @click="getOrderList()">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row v-if="isMainAreaShow" :gutter="30" class="cardList">
            <el-col v-for="(item, index) in dataList" :key="index" :span="12">
                <el-card class="card-item">
                    <div slot="header">
                        {{ item.workShopName }}
                        <span class="card-item_detail" @click="goTargetDetail(item)">详情</span>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <div class="card-item-color-lump" style="background: #ffbf00;">
                                <span class="card-item-color-lump_icon iconfont factory-chuguan1" />
                                <div class="card-item-color-lump__img">
                                    <div class="card-item-color-lump__img__box">
                                        <div
                                            class="card-item-color-lump__img__box__bg"
                                            :style="{
                                                height: '90%',
                                            }"
                                        />
                                    </div>
                                    <img src="@/assets/img/ui2.0/pot.png" alt="">
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="card-item-color-lump">
                                <span class="card-item-color-lump_icon iconfont factory-zongliangguanli" />
                                <p class="card-item-color-lump_text">
                                    <span>{{ item.sumAmount }}</span>L
                                </p>
                                <p class="card-item-color-lump_text">
                                    库存总量
                                </p>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="card-item-color-lump_text">
                        <p class="card-item-color-lump_text__title">
                            <i class="card-item-color-lump_text__icon" />
                            <span>库存明细</span>
                        </p>
                        <el-table :data="item.kjmSaltingInventory" header-row-class-name="card-item-color-lump_text__table__head" class="card-item-color-lump_text__table" height="165">
                            <el-table-column
                                prop="batch"
                                width="auto"
                            >
                                <template slot="header">
                                    <i class="iconfont factory-pici" style="margin-right: 5px;" />批次
                                </template>
                            </el-table-column>
                            <el-table-column prop="currentQuantity" width="auto" header-align="left">
                                <template slot="header">
                                    <i class="iconfont factory-shuliang" style=" margin-right: 5px; font-size: 18px;" />数量
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { BASICDATA_API, INVENTORY_API } from '@/api/api';
import { isAuth } from '@/net/validate';
import MSG from '@/assets/js/hint-msg';
export default {
    name: 'BrineIndex',
    components: {},
    data() {
        return {
            factoryList: [],
            locationList: ['7102', '71A2'],
            plantList: {
                factoryIDValue: '',
                factoryName: '',
                location: '',
                workshopIDValue: '',
                workshopName: '',
                holderId: '',
                holderName: ''
            },
            dataList: [],
            oriAPIData: []
        };
    },
    computed: {
        isMainAreaShow: function() {
            return this.dataList.length !== 0;
        },
        // sumBatch: function() {
        //     return function(items) {
        //         let sum = 0;
        //         items.forEach(item => {
        //             sum = sum + Number(item.amount);
        //         });
        //         return sum;
        //     };
        // },
        mainTabs: {
            get() {
                return this.$store.state.common.mainTabs;
            },
            set(val) {
                this.$store.commit('common/updateMainTabs', val);
            }
        }
    },
    mounted() {
        this.getOriDataFromAPI().then(() => {
            // 初始化搜寻条件
            this.plantList.factoryIDValue = this.oriAPIData[0].deptId;
            if (this.oriAPIData[0].workshop.length !== 0) {
                this.workshopList = this.oriAPIData[0].workshop;
                this.plantList.workshopIDValue = this.oriAPIData[0].workshop[0].deptId;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        });
    },
    methods: {
        // 改变选单数据
        changeSearchOptions(flag) {
            const item = this.oriAPIData.find(ele => ele.deptId === flag);
            if (item.workshop.length !== 0) {
                this.workshopList = item.workshop;
            } else {
                this.workshopList = [];
                this.plantList.workshopIDValue = '';
            }
        },
        // 获取工厂
        getFactory() {
            return new Promise((resolve, reject) => {
                this.factoryList = [];
                this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, `POST`, {}, false, false, false).then(({ data }) => {
                    if (data.code === 0) {
                        resolve(data.typeList);
                    } else {
                        this.$notify.error({
                            title: MSG.API.WheatPot.getFactoryError.title,
                            message: data.msg
                        });
                        reject(data.msg);
                    }
                });
            });
        },
        // 根据工厂获车间
        getWorkshop(id) {
            return new Promise((resolve, reject) => {
                this.plantList.workshopIDValue = '';
                this.workshopList = [];
                if (id) {
                    this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', { deptId: id, deptName: '炒麦' }, false, false, false).then(({ data }) => {
                        if (data.code === 0) {
                            resolve(data.typeList);
                        } else {
                            this.$notify.error({
                                title: MSG.API.WheatPot.getWorkshopError.title,
                                message: data.msg
                            });
                            reject(data.msg);
                        }
                    });
                }
            });
        },
        // 获取工厂车间
        getOriDataFromAPI() {
            return new Promise((resolve) => {
                this.getFactory().then(valueFactory => {
                    this.oriAPIData = [];
                    this.factoryList = [];
                    for (let i = 0; i < valueFactory.length; i++) {
                        const dataTempF = {
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName,
                            workshop: []
                        };
                        this.factoryList.push({
                            deptId: valueFactory[i].deptId,
                            deptName: valueFactory[i].deptName
                        });
                        this.getWorkshop(valueFactory[i].deptId).then(valueWorkshop => {
                            if (valueWorkshop.length !== 0) {
                                for (let j = 0; j < valueWorkshop.length; j++) {
                                    const dataTempW = {
                                        deptId: valueWorkshop[j].deptId,
                                        deptName: valueWorkshop[j].deptName
                                    };
                                    dataTempF.workshop.push(dataTempW);
                                }
                            }
                            this.oriAPIData.push(dataTempF);
                            resolve();
                        });
                    }
                });
            });
        },
        // 获取列表
        getOrderList() {
            this.dataList = [];
            if (!this.plantList.factoryIDValue) {
                this.$warningToast('请选择工厂');
                return;
            }
            this.$http(`${INVENTORY_API.BRINE_INVENTPRY_LIST_API}`, `POST`, {
                factory: this.plantList.factoryIDValue,
                location: this.plantList.location
            }).then(({ data }) => {
                if (data.code === 0) {
                    if (data.list.length !== 0) {
                        this.dataList = data.list;
                    } else {
                        this.$infoToast('暂无数据');
                    }
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 去详请
        goTargetDetail(item) {
            if (!isAuth('kjm:saltPage:detail')) {
                this.$infoToast('暂无查看明细的权限');
                return;
            }
            this.$store.state.common.BrineInventory = {
                factoryId: this.plantList.factoryIDValue,
                location: item.location,
                factoryName: item.factoryName,
                workShopName: item.workShopName,
                materialCode: item.materialCode,
                materialName: item.materialName,
                sumAmount: item.sumAmount
            }
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== 'DataEntry-InventoryManagement-BrineDetail');
            setTimeout(() => {
                this.$router.push({
                    name: 'DataEntry-InventoryManagement-BrineDetail'
                });
            }, 100);
        }
    }
};
</script>

<style lang="scss"></style>
