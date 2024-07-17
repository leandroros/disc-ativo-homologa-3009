

import React from 'react'
import {
  useTable, useFilters, useRowSelect, useSortBy, usePagination, useExpanded
} from 'react-table'
import './style.scss'
import { matchSorter } from 'match-sorter'
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import {
  SearchIcon,
} from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import { LeftArrow, RightArrow, CollapseDownIcon, CollapseIcon } from '../../../assets/icons/index'
import '../../../styles/style.scss'

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input className="checkbox-table" type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    )
  }
)



function TablePerson({ data, personName }) {



  const columns = React.useMemo(
    () => [
       {
         // Make an expander cell
         Header: () => null, // No header
         id: 'expander', // It needs an ID
         Cell: ({ row }) => (
           // Use Cell to render an expander for each row.
           // We can use the getToggleRowExpandedProps prop-getter
           // to build the expander.
           <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? <CollapseDownIcon/> : <CollapseIcon/>}
           </span>
         ),

       },
      {
        Header: 'MD5',
        accessor: 'md5',
      },
      {
        Header: 'nome',
        accessor: 'nome',
      },
      {
        Header: 'cpf',
        accessor: 'cpf',

      },
      {
        Header: 'E-mail',
        accessor: 'email',

      },
      {
        Header: 'Carteirinha',
        accessor: 'carteirinha',

      },
      // {
      //   Header: 'base_legal',
      //   accessor: 'base_legal',

      // },

    ],
    []
  )
  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row?.[id]] })
  }

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val


  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize },

  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useSortBy,

    useExpanded, usePagination, useRowSelect,


    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )


  // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length

    return (<>


      <TextField
        variant="outlined"

        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Procurar em ${count} registros`}
        InputProps={{
          disableUnderline: true,
          className: "input-search-table",
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </>
    )
  }


  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
      function getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][prop] === value) {
            return i;
          }
        }
        return -1; //to handle the case where the value doesn't exist
      }


      
      var teste = getIndex(row.values.md5, data, "md5")

      return (
        <div className="container-subcomponent">
          <div>    <p>Máquina: <span> {data[teste]?.maquina}</span></p></div>
          <div>   <p> Endereço: <span> {data[teste]?.endereco}</span></p></div>
          <div>  <p>Cartão: <span> {data[teste]?.cartao}</span></p></div>
          <div>  <p>Carteirinha: <span> {data[teste]?.carteirinha}</span></p></div>

          <div>  <p>RG: <span> {data[teste]?.rg}</span></p></div>

          <div>  <p>Grupo DLP: <span> {data[teste]?.grupo_dlp}</span></p></div>
          <div>  <p>Fonetico: <span> {data[teste]?.fonetico}</span></p></div>
          <div>  <p>Consentimentos: <span> {data[teste]?.consentimentos}</span></p></div>


          
        </div>

      )


    },

    []
  )



  console.log(selectedFlatRows)
  // Render the UI for your table
  return (
    <div>


      <div className="header-table">
        <p>
        Veja todos os arquivos em que o nome "{personName}" aparece.   </p>
      </div>
      <div className="menu-header-result-archive">
        <div>
          <button className="button-header-table">  Selecionar tudo </button>  |       <button className="button-header-table"> Desmarcar tudo </button> | <span className="selected-items"> <span className="selected-dark">{selectedFlatRows.length} </span>itens selecionados</span>

        </div>

        <div className="select-top-left-table" >
          <label>Ações:</label>
          <select>
            <option value="valor1">Selecionar ação</option>
            <option value="valor1">Mover</option>
            <option value="valor1">Copiar</option>
            <option value="valor1">Anonimizar</option>
            <option value="valor1">Pseudo-anonimizar</option>

          </select>

          {/* <label>Drivers:</label>
          <select>
            <option value="valor1">C:</option>

            <option value="valor1">D:</option>

          </select> */}
          <button className="button-send-param"> Enviar </button>
        </div>

      </div>
      <div className="container-person">
        <table className="table-person" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (<>
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span className="table-filters">
                      {column.isSorted ? (column.isSortedDesc ? <ArrowDropDown /> : <ArrowDropUp />) : ''}
                    </span>


                  </th>
                </>
                ))}
              </tr>
            ))}

          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row)
              return (
                // Use a React.Fragment here so the table markup is still valid
                <React.Fragment {...row.getRowProps()}>
                  <tr>
                    {row.cells.map(cell => {
                      return (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      )
                    })}
                  </tr>
                  {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                  {row.isExpanded ? (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
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


    </div>
  )
}

export default TablePerson