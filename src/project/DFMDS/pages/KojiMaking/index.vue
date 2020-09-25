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
                <el-row class="potList" :gutter="10" style="min-height: 150px; margin-top: 5px;">
                    <el-col v-for="(item, index) in queryFirstResultList" :key="index" :span="8">
                        <div class="box-item">
                            <div class="box-item__top">
                                <div><i class="title-icon" />{{ item.kojiHouseNo }}</div>
                                <div class="status">
                                    <span
                                        class="points"
                                        :style="{
                                            'margin-top': '8px',
                                            background: item.status === 'noPass' ? 'red' : item.status === 'checked' ? '#67C23A' : item.status === 'submit' ? '#1890ff' : item.status === 'saved' ? '#1890ff' : '#7ED321',
                                        }"
                                    />
                                    &nbsp;曲房状态：
                                    <!-- <em
                                        :style="{
                                            color: item.status === 'noPass' ? 'red' : item.status === 'checked' ? '#67C23A' : '',
                                        }"
                                    >{{ item.status === 'submit' ? '已提交' : item.status === 'checked' ? '审核通过' : item.status === 'noPass' ? '审核不通过' : item.status === 'saved' ? '已保存' : item.status === '已同步' ? '未录入' : item.status }}</em> -->
                                    <em
                                        :style="{
                                            color: item.status === 'R' ? 'red' : item.status === 'C' ? '#67C23A' : '',
                                        }"
                                    >{{ orderStatusMapping[item.status] }}</em>
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
                                            <!-- <el-select v-model="item.orderNo" filterable size="mini" style="flex: 1;" @change="changeOrder($event, item)">
                                                <el-option v-for="(subItems, subIndex) in item.orderList" :key="subIndex" :value="subItems.orderNo" :label="subItems.orderNo" />
                                            </el-select> -->

                                            <span>
                                                {{ item.orderNo }}
                                            </span>
                                        </li>
                                        <li class="lines">
                                            <span>
                                                生产物料：
                                            </span>
                                            <el-tooltip class="item" effect="dark" :content="item.materialName + item.materialCode" placement="bottom-start">
                                                <span>
                                                    {{ item.materialName }}{{ item.materialCode }}
                                                </span>
                                            </el-tooltip>
                                        </li>
                                        <li class="lines">
                                            <span>制曲时长：</span><span>{{ item.kojiDuration }} H</span>
                                        </li>
                                        <li class="lines">
                                            <span>入曲时间：</span><span>{{ item.kojiStartTime }}</span>
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
                                    <el-button class="bottom-item" @click="goDetail('first',1, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:inStorage:list')" class="bottom-item" @click="goDetail('first',1, item)"> -->
                                        洗豆
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip class="item" effect="dark" :content="item.craftDataStatus" placement="top-start">
                                    <el-button class="bottom-item" @click="goDetail('first',2, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:workshop:techProductParameterList')" class="bottom-item" @click="goDetail('first',2, item)"> -->
                                        蒸面
                                    </el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" :content="item.qualityStatus" placement="top-start">
                                    <el-button class="bottom-item" @click="goDetail('first',3, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:workshop:qualityInspectionList')" class="bottom-item" @click="goDetail('first',3, item)"> -->
                                        圆盘
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                    </el-col>
                    <el-col v-for="(item, index) in querySecondResultList" :key="index" :span="8">
                        <div class="box-item">
                            <div class="box-item__top">
                                <div><i class="title-icon" />{{ item.kojiHouseNo }}</div>
                                <div class="status">
                                    <span
                                        class="points"
                                        :style="{
                                            'margin-top': '8px',
                                            background: item.status === 'noPass' ? 'red' : item.status === 'checked' ? '#67C23A' : item.status === 'submit' ? '#1890ff' : item.status === 'saved' ? '#1890ff' : '#7ED321',
                                        }"
                                    />
                                    &nbsp;曲房状态：
                                    <!-- <em
                                        :style="{
                                            color: item.status === 'noPass' ? 'red' : item.status === 'checked' ? '#67C23A' : '',
                                        }"
                                    >{{ item.status === 'submit' ? '已提交' : item.status === 'checked' ? '审核通过' : item.status === 'noPass' ? '审核不通过' : item.status === 'saved' ? '已保存' : item.status === '已同步' ? '未录入' : item.status }}</em> -->
                                    <em
                                        :style="{
                                            color: item.status === 'R' ? 'red' : item.status === 'C' ? '#67C23A' : '',
                                        }"
                                    >{{ orderStatusMapping[item.status] }}</em>
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
                                            <!-- <el-select v-model="item.orderNo" filterable size="mini" style="flex: 1;" @change="changeOrder($event, item)">
                                                <el-option v-for="(subItems, subIndex) in item.orderList" :key="subIndex" :value="subItems.orderNo" :label="subItems.orderNo" />
                                            </el-select> -->

                                            <span>
                                                {{ item.orderNo }}
                                            </span>
                                        </li>
                                        <li class="lines">
                                            <span>
                                                生产物料：
                                            </span>
                                            <el-tooltip class="item" effect="dark" :content="item.materialName + item.materialCode" placement="bottom-start">
                                                <span>
                                                    {{ item.materialName }}{{ item.materialCode }}
                                                </span>
                                            </el-tooltip>
                                        </li>
                                        <li class="lines">
                                            <span>制曲时长：</span><span>{{ item.kojiDuration }} H</span>
                                        </li>
                                        <li class="lines">
                                            <span>入曲时间：</span><span>{{ item.kojiStartTime }}</span>
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
                                    <el-button class="bottom-item" @click="goDetail('second',1, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:inStorage:list')" class="bottom-item" @click="goDetail('second',1, item)"> -->
                                        洗豆
                                    </el-button>
                                </el-tooltip>

                                <el-tooltip class="item" effect="dark" :content="item.craftDataStatus" placement="top-start">
                                    <el-button class="bottom-item" @click="goDetail('second',2, item)">
                                        <!-- <el-button :disabled="!isAuth('bottle:workshop:techProductParameterList')" class="bottom-item" @click="goDetail('second',2, item)"> -->
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
    // import OrderSplitDialog from '../common/OrderSplitDialog.vue'
    // import OrderSplitDetailDialog from '../common/OrderSplitDetailDialog.vue'

    @Component({
        name: 'OrderSplit',
        components: {
            // OrderSplitDialog,
            // OrderSplitDetailDialog
        }
    })
    export default class OrderSplit extends Vue {
        get mainClientHeight() {
            return this.$store.state.common.mainClientHeight;
        }

        $refs: {
            queryTable: HTMLFormElement;
            orderSplitDialog: HTMLFormElement;
            orderSplitDetailDialog: HTMLFormElement;
        };

        currPage = 1;
        pageSize = 10;
        totalCount = 0;
        dialogFormVisible1 = false;
        dialogFormVisible2 = false;

        splitForm = {
            current: 1,
            size: 10,
            total: 0,
            orderNo: '',
            potNo: ''
        };

        orderStatusMapping={}
        orderSplitRow = {};
        holder = [];
        queryFirstResultList: KojiFirstObj[] = [];
        querySecondResultList: KojiSecondObj[] = [];
        splitTable: KojiFirstObj[] = [];
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
            },
            {
                type: 'select',
                label: '状态',
                prop: 'OrgOrderStatus',
                defaultOptionsFn: () => {
                    return COMMON_API.DICTQUERY_API({
                        dictType: 'COMMON_CHECK_STATUS'
                    })
                },
                defaultValue: '',
                resVal: {
                    resData: 'data',
                    label: ['dictValue'],
                    value: 'dictCode'
                }
            }
        ];

        mounted() {
            // 订单状态 mapping
            COMMON_API.DICTQUERY_API({ dictType: 'COMMON_CHECK_STATUS' }).then(({ data }) => {
                this.orderStatusMapping = {}
                data.data.forEach(item => {
                    this.orderStatusMapping[item.dictCode] = item.dictValue
                })
            });
        }


        // 查询请求
        listInterface(params) {

            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;

            // return new Promise((resolve) => {
            //             KOJI_API.KOJI_INDEX_QUERY_ORDER_API({
            //                 params
            //             }).then((data) => {

            //                     resolve(data)
            //             })
            //         })
            return KOJI_API.KOJI_INDEX_QUERY_ORDER_API(params);
        }

        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '' && this.$refs.queryTable.queryForm.productDate !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        getData() {
            this.$refs.queryTable.getDataList();
            this.showSplitTable(this.orderSplitRow);
        }

        setData(data) {
            console.log('data')
            console.log(data)
            if (data.data.length !== 0) {
                this.queryFirstResultList = data.data;
                this.queryFirstResultList.forEach(item => {
                    item.statusName = this.orderStatusMapping[item.status]
                })

            } else {
                this.queryFirstResultList = [];
                this.$infoToast('暂无任何内容');
            }
            this.splitTable = [];
        }

        getHolder(params) {
            COMMON_API.HOLDER_QUERY_API({
                deptId: params.workShop,
                holderType: '014',
                size: 99999,
                current: 1
            }).then(({ data }) => {
                this.holder = data.data.records
            })
        }

        // 表格双击
        showSplitTable(row) {
            this.splitForm.orderNo = row.orderNo;
            this.getHolder(row)
            this.getSplitTable()
        }

        // 获取拆分表格
        getSplitTable() {
            if (!this.splitForm.orderNo) {
                this.$warningToast('请双击订单后操作')
                return false
            }
            // KOJI_API.STE_SPLIT_LIST_API(this.splitForm).then(({ data }) => {
            //     if (!data.data.records.length) {
            //         this.$infoToast('暂无任何内容');
            //     }
            //     this.splitTable = data.data.records
            //     this.splitForm.current = data.data.current;
            //     this.splitForm.size = data.data.size;
            //     this.splitForm.total = data.data.total;
            // })
        }

        // 拆分
        orderSplit(row) {
            this.orderSplitRow = row;
            this.dialogFormVisible1 = true;
            this.$nextTick(() => {
                this.$refs.orderSplitDialog.init(row);
            });
        }

        // 拆分详情
        orderSplitDetail(row) {
            this.dialogFormVisible2 = true;
            this.$nextTick(() => {
                this.$refs.orderSplitDetailDialog.init(row);
            });
        }

        // 删除订单
        delSplitRow(row) {
            this.$confirm('是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                KOJI_API.ORDER_SPLITE_SAVE_API({
                    deletes: [row.id]
                }).then(({ data }) => {
                    this.$successToast(data.msg);
                    this.getSplitTable();
                })
            });
        }

        goDetail(who, num, item) {
            let url;
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

            if (who === 'second') {
                this.$store.commit('koji/updateOrderScInfo', item);
                switch (num) {
                    case 1:
                        url = 'DFMDS-pages-KojiMaking-WorkingProcedure-SCWashBean';
                        break;
                    case 2:
                        url = 'DFMD-page-KojiMakin-WorkingProcedur-SCSteamBean';
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

    interface HouseTag {
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

    interface KojiFirstObj {
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

    interface KojiSecondObj {
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
        houseTag: HouseTag;
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
