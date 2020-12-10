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
                <el-row :gutter="10">
                    <el-col :span="12">
                        <mds-card v-if="productLine === ''" title="泡豆时长" :name="'soakBeansLength'">
                            <div class="mod-demo-echarts">
                                <div id="J_chartLineBoxSoakBeansLength" style="height: 300px;" />
                            </div>
                        </mds-card>
                        <mds-card v-else title="泡豆&物料" :name="'soakBeansLength'">
                            <el-table class="newTable" :data="beanSteepAndMaterial" header-row-class-name="tableHead" max-height="290" border tooltip-effect="dark" style="margin-top: 5px;">
                                <el-table-column type="index" label="序号" fixed />
                                <el-table-column prop="name" label="内容" />
                                <el-table-column prop="num" label="数值" />
                                <el-table-column prop="unit" label="单位" />
                            </el-table>
                        </mds-card>
                    </el-col>
                    <el-col :span="12">
                        <mds-card title="大豆杂质情况" :name="'soybeanImpurities'">
                            <template slot="titleBtn">
                                <el-form :inline="true" size="small" class="dataEntry-head-base__form" style="float: right; margin-top: 0;">
                                    <el-form-item label="杂质总数：">
                                        <p>{{ soybeanImpuritiesTotal }}KG</p>
                                    </el-form-item>
                                </el-form>
                            </template>
                            <div class="mod-demo-echarts">
                                <div id="J_chartLineBoxSoybeanImpurities" style="height: 300px;" />
                            </div>
                        </mds-card>
                    </el-col>
                </el-row>
                <mds-card v-if="productLine === ''" title="混合入料工艺" :name="'mixedIntoMaterial'">
                    <div class="mod-demo-echarts">
                        <div id="J_chartLineBoxMixedIntoMaterial" style="height: 400px;" />
                    </div>
                    <el-table class="newTable" :data="mixedIntoMaterialList" header-row-class-name="tableHead" max-height="290" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed />
                        <el-table-column prop="kojiHouseName" label="曲房" />
                        <el-table-column prop="tempTypeName" label="温度类型" />
                        <el-table-column prop="temp" label="温度" />
                        <el-table-column prop="changer" label="操作人" />
                    </el-table>
                </mds-card>
                <mds-card v-if="productLine === ''" title="看曲工艺" :name="'lookCraft'">
                    <!-- <div v-for="i in lookListCount" class="mod-demo-echarts">
                        <div id="J_chartLineBoxlookCraft1" style="height: 400px;" />
                    </div> -->
                    <div v-for="i in lookListCount" :key="i" class="mod-demo-echarts">
                        <div :id="'J_chartLineBoxlookCraft'+ i" style="height: 400px;" />
                    </div>
                    <!-- <div class="mod-demo-echarts">
                        <div id="J_chartLineBoxlookCraft2" style="height: 400px;" />
                    </div> -->
                </mds-card>
                <mds-card v-if="productLine === ''" title="入曲及出曲工艺" :name="' '">
                    <el-table class="newTable" :data="inOutCraftList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed min-width="80" />
                        <el-table-column prop="kojiHouseName" label="曲房" min-width="80" />
                        <el-table-column prop="addKojiDate" label="入曲日期" min-width="95" />
                        <el-table-column prop="addKojiStart" label="入曲开始时间" min-width="135" />
                        <el-table-column prop="addKojiEnd" label="入曲结束时间" min-width="135" />
                        <el-table-column prop="addKojiDuration" label="入曲时长" min-width="80" />
                        <el-table-column prop="standardDuration" label="入曲标准" min-width="80" />
                        <el-table-column prop="addKojiTemp" label="入曲温度" min-width="80" />
                        <el-table-column prop="outKojiStart" label="出曲开始时间" min-width="135" />
                        <el-table-column prop="outKojiEnd" label="出曲结束时间" min-width="135" />
                        <el-table-column prop="outKojiDuration" label="出曲时长" min-width="80" />
                        <el-table-column prop="outKojiTemp" label="出曲温度" min-width="80" />
                    </el-table>
                </mds-card>
                <mds-card v-if="productLine === ''" title="翻曲情况" :name="'AbnormalCondition'">
                    <el-table class="newTable" :data="turnList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed />
                        <el-table-column prop="kojiHouseName" label="曲房" />
                        <el-table-column prop="addKojiDate" label="入曲日期" />
                        <el-table-column prop="turnStageName" label="翻曲" />
                        <el-table-column prop="turnTemp" label="翻曲温度" />
                        <el-table-column prop="turnDuration" label="制曲时长" />
                    </el-table>
                </mds-card>
                <mds-card title="异常情况" :name="'AbnormalCondition'">
                    <el-table class="newTable" :data="exceptionList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed min-width="80" />
                        <el-table-column v-if="productLine === ''" prop="kojiHouseName" label="曲房号" min-width="90" />
                        <el-table-column v-if="productLine === ''" prop="addKojiDate" label="入曲日期" min-width="90" />
                        <el-table-column prop="exceptionStageName" label="工序" min-width="140" />
                        <el-table-column prop="classesName" label="班次" min-width="60" />
                        <el-table-column prop="exceptionSituationName" label="异常情况" min-width="80" />
                        <el-table-column prop="exceptionReasonName" label="异常原因" min-width="120" />
                        <el-table-column prop="exceptionInfo" label="异常描述" min-width="120" />
                        <el-table-column prop="duration" label="时长" min-width="60" />
                        <el-table-column prop="durationUnitName" label="单位" min-width="60" />
                    </el-table>
                    <el-row class="solerow">
                        <div>
                            总异常时间：
                        </div>
                        <div class="input_bottom">
                            {{ (exceptionDurationSum / 60).toFixed(2) }} H
                        </div>
                    </el-row>
                </mds-card>
                <mds-card v-if="productLine === ''" title="原豆量情况" :name="'originalBeans'">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <div class="mod-demo-echarts">
                                <div id="J_chartLineBoxOriginalBeans" style="height: 300px;" />
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <el-table class="newTable" :data="beanUsageList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                                <el-table-column type="index" label="序号" fixed min-width="80" />
                                <el-table-column prop="kojiHouseName" label="曲房" min-width="90" />
                                <el-table-column prop="addKojiDate" label="入曲日期" min-width="90" />
                                <el-table-column prop="unitName" label="单位" min-width="140" />
                                <el-table-column prop="beanAmount" label="原豆量" min-width="80" />
                                <el-table-column prop="standardAmount" label="标准量" min-width="60" />
                            </el-table>
                        </el-col>
                    </el-row>
                </mds-card>
                <mds-card v-if="productLine === ''" title="物料领用" :name="'materialRecevie'">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <div class="mod-demo-echarts">
                                <div id="J_chartLineBoxMaterial" style="height: 300px;" />
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <el-table class="newTable" :data="materialList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                                <el-table-column type="index" label="序号" fixed min-width="80" />
                                <el-table-column label="领用物料" show-overflow-tooltip min-width="170">
                                    <template slot-scope="scope">
                                        {{ scope.row.materialName }} {{ scope.row.materialCode }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="unitName" label="单位" min-width="35" />
                                <el-table-column prop="materialAmount" label="实际用量" min-width="50" />
                                <el-table-column prop="impurityAmount" label="杂质量" min-width="50" />
                            </el-table>
                        </el-col>
                    </el-row>
                </mds-card>
                <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
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
    import { KOJI_API, COMMON_API } from 'common/api/api';
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
                label: '生产日期',
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

        /* eslint-disable */
        chartLine: any;
        /* eslint-enable */


        formHeader: OrderData = {};

        // 异常原因字典
        excReasonTotal: ExcReasonTotal = {
            FAULTSHUTDOWN: [],
            POORPROCESSWAIT: [],
            ENERGY: []
        };

        exceptionDurationSum = 0;
        soybeanImpuritiesTotal = 0; // 杂质总数
        mixedIntoMaterialList = []; // 混合入料工艺(表格)
        inOutCraftList = [];
        turnList = [];
        exceptionList: ExceptionList[] = [];
        beanUsageList = [];
        lookListCount = 10;
        materialList = [];
        currentAudit = [];
        productLine = '';
        beanSteepAndMaterial: object[] = [];


        mounted() {
            this.auditDetail = this.$store.state.koji.auditDetail;
            this.productLine = this.auditDetail['productLine'];
            // console.log(this.productLine);
            // this.auditDetail['orderNo'] = '851000002087';

            this.getHeaderInfo(this.auditDetail['orderNo']);
            this.getBeanImpurity(this.auditDetail['orderNo']);
            const net01 = new Promise(resolve => {
                this.getDictionary('ENERGY', resolve);
            });
            const net02 = new Promise(resolve => {
                this.getExcConitionList(this.auditDetail['workShop'], resolve);
            });
            Promise.all([net01, net02]).then(() => {
                this.getException(this.auditDetail['orderNo']);
            }).catch((reason) => {
                this.$errorToast(reason);
            });
            this.getAudit(this.auditDetail['orderNo']);
            if (this.productLine !== '') {
                this.getBeanSteepAndMaterial(this.auditDetail['orderNo']);
            } else {
                this.getBeanSteepChart(this.auditDetail['orderNo']);
                this.getMixedIntoMaterial(this.auditDetail['orderNo']);
                this.getMixedIntoMaterialTable(this.auditDetail['orderNo']);
                this.getLookCraft(this.auditDetail['orderNo']);
                this.getInOutCraft(this.auditDetail['orderNo']);
                this.getTurn(this.auditDetail['orderNo']);
                this.getBeanUsage(this.auditDetail['orderNo']);
                this.getMaterial(this.auditDetail['orderNo']);
            }
        }

        // sc
        getBeanSteepAndMaterial(orderNo) {
            KOJI_API.KOJI_AUDIT_BEANANDMATERIAL_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.beanSteepAndMaterial = [
                    {
                        name: '平均泡豆时长',
                        num: data.data.beanSteepDuration,
                        unit: data.data.beanSteepDurationUnitName
                    },
                    {
                        name: '原豆量',
                        num: data.data.beanUsageAmount,
                        unit: data.data.beanUsageAmountUnitName
                    },
                    {
                        name: '杂质量',
                        num: data.data.beanImpurityAmount,
                        unit: data.data.beanImpurityAmountUnitName
                    }
                ]
            })
        }

        // 泡豆时长
        getBeanSteepChart(orderNo) {
            KOJI_API.KOJI_AUDIT_BEANSTEEP_API({
                orderNo: orderNo
            }).then(({ data }) => {
                const xAxisData: string[] = []
                const seriesData: string[] = [];
                data.data.map(item => {
                    xAxisData.push(item.kojiHouseName);
                    seriesData.push(item.steepDuration);
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxSoakBeansLength'));
                const option = {
                    grid: {
                        top: '5%',
                        left: '1%',
                        right: '1%',
                        bottom: '0%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: seriesData,
                        type: 'bar',
                        barWidth: 30,
                        itemStyle: {
                            normal: {
                                color: '#6594FA',
                                barBorderRadius: 15,
                                label: {
                                    show: true, //是否展示
                                    textStyle: {
                                        fontWeight: 'bolder',
                                        fontSize: '12',
                                        fontFamily: '微软雅黑'
                                    }
                                }
                            }
                        }
                    }]
                };
                this.chartLine.setOption(option);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 大豆杂质情况
        getBeanImpurity(orderNo) {
            KOJI_API.KOJI_AUDIT_BEANIMPURITY_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.soybeanImpuritiesTotal = data.data.impuritySum;
                const datasetSource: object[] = [];
                data.data.impurityDetailList.map(item => {
                    const itemSole = {};
                    itemSole['product'] = item.beanBatch;
                    item.impurityAmountList.map(items => {
                        itemSole[items.impurityTypeName + '(' + items.impurityUnit + ')'] = items.impurityAmount;
                    })
                    datasetSource.push(itemSole);
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxSoybeanImpurities'));
                const optionSoybeanImpurities = {
                    grid: {
                        top: '10%',
                        left: '1%',
                        right: '1%',
                        bottom: '0%',
                        containLabel: true
                    },
                    legend: {},
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataset: {
                        source: datasetSource
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [
                        {
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#6594FA',
                                    barBorderRadius: 15,
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        },
                        {
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#63DAAB',
                                    barBorderRadius: 15,
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        },
                        {
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#66779A',
                                    barBorderRadius: 15,
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                };
                this.chartLine.setOption(optionSoybeanImpurities);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 混合入料工艺
        getMixedIntoMaterial(orderNo) {
            KOJI_API.KOJI_AUDIT_MIXEDINTOMATERIAL_API({
                orderNo: orderNo
            }).then(({ data }) => {
                const datasetSource = [
                    ['product'],
                    ['蒸面风冷温度'],
                    ['大豆风冷温度1'],
                    ['大豆风冷温度2'],
                    ['混合料温度1'],
                    ['混合料温度2']
                ];
                data.data.map(item => {
                    datasetSource[0].push(item.kojiHouseName);
                    datasetSource[1].push(item.flourWindTemp);
                    datasetSource[2].push(item.beanWindTempOne);
                    datasetSource[3].push(item.beanWindTempTwo);
                    datasetSource[4].push(item.mixtureTempOne);
                    datasetSource[5].push(item.mixtureTempTwo);
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxMixedIntoMaterial'));
                const optionMixedIntoMaterial = {
                    grid: {
                        top: '10%',
                        left: '1%',
                        right: '1%',
                        bottom: '2%',
                        containLabel: true
                    },
                    // legend: {},
                    tooltip: {
                        trigger: 'axis'
                    },
                    dataset: {
                        source: datasetSource
                    },
                    xAxis: { type: 'category' },
                    yAxis: {},
                    series: [
                        {
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#6C9AFC',
                                    barBorderRadius: 15,
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        },
                        {
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#EA6B5B',
                                    barBorderRadius: 15,
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                };
                this.chartLine.setOption(optionMixedIntoMaterial);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 混合入料工艺表格
        getMixedIntoMaterialTable(orderNo) {
            KOJI_API.KOJI_AUDIT_MIXEDINTOMATERIAL_TABLE_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.mixedIntoMaterialList = data.data;
            })
        }

        // 看曲工艺
        getLookCraft(orderNo) {
            KOJI_API.KOJI_AUDIT_LOOKCRAFTONE_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.lookListCount = data.data.length;
                let i = 1;
                data.data.map(item => {
                    const chartId = 'J_chartLineBoxlookCraft' + i;
                    this.chartLine = echarts.init(document.getElementById(chartId));

                    const xAxisData: string[] = [];
                    const seriesDataWindTemp: number[] = [];
                    const seriesDataSettingWindTemp: number[] = [];
                    const seriesDataProdTemp: number[] = [];
                    const seriesDatasettingProdTemp: number[] = [];
                    // eslint-disable-next-line
                    const markLineData: any[] = [];
                    if (item.kojiTurnTime1 !== '' && item.kojiTurnTime1 !== null) {
                        let start = 0;
                        start = item.tempList.findIndex(it => it.guardDate === item.kojiTurnTime1)
                        const test: Testobj[] = [{
                            coord: [start, 0]
                        },
                        {
                            coord: [start, 60]
                        }];
                        markLineData.push(test)
                    }
                    if (item.kojiTurnTime2 !== '' && item.kojiTurnTime2 !== null) {
                        let end = 0;
                        end = item.tempList.findIndex(it => it.guardDate === item.kojiTurnTime2)
                        markLineData.push([{
                            coord: [end, 0]
                        },
                        {
                            coord: [end, 60]
                        }])
                    }
                    item.tempList.map(items => {
                        xAxisData.push(items.guardDate);
                        seriesDataWindTemp.push(items.windTemp);
                        seriesDataSettingWindTemp.push(items.settingWindTemp);
                        seriesDataProdTemp.push(items.prodTemp);
                        seriesDatasettingProdTemp.push(items.settingProdTemp);
                        const optionlookCraftOne = {
                            title: {
                                text: item.kojiHouseName
                            },
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['风温', '设定风温', '品温', '设定品温']
                            },
                            grid: {
                                top: '10%',
                                left: '1%',
                                right: '3%',
                                bottom: '10%',
                                containLabel: true
                            },
                            xAxis: {
                                type: 'category',
                                boundaryGap: false,
                                data: xAxisData,
                                axisLabel: {
                                        show: true,
                                        interval: 0,
                                        formatter: function(params) {
                                            let newParamsName = '';
                                            const paramsNameNumber = params.length;
                                            const provideNumber = 10; //一行显示几个字
                                            const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                            if (paramsNameNumber > provideNumber) {
                                                for (let p = 0; p < rowNumber; p++) {
                                                    let tempStr = '';
                                                    const start = p * provideNumber;
                                                    const end = start + provideNumber;
                                                    if (p === rowNumber - 1) {
                                                        tempStr = params.substring(start, paramsNameNumber);
                                                    } else {
                                                        tempStr = params.substring(start, end) + '\n';
                                                    }
                                                    newParamsName += tempStr;
                                                }

                                            } else {
                                                newParamsName = params;
                                            }
                                            return newParamsName
                                        }
                                    }
                            },
                            yAxis: {
                                type: 'value',
                                axisLabel: {
                                    formatter: '{value} °C'
                                },
                                max: 60
                            },
                            series: [
                                {
                                    name: '风温',
                                    type: 'line',
                                    stack: '风温',
                                    data: seriesDataWindTemp,
                                    markLine: {
                                        symbol: 'none',
                                        itemStyle: {
                                                normal: {
                                                    borderWidth: 1,
                                                    lineStyle: {
                                                        type: 'solid',
                                                        color: '#ccc ',
                                                        width: 2
                                                    }
                                                }
                                            },
                                        data: markLineData
                                    }
                                },
                                {
                                    name: '设定风温',
                                    type: 'line',
                                    stack: '设定风温',
                                    data: seriesDataSettingWindTemp,
                                    markLine: {
                                        symbol: 'none',
                                        itemStyle: {
                                                normal: {
                                                    borderWidth: 1,
                                                    lineStyle: {
                                                        type: 'solid',
                                                        color: '#ccc ',
                                                        width: 2
                                                    }
                                                }
                                            },
                                        data: markLineData
                                    }
                                },
                                {
                                    name: '品温',
                                    type: 'line',
                                    stack: '品温',
                                    data: seriesDataProdTemp,
                                    markLine: {
                                        symbol: 'none',
                                        itemStyle: {
                                                normal: {
                                                    borderWidth: 1,
                                                    lineStyle: {
                                                        type: 'solid',
                                                        color: '#ccc ',
                                                        width: 2
                                                    }
                                                }
                                            },
                                        data: markLineData
                                    }
                                },
                                {
                                    name: '设定品温',
                                    type: 'line',
                                    stack: '设定品温',
                                    data: seriesDatasettingProdTemp,
                                    markLine: {
                                        symbol: 'none',
                                        itemStyle: {
                                                normal: {
                                                    borderWidth: 1,
                                                    lineStyle: {
                                                        type: 'solid',
                                                        color: '#ccc ',
                                                        width: 2
                                                    }
                                                }
                                            },
                                        data: markLineData
                                    }
                                }
                            ]
                        };
                        this.chartLine.setOption(optionlookCraftOne);
                        window.addEventListener('resize', () => {
                            this.chartLine.resize();
                        });
                    })
                    i++;
                })
            })
        }

        // 入曲及出曲工艺
        getInOutCraft(orderNo) {
            KOJI_API.KOJI_AUDIT_INOUTCRAFT_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.inOutCraftList = data.data;
            })
        }

        // 翻曲情况
        getTurn(orderNo) {
            KOJI_API.KOJI_AUDIT_TURN_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.turnList = data.data;
            })
        }

        // 异常情况
        getException(orderNo) {
            KOJI_API.KOJI_AUDIT_EXCEPTION_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.exceptionDurationSum = data.data.exceptionDurationSum
                this.exceptionList = data.data.exceptionList;
                this.exceptionList.map((item) => {
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

        // 原豆量情况
        getBeanUsage(orderNo) {
            KOJI_API.KOJI_AUDIT_BEANUSAGE_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.beanUsageList = data.data;
                const xAxisData: string[] = [];
                const seriesDataOrg: number[] = [];
                const seriesDataStand: number[] = [];
                data.data.map(item => {
                    xAxisData.push(item.kojiHouseName);
                    seriesDataOrg.push(item.beanAmount);
                    seriesDataStand.push(item.standardAmount);
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxOriginalBeans'));
                const optionOriginalBeans = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['原豆数量', '标准数量']
                    },
                    grid: {
                        top: '10%',
                        left: '1%',
                        right: '1%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    yAxis: {},
                    series: [
                        {
                            name: '原豆数量',
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#6594FC',
                                    barBorderRadius: 15,
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
                            data: seriesDataOrg
                        },
                        {
                            name: '标准数量',
                            type: 'bar',
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#F8C024',
                                    barBorderRadius: 15,
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
                            data: seriesDataStand
                        }
                    ]
                };
                this.chartLine.setOption(optionOriginalBeans);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 物料领用
        getMaterial(orderNo) {
            KOJI_API.KOJI_AUDIT_MATERIAL_API({
                orderNo: orderNo
            }).then(({ data }) => {
                this.materialList = data.data;
                const yAxisData: string[] = [];
                const seriesDataReal: number[] = [];
                const seriesData: number[] = [];
                data.data.map(item => {
                    yAxisData.push(item.materialName);
                    seriesDataReal.push(item.materialAmount);
                    seriesData.push(item.impurityAmount);
                })
                this.chartLine = echarts.init(document.getElementById('J_chartLineBoxMaterial'));
                const optionMaterial = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        // data: ['实际用量', '大豆量']
                    },
                    grid: {
                        top: '10%',
                        left: '1%',
                        right: '5%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: yAxisData
                    },
                    series: [
                        {
                            name: '实际用量',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight'
                            },
                            data: seriesDataReal,
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#6295FC',
                                    barBorderRadius: [15, 0, 0, 15],
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        },
                        {
                            name: '杂质用量',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                show: true,
                                position: 'insideRight'
                            },
                            data: seriesData,
                            barWidth: 30,
                            itemStyle: {
                                normal: {
                                    color: '#63DAAB',
                                    barBorderRadius: [0, 15, 15, 0],
                                    label: {
                                        show: true, //是否展示
                                        textStyle: {
                                            fontWeight: 'bolder',
                                            fontSize: '12',
                                            fontFamily: '微软雅黑'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                };
                this.chartLine.setOption(optionMaterial);
                window.addEventListener('resize', () => {
                    this.chartLine.resize();
                });
            })
        }

        // 数据字典
        getDictionary(dictType, resolve) {
            COMMON_API.DICTQUERY_API({ dictType: dictType }).then(({ data }) => {
                if (dictType === 'POOR_PROCESS_WAIT') {
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
                this.excReasonTotal.FAULTSHUTDOWN = []
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

        // 审核日志
        getAudit(orderNo) {
            COMMON_API.COMMON_LOG_LIST_API({ orderNo: orderNo, verifyType: '' }).then(({ data }) => {
                this.currentAudit = data.data
            })
        }

        getHeaderInfo(orderNo) {
            COMMON_API.OREDER_QUERY_BY_NO_API({ orderNo: orderNo }).then(({ data }) => {
                this.formHeader = data.data;
            })
        }

        goDetail() {
            this.$store.commit('sterilize/updateAuditDetailDetail', this.$store.state.sterilize.auditDetail);
            this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Sterilize-Audit-'))
            setTimeout(() => {
                this.$router.push({
                    name: `DFMDS-pages-KojiMaking-Audit-detail`
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
    interface Testobj {
        coord?: number[];
    }
</script>

<style scoped>

</style>
