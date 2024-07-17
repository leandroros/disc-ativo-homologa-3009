import '../../../styles/style.scss'
import React, { useState, useEffect } from 'react'
import { MenuLeft, TableMD5 } from '../../components'
import api from "../../services/api";
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';


function FilterMD5() {
  let acessToken = localStorage.getItem("@FlashSafe-token");
  const [isLoading, setIsLoading] = useState(false)
  const [tableData, setTableData] = useState('')



  useEffect(() => {

    async function getFilesList() {
      const headers =
      {
        "tabela": "map_md5",
        "select": "1=1",
        "pagina": "1",
        "qt": "500",
        "campos_select_end_point": "md5^grupo_dlp^arquivo^tipo_arquivo^sensibilidade^qt_nomes^qt_cpf^qt_cnpj^qt_rgs^qt_email^qt_cartoes^qt_saude^qt_carteirinha^qt_negocio^qt_outros^dth^qt_lin_tot^qt_lin_sensiveis",
      };

      api
        .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
        .then((response) => {
          let array = response.data
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
          console.error("ops! ocorreu um erro" + err);
        });
      // console.log('teste post', tableData)
      if (tableData?.length > 10)
        setIsLoading(false)
    }
    getFilesList()

  }, []);


  function ShowTable(props) {
    // console.log(tableData)
    if (tableData.length < 2) {
      return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>
        <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
      </div>;
    }
    else
      return (
         <TableMD5 data={tableData} />
      );
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      < MenuLeft />
      <div className="main-content ">
        <div className="card">
          <h1 className="card-title"> Filtragem MD5 </h1>
          {/* <p className="card-subtitle"> Verifique os arquivos MD5 do Job</p> */}
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

export default FilterMD5;
