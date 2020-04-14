<template>
    <div class="header_main">
        <el-card class="newCard">
            <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" class="width150px">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in factoryList" :key="index" :value="item.deptId" :label="item.deptName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" class="width150px">
                        <el-option value="">
                            请选择
                        </el-option>
                        <el-option v-for="(item, index) in workshopList" :key="index" :value="item.deptId" :label="item.deptName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="formHeader.productDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 150px;" />
                </el-form-item>
                <el-form-item label="生产订单：">
                    <el-input v-model.trim="formHeader.orderNo" style="width: 150px;" />
                </el-form-item>
                <el-form-item class="floatr">
                    <el-button v-if="isAuth('bottle:workshop:indexList')" type="primary" size="small" class="floatr" @click="getList">
                        查询
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-row :gutter="20" style="margin-top: 5px;">
            <el-col v-for="(item, index) in dataList" :key="index" :span="8" style="margin-bottom: 15px;">
                <div class="sole">
                    <div class="top">
                        <div>产线：{{ item.name }}</div>
                        <div class="status">
                            <span
                                class="points"
                                :style="{
                                    'margin-top': '8px',
                                    background: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : item.orderStatus === 'submit' ? '#1890ff' : item.orderStatus === 'saved' ? '#1890ff' : '#7ED321',
                                }"
                            />
                            &nbsp;状态：
                            <i
                                :style="{
                                    color: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : '',
                                }"
                            >{{ item.orderStatus === 'submit' ? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass' ? '审核不通过' : item.orderStatus === 'saved' ? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus }}</i>
                        </div>
                    </div>
                    <el-row class="content" :gutter="20">
                        <el-col class="img" :span="10">
                            <img src="@/assets/img/bottle.png" style="width: 95%;">
                        </el-col>
                        <el-col class="right" :span="14">
                            <div class="lines">
                                订单号：
                                <el-select v-model="item.orderNo" filterable size="mini" style="width: 140px;" @change="changeOrder($event, item)">
                                    <el-option v-for="(subItems, subIndex) in item.orderList" :key="subIndex" :value="subItems.orderNo" :label="subItems.orderNo" />
                                </el-select>
                            </div>
                            <div class="lines">
                                <div style="float: left;">
                                    品项：
                                </div>
                                <el-tooltip class="item" effect="dark" :content="item.materialCode + item.materialName" placement="bottom-start">
                                    <div style="float: left; width: 140px; overflow: hidden; color: rgba(0, 0, 0, 0.65); white-space: nowrap; text-overflow: ellipsis;">
                                        {{ item.materialCode }}{{ item.materialName }}
                                    </div>
                                </el-tooltip>
                            </div>
                            <div class="lines">
                                计划产量：<span>{{ item.planOutput }} {{ item.outputUnit }}</span>
                            </div>
                            <div class="lines">
                                实时产量：<span>{{ item.realOutput }} {{ item.realOutput ? item.outputUnit : '' }}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="bottom">
                        <el-tooltip
                            class="item"
                            effect="dark"
                            :content="item.orderStatus === 'submit' ? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass' ? '审核不通过' : item.orderStatus === 'saved' ? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus"
                            placement="top-start"
                        >
                            <el-button :disabled="!isAuth('bottle:inStorage:list')" class="bottom-item" @click="GoDetail(1, item)">
                                生产数据
                            </el-button>
                        </el-tooltip>
                        <div class="bottom-split" />
                        <el-tooltip class="item" effect="dark" :content="item.craftDataStatus" placement="top-start">
                            <el-button :disabled="!isAuth('bottle:workshop:techProductParameterList')" class="bottom-item" @click="GoDetail(2, item)">
                                工艺数据
                            </el-button>
                        </el-tooltip>
                        <div class="bottom-split" />
                        <el-tooltip class="item" effect="dark" :content="item.qualityStatus" placement="top-start">
                            <el-button :disabled="!isAuth('bottle:workshop:qualityInspectionList')" class="bottom-item" @click="GoDetail(3, item)">
                                质量检测
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { BASICDATA_API, BOTTLE_API } from '@/api/api';
import { dateFormat } from '@/net/validate';
export default {
    name: 'BottleName',
    data() {
        return {
            formHeader: {
                factory: '',
                workShop: '',
                productDate: dateFormat(new Date(), 'yyyy-MM-dd'),
                orderNo: ''
            },
            factoryList: [],
            workshopList: [],
            dataList: [],
            AllList: [],
            orderStatus: ''
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
        Bottle: {
            get() {
                return this.$store.state.common.Bottle;
            },
            set(val) {
                this.$store.commit('common/updateBottle', val);
            }
        }
    },
    watch: {
        'formHeader.factory'(n) {
            this.GetWorkshopList(n);
        }
    },
    mounted() {
        this.GetFactoryList();
    },
    methods: {
        // 获取工厂
        GetFactoryList() {
            this.$http(`${BASICDATA_API.FINDORG_API}?code=factory`, 'POST').then(({ data }) => {
                if (data.code === 0) {
                    this.factoryList = data.typeList;
                    this.formHeader.factory = data.typeList[0].deptId;
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        // 获取车间
        GetWorkshopList(id) {
            this.formHeader.workShop = '';
            if (id) {
                this.$http(`${BASICDATA_API.FINDORGBYID_API}`, 'POST', {
                    deptId: id,
                    deptName: '吹瓶'
                }).then(({ data }) => {
                    if (data.code === 0) {
                        this.workshopList = data.typeList;
                        if (data.typeList.length > 0) {
                            this.formHeader.workShop = data.typeList[0].deptId;
                        }
                    } else {
                        this.$errorTost(data.msg);
                    }
                });
            } else {
                this.workshopList = [];
            }
        },
        getList() {
            if (this.formHeader.factory === '') {
                this.$warningTost('请选择工厂');
                return false;
            }
            if (this.formHeader.workShop === '') {
                this.$warningTost('请选择车间');
                return false;
            }
            if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
                this.$warningTost('生产日期或生产订单请选填一项');
                return false;
            }
            this.$http(`${BOTTLE_API.BOTTLE_INDEX_LIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (data.indexInfo.length === 0) {
                        this.$infoTost('该搜寻条件无任何数据');
                        return false
                    }
                    this.AllList = data.indexInfo;
                    this.dataList = [];
                    data.indexInfo.map(item => {
                        const Search = this.dataList.find(items => items.name === item.productLineName);
                        if (!Search) {
                            this.dataList.push({
                                name: item.productLineName,
                                orderList: [item],
                                orderStatus: item.orderStatus,
                                materialCode: item.materialCode,
                                materialName: item.materialName,
                                planOutput: item.planOutput,
                                outputUnit: item.outputUnit,
                                realOutput: item.realOutput,
                                orderId: item.orderId,
                                orderNo: item.orderNo,
                                craftDataStatus: item.craftDataStatus,
                                qualityStatus: item.qualityStatus
                            });
                        } else {
                            Search.orderList.push(item);
                        }
                    });
                } else {
                    this.$errorTost(data.msg);
                }
            });
        },
        GoDetail(num, item) {
            let url;
            this.$store.state.common.bottle.ProOrderId = item.orderId;
            // this.$store.state.common.bottle.ProOrderId = '123'
            switch (num) {
                case 1:
                    url = 'DataEntry-Bottle-Production-detail';
                    break;
                case 2:
                    url = 'DataEntry-Bottle-craft';
                    break;
                case 3:
                    url = 'DataEntry-Bottle-qualityTest';
                    break;
                default:
            }
            this.Bottle = {
                orderNo: item.orderNo
            };
            this.mainTabs = this.mainTabs.filter(subItem => subItem.name !== url);
            setTimeout(() => {
                this.$router.push({ name: url });
            }, 100);
        },
        changeOrder(event, item) {
            const sole = this.AllList.find(items => items.orderNo === event);
            item.orderStatus = sole.orderStatus;
            item.materialCode = sole.materialCode;
            item.materialName = sole.materialName;
            item.planOutput = sole.planOutput;
            item.outputUnit = sole.outputUnit;
            item.realOutput = sole.realOutput;
            item.orderId = sole.orderId;
            item.orderNo = sole.orderNo;
            item.craftDataStatus = sole.craftDataStatus;
            item.qualityStatus = sole.qualityStatus;
        }
    }
};
</script>

<style lang="scss">
.sole {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 2px;
    .top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 10px;
        .status {
            font-size: 14px;
            line-height: 20px;
        }
    }
    .content {
        padding: 10px;
        .img {
            margin-top: 10px;
            text-align: center;
        }
        .right {
            height: 120px;
            .lines {
                overflow: hidden;
                color: rgba(0, 0, 0, 0.45);
                font-size: 12px;
                line-height: 26px;
                span {
                    color: rgba(0, 0, 0, 0.65);
                    font-size: 12px;
                }
            }
        }
    }
    .bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 40px;
        background: rgba(247, 249, 250, 1);
        .bottom-item {
            flex: 1;
            height: 40px;
            padding: 0;
            font-size: 14px;
            line-height: 40px;
            text-align: center;
            background: #f7f9fa;
            border: none;
            border-radius: 0;
            &:hover {
                color: #fff;
                background: #1890ff;
            }
            &.is-disabled {
                color: #606266;
            }
            &.is-disabled:hover {
                color: #fff;
            }
        }
        .bottom-split {
            width: 1px;
            height: 16px;
            background: rgba(232, 232, 232, 1);
        }
    }
}
</style>
