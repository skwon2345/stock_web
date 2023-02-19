import React from 'react'
import Chart from 'react-apexcharts'

export const StockChart = ({chartData}) => {
    return (
        <div className='stockChart'>
            <Chart
            type="candlestick"
            series={[
            {
                data: chartData?.map((item) => {
                return [
                    Date.parse(item.date),
                    item.open,
                    item.high,
                    item.low,
                    item.close,
                ]
                })
            }
            ]}
            options={{
                theme: {
                    mode: 'dark',
                },
                chart: {
                    type: "candlestick",
                    height: "auto",
                    width: "100%",
                    id: "candles",
                    toolbar: {
                        autoSelected: 'pan',
                        show: true,
                        },
                    background: "rgb(67, 67, 67)",
                    zoom: {
                        enabled: true,
                        type: 'x',
                        autoScaleYaxis: true,
                        zoomedArea: {
                            fill: {
                                color: '#90CAF9',
                                opacity: 0.4
                            },
                            stroke: {
                                color: '#0D47A1',
                                opacity: 0.4,
                                width: 1
                                }
                        }
                    },
                    chart: {
                        sparkline: {
                            enabled: true
                        }
                    }
                },
                
                xaxis: {
                    type: "datetime",
                    categories: chartData.map((item) => item.date),
                    labels: {
                    style: {
                    fontSize: '13px',
                    colors: '#ffffff',
                    },
                    orientation: 'horizontal',
                    },
                },
                annotations: {
                    xaxis: [
                    {
                        borderColor: '#00E396',
                        label: {
                        borderColor: '#00E396',
                        style: {
                            fontSize: '12px',
                            color: '#fff',
                            background: '#00E396'
                        },
                        orientation: 'horizontal',
                        offsetY: 7,
                        text: 'Annotation Test'
                        }
                    }
                    ]
                },
                yaxis: {
                    tooltip: {
                    enabled: true
                    },
                    forceNiceScale: true,
                    labels: {
                        style: {
                            fontSize: '13px',
                            colors: '#ffffff',
                        },
                    },
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: 'rgb(57, 77, 204)',
                            downward: 'rgb(186, 71, 65)',
                        },
                    },
                },
            }}
        />
        
    </div>
    )
}


export const StockChartBar = ({chartData}) => {
    return (
        <div>
            <Chart
            type= 'bar'
            series={[
                {
                    name: 'volume',
                    data: chartData?.map((item) => {
                            return [
                                Date.parse(item.date),
                                item.close,
                            ]
                        })
                }
            ]}
            options={{
                chart: {
                    type: "bar",
                    height: "100%",
                    brush: {
                        enabled: true,
                        target: 'candles'
                    },
                    selection: {
                        enabled: true,
                        fill: {
                            color: '#ccc',
                            opacity: 0.5
                        },
                        stroke: {
                            color: '#0D47A1',
                        }
                    },
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#3C90EB',
                            downward: '#DF7D46'
                        },
                        wick: {
                            useFillColor: true,
                        }
                    }
                },
                stroke: {
                    width: 0
                },
                xaxis: {
                    type: 'datetime',
                    axisBorder: {
                        offsetX: 13
                        }
                },
                yaxis: {
                    labels: {
                        show: false
                    }
                }
                }
            }
        />
        </div>
    )
}

// series={[
//             {
//                 data: chartData?.map((item) => {
//                 return [
//                     Date.parse(item.date),
//                     item.open,
//                     item.high,
//                     item.low,
//                     item.close,
//                 ]
//                 })
//             }
//             ]}