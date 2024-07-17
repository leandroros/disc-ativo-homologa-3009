
import React, { useState } from 'react'
import {
  useTable, useFilters, useRowSelect, useSortBy, usePagination, useExpanded
} from 'react-table'
import './style.scss'
import { matchSorter } from 'match-sorter'
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import {
  CollapseDownIcon,
  CollapseIcon,
  SearchIcon,
} from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import { LeftArrow, RightArrow } from '../../../assets/icons/index'
import '../../../styles/style.scss'
import api from "../../services/api";

import { deletaFiles } from '../../services/functions';
import { moveFiles } from '../../services/functions';
import { copiaFiles } from '../../services/functions';

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

function TableMD5({ data }) {
  let acessToken = localStorage.getItem("@FlashSafe-token");
  const [md5Details, setMd5Details] = useState('')

  /* ============================================ */
  /* === METODO PARA CONSTRUCAO DO OBSERVADOR === */
  /* ============================================ */
  const [optionSelected, setOptionSelected] = useState();

  let ArrayMd5 = []



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
        Header: 'md5',
        accessor: 'md5',
      },
      {
        Header: 'nome do arquivo',
        accessor: 'arquivo',
      },
      {
        Header: 'Grupo_dlp',
        accessor: 'grupo_dlp',

      },
      {
        Header: 'qt_nomes',
        accessor: 'qt_nomes',

      },
      {
        Header: 'sensibilidade',
        accessor: 'sensibilidade',

      },

    ],
    []
  )

  /* ==================================================== */
  /* === OPCOES DO SELECT DE DELETAS / MOVER / COPIAR === */
  /* ==================================================== */
  const opcoesSelect = [
    {
      label: "Selecione uma opção",
      value: "4",
    },
    /*{
      label: "Quarentena",
      value: "0",
    },*/
    {
      label: "Mover",
      value: "1",
    },
    {
      label: "Copiar",
      value: "2",
    },
    {
      label: "Anonimizar",
      value: "3",
    },
    {
      label: "Pseudo-Anonimizar",
      value: "5",
    },
  ];

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
      initialState: { pageIndex: 0, pageSize: 1 },
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

  /* ================================================================== */
  /* === METODO RESPONSAVEL POR OBSERVAR A OPCAO ESCOLHIDA NO SELECT === */
  /* ================================================================== */
  function minhaOpcao(event) {
    setOptionSelected(event);

  }

  /* ============================================== */
  /* === METODO RESPONSAVEL POR DELETAR ARQUIVOS === */
  /* ============================================== */
  async function deletarArquivos(acessToken, selectedFlatRows) {
    await deletaFiles(acessToken, selectedFlatRows);

  }

  /* ============================================ */
  /* === METODO RESPONSAVEL POR MOVER ARQUIVOS === */
  /* ============================================ */
  async function moverArquivos(acessToken, obj) {
    let resultado = [];

    resultado = await moveFiles(acessToken, obj);
    
  }

  /* ============================================= */
  /* === METODO RESPONSAVEL POR COPIAR ARQUIVOS === */
  /* ============================================= */
  async function copiarArquivos(acessToken, obj) {
    let resultado = [];

    resultado = await copiaFiles(acessToken, obj);
    
  }

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
          <div>    <p>Data: <span> {data[teste]?.dth}</span></p></div>
          <div>    <p>Quantidade de carteirinha: <span> {data[teste]?.qt_carteirinha}</span></p></div>
          <div>   <p>Quantidade de cartões: <span> {data[teste]?.qt_cartoes}</span></p></div>
          <div>  <p>Quantidade de CNPJ: <span> {data[teste]?.qt_cnpj}</span></p></div>
          <div>  <p>Quantidade de CPF: <span> {data[teste]?.qt_cpf}</span></p></div>
          <div> <p>Quantidade de E-mail: <span> {data[teste]?.qt_email}</span></p></div>
          <div>  <p>Quantidade de linhas sensíveis: <span> {data[teste]?.qt_lin_sensiveis}</span></p></div>
          <div> <p>Quantidade de linhas totais: <span> {data[teste]?.qt_lin_tot}</span></p></div>
          <div> <p>Quantidade de negócio: <span> {data[teste]?.qt_negocio}</span></p></div>
          <div> <p>Quantidade de nomes: <span> {data[teste]?.qt_nomes}</span></p></div>
          <div> <p>Quantidade de outros: <span> {data[teste]?.qt_outros}</span></p></div>
          <div> <p>Quantidade de rg: <span> {data[teste]?.qt_rgs}</span></p></div>
          <div> <p>Quantidade de saúde: <span> {data[teste]?.qt_saude}</span></p></div>

        </div>

      )


    },

    []
  )

  // console.log(`Itens selecionados: ${selectedFlatRows}`) // VARIAVEL RESPONSAVEL POR ARAMAZENAS OS ITENS SELECIONADOS

  // Render the UI for your table
  return (
    <>
    
      <div className="header-table">
        <p>
          Selecione os arquivos desejados.
        </p>
      </div>
      <div className="menu-header-result-archive">
        <div>
          <button className="button-header-table">  Selecionar tudo </button>  |       <button className="button-header-table"> Desmarcar tudo </button> | <span className="selected-items"> <span className="selected-dark">{selectedFlatRows.length} </span>itens selecionados</span>

        </div>
        
        <div className="select-top-left-table" >

          {/* SELECT DELETA / MOVE / COPIA */}
          <label>Ações:</label>
          <select onChange={ (e) => minhaOpcao(e.target.value)} >
            {opcoesSelect.map((option) => (
              <option value={option.value}>{option.label}</option>
            ))}
          </select>

          {/* <label>Drivers:</label>
          <select>
            <option value="valor1">C:</option>

            <option value="valor1">D:</option>

          </select> */}
          <button className="button-send-param" > Enviar </button>
        </div>

      </div>
      <div className="container-md5">
        <table className="table-md5" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (<>
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span className="table-filters">
                      {column.isSorted ? (column.isSortedDesc ? <ArrowDropDown /> : <ArrowDropUp />) : ''}
                    </span>
                    {/* Render the columns filter UI */}
                    <div>{column.canFilter ? column.render("Filter") : null}</div>

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


    </>
  )
}

export default TableMD5