import React, { useContext } from 'react'
import './styles.css'
import { DataContext } from '../../context/DataProvider'
import { Link } from 'react-router-dom';

const WatchList = () => {
    const {stockData} = useContext(DataContext);

    return (
        <div className='watchlist'>
            <ul>
                {stockData.map((stock, index) => {
                    return (
                        <li key={index}>
                            <StockCard 
                                stock={stock} 
                                id={index}
                            />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export const StockCard = ({stock}) => {

    function toTitleCase(str) {
        return str.toLowerCase().split(' ').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }

    return (
        <Link to="/stockdetails">
            <div className='stockCard'>
                <div className='symbols'>
                    <div className='symbol'>{stock.symbol}</div>
                    <div className='name'>{stock.name}</div>
                </div>
                <div className='signal'>
                    <h3>{toTitleCase(stock.recommendation_key)}</h3>
                </div>
                <div className='price'>
                    <div className='lastPrice'> $ {stock.price}</div>
                </div>
            </div>
        </Link>
    )
}

export default WatchList