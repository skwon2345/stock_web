import React, { useState, useEffect } from "react";
import axios from 'axios';
import Plot from 'react-plotly.js';
import './styles.css'


export const StockChart =({stock_symbol}) => {
    const [data, setData] = useState([]);
    const [layout, setLayout] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const dataURL = `/api/candle/?symbol=${stock_symbol}&from=1900-01-01&to=2023-02-20`

    useEffect(() => {
        const initialValue = async () => {
            await axios.get(dataURL)
                .then(function(response) {
                response.data.layout.template.layout.yaxis.gridcolor= "none"
                response.data.layout.template.layout.xaxis.gridcolor= "none"
                setData(response.data.data)
                setLayout(layout=> ({
                    ...layoutOptions,
                    ...response.data.layout
                }))
            setLoading(false);
            })
        }
        initialValue();
    }, [])

    if(isLoading) {
        return null;
    }

    return (
        <div className="stockChart">
            <Plot data={data} layout={layout} config={config}/>
        </div>
    )
}

const config= {
    autoscale:true,
    autosize: true,
    responsive: true,
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

const layoutOptions = {
    font: {size: 13, color: "#c7c7c7"},
    width: 1100,
    height: 880,
    xaxis: {
        autorange: true, 
        showgrid: true,
        type: 'date',
        rangeselector: selectorOptions,
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
