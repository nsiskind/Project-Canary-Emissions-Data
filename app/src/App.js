import React from 'react';
import './App.css';
import MeasuredEmissionsTable from './pages/measuredEmissionsTable';
import EstimatedEmissionsTable from './pages/estimatedEmissionsTable';
import ComparedEmissionsTable from './pages/comparedEmissionsTable';
import MeasuredEmissionsForm from './pages/measuredEmissionsForm';
import EstimatedEmissionsForm from './pages/estimatedEmissionsForm';
import {FetchEstimatedEmissions, FetchMeasuredEmissions} from './services/service'
import { useState, useEffect } from 'react';
import { Loading } from './components/loading';


function App() {

  const [loading, setLoading] = useState(true);
  const [dataDidUpdate, setDataDidUpdate] = useState(true)
  const [measuredData, setMeasuredData] = useState([]);
  const [estimatedData, setEstimatedData] = useState([]);
  
  useEffect(() => {
    async function getMeasueredEmissions() {
      const measured = await FetchMeasuredEmissions();
      setMeasuredData(measured);
    }
    async function getEstimatedEmissions() {
    const estimated = await FetchEstimatedEmissions();
      setEstimatedData(estimated);
    }
    
    if (dataDidUpdate) {
      getMeasueredEmissions();
      getEstimatedEmissions();
    }
    
    setLoading(false);
    setDataDidUpdate(false)

  }, [dataDidUpdate]);

  const props = {
    loading: loading,
    measuredData: measuredData,
    estimatedData: estimatedData,
    setDataDidUpdate: setDataDidUpdate,
  }

  return (
      <div className="App">
        <div>
          <TableSelector {...props} />
        </div>
      </div>
  );
}

export const TableSelector = ({loading, measuredData, estimatedData, setDataDidUpdate} ) => {
  const [selectedTable, setSelectedTable] = useState('');
  return (
    <div>
      {loading ? <Loading></Loading> :
      <div>
        <h1>I want to...</h1>
        <div>
          <button className='button' onClick={() => setSelectedTable('measuredEmissions')}>View Measured Emissions Data</button>
          <button  className='button' onClick={() => setSelectedTable('estimatedEmissions')}>View Estimated Emissions Data</button>
          <button  className='button' onClick={() => setSelectedTable('compareEmissions')}>Compare Estimated Emissions Data</button>
          <button  className='button' onClick={() => setSelectedTable('addMeasuredEmissions')}>Add Measured Emissions Data</button>
          <button  className='button' onClick={() => setSelectedTable('addEstimatedEmissions')}>Add Estimated Emissions Data</button>
        </div>
        <div className="table-container" >
          {selectedTable === 'measuredEmissions' && <MeasuredEmissionsTable data={measuredData}/>}
          {selectedTable === 'estimatedEmissions' && <EstimatedEmissionsTable data={estimatedData} />}
          {selectedTable === 'compareEmissions' && <ComparedEmissionsTable measuredData={measuredData} estimatedData={estimatedData} />}
          {selectedTable === 'addMeasuredEmissions' && <MeasuredEmissionsForm setDataDidUpdate={setDataDidUpdate}/>}
          {selectedTable === 'addEstimatedEmissions' && <EstimatedEmissionsForm setDataDidUpdate={setDataDidUpdate}/>}
        </div>
      </div>
      }
  </div>
  );
};

export default App;
