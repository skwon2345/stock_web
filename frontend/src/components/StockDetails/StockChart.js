import React from 'react'
import Chart from 'react-apexcharts'
import './styles.css'

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
                    height: 350,
                    id: "candles",
                    group: "candles",
                    background: 'grey',
                    toolbar: {
                        autoSelected: "pan",
                        show: false,
                        },
                    events: {
                        scrolled: function(chart, { xaxis }) {
                    // ...
                    }
                },
                },
                zoom: {
                        enabled: true,
                        type: 'x',
                        autoScaleYaxis: true,
                        resetIcon: {
                            offsetX: -10,
                            offsetY: 0,
                            fillColor: '#fff',
                            strokeColor: '#37474F'
                        },
                        zoomedArea: {
                            fill: {
                                color: '#90CAF9',
                                opacity: 0.4
                            },
                        }
                    },
                
                grid: {
                    borderColor: "#555",
                    clipMarkers: false,
                    yaxis: {
                    lines: {
                        show: false
                    }
                    }
                },
                fill: {
                    gradient: {
                    enabled: true,
                    opacityFrom: 0.55,
                    opacityTo: 0
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
                    tickPlacement: 'on'
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
        <div className="subChart">
            <Chart
            type= 'bar'
            series={[
                {
                    name: 'volume',
                    data: chartData?.map((item) => {
                            return [
                                Date.parse(item.date),
                                item.volume,
                            ]
                        })
                }
            ]}
            options={{
                chart: {
                    type: "bar",
                    height: 150,
                    width: 500,
                    group: "candles",
                    id: "subchart",
                    
                    brush: {
                        enabled: true,
                        target: 'candles',
                        autoScaleYaxis: true,
                        
                    },
                    selection: {
                        enabled: true,
                        fill: {
                            color: "#fff",
                            opacity: 0.4
                        },
                        stroke: {
                            color: '#64a59d',
                        }
                    },
                },
                grid: {
                    borderColor: "#555",
                    clipMarkers: false,
                    yaxis: {
                        lines: {
                            show: false
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                plotOptions: {
                    candlestick: {
                        colors: {
                            upward: '#64a59d',
                        },
                        wick: {
                            useFillColor: true,
                        }
                    }
                },
                fill: {
                    gradient: {
                        enabled: true,
                        opacityFrom: 0.55,
                        opacityTo: 0
                    }
                },
                stroke: {
                        width: 2
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
                    },
                    tickAmoutn: 2
                }
                }
            }
        />
        </div>
    )
}
