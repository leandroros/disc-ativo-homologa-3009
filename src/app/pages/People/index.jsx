import '../../../styles/style.scss'
import React, { useState } from 'react'
import { MenuLeft, TablePeople } from '../../components'
import api from "../../services/api";
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import {
  SearchIcon,
} from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";

function People() {
  let acessToken = localStorage.getItem("@FlashSafe-token")
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState('')
  const [personName, setPersonName] = useState('')

  async function getFilesList(value) {
    setPersonName(value)
    const headers =
    {   "tabela": "map_pessoas",
    "select": "nome like'%"+value +"%'",
    "pagina": "1",
    "qt": "100",
    "campos_select_end_point": "id_pessoa^grupo_dlp^nome^maquina^rg^fonetico^cpf^email^md5^endereco^carteirinha^cartao^json",
    "get_qt": "100"
}

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
      .then((response) => {
        let array = response.data
        // console.log(array)
        setTableData(array)
      })
      .catch((err) => {
        toast.error('Ocorreu um erro na requisição', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
      });

        // console.error("ops! ocorreu um erro" + err);
      });
    // console.log('teste post', tableData)
    if (tableData?.length > 10)
      setIsLoading(false)
  }

  function ShowTitle(props) {
    if (tableData[0]?.id_pessoa?.length < 0 || tableData[0]?.id_pessoa === undefined) {
      return (
        <div>
          <h1 className="card-title"> Arquivos Relacionados</h1>
          <p className="card-subtitle"> Verifique se existe algum arquivo contendo dado de uma pessoa específica.</p>
        </div>
      );
    }
    else
      return (
        <div>
          <h1 className="card-title"> Arquivos Relacionados - {personName}</h1>
          {/* <p className="card-subtitle"> Veja todos os arquivos em que "{personName}" aparece.</p> */}
        </div>
      );
  }


  function ShowTable(props) {
    if (tableData[0]?.id_pessoa?.length < 0 || tableData[0]?.id_pessoa === undefined) {
      return <div>
        <h1 className="emptyTableMessage"> Não há dados a serem exibidos</h1></div>;
    }
    else
      return (
        <TablePeople data={tableData} personName={personName} />
      );
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      < MenuLeft />
      <div className="main-content ">
        <div className="card">
          <ShowTitle></ShowTitle>
          <div className="divider">
          </div>
          {isLoading ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
            <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
          </div>)
            :
            (<div>

              <div style={{ marginBottom: '20px' }}>

                <TextField
                  variant="outlined"
                  onChange={(e) => getFilesList(e.target.value)}
                  placeholder="Insira o nome que deseja consultar"
                  InputProps={{
                    disableUnderline: true,
                    className: "input-person",
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

              </div>
              <ShowTable></ShowTable></div>)}
        </div>
      </div>
    </div>
  );
}

export default People;
