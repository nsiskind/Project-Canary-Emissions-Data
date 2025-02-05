import {FetchEstimatedEmissions} from '../services/service'
import {EmissionsTable} from '../components/emissionsTable'
import { useState, useEffect, useMemo } from 'react';
import {Loading} from '../components/loading'

const ComparedEmissionsTable = ({measuredData, estimatedData}) => {

   // Column definitions for react-table
   const columns = useMemo(
     () => [
        {
            Header: 'Latitude',
            accessor: 'latitude',
        },
        {
            Header: 'Longitude',
            accessor: 'longitude',
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
            Header: 'MethaneInKg',
            accessor: 'methaneInKg',
        },
     ],
     []
   );

   console.log(getComparedRows(measuredData, estimatedData))

  return (
    <div>
      <EmissionsTable tableData={estimatedData} columns={columns} />
    </div>
  )
};

const getComparedRows = (measuredData, estimatedData) => {
  
  let measuredMap = {}
  for (let row of measuredData) {
    let key = row['latitude'] + row['longitude']
    if (key in measuredMap) {
      measuredMap[key][row["start"] + "," + row["end"]] = 0
    } else {
      measuredMap[key] = {}
      measuredMap[key][row["start"] + "," + row["end"]] = 0
    }

  }

  
  for (let row of estimatedData) {
    let key = row['latitude'] + row['longitude']

    let start = new Date(row['start'])
    let end = new Date(row['end'])
    
    let methane = row['methaneInKg']   
    
    if (key in measuredMap) {
      for (let estKey in measuredMap[key]) {

        let splitKey = estKey.split(",")
        let estStart = new Date(splitKey[0])
        let estEnd = new Date(splitKey[1])

        if ((start >= estStart) && (end < estEnd)) {
          measuredMap[key][estKey] += methane
        }
      }
    }
  }

  console.log(measuredData)
  console.log(measuredMap)

  for (let i = 0; i < measuredData.length; i++) {

    let key = measuredData[i]['latitude'] + measuredData[i]['longitude']
    let timeKey = measuredData[i]['start'] + "," + measuredData[i]['end']

    if (key in measuredMap) {
      if (timeKey in measuredMap[key]) {
        measuredData[i]['expectedMethaneInKg'] =  measuredMap[key][timeKey]
        measuredData[i]['difference'] = Number(measuredData[i]['latitude']) - measuredMap[key][timeKey]
      }
    }
  }
  console.log(measuredData)

  return measuredData

}



 export default ComparedEmissionsTable;


