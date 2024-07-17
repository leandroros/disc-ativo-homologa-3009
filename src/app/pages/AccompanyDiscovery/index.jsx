import "../../../styles/style.scss";
import "./style.scss";
import React, { useState, useEffect } from "react";
import { MenuLeft } from "../../components";
import api from "../../services/api";
import ProgressBar from "../../components/ProgressBar/ProgressBar";

import Switch from "react-switch";

function AccompanyDiscovery() {
  let idJob = "";
  const [acompanhamentoDados, setAcompanhamentoDados] = useState([
    {
      cp_1: "",
      cp_2: "",  //dth_inicio
      cp_3: "",  //dth_fim
      cp_4: "",  //texto_loc
      cp_5: "",  //docx_loc
      cp_6: "",  //pdf_loc
      cp_7: "",  //xml_loc
      cp_8: "",  //cmd_loc
      cp_9: "",  //html_loc
      cp_10: "", //pptx_loc
      cp_11: "", //xlsx_loc
      cp_12: "", //rtf_loc
      cp_13: "", //image_loc
      cp_14: "", //outros
      cp_15: "", //tempoStTela
      cp_16: "", //rtf
      cp_17: "", //docx
      cp_18: "", //image
      cp_19: "", //video
      cp_20: "", //ods
      cp_21: "", //exe
      cp_22: "", //audio
      cp_23: "", //odp
      cp_24: "", //outros
      cp_25: "", //ultima_at
      cp_26: "", //megabytes
      cp_27: "", //arqs_descobertos
      cp_28: "", //arqs_classificados
      cp_29: "", //fila_profiler
      cp_30: "", //pperc
      cp_31: "", //zip
      cp_32: "", //text
      cp_33: "", //pdf
      cp_34: "", //odt
      cp_35: "", //xml
      cp_36: "", //cmd
      cp_37: "", //html
      cp_38: "", //pptx
      cp_39: "", //xlsx
      exp_1: "", //exp_1
      exp_2: "", //exp_2
      exp_3: "", //exp_3
      exp_4: "", //exp_4
      exp_5: "", //exp_5
      exp_6: "", //exp_6
      exp_7: "", //exp_7
      exp_8: "", //exp_8
      exp_9: "", //exp_9
      exp_10: "",//exp_10
      tot_1: "", //count_match_1
      tot_2: "", //count_match_2
      tot_3: "", //count_match_3
      tot_4: "", //count_match_4
      tot_5: "", //count_match_5
      tot_6: "", //count_match_6
      tot_7: "", //count_match_7
      tot_8: "", //count_match_8
      tot_9: "", //count_match_9
      tot_10: "",//count_match_10
    },
  ]);

  const [selecaoJOB, setSelecaoJOB] = useState();
  const [arrayJOB, setArrayJOB] = useState([]);
  const [selecaoMaquina, setSelecaoMaquina] = useState();
  const [arrayMaquinas, setArrayMaquinas] = useState([]);
  const [openModalMaquinas, setOpenModalMaquinas] = useState(false);
  const [selecaoMaquinaNome, setSelecaoMaquinaNome] = useState([]);
  const [exp_1, setExp_1] = useState()
  const [exp_2, setExp_2] = useState()
  const [exp_3, setExp_3] = useState()
  
  

  

  const testData = [
    { bgcolor: '#0e86d4', completed: 100 },

  ]

  let selecaoTodasMaquinas = [];
  let handleJobNome = "";

  function trasDados(discoveySelecionado) {
    let acessToken = localStorage.getItem("@FlashSafe-token");
    // SERA ENVIADO SOMENTE O ID DO DISCOVERY
    const objeto = {
      id_discovery: discoveySelecionado
    };

    api
      .post(`/discovery/pegaStatusAtivo/${acessToken}/resp_rest`, objeto)
      .then((resposta) => {
        let retorno = resposta.data.replace("<200>", "");
        retorno = retorno.replace("Em andamento" , "")
        let json = JSON.parse(retorno);
         //console.log(json);
         //console.log('Meu retorno' + retorno);

       setExp_2(json.cp_2);

        for (let i = 0; i < 4; i++) {
          acompanhamentoDados.cp_1 = json.cp_1;
          acompanhamentoDados.cp_2 = json.cp_2;
          acompanhamentoDados.cp_3 = json.cp_3;
          acompanhamentoDados.cp_4 = json.cp_4;
          acompanhamentoDados.cp_5 = json.cp_5;
          acompanhamentoDados.cp_6 = json.cp_6;
          acompanhamentoDados.cp_7 = json.cp_7;
          acompanhamentoDados.cp_8 = json.cp_8;
          acompanhamentoDados.cp_9 = json.cp_9;
          acompanhamentoDados.cp_10 = json.cp_10;
          acompanhamentoDados.cp_11 = json.cp_11;
          acompanhamentoDados.cp_12 = json.cp_12;
          acompanhamentoDados.cp_13 = json.cp_13;
          acompanhamentoDados.cp_14 = json.cp_14;
          acompanhamentoDados.cp_15 = json.cp_15;
          acompanhamentoDados.cp_16 = json.cp_16;
          acompanhamentoDados.cp_17 = json.cp_17;
          acompanhamentoDados.cp_18 = json.cp_18;
          acompanhamentoDados.cp_19 = json.cp_19;
          acompanhamentoDados.cp_20 = json.cp_20;
          acompanhamentoDados.cp_21 = json.cp_21;
          acompanhamentoDados.cp_22 = json.cp_22;
          acompanhamentoDados.cp_23 = json.cp_23;
          acompanhamentoDados.cp_24 = json.cp_24;
          acompanhamentoDados.cp_25 = json.cp_25;
          acompanhamentoDados.cp_26 = json.cp_26;
          acompanhamentoDados.cp_27 = json.cp_27;
          acompanhamentoDados.cp_28 = json.cp_28;
          acompanhamentoDados.cp_29 = json.cp_29;
          acompanhamentoDados.cp_30 = json.cp_30;
          acompanhamentoDados.cp_31 = json.cp_31;
          acompanhamentoDados.cp_32 = json.cp_32;
          acompanhamentoDados.cp_33 = json.cp_33;
          acompanhamentoDados.cp_34 = json.cp_34;
          acompanhamentoDados.cp_35 = json.cp_35;
          acompanhamentoDados.cp_36 = json.cp_36;
          acompanhamentoDados.cp_37 = json.cp_37;
          acompanhamentoDados.cp_38 = json.cp_38;
          acompanhamentoDados.cp_39 = json.cp_39;
          acompanhamentoDados.exp_1 = json.exp_1;
          acompanhamentoDados.exp_2 = json.exp_2;
          acompanhamentoDados.exp_3 = json.exp_3;
          acompanhamentoDados.exp_4 = json.exp_4;
          acompanhamentoDados.exp_5 = json.exp_5;
          acompanhamentoDados.exp_6 = json.exp_6;
          acompanhamentoDados.exp_7 = json.exp_7;
          acompanhamentoDados.exp_8 = json.exp_8;
          acompanhamentoDados.exp_9 = json.exp_9;
          acompanhamentoDados.exp_10 = json.exp_10;
          acompanhamentoDados.tot_1 = json.tot_1;
          acompanhamentoDados.tot_2 = json.tot_2;
          acompanhamentoDados.tot_3 = json.tot_3;
          acompanhamentoDados.tot_4 = json.tot_4;
          acompanhamentoDados.tot_5 = json.tot_5;
          acompanhamentoDados.tot_6 = json.tot_6;
          acompanhamentoDados.tot_7 = json.tot_7;
          acompanhamentoDados.tot_8 = json.tot_8;
          acompanhamentoDados.tot_9 = json.tot_9;
          acompanhamentoDados.tot_10 = json.tot_10;
        }

        setExp_1(json.cp_1);



      });
  }

  /* =====================================================================*/
  /* === METODO RESPONSAVEL POR PESQUISAR AS MAQUINAS ASSOCIADAS AO JOB === */
  /* ===================================================================== */
  function geraListaDeMaquinasDoJob(job) {
    let acessToken = localStorage.getItem("@FlashSafe-token");

    let result = [];
    let aux = [];
    let id = job; // CARREGA O ID DO ULTIMO JOB

    // console.log(`ID: ${id}`);

    /*const headers = {
      tabela: "map_jobs",
      select: "job='" + id + "'",
      pagina: "1",
      qt: "100",
      campos_select_end_point:
        "maquina^job^computer_name^cliente^comando^retorno^dth_inicio^dth_atualizacao^descricao",
      get_qt: "*",
    };*/

    const headers = {
      "tabela": "map_jobs",
      "select": `id_discovery='${id}'^order by id desc`,
      "pagina": "*",
      "qt": "100",
      "campos_select_end_point": "maquina^job^computer_name^cliente^comando^retorno^dth_inicio^dth_atualizacao^descricao^grupo_dlp",
      "get_qt": "1"
    }

    //console.log("ID JOB: " + id);

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
      .then((response) => {
        result = response.data;
        //console.log(result, "teste machine")
        aux = result.map(function (item) {
          //if (item.job === id && (item.maquina !== "" || item.maquina !== undefined)) {
          setSelecaoMaquina(item.maquina);
          setSelecaoMaquinaNome(item.computer_name);

          return {
            cliente: item.cliente,
            computer_name: item.computer_name,
            grupo_dlp: item.grupo_dlp,
            maquina: item.maquina,
            comando: item.comando,
            retorno: item.retorno,
            progresso: item.progresso,
            job: item.job,
            action: item.maquina,
          };
          //}
        });

        setArrayMaquinas(aux);
        //console.log(aux, 'teste')

        // console.log(selecaoMaquina);
      })
      .catch((err) => {
        result = err;
        // console.log(result);
      });
    //trasDados();
  }

  /* === OBSERVADOR JOB REALIZADO === */
  function handleJob(event) {

    setSelecaoJOB(event);
    geraListaDeMaquinasDoJob(event);
    getDadosDiscovery(event);
    trasDados(event);

  }

  /* === ABRIR MODAL ESCOLHA MAQUINAS === */
  function handleOpenModalMaquinas() {
    setOpenModalMaquinas(!openModalMaquinas)
  }

  /* === OBSERVADOR NOME MAQUINA === */
  function handleNomeMaquina(event) {
    setSelecaoMaquina(event);

    idJob = selecaoMaquina;

    for (let i = 0; i < arrayMaquinas.length; i++) {
      if (arrayMaquinas[i].maquina === event) {
        // console.log(arrayMaquinas[i])
        // console.log(arrayMaquinas[i].computer_name);
        setSelecaoMaquinaNome(arrayMaquinas[i].computer_name);
      }
    }

    //trasDados();

  }

  /* ============================================================================= */
  /* === QUERY PARA REALIZAR A BUSCA DOS DADOS DO JOB SELECIONADO PELO USUARIO === */
  /* ============================================================================= */
  function getDadosDiscovery(idJob) {
    let acessToken = localStorage.getItem("@FlashSafe-token");

    const pesquisa = {
      "tabela": "map_discovery",
      "select": `id='${idJob}'^order by id desc`,
      "campos_select_end_point": "exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
      "get_qt": "1",
      "pagina": "1",
      "qt": "100"
    }

    let retornoComErro = '';

    api.post("/sql/selectSql/" + acessToken + "/resp_rest", pesquisa)
      .then((response) => {
        let memoria = response.data.replace('"total_paginas":"', ''); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
        memoria = memoria.replace(' ', ''); // REMOVE O ESPEÇO QUE FICOU SOBRENDO DEVIDO AO PRIMEIRO REPLACE
        let valorMemoria = ''; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
        let contador = 1; // CONTADO PARA SABER QUANDO SAIR DO ELSE

        /* LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES */
        for (let i = 0; i < memoria.length; i++) {
          if (contador === 0) {
            valorMemoria = valorMemoria + memoria[i];

          } else if (memoria[i] === ',' && contador === 1) {
            contador--;

          }
        }

        // console.log(memoria);

        retornoComErro = memoria; // TRATA CASO HAJA ALGUM ERRO NA CRIACAO DO JSON

        //valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING
        valorMemoria = valorMemoria.replace(']', '');

        valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

        let retorno = valorMemoria;

        // console.log('retorno')
        // console.log(valorMemoria);

        setExp_1(retorno.exp_1);

        window.document.querySelector('#botao').disabled = false;

      }).catch((err) => {
        try {

          // console.log('TRATANDO ERRO: ');
          // console.log(retornoComErro);

          retornoComErro = retornoComErro.split("{")[1];
          retornoComErro = retornoComErro.replace('},', '}');
          retornoComErro = "{" + retornoComErro;

          // console.log('ERRO TRATADO: ');
          // console.log(retornoComErro);

          retornoComErro = JSON.parse(retornoComErro); // CONVERTE A STRING EM UM OBJETO JSON

          let retorno = retornoComErro;

          // console.log('retorno')
          // console.log(retorno);

          setExp_1(retorno.exp_1);

          window.document.querySelector('#botao').disabled = false;
          window.document.querySelector('#todos').disabled = false;

        } catch (erro) {
          window.document.querySelector('#botao').disabled = true;
          window.document.querySelector('#todos').disabled = true;

          //alert('NÃO EXISTE REGISTROS NESSE DISCOVERY, SELECIONE OUTRA DESCOBERTA!!');
          // console.log('OCORREU ALGUM ERRO NA PESQUISA!!');

        }

      });
  }

  function handleSelecionarTodasAsMaquinas(selecao) {
    if (selecao === true) {
      let memoria = [];

      for (let i = 0; i < arrayMaquinas.length; i++) {
        memoria.push(arrayMaquinas[i].maquina);
      }

      selecaoTodasMaquinas = JSON.stringify(memoria);
      selecaoTodasMaquinas = selecaoTodasMaquinas.replace('[', '');
      selecaoTodasMaquinas = selecaoTodasMaquinas.replace(']', '');

      // console.log('MAQUINAS SELECIONADAS');
      // console.log(selecaoTodasMaquinas);

      window.document.querySelector('#botao').disabled = true;

    } else {
      let memoria = [];

      selecaoTodasMaquinas = memoria;

      if (selecaoTodasMaquinas.length == 0) {
        // console.log('ARRAY DE SELECAO TODAL DE MAQUINAS ZERADO!!');

        // console.log('MAQUINAS SELECIONADAS');
        // console.log(selecaoTodasMaquinas);

        window.document.querySelector('#botao').disabled = false;

      }

    }
  }

  useEffect(() => {
    /* ============================================ */
    /* === CARREGA LISTA DE JOBs DA ORGANIZACAO === */
    /* ============================================ */
    async function carregaListaDeJobsDaOrganizacao() {

      let aux = [];
      let result = [];
      let acessToken = localStorage.getItem("@FlashSafe-token");

      // DESCRIPTOGRFA JSON PARA OBTER O GRUPO LOGADO
      let grupoDlpUsuario = atob(acessToken);

      // FILTRA O GRUPO_DLP DO USUARIO
      try {
        grupoDlpUsuario = grupoDlpUsuario.split("^")[1];
      } catch (erro) {
        // console.log("Nao foi localizado chapeu na String");
      }

      try {
        let filtro = grupoDlpUsuario.replace(/[0-9]/g, "");

        grupoDlpUsuario = filtro;

        if (grupoDlpUsuario.length === 1) {
          // console.log("GRUPO MODIFICADO!!");
          grupoDlpUsuario = "epsoft*";
        }

        // console.log(`Grupo DLP: ${grupoDlpUsuario}`);
      } catch (erro) {
        // console.log("Nao foi localizado * na String");
      }

      const headers = { grupo_dlp: grupoDlpUsuario };

      let contadorItem = 0;



      /* =========================== */
      /* === AJUSTE CONFIGURAÇÃO === */
      /* =========================== */
      const objetoDiscovery = {
        "tabela": "map_discovery",
        "select": `grupo_dlp like'${
          Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
          .toString()
          .split('^')[1]
          .replace("*", "")
        }%'^order by id desc`,
        "pagina": "1",
        "qt": "100",
        "campos_select_end_point": "id^nome^descricao",
        "get_qt": "1"
      }

      // console.log(objetoDiscovery);

      api.post("/sql/selectSql/" + acessToken + "/resp_rest", objetoDiscovery)
        .then((response) => {

          let memoria = response.data.replace('"total_paginas":"', ''); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
          memoria = memoria.replace(' ', ''); // REMOVE O ESPAÇO QUE FICOU SOBRANDO DEVIDO AO PRIMEIRO REPLACE
          let valorMemoria = ''; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
          let contador = 1; // CONTADOR PARA SABER QUANDO SAIR DO ELSE

          // LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES
          for (let i = 0; i < memoria.length; i++) {
            if (contador === 0) {
              valorMemoria = valorMemoria + memoria[i];

            } else if (memoria[i] === ',' && contador === 1) {
              contador--;

            }
          }

          valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMEMBRAMENTO DA STRING
          //valorMemoria = valorMemoria.replace(']','');

          valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

          let array = valorMemoria; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE

          for (let i = 0; i < array.length; i++) {
            result.push(array[i]); // ALIMENTA O ARRAY COM OS DADOS DO JSON AJUSTADO
          }

          aux = result.map(function (item) {

            return {
              "id": item.id,
              "nome": item.nome,
              "descricao": item.descricao
            }
          }

          );

          //setDataMachine(aux)
          setArrayJOB(aux);
          //idJob = arrayJOB[(arrayJOB.length - 1)].job;
          //console.log(idJob);

         // console.log('JOB SELECIONADO: '+ selecaoJOB);

          // CARREGA OS DADOS DA MAQUINA
          //console.log("Selecao JOB atual: "+ selecaoJOB);
          //geraListaDeMaquinasDoJob(selecaoJOB);
        })
        .catch((err) => {
          result = err;
        });
      //console.log(aux, 'teste');
    }

    carregaListaDeJobsDaOrganizacao();

  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <MenuLeft />


      {/* MODAL ESCOLHA MAQUINAS 
      {openModalMaquinas ? (
        <div className="modal-find-maquinas">
          <div className="divider-modal" >
            <h1>Arquivos da Maquina {selecaoMaquinaNome} </h1>
            <button className="button-close-modal" type="button" onClick={() => setOpenModalMaquinas(false)}> X </button>
          </div>
          <div className="pesquisa-job-e-maquina">
            <label htmlFor="maquina">
              <p>Seleção da Maquina</p>
              <select className="input-reason-pesquisa" name="maquina" id="maquina" value={selecaoMaquina} onChange={(e) => handleNomeMaquina(e.target.value)} >
                {arrayMaquinas.map((option) => (
                  <option value={option.maquina}>{option.computer_name}</option>
                ))}
              </select>
            </label>
            <button
              className="botao-selecao"
              type="button"
              onClick={() => setOpenModalMaquinas(false)}
            >
              Selecionar
            </button>
          </div>
        </div>
      ) : null}*/}

        <div className="card">
          <h1 className="card-title">Informações do Processo de Pesquisa</h1>
          <p className="card-subtitle">
    
          </p>
          <div className="divider"></div>

          {/* HEADER */}
          <div className="container-header">

            <div className="pesquisa-header">
              <label htmlFor="maquina">
                <p className="accompany">Seleção da Descoberta</p>
                <select
                  name="maquina"
                  id="maquina"
                  value={selecaoJOB}
                  onChange={(e) => handleJob(e.target.value)}
                >
                  <option value="" disabled selected>Selecione a Descoberta</option>
                  {arrayJOB.map((option) => ( <option value={option.id}>{option.nome}</option> ))}
                </select>
              </label>

              
              <label className="desabilitar" htmlFor="maquina">
                <button
                  type="button"
                  className="select-button"
                  id="botao"
                  name="botao"
                  onClick={() => handleOpenModalMaquinas()}
                >
                  Seleção da Maquina
                </button>
                <div className="selecao-todas-maquinas">
                  <input type="checkbox" id="todos" name="todos" onChange={(e) => handleSelecionarTodasAsMaquinas(e.target.checked)} />
                  <span className="accompany"> selecionar todas as maquinas </span>
                </div>
              </label>
            

              <label htmlFor="status">
                <p className="accompany">Status</p>
                <input
                  className="input-status input-accompany"
                  name="status"
                  id="status"
                  value = {acompanhamentoDados.cp_1}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>
            </div>
            
            
            <div className="daddos-tempo">

              <label className="dth-inicio">
                <p className="accompany">dthInicio</p>
                <input
                  className="input-localizando input-accompany"
                  value={acompanhamentoDados.cp_2}
                  disabled
                />
              </label>

              <label className="dth-final">
                <p className="accompany">dthFinal</p>
                <input
                  className="input-localizando input-accompany"
                  value={acompanhamentoDados.cp_3}
                  disabled
                />
              </label>

              <label className="tempo">
                <p className="accompany">Tempo</p>
                <input
                  className="input-localizando input-accompany"
                  value={acompanhamentoDados.cp_15}
                  disabled
                />
              </label>

            </div>


            <div className="extensoes-header">
              
              <p className="accompany">Localizados:</p>

              <label htmlFor="texto">
                <p className="accompany">texto</p>
                <input
                  className="input-localizando input-accompany"
                  name="texto"
                  id="texto"
                  value={acompanhamentoDados.cp_4}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="docx">
                <p className="accompany">docx</p>
                <input
                  className="input-localizando input-accompany"
                  name="docx"
                  id="docx"
                  value={acompanhamentoDados.cp_5}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="pdf">
                <p className="accompany">pdf</p>
                <input
                  className="input-localizando input-accompany"
                  name="pdf"
                  id="pdf"
                  value={acompanhamentoDados.cp_6}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="xml">
                <p className="accompany">xml</p>
                <input
                  className="input-localizando input-accompany"
                  name="xml"
                  id="xml"
                  value={acompanhamentoDados.cp_7}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="cmd">
                <p className="accompany">cmd</p>
                <input
                  className="input-localizando input-accompany"
                  name="cmd"
                  id="cmd"
                  value={acompanhamentoDados.cp_8}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="html">
                <p className="accompany">html</p>
                <input
                  className="input-localizando input-accompany"
                  name="html"
                  id="html"
                  value={acompanhamentoDados.cp_9}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="pptx">
                <p className="accompany">pptx</p>
                <input
                  className="input-localizando input-accompany"
                  name="pptx"
                  id="pptx"
                  value={acompanhamentoDados.cp_10}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="xlsx">
                <p className="accompany">xlsx</p>
                <input
                  className="input-localizando input-accompany"
                  name="xlsx"
                  id="xlsx"
                  value={acompanhamentoDados.cp_11}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="rtf">
                <p className="accompany">rtf</p>
                <input
                  className="input-localizando input-accompany"
                  name="rtf"
                  id="rtf"
                  value={acompanhamentoDados.cp_12}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

{/*               <label htmlFor="msg">
                <p className="accompany">msg</p>
                <input
                  className="input-localizando input-accompany"
                  name="msg"
                  id="msg"
                  value={acompanhamentoDados.cp_13}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label> */}

              <label htmlFor="image">
                <p className="accompany">image</p>
                <input
                  className="input-localizando input-accompany"
                  name="image"
                  id="image"
                  value={acompanhamentoDados.cp_13}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="outros">
                <p className="accompany">outros</p>
                <input
                  className="input-localizando input-accompany"
                  name="outros"
                  id="outros"
                  value={acompanhamentoDados.cp_14}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>
            </div>

            {/* EXPRESSAO */}
            <div className="container-header-body">

              <div className="expresao-container">
                <label htmlFor="expressao-1">
                  <p className="accompany">Expressão 1</p>
                  <input
                    name="expressao-1"
                    id="expressao-1"
                    value={acompanhamentoDados.exp_1}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-2">
                  <p className="accompany">Expressão 2</p>
                  <input
                    name="expressao-2"
                    id="expressao-2"
                    value={acompanhamentoDados.exp_2}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-3">
                  <p className="accompany">Expressão 3</p>
                  <input
                    name="expressao-3"
                    id="expressao-3"
                    value={acompanhamentoDados.exp_3}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-4">
                  <p className="accompany">Expressão 4</p>
                  <input
                    name="expressao-4"
                    id="expressao-4"
                    value={acompanhamentoDados.exp_4}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-5">
                  <p className="accompany">Expressão 5</p>
                  <input
                    name="expressao-5"
                    id="expressao-5"
                    value={acompanhamentoDados.exp_5}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-6">
                  <p className="accompany">Expressão 6</p>
                  <input
                    name="expressao-6"
                    id="expressao-6"
                    value={acompanhamentoDados.exp_6}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-7">
                  <p className="accompany">Expressão 7</p>
                  <input
                    name="expressao-7"
                    id="expressao-7"
                    value={acompanhamentoDados.exp_7}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-8">
                  <p className="accompany">Expressão 8</p>
                  <input
                    name="expressao-8"
                    id="expressao-8"
                    value={acompanhamentoDados.exp_8}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-9">
                  <p className="accompany">Expressão 9</p>
                  <input
                    name="expressao-9"
                    id="expressao-9"
                    value={acompanhamentoDados.exp_9}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="expressao-10">
                  <p className="accompany">Expressão 10</p>
                  <input
                    name="expressao-10"
                    id="expressao-10"
                    value={acompanhamentoDados.exp_10}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>
              </div>

              <div className="container-expressao">
                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_1}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_2}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_3}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_4}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_5}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_6}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_7}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_8}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_9}
                    disabled
                  />
                </label>

                <label>
                  <p className="accompany">Total</p>
                  <input
                    className="input-localizando input-accompany"
                    value={acompanhamentoDados.tot_10}
                    disabled
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="container-footer">

            
            
            <div className="extensoes">
              <label htmlFor="analisados">
                <p className="accompany">Analisados:</p>
              </label>

              <label htmlFor="zip">
                <p className="accompany">zip</p>
                <input
                  className="input-localizando input-accompany"
                  name="zip"
                  id="zip"
                  value={acompanhamentoDados.cp_31}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="texto">
                <p className="accompany">texto</p>
                <input
                  className="input-localizando input-accompany"
                  name="texto"
                  id="texto"
                  value={acompanhamentoDados.cp_32}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="pdf">
                <p className="accompany">pdf</p>
                <input
                  className="input-localizando input-accompany"
                  name="pdf"
                  id="pdf"
                  value={acompanhamentoDados.cp_33}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

