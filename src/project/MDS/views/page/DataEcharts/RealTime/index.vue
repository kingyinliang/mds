<template>
    <div class="realTime">
        <echarts-head>欣和企业开发区分工厂</echarts-head>
        <img src="@/assets/img/ozoneTitle.png" alt="" class="Container_box_title">
        <div class="Container">
            <!-- <img src="@/assets/img/ozoneBg.png" alt="" class="Container_bg" /> -->
            <div class="Container_box">
                <div v-for="(item, index) in list" :key="index" class="itembox">
                    <div class="item" @click="showDetail(item)">
                        <h3>{{ item.sterilizePotName }}</h3>
                        <img src="@/assets/img/pot_1@2x.png" alt="" style="width: 100%;">
                        <span>{{ item.sterilizePotTemperature + '℃' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
            <div id="tem_echarts_box" class="chart-box" />
        </el-dialog>
    </div>
</template>

<script>
import echarts from 'echarts';
import { ECHARTS_API } from '@/api/api';
import SocketClient from 'utils/net/WebSocketConnectMDSIot';
import { options } from './Line';
export default {
    name: 'RealTime',
    components: {
        EchartsHead: resolve => {
            require(['../Layout/EchartsHead'], resolve);
        }
    },
    data() {
        return {
            factoryId: 7101, //JSON.parse(sessionStorage.getItem('factory') || '{}').id,
            list: [],
            dialogVisible: false,
            chartLine: null,
            title: '',
            dataList: [],
            dataTime: [],
            timePoint: [],
            SocketClientForList: null,
            SocketClientForPot: null
        };
    },
    async mounted() {
        this.getList();
        this.websocketToLogin(true);
    },
    destroyed() {
        // socketApi.closeWebSocket();
        this.SocketClientForPot && this.SocketClientForPot.closeWebSocket();
        this.SocketClientForList && this.SocketClientForList.closeWebSocket();
        this.disposeEcharts();
    },
    methods: {
        initEcharts(data) {
            if (!data) {
                return;
            }
            this.chartLine = echarts.init(document.getElementById('tem_echarts_box'));
            this.dataList = [...data.sterilizePotTemperatureList.map(item => parseFloat(item))];
            this.dataTime = data.sterilizePotDateList;
            this.timePoint = data.timePoint;
            this.chartLine.setOption(this.getOptions());
        },
        async showDetail(row) {
            this.title = row.sterilizePotName;
            const data = await this.getDetail(row);
            this.dialogVisible = true;
            this.websocketToLogin();
            this.$nextTick(() => {
                this.initEcharts(data);
                window.addEventListener('resize', this.resizeEcharts);
            });
        },
        resizeEcharts() {
            this.chartLine && this.chartLine.resize();
        },
        disposeEcharts() {
            this.chartLine && this.chartLine.dispose();
        },
        handleClose() {
            this.dialogVisible = false;
            this.disposeEcharts();
            window.removeEventListener('resize', this.resizeEcharts);
            // socketApi.closeWebSocket();
            this.SocketClientForPot && this.SocketClientForPot.closeWebSocket();
        },
        async getList() {
            this.$http(`${ECHARTS_API.OYSTER_SAUCE_LIST}`, 'POST', { factory: this.factoryId }, false, false, true).then(({ data }) => {
                if (data.code === 200) {
                    this.list = data.data;
                } else {
                    this.$errorToast(data.msg);
                }
            });
        },
        // 数据处理
        dataHandler(data) {
            const map = {
                disChargeValeStartTime: '放料阀开始',
                keepWarmEndTimeList: '保温结束',
                keepWarmStartTimeList: '保温开始',
                programStartTime: '程序开始'
            };
            const arr = [];
            Object.keys(map).forEach(key => {
                if (Array.isArray(data[key])) {
                    arr.push(
                        ...data[key].map((item, index) => {
                            return {
                                label: map[key],
                                time: data[key][index]
                            };
                        })
                    );
                } else if (typeof data[key] === 'string') {
                    arr.push({
                        label: map[key],
                        time: data[key]
                    });
                }
            });
            arr.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

            arr.map(item => {
                const i = data.sterilizePotDateList.findIndex(record => record === item.time);
                if (i === -1) {
                    const index = [...data.sterilizePotDateList, item.time].sort((a, b) => Date.parse(a) - Date.parse(b)).findIndex(row => row === item.time);
                    const temps = [...data.sterilizePotTemperatureList];
                    const temp = ((temps[index >= temps.length ? index - 1 : index] + temps[index > 0 ? index - 1 : index]) / 2).toFixed(1);
                    data.sterilizePotDateList.splice(index, 0, item.time);
                    data.sterilizePotTemperatureList.splice(index, 0, temp);
                }
            });

            return {
                sterilizePotTemperatureList: data.sterilizePotTemperatureList, // 温度
                sterilizePotDateList: data.sterilizePotDateList, // 时间
                timePoint: arr // 几个时间段
            };
        },
        async getDetail(row) {
            return new Promise((resolve, reject) => {
                this.$http(`${ECHARTS_API.OYSTER_SAUCE_LINE}`, 'POST', { factory: this.factoryId, sterilizePotName: row.sterilizePotName }, false, false, true).then(({ data }) => {
                    if (data.code === 200) {
                        if (!data.data) {
                            resolve(null);
                            return;
                        }
                        const res = this.dataHandler(data.data);
                        resolve(res);
                    } else {
                        this.$errorToast(data.msg);
                        reject(data.msg);
                    }
                });
            });
        },
        getConfigResult(res) {
            // 接收回调函数返回数据的方法
            console.log('函数 websocket 接收');
            const data = JSON.parse(res.data);
            if (this.dialogVisible && this.title === data.sterilizePotName) {
                // console.log(data);
                const result = this.dataHandler(data);
                this.initEcharts(result);
            }
        },
        websocketToLogin(forList = false) {
            // 【agentData：发送的参数；this.getConfigResult：回调方法】
            let key;
            if (process.env.VUE_APP_ENV === 'development') {
                key = 0;
            } else if (process.env.VUE_APP_ENV === 'test') {
                key = 1;
            } else {
                key = 2;
            }
            const wsObject = [
                {
                    url: 'wss://n2j6guq05a.execute-api.cn-north-1.amazonaws.com.cn/dev',
                    appid: 'df-mds-dev',
                    channel: 'df-mds-iot-msg-dev'
                },
                {
                    url: 'wss://3nieh13pk3.execute-api.cn-north-1.amazonaws.com.cn/test',
                    appid: 'df-mds-test',
                    channel: 'df-mds-iot-msg-test'
                },
                {
                    url: 'wss://95po8swao3.execute-api.cn-north-1.amazonaws.com.cn/prod',
                    appid: 'df-mds-prod',
                    channel: 'df-mds-iot-msg-prod'
                }
            ];

            let url = `${wsObject[key].url}?appid=${wsObject[key].appid}&channel=${wsObject[key].channel}`;
            if (forList) {
                this.SocketClientForList = new SocketClient(url, res => {
                    // console.log(res, 'list==---=--=-=')
                    this.list = JSON.parse(res.data || '[]');
                });
            } else {
                url += `-${this.factoryId}-${this.title}`;
                this.SocketClientForPot = new SocketClient(url, this.getConfigResult);
            }
        },
        getOptions() {
            return options(this.dataTime, this.dataList, this.timePoint);
        }
    }
};
</script>

<style lang="scss" scoped>
.realTime {
    // background-color: #001033;
    float: right;
    // display: flex;
    // flex-wrap: wrap;
    // align-items: center;
    width: calc(100% - 120px);
    height: 100%;
    .Container_box_title {
        position: relative;
        z-index: 88;
        display: block;
        width: 250px;
        margin: auto;
    }
    .Container {
        position: relative;
        top: -48px;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 20px);
        height: calc(100% - 100px);
        // min-height: calc(100% - 150px);
        margin: 0 10px;
        padding: 15px;
        overflow-y: hidden;
        background-image: url("../../../../assets/img/ozoneBg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .Container_box {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            padding: 30px 0;
            // margin: 20px 0;
            overflow-y: auto;
            background-image: url("../../../../assets/img/ozoneItemBg.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            &::-webkit-scrollbar {
                display: none;
            }
        }
        .itembox {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20%;
            margin: 16px 0;
            .item {
                position: relative;
                width: 80%;
                text-align: center;
                cursor: pointer;
                user-select: none;
                h3 {
                    padding-bottom: 20px;
                    color: #bde7ff;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 30px;
                    text-align: center;
                }
                span {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    z-index: 10;
                    // color: #0b0154;
                    color: #fff;
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 30px;
                    transform: translate(-50%, -50%);
                }
            }
        }
    }
    .chart-box {
        min-height: 400px;
    }
}
</style>
<style>
.realTime .el-dialog {
    background: none;
    border: 1px solid #1055ff;
    border-radius: 6px;
    box-shadow: 0 0 20px #595d66;
}
.realTime .el-dialog__header {
    background: rgba(000, 000, 0, 0.86) !important;
}
.realTime .el-dialog .el-dialog__body {
    background: rgba(000, 000, 0, 0.86) !important;
}
.realTime .el-dialog .el-dialog__title {
    color: #eba14b;
    font-weight: 400;
    font-size: 20px;
}
</style>
