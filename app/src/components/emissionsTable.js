import { useTable, useSortBy, useFilters, usePagination, getPaginationRowModel} from 'react-table';
import { useState } from 'react';
import "./emissionsTable.css";

export const EmissionsTable = ({tableData, columns}) => {
 
   const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { sortBy, pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0, pageSize: 25 },
    },    
    useFilters,
    useSortBy,
    usePagination
  );
  
  return (
    <div>
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
          {page.map(row => {
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
      <div className='options'>
        <div className='paginationOptions'>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
        </div>
        <div className='pageSize'>
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageCount}
            </strong>{' '}
          </span>
          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
          >
            {[25, 50, 100].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};