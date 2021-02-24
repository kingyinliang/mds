<template>
    <div class="realTime">
        <echarts-head>欣和企业开发区分工厂</echarts-head>
        <img src="@/assets/img/ozoneTitle_2.png" alt="" class="Container_box_title">
        <div class="Container">
            <!-- <img src="@/assets/img/ozoneBg.png" alt="" class="Container_bg" /> -->
            <div class="Container_box">
                <div v-for="(item, index) in list" :key="index" class="itembox">
                    <div class="item" @click="showDetail(item)">
                        <h3>{{ item.sterilizePotName }}</h3>
                        <img src="@/assets/img/pot_1@2x.png" alt="" style="width: 100%;">
                        <!-- <span>{{ item.sterilizePotTemperature + '℃' }}</span> -->
                        <div class="temps-box">
                            <div class="temps" :style="{ top: top[index] + 'px' }">
                                <span v-for="(row, i) in item.temps" :key="i" class="temp-item">{{ row + '°C' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
            <span class="dialog-date">{{ dataDate }}</span>
            <div v-show="showTip" class="tip-box">
                <span class="sp">温度：{{ tipRow.temp }}</span>
                <span class="sp">时间：{{ tipRow.time }}</span>
            </div>
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
            SocketClientForPot: null,
            dataDate: '',
            tipRow: {},
            showTip: false,
            timer: null,
            top: []
        };
    },
    async mounted() {
        this.getList();
        this.websocketToLogin(true);
    },
    destroyed() {
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
            this.SocketClientForPot && this.SocketClientForPot.closeWebSocket();
        },
        async getList() {
            this.$http(`${ECHARTS_API.OYSTER_SAUCE_LIST}`, 'POST', { factory: this.factoryId }, false, false, true).then(({ data }) => {
                if (data.code === 200) {
                    const list = data.data;
                    this.top = new Array(list.length).fill(0);
                    list.map((item) => {
                        const arr = [...item.previousSterilizePotTemperatureList];
                        arr.push(item.sterilizePotTemperature);
                        item.temps = arr;
                    });
                    this.list = list;
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
            // arr.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
            arr.sort((a, b) => {
                if (a.time > b.time) {
                    return 1;
                }
                return -1;
            });

            arr.map(item => {
                const i = data.sterilizePotDateList.findIndex(record => record === item.time);
                if (i === -1) {
                    // const index = [...data.sterilizePotDateList, item.time].sort((a, b) => Date.parse(a) - Date.parse(b)).findIndex(row => row === item.time);
                    const index = [...data.sterilizePotDateList, item.time]
                        .sort((a, b) => {
                            if (a > b) {
                                return 1;
                            }
                            return -1;
                        })
                        .findIndex(row => row === item.time);
                    const temps = [...data.sterilizePotTemperatureList];
                    const temp = ((temps[index >= temps.length ? index - 1 : index] + temps[index > 0 ? index - 1 : index]) / 2).toFixed(1);
                    data.sterilizePotDateList.splice(index, 0, item.time);
                    data.sterilizePotTemperatureList.splice(index, 0, temp);
                }
            });
            this.dataDate = data.dataDate;

            return {
                sterilizePotTemperatureList: data.sterilizePotTemperatureList, // 温度
                sterilizePotDateList: data.sterilizePotDateList.map(item => item.split(' ')[1]), // 时间
                timePoint: arr.map(item => ({ label: item.label, time: item.time.split(' ')[1] })) // 几个时间段
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
                this.tipRow = {
                    temp: result.sterilizePotTemperatureList[result.sterilizePotTemperatureList.length - 1],
                    time: result.sterilizePotDateList[result.sterilizePotDateList.length - 1]
                };
                this.showTip = true;
                this.timer && clearTimeout(this.timer);
                this.timer = setTimeout(() => {
                    this.showTip = false;
                }, 5000);
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
                    const list = JSON.parse(res.data || '[]');
                    this.list.map((item, index) => {
                        item.sterilizePotTemperature = list[index].sterilizePotTemperature;
                        item.previousSterilizePotTemperatureList = list[index].previousSterilizePotTemperatureList;
                        if (item.temps.length >= 30) {
                            item.temps.splice(0, 27);
                        }
                        // if (item.temps[item.temps.length - 1] !== item.sterilizePotTemperature) {
                        //     item.temps.push(item.sterilizePotTemperature);
                        //     this.top[index] = -25 * (item.temps.length - 3);
                        // }
                        item.temps.push(...list[index].previousSterilizePotTemperatureList, item.sterilizePotTemperature);
                        this.top[index] = -20 * (item.temps.length - 3);
                    });
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
    width: 100%;
    height: 100%;
    .Container_box_title {
        position: relative;
        left: calc(50% - 85px);
        z-index: 88;
        display: block;
        width: 290px;
    }
    .Container {
        position: relative;
        top: -48px;
        display: flex;
        flex-wrap: wrap;
        float: right;
        width: calc(100% - 140px);
        height: calc(100% - 100px);
        margin: 0 10px;
        padding: 15px;
        overflow-y: hidden;
        background-image: url("~@/assets/img/ozoneBg.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        .Container_box {
            display: flex;
            flex-wrap: wrap;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            padding: 30px 0;
            overflow-y: auto;
            background-image: url("~@/assets/img/ozoneItemBg.png");
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
                width: 90%;
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
                .temps-box {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    width: auto;
                    height: 60px;
                    margin: auto;
                    overflow: hidden;
                    transform: perspective(50px) rotateX(15deg) rotateY(0deg);
                    transform-style: preserve-3d;
                    .temps {
                        position: absolute;
                        width: 100%;
                        height: auto;
                        transition: all ease 250ms;
                        span {
                            display: block;
                            color: rgba($color: #fff, $alpha: 0.5);
                            font-size: 18px;
                            line-height: 20px;
                        }
                        .temp-item:last-child {
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
    .chart-box {
        min-height: 400px;
    }
    .dialog-date {
        position: relative;
        top: -15px;
        font-size: 18px;
    }
    .tip-box {
        position: absolute;
        top: 15px;
        right: 50px;
        z-index: 3014;
        display: flex;
        flex-direction: column;
        width: 180px;
        height: 50px;
        background: #1055ff;
        .sp {
            padding: 3px 10px;
            color: #fff;
        }
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
