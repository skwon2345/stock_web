import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import Chart from 'react-apexcharts'

import './styles.css';

const StockDetails = () => {
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState({});
  const location = useLocation();
  const stock_symbol = location.state;

  useEffect(() => {
    const fetchData = async () => {
      const stockData_url = `/api/stock/${stock_symbol}`
      const chart_url = `/api/candle/?symbol=${stock_symbol}&from=2020-01-01&to=2023-02-16`;

      await axios.get(stockData_url)
      .then(function(response) {
          // console.log(response.data);
          setStockData(response.data);
      })
      .catch(function(error) {
          console.log("실패(데이터)");
      })

      await axios.get(chart_url)
      .then(function(response) {
          // console.log(response.data);
          setChartData(response.data);
      })
      .catch(function(error) {
          console.log("실패(차트)");
      })
    }  
    fetchData();  
  },[]);

  if (chartData.length === 0) {
    return null;
  } else if (stockData.length === 0) {
    return null;
  }

  // console.log("--------")
  // console.log(stockData)
  // console.log(chartData)


    return (
    <div className='stockDetails'>
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
              width: 500,
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
            plotOptions: {
              candlestick: {
                  colors: {
                      upward: '#3C90EB',
                      downward: '#DF7D46'
                  },
              },
            },
            
          }}
        }
      />
    </div>
    )
  }

export default StockDetails;
