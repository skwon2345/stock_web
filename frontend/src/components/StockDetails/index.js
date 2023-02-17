import React from 'react';
import { useParams} from 'react-router-dom';
import { DataContext } from '../../context/DataProvider'
import './styles.css';

const StockDetails = () => {
    const symbol  = useParams().symbol;
    console.log(symbol)
  
    return (
      <div className='stockDetails'>
        <div>{symbol}</div>
      </div>
  )
}

export default StockDetails;
