import { Header, Home, StockDetails } from './components';
import { DataProvider } from './context/DataProvider';
import { Routes, Route } from "react-router-dom";


function App() {
  return (
    <div className='App'>
      <Header />
      <DataProvider>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/stockdetails" element={<StockDetails />}/>
        </Routes>
      </DataProvider>
    </div>
  );
}

export default App;
