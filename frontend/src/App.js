import { Header, Home, StockDetails } from './components';
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/stockdetails/:symbol" element={<StockDetails />}/>
        </Routes>
    </div>
  );
}

export default App;
