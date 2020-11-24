<template>
    <div class="header_main saltWater">
        <query-table
            ref="queryTable"
            query-auth="steDisQuery"
            :type="'home'"
            :rules="queryTableFormRules"
            :query-form-data="queryTableFormData"
            :list-interface="queryTableListInterface"
            :custom-data="true"
            @get-data-success="returnDataFromQueryTableForm"
            @created-end="createdEnd"
        >
            <template slot="home">
                <mds-card title="发酵罐列表" :pack-up="false">
                    <template slot="titleBtn">
                        <el-button type="text" size="small" style="float: right; margin-top: 8px;">
                            发酵罐一览表>>
                        </el-button>
                    </template>
                    <template>
                        <div class="pots">
                            <div v-for="(item) in targetQueryTableList" :key="item.id" class="potbox">
                                <div class="header">
                                    <span>{{ item.holderNo + item.holderName + '-' + item.fermentorStatus }}</span>
                                    <el-button type="primary" size="mini" style="padding: 7px 6px;" @click="toDetailPage(item)">
                                        盐水发料
                                    </el-button>
                                </div>
                                <!-- <div class="con">
                                    <img src="../../../assets/img/ferPot.png" alt="">
                                </div> -->
                                <div class="bucket-image con">
                                    <div class="pot_border">
                                        <div class="pot" />
                                        <div class="pot_water">
                                            <div
                                                class="pot_water_sole"
                                                :style="{height: (item.currentStock / item.holderVolume * 100)+'%', background: '#AD592D', opacity: `${item.currentStock / item.holderVolume}` }"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div class="foot">
                                    <p>
                                        <span>{{ item.order.preMaterialCode + item.order.preMaterialName }}</span>
                                        <span>{{ item.fermentDays + '天' }}</span>
                                    </p>
                                    <p>
                                        <span>{{ item.order.orderNo }}</span>
                                        <span>{{ item.currentStock / 1000 + '吨' }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </template>
                </mds-card>
                <el-row>
                    <el-pagination :current-page="1" :page-sizes="[10, 20, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="10" @size-change="(val) => {'tabHandleSizeChange(tabItem.pages, val)'}" @current-change="(val) => {'tabHandleCurrentChange(tabItem.pages, val)'}" />
                </el-row>
            </template>
        </query-table>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { dateFormat, getUserNameNumber } from 'utils/utils';
    // import ImportBucket from './ImportBucket.vue';
    import { COMMON_API, FER_API } from 'common/api/api';
    import { dateFormat } from 'utils/utils';

    @Component({
        name: 'SaltWater',
        components: {

        }
    })
    export default class SaltWater extends Vue {
        $refs: {
            queryTable: HTMLFormElement;
        }

        targetQueryTableList: SaltWaterObj[] = []

        // queryTable 必要变数
        queryTableFormData = [
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
                        deptName: '发酵'
                    })
                },
                resVal: {
                    resData: 'data',
                    label: ['deptName'],
                    value: 'id'
                }
            },
            {
                type: 'select',
                label: '发酵罐/池',
                prop: 'holderId',
                labelWidth: 90,
                filterable: true,
                rule: [{ required: false, message: ' ', trigger: 'change' }],
                defaultValue: '',
                defaultOptionsFn: () => {
                    return new Promise((resolve) => {
                        COMMON_API.HOLDER_QUERY_API({ // /sysHolder/query
                            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                            current: 1,
                            size: 9999,
                            holderType: '001' // 发酵罐参数编码
                        }).then((res) => {
                            // eslint-disable-next-line no-invalid-this
                            // this.setEnvVal(val)
                            resolve(res)
                        })
                    })
                },
                resVal: {
                    resData: 'data.records',
                    label: ['holderName'],
                    value: 'id'
                }
            },
            {
                type: 'date-interval',
                label: '投料日期',
                labelWidth: 90,
                valueFormat: 'yyyy-MM-dd',
                defaultValue: dateFormat(new Date(), 'yyyy-MM-dd'),
                prop: 'startIntoDate',
                propTwo: 'endIntoDate'
            }
        ]

        queryTableFormRules = [
            {
                prop: 'workShop',
                text: '请选择生产车间'
            }
        ]

        createdEnd() {
            this.$nextTick(() => {
                if (this.$refs.queryTable.queryForm.workShop !== '') {
                    this.$refs.queryTable.getDataList(true)
                }
            })
        }

        // queryTable 查询请求
        queryTableListInterface = params => {
            console.log('搜寻传值')
            console.log(params)
            params.factory = JSON.parse(sessionStorage.getItem('factory') || '{}').id;
            params.current = params.currPage;
            params.size = params.pageSize;
            return FER_API.FER_BRINE_POT_LIST_API(params);
        };

        // queryTable 回传 result
        returnDataFromQueryTableForm(data) {
            console.log('查询结果回传')
            console.log(data)
            this.targetQueryTableList = []
            if (data.data !== null) {
                // this.targetQueryTableList = data.data.records as SaltWaterObj[];
                this.targetQueryTableList = [
                    {
                        id: '1',
                        brineFlag: 'saved', // 盐水发料状态
                        brineFlagName: '发料中',
                        intoDate: '2020-10-10',
                        holderId: '22', // 容器id
                        holderNo: '333', //容器号
                        holderName: '容器名称', // 容器名称
                        fermentorStatus: '空罐', // 发酵罐状态
                        fermentDays: 10, // 发酵天数
                        currentStock: 10, // 当前库存量
                        holderVolume: 50, // 容器容量
                        changed: '2020-10-10',
                        changer: '张三',
                        order: {
                            id: '2',
                            orderNo: '订单号', // 订单号
                            preMaterialCode: 'A00', // 前置物料编码
                            preMaterialName: '前置物料', // 前置物料描述
                            preAmount: 28, // 前置订单数量
                            productMaterialCode: '身缠编码', // 生产物料编码
                            productMaterialName: '生产物料描述' // 生产物料描述
                        } // 订单
                    }
                ]
            } else {
                this.$infoToast('暂无任何内容');
            }
        }

        toDetailPage(row) {
            console.log(row);
            // this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-KojiMaking-Audit-AuditDetail'))
            this.$store.commit('fer/updateBrineInfo', row);
            // sessionStorage.setItem('brineInfo', JSON.stringify(row));
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Fermentation-SaltWater-SaltWaterDetail`
                });
            }, 100);
            // this.$router.push({
            //     name: `DFMDS-pages-Fermentation-SaltWater-SaltWaterDetail`
            // })
        }
    }
    interface SaltWaterObj {
        id: string;
        brineFlag: string; // 盐水发料状态
        brineFlagName: string; // 盐水发料状态名称
        intoDate: string; // 入罐日期
        holderId: string; // 容器id
        holderNo: string; //容器号
        holderName: string; // 容器名称
        fermentorStatus: string; // 发酵罐状态
        fermentDays: number; // 发酵天数
        currentStock: number; // 当前库存量
        holderVolume: number; // 容器容量
        changed: string; // 最后操作时间
        changer: string; // 最后操作人
        order: OrderType; // 订单
    }
    interface OrderType {
        id: string;
        orderNo: string; // 订单号
        preMaterialCode: string; // 前置物料编码
        preMaterialName: string; // 前置物料描述
        preAmount: number; // 前置订单数量
        productMaterialCode: string; // 生产物料编码
        productMaterialName: string; // 生产物料描述
    }
</script>

<style lang="scss" scoped>
    .header_main {
        .pots {
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            .potbox {
                box-sizing: border-box;
                width: 223px;
                // width: 16%;
                // height: 308px;
                // width: calc(20% - 20px);
                margin-right: 20px;
                margin-bottom: 20px;
                padding: 5px;
                background: #fff;
                border: 1px solid rgba(0, 0, 0, 0.09);
                border-radius: 8px;
                box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.09);
                opacity: 0.99;
                .header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 36px;
                    border-bottom: 1px solid #e8e8e8;
                    span {
                        color: #666;
                        font-size: 14px;
                    }
                }
                .con {
                    box-sizing: border-box;
                    width: 100%;
                    padding: 20px;
                    text-align: center;
                    img {
                        width: 60%;
                    }
                }
                .foot {
                    p {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 3px;
                        span {
                            color: #333;
                            font-weight: 500;
                            font-size: 12px;
                        }
                    }
                }
            }
        }
        .bucket-image {
            display: flex;
            flex: 2;
            justify-content: center;
            .pot_border {
                position: relative;
                width: 100%;
                height: 200px;
                overflow: hidden;
                .pot {
                    position: absolute;
                    top: 0;
                    z-index: 10;
                    width: 100%;
                    height: 200px;
                    // background: url(./assets/img/ferPotNew.png) no-repeat;
                    background: url("~@/assets/img/ferPotNew.png") no-repeat;
                    background-position: center;
                    background-size: contain;
                }
                .pot_water {
                    position: absolute;
                    bottom: 13px;
                    left: 36px;
                    width: 100px;
                    height: 178px;
                    &_sole {
                        position: absolute;
                        bottom: 0;
                        width: 100%;
                        overflow: hidden;
                        border-top: none;
                    }
                    &_sole::before,
                    &_sole::after {
                        position: absolute;
                        bottom: 100%;
                        left: 50%;
                        width: 300px;
                        height: 290px;
                        background-color: #fff;
                        border-radius: 55% 45%;
                        transform: translate(-50%, -70%) rotate(0);
                        content: "";
                    }
                    &_sole::after {
                        border-radius: 55% 45%;
                        transform: translate(70%, -50%) rotate(0);
                        opacity: 0.3;
                    }
                }
                &:hover {
                    .pot_water_sole::after {
                        animation: rotate 5s linear infinite;
                    }
                    .pot_water_sole::before {
                        animation: rotate 4.5s linear infinite;
                    }
                }

                @keyframes rotate {
                    0% {
                        transform: translate(-50%) rotateZ(0deg);
                    }
                    100% {
                        transform: translate(-50%) rotateZ(360deg);
                    }
                }
            }
        }
    }
</style>