{/*               <label htmlFor="rar">
                <p className="accompany">rar</p>
                <input
                  className="input-localizando input-accompany"
                  name="rar"
                  id="rar"
                  value={acompanhamentoDados.cp_34}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label> */}

              <label htmlFor="docx">
                <p className="accompany">docx</p>
                <input
                  className="input-localizando input-accompany"
                  name="docx"
                  id="docx"
                  value={acompanhamentoDados.cp_17}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="xml">
                <p className="accompany">xml</p>
                <input
                  className="input-localizando input-accompany"
                  name="xml"
                  id="xml"
                  value={acompanhamentoDados.cp_35}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="cmd">
                <p className="accompany">cmd</p>
                <input
                  className="input-localizando input-accompany"
                  name="cmd"
                  id="cmd"
                  value={acompanhamentoDados.cp_36}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="html">
                <p className="accompany">html</p>
                <input
                  className="input-localizando input-accompany"
                  name="html"
                  id="html"
                  value={acompanhamentoDados.cp_37}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="pptx">
                <p className="accompany">pptx</p>
                <input
                  className="input-localizando input-accompany"
                  name="pptx"
                  id="pptx"
                  value={acompanhamentoDados.cp_38}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="xlsx">
                <p className="accompany">xlsx</p>
                <input
                  className="input-localizando input-accompany"
                  name="xlsx"
                  id="xlsx"
                  value={acompanhamentoDados.cp_39}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="rtf">
                <p className="accompany">rtf</p>
                <input
                  className="input-localizando input-accompany"
                  name="rtf"
                  id="rtf"
                  value={acompanhamentoDados.cp_16}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="ods">
                <p className="accompany">ods</p>
                <input
                  className="input-localizando input-accompany"
                  name="ods"
                  id="ods"
                  value={acompanhamentoDados.cp_20}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="odt">
                <p className="accompany">odt</p>
                <input
                  className="input-localizando input-accompany"
                  name="odt"
                  id="odt"
                  value={acompanhamentoDados.cp_34}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="odp">
                <p className="accompany">odp</p>
                <input
                  className="input-localizando input-accompany"
                  name="odp"
                  id="odp"
                  value={acompanhamentoDados.cp_23}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>
              
