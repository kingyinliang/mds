<template>
    <div class="header_main">
        <query-table
            ref="queryTable"
            query-auth="steSplitQuery"
            :type="'home'"
            :rules="rules"
            :query-form-data="queryFormData"
            :list-interface="listInterface"
            :custom-data="true"
            @get-data-success="setData"
            @created-end="createdEnd"
        >
            <template slot="home">
                <el-row class="potList" :gutter="10" style="min-height: 150px; margin-top: 5px; margin-bottom: 30px;">
                    <el-col v-for="(item, index) in queryFirstResultList" :key="index" :span="6">
                        <div class="box-item">
                            <div class="box-item__top">
                                <div><i class="title-icon" />{{ item.houseSplitList[item.nowIndex].kojiHouseName }}  <span>{{ item.houseSplitList[item.nowIndex].fermentPotName }}</span></div>
                                <div class="status">
                                    <span
                                        class="points"
                                        :style="{
                                            'margin-top': '8px',
                                            background: item.houseSplitList[item.nowIndex].status === 'D' ? 'red' : item.houseSplitList[item.nowIndex].status === 'C' ? '#67C23A' : item.houseSplitList[item.nowIndex].status === 'M' ? '#1890ff' : item.houseSplitList[item.nowIndex].status === 'S' ? '#1890ff' : '#7ED321',
                                        }"
                                    />
                                    &nbsp;曲房状态：
                                    <em
                                        :style="{
                                            color: item.houseSplitList[item.nowIndex].status === 'R' ? 'red' : item.houseSplitList[item.nowIndex].status === 'C' ? '#67C23A' : '',
                                        }"
                                    >{{ item.houseSplitList[item.nowIndex].statusName }}</em>
                                </div>
                            </div>
                            <div class="box-item__content" :gutter="20">
                                <div class="img" style="margin: 0; padding: 5px 10px; background-color: #f6f5f8; border-radius: 5px;">
                                    <img src="@/assets/img/koji_01.png" style="width: 130px;">
                                </div>
                                <div class="right">
                                    <ul>
                                        <li class="lines">
                                            <span>生产订单：</span>
                                            <el-select v-model="item.houseSplitList[item.nowIndex].orderNoTemp" filterable size="mini" style="flex: 1;" @change="val=>changeFirstOrder(val,item)">
                                                <el-option v-for="(subItems) in item.houseSplitList" :key="subItems.id" :value="subItems.orderNo" :label="subItems.orderNo" />
                                            </el-select>
                                        </li>
                                        <li class="lines">
                                            <span>
                                                生产物料：
                                            </span>
                                            <el-tooltip class="item" effect="dark" :content="item.houseSplitList[item.nowIndex].materialName + item.houseSplitList[item.nowIndex].materialCode" placement="bottom-start">
                                                <span>
                                                    {{ item.houseSplitList[item.nowIndex].materialName }} {{ item.houseSplitList[item.nowIndex].materialCode }}
                                                </span>
                                            </el-tooltip>
                                        </li>
                                        <li class="lines">
                                            <span>制曲时长：</span><span>{{ item.houseSplitList[item.nowIndex].kojiDuration?`${item.houseSplitList[item.nowIndex].kojiDuration} H`: '' }} </span>
                                        </li>
                                        <li class="lines">
                                            <span>入曲时间：</span><span>{{ item.houseSplitList[item.nowIndex].kojiStartTime }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="box-item__footer">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="orderStatusMapping[item.houseSplitList[item.nowIndex].houseTag.washBeanCraft]"
                                    placement="top-start"
                                >
                                    <el-button class="bottom-item" @click="goDetail('first',1, item.houseSplitList[item.nowIndex])">
                                        <!-- <el-button :disabled="!isAuth('bottle:inStorage:list')" class="bottom-item" @click="goDetail('first',1, item)"> -->
                                        洗豆
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip class="item" effect="dark" :content="orderStatusMapping[item.houseSplitList[item.nowIndex].houseTag.steamFlourCraft]" placement="top-start">
                                    <el-button class="bottom-item" @click="goDetail('first',2, item.houseSplitList[item.nowIndex])">
                                        <!-- <el-button :disabled="!isAuth('bottle:workshop:techProductParameterList')" class="bottom-item" @click="goDetail('first',2, item)"> -->
                                        蒸面
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="orderStatusMapping[item.houseSplitList[item.nowIndex].houseTag.discCraft]" placement="top-start">
                                    <el-button class="bottom-item" @click="goDetail('first',3, item.houseSplitList[item.nowIndex])">
                                        <!-- <el-button :disabled="!isAuth('bottle:workshop:qualityInspectionList')" class="bottom-item" @click="goDetail('first',3, item)"> -->
                                        圆盘
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="potList" :gutter="10" style="min-height: 150px; margin-top: 5px;">
                    <el-col v-if="querySecondResultList.length!==0" :span="6">
                        <div class="box-item">
                            <div class="box-item__top">
                                <div><i class="title-icon" />蒸豆 <span>{{ querySecondResultList[secondObjIndex].productLineName }} </span></div>
                                <div class="status">
                                    <span
                                        class="points"
                                        :style="{
                                            'margin-top': '8px',
                                            background: querySecondResultList[secondObjIndex].orderStatus === 'D' ? 'red' : querySecondResultList[secondObjIndex].orderStatus === 'C' ? '#67C23A' : querySecondResultList[secondObjIndex].orderStatus === 'M' ? '#1890ff' : querySecondResultList[secondObjIndex].orderStatus === 'S' ? '#1890ff' : '#7ED321',
                                        }"
                                    />
                                    &nbsp;状态：
                                    <em
                                        :style="{
                                            color: querySecondResultList[secondObjIndex].orderStatus === 'R' ? 'red' : querySecondResultList[secondObjIndex].orderStatus === 'C' ? '#67C23A' : '',
                                        }"
                                    >{{ querySecondResultList[secondObjIndex].orderStatusName }}</em>
                                </div>
                            </div>
                            <div class="box-item__content" :gutter="20">
                                <div class="img" style="margin: 0; padding: 5px 10px; background-color: #f6f5f8; border-radius: 5px;">
                                    <img src="@/assets/img/koji_01.png" style="width: 130px;">
                                </div>
                                <div class="right">
                                    <ul>
                                        <li class="lines">
                                            <span>生产订单：</span>
                                            <el-select v-model="querySecondResultList[secondObjIndex].orderNoTemp" filterable size="mini" style="flex: 1;" @change="val=>changeSecondOrder(val)">
                                                <el-option v-for="(subItems) in querySecondResultList" :key="subItems.id" :value="subItems.orderNo" :label="subItems.orderNo" />
                                            </el-select>
                                        </li>
                                        <li class="lines">
                                            <span>
                                                生产物料：
                                            </span>
                                            <el-tooltip class="item" effect="dark" :content="`${querySecondResultList[secondObjIndex].materialName} ${querySecondResultList[secondObjIndex].materialCode}`" placement="bottom-start">
                                                <span>
                                                    {{ querySecondResultList[secondObjIndex].materialName }} {{ querySecondResultList[secondObjIndex].materialCode }}
                                                </span>
                                            </el-tooltip>
                                        </li>
                                        <li class="lines">
                                            <span>订单产量：</span><span>{{ querySecondResultList[secondObjIndex].planOutput }} {{ querySecondResultList[secondObjIndex].outputUnit }}</span>
                                        </li>
                                        <li class="lines">
                                            <span>实际产量：</span><span>{{ querySecondResultList[secondObjIndex].realOutput }}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="box-item__footer">
                                <el-tooltip
                                    class="item"
                                    effect="dark"
                                    :content="orderStatusMapping[querySecondResultList[secondObjIndex].houseTag.washBeanCraft]"
                                    placement="top-start"
                                >
                                    <el-button class="bottom-item" @click="goDetail('second',1, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:inStorage:list')" class="bottom-item" @click="goDetail('first',1, item)"> -->
                                        洗豆
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip class="item" effect="dark" :content="orderStatusMapping[querySecondResultList[secondObjIndex].houseTag.steamBeanCraft]" placement="top-start">
                                    <el-button class="bottom-item" @click="goDetail('second',2, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:workshop:techProductParameterList')" class="bottom-item" @click="goDetail('first',2, item)"> -->
                                        蒸豆
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { COMMON_API, KOJI_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component({
        name: 'OrderSplit',
        components: {
        }
    })
    export default class OrderSplit extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        $refs: {
            queryTable: HTMLFormElement;
        };

        secondObjIndex=0 // 蒸豆 index

        orderStatusMapping={} // 状态中文与简写对照
        orderSplitRow = {};
        queryFirstResultList: KojiFirstObj[] = [];
        querySecondResultList: KojiSecondObj[] = [];
        rules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ];

        queryFormData = [
            {
                type: 'select',
                label: '生产车间',
                prop: 'workShop',
                labelWidth: 90,
                rule: [
                    { required: true, message: '请选择车间', trigger: 'change' }
                ],
                defaultOptionsFn: () => {
                    return COMMON_API.ORG_QUERY_WORKSHOP_API({
                        factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                        deptType: ['WORK_SHOP'],
                        deptName: '制曲'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'date-picker',
                label: '生产日期',
                labelWidth: 90,
                prop: 'orderStartDate',
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd')
            },
            {
                type: 'input',
                label: '生产订单',
                labelWidth: 90,
                prop: 'orderNo'
            }
        ];

        mounted() {
            // 订单审核状态对照 mapping
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
                this.orderStatusMapping = {}
                data.data.forEach(item => {
                    this.orderStatusMapping[item.dictCode] = item.dictValue
                })
            });
        }


        // 查询请求
        listInterface(params) {

            const paramsTemp = {
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                orderNo: params.orderNo,
                workShop: params.workShop,
                orderStartDate: params.orderStartDate
            }
            // 针对查找必填关键字进行提示
            if ((params.orderStartDate === '' || !params.orderStartDate) && params.orderNo === '') {
                this.$warningToast('日期或订单请选填一项');// eslint-disable-line
                return new Promise((resolve, reject) => {
                    reject('error') // eslint-disable-line
                });
            }
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;

            // 呼叫蒸豆
            KOJI_API.KOJI_INDEX_QUERY_SC_ORDER_API(
                    paramsTemp
                ).then(({ data }) => {
                    console.log('蒸豆')
                    console.log(data)
                if (data.data.length !== 0) {
                    this.querySecondResultList = data.data;
                    console.log('this.querySecondResultList')
                    console.log(this.querySecondResultList)
                    this.querySecondResultList.forEach(item => {
                        this.$set(item, 'orderNoTemp', item.orderNo)
                    })
                } else {
                    this.querySecondResultList = [];
                    // this.$infoToast('蒸豆暂无任何内容');
                }

            })
            return KOJI_API.KOJI_INDEX_QUERY_ORDER_API(paramsTemp);
        }

        changeFirstOrder(val, item) {
            item.houseSplitList.forEach((sunItem, subIndex) => {
                if (sunItem.orderNo === val) {
                    item.nowIndex = subIndex
                    sunItem.orderNoTemp = val
                }
            })
        }

        changeSecondOrder(val) {
            this.querySecondResultList.forEach((sunItem, subIndex) => {
                if (sunItem.orderNo === val) {
                    this.secondObjIndex = subIndex
                    sunItem.orderNoTemp = val
                }
            })
        }

        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.productDate !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        setData(data) {
            if (data.data.length !== 0) {
                this.queryFirstResultList = data.data;
                this.queryFirstResultList.forEach(item => {
                    this.$set(item, 'nowIndex', 0)
                    item.houseSplitList.forEach(subItem => {
                        this.$set(subItem, 'statusName', this.orderStatusMapping[subItem.status])
                        this.$set(subItem, 'orderNoTemp', subItem.orderNo)
                    })
                })
            } else {
                this.queryFirstResultList = [];
                this.$infoToast('暂无任何内容');
            }
        }

        goDetail(who, num, item) {
            let url = '';
            // 曲房工序跳转
            if (who === 'first') {
                this.$store.commit('koji/updateOrderKojiInfo', item);

                switch (num) {
                    case 1:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-WashBean';
                        break;
                    case 2:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SteamedFlour';
                        break;
                    case 3:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-disc';
                        break;
                    default:
                }

                this.$store.commit(
                    'common/updateMainTabs',
                    this.$store.state.common.mainTabs.filter(subItem => subItem.name !== url)
                );

            }
            // 蒸豆工序跳转
            if (who === 'second') {
                this.$store.commit('koji/updateOrderScInfo', item);
                switch (num) {
                    case 1:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SCWashBean';
                        break;
                    case 2:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SCSteamBean';
                        break;
                    default:
                }

                this.$store.commit(
                    'common/updateMainTabs',
                    this.$store.state.common.mainTabs.filter(subItem => subItem.name !== url)
                );

            }

            setTimeout(() => {
                this.$router.push({
                    name: url
                });
            }, 100);

        }
    }

    interface KojiFirstObj {
        kojiHouseId: string;
        kojiHouseNo: string;
        nowIndex: number;
        houseSplitList: KojiFirstInfoObj[];
    }

    interface KojiFirstInfoObj{
        orderNoTemp: string;
        statusName: string;
        addKojiDate: string;
        changed: string;
        changer: string;
        fermentPotId: string;
        fermentPotNo: string;
        id: string;
        kojiDuration: string;
        kojiEndTime: string;
        kojiHouseId: string;
        kojiHouseNo: string;
        kojiOrderNo: string;
        kojiStartTime: string;
        materialCode: string;
        materialName: string;
        houseTag: KojiFirstObjHouseTag;
        orderId: string;
        orderNo: string;
        orderType: string;
        outKojiDate: string;
        outputUnit: string;
        outputUnitName: string;
        planOutput: number;
        productDate: string;
        status: string;
        workShop: string;
        workShopName: string;
    }

    interface KojiFirstObjHouseTag{
        id: string;
        orderNo: string;
        kojiOrderNo: string;
        washBeanMaterail: string;
        washBeanCraft: string;
        steamFlourMaterial: string;
        steamFlourCraft: string;
        steamBeanInStorage: string;
        steamBeanCraft: string;
        discInStorage: string;
        discCraft: string;
        changed: string;
        changer: string;
    }

    interface KojiSecondObj {
        orderNoTemp: string;
        changed: string;
        changer: string;
        countMan: number;
        countOutput: number;
        countOutputUnit: string;
        deviceTime: number;
        dispatchMan: string;
        exceptionDateCount: number;
        factory: string;
        factoryName: string;
        germs: number;
        houseTag: KojiSecondObjHouseTag;
        id: string;
        materialCode: string;
        materialName: string;
        operator: string;
        operatorDate: string;
        orderEndDate: string;
        orderNo: string;
        orderStartDate: string;
        orderStatus: string;
        orderStatusName: string;
        orderType: string;
        outputUnit: string;
        outputUnitName: string;
        planOutput: number;
        productDate: string;
        productLine: string;
        productLineName: string;
        readyTime: number;
        realInAmount: number;
        realOutput: number;
        userTime: number;
        workShop: string;
        workShopName: string;
    }

    interface KojiSecondObjHouseTag {
        changed: string;
        changer: string;
        discCraft: string;
        discInStorage: string;
        id: string;
        kojiOrderNo: string;
        orderNo: string;
        steamBeanCraft: string;
        steamBeanInStorage: string;
        steamFlourCraft: string;
        steamFlourMaterial: string;
        washBeanCraft: string;
        washBeanMaterail: string;
    }

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
        margin-bottom: 10px;
        .img {
            padding: 5px 10px;
            background-color: #f6f5f8;
            border-radius: 5px;
        }
        .right {
            width: 100%;
            .lines {
                display: flex;
                flex-direction: row;
                height: 32px;
                margin-bottom: 15px;
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
