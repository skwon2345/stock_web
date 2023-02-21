import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom'
import { StockChart } from './StockChart'
import { Tab, Tabs } from 'react-bootstrap';

import "bootstrap/dist/css/bootstrap.min.css";
import './styles.css';

const StockDetails = () => {
  const [stockData, setStockData] = useState({});
  const [key, setKey] = useState("chart");
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

  const DetailHeader = ({stockData}) => {
    //stockData로 변경 !!!!
    return (
      <div className="header">
        {stockData.symbol}
      </div>
    )
  }

  const FinancialStatement = () => {
    return (
      <div>
        Financial statement
      </div>
    )
  }


  return (
    <div className='stockDetails'>
      <DetailHeader stockData={stockData}/>
      <div className="board">
        <div className="menuBar">
          <Tabs>
            defaultActiveKey="/chart" as="ul">
            <Tab eventKey="chart" title="chart"></Tab>
            <Tab eventKey="chart" title="chart"><FinancialStatement /></Tab>
            <Tab eventKey="chart" title="chart">fff</Tab>
            <Tab eventKey="chart" title="chart">ggg</Tab>
          </Tabs>
        </div>
        <div className='chart'>
          <StockChart stock_symbol={stock_symbol} />
        </div>
      </div>
    </div>
  )


}


export default StockDetails;
