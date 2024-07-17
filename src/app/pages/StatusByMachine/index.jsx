import '../../../styles/style.scss'
import React, { useState, useEffect } from 'react'
import { MenuLeft, TableStatusMachine } from '../../components'
import api from "../../services/api";
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';


function StatusByMachine() {
  let acessToken = localStorage.getItem("@FlashSafe-token");
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState('')



  useEffect(() => {

    async function getFilesList() {
      const headers =
{ 
    "tabela":"map_stat",
    "select":"1=1 ^ order by id desc",
    "pagina":"1",
    "qt":"100",
    "campos_select_end_point":"cod_maquina^dth_inicio^computer_name^job^percentual^arqs_descobertos^fila_profiler^arqs_classificados^fila_mapper^arqs_mapeados^fila_md5^analises_md5^arqs_neutros^arqs_serios^arqs_graves^arqs_gravissimos^fila_pessoas^pessoas_mapeadas^pessoas_cpf^pessoas_rg^pessoas_email^pessoas_dad_sensiveis^fila_acoes^acoes_executadas^total_mbytes^zip^text^pdf^docx^xml^cmd^html^pptx^xlsx^rtf^image^video^audio^ultima_at^outros^grupo_dlp",
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
      //console.log('teste post', tableData)
      if (tableData?.length > 10)
        setIsLoading(false)
    }
    getFilesList()

  }, []);


  function ShowTable(props) {
    //console.log(tableData)
    if (tableData.length < 2) {
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
        <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
      </div>;
    }
    else
      return (
         <TableStatusMachine data={tableData} />
      );
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      < MenuLeft />
      <div className="main-content ">
        <div className="card">
          <h1 className="card-title"> Status por máquina </h1>
          {/* <p className="card-subtitle"> </p> */}
          <div className="divider">
          </div>
          {isLoading ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
            <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
          </div>)
            :
            (
              <ShowTable></ShowTable>)}
        </div>


      </div>




    </div>
  );
}

export default StatusByMachine;
