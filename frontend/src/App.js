import { Header, Home,  } from './components';
import { Routes, Route} from "react-router-dom";
import { FinancialStatement, InsiderTrade, News, StockDetails } from './components/StockDetails';

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
