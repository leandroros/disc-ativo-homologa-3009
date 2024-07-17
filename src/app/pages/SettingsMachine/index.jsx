import '../../../styles/style.scss'
import React, { useState, useEffect } from 'react'
import { MenuLeft, TableSettingsMachine } from '../../components'
import api from "../../services/api";
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { getJson } from '../../services/functions';

function SettingsMachine() {
  let acessToken = localStorage.getItem("@FlashSafe-token");

  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState([]);
  const [tableStatus, setTableStatus] = useState([]);

  useEffect(() => {

    async function getFilesList() {
      const headers =
      {
        "tabela": "map_maquinas",
        "select": `grupo_dlp like'${Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
            .toString()
            .split('^')[1]
            .replace("*", "")
          }%'`,
        "pagina": "1",
        "qt": "100",
        "campos_select_end_point": "maquina^ult_job^cliente^grupo_dlp^computer_name^dth_inicio^dth_atualizacao^status^drives^hora0^hora1^hora2^hora3^hora4^hora5^hora6^hora7^hora8^hora9^hora10^hora11^hora12^hora13^hora14^hora15^hora16^hora17^hora18^hora19^hora20^hora21^hora22^hora23",
        "get_qt": "50 "
      };

      api
        .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
        .then((response) => {
          let array = response.data
          setTableData(array)
        })
        .catch((err) => {
          toast.error('Ocorreu um erro na requisição')
          console.error("ops! ocorreu um erro" + err);
        });
      if (tableData?.length > 10)
        setIsLoading(false)
    }
    getFilesList()

    async function getStatus() {
      const headers =
      {
        "tabela": "map_stat",
        "select": `grupo_dlp like'${Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
            .toString()
            .split('^')[1]
            .replace("*", "")
          }%'^order by id desc`,
        "pagina": "1",
        "qt": "10000",
        "campos_select_end_point": "cod_maquina^status",
        "get_qt": "100"
      };

      api
        .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
        .then((response) => {
          let status = response.data
          setTableStatus(status)
        })
        .catch((err) => {
          toast.error('Ocorreu um erro na requisição')
          console.error("ops! ocorreu um erro" + err);
        });
      if (tableData?.length > 10)
        setIsLoading(false)
    }
    getStatus()
  }, []);


  //funcao para atualizar o status do map_maquinas
  function atualizaStatus() {
    console.log("%c CONSOLE LOG STARCK PARA TESTES:" , "background-color: #FF4500 ; color: black ; font-weight: bold");
   // console.log(tableData)

    for (let i = 0 ; i < tableData.length ; i++){
      let name = tableData[i].maquina;
      console.log( name)
    }
  }

  atualizaStatus()

  function ShowTable(props) {

    if (tableData.length < 2) {
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
        <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
      </div>;
    }
    else
      return (
        <TableSettingsMachine data={tableData} />
      );
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      < MenuLeft />
      <div className="main-content ">
        <div className="card">
          <h1 className="card-title"> Configurações por Máquina </h1>
          <p className="card-subtitle"> Atualize os drivers para a descoberta em cada máquina</p>
          <div className="divider">
          </div>
          {isLoading
            ?
            (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
              <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
            </div>)
            :
            (<ShowTable></ShowTable>)
          }
        </div>
      </div>
    </div>
  );
}

export default SettingsMachine;
