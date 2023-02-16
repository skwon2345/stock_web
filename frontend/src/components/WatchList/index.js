import React, { useState, useEffect } from 'react'
import './styles.css'
import axios from 'axios';

const WatchList = () => {
    const [stockCards, setStockCards] = useState([])

    useEffect(() => {
        const url = "/api/stock/";
        axios.get(url)
        .then(function(response) {
            console.log(response.data);
            setStockCards(response.data);
        })
        .catch(function(error) {
            console.log("실패");
        })
        
    },[])


    return (
        <div className='watchlist'>
            <ul>
                {stockCards.map((stockCard, index) => {
                    return (
                        <li key={index}>
                            <StockCard 
                                stockCard={stockCard} 
                                id={index}
                            />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}


export const StockCard = ({stockCard}) => {

    const colorClassName = stockCard.change > 0 ? 'red' : 'blue' 
    
    


    return (
        <div className='stockCard'>
                <div className='symbol'>
                    <h2>{stockCard.symbol}</h2>
                    <p>{stockCard.name}</p>
                </div>
            
            <div className='signal'>
                <h3>{stockCard.recommendation_key}</h3>
            </div>
            <div className={`price ${colorClassName}`}>
                <div className='lastPrice'> $ {stockCard.price}</div>
                {/* <div className='change'>{stockCard.change} ({stockCard.percentageChange})</div> */}
            </div>
            
        </div>
    )
}

export default WatchList