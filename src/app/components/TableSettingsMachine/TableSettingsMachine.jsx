import React, { useState } from 'react'
import {
  useTable, useFilters, useRowSelect, useSortBy, usePagination, useExpanded
} from 'react-table'
import './style.scss'
import { matchSorter } from 'match-sorter'
import { ArrowDropDown, ArrowDropUp, Refresh } from '@material-ui/icons';
import { SearchIcon } from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import { LeftArrow, RightArrow, CollapseDownIcon, CollapseIcon } from '../../../assets/icons/index'
import '../../../styles/style.scss'
import api from "../../services/api";
import { toast } from 'react-toastify';
import { FaAngleDoubleRight , FaAngleRight , FaAngleDoubleLeft ,  FaAngleLeft } from 'react-icons/fa'
import { atualizaMaquina , getJson , putJson } from '../../services/functions';


function TableSettingsMachine({ data }) {
  let acessToken = localStorage.getItem("@FlashSafe-token");
  const [md5Details, setMd5Details] = useState('')
  const [driveINserido, setDriveInserido] = useState('')
  const [carregamento, setCarregamento] = useState('')
  let driveSelecionado = '';

  let ArrayMd5 = []

  const hourList = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"]

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
            {row.isExpanded ? <CollapseDownIcon /> : <CollapseIcon />}
          </span>
        ),

      }, 
      {
        Header: 'Computador',
        accessor: 'computer_name',
      },
      {
        Header: 'Máquina',
        accessor: 'maquina',
      },
      {
        Header: 'Último Job',
        accessor: 'ult_job',
      },
      {
        Header: 'Grupo_dlp',
        accessor: 'grupo_dlp',

      },/* 
      {
        Header: 'Status',
        accessor: 'status',

      }, */
      {
        Header: 'Drivers',
        accessor: 'drives',

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

  function handleDriveInserido(event) {
    // console.log(`DRIVE DIGITADO: ${event}`);
    driveSelecionado = event;
    setDriveInserido(event);

    // console.log(`DRIVE SELECIONADO: ${driveSelecionado}`);
    
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

  async function enviarDados(objeto) {

    /*********************************
    * PEGA O JSON DO BANCO E ATUALIZA COM O CAMPO 'PASTASDISCOVERY' COM O VALOR INFORMADO NA TELA
    *********************************/    
    
    //PEGA O JSON COMPLETO
    let bdJson = await getJson(objeto.original.computer_name);

    let jsonJ1 = JSON.parse(atob(bdJson.base64_j1));
    delete jsonJ1.pastasDiscovery;

    let jsonJ2 = { pastasDiscovery: driveSelecionado, }

    let json3 = atob(bdJson.base64_j3);
    let trataJson3 = json3.replace(/\[|\]/g, '');

    //CODIFICA OS J NOVAMENTE PARA BASE64
    let codificaJ1 = btoa(JSON.stringify(jsonJ1))
    let codificaJ2 = btoa(JSON.stringify(jsonJ2))
    let codificaJ3 = btoa(trataJson3)

     const dadosJson = {
      grupo_dlp: bdJson.grupo_dlp,
      computer_name: "^" + bdJson.maquina,
      maquina: bdJson.maquina + ",",
      base64_j1: codificaJ1,
      base64_j2: codificaJ2,
      base64_j3: codificaJ3,
    } 

    putJson(dadosJson) 

    let obj = {
      "maquina": objeto.original.maquina,
      "ult_job": objeto.original.ult_job,
      "status": objeto.original.status,
      "cliente": objeto.original.cliente,
      "grupo_dlp": objeto.original.grupo_dlp,
      "drives": driveSelecionado,
      "computer_name": objeto.original.computer_name,
      "dth_inicio": new Date().getFullYear() +'-'+ ( new Date().getMonth() + 1) +'-'+ new Date().getDate() +" "+ new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds(),
      "dth_atualizacao": new Date().getFullYear() +'-'+ ( new Date().getMonth() + 1) +'-'+ new Date().getDate() +" "+ new Date().getHours() +":"+ new Date().getMinutes() +":"+ new Date().getSeconds(),
      "hora0": objeto.original.hora0,
      "hora1": objeto.original.hora1,
      "hora2": objeto.original.hora2,
      "hora3": objeto.original.hora3,
      "hora4": objeto.original.hora4,
      "hora5": objeto.original.hora5,
      "hora6": objeto.original.hora6,
      "hora7": objeto.original.hora7,
      "hora8": objeto.original.hora8,
      "hora9": objeto.original.hora9,
      "hora10": objeto.original.hora10,
      "hora11": objeto.original.hora11,
      "hora12": objeto.original.hora12,
      "hora13": objeto.original.hora13,
      "hora14": objeto.original.hora14,
      "hora15": objeto.original.hora15,
      "hora16": objeto.original.hora16,
      "hora17": objeto.original.hora17,
      "hora18": objeto.original.hora18,
      "hora19": objeto.original.hora19,
      "hora20": objeto.original.hora20,
      "hora21": objeto.original.hora21,
      "hora22": objeto.original.hora22,
      "hora23": objeto.original.hora23
    }

    //ATUALIZA A TABELA map_maquinas 
    atualizaMaquina(obj);
  }

  const renderRowSubComponent = React.useCallback(
    ({ row }) => {
    /* 
      function getIndex(value, arr, prop) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i][prop] === value) {
            return i;
          }
        }
        return -1; //to handle the case where the value doesn't exist
      } */

      //var teste = getIndex(row.values.computer_name, data, "computer_name")

      return (
        <div className="container-subcomponent" style={{ paddingLeft: "20px", paddingBottom: '10px'}}>

          {/* 
          <p>Horário permitido para as varreduras do Discovery:</p>
          <table>

            <th>
              {hourList.map((option, i) => {

                const hourSet = "data[teste]?.hora" + i;
                const result = eval(hourSet);

                function changeColumnColor(teste, i) { 
                  // console.log(`Teste: ${teste}`)
                  // console.log(`Posicao: ${i}`)

                  const mountValue= "data[teste]?.hora" + i
                  const valueRow = eval(mountValue)

                  let memoriaCor = "";

                  // console.log(`valueRow: ${valueRow}`);

                  if(valueRow === "1") {
                    memoriaCor = "0";
                  }else {
                    memoriaCor = "1";
                  }

                  switch(i) {
                    case 0: 
                      data[teste].hora0 = memoriaCor;
                      // console.log('HORA 0: '+ data[teste].hora0);
                    break;
                    case 1: 
                      data[teste].hora1 = memoriaCor;
                      // console.log('HORA 1: '+ data[teste].hora1);
                    break;
                    case 2: 
                      data[teste].hora2 = memoriaCor;
                      // console.log('HORA 2: '+ data[teste].hora2);
                    break;
                    case 3: 
                      data[teste].hora3 = memoriaCor;
                      // console.log('HORA 3: '+ data[teste].hora3);
                    break;
                    case 4: 
                      data[teste].hora4 = memoriaCor;
                      // console.log('HORA 4: '+ data[teste].hora4);
                    break;
                    case 5: 
                      data[teste].hora5 = memoriaCor;
                      // console.log('HORA 5: '+ data[teste].hora5);
                    break;
                    case 6: 
                      data[teste].hora6 = memoriaCor;
                      // console.log('HORA 6: '+ data[teste].hora6);
                    break;
                    case 7: 
                      data[teste].hora7 = memoriaCor;
                      // console.log('HORA 7: '+ data[teste].hora7);
                    break;
                    case 8: 
                      data[teste].hora8 = memoriaCor;
                      // console.log('HORA 8: '+ data[teste].hora8);
                    break;
                    case 9: 
                      data[teste].hora9 = memoriaCor;
                      // console.log('HORA 9: '+ data[teste].hora9);
                    break;
                    case 10: 
                      data[teste].hora10 = memoriaCor;
                      // console.log('HORA 10: '+ data[teste].hora10);
                    break;
                    case 11: 
                      data[teste].hora11 = memoriaCor;
                      // console.log('HORA 11: '+ data[teste].hora11);
                    break;
                    case 12: 
                      data[teste].hora12 = memoriaCor;
                      // console.log('HORA 12: '+ data[teste].hora12);
                    break;
                    case 13: 
                      data[teste].hora13 = memoriaCor;
                      // console.log('HORA 13: '+ data[teste].hora13);
                    break;
                    case 14: 
                      data[teste].hora14 = memoriaCor;
                      // console.log('HORA 14: '+ data[teste].hora14);
                    break;
                    case 15: 
                      data[teste].hora15 = memoriaCor;
                      // console.log('HORA 15: '+ data[teste].hora15);
                    break;
                    case 16: 
                      data[teste].hora16 = memoriaCor;
                      // console.log('HORA 16: '+ data[teste].hora16);
                    break;
                    case 17: 
                      data[teste].hora17 = memoriaCor;
                      // console.log('HORA 17: '+ data[i].hora17);
                    break;
                    case 18: 
                      data[teste].hora18 = memoriaCor;
                      // console.log('HORA 18: '+ data[teste].hora18);
                    break;
                    case 19: 
                      data[teste].hora19 = memoriaCor;
                      // console.log('HORA 19: '+ data[teste].hora19);
                    break;
                    case 20: 
                      data[teste].hora20 = memoriaCor;
                      // console.log('HORA 20: '+ data[teste].hora20);
                    break;
                    case 21: 
                      data[teste].hora21 = memoriaCor;
                      // console.log('HORA 21: '+ data[teste].hora21);
                    break;
                    case 22: 
                      data[teste].hora22 = memoriaCor;
                      // console.log('HORA 22: '+ data[teste].hora22);
                    break;
                    case 23: 
                      data[teste].hora23 = memoriaCor;
                      // console.log('HORA 23: '+ data[teste].hora23);
                    break;
                    default:
                      // console.log('NAO EXISTE ESSE VALOR NO SWITCH');
                    break;
                  }

                  // console.log('DATA: ');
                  // console.log(data);

                  setCarregamento(eval(hourSet));
                  ShowColumn();

                }
                

                function ShowColumn() {

                  let valor = eval(hourSet);
                  let cor = "";

                  if(valor === "0") {
                    cor = "td-false";
                  }else {
                    cor = "td-true";
                  }

                  return (
                    <td className={cor} onClick={()=> changeColumnColor(teste, i)} >
                      {option}
                    </td>
                  );

                  /*if (valor === "0") {
                    return (
                      <td className="td-false" onClick={()=> changeColumnColor(teste, i)} >
                        {option} - Valor: {valor}
                      </td>
                    )
                  }
                  else
                    return (
                      <td className="td-true" onClick={()=> changeColumnColor(teste, i)} >
                        {option} - Valor: {valor}
                      </td>
                    
                }

                return (<ShowColumn />)

              })}
            </th>

          </table>
            )*/}
              
          <div>
              <p>Drivers para varredura:</p>
              <input type="text" className="input-driver" onChange={(e) => handleDriveInserido(e.target.value)} ></input>
              <button type="button" className="button-add-driver" onClick={() => enviarDados(row)} > Atualizar </button>
          </div> 
          
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
          Selecione a máquina
        </p>
      </div>

      <div className="container-md5">
        <table className="table-settingsMachine" {...getTableProps()}>
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
                             
                  {row.isExpanded && (
                    <tr>
                      <td colSpan={visibleColumns.length}>
                        {renderRowSubComponent({ row })}
                      </td>
                    </tr>
                  )} 

                </React.Fragment>
              )
            })}
          </tbody>

        </table>
      </div>


{/*       <div className="pagination">
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
      </div> */}


    </>
  )
}

export default TableSettingsMachine