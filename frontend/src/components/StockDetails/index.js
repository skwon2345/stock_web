import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'

import './styles.css';

const StockDetails = () => {
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState({});
  const [isLoading, setLoading] = useState();
  const location = useLocation();
  const stock_symbol = location.state;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const stockData_url = `/api/stock/${stock_symbol}`
      const chart_url = `/api/candle/?symbol=${stock_symbol}&from=1900-01-01&to=2023-02-16`;

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
      setLoading(false);
    }  
    fetchData();
  },[]);

  if (chartData.length === 0) {
    return null;
  } else if (stockData.length === 0) {
    return null;
  }

  console.log("--------")
  console.log(stockData)
  console.log(chartData)
  
  
    return (
    <div className='stockDetails'>
    </div>
    )
  }

export default StockDetails;
