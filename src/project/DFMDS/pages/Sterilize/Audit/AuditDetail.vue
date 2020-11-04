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
                            <p>{{ yieldAndManData.planOutput }} {{ yieldAndManData.planOutputUnitName }}</p>
                        </el-form-item>
                        <el-form-item label="实际产量：">
                            <p>{{ yieldAndManData.actualOutput }} {{ yieldAndManData.actualOutputUnitName }}</p>
                        </el-form-item>
                        <el-form-item label="差异数量：">
                            <p>{{ yieldAndManData.diffNumber }} {{ yieldAndManData.actualOutputUnitName }}</p>
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
                                <p> {{ TempTotal }}</p>
                            </el-form-item>
                        </el-form>
                    </template>
                    <div class="mod-demo-echarts">
                        <div id="J_chartLineBoxTemp" style="height: 400px;" />
                    </div>
                </mds-card>
                <mds-card title="工艺-保温时间" :name="'CraftTime'">
                    <template slot="titleBtn">
                        <el-form :inline="true" size="small" class="dataEntry-head-base__form" style="float: right; margin-top: 0;">
                            <el-form-item label="异常数：">
                                <p>{{ TimeTotal }}</p>
                            </el-form-item>
                        </el-form>
                    </template>
                    <div class="mod-demo-echarts">
                        <div id="J_chartLineBoxTime" style="height: 400px;" />
                    </div>
                </mds-card>
                <mds-card title="工艺-出料时间与温度" :name="'CraftTimeAndTemp'">
                    <el-row :gutter="10">
                        <el-col>
                            <div class="mod-demo-echarts">
                                <div id="J_chartLineBoxTimeAndTemp" style="height: 400px;" />
                            </div>
                        </el-col>
                    </el-row>
                </mds-card>
                <mds-card title="异常情况" :name="'AbnormalCondition'">
                    <el-table class="newTable" :data="exceptionList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed min-width="80" />
                        <el-table-column prop="potNo" label="生产锅号" min-width="90" />
                        <el-table-column label="锅序" min-width="80">
                            <template slot-scope="scope">
                                第{{ scope.row.potOrder }}锅
                            </template>
                        </el-table-column>
                        <el-table-column prop="potOrderNo" label="锅单号" min-width="140" />
                        <el-table-column prop="exceptionStage" label="阶段" min-width="80" />
                        <el-table-column prop="className" label="班次" min-width="60" />
                        <el-table-column prop="exceptionSituationName" label="异常情况" min-width="80" />
                        <el-table-column prop="exceptionReason" label="异常原因" min-width="120" />
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
                                {{ scope.row.materialName }} {{ scope.row.materialCode }}
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
                <el-button v-if="formHeader.orderStatusName === '待审核'" type="primary" size="small" @click="pass()">
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
                value: ['materialName', 'materialCode']
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
                value: ['planOutput', 'outputUnitName']
            },
            {
                type: 'p',
                icon: 'factory-riqi1',
                label: '订单日期',
                value: 'orderStartDate'
            },
            {
                type: 'p',
                icon: 'factory-bianhao',
                label: '生产锅数',
                value: 'planPotCount'
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
        /* eslint-disable */
        chartLine: any;
        /* eslint-enable */
        // 产量与人力
        yieldAndManData = {};
        // 物料领用
        materialRecevieList = [];
        exceptionList: ExceptionList[] = [];
        // 班次字典
        classList: Dictionary[] = [];
        // 异常情况数据字典
        excCondition: Dictionary[] = [];
        // tempTimeData
        // 异常原因字典
        excReasonTotal: ExcReasonTotal = {
            FAULTSHUTDOWN: [],
            POORPROCESSWAIT: [],
            ENERGY: []
        };

        tempList = [];
        timeList = [];

        mounted() {
            this.auditDetail = this.$store.state.sterilize.auditDetail;
            console.log(this.auditDetail);
            this.getHeaderInfo(this.auditDetail['orderNo']);

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
                this.getException(this.auditDetail['orderNo'], this.auditDetail['workShop']);
            }).catch((reason) => {
                this.$errorToast(reason);
            });

            this.getCraftTemp(this.auditDetail['orderNo']);

            this.getCraftTime(this.auditDetail['orderNo']);

            this.getCraftTimeAndTemp(this.auditDetail['orderNo']);
        }

        get excTimeTotal() {
            let MinNum = 0;
            this.exceptionList.map((item: ExceptionList) => {
                MinNum = accAdd(MinNum, item.duration);
            });
            return (MinNum / 60).toFixed(2);
        }

        get TempTotal() {
            let MinNum = 0;
            this.tempList.map((item) => {
                MinNum = accAdd(MinNum, item['exceptionNumber']);
            });
            return MinNum;
        }

        get TimeTotal() {
            let MinNum = 0;
            this.timeList.map((item) => {
                MinNum = accAdd(MinNum, item['exceptionNumber']);
            });
            return MinNum;
        }

        getHeaderInfo(orderNo) {
            COMMON_API.OREDER_QUERY_BY_NO_API({ orderNo: orderNo, workShopType: 'sterilize' }).then(({ data }) => {
                this.formHeader = data.data;
            })
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

        // 工艺保温温度
        getCraftTemp(orderNo) {
            STE_API.STE_AUDIT_CRAFT_TEMPERATURE_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.tempList = data.data;
                const xAxisData: string[] = [];
                const legendData = ['保温开始', '保温10min', '保温15min', '保温20min', '二次保温', '保温30min'];
                const seriesData: object[] = [];
                const timeData: object[] = [];
                let num = 0
                let normalColor = '#1691FE'
                while (num < 6) {
                    switch (num) {
                        case 0: {
                            normalColor = '#1691FE';
                            break;
                        }
                        case 1: {
                            normalColor = '#EC5B4C';
                            break;
                        }
                        case 2: {
                            normalColor = '#69666A';
                            break;
                        }
                        case 3: {
                            normalColor = '#FFBF01';
                            break;
                        }
                        case 4: {
                            normalColor = '#1133A1';
                            break;
                        }
                        case 5: {
                            normalColor = '#31C25D';
                            break;
                        }
                        default: {
                            normalColor = '#1691FE'
                            break;
                        }
                    }
                    /* eslint-disable */
                    seriesData.push({
                        name: legendData[num],
                        type: 'line',
                        data: [],
                        markArea: {
                            silent: false,
                            itemStyle: {
                                color: '#B8C4F1'
                            },
                            data: [
                                [{
                                    name: '',
                                    yAxis: 0
                                }, {
                                    yAxis: 0
                                }]
                            ]
                        },
                        itemStyle: {
                                    normal: {
                                        color: normalColor, //折点颜色
                                        lineStyle: {
                                            color: normalColor //折线颜色
                                        }
                                    }
                                }
                    })
                    /* eslint-enable */
                    num++;
                }
                let i = 0;
                data.data.map(item => {
                    xAxisData.push(item.potName); // x轴
                    seriesData[0]['data'].push(item.start);
                    seriesData[1]['data'].push(item.tenMin);
                    seriesData[2]['data'].push(item.fifteenMin);
                    seriesData[3]['data'].push(item.twentyMin);
                    seriesData[4]['data'].push(item.twoKeepWarm);
                    seriesData[5]['data'].push(item.thirtyMin);
                    seriesData[i]['markArea']['data'] = [
                        [{
                            name: '',
                            yAxis: item.upLimit
                        }, {
                            yAxis: item.downLimit
                        }]
                    ]
                    timeData.push(
                        {
                            0: item.startTime,
                            1: item.tenMinTime,
                            2: item.fifteenMinTime,
                            3: item.twentyMinTime,
                            4: item.twoKeepWarmTime,
                            5: item.thirtyMinTime
                        }
                    );
                    i++;
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxTemp'));
                const option = {
                    tooltip: {
                        trigger: 'axis',
                        formatter: function(params) {
                            let htmlStr = '';
                            for (let io = 0; io < params.length; io++) {
                                const param = params[io];
                                const xName = param.name; //x轴的名称
                                const seriesName = param.seriesName; //图例名称
                                const value = param.value; //y轴值
                                const color = param.color; //图例颜色
                                if (io === 0) {
                                    htmlStr += xName + '<br/>';//x轴的名称
                                }
                                htmlStr += '<div>';
                                //为了保证和原来的效果一样，这里自己实现了一个点的效果
                                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + color + ';"></span>';
                                // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                                //htmlStr += '<span style="color:'+color+'">';
                                //圆点后面显示的文本
                                htmlStr += seriesName + '：' + value + ' (' + timeData[param.dataIndex][param.componentIndex] + ')';
                                // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                                //htmlStr += '</span>';
                                htmlStr += '</div>';
                            }
                            return htmlStr;
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'center',
                        // bottom: 'bottom',
                        bottom: 'bottom',
                        data: legendData
                    },
                    axisLabel: {
                        interval: 0,
                        rotate: 40
                    },
                    grid: {
                        top: '5%',
                        left: '0%',
                        right: '1%',
                        bottom: '8%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: xAxisData,
                        axisLabel: { 'interval': 0, rotate: 30 }
                    },
                    yAxis: {
                        type: 'value',
                        scale: true,
                        axisLabel: {
                            formatter: '{value} Min'
                        }
                    },
                    series: seriesData
                };
                this.chartLine.setOption(option);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 工艺保温时间
        getCraftTime(orderNo) {
            STE_API.STE_AUDIT_CRAFT_TIME_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.timeList = data.data;
                const xAxisData: string[] = [];
                const timeData: number[] = [];
                data.data.map(item => {
                    xAxisData.push(item.potName);
                    timeData.push(item.keepWarmTime);
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxTime'));
                const optionTime = {
                        color: ['#3398DB'],
                        grid: {
                            top: '5%',
                            left: '0%',
                            right: '1%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: xAxisData,
                                axisTick: {
                                    alignWithLabel: true
                                },
                                axisLabel: { 'interval': 0, rotate: 30 }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} Min'
                                }
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
                                data: timeData
                            }
                        ]
                };
                this.chartLine.setOption(optionTime);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 工艺出料时间与温度
        getCraftTimeAndTemp(orderNo) {
            STE_API.STE_AUDIT_CRAFT_TEMPERATUREANDTIME_API({
                orderNo: orderNo
            }).then(({ data }) => {
                // console.log(data);
                const xAxisData: string[] = []
                const timeData: number[] = []
                const tempStart: number[] = []
                const tempEnd: number[] = []
                data.data.map(item => {
                    xAxisData.push(item.potName);
                    timeData.push(item.outTime);
                    tempStart.push(item.start);
                    tempEnd.push(item.end);
                })
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
                        left: '0%',
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
                            data: xAxisData
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '时间',
                            min: 0,
                            max: 25,
                            position: 'left',
                            // axisLine: {
                            //     lineStyle: {
                            //         color: colors[2]
                            //     }
                            // },
                            axisLabel: {
                                formatter: '{value} Min'
                            }
                        },
                        {
                            type: 'value',
                            name: '温度',
                            min: 0,
                            max: 100,
                            position: 'right',
                            axisLabel: {
                                formatter: '{value} ℃'
                            }
                        },
                        {
                            type: 'value',
                            name: '温度',
                            min: 0,
                            max: 100,
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
                            data: timeData
                        },
                        {
                            name: '开始温度',
                            type: 'line',
                            yAxisIndex: 1,
                            data: tempStart
                        },
                        {
                            name: '结束温度',
                            type: 'line',
                            yAxisIndex: 2,
                            data: tempEnd
                        }
                    ]
                };

                this.chartLine.setOption(optionTimeAndTemp);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 异常情况
        getException(orderNo, workShop) {
            STE_API.STE_AUDIT_EXCEPTION_QUERY_API({
                orderNo: orderNo,
                workShop: workShop
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
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Audit-detail'))
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
                STE_API.STE_AUDIT_CHECKED_API({
                    orderNo: this.auditDetail['orderNo'],
                    workShop: this.auditDetail['workShop']
                }).then(() => {
                    this.$successToast('操作成功');
                    this.getHeaderInfo(this.auditDetail['orderNo']);
                })
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
