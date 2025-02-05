import {FetchEstimatedEmissions} from '../services/service'
import {EmissionsTable} from '../components/emissionsTable'
import { useState, useEffect, useMemo } from 'react';
import {Loading} from '../components/loading'

const EstimatedEmissionsTable = ({data}) => {

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

  return (
    <div>
      <EmissionsTable tableData={data} columns={columns} />
    </div>
  )
};

 export default EstimatedEmissionsTable;


