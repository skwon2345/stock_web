import React, { useState } from 'react'
import './styles.css'

const WatchList = () => {
    const [stockCards, setStockCards] = useState([
        {
            symbol: "Tesla, Inc. (TSLA)",
            lastPrice: 101.16,
            change: +1.46,
            percentageChange: "+1.46%",
            // graph: "",
            signal: "STRONG BUY"
        },
        {
            symbol: "Tesla, Inc. (TSLA)",
            lastPrice: 101.16,
            change: +1.46,
            percentageChange: "+1.46%",
            // graph: "",
            signal: "STRONG BUY"
        },
        {
            symbol: "Tesla, Inc. (TSLA)",
            lastPrice: 101.16,
            change: +1.46,
            percentageChange: "+1.46%",
            // graph: "",
            signal: "STRONG BUY"
        },
    ]);

    return (
        <div className='watchlist'>
            <ul>
                {stockCards.map((stockCard, index) => {
                    return (
                        <li>
                            <StockCard 
                                stockCard={stockCard} 
                                key={index}
                            />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}


export const StockCard = ({stockCard, key}) => {
    return (
        <div className='stockCard'>
            <div className='symbol'>
                <h1>{stockCard.symbol}</h1>
            </div>
            <div className='signal'>
                <h3>{stockCard.signal}</h3>
            </div>
            <div className='price'>
                <div className='lastPrice'> $ {stockCard.lastPrice}</div>
                <div className='change'>{stockCard.change} ({stockCard.percentageChange})</div>
            </div>
        </div>
    )
}

export default WatchList