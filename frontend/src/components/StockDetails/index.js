import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import {StockChart, StockChartBar} from './StockChart'
import './styles.css';

const StockDetails = () => {
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState({});
  const location = useLocation();
  const stock_symbol = location.state;

  useEffect(() => {
    const fetchData = async () => {
      const stockData_url = `/api/stock/${stock_symbol}`
      const chart_url = `/api/candle/?symbol=${stock_symbol}&from=2022-01-01&to=2023-02-16`;

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

  return (
  <div className='stockDetails'>
    <DetailHeader chartData={chartData}/>
    <div className="board">
      <MenuBar />
      <div className='charts'>
        <StockChart chartData={chartData}/>
        <StockChartBar chartData={chartData} />
    </div>
  </div>

    
  </div>
  )
  }

export default StockDetails;

const MenuBar = () => {
  return (
    <div className="menuBar">
      Menu Bar
    </div>
  )
}

const DetailHeader = ({chartData}) => {
  //stockData로 변경 !!!!
  return (
    <div className="header">
      ZM
    </div>
  )
}