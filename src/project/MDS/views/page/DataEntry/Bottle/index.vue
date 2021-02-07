<template>
    <div class="header_main">
        <el-card class="searchCard queryHead">
            <el-form :model="formHeader" :inline="true" size="small" label-width="70px" class="sole_row">
                <el-form-item label="生产工厂：">
                    <el-select v-model="formHeader.factory" class="selectwpx" style="width: 180px;" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in factoryList" :key="index" :value="item.deptId" :label="item.deptName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产车间：">
                    <el-select v-model="formHeader.workShop" :disabled="workshopList.length===0" class="selectwpx" style="width: 140px;" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in workshopList" :key="index" :value="item.deptId" :label="item.deptName" />
                    </el-select>
                </el-form-item>
                <el-form-item label="生产日期：">
                    <el-date-picker v-model="formHeader.productDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" style="width: 150px;" clearable />
                </el-form-item>
                <el-form-item label="生产订单：">
                    <el-input v-model.trim="formHeader.orderNo" style="width: 150px;" placeholder="请输入" clearable />
                </el-form-item>
                <el-button v-if="isAuth('bottle:workshop:indexList')" type="primary" size="small" class="floatr" @click="getList">
                    查询
                </el-button>
            </el-form>
        </el-card>
        <el-row class="potList" :gutter="10" style="min-height: 150px; margin-top: 5px;">
            <el-col v-for="(item, index) in dataList" :key="index" :span="8">
                <div class="box-item">
                    <div class="box-item__top">
                        <div><i class="title-icon" />产线：{{ item.name }}</div>
                        <div class="status">
                            <span
                                class="points"
                                :style="{
                                    'margin-top': '8px',
                                    background: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : item.orderStatus === 'submit' ? '#1890ff' : item.orderStatus === 'saved' ? '#1890ff' : '#7ED321',
                                }"
                            />
                            &nbsp;状态：
                            <em
                                :style="{
                                    color: item.orderStatus === 'noPass' ? 'red' : item.orderStatus === 'checked' ? '#67C23A' : '',
                                }"
                            >{{ item.orderStatus === 'submit' ? '已提交' : item.orderStatus === 'checked' ? '审核通过' : item.orderStatus === 'noPass' ? '审核不通过' : item.orderStatus === 'saved' ? '已保存' : item.orderStatus === '已同步' ? '未录入' : item.orderStatus }}</em>
                        </div>
                    </div>
                    <div class="box-item__content" :gutter="20">
                        <div class="img">
                            <img src="@/assets/img/bottle.png" style="width: 130px;">
                        </div>
                        <div class="right">
                            <ul>
                                <li class="lines">
                                    <span>订单号：</span>
                                    <el-select v-model="item.orderNo" filterable size="mini" style="flex: 1;" @change="changeOrder($event, item)">
                                        <el-option v-for="(subItems, subIndex) in item.orderList" :key="subIndex" :value="subItems.orderNo" :label="subItems.orderNo" />
                                    </el-select>
                                </li>
                                <li class="lines">
                                    <span>
                                        生产品项：
                                    </span>
                                    <el-tooltip class="item" effect="dark" :content="item.materialName + item.materialCode" placement="bottom-start">
                                        <span>
                                            {{ item.materialName }}{{ item.materialCode }}
                                        </span>
                                    </el-tooltip>
                                </li>
                                <li class="lines">
                                    <span>计划产量：</span><span>{{ item.planOutput }} {{ item.outputUnit }}</span>
                                </li>
                                <li class="lines">
                                    <span>实时产量：</span><span>{{ item.realOutput }} {{ item.realOutput ? item.outputUnit : '' }}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="box-item__footer">
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

                        <el-tooltip class="item" effect="dark" :content="item.craftDataStatus" placement="top-start">
                            <el-button :disabled="!isAuth('bottle:workshop:techProductParameterList')" class="bottom-item" @click="GoDetail(2, item)">
                                工艺数据
                            </el-button>
                        </el-tooltip>
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
                    this.$errorToast(data.msg);
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
                        this.$errorToast(data.msg);
                    }
                });
            } else {
                this.workshopList = [];
            }
        },
        getList() {
            if (this.formHeader.factory === '') {
                this.$warningToast('请选择工厂');
                return false;
            }
            if (this.formHeader.workShop === '') {
                this.$warningToast('请选择车间');
                return false;
            }
            if ((this.formHeader.productDate === '' || !this.formHeader.productDate) && this.formHeader.orderNo === '') {
                this.$warningToast('生产日期或生产订单请选填一项');
                return false;
            }
            this.$http(`${BOTTLE_API.BOTTLE_INDEX_LIST}`, 'POST', this.formHeader).then(({ data }) => {
                if (data.code === 0) {
                    if (data.indexInfo.length === 0) {
                        this.$infoToast('暂无任何内容');
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
                    this.$errorToast(data.msg);
                }
            });
        },
        GoDetail(num, item) {
            let url;
            this.$store.state.common.bottle.ProOrderId = item.orderId;
            // this.$store.state.common.bottle.ProOrderId = '123'
            switch (num) {
                case 1:
                    url = 'MDS-views-page-DataEntry-Bottle-Production-detail';
                    break;
                case 2:
                    url = 'MDS-views-page-DataEntry-Bottle-craft';
                    break;
                case 3:
                    url = 'MDS-views-page-DataEntry-Bottle-qualityTest';
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

<style lang="scss" scoped>
.box-item {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(232, 232, 232, 1);
    border-radius: 6px;
    .box-item__top {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        padding: 0 10px;
        font-size: 14px;
        .status {
            font-size: 12px;
            line-height: 20px;
        }
    }
    .box-item__content {
        display: flex;
        flex-direction: row;
        .img {
            margin-top: 10px;
        }
        .right {
            .lines {
                display: flex;
                flex-direction: row;
                height: 32px;
                margin-bottom: 10px;
                padding-left: 10px;
                color: #333;
                font-size: 12px;
                line-height: 32px;
                list-style: none;
                border-radius: 4px;
                span:last-child {
                    flex: 1;
                    padding: 0 10px;
                    overflow: hidden;
                    font-size: 12px;
                    line-height: 32px;
                    text-overflow: ellipsis;
                    background: #f5f5f5;
                    border-radius: 4px;
                }
                span:first-child {
                    width: 60px;
                    color: rgba(0, 0, 0, 0.65);
                    font-size: 12px;
                }
            }
        }
    }
    .box-item__footer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .bottom-item {
            flex: 1;
            padding: 9px 15px;
            color: #000;
            font-size: 12px;
            text-align: center;
            background-color: #fff;
            border-color: #d9d9d9;
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
    }
}
.title-icon {
    display: inline-block;
    width: 4px;
    height: 12px;
    margin-top: 5px;
    margin-right: 5px;
    background: #487bff;
    border-radius: 2px;
}
</style>
