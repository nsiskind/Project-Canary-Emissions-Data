import {EmissionsTable} from '../components/emissionsTable'
import { useMemo } from 'react';

const MeasuredEmissionsTable = ({data}) => {  
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
        Header: 'EquipmentId',
        accessor: 'equipmentId',
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

 export default MeasuredEmissionsTable;

 