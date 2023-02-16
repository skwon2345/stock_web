import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WatchList from '../WatchList'
import StockDetails from '../StockDetails'
import './styles.css'

const Home = () => {
  return (
    <div className='Home'>
        {/* <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/stockDetails" element={<StockDetails />}/>
            </Routes>
        </BrowserRouter> */}
        <WatchList />
        <StockDetails />
    </div>
  )
}

export default Home