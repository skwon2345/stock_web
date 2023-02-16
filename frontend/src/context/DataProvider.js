import React, { useState, useEffect, createContext} from "react";
import axios from 'axios';

export const DataContext = createContext();

export const DataProvider = (props) => {
    const [stockData, setStockData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const url = "/api/stock/";
            axios.get(url)
            .then(function(response) {
                console.log(response.data);
                setStockData(response.data);
            })
            .catch(function(error) {
                console.log("실패");
            })
        }
        fetchData();
    },[])

    return (
        <DataContext.Provider value={{stockData, setStockData: setStockData}}>
            {props.children}
        </DataContext.Provider>
    )
}


