import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom'

import './styles.css';

const StockDetails = () => {
  const [chartData, setChartData] = useState([]);
  const location = useLocation();
  const stock_data = location.state;
  console.log(stock_data)

const callback = useCallback(async () => {
  const url = `/api/candle/?symbol=${stock_data.symbol}&from=1900-01-01&to=2023-02-16`;
  axios.get(url)
  .then(function(response) {
      console.log(response.data);
      setChartData(response.data);
  })
  .catch(function(error) {
      console.log("실패(차트)");
  })
}, [])


  useEffect(() => {
    callback();
  },[])  

  return (
    <div className='stockDetails'>
      <div>{stock_data.name}</div>
    </div>
  )
}

export default StockDetails;
