import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import { StockChart } from './StockChart'
import './styles.css';

const StockDetails = () => {
  const [stockData, setStockData] = useState({});
  const location = useLocation();
  const stock_symbol = location.state;

  useEffect(() => {
    const fetchData = async () => {
      const stockData_url = `/api/stock/${stock_symbol}`
      
      await axios.get(stockData_url)
      .then(function(response) {
          // console.log(response.data);
          setStockData(response.data);
      })
      .catch(function(error) {
          console.log("실패(데이터)");
      })
    }
    fetchData();
  },[]);

  if (stockData.length === 0) {
    return null;
  }

    const MenuBar = () => {
    return (
      <div className="menuBar">
        <ul>
          <li>Chart</li>
          <li>Financial Statement</li>
          <li>Insider trade</li>
          <li>News</li>
        </ul>
      </div>
    )
  }

  const DetailHeader = ({stockData}) => {
    //stockData로 변경 !!!!
    return (
      <div className="header">
        {stockData.symbol}
      </div>
    )
  }


  return (
    <div className='stockDetails'>
      <DetailHeader stockData={stockData}/>
      <div className="board">
        <MenuBar />
        <div className='chart'>
          <StockChart stock_symbol={stock_symbol} />
        </div>
      </div>
    </div>
  )


}


export default StockDetails;
