import React, { useState, useEffect } from 'react'
import { MenuLeft } from '../../components'
import api from '../../services/api'
import './style.scss'

function StatusDiscover() {
  let acessToken = localStorage.getItem("@FlashSafe-token")
  const [flashStatus, setFlashStatus] = useState()



function getStatusData(){

    //COMANDO RETORNO PROGRESSO
    api
      .get("/discovery/flash_status/" + acessToken + "/resp_rest")
      .then((response) => {
        setFlashStatus(response.data)
        console.log(response.data)
      }
      )
      .catch((err) => {
        console.log(err);
      });
    }



    useEffect(()=>{
    
      getStatusData()
      const interval=setInterval(()=>{
         getStatusData()
       },30000)
         
         
       return()=>clearInterval(interval)
  },[])



  function ActiviesMachines() {
    const atividadesMaquinas = flashStatus?.comunicacao_maquinas?.split(",")
    console.log(atividadesMaquinas)
    let aux = []
    let result = ''
    result = atividadesMaquinas?.map((item, i) => {
      aux = item?.split(' ')
      return (
        <tr>
          <td>{aux[0]}</td>
          <td>{aux[1]}</td>
          <td>{aux[2]}</td>
        </tr>
      )
    })
    return (
      <>
        {result}
      </>
    )
  }

  function LastJobs() {
    const ultJobs = flashStatus?.ult_jobs_executados?.split(",")
    let result = ''
    result = ultJobs?.map((item, i) => {
      return (
        <tr>
          <td>{item}</td>
        </tr>
      )
    })
    return (
      <>
        {result}
      </>
    )
  }


  function NextJobs() {
    const proxJobs = flashStatus?.primeiros_jobs_na_fila?.split(",")
    let result = ''
    result = proxJobs?.map((item, i) => {
      return (
        <tr>
          <td>{item}</td>
        </tr>
      )
    })
    return (
      <>
        {result}
      </>
    )
  }


  function ExtensionsByNumber() {
    const extensions = flashStatus?.totais_por_extensao?.split(",")

    let result = []

    for (let i = 0; i < extensions?.length; i++) {

      if (i % 2 === 0)
        result.push(<tr>
          <td>{extensions[i]} = <span style={{ fontWeight: 'bold', color: '#187fb4' }}> {extensions[i + 1]} </span></td>
        </tr>)
    }
    return (
      <>
        {result}
      </>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      < MenuLeft />

      <div className="main-content">
        <h1 className="card-title-status" > FlashSafe Discovery -  Monitoramento</h1>

        <div className="card-status">


          {/* <h1 style={{ textAlign: 'left' }}> Arquivos analisados recentemente: </h1>
          <div className="div-recent-files">
            <p> C://Arquivos/teste.xml</p>
            <p> C://Arquivos/teste.xml</p>

          </div> */}
          <div className="div-tables-top">
            <table>
              <tr>
                <th colSpan="3">Equipamentos</th>
              </tr>
              <tr>
                <td>Total</td>
                <td>Processando</td>
                <td>Processados</td>
              </tr>
              <tr>
                <td className="number-table"> {flashStatus?.eqtos_total}</td>
                <td className="number-table"> {flashStatus?.eqtos_em_proc}  </td>
                <td className="number-table"> {flashStatus?.eqtos_ok} </td>
              </tr>
            </table>


            <table>
              <tr>
                <th colSpan="3">Arquivos </th>
              </tr>
              <tr>
                <td>Total</td>
                <td>Processando</td>
                <td>Processados</td>
              </tr>
              <tr>
                <td className="number-table">{flashStatus?.arquivos_total}</td>
                <td className="number-table"> {flashStatus?.arquivos_na_fila}  </td>
                <td className="number-table"> {flashStatus?.arquivos_processados} </td>
              </tr>
            </table>

            <table>
              <tr>
                <th colSpan="3">Pessoas </th>
              </tr>
              <tr>
                <td>Quantidade</td>
                <td>Andamento</td>

              </tr>
              <tr>
                <td className="number-table"> {flashStatus?.pessoas}</td>
                <td className="number-table"> {flashStatus?.andamento} </td>
              </tr>
            </table>

          </div>
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-around' }} >
            <div>
              <h1 style={{ marginTop: '5px' }}> Robots Processamento </h1>

              <div style={{ display: 'inline-flex' }}>
                <div className="div-content-status">
                  <h2> Profiler</h2>
                  <p> Arquivos Total: <span> {flashStatus?.profiler?.arquivos_total} </span> </p>
                  <p> Arquivos Processados: <span>{flashStatus?.profiler?.arquivos_procs} </span> </p>
                  <p> Fila: <span>{flashStatus?.profiler?.Fila} </span> </p>
                  <p> Status: <span>{flashStatus?.profiler?.status}</span> </p>

                </div>
                <div className="div-content-status">
                  <h2> Mapper</h2>
                  <p> Arquivos Processados: <span>{flashStatus?.mapper?.arquivos_procs} </span> </p>
                  <p> Fila: <span>{flashStatus?.mapper?.Fila}</span>  </p>
                  <p> Status:<span> {flashStatus?.mapper?.status}</span> </p>
                  <p> Arquivos descartados: <span> {flashStatus?.mapper?.arquivos_descartados} </span> </p>
                  <p> Arquivos considerados: <span> {flashStatus?.mapper?.arquivos_considerados} </span> </p>

                </div>
              </div>

              <div style={{ display: 'flex' }}>
                <div className="div-content-status">
                  <h2> Análise BI</h2>
                  <p> Arquivos analisados: <span>{flashStatus?.analise_bi?.arquivos_analisados}</span>  </p>
                  <p> Fila:<span>{flashStatus?.analise_bi?.Fila}</span>  </p>
                  <p> Status: <span>{flashStatus?.analise_bi?.status}</span> </p>
                  <p> Arquivos neutros: <span> {flashStatus?.analise_bi?.arquivos_neutros} </span> </p>
                  <p> Arquivos serios: <span> {flashStatus?.analise_bi?.arquivos_serios} </span> </p>
                  <p> Arquivos graves: <span> {flashStatus?.analise_bi?.arquivos_graves} </span> </p>
                  <p> Arquivos gravíssimos: <span> {flashStatus?.analise_bi?.arquivos_gravissimos} </span> </p>

                </div>
                <div className="div-content-status">
                  <h2> Pessoas</h2>
                  <p> Pessoas total: <span> {flashStatus?.analise_pessoas?.pessoas_total}  </span> </p>
                  <p> Pessoas com cpf: <span>{flashStatus?.analise_pessoas?.pessoas_com_cpf} </span>  </p>
                  <p> Pessoas com rg:  <span>{flashStatus?.analise_pessoas?.pessoas_com_rg} </span> </p>
                  <p> Pessoas com dados sensíveis: <span> {flashStatus?.analise_pessoas?.pessoas_com_dados_sensiveis} </span> </p>
                </div>
              </div>
            </div>

            <div className="div-extensions" >
              <h1> Extensões</h1>

              <table>
                <tr>
                  <ExtensionsByNumber />
                </tr>
              </table>
            </div>
            <div>
              <div className="div-content-right" >
                <h1> Atividades Máquinas</h1>
                <table>
                  <tr>
                    <th className="number-table"> Horário </th>
                    <th className="number-table" > Maquina </th>
                    <th className="number-table" > Registros </th>
                  </tr>
                  <ActiviesMachines />
                </table>

              </div>
              <div className="div-content-right">
                <h1> Últimos Jobs Executados</h1>
                <table>
                  <tr>
                    <LastJobs />
                  </tr>
                </table>
              </div>
              <div className="div-content-right">
                <h1> Próximos Jobs na Fila</h1>
                <table>
                  <tr>
                    <NextJobs />
                  </tr>
                </table>
              </div>
              <div>
                <p> © 2021 FlashSafe | Um produto Epsoft Sistemas Ltda </p>
                <p>CNPJ: 53.024.360/0001-90.</p>
              </div>
            </div>
          </div>
        </div>








      </div >




    </div >
  );
}

export default StatusDiscover;
