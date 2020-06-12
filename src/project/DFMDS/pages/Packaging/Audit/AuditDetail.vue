<template>
    <div class="header_main">
        <div class="dataEntry-head">
            <el-row class="dataEntry-head-base">
                <el-col :span="21">
                    <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                        <el-form-item label="生产车间：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="订单产量：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p>123</p>
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <p>123</p>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="3" style="margin-top: 16px;">
                    <i
                        class="dataEntry-head-title__status"
                        :class="{
                            noPass: orderStatus === 'noPass',
                            saved: orderStatus === 'saved',
                            submit: orderStatus === 'submit',
                            checked: orderStatus === 'checked',
                            '': orderStatus === '已同步',
                        }"
                    >
                        订单状态：{{ orderStatus === 'noPass' ? '审核不通过' : orderStatus === 'saved' ? '已保存' : orderStatus === 'submit' ? '已提交' : orderStatus === 'checked' ? '通过' : orderStatus === '已同步' ? '未录入' : orderStatus === 'toBeAudited' ? '待审核' : orderStatus }}
                    </i>
                </el-col>
            </el-row>
        </div>
        <div class="box-card" style=" margin-top: 10px; padding: 10px !important; background: white;">
            <mds-card title="产量与人力" :name="'outputworker'">
                <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                    <el-form-item label="订单产量：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="实际产量：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="紧急入库产量：" label-width="100px">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="差异数量：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="标准人力：">
                        <p>123</p>
                    </el-form-item>
                    <el-form-item label="作业人力：">
                        <p>123</p>
                    </el-form-item>
                </el-form>
            </mds-card>
            <mds-card title="生产效率" :name="'Productivity'">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div class="mod-demo-echarts">
                            <el-card>
                                <div id="J_chartLineBox" class="chart-box" />
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                            <el-table-column prop="date" label="班次/标准" />
                            <el-table-column prop="date" label="标准" />
                            <el-table-column prop="date" label="白班" />
                            <el-table-column prop="date" label="夜班" />
                            <el-table-column prop="date" label="OEE" />
                        </el-table>
                    </el-col>
                </el-row>
            </mds-card>
            <mds-card title="设备运行情况" :name="'EquipmentOperation'">
                <template slot="titleBtn">
                    <el-row style="float: right;">
                        <el-form style="float: right;" :inline="true" :model="formHeader" label-width="90px" size="small" class="dataEntry-head-base__form">
                            <el-form-item label="开始时间：">
                                <p>123</p>
                            </el-form-item>
                            <el-form-item label="结束时间：">
                                <p>123</p>
                            </el-form-item>
                        </el-form>
                    </el-row>
                </template>
                <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                    <el-table-column prop="date" label="序号" fixed />
                    <el-table-column prop="date" label="班次" />
                    <el-table-column prop="date" label="停机类型" />
                    <el-table-column prop="date" label="停机方式" />
                    <el-table-column prop="date" label="异常情况" />
                    <el-table-column prop="date" label="时长" />
                    <el-table-column prop="date" label="单位" />
                    <el-table-column prop="date" label="次数" />
                </el-table>
                <el-form :inline="true" :model="formHeader" label-width="90px" size="small" class="dataEntry-head-base__form">
                    <el-form-item label="总运行时间：">
                        <p>123(H)</p>
                    </el-form-item>
                    <el-form-item label="总停线时间：">
                        <p>123(MIN)</p>
                    </el-form-item>
                </el-form>
            </mds-card>
            <mds-card title="生产领料差异" :name="'ProductionMaterialDifference'">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div class="mod-demo-echarts">
                            <el-card>
                                <div id="J_chartLineBoxDiff" class="chart-box" />
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-table class="newTable" :data="dataList" header-row-class-name="tableHead" border tooltip-effect="dark">
                            <el-table-column prop="date" label="领用物料" />
                            <el-table-column prop="date" label="单位" />
                            <el-table-column prop="date" label="领用数量" />
                            <el-table-column prop="date" label="实际用量" />
                            <el-table-column prop="date" label="实际损耗" />
                            <el-table-column prop="date" label="损耗率" />
                        </el-table>
                    </el-col>
                </el-row>
            </mds-card>
            <!-- <audit-log :table-data="readAudit" /> -->
        </div>
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_tips">
                        <i class="el-icon-info" />
                        <span>请及时保存数据</span>
                    </div>
                    <div class="redact_btn">
                        <el-button type="primary" size="small" @click="goDetail">
                            详情
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import echarts from 'echarts';
@Component({
    // name: 'AuditLog',
    // components: {
    //     AuditLog: resolve => {
    //         require(['@/views/components/AuditLog'], resolve);
    //     }
    // }
})
export default class AuditDetail extends Vue {

