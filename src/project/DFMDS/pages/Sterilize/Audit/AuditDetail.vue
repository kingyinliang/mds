<template>
    <div>
        <data-entry
            ref="dataEntry"
            type="audit"
            :header-base="headerBase"
            :form-header="formHeader"
            :order-status="formHeader.orderStatusName"
        >
            <template slot="contentBox">
                <mds-card title="产量与人力" :name="'outputworker'">
                    <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                        <el-form-item label="订单产量：">
                            <p>{{ yieldAndManData.planOutput }} {{ yieldAndManData.unitName }}</p>
                        </el-form-item>
                        <el-form-item label="实际产量：">
                            <p>{{ yieldAndManData.actualOutput }} {{ yieldAndManData.unitName }}</p>
                        </el-form-item>
                        <el-form-item label="差异数量：">
                            <p>{{ yieldAndManData.diffNumber }} {{ yieldAndManData.unitName }}</p>
                        </el-form-item>
                        <el-form-item label="作业人力：">
                            <p>{{ yieldAndManData.manNumber }}</p>
                        </el-form-item>
                        <el-form-item label="计划锅数：">
                            <p>{{ yieldAndManData.potNumber }}</p>
                        </el-form-item>
                        <el-form-item label="生产锅数：">
                            <p>{{ yieldAndManData.productionPotNumber }}</p>
                        </el-form-item>
                    </el-form>
                </mds-card>
                <mds-card title="工艺-保温温度" :name="'CraftTemp'">
                    <template slot="titleBtn">
                        <el-form :inline="true" size="small" class="dataEntry-head-base__form" style="float: right; margin-top: 0;">
                            <el-form-item label="异常数：">
                                <p>134</p>
                            </el-form-item>
                        </el-form>
                    </template>
                    <div class="mod-demo-echarts">
                        <el-card>
                            <div id="J_chartLineBoxTemp" style="height: 400px;" />
                        </el-card>
                    </div>
                </mds-card>
                <mds-card title="工艺-保温时间" :name="'CraftTime'">
                    <template slot="titleBtn">
                        <el-form :inline="true" size="small" class="dataEntry-head-base__form" style="float: right; margin-top: 0;">
                            <el-form-item label="异常数：">
                                <p>134</p>
                            </el-form-item>
                        </el-form>
                    </template>
                    <div class="mod-demo-echarts">
                        <el-card>
                            <div id="J_chartLineBoxTime" style="height: 400px;" />
                        </el-card>
                    </div>
                </mds-card>
                <mds-card title="工艺-出料时间与温度" :name="'CraftTimeAndTemp'">
                    <el-row :gutter="10">
                        <el-col>
                            <div class="mod-demo-echarts">
                                <el-card>
                                    <div id="J_chartLineBoxTimeAndTemp" style="height: 400px;" />
                                </el-card>
                            </div>
                        </el-col>
                    </el-row>
                </mds-card>
                <mds-card title="异常情况" :name="'AbnormalCondition'">
                    <el-table class="newTable" :data="exceptionList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed min-width="80" />
                        <el-table-column prop="classes" label="生产锅号" min-width="90" />
                        <el-table-column prop="potNo" label="锅序" min-width="80" />
                        <el-table-column prop="potOrderNo" label="锅单号" min-width="140" />
                        <el-table-column prop="exceptionStage" label="阶段" min-width="80" />
                        <el-table-column prop="className" label="班次" min-width="60" />
                        <el-table-column prop="exceptionSituationName" label="异常情况" min-width="80" />
                        <el-table-column prop="exceptionReasonName" label="异常原因" min-width="120" />
                        <el-table-column prop="exceptionInfo" label="异常描述" min-width="120" />
                        <el-table-column prop="duration" label="时长" min-width="60" />
                        <el-table-column prop="durationUnit" label="单位" min-width="60" />
                    </el-table>
                    <el-row class="solerow">
                        <div>
                            总异常时间：
                        </div>
                        <div class="input_bottom">
                            {{ excTimeTotal }} H
                        </div>
                    </el-row>
                </mds-card>
                <mds-card title="物料领用" :name="'MaterialRecevie'">
                    <el-table class="newTable" :data="materialRecevieList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column label="领用物料" show-overflow-tooltip min-width="170">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode }} {{ scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="unit" label="单位" min-width="35" />
                        <el-table-column prop="useAmount" label="领用数量" min-width="50" />
                        <el-table-column prop="batch" label="领用批次" min-width="50" />
                        <el-table-column prop="holderName" label="发酵罐/池" min-width="40" />
                    </el-table>
                </mds-card>
            </template>
            <template slot="custom_btn">
                <el-button v-if="isAuth('steCkRefuse')" type="primary" size="small" @click="goDetail">
                    详情
                </el-button>
                <el-button type="primary" size="small" @click="pass()">
                    审核通过
                </el-button>
            </template>
        </data-entry>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    import { accAdd } from 'utils/utils';
    import { STE_API, COMMON_API } from 'common/api/api';
    import echarts from 'echarts';

    @Component({
        name: 'AuditDetail'
    })
    export default class AuditDetail extends Vue {
        $refs: {
            dataEntry: HTMLFormElement;
        };

        headerBase = [
            {
                type: 'p',
                icon: 'factory-shengchanchejian',
                label: '生产车间',
                value: 'workShopName'
            },
            {
                type: 'tooltip',
                icon: 'factory-pinleiguanli',
                label: '生产物料',
                value: ['materialCode', 'materialName']
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产订单',
                value: 'orderNo'
            },
            {
                type: 'p',
                icon: 'factory--meirijihuachanliangpeizhi',
                label: '订单产量',
                value: ['planOutput', 'outputUnit']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
            },
            {
                type: 'date-picker',
                icon: 'factory-bianhao',
                label: '生产锅数',
                value: 'productDate'
            },
            {
                type: 'p',
                icon: 'factory-xianchangrenyuan',
                label: '提交人员', // 操作人员
                value: 'changer'
            },
            {
                type: 'tooltip',
                icon: 'factory-riqi',
                label: '提交时间', // 操作时间
                value: 'changed'
            }
        ];

        auditDetail: {};
        formHeader: OrderData = {};
        orderStatus = '已同步';
        dataList = [];
        currentAudit = [];
        /* eslint-disable */
        chartLine: any;
        chartDiffBar: any;
        /* eslint-enable */
        proMaterialDiffList = [];
        prodPower = {};
        deviceRun = {
            exceptionInfo: []
        };
        // eslint-disable-next-line
        yieldAndManData = {}; // 产量与人力
        exceptionList: ExceptionList[] = []; // 异常情况
        materialRecevieList = []; // 物料领用
        classList: Dictionary[] = []; // 班次字典
        excCondition: Dictionary[] = []; // 异常情况数据字典
        excReasonTotal: ExcReasonTotal = { // 异常原因字典
            FAULTSHUTDOWN: [],
            POORPROCESSWAIT: [],
            ENERGY: []
        };

        mounted() {
            this.auditDetail = this.$store.state.sterilize.auditDetail;
            console.log(this.auditDetail);

            // 班次
            const net01 = new Promise(resolve => {
                this.getDictionary('COMMON_CLASSES', resolve);
            });
            // 异常情况
            const net02 = new Promise(resolve => {
                this.getDictionary('ABNORMAL_HALT', resolve);
            });
            // 异常原因
            const net03 = new Promise(resolve => {
                this.getDictionary('POOR_PROCESS_WAIT', resolve);
            });
            const net04 = new Promise(resolve => {
                this.getDictionary('ENERGY', resolve);
            });
            const net05 = new Promise(resolve => {
                this.getExcConitionList(this.auditDetail['workShop'], resolve);
            });
            this.getYieldAndMan(this.auditDetail['orderNo']);
            this.getMaterialList(this.auditDetail['orderNo']);
            Promise.all([net01, net02, net03, net04, net05]).then(() => {
                this.getException(this.auditDetail['orderNo']);
            }).catch((reason) => {
                this.$errorToast(reason);
            });

            this.chartLine = echarts.init(document.getElementById('J_chartLineBoxTemp'));
            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    // bottom: 'bottom',
                    bottom: 'bottom',
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                axisLabel: {
                    interval: 0,
                    rotate: 40
                },
                grid: {
                    top: '5%',
                    left: '1%',
                    right: '1%',
                    bottom: '8%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1#第一锅', '1#第二锅', '1#第三锅', '1#第四锅', '1#第五锅', '1#第六锅', '1#第七锅'],
                    axisLabel: { 'interval': 0, rotate: 30 }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };
            this.chartLine.setOption(option);
            window.addEventListener('resize', () => {
                this.chartLine.resize();
            });


            this.chartLine = echarts.init(document.getElementById('J_chartLineBoxTime'));
            const optionTime = {
                    color: ['#3398DB'],
                    grid: {
                        top: '5%',
                        left: '1%',
                        right: '1%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['1#第一锅', '1#第二锅', '1#第三锅', '1#第四锅', '1#第五锅', '1#第六锅', '1#第七锅'],
                            axisTick: {
                                alignWithLabel: true
                            },
                            axisLabel: { 'interval': 0, rotate: 30 }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: '直接访问',
                            type: 'bar',
                            barWidth: '10%',
                            itemStyle: {
                                //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                                emphasis: {
                                    barBorderRadius: 30
                                },
                                normal: {
                                    //柱形图圆角，初始化效果
                                    barBorderRadius: [10, 10, 10, 10],
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            },
                            data: [10, 52, 200, 334, 390, 330, 220]
                        }
                    ]
            };
            this.chartLine.setOption(optionTime);
            window.addEventListener('resize', () => {
                this.chartLine.resize();
            });


            this.chartLine = echarts.init(document.getElementById('J_chartLineBoxTimeAndTemp'));
            const optionTimeAndTemp = {
                color: ['#1890FF', '#F05C4A', '#999999'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross'
                    }
                },
                grid: {
                    top: '8%',
                    left: '1%',
                    right: '0%',
                    bottom: '8%',
                    containLabel: true
                },
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    // bottom: 'bottom',
                    bottom: 'bottom',
                    data: ['出料时间', '开始温度', '结束温度']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: { 'interval': 0, rotate: 30 },
                        data: ['1#第一锅', '1#第二锅', '1#第三锅', '1#第四锅', '1#第五锅', '1#第六锅', '1#第七锅', '1#第八锅']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '时间',
                        min: 0,
                        max: 25,
                        position: 'left'
                        // axisLine: {
                        //     lineStyle: {
                        //         color: colors[2]
                        //     }
                        // },
                        // axisLabel: {
                        //     formatter: '{value} °C'
                        // }
                    },
                    {
                        type: 'value',
                        name: '温度',
                        min: 0,
                        max: 250,
                        position: 'right',
                        axisLabel: {
                            formatter: '{value} ℃'
                        }
                    },
                    {
                        type: 'value',
                        name: '温度',
                        min: 0,
                        max: 250,
                        position: 'right'
                    }
                ],
                series: [
                    {
                        name: '出料时间',
                        type: 'bar',
                        barWidth: '10%',
                        itemStyle: {
                            //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
                            emphasis: {
                                barBorderRadius: 30
                            },
                            normal: {
                                //柱形图圆角，初始化效果
                                barBorderRadius: [10, 10, 10, 10],
                                label: {
                                    show: true, //是否展示
                                    textStyle: {
                                        fontWeight: 'bolder',
                                        fontSize: '12',
                                        fontFamily: '微软雅黑'
                                    }
                                }
                            }
                        },
                        data: [20, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                        name: '开始温度',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [26, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name: '结束温度',
                        type: 'line',
                        yAxisIndex: 2,
                        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                ]
            };

            this.chartLine.setOption(optionTimeAndTemp);
            window.addEventListener('resize', () => {
                this.chartLine.resize();
            });
        }

        get excTimeTotal() {
            let MinNum = 0;
            this.exceptionList.map((item: ExceptionList) => {
                MinNum = accAdd(MinNum, item.duration);
            });
            return (MinNum / 60).toFixed(2);
        }

        // 数据字典
        getDictionary(dictType, resolve) {
            COMMON_API.DICTQUERY_API({ dictType: dictType }).then(({ data }) => {
                if (dictType === 'COMMON_CLASSES') {
                    this.classList = data.data
                } else if (dictType === 'ABNORMAL_HALT') {
                    this.excCondition = data.data
                } else if (dictType === 'POOR_PROCESS_WAIT') {
                    this.excReasonTotal.POORPROCESSWAIT = data.data
                } else if (dictType === 'ENERGY') {
                    this.excReasonTotal.ENERGY = data.data
                }
                if (resolve) {
                    resolve('resolve');
                }
            });
        }

        // 异常原因第三种情况
        getExcConitionList(workShop, resolve) {
            COMMON_API.DEVICE_LISTBYTYPE_API({ deptId: workShop }).then(({ data }) => {
                data.data.map(item => {
                    this.excReasonTotal.FAULTSHUTDOWN.push({
                        dictValue: item.deviceName,
                        dictCode: item.deviceNo
                    })
                })
                if (resolve) {
                    resolve('resolve');
                }
            })
        }

        // 产量与人力
        getYieldAndMan(orderNo) {
            STE_API.STE_AUDIT_YIELD_MANQUERY_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.yieldAndManData = data.data
            })
        }

        // 异常情况
        getException(orderNo) {
            STE_API.STE_AUDIT_EXCEPTION_QUERY_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.exceptionList = data.data
                this.exceptionList.map((item) => {
                    const classSole: (Dictionary | undefined) = this.classList.find((it: Dictionary) => it.dictCode === item.classes);
                    if (classSole) {
                        item.className = classSole['dictValue'];
                    }
                    // 异常情况
                    const exceptionSituationSole = this.excCondition.find((it: Dictionary) => it.dictCode === item.exceptionSituation);
                    if (exceptionSituationSole) {
                        item.exceptionSituationName = exceptionSituationSole['dictValue'];
                    }
                    // 异常原因 exceptionReason
                    let excReasonList: Dictionary[] = [];
                    if (item.exceptionSituation === 'FAULT' || item.exceptionSituation === 'SHUTDOWN') {
                        excReasonList = this.excReasonTotal.FAULTSHUTDOWN
                    } else if (item.exceptionSituation === 'POOR_PROCESS' || item.exceptionSituation === 'WAIT') {
                        excReasonList = this.excReasonTotal.POORPROCESSWAIT
                    } else if (item.exceptionSituation === 'ENERGY') {
                        excReasonList = this.excReasonTotal.ENERGY
                    }
                    const exceptionReasonSole = excReasonList.find((it: Dictionary) => it.dictCode === item.exceptionReason);
                    if (exceptionReasonSole) {
                        item.exceptionReasonName = exceptionReasonSole['dictValue'];
                    }
                })
            })
        }

        // 物料领用
        getMaterialList(orderNo) {
            STE_API.STE_AUDIT_MATERIAL_QUERY_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.materialRecevieList = data.data
            })
        }

        goDetail() {
            this.$store.commit('sterilize/updateAuditDetailDetail', this.$store.state.sterilize.auditDetail);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Audit-'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-Sterilize-Audit-detail`
                });
            }, 100);
        }

        pass() {
            this.$confirm('确认通过该订单, 是否继续?', '审核通过', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // PKG_API.PKG_AUDIT_DETAIL_PASS_API({
                //     factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                //     materialCode: this.formHeader.materialCode,
                //     orderId: this.formHeader.id,
                //     orderNo: this.formHeader.orderNo,
                //     orderType: this.formHeader.orderType,
                //     productDate: this.formHeader.productDate,
                //     productLine: this.formHeader.productLine,
                //     workShop: this.formHeader.workShop
                // }).then(() => {
                //     this.$successToast('操作成功');
                //     // this.getOrderList();
                // })
            })
        }

    }

    interface OrderData{
        factoryName?: string;
        changed?: string;
        countMan?: number;
        countOutput?: number;
        countOutputUnit?: string;
        dispatchMan?: string;
        exceptionDateCount?: number;
        factory?: string;
        factoryCode?: string;
        germs?: number;
        id?: string;
        materialCode?: string;
        materialName?: string;
        operator?: string;
        operatorDate?: string;
        orderEndDate?: string;
        orderId?: string;
        orderNo?: string;
        orderStartDate?: string;
        orderStatus?: string;
        orderType?: string;
        outputUnit?: string;
        planOutput?: number;
        productDate?: string;
        productLine?: string;
        productLineName?: string;
        realInAmount?: number;
        realOutput?: number;
        version?: number;
        workShop?: string;
        workShopName?: string;
    }
    interface Dictionary {
        dictCode?: string;
        dictId?: string;
        dictValue?: string;
        factoryName?: string;
        id?: string;
    }
    interface ExceptionList {
        classes?: string;
        className?: string | undefined;
        exceptionSituationName?: string | undefined;
        duration?: number;
        durationUnit?: string;
        exceptionInfo?: string;
        exceptionReason?: string;
        exceptionReasonName?: string | undefined;
        exceptionSituation?: string;
        exceptionStage?: string;
        potNo?: string;
        potOrder?: string;
        potOrderNo?: string;
    }
    interface ExcReasonTotal {
        FAULTSHUTDOWN: object[];
        POORPROCESSWAIT: object[];
        ENERGY: object[];
    }
</script>

<style scoped>

</style>
