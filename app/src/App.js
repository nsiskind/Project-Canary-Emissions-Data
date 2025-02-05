import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import EmissionsTable from './tables/measuredEmissions';
import { useTable } from 'react-table';


function App() {
  return (
      <div className="App">
        <EmissionsTable/>
      </div>
  );
}

export default App;
