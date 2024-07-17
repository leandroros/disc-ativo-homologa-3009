

import React , {useEffect, useState} from 'react'
import { useTable, useFilters, useRowSelect, useSortBy } from 'react-table'
import './style.scss'
import { matchSorter } from 'match-sorter'
import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';

import { postCreateJob, getLastDiscoveryID } from '../../services/functions'
import {
  ChevronDownFilter,
  OptionIcon,
  SearchIcon,
} from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import api from '../../services/api'
import { Link } from "react-router-dom";
import CreateJob from '../../pages/CreateJob'





const IndeterminateCheckbox = React.forwardRef(
  
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '5px' }}>
        <input className="checkbox-table" type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    )
  }
)



function TableCreateJob({ data, extensions, jobDescription ,idDiscovery}) {
  const [openModalGroup, setOpenModalGroup] = useState (false);


  let acessToken = localStorage.getItem("@FlashSafe-token");
  let lastDiscovery = '';
  useEffect(() => {

    api
    .get("/discovery/ultDiscovery/" + acessToken + "/resp_rest")
    .then((response) => {
        lastDiscovery = response.data
        //console.log("ID do ultimo discovery identificado: "+ response.data) // LOCALIZA O ULTIMA DESCOBERTA REALIZADA
        //console.log("JOB descripition:"+ jobDescription);

        localStorage.setItem("Last_Discovery", lastDiscovery); // ADICIONA O ID NO LOCAL STORAGE
    })
    .catch((err) => {

        // console.log( err);

    });

  }, []);




  //FUNÇÃO OPEN MODAL
  function handleOpenModalGroup(event) {
    setOpenModalGroup(!openModalGroup)
  }




  // console.log(extensions, 'as extensões que a tabela recebeu foram:')
  // console.log(jobDescription)
   

  const columns = React.useMemo(
    () => [
      {
        Header: "Grupo DLP",
        accessor: "grupo",
        Filter: SelectColumnFilter,
        filter: 'includes',
        sortType: 'basic'
      },
      {
        Header: "Nome da Máquina",
        accessor: "maquina",
        sortType: 'basic'

      },
      // {
      //   Header: "Drivers",
      //   accessor: "drivers",
      //   sortType: 'basic'

      // },
      // {
      //   Filter: "",
      //   Header: "",
      //   accessor: "action_three_points",
      //   Cell: ({ value }) => (
      //     <div className="option-three-points">
      //       <OptionIcon />
      //     </div>
      //   )
      // },
    ],
    []
  );
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
    prepareRow,
    rows,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useSortBy,

    useRowSelect,
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
  // const firstPageRows = rows.slice(0, 10);


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

  // This is a custom filter UI for selecting
  // a unique option from a list
  function SelectColumnFilter({
    column: { filterValue, setFilter, preFilteredRows, id },
  }) {
    // Calculate the options for filtering
    // using the preFilteredRows
    const options = React.useMemo(() => {
      const options = new Set()
      preFilteredRows.forEach(row => {
        options.add(row.values[id])
      })
      return [...options.values()]
    }, [id, preFilteredRows])

    // Render a multi-select box
    return (
      <>
        <Select
          onChange={e => {
            setFilter(e.target.value || undefined)
          }}
          margin="normal"
          value={filterValue}
          variant="outlined"
          style={{ width: "calc(100% - 15px)" }}
          className="select-search-table"

          IconComponent={() => (
            <ChevronDownFilter />
          )}>
          <MenuItem value="">
            Todos
          </MenuItem>
          {options.map((option, i) => (
            <MenuItem key={i} value={option}>               {option}
            </MenuItem>
          ))}
        </Select>
      </>

    )
  }



  let resultadoArray = [];
  let resultadoFinal = ''
  let resultExtensions =[];
  let resultExtensionsFinal = '';


  async function handleCreateJob(ids, idDiscovery) {
    let resultado = [];
    //console.log("aqui")
    //console.log(ids)
    ids.map((item) => (
      resultadoArray.push(item.original.maquina)
    ))
    resultadoFinal = resultadoArray.join()
    // console.log(resultadoFinal)

    extensions.map((item) => (
      resultExtensions.push(item)
    ))

    resultExtensionsFinal = resultExtensions.join()
  
    resultado = await postCreateJob(acessToken, resultadoFinal, resultExtensionsFinal, jobDescription , idDiscovery)
    toast.success('Job criado', {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
   
    // setResultCreateJob(resultado);
    // console.log(' o retorno da requisicao é', resultado)
    // console.log(' o retorno da requisicao é', resultCreateJob)
  }

  // console.log('MAQUINA SELECIONADA: ');
  // console.log(selectedFlatRows)
  // Render the UI for your table
  return (
    <>
      <ToastContainer />

          {openModalGroup ? (
        <div className="modal-createjob">
          <div className="divider-modal" >     
            <h1 className="card-title">Discovery</h1>      
            <button className="button-close-modal" type="button" onClick={() => setOpenModalGroup(false)}> X </button>
          </div>
          <div style={{ display: 'flex', width: '300px', flexWrap: 'wrap', height: '100px', paddingLeft: '24px' }}> 
        <p style={{fontSize: 17}}>Job criado com sucesso</p>

        <div style={{ display: 'flex', alignContent: 'center'}}>
          <butoon className="button-create-local" onClick={() => setOpenModalGroup(false)} >Ok</butoon>
        </div>

        </div>
        </div>
        ) : null}

      <div className="header-table">
        <p>
          Selecione os grupos e máquinas para varredura.
        </p>
      </div>
      {/* <div className="menu-header-createjob">
        <div>
          <button className="button-header-table">  Selecionar tudo </button>  |       <button className="button-header-table"> Desmarcar tudo </button> | <span className="selected-items"> <span className="selected-dark">{selectedFlatRows.length} </span>itens selecionados</span>

        </div>


        <div className="select-top-left-table" >
          <label>Ações:</label>
          <select>
            <option value="valor1">Selecionar Driver</option>
          </select>

          <label>Drivers:</label>
          <select>
            <option value="valor1">C:</option>

            <option value="valor1">D:</option>

          </select>
          <button className="button-send-param"> Enviar </button>
        </div>

      </div> */}
      <div className="container-tableCreateJob">
        <table className="table-createjob" {...getTableProps()}>
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
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>


      </div>


      {/*
      <div className="pesquisa-job-e-maquina">
        <label htmlFor="maquina">
          <p>Tipos de varredura</p>
            <select
              className="input-reason-pesquisa"
              name="maquina"
              id="maquina"
              //onChange={(e) => handleJob(e.target.value)}
            >
                <option value="valor1" selected></option>
                <option value="valor2">Toda a máquina</option>
                <option value="valor3">Escolher Drives ou Pastas</option>
            </select>
        </label>
      </div>
      */}


      <div className="button-format-local">
        <button className="button-create-local" onClick={() => { handleCreateJob(selectedFlatRows, idDiscovery)}}> Iniciar Job </button>
        <Link to={"/create-discover"}> <button className="button-create-local">Cancelar</button></Link>
      </div>
    </>
  )
}

//onClick={() => setIsChecked(false)}

export default TableCreateJob