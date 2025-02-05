import { useTable, useSortBy } from 'react-table';
import {FetchMeasuredEmissions} from '../services/service'
import { useState, useEffect, useMemo } from 'react';

const EmissionsTable = () => {
   // State to store the fetched data
   const [data, setData] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
 
   // Fetch data when the component mounts
   useEffect(() => {
     async function getEmissions() {
       const fetchedData = await FetchMeasuredEmissions();
       setData(fetchedData);
       setLoading(false);
     }
 
     getEmissions();
   }, []);

   console.log(data)
 
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
 
   // Initialize react-table with the data and columns
   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
     columns,
     data,
   },
   useSortBy);
 
   // Display a loading message if the data is being fetched
   if (loading) {
     return <div>Loading...</div>;
   }
 
   // Display an error message if something went wrong
   if (error) {
     return <div>Error: {error}</div>;
   }
 
   return (
     <table {...getTableProps()} style={{ width: '100%', border: '1px solid black' }}>
       <thead>
         {headerGroups.map(headerGroup => (
           <tr {...headerGroup.getHeaderGroupProps()}>
             {headerGroup.headers.map(column => (
               <th {...column.getHeaderProps()} style={{ border: '1px solid black', padding: '8px' }}>
                 {column.render('Header')}
               </th>
             ))}
           </tr>
         ))}
       </thead>
       <tbody {...getTableBodyProps()}>
         {rows.map(row => {
           prepareRow(row);
           return (
             <tr {...row.getRowProps()}>
               {row.cells.map(cell => {
                 return (
                   <td {...cell.getCellProps()} style={{ border: '1px solid black', padding: '8px' }}>
                     {cell.render('Cell')}
                   </td>
                 );
               })}
             </tr>
           );
         })}
       </tbody>
     </table>
   );
  }

 export default EmissionsTable;