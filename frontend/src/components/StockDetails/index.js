import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, NavLink, Routes, Route  } from 'react-router-dom'
import { StockChart } from './StockChart'
import { ChakraProvider } from '@chakra-ui/react'

import './styles.css';

export const StockDetails = () => {
  const [stockData, setStockData] = useState({});
  const stock_symbol = useLocation().state;
  const [active, setActive] = useState("chart")

  useEffect(() => {
    const fetchData = async () => {
      const stockData_url = `http://127.0.0.1:8000/api/stock/${stock_symbol}`
      
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
      <ChakraProvider>
        <DetailHeader stockData={stockData}/>
        <div className="board">
          <div className="menuBar">
            <ul>
                <li onClick={() => setActive("chart")}>Chart</li>
                <li onClick={() => setActive("finance")}>Finance</li>
                <li onClick={() => setActive("insider")}>Insider</li>
                <li onClick={() => setActive("news")}>News</li>
            </ul>
          </div>
          <div>
          {active === "chart" &&  <Chart />}
          {active === "finance" &&  <FinancialStatement />}
          {active === "insider" &&  <InsiderTrade />}
          {active === "news" &&  <News />}
          </div>
        </div>
      </ChakraProvider>
    </div>
  )
}

export const Chart = () => {
    const location = useLocation();
    const stock_symbol = location.state;
    return(
      <div className="chart">
        <StockChart stock_symbol={stock_symbol} />
      </div>
    )
  }

export const FinancialStatement = () => {
  const stock_symbol = useLocation().state;
  return (
    <div className='financialStatement'>
      {stock_symbol} financial statement
    </div>
  )
}

export const InsiderTrade = () => {
  const stock_symbol = useLocation().state;

  return (
    <div className='insiderTrade'>
      InsiderTrade {stock_symbol}
    </div>
  )
}

export const News = () => {
  const stock_symbol = useLocation().state;

  return (
    <div className='news'>
      News {stock_symbol}
    </div>
  )
}