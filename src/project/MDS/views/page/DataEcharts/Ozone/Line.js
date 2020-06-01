export const line = {
    title: [
        {
            left: '15px',
            top: '10px',
            textStyle: {
                color: '#fff',
                fontSize: '24px'
            },
            text: '三楼更衣室浓度'
        },
        {
            right: '0px',
            top: '10px',
            lineHeight: '34px',
            textStyle: {
                color: '#fff',
                fontSize: '18px'
            },
            text: '三楼更衣室浓度'
        }
    ],
    dataZoom: [
        {
            type: 'inside',
            throttle: 50
        }
    ],
    xAxis: {
        axisLine: {
            lineStyle: {
                color: '#2D4288'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            show: false
        },
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        name: '浓度/°',
        min: 0,
        max: 120,
        nameTextStyle: {
            color: '#fff',
            fontSize: '18px'
        },
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#2D4288'
            }
        },
        axisTick: {
            show: false
        },
        axisLabel: {
            color: '#fff',
            fontSize: '12px'
        },
        splitLine: {
            show: false
        }
    },
    grid: {
        left: '40px',
        right: '20px',
        bottom: '30px'
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    series: [
        {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            // data: [0, 0, 0, 0, 0, 0, 0],
            type: 'line',
            showSymbol: false,
            smooth: true,
            lineStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: '#00FE9D'
                        },
                        {
                            offset: 0.33,
                            color: '#02BFF1'
                        },
                        {
                            offset: 0.66,
                            color: '#339CFF'
                        },
                        {
                            offset: 1,
                            color: '#917FFF'
                        }
                    ],
                    globalCoord: false
                }
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(0, 254, 157, 0.6)'
                        },
                        {
                            offset: 0.33,
                            color: 'rgba(2, 191, 241, 0.6)'
                        },
                        {
                            offset: 0.66,
                            color: 'rgba(51, 156, 255, 0.6)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(145, 127, 255, 0.6)'
                        }
                    ],
                    globalCoord: false
                }
            }
        }
    ]
};
