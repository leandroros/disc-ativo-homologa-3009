import React, { useState, useEffect } from 'react'
import { MenuLeft, TableMachineList } from '../../components'
import { SearchIcon } from '../../../assets/icons/index.jsx'
import api from '../../services/api'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

function MachineList() {
  let acessToken = localStorage.getItem("@FlashSafe-token")
  const [dataMachine, setDataMachine] = useState()
  let { id } = useLocation();
  // console.log(id, "testa aqui")
  useEffect(() => {
    let result = []
    let aux = []
    const headers = {
      "tabela": "map_jobs",
      "select": "job='" + id + "'",
      "pagina": "1",
      "qt": "100",
      "campos_select_end_point": "maquina^job^computer_name^cliente^comando^retorno^dth_inicio^dth_atualizacao^descricao",
      "get_qt":"100"
    };
    //COMANDO RETORNO PROGRESSO
    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
      .then((response) => {
        result = response.data
        // console.log(result, "teste machine")
        aux = result.map(function (item) {
          return {
            "cliente": item.cliente,
            "computer_name": item.computer_name,
            "grupo_dlp": item.grupo_dlp,
            "maquina": item.maquina,
            "comando": item.comando,
            "retorno": item.retorno,
            "progresso": item.progresso,
            "job": item.job,
            "action": item.maquina,
          }
        });


        setDataMachine(aux)
        // console.log(aux, 'teste')
      }
      )
      .catch((err) => {
        result = err;
      });

    return result;

  }, [acessToken])





  const columns = React.useMemo(
    () => [

      {
        Header: 'maquina',
        accessor: 'maquina',
      },

      // {
      //   Header: 'id',
      //   accessor: 'job',
      // },
      {
        Header: 'Nome do Computador',
        accessor: 'computer_name',
      },
      {
        Header: 'comando',
        accessor: 'comando',
      },

      {
        Header: 'retorno',
        accessor: 'retorno',
      },
      {
        Header: 'progresso',
        accessor: 'progresso',
      },
      // {
      //   Header: 'Status',
      //   accessor: 'status',
      //   Cell: ({ value }) => (
      //     <button className="button-status-error" value={""}>
      //       Erro
      //     </button>
      //   )
      // },
      {
        Header: 'Ação',
        accessor: 'action',
        Cell: ({ value }) => (
          <Link to={{ pathname: '/result-archive', id: value }} style={{ textDecoration: 'none' }}>
            <button type="button" className="button-view-machine">
              Visualizar Arquivos <SearchIcon></SearchIcon>
            </button>
          </Link >
        )
      },
    ],
    []
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      < MenuLeft />

      <div className="main-content">

        <div className="card">
          <h1 className="card-title"> Lista de Máquinas do Job [ {id} ]</h1>
          <p className="card-subtitle"> Acompanhe todos os jobs por máquinas</p>
          <div className="divider">
          </div>
          {dataMachine ? (<TableMachineList data={dataMachine} columns={columns} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default MachineList;
