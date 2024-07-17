import "../../../styles/style.scss";
import React, { useState, useEffect } from "react";
import { MenuLeft, TableCreateJob } from "../../components";
import {
  BackIcon,
  ToolTipIcon,
} from "../../../assets/icons/index.jsx";
import api from "../../services/api";
import "./style.scss";
import ReactLoading from 'react-loading';
import { Tooltip, IconButton } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import "material-react-toastify/dist/ReactToastify.css";
import { black } from "material-ui/styles/colors";
import { Link } from "react-router-dom";

function CreateJob() {
  const [groupList, setGroupList] = useState();
  const [openModalGroup, setOpenModalGroup] = useState(false);
  const [openModalExtensions, setOpenModalExtensions] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [extensionSelected, setExtensionSelected] = useState([]);
  const [machinesResult, setMachinesResult] = useState([]);
  const [jobDescription, setjobDescription] = useState([]);
  const [arrayJOB, setArrayJOB] = useState([]);
  const [selecaoJOB, setSelecaoJOB] = useState();



  let acessToken = localStorage.getItem("@FlashSafe-token");
  let tokenTwo = Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64").toString().split('-')[1];
  let arrayExtensionSelected = [];
  let arrayGroupSelected = [];
  let result = [];
  let discoverySelecionado = "";



  const extensionList = ["cmd", "html", "java", "message", "office", "pdf", "rtf", "word", "xml", "zip", "txt"]

  useEffect(() => {
    const URL = "/diversos/getGrupos/"+acessToken+"/resp_rest"

    api
      .get(URL)
      .then(res => {
        let listaSeparada = res.data.split(",")
        let listaUnicos = [... new Set (listaSeparada)]
        setGroupList( listaUnicos )
      })
      .catch((err) => {

        toast.error('Ocorreu um erro na requisição da lista de grupos', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
        // console.log('Ocorreu um erro na requisição')
        // console.error("ops! ocorreu um erro" + err);
    });

    const objetoDiscovery = {
      tabela: "map_discovery",
      select: `grupo_dlp like '${
        Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
          .toString()
          .split("^")[1]
          .replace("*", "")
        }%'^order by id desc`,

      pagina: "1",
      qt: "100",
      campos_select_end_point: "id^nome^descricao",
      get_qt: "1",
    };

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", objetoDiscovery)
      .then((response) => {

      let memoria = response.data.replace('"total_paginas":"', ""); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
      memoria = memoria.replace(" ", ""); // REMOVE O ESPEÇO QUE FICOU SOBRENDO DEVIDO AO PRIMEIRO REPLACE
      let valorMemoria = ""; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
      let contador = 1; // CONTADOR PARA SABER QUANDO SAIR DO ELSE
      let contadorItem = 0;
      let aux = [];


      // LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES
      for (let i = 0; i < memoria.length; i++) {
        if (contador === 0) {
          valorMemoria = valorMemoria + memoria[i];
        } else if (memoria[i] === "," && contador === 1) {
          contador--;
        }
      }

      valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING

      valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

      let array = valorMemoria; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE

      for (let i = 0; i < array.length; i++) {
        result.push(array[i]); // ALIMENTA O ARRAY COM OS DADOS DO JSON AJUSTADO
      }

      aux = result.map(function (item) {
  /*       if (contadorItem === 0) {
         // console.log("dado: " + item.id);

          //geraListaDeMaquinasDoJob(item.id); // JOGA O VALOR DIRETAMENTE NO METODO SEM PASSAR PELA SELECAO PARA PODER INICIALIZAR AS VARIAVEIS

          //getDadosDiscovery(item.id); // CARREGA OS DADOS DO JOB SELECIONADO
        } */

        contadorItem++;

        return {
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
        };
      });

      setArrayJOB(aux);
  
    })
    .catch((err) => {
      result = err;
    });

    function onKeyup(e) {
      if (e.key === "Escape") {
        setOpenModalExtensions(false)
        setOpenModalGroup(false)
      }

    }
    window.addEventListener('keyup', onKeyup);

  }, [acessToken])

  function handleJob(event) {
    setSelecaoJOB(event);

    discoverySelecionado = event;

  }

  function idDiscoverySelecionado(){
    return selecaoJOB
  }



  function handleSaveGroup(selectAll) {
    if (selectAll === true) {
      arrayGroupSelected = groupList
    }
    if (arrayGroupSelected?.length < 1) {
      toast.error('Você precisa selecionar pelo menos 1 grupo', {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
    });
    }
    else {
      let result = arrayGroupSelected?.join()
      // console.log('grupos selected', result)
      setOpenModalGroup(false)
      setMachinesResult([])
      setIsChecked(true)
      handleLoadMachine(result);
    }
  }

  // FUNÇÃO PARA SELECIONAR TODOS OS ITENS DA LISTA, MAS NÃO MUDAR A PÁGINA - PRECISA SER REVISTO
  function handleSelectGroup(selectAll) {
    if (selectAll === true) {
      arrayGroupSelected = groupList
    }
    if (arrayGroupSelected?.length < 1) {
      toast.error('Você precisa selecionar pelo menos 1 grupo', {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
    });
    }
    else {
      let result = arrayGroupSelected?.join()
      // console.log('grupos selected', result)
      //setOpenModalGroup(false)
      setMachinesResult([])
      setIsChecked(true)
      handleLoadMachine(result);
    }
  }

  function handleOpenModalGroup() {
    setOpenModalGroup(!openModalGroup)
  }

  async function handleLoadMachine(selectedGroups) {
    setIsLoading(true)
    let aux = [];
    let result = [];

    api
      .get("/jsons/pegaMaquinas/" + acessToken + "/~" + selectedGroups + "/resp_rest")
      .then((response) => {
        result = response.data.split(",")
        // console.log('reusl', result)
        if (result[0] !== "") {
          aux = result.map(function (item) {
            var auxResult = item.split("^")
            return { "grupo": auxResult[1], "maquina": auxResult[0] }
          });
          setMachinesResult(aux)
        }
        else
          setMachinesResult("empty")
      }

      )
      .catch((err) => {
        console.error("ops! ocorreu um erro" + err);
      });
    setIsLoading(false);

    // setTimeout(() => {
    //   setIsLoading(false);
    // }, 1000);

  }

  function handleJobDescription(event) {
    setjobDescription(event)
  }

  function handleChangeInputGroups(event) {

    let name = event?.target?.name
    let checked = event?.target?.checked

    if (checked === true)
      arrayGroupSelected.push(name)
    else {

      var filtered = arrayGroupSelected.filter(function (item) {
        return item !== name;
      });
      arrayGroupSelected = filtered;

    }
  }

  function handleChangeInputExtensions(event) {

    let name = event?.target?.name
    let checked = event?.target?.checked

    if (checked === true)
      arrayExtensionSelected.push(name)
    else {

      var filtered = arrayExtensionSelected.filter(function (item) {
        return item !== name;
      });
      arrayExtensionSelected = filtered;

    }
  }

  function ShowTable(props) {

    if (machinesResult === "empty") {
      return (<div> <h1> Ops. Não existe nenhuma máquina listada no(s) grupo(s) selecionado(s)</h1> </div>)
    }

    else if (machinesResult?.length < 1) {
      // return <div><h1> Não há dados a serem exibidos</h1></div>;
      return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>      <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
      </div>)
    }
    else
      return (
        <TableCreateJob data={machinesResult} extensions={extensionSelected} jobDescription={jobDescription} idDiscovery={selecaoJOB} style={{ height: '200px' }} />);
  }

  function ButtonExtensions() {

    if (extensionSelected.length < 1) {
      return (<>
        <button type="button" className="select-button" onClick={() => setOpenModalExtensions(!openModalExtensions)
        }
        > Selecionar arquivos</button>
        <div
          style={{ position: "relative", top: "60px", right: "180px" }}
        >
          <input type="checkbox" onChange={() => setExtensionSelected(extensionList)} />
          <span> selecionar todos os tipos de arquivo </span>
        </div> </>
      )
    }
    else if (extensionSelected.length === 1) {

      return (<button type="button" className="select-button-green" onClick={() => setOpenModalExtensions(!openModalExtensions)
      }
      > {extensionSelected.length} selecionado</button>)
    }
    else {

      return (<button type="button" className="select-button-green" onClick={() => setOpenModalExtensions(!openModalExtensions)
      }
      > {extensionSelected.length} selecionados</button>)
    }

  }

  function handleSaveExtensions() {
    setOpenModalExtensions(!openModalExtensions)
    setExtensionSelected(arrayExtensionSelected)

  }

  return (

    <div style={{ display: "flex", flexDirection: "row" }}>

      <MenuLeft collapsed={false} />

      <div className="main-content">

        {/* MODAL */}
        {openModalExtensions ? (
          <div className="modal-extensions">
               <div className="divider-modal" >     
                      <p>Tipos de documento</p>      
            <button className="button-close-modal" type="button" onClick={() => setOpenModalExtensions(false)}> X </button>
            </div>
            <div style={{ paddingLeft: '24px'}}> 
            <p> Selecione os tipos de arquivo para a varredura</p>
            <div style={{ display: 'flex', width: '500px', flexWrap: 'wrap' }}>
              {extensionList?.map((item) => (
                <div
                  key={Math.random()}
                  className="div-checkbox-modal-extensions"
                  role="none"

                >
                  <input type="checkbox" name={item} id={item} onChange={(e) => handleChangeInputExtensions(e)}>
                  <label className="item-modal" htmlFor={item}>{item}</label></input>
                </div>
              ))}</div>            </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '20px'}}> 
            <button type="button" className="button-save" onClick={() => handleSaveExtensions()}> Salvar </button>
            </div>
          </div>

        ) : null}

        {openModalGroup && (
          <div className="modal-createjob">

            <div className="divider-modal" >     
              <h1 className="card-title">Grupos</h1>      
            </div>
              
            <div style={{ paddingLeft: '24px' }}> 
              <p style={{ color:'black', fontSize: '18px'}}> Selecione os grupos para a varredura</p>
              
              <div style={{ display: 'flex', width: '500px', flexWrap: 'wrap'}}>
                {groupList?.map((item) => (
                  <div key={Math.random()} role="none" className="div-checkbox-modal" >
                    <input type="checkbox" name={item} onChange={(e) => handleChangeInputGroups(e)} id={item}></input>
                    <label className="item-modal" htmlFor={item} style={{color:'black'}}>{item}</label>
                  </div>
                  ))
                }

                <div>
                  <input type="checkbox" onChange={(e) => handleSaveGroup(e.target.checked)} />
                  <span> selecionar todos os grupos </span>
                </div>
              </div>   
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-evenly', paddingBottom: '20px', marginTop: '20px'}}> 
              <button type="button" className="button-save-modalcriarJob" onClick={() => handleSaveGroup(false)}> Confirmar </button> 
              <button type="button" className="button-save-modalcriarJob" onClick={() => setOpenModalGroup(false)}> Cancelar </button>          
            </div>
          </div>
        ) }

        {/*FIM,  MODAL */}


        <div className="card">
          <h1 className="card-title">Criar Job</h1>
          <p className="card-subtitle">
            Preencha todos os campos para criar um Job
          </p>
          <div className="divider">
            {isChecked ? (<button type="button" className="back-button" onClick={() => setIsChecked(false)}
            >
              <BackIcon />  Editar configurações </button>) : null}
          </div>


          {isChecked ? (<>

            <div>
              {isLoading ? (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '150px' }}>      <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
              </div>
              ) : (<ShowTable/>)}
            </div>
          </>) : (

            <form className="form-create-job content-scroll">

              <div className="pesquisa-job-e-maquina">
                <label htmlFor="maquina">
                  <p>Seleção da Descoberta</p>
                    <select
                      className="input-reason-pesquisa"
                      name="maquina"
                      id="maquina"
                      //value={selecaoJOB}
                      value={selecaoJOB}
                      onChange={(e) => handleJob(e.target.value)}
                    >
                      <option value="" disabled selected>Selecione a Descoberta</option>
                      {arrayJOB.map((option) => ( <option value={option.id}>{option.nome}</option> ))}
                    </select>
                </label>
              </div>

              
              <div className="pesquisa-job-e-maquina">
                <label htmlFor="#">
                  <p>Descrição do JOB: </p>
                  <input className="input-reason-pesquisa" onChange={(e) => handleJobDescription(e.target.value)} />
                </label>

                {/*
                <div>

                  <label className="label-config"> Tipos de documento

                    <div className="container-tooltip">
                      <Tooltip title="Selecione os tipos de arquivos que deseja que seja analisado pelo Discovery">
                        <IconButton>
                          <ToolTipIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </label>

                  <ButtonExtensions />

                </div> */}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 30,
                  marginTop: "40px",
                  marginBottom: "40px",
                }}
              >
                <label className="p-config label-config">Seleção de Máquinas e Grupos:</label>

                <button type="button" className="select-button" onClick={() => handleOpenModalGroup()  } >
                  Selecionar grupos
                </button>

                {/*<label className="label-config">
                  <div className="container-tooltip">
                    <Tooltip title="Selecione o(s) grupo(s) de máquinas que deseja que o Discovery realize o scan">
                      <IconButton>
                        <ToolTipIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </label> */}
              </div>
            </form>)}
        </div>
      </div>
    </div >
  );
}

export default CreateJob;
