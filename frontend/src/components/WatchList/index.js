import React, { useContext } from 'react'
import './styles.css'
import { DataContext } from '../../context/DataProvider'

const WatchList = () => {
    const {stockData, setStockData} = useContext(DataContext);

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
    )
}

export default WatchList