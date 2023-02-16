import {Header, StockDetails, WatchList} from './components';
import { DataProvider } from './context/DataProvider';

function App() {
  return (
    <div className='App'>
      <Header />
      <DataProvider>
        <WatchList />
        <StockDetails />
      </DataProvider>
    </div>
  );
}

export default App;
