

import React, { useState } from 'react'
import {  useTable, useFilters, useRowSelect, useSortBy, usePagination, useExpanded } from 'react-table'
import './style.scss'
import { matchSorter } from 'match-sorter'
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { InputAdornment, TextField } from "@material-ui/core";
import { LeftArrow, RightArrow, CollapseDownIcon, SearchIcon, CollapseIcon } from '../../../assets/icons/index.jsx'
import '../../../styles/style.scss'
import api from "../../services/api";
import { toast } from 'react-toastify';
import { deletaFiles , moveFiles , copiaFiles } from '../../services/functions';
import { FaAngleDoubleRight , FaAngleRight , FaAngleDoubleLeft ,  FaAngleLeft } from 'react-icons/fa'



function TableStatusMachine({ data }) {
  let acessToken = localStorage.getItem("@FlashSafe-token");
  const [md5Details, setMd5Details] = useState('')

  /* ============================================ */
  /* === METODO PARA CONSTRUCAO DO OBSERVADOR === */
  /* ============================================ */
  const [optionSelected, setOptionSelected] = useState();

  let ArrayMd5 = []

  async function getMD5Details(md5) {
    let md5Result = ""
    const headers =
    {
      "tabela": "map_md5",
      "select": "md5='" + md5 + "'",
      "pagina": "1",
      "qt": "100",
      "campos_select_end_point": "md5^grupo_dlp^arquivo^tipo_arquivo^sensibilidade^qt_nomes^qt_cpf^qt_cnpj^qt_rgs^qt_email^qt_cartoes^qt_saude^qt_carteirinha^qt_negocio^qt_outros^desc_ocorrs^dth^qt_lin_tot^qt_lin_sensiveis",
      "get_qt": "100"
    };

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
      .then((response) => {
        md5Result = response.data
        ArrayMd5.push(response.data)
      })
      .catch((err) => {
        toast.error('Ocorreu um erro na requisição', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
      });
        console.error("ops! ocorreu um erro" + err);
      });

    return md5Result;
  }

  const columns = React.useMemo(
    () => [
      /*
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

      }, */
      {
        Header: 'Job',
        accessor: 'job',
      },
      {
        Header: 'Data Hora',
        accessor: 'dth_inicio',
      },
      {
        Header: 'Computer Name',
        accessor: 'computer_name',
      },
      //{
      //  Header: 'Código da Máquina',
      //  accessor: 'cod_maquina',
      //},
      {
        Header: 'Grupo',
        accessor: 'grupo_dlp',
      },
      {
        Header: 'Percentual',
        accessor: 'percentual',

      },
      {
        Header: 'Arq. Descobertos',
        accessor: 'arqs_descobertos',

      },
      {
        Header: 'Arq. Classificados',
        accessor: 'arqs_classificados',

      },

    ],
    []
  )

  /* ==================================================== */
  /* === OPCOES DO SELECT DE DELETAS / MOVER / COPIAR === */
  /* ==================================================== */
  const opcoesSelect = [
    {
      label: "Deletar",
      value: "0",
    },
    {
      label: "Mover",
      value: "1",
    },
    {
      label: "Excluir",
      value: "2",
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


    
  )

  /* ================================================================== */
  /* === METODO RESPONSAVEL POR OBSERVAR A OPCAO ESCOLHIDA NO SELECT === */
  /* ================================================================== */
  function minhaOpcao(event) {
    setOptionSelected(event);

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

      var teste = getIndex(row.values.job, data, "job")

      return (
        <div className="container-subcomponent">
          <div>    <p>fila_profiler: <span> {data[teste]?.fila_profiler}</span></p></div>
          <div>    <p>fila_mapper: <span> {data[teste]?.fila_mapper}</span></p></div>
          <div>   <p>arqs_mapeados: <span> {data[teste]?.arqs_mapeados}</span></p></div>
          <div>  <p>fila_md5: <span> {data[teste]?.fila_md5}</span></p></div>
          <div>  <p>analises_md5: <span> {data[teste]?.analises_md5}</span></p></div>
          <div> <p>arqs_neutros: <span> {data[teste]?.arqs_neutros}</span></p></div>
          <div>  <p>arqs_serios: <span> {data[teste]?.arqs_serios}</span></p></div>
          <div> <p>arqs_graves: <span> {data[teste]?.arqs_graves}</span></p></div>
          <div> <p>arqs_gravissimos: <span> {data[teste]?.arqs_gravissimos}</span></p></div>
          <div> <p>fila_pessoas: <span> {data[teste]?.fila_pessoas}</span></p></div>
          <div> <p>pessoas_mapeadas: <span> {data[teste]?.pessoas_mapeadas}</span></p></div>
          <div> <p>pessoas_cpf: <span> {data[teste]?.pessoas_cpf}</span></p></div>
          <div> <p>pessoas_rg: <span> {data[teste]?.pessoas_rg}</span></p></div>
          <div> <p>pessoas_email: <span> {data[teste]?.pessoas_email}</span></p></div>
          <div>  <p>pessoas_dad_sensiveis: <span> {data[teste]?.pessoas_dad_sensiveis}</span></p></div>
          <div> <p>fila_acoes: <span> {data[teste]?.fila_acoes}</span></p></div>
          <div> <p>acoes_executadas: <span> {data[teste]?.acoes_executadas}</span></p></div>
          <div> <p>total_mbytes: <span> {data[teste]?.total_mbytes}</span></p></div>
          <div> <p>zip: <span> {data[teste]?.zip}</span></p></div>
          <div> <p>text: <span> {data[teste]?.text}</span></p></div>
          <div> <p>pessoas_rg: <span> {data[teste]?.pessoas_rg}</span></p></div>




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
        Verifique o status do Discovery em cada máquina.        </p>
      </div>

      <div className="container-md5">
        <table className="table-statusMachine" {...getTableProps()}>
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
        <button className="botao-paginacao" onClick={() => gotoPage(0)} disabled={!canPreviousPage} >
          <FaAngleDoubleLeft/>
        </button>{' '}
        <button className="botao-paginacao" onClick={() => previousPage()} disabled={!canPreviousPage}>
          <FaAngleLeft/>
        </button>{' '}
        <span style={{fontSize: "16px"}}>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
        <button className="botao-paginacao" onClick={() => nextPage()} disabled={!canNextPage}>
          <FaAngleRight/>
        </button>{' '}
        <button className="botao-paginacao" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
         <FaAngleDoubleRight/>
        </button>{' '}
        <span style={{fontSize: "16px"}}>
          | Ir para página:{' '}
          <input
            className="input-paginacao"
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: "60px", height: "30px" }}
          />
        </span>{' '}
      </div>


    </>
  )
}

export default TableStatusMachine