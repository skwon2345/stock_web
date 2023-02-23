import React, { useState, useEffect } from "react";
import axios from 'axios';
import Plot from 'react-plotly.js';
import './styles.css'


export const StockChart =({stock_symbol}) => {
    const [data, setData] = useState([]);
    const dataURL = `/api/candle/?symbol=${stock_symbol}&from=1900-01-01&to=2023-02-20`

    useEffect(() => {
        const initialValue = async () => {
            await axios.get(dataURL)
                .then(function(response) {
                    var trace = {
                        x: [],
                        close: [],
                        high: [],
                        low: [],
                        open: [],
                        line: {color: 'rgba(31,119,180,1)'}, 
                        decreasing: {line: {color: '#7F7F7F'}}, 
                        increasing: {line: {color: '#17BECF'}},
                        type: 'candlestick',
                        yaxis: 'y',
                        xaxis: 'x',
                    }
                    var volume = {
                        x: [],
                        y: [],
                        type: 'bar',
                        line: {color: 'grey'},
                        yaxis: 'y',
                        xaxis: 'x',
                    }
                response.data.map((item) => {
                    trace.x.push(JSON.stringify(Date.parse(item.date)))
                    trace.close.push(JSON.stringify(item.close))
                    trace.high.push(JSON.stringify(item.high))
                    trace.low.push(JSON.stringify(item.low))
                    trace.open.push(JSON.stringify(item.open))
                    volume.x.push(JSON.stringify(Date.parse(item.date)))
                    volume.y.push(item.volume)
                })
                setData([trace,volume])
        // console.log(volume)

            })
        }
        initialValue();
    }, [])
    

    const config= {
        autoscale:true,
        autosize: true,
        responsive: true,
    }

    return (
        <div className="stockChart">
            <Plot data={data} layout={layout} config={config}/>
        </div>
    )
}

var selectorOptions = {
    buttons: [{
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1m'
    }, {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6m'
    }, {
        step: 'year',
        stepmode: 'todate',
        count: 1,
        label: 'YTD'
    }, {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1y'
    }, {
        step: 'all',
    }],
    selected: 2
};

const layout = {
    font: {size: 13},
    width: 1100,
    height: 780,
    xaxis: {
        autorange: true, 
        showgrid: true,
        // rangeslider: {range: ['2020-01-03 12:00', '2020-12-03 12:00']}, 
        type: 'date',
        rangeselector: selectorOptions,
        rangeslider: {},
        
    }, 
    yaxis: {
            autorange: true, 
            type: 'candlestick',
            boundmode: 'hard',
            bounds: [50, 100],
            anchor: "x",
            overlaying: "y"
    },
    yaxis2: {
            autorange: false, 
            type: 'candlestick',
            boundmode: 'hard',
            bounds: [50, 100],
            overlaying: 'y',
            side: "right"
    },
    plot_bgcolor:"#242526",
    paper_bgcolor:"#242526"
};
