import {EmissionsTable} from '../components/emissionsTable'
import { useMemo } from 'react';
import './pages.css'

const ComparedEmissionsTable = ({measuredData, estimatedData}) => {

   // Column definitions for react-table
   const columns = useMemo(
     () => [
        {
          Header: 'Site',
          accessor: 'site',
        },
        {
            Header: 'Start',
            accessor: 'start',
        },
        {
            Header: 'End',
            accessor: 'end',
        },
        {
            Header: 'EquipmentGroupName',
            accessor: 'equipmentGroupName',
        },
        {
            Header: 'Actual Methane (Kg)',
            accessor: 'methaneInKg',
        },
        {
          Header: 'Expected Methane (Kg)',
          accessor: 'expectedMethaneInKg',
        },
        {
          Header: 'Difference',
          accessor: 'difference',
        },
     ],
     []
   );

   const reducedData = useMemo(() => {
    return measuredData.reduce((accumulator, current) => {
      const existing = accumulator.find(
        (item) => item.site === current.site && 
        item.equipmentGroupName === current.equipmentGroupName &&  
        item.start === current.start  && 
        item.end === current.end
      );

      if (existing) {
        existing.methaneInKg = (parseFloat(current.methaneInKg) + parseFloat(existing.methaneInKg)).toFixed(9);
      } else {
        accumulator.push({ ...current });
      }
      return accumulator;
    }, []); 
  }, [measuredData]);

   let comparedRows = getComparedRows(reducedData, estimatedData)

  return (
    <div>
      <div className='header'>Compare Emissions by Equipment, Site, and Time</div>
      <EmissionsTable tableData={comparedRows} columns={columns} />
    </div>
  )
};

const getComparedRows = (measuredData, estimatedData) => {
  
  // add measured ranges together for site
  let measuredMap = {}
  for (let row of measuredData) {
    let key = row['site'] + row['equipmentGroupName']
    if (key in measuredMap) {
      measuredMap[key][row["start"] + "," + row["end"]] = 0
    } else {
      measuredMap[key] = {}
      measuredMap[key][row["start"] + "," + row["end"]] = 0
    }

  }

  // Add estimate ranges to larger measured ranges
  for (let row of estimatedData) {
    let key = row['site'] + row['equipmentGroupName']

    let start = new Date(row['start'])
    let end = new Date(row['end'])
    
    let methane = row['methaneInKg']   
    
    if (key in measuredMap) {
      for (let estKey in measuredMap[key]) {

        let splitKey = estKey.split(",")
        let estStart = new Date(splitKey[0])
        let estEnd = new Date(splitKey[1])

        if ((start >= estStart) && (end <= estEnd)) {
          measuredMap[key][estKey] += parseFloat(methane)
        }
      }
    }
  }

  for (let i = 0; i < measuredData.length; i++) {

    let key = measuredData[i]['site'] + measuredData[i]['equipmentGroupName']
    let timeKey = measuredData[i]['start'] + "," + measuredData[i]['end']

    if (key in measuredMap) {
      if (timeKey in measuredMap[key]) {
        measuredData[i]['expectedMethaneInKg'] =  measuredMap[key][timeKey] === 0 ? 'n/a' : measuredMap[key][timeKey].toFixed(9)
        measuredData[i]['difference'] = measuredMap[key][timeKey] === 0 ? 'n/a' : (parseFloat(measuredData[i]['methaneInKg']) - measuredMap[key][timeKey]).toFixed(9)
      }
      continue
    }
    measuredData[i]['expectedMethaneInKg'] = 'n/a'
    measuredData[i]['difference'] = 'n/a'
  }
  return measuredData
}

export default ComparedEmissionsTable;
