import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams} from 'react-router-dom';
import { DataContext } from '../../context/DataProvider'
import axios from 'axios';

import './styles.css';

const StockDetails = () => {
  const [chartData, setChartData] = useState([]);
  const {stockData} = useContext(DataContext);
  const symbol  = useParams().symbol;
  const [stock] =  stockData.filter(stock => { return stock.symbol === symbol})

const callback = useCallback(async () => {
  const url = `/api/candle/?symbol=${stock.symbol}&from=1900-01-01&to=2023-02-16`;
  axios.get(url)
  .then(function(response) {
      console.log(response.data);
      setChartData(response.data);
  })
  .catch(function(error) {
      console.log("실패(차트)");
  })
}, [stock])


  useEffect(() => {
    callback();
  },[])  

  return (
    <div className='stockDetails'>
      <div>{stock.name}</div>
    </div>
  )
}

export default StockDetails;
