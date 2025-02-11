import { useTable, useSortBy, useFilters} from 'react-table';
import { useState } from 'react';
import "./emissionsTable.css";

export const EmissionsTable = ({tableData, columns}) => {

    const [data, setData] = useState(tableData);
 
   const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data,
    },    
    useFilters,
    useSortBy
  );
  
  return (
    <table {...getTableProps()} style={{ width: '100%', border: '1px solid black' }}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th key={column.id}>
                <span key={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: sortBy.some(sort => sort.id === column.id)
                      ? '#f0f0f0'
                      : '#fff',
                  }}
                >
                  {column.render('Header')}
                  <span>
                    {sortBy.length > 0 && column.id === sortBy[0]?.id ? (
                      sortBy[0]?.desc ? ' 🔽' : ' 🔼'
                    ) : ''}
                  </span>
                </span>
                <input
                        className={"filterInput"}
                        type="text"
                        value={column.filterValue || ""}
                        onChange={e => column.setFilter(e.target.value)}
                        placeholder="Filter…"
                    />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr td key={row.id} {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td key={cell.row.id + cell.column.id} {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};