    formHeader = {};
    orderStatus = '已同步';
    dataList = [];
    readAudit = [];
    /* eslint-disable */
    chartLine: any;
    chartDiffBar: any;
    /* eslint-enable */

    mounted() {
        this.initChartLine();
        this.initDiffChartBar();
    }

    get sidebarFold() {
        return this.$store.state.common.sidebarFold;
    }

    goDetail() {
        this.$store.commit('packaging/updateAuditDetailDetail', this.$store.state.packaging.auditDetail);
        this.$store.commit('common/updateMainTabs', this.$store.state.common.mainTabs.filter(subItem => subItem.name !== 'DFMDS-pages-Packaging-Audit-detail'))
        setTimeout(() => {
            this.$router.push({
                name: `DFMDS-pages-Packaging-Audit-detail`
            });
        }, 100);
    }

    activated() {
        // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
        if (this.chartLine) {
            this.chartLine.resize();
        }
        if (this.chartDiffBar) {
            this.chartDiffBar.resize();
        }
    }

    // 折线图
    initChartLine() {
        const option = {
            color: ['#124BBE', '#2372FF', '#3CB5EC', '#78E6FF'],
            legend: {},
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            dataset: {
                source: [
                    ['product', '标准', '白班', '夜班', 'OEE'],
                    ['可用率', 43.3, 85.8, 93.7, 1],
                    ['时间移动率', 83.1, 73.4, 55.1, 2],
                    ['性能稼动率', 86.4, 65.2, 82.5, 50],
                    ['良品率', 72.4, 53.9, 39.1, 0],
                    ['综合效率', 86.4, 65.2, 82.5, 50],
                    ['生产效率', 72.4, 53.9, 39.1, 0]
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
            series: [
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30
                        }
                    }
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30
                        }
                    }
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30
                        }
                    }
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            barBorderRadius: 30
                        }
                    }
                }
            ]
        };
        this.chartLine = echarts.init(document.getElementById('J_chartLineBox'));
        this.chartLine.setOption(option);
        window.addEventListener('resize', () => {
            this.chartLine.resize();
        });
    }

    initDiffChartBar() {
        const option = {
            color: ['#EEB919', '#5A88FF'],
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['实际用量', '实际损耗']
            },
            // grid: {
            //     left: '3%',
            //     right: '4%',
            //     bottom: '3%',
            //     containLabel: true
            // },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: ['纸箱', '盒盖', '盒底', '脱氧剂', '封口膜', '垫板', '胶带']
            },
            series: [
                {
                    name: '实际用量',
                    type: 'bar',
                    // itemStyle: {
                    //     normal: {
                    //         // 柱形图圆角，初始化效果
                    //         barBorderRadius: [0, 30, 30, 0],
                    //     }
                    // },
                    barWidth: 15,
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: [320, 302, 301, 334, 390, 330, 320]
                },
                {
                    name: '实际损耗',
                    type: 'bar',
                    // itemStyle: {
                    //     normal: {
                    //         // 柱形图圆角，初始化效果
                    //         barBorderRadius: [0, 30, 30, 0],
                    //     }
                    // },
                    stack: '总量',
                    label: {
                        show: true,
                        position: 'insideRight'
                    },
                    data: [120, 132, 101, 134, 90, 230, 0]
                }
            ]
        };
        this.chartDiffBar = echarts.init(document.getElementById('J_chartLineBoxDiff'));
        this.chartDiffBar.setOption(option);
        window.addEventListener('resize', () => {
            this.chartDiffBar.resize();
        });
    }
}
</script>
