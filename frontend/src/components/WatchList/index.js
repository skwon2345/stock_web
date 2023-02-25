import React, { useEffect, useState } from 'react'
import './styles.css'
import { Link } from 'react-router-dom';
import axios from 'axios';

const WatchList = () => {
    const [stockData, setStockData] = useState([]);

    useEffect(() => {
        async function fetchStockData()  {
            const url = "http://127.0.0.1:8000/api/stock/";
            await axios.get(url)
            .then(function(response) {
                // console.log(response.data);
                setStockData(response.data);
            })
            .catch(function(error) {
                console.log("실패(데이터)");
            })
        }
        fetchStockData();
    },[])

    if (!stockData) {
    return null;
    } 

    return (
        <div className='watchlist'>
            <ul>
                {stockData.map((stock, index) => {
                    return (
                        <li key={index}>
                            <Link to={`/stockdetails/${stock.symbol}`} state={stock.symbol}>
                                <StockCard 
                                    stock={stock} 
                                    id={index}
                                />
                            </Link>
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