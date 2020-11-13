/**
 * options
 * @param {*} dataTime 时间
 * @param {*} dataList 温度
 * @param {*} timePoint 时间段
 */
export const options = (dataTime, dataList, timePoint) => {
    return {
        backgroundColor: 'rgba(0, 0, 0, 0.38)',
        xAxis: {
            // name: '时间',
            type: 'category',
            boundaryGap: false,
            data: dataTime,
            axisLabel: { color: '#fff' }, // x轴字体颜色
            nameTextStyle: {
                color: '#fff'
            },
            splitLine: {
                show: false,
                lineStyle: {
                    type: 'dashed',
                    color: '#025370'
                }
            }
        },
        yAxis: {
            name: '温度/°C',
            type: 'value',
            axisLabel: { color: '#fff' }, // y轴字体颜色
            scale: true,
            min: 0,
            max: 110,
            nameTextStyle: {
                color: '#fff'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: 'dashed',
                    color: '#025370'
                }
            }
        },
        tooltip: {
            trigger: 'axis', //触发类型,'item'数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。 'axis'坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            },
            // backgroundColor: '#3B5FF1',
            extraCssText: 'border-radius: 12px;'
        },
        series: [
            {
                // symbolSize: 20,
                name: '温度',
                data: dataList,
                type: 'line',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#3B5FF1', //改变折线点的颜色
                        lineStyle: {
                            color: '#3B5FF1' //改变折线颜色
                        }
                    }
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            {
                                offset: 0,
                                color: '#0ECFF8' // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: 'rgba(59, 95, 241, 0.23)' // 100% 处的颜色
                            }
                        ],
                        global: false // 缺省为 false
                    }
                },
                markLine: {
                    symbol: ['none', 'none'], //去掉箭头
                    itemStyle: {
                        normal: {
                            lineStyle: {
                                type: 'solid',
                                width: 2,
                                color: {
                                    //设置渐变
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [
                                        {
                                            offset: 0,
                                            color: '#3B5FF1' // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: '#3B5FF1' // 100% 处的颜色
                                        }
                                    ],
                                    global: false // 缺省为 false
                                }
                            },
                            label: {
                                show: true,
                                position: 'end'
                            }
                        }
                    },
                    data: [
                        ...timePoint.map(item => {
                            return {
                                name: item.label,
                                label: {
                                    show: true,
                                    normal: {
                                        backgroundColor: '#1055FF',
                                        padding: 8,
                                        color: '#fff',
                                        formatter: () => {
                                            const index = dataTime.findIndex(item2 => item2 === item.time);
                                            return `名称：${item.label}\n温度：${dataList[index]}°C\n${item.time}`;
                                        },
                                        extraCssText: 'border-radius: 12px;'
                                    }
                                },
                                xAxis: item.time //这里设置false是隐藏不了的，可以设置为-1
                            };
                        })
                    ]
                }
            }
        ]
    };
}
