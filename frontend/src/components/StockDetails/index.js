import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import { StockChart } from './StockChart'
import './styles.css';

const StockDetails = () => {
    const [stockData, setStockData] = useState([]);
  const location = useLocation();
  const stock_symbol = location.state;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const stockData_url = `/api/stock/${stock_symbol}`

  //     await axios.get(stockData_url)
  //     .then(function(response) {
  //         // console.log(response.data);
  //         setStockData(response.data);
  //     })
  //     .catch(function(error) {
  //         console.log("실패(데이터)");
  //     })

      
  //   }  
    // fetchData();  
  // },[]);

  if (stockData.length === 0) {
    return null;
  } 

  return (
  <div className='stockDetails'>
    <DetailHeader />
    <div className="board">
      <MenuBar />
      <div className='charts'>
        <StockChart stock_symbol={stock_symbol} />
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