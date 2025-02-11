import {EmissionsTable} from '../components/emissionsTable'
import { useMemo } from 'react';
import './pages.css'

const EstimatedEmissionsTable = ({data}) => {

   const columns = useMemo(
     () => [
        {
          Header: 'Site',
          accessor: 'site',
        },
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
      <div className='header'>Estimated Emissions Table</div>
      <EmissionsTable tableData={data} columns={columns} />
    </div>
  )
};

 export default EstimatedEmissionsTable;