{/*               <label htmlFor="visio">
                <p className="accompany">visio</p>
                <input
                  className="input-localizando input-accompany"
                  name="visio"
                  id="visio"
                  value={acompanhamentoDados.cp_17}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label> */}

{/*               <label htmlFor="msg">
                <p className="accompany">msg</p>
                <input
                  className="input-localizando input-accompany"
                  name="msg"
                  id="msg"
                  value={acompanhamentoDados.cp_18}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label> */}


{/*               <label htmlFor="exe">
                <p className="accompany">exe</p>
                <input
                  className="input-localizando input-accompany"
                  name="exe"
                  id="exe"
                  value={acompanhamentoDados.cp_21}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label> */}

              <label htmlFor="image">
                <p className="accompany">image</p>
                <input
                  className="input-localizando input-accompany"
                  name="image"
                  id="image"
                  value={acompanhamentoDados.cp_18}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="audio">
                <p className="accompany">audio</p>
                <input
                  className="input-localizando input-accompany"
                  name="audio"
                  id="audio"
                  value={acompanhamentoDados.cp_22}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="video">
                <p className="accompany">video</p>
                <input
                  className="input-localizando input-accompany"
                  name="video"
                  id="video"
                  value={acompanhamentoDados.cp_19}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

              <label htmlFor="outros">
                <p className="accompany">outros</p>
                <input
                  className="input-localizando input-accompany"
                  name="outros"
                  id="outros"
                  value={acompanhamentoDados.cp_14}
                  disabled
                  //onChange={(e) => handleJobNome(e.target.value)}
                />
              </label>

            </div>

            
            <div className="dados">

              
              
                <label htmlFor="ult-dth" className="ult-dth" >
                  <p className="accompany">Ultima data / hora</p>
                  <input
                    name="ult-dth"
                    id="ult-dth"
                    value={acompanhamentoDados.cp_25}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="mbytes" className="mbytes" >
                  <p className="accompany">Mbytes</p>
                  <input
                    name="mbytes"
                    id="mbytes"
                    value={acompanhamentoDados.cp_26}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                {/*
                <label htmlFor="arquivo" className="arquivo" >
                  <p className="accompany">Arquivo</p>
                  <input
                    name="arquivo"
                    id="arquivo"
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>
                */}

                <label htmlFor="arqs-descobertos" className="arqs-descobertos" >
                  <p className="accompany">Arqs Descobertos</p>
                  <input
                    name="arqs-descobertos"
                    id="arqs-descobertos"
                    value={acompanhamentoDados.cp_27}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>
              

              
                {/* //REMOVIDO POR SOLICITAÇÃO DO EDGAR
                <label htmlFor="arqs-classificados" className="arqs-classificados" >
                  <p className="accompany">Arqs Classificados</p>
                  <input
                    name="arqs-classificados"
                    id="arqs-classificados"
                    value={acompanhamentoDados.cp_28}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>
              */}

                <label htmlFor="fila-total" className="fila-total" >
                  <p className="accompany">Fila Total</p>
                  <input
                    name="fila-total"
                    id="fila-total"
                    value={acompanhamentoDados.cp_29}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

                <label htmlFor="progresso" className="progresso" >
                  <p className="accompany">Progresso</p>
                  <input
                    name="progresso"
                    id="progresso"
                    value={acompanhamentoDados.cp_30}
                    disabled
                    //onChange={(e) => handleJobNome(e.target.value)}
                  />
                </label>

              

              
            </div>

            {/*

            <div className="progresso-title">
                <p className="accompany">Andamento</p>
            </div>

            <div className="progress-bar">

              {testData.map((item, idx) => (
                <ProgressBar key={idx} bgcolor={item.bgcolor} completed={item.completed} />
              ))}

            </div>

              */}

          </div>
        </div>
    </div>
  );
}

export default AccompanyDiscovery;
