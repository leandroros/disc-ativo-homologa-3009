import React, { useState, useEffect } from 'react'
import { MenuLeft, TableJobList } from '../../components'
import { SearchIcon } from '../../../assets/icons/index.jsx'
import api from '../../services/api'
import { Link } from 'react-router-dom'
import moment from 'moment'
function JobList() {
  let acessToken = localStorage.getItem("@FlashSafe-token")
  const [dataMachine, setDataMachine] = useState()
  let result = []

  useEffect(() => {
    let aux = []

    const headers = { "grupo_dlp": "epsoft" };
    //COMANDO RETORNO PROGRESSO
    api
      .post("/discovery/getJobs/" + acessToken + "/resp_rest", headers)
      .then((response) => {
        result = response.data
        // console.log(result)
        aux = result.map(function (item) {
          return { "dth_inicio": item.dth_inicio, "job": item.job, "action": item.job }
        });
        setDataMachine(aux)
        // console.log(dataMachine)
      }
      )
      .catch((err) => {
        result = err;
      });
    // console.log(aux, 'teste')


  }, [acessToken])





  const columns = React.useMemo(
    () => [

      {
        Header: 'Data',
        accessor: 'dth_inicio',
        Cell: ({ value }) => (

          moment(value).locale('pt-br').format('DD/MM/YYYY, h:mm:ss a')

        )
      },


      // {
      //           moment(value).format('MMMM Do YYYY, h:mm:ss a'))

      //   Header: 'data',
      //   accessor: 'dth_inicio',
      //   moment().format('L');
      // },

      {
        Header: 'id',
        accessor: 'job',
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
          <Link to={{ pathname: '/machine-list', id: value }} style={{ textDecoration: 'none' }}>
            <button type="button" className="button-view-machine">
              Visualizar Máquinas
              <div> <SearchIcon></SearchIcon> </div>
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
          <h1 className="card-title"> Lista de Jobs</h1>
          <p className="card-subtitle"> Acompanhe todos os jobs</p>
          <div className="divider">
          </div>
          {dataMachine ? (<TableJobList data={dataMachine} columns={columns} />
          ) : null}

        </div>


      </div>




    </div>
  );
}

export default JobList;
