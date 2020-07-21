<template>
    <div class="header_main">
        <div class="dataEntry-head">
            <el-row class="dataEntry-head-base">
                <el-col :span="21">
                    <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                        <el-form-item label="生产车间：">
                            <p>{{ formHeader.workShopName }}</p>
                        </el-form-item>
                        <el-form-item label="生产产线：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.productLineName" placement="top">
                                <p>{{ formHeader.productLineName }}</p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产物料：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.materialCode + ' ' + formHeader.materialName" placement="top">
                                <p>{{ formHeader.materialCode }} {{ formHeader.materialName }}</p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产订单：">
                            <p>{{ formHeader.orderNo }}</p>
                        </el-form-item>
                        <el-form-item label="订单产量：">
                            <p>{{ formHeader.planOutput }} {{ formHeader.outputUnit }}</p>
                        </el-form-item>
                        <el-form-item label="订单日期：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.orderStartDate" placement="top">
                                <p>{{ formHeader.orderStartDate }}</p>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="生产日期：">
                            <p>{{ formHeader.productDate }}</p>
                        </el-form-item>
                        <el-form-item label="提交人员：">
                            <p>{{ formHeader.changer }}</p>
                        </el-form-item>
                        <el-form-item label="提交时间：">
                            <el-tooltip class="item" effect="dark" :content="formHeader.changed" placement="top">
                                <p>{{ formHeader.changed }}</p>
                            </el-tooltip>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="3" style="margin-top: 16px;">
                    <i
                        class="dataEntry-head-title__status"
                        :class="{
                            noPass: formHeader.orderStatus === '已退回',
                            checked: formHeader.orderStatus === '已审核',
                            '': formHeader.orderStatus === '待审核',
                        }"
                    >
                        订单状态：{{ formHeader.orderStatusName }}
                    </i>
                </el-col>
            </el-row>
        </div>
        <div class="box-card" style=" margin-top: 10px; padding: 10px !important; background: white;">
            <mds-card title="产量与人力" :name="'outputworker'">
                <el-form :inline="true" :model="formHeader" label-width="75px" size="small" class="dataEntry-head-base__form">
                    <el-form-item label="订单产量：">
                        <p>{{ prodPower.planOutput }} {{ prodPower.unitName }}</p>
                    </el-form-item>
                    <el-form-item label="实际产量：">
                        <p>{{ prodPower.countOutput }} {{ prodPower.unitName }}</p>
                    </el-form-item>
                    <el-form-item v-if="prodPower.urgencyCountOutput !== 0" label="紧急入库产量：" label-width="100px">
                        <p>{{ prodPower.urgencyCountOutput }}</p>
                    </el-form-item>
                    <el-form-item label="差异数量：">
                        <p>{{ prodPower.differences }} {{ prodPower.unitName }}</p>
                    </el-form-item>
                    <el-form-item label="标准人力：">
                        <p>{{ prodPower.standardMan }}</p>
                    </el-form-item>
                    <el-form-item label="作业人力：">
                        <p>{{ prodPower.countMan }}</p>
                    </el-form-item>
                </el-form>
            </mds-card>
            <mds-card title="生产效率" :name="'Productivity'">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div class="mod-demo-echarts">
                            <el-card>
                                <div id="J_chartLineBox" style="height: 211px;" />
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-table class="newTable" :data="oeeList" header-row-class-name="tableHead" border tooltip-effect="dark">
                            <el-table-column prop="name" label="班次/标准" />
                            <el-table-column label="标准">
                                <template slot-scope="scope">
                                    {{ scope.row.standard }}{{ scope.row.standard ? '%' : '' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="全天">
                                <template slot-scope="scope">
                                    {{ scope.row.whole }}{{ scope.row.whole ? '%' : '' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="白班">
                                <template slot-scope="scope">
                                    {{ scope.row.day }}{{ scope.row.day ? '%' : '' }}
                                </template>
                            </el-table-column>
                            <el-table-column label="夜班">
                                <template slot-scope="scope">
                                    {{ scope.row.night }}{{ scope.row.night ? '%' : '' }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
            </mds-card>
            <mds-card title="设备运行情况" :name="'EquipmentOperation'">
                <el-form :inline="true" :model="formHeader" label-width="70px" size="small" class="dataEntry-head-base__form">
                    <el-form-item label="开始时间：">
                        <p style="width: 135px;">
                            {{ deviceRun.startDate }}
                        </p>
                    </el-form-item>
                    <el-form-item label="结束时间：">
                        <p style="width: 135px;">
                            {{ deviceRun.endDate }}
                        </p>
                    </el-form-item>
                    <el-form-item label="总运行时间：" label-width="85px">
                        <p>{{ deviceRun.deviceRunTime }}(H)</p>
                    </el-form-item>
                    <el-form-item label="总停线时间：" label-width="85px">
                        <p>{{ deviceRun.devicePauseTime !== null ? deviceRun.devicePauseTime : 0 }}(MIN)</p>
                    </el-form-item>
                </el-form>
                <el-table v-show="deviceRun.exceptionInfo.length !== 0" class="newTable" :data="deviceRun.exceptionInfo" header-row-class-name="tableHead" border tooltip-effect="dark" style="margin-top: 5px;">
                    <el-table-column type="index" label="序号" fixed />
                    <el-table-column prop="classes" label="班次" />
                    <el-table-column prop="stopTypeName" label="停机类型" />
                    <el-table-column prop="stopMode" label="停机方式" />
                    <el-table-column prop="stopSituation" label="异常情况" />
                    <el-table-column prop="duration" label="时长" />
                    <el-table-column prop="durationUnit" label="单位" />
                    <el-table-column prop="exceptionCount" label="次数" />
                </el-table>
            </mds-card>
            <mds-card title="生产领料差异" :name="'ProductionMaterialDifference'">
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div class="mod-demo-echarts">
                            <el-card>
                                <div id="J_chartLineBoxDiff" style="height: 300px;" />
                            </el-card>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <el-table class="newTable" :data="proMaterialDiffList" header-row-class-name="tableHead" border tooltip-effect="dark">
                            <el-table-column label="领用物料" show-overflow-tooltip min-width="170">
                                <template slot-scope="scope">
                                    {{ scope.row.materialCode }} {{ scope.row.materialName }}
                                </template>
                            </el-table-column>
                            <el-table-column prop="materialUnit" label="单位" min-width="35" />
                            <el-table-column prop="useAmount" label="领用数量" min-width="50" />
                            <el-table-column prop="realUseAmount" label="实际用量" min-width="50" />
                            <el-table-column prop="realLoss" label="实际损耗" min-width="40" />
                            <el-table-column prop="lossRate" label="损耗率" min-width="50" />
                        </el-table>
                    </el-col>
                </el-row>
            </mds-card>
            <audit-log :table-data="currentAudit" :verify-man="'verifyMan'" :verify-date="'verifyDate'" :status="true" />
        </div>
        <div class="redactBox">
            <div class="redactBox" :style="{ 'padding-left': sidebarFold ? '64px' : '170px' }">
                <div class="redact clearfix">
                    <div class="redact_tips">
                        <i class="el-icon-info" />
                        <span>生管审核</span>
                    </div>
                    <div class="redact_btn">
                        <el-button type="primary" size="small" @click="goDetail">
                            详情
                        </el-button>
                        <el-button v-if="formHeader.orderStatusName === '待审核'" type="primary" size="small" @click="pass()">
                            审核通过
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { PKG_API, AUDIT_API } from 'common/api/api';
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
    oeeList: OeeSole[] = [];
    prodPower = {};
    deviceRun = {
        exceptionInfo: []
    };
    // eslint-disable-next-line
    oeePic: any[] = [['product', '标准', '全天', '白班', '夜班']];

    mounted() {
        this.auditDetail = this.$store.state.packaging.auditDetail;
        this.getOrderList();
        this.getOee(this.auditDetail);
        this.getProdPower(this.auditDetail);
        this.getDeviceRun(this.auditDetail);
        this.getAudit(this.auditDetail);
    }

    get sidebarFold() {
        return this.$store.state.common.sidebarFold;
    }

    // 生产效率
    getOee(auditDetail) {
        PKG_API.PKG_AUDIT_DETAIL_OEE_API({ orderNo: auditDetail.orderNo }).then(({ data }) => {
            this.oeeList = data.data
            let i = 0;
            this.oeeList.map((item: OeeSole) => {
                if (i === 0) {
                    item.name = '可用率';
                } else if (i === 1) {
                    item.name = '时间稼动率';
                } else if (i === 2) {
                    item.name = '性能稼动率';
                } else if (i === 3) {
                    item.name = '良品率';
                } else if (i === 4) {
                    item.name = '综合效率';
                } else if (i === 5) {
                    item.name = '生产效率';
                }
                let sole: string[] = [];
                if (item.name) {
                    let night = '0'
                    night = item.night ? item.night : '0';
                    sole = [item.name, item.standard, item.whole, item.day, night];
                    this.oeePic.push(sole);
                }
                i++;
            })
            this.initChartLine();
        })
    }

    // 产量与力量
    getProdPower(auditDetail) {
        PKG_API.PKG_AUDIT_DETAIL_PROMANPOWER_API(auditDetail).then(({ data }) => {
            this.prodPower = data.data;
        })
    }

    // 设备运行情况
    getDeviceRun(auditDetail) {
        PKG_API.PKG_AUDIT_DETAIL_DEVICERUN_API(auditDetail).then(({ data }) => {
            this.deviceRun = data.data;
        })
    }

    // 审核日志
    getAudit(auditDetail) {
        AUDIT_API.AUDIT_LOG_LIST_API({ orderNo: auditDetail.orderNo, verifyType: '' }).then(({ data }) => {
            this.currentAudit = data.data
        })
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

    // 头部信息
    getOrderList() {
        PKG_API.PKG_HOME_QUERY_BY_NO_API({ // 基础数据-订单管理-根据订单号查询
            factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            orderNo: this.$store.state.packaging.auditDetail.orderNo
        }).then(({ data }) => {
            this.formHeader = data.data;
            this.getProMaterialDiff(this.formHeader);
        });
    }

    // 生产领料差异
    getProMaterialDiff(formHeader) {
        PKG_API.PKG_AUDIT_DETAIL_PROMATERIALDIFF_API({ // 基础数据-订单管理-根据订单号查询
            factory: formHeader.id,
            orderNo: formHeader.orderNo
        }).then(({ data }) => {
            this.proMaterialDiffList = data.data
            this.initDiffChartBar();
        });
    }

    pass() {
        this.$confirm('确认通过该订单, 是否继续?', '审核通过', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            PKG_API.PKG_AUDIT_DETAIL_PASS_API({
                factory: JSON.parse(sessionStorage.getItem('factory') || '{}').id,
                materialCode: this.formHeader.materialCode,
                orderId: this.formHeader.id,
                orderNo: this.formHeader.orderNo,
                orderType: this.formHeader.orderType,
                productDate: this.formHeader.productDate,
                productLine: this.formHeader.productLine,
                workShop: this.formHeader.workShop
            }).then(() => {
                this.$successToast('操作成功');
                this.getOrderList();
            })
        })
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
            legend: {
                itemHeight: 12,
                y: '0px'
            },
            grid: {
                top: '30px',
                left: '0%',
                right: '0',
                bottom: '0',
                containLabel: true
                // height: 300
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            dataset: {
                // source: [
                //     ['product', '标准', '白班', '夜班', 'OEE'],
                //     ['可用率', 43.3, 85.8, '9', '1'],
                //     ['时间移动率', 83.1, 73.4, 55.1, 2],
                //     ['性能稼动率', 86.4, 65.2, 82.5, 50],
                //     ['良品率', 72.4, 53.9, 39.1, 0],
                //     ['综合效率', 86.4, 65.2, 82.5, 50],
                //     ['生产效率', 72.4, 53.9, 39.1, 0]
                // ]
                source: this.oeePic
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
        const yList: string[] = [];
        const realUseAmountList: string[] = [];
        const realLossList: string[] = [];
        this.proMaterialDiffList.map((item: ProMaterialDiff) => {
            const name: string = item.materialCode + ' ' + item.materialName;
            yList.push(name);
            realUseAmountList.push(item.realUseAmount);
            realLossList.push(item.realLoss);
        })
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
            grid: {
                left: '0%',
                right: '2%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: yList,
                axisLabel: {
                    show: true,
                    interval: 0,
                    formatter: function(params) {
                        let newParamsName = '';
                        if (params.length > 12) {
                            newParamsName = params.substring(0, 10);
                        } else {
                            newParamsName = params;
                        }
                        return newParamsName;
                        // let newParamsName = '';
                        // const paramsNameNumber = params.length;
                        // const provideNumber = 10; // 一行显示几个字
                        // const rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        // if (paramsNameNumber > provideNumber) {
                        //     for (let p = 0; p < rowNumber; p++) {
                        //         let tempStr = '';
                        //         const start = p * provideNumber;
                        //         const end = start + provideNumber;
                        //         if (p === rowNumber - 1) {
                        //             tempStr = params.substring(start, paramsNameNumber);
                        //         } else {
                        //             tempStr = params.substring(start, end) + '\n';
                        //         }
                        //         newParamsName += tempStr;
                        //     }

                        // } else {
                        //     newParamsName = params;
                        // }
                        // return newParamsName
                    }
                }
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
                    barWidth: 20,
                    stack: '总量',
                    label: {
                        show: false,
                        position: 'insideRight'
                    },
                    data: realUseAmountList
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
                        show: false,
                        position: 'insideRight'
                    },
                    data: realLossList
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
interface ProMaterialDiff{
    lossRate: string;
    materialCode: string;
    materialName: string;
    materialUnit: string;
    realLoss: string;
    realUseAmount: string;
    useAmount: string;
}
interface OeeSole{
    name?: string;
    standard: string;
    day: string;
    night: string;
    whole: string;
}
</script>
