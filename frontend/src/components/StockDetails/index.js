import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { StockChart } from './StockChart'
import { ChakraProvider, CircularProgress} from '@chakra-ui/react'
import './styles.css';

export const StockDetails = () => {
  const stock = useLocation().state;
  const [active, setActive] = useState("chart")
  const [isLoading, setLoading] = useState(true);

  console.log(active)

  const DetailHeader = () => {
    return (
      <div className="header">
        {stock.symbol}
      </div>
    )
  }

  const clickHandler = (e, menu) => {
    e.preventDefault();
    setActive(menu);
    setLoading(true);
  }

  return (
    <div className='stockDetails'>
      <ChakraProvider>
        <DetailHeader />
        <div className="board">
            <div className="menuBar">
              <ul>
                  <li onClick={(e) => clickHandler(e, "chart")}>Chart</li>
                  <li onClick={(e) => clickHandler(e, "finance")}>Finance</li>
                  <li onClick={(e) => clickHandler(e, "insider")}>Insider</li>
                  <li onClick={(e) => clickHandler(e, "news")}>News</li>
              </ul>
              </div>
          <div>
            {active === "chart" && 
              <div className="chart">
                {isLoading && <CircularProgress isIndeterminate color="teal.300" paddingTop="200px" />}
                <StockChart stock_symbol={stock.symbol} isLoading={isLoading} setLoading={setLoading} active={active}/>
              </div>
            }
            {active === "finance" &&  <FinancialStatement />}
            {active === "insider" &&  <InsiderTrade />}
            {active === "news" &&  <News />}
          </div>
        </div>
      </ChakraProvider>
    </div>
  )
}

export const FinancialStatement = () => {
  const stock = useLocation().state;
  console.log(stock);
  return (
    <div className='financialStatement'>
      {stock.symbol} financial statement
    </div>
  )
}

export const InsiderTrade = () => {
  const stock = useLocation().state;

  return (
    <div className='insiderTrade'>
      InsiderTrade {stock.symbol}
    </div>
  )
}

export const News = () => {
  const stock = useLocation().state;

  return (
    <div className='news'>
      News {stock.symbol}
    </div>
  )
}