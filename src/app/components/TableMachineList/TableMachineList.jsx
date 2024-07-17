import React from 'react'
import { useTable, usePagination } from 'react-table'
import './style.scss'
import { LeftArrow, RightArrow } from '../../../assets/icons/index'

function TableMachineList({ columns, data }) {

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <div className="container-tableMachine content-scroll">
        <table className="tableMachine" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr  {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr  {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        Página

        <button className="button-pagination" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <LeftArrow />
          <LeftArrow />

        </button>
        <button className="button-pagination" onClick={() => previousPage()} disabled={!canPreviousPage}>
          <LeftArrow />
        </button>
        <input value={pageIndex + 1} className="input-pagination"></input>

        <button className="button-pagination" onClick={() => nextPage()} disabled={!canNextPage}>
          <RightArrow />
        </button>
        <button className="button-pagination" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <RightArrow />
          <RightArrow />

        </button>
        <span>
          de {pageOptions.length}
        </span>

        <span> | Visualizar</span>
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  )
}

export default TableMachineList