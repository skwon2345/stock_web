import {Header, Home} from './components';
import { DataProvider } from './context/DataProvider';

function App() {
  return (
    <div className='App'>
      <Header />
      <DataProvider>
        <Home />
      </DataProvider>
    </div>
  );
}

export default App;
