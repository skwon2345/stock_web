import React, { useState, useEffect } from "react";
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
    const [chartData, setChartData] = useState([]);

    const ohlc=[]
    const volume=[]
    console.log("sdf")

    Indicators(Highcharts);
    DragPanes(Highcharts);
    AnnotationsAdvanced(Highcharts);
    PriceIndicator(Highcharts);
    FullScreen(Highcharts);
    StockTools(Highcharts);

    useEffect(()=> {
        
    })

    function afterSetExtremes(e) {
        const { chart } = e.target;
        chart.showLoading('Loading data from server...');
        fetch(`/api/candle/?symbol=${stock_symbol}&from=2022-01-01&to=2023-02-16$?start=${Math.round(e.min)}&end=${Math.round(e.max)}`)
            .then(res => res.ok && res.json())
            .then(data => {
                chart.series[0].setChartData(data);
                console.log("성공(차트)")
                chart.hideLoading();
            }).catch(error =>  console.log("실패(차트)"));
    }

    if (chartData.length === 0) {
        return null;
    } 

    chartData?.map((item) => {
        ohlc.push([Date.parse(item.date), item.open, item.high, item.low, item.close])
        volume.push([Date.parse(item.date), item.volume])
    })
    // Add a null value for the end date
    chartData.push([Date.UTC(2011, 9, 14, 18), null, null, null, null]);

    const options = {
        plotOptions: {
            ohlc: {
                color: 'red',
                upColor: 'green'
            },
        },
        series : [{
            type: 'ohlc',
            name : 'Stock Price', 
            data : ohlc,
            yAxis : 0,
        }, {   
            type: 'column',
            name : 'volume', 
            data : volume,
            yAxis : 1,
        }],
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Historical',
            style : {
                color: "#ffffff",
            }
            
        },
            chart: {
            height: (9 / 16 * 100) + '%',
            width: 1100,
            backgroundColor: '#242526',
            style : {
                color: "#ffffff",
            }
            
        },
        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            
            height: '60%',
            lineWidth: 2,
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'right',
                x: -3,
                style : {
                    color: "#ffffff",
                }
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }],
        xAxis: {
                events: {
                    afterSetExtremes: (e) => afterSetExtremes(e)
                },
                minRange: 3600 * 1000 // one hour
            },
        tooltip: {
            split: true
        },
    };


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
