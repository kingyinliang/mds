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
                            <p>{{ prodPower.planOutput }} {{ prodPower.unitName }}</p>
                        </el-form-item>
                        <el-form-item label="实际产量：">
                            <p>{{ prodPower.countOutput }} {{ prodPower.unitName }}</p>
                        </el-form-item>
                        <el-form-item label="差异数量：">
                            <p>{{ prodPower.differences }} {{ prodPower.unitName }}</p>
                        </el-form-item>
                        <el-form-item label="作业人力：">
                            <p>{{ prodPower.countMan }}</p>
                        </el-form-item>
                        <el-form-item label="计划锅数：">
                            <p>{{ prodPower.standardMan }}</p>
                        </el-form-item>
                        <el-form-item label="生产锅数：">
                            <p>{{ prodPower.standardMan }}</p>
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
                    <el-table class="newTable" :data="AbnormalConditionList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column type="index" label="序号" fixed />
                        <el-table-column prop="classes" label="生产锅号" />
                        <el-table-column prop="stopTypeName" label="锅序" />
                        <el-table-column prop="stopMode" label="锅单号" />
                        <el-table-column prop="stopSituation" label="阶段" />
                        <el-table-column prop="duration" label="班次" />
                        <el-table-column prop="durationUnit" label="异常情况" />
                        <el-table-column prop="exceptionCount" label="异常原因" />
                        <el-table-column prop="duration" label="异常描述" />
                        <el-table-column prop="durationUnit" label="时长" />
                        <el-table-column prop="exceptionCount" label="单位" />
                    </el-table>
                    <el-row class="solerow">
                        <div>
                            总异常时间：
                        </div>
                        <div class="input_bottom">
                            {{ computedSoy }} H
                        </div>
                    </el-row>
                </mds-card>
                <mds-card title="物料领用" :name="'MaterialRecevie'">
                    <el-table class="newTable" :data="MaterialRecevieList" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                        <el-table-column label="领用物料" show-overflow-tooltip min-width="170">
                            <template slot-scope="scope">
                                {{ scope.row.materialCode }} {{ scope.row.materialName }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="materialUnit" label="单位" min-width="35" />
                        <el-table-column prop="useAmount" label="领用数量" min-width="50" />
                        <el-table-column prop="realUseAmount" label="领用批次" min-width="50" />
                        <el-table-column prop="realLoss" label="发酵罐/池" min-width="40" />
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
        <el-dialog title="退回原因" :close-on-click-modal="false" :visible.sync="visibleRefuse">
            <el-input v-model="ReText" type="textarea" :rows="6" class="textarea" style="width: 100%; height: 200px;" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="visibleRefuse = false">
                    取消
                </el-button>
                <el-button type="primary" @click="refuse()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script lang="ts">
    import { Vue, Component } from 'vue-property-decorator';
    // import { PKG_API } from 'common/api/api';
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

        mounted() {
            this.auditDetail = this.$store.state.sterilize.auditDetail;
            console.log(this.auditDetail);

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
</script>

<style scoped>

</style>
