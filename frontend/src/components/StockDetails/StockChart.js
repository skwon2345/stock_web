import React, { useState} from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import axios from 'axios';
import './styles.css'

export const StockChart =({stock_symbol}) => {
    const dataURL = `/api/candle/?symbol=${stock_symbol}&from=2003-01-01&to=2023-02-20`
    const [options, setOptions] = useState({
        ...chartOptions,
        chart: {
            type: "candlestick",
            zoomType: "x",
        },
        xAxis: {
            events: {
                afterSetExtremes
            },
            minRange: 3600 * 1000 // one hour
        }
    })
    const loadInitialData = async () => {
        if (options.hasOwnProperty("series")) {
            console.log(options.series[0])
            return
        } else {
            var ohlc =[]
            var volume = []
            try {
                const response = await axios.get(dataURL)
                response.data.map(item => {
                                ohlc.push([Date.parse(item.date), item.open, item.high, item.low, item.close])
                                volume.push([Date.parse(item.date), item.volume])
                            })
                console.log(ohlc)
            } catch (err) {
                console.log("실패(차트)");
            }
            console.log(ohlc)
            setOptions({
                ...chartOptions,
                series: [
                    {
                        data: ohlc,
                        dataGrouping: {
                            enabled: false
                        },
                        type: "candlestick"
                    },
                    {   
                        type: 'column',
                        name : 'volume', 
                        data : volume,
                        yAxis : 1,
                }
                ]
            })
        }
    };
    Highcharts.theme = {
        colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
            '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'
        ],
    }
    Highcharts.setOptions(Highcharts.theme);
    

    Indicators(Highcharts);
    DragPanes(Highcharts);
    AnnotationsAdvanced(Highcharts);
    PriceIndicator(Highcharts);
    FullScreen(Highcharts);
    StockTools(Highcharts);
    loadInitialData();

    function afterSetExtremes(e) {
        const { chart } = e.target;
        var url = null;

        if (e.hasOwnProperty("rangeSelectorButton")) {
            // const endDateObj = new Date();
            // const startDateObj = new Date();
            // startDateObj.setDate(startDateObj.getDate()- ((e.rangeSelectorButton.text === "1m") ? 31 : 365));

            // const endDate = `${endDateObj.getFullYear()}-${endDateObj.getMonth()+1}-${endDateObj.getDate()}`;
            // const startDate = `${startDateObj.getFullYear()}-${startDateObj.getMonth()+1}-${startDateObj.getDate()}`;

            // console.log(endDate)
            // console.log(startDate)
            url = `${dataURL}?start=${Math.round(e.min)}&end=${Math.round(e.max)}`

            axios.get(url)
            .then(function(response) {
                console.log(response.data)
                const ohlc = []
                response.data.map((item) =>
                    ohlc.push([Date.parse(item.date), item.open, item.high, item.low, item.close]))
                chart.series[0].setData(ohlc);
                chart.hideLoading();
            })
            .catch(error =>  console.log(error));


        } else {
            if (options.hasOwnProperty("series")) {
                chart.showLoading('Loading data from server...');    
            }
        }
    }

    return (
        <div className="stockChart">
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={"stockChart"}
                options={options}
            />
        </div>
    )
}

const chartOptions = {
        plotOptions: {
            candlestick: {
                color: 'red',
                upColor: 'green'
            },
        },
        chart: {
            type:"candlestick",
            zoomType: "x",
            height: (9 / 16 * 100) + '%',
            width: 1200,
            backgroundColor: '#242526',
            style : {
                color: "#ffffff",
            },
        },
        navigator: {
            adaptToUpdatedData: false,
        },
        scrollbar: {
            liveRedraw: false
        },
        rangeSelector: {
            buttons: [
            {
                type: "month",
                count: 1,
                text: "1m"
            },
            {
                type: "month",
                count: 3,
                text: "3m"
            },
            {
                type: "year",
                count: 1,
                text: "1y"
            },
            {
                type: "all",
                text: "All"
            }
            ],
            inputEnabled: false, 
            selected: 3,
        },

        title: {
            text: 'AAPL Historical',
            style : {
                color: "#ffffff",
            }
        },

        yAxis: [
                {
                    labels: {
                        align: "right",
                        x: -3
                    },
                    title: {
                        text: "OHLC"
                    },
                    height: "60%",
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                },
                {
                    labels: {
                        align: "right",
                        x: -3
                    },
                    title: {
                        text: "Volume"
                    },
                    top: "65%",
                    height: "35%",
                    offset: 0,
                    lineWidth: 2
                }
        ],
        tooltip: {
            split: true
        }
    }
