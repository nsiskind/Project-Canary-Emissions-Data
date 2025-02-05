import React from 'react';
import './App.css';
import MeasuredEmissionsTable from './tables/measuredEmissions';
import EstimatedEmissionsTable from './tables/estimatedEmissions';
import {FetchEstimatedEmissions, FetchMeasuredEmissions} from './services/service'
import { useState, useEffect } from 'react';
import { Loading } from './components/loading';
import ComparedEmissionsTable from './tables/comparedEmissionsTable';


function App() {

  const [loading, setLoading] = useState(true);
  const [measuredData, setMeasuredData] = useState([]);
  const [estimatedData, setEstimatedData] = useState([]);
  
  useEffect(() => {
    async function getMeasueredEmissions() {
      const fetchedData = await FetchMeasuredEmissions();
      setMeasuredData(fetchedData);
    }
    async function getEstimatedEmissions() {
    const fetchedData = await FetchEstimatedEmissions();
      setEstimatedData(fetchedData);
    }
    
    getMeasueredEmissions();
    getEstimatedEmissions();

    setLoading(false);

  }, []);

  const props = {
    loading: loading,
    measuredData: measuredData,
    estimatedData: estimatedData,
  }

  return (
      <div className="App">
        <div>
          <TableSelector {...props} />
        </div>
      </div>
  );
}

export const TableSelector = ({loading, measuredData, estimatedData} ) => {
  const [selectedTable, setSelectedTable] = useState('');

  console.log(measuredData)
  console.log(estimatedData)
  return (
    <div>
      {loading ? <Loading></Loading> :
      <div>
        <h1>I want to...</h1>
        <div>
          <button onClick={() => setSelectedTable('measuredEmissions')}>View Measured Emissions Data</button>
          <button onClick={() => setSelectedTable('estimatedEmissions')}>View Estimated Emissions Data</button>
          <button onClick={() => setSelectedTable('compareEmissions')}>Compare Estimated Emissions Data</button>
        </div>
        <div className="table-container" >
          {selectedTable === 'measuredEmissions' && <MeasuredEmissionsTable data={measuredData}/>}
          {selectedTable === 'estimatedEmissions' && <EstimatedEmissionsTable data={estimatedData} />}
          {selectedTable === 'compareEmissions' && <ComparedEmissionsTable measuredData={measuredData} estimatedData={estimatedData} />}
        </div>
      </div>
      }
  </div>
  );
};

export default App;
