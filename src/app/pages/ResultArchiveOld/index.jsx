import "../../../styles/style.scss";
import React, { useState, useEffect } from "react";
import { MenuLeft, TableResultArchive } from "../../components";
import api from "../../services/api";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import ReactLoading from "react-loading";
import { BackIcon } from "../../../assets/icons/index.jsx";
import { Link } from "react-router-dom";
import Switch from "react-switch";
import { LeftArrow, RightArrow } from "../../../assets/icons/index";
import { deletaFiles, moveFiles, copiaFiles, xlsLimpa } from "../../services/functions";
import { CgClose } from "react-icons/cg";
import { useHistory } from "react-router-dom";

function ResultArchive() {
  let acessToken = localStorage.getItem("@FlashSafe-token");
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  let selecaoTodasMaquinas = [];

  let discoverySelecionado = "";

  let paginaAtual = 1;

  const [contadorClick, setContadorClick] = useState(paginaAtual);
  let qtdPorPagina = 13;

  let history = useHistory();

  /*const [tableData, setTableData] = useState([
        {
            cliente: '',
            codigo_drive: '',
            computer_name: '',
            grupo_dlp: '',
            md5: '',
            path: '',
            tipo: '',
            ult_dth: ''
        }
    ]);*/
  const [dataMachine, setDataMachine] = useState();
  const [selecaoJOB, setSelecaoJOB] = useState();
  const [arrayJOB, setArrayJOB] = useState([]);
  const [selecaoMaquina, setSelecaoMaquina] = useState();
  const [arrayMaquinas, setArrayMaquinas] = useState([]);
  const [selecaoMaquinaNome, setSelecaoMaquinaNome] = useState([]);
  const [dadosMaquina, setDadosMaquina] = useState();

  let idJob = "";
  let { id, customNameData } = useLocation();

  const [searchList, setSearchList] = useState([
    {
      //id: 0,
      pesquisa: "",
      tipo: true,
    },
  ]);

  const [carregamentoDescoberta, setCarregamentoDescoberta] = useState({
    exp_1: "",
    exp_2: "",
    exp_3: "",
    exp_4: "",
    exp_5: "",
    exp_6: "",
    exp_7: "",
    exp_8: "",
    exp_9: "",
    exp_10: "",
    job: "",
    maquina: "",
  }); // CARREGA A LISTA DE DADOS DA DESCOBERTA

  const [exp_1, setExp_1] = useState();
  const [exp_2, setExp_2] = useState();
  const [exp_3, setExp_3] = useState();
  const [exp_4, setExp_4] = useState();
  const [exp_5, setExp_5] = useState();
  const [exp_6, setExp_6] = useState();
  const [exp_7, setExp_7] = useState();
  const [exp_8, setExp_8] = useState();
  const [exp_9, setExp_9] = useState();
  const [exp_10, setExp_10] = useState();

  const [switchExp1, setSwitchExp1] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 1
  const [switchExp2, setSwitchExp2] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 2
  const [switchExp3, setSwitchExp3] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 3
  const [switchExp4, setSwitchExp4] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 4
  const [switchExp5, setSwitchExp5] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 5
  const [switchExp6, setSwitchExp6] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 6
  const [switchExp7, setSwitchExp7] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 7
  const [switchExp8, setSwitchExp8] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 8
  const [switchExp9, setSwitchExp9] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 9
  const [switchExp10, setSwitchExp10] = useState(true); // VARIAVEIS DE CONTROLE SWITCH 10

  const [openModalGroup, setOpenModalGroup] = useState(false);
  const [openModalMaquinas, setOpenModalMaquinas] = useState(false);

  const [filtroE, setFiltroE] = useState(false);
  const [filtroOU, setFiltroOU] = useState(true);

  const [teste, setTeste] = useState(false);

  const [arquivosQuarentena, setArquivosQuarentena] = useState(false);

  const [array, setArray] = useState(

    <div className="input-swith">
      <label htmlFor="exp_1">Pesquisa 1 </label>
      <input
        className="input-reason-pesquisa"
        type="text"
        name="exp_1"
        id="exp_1"
        value={carregamentoDescoberta.exp_1}
      ></input>
      <Switch onChange={(e) => handleSwitchExp1(e)} checked={switchExp1} />
    </div>
  );

  function InputForm() {
    for (let i = 0; i < searchList.length; i++) {
      setArray(
        searchList.map((item, i) => (
          <div className="input-swith">
            <label> Pesquisa {i + 1} </label>
            {console.log(`Posicao ${i}: `)}
            <input
              className="input-reason-pesquisa"
              type="text"
              key={i}
              onChange={(e) => handleFormInput(i, e.target.value)}
            ></input>
            <Switch
              onChange={(e) => handleSwitch(e, i)}
              checked={searchList[i].tipo}
            />
            <button
              className="button-remove"
              type="button"
              onClick={() => handleDelete(i)}
            >
              <CgClose />
            </button>
          </div>
        ))
      );
    }
  }

  //console.log(id, 'olha o id')

  //console.log('customNameData: '+ id);

  //carregaListaDeJobsDaOrganizacao(); // TRAZ OS JOBS DA ORGANIZACAO

  /* ============================================== */
  /* === METODO RESPONSAVEL POR DELETAR ARQUIVOS === */
  /* ============================================== */
  async function deletarArquivos(selectedFlatRows) {
    let token = localStorage.getItem("@FlashSafe-token");

    await deletaFiles(token, selectedFlatRows);
  }

  /* ============================================ */
  /* === METODO RESPONSAVEL POR MOVER ARQUIVOS === */
  /* ============================================ */
  async function moverArquivos(objeto) {
    let token = localStorage.getItem("@FlashSafe-token");

    const obj = {
      id_arquivo_orig: objeto.id_arquivo_orig,
      maq_destino: objeto.maq_destino,
      arq_dest: objeto.arq_dest,
    };

    let resultado = [];

    resultado = await moveFiles(token, obj);
  }

  /* ============================================= */
  /* === METODO RESPONSAVEL POR COPIAR ARQUIVOS === */
  /* ============================================= */
  async function copiarArquivos(objeto) {
    let token = localStorage.getItem("@FlashSafe-token");

    const obj = {
      id_arquivo_orig: objeto.id_arquivo_orig,
      maq_destino: objeto.maq_destino,
      arq_dest: objeto.arq_dest,
    };

    let resultado = [];

    resultado = await copiaFiles(token, obj);
  }

  /* ============================================== */
  /* === METODO RESPONSAVEL POR DELETAR ARQUIVOS === */
  /* ============================================== */
  async function limpaDadosXLS() {
    console.log("ACESSOU O METODO LIMPA DADOS XLS");

    let token = localStorage.getItem("@FlashSafe-token");

    /*const obj = { 
            "nome": objeto.nome, 
            "cpf": objeto.cpf, 
            "email": objeto.email,
            "arquivo": objeto.arquivo,
            "maquina": objeto.maquina,
            "pseudo": objeto.pseudo,  
        };*/

    const obj = {
      nome: "Elisa Daniela Pereira",
      cpf: "905.414.442-47",
      email: "luizaelzaduarte_@marcossousa.com",
      arquivo: "/j/cmds/relacaoRh.xlsx",
      maquina: "30SMDWGF4VPP",
    };

    await xlsLimpa(token, obj);
  }

  /* ============================================================= */
  /* === METODO RESPONSAVEL POR PESQUISAR UMA MAQUINA PELO NOME === */
  /* ============================================================= */
  async function pesquisaMaquina() {
    let token = localStorage.getItem("@FlashSafe-token");

    /*const obj = { 
            "nome": objeto.nome, 
            "cpf": objeto.cpf, 
            "email": objeto.email,
            "arquivo": objeto.arquivo,
            "maquina": objeto.maquina,
            "pseudo": objeto.pseudo,  
        };*/

    const obj = {
      nome: "Elisa Daniela Pereira",
      cpf: "905.414.442-47",
      email: "luizaelzaduarte_@marcossousa.com",
      arquivo: "/j/cmds/relacaoRh.xlsx",
      maquina: "30SMDWGF4VPP",
    };

    await pesquisaMaquina();
  }

  function handleSwitch(event, index) {
    let array = searchList;
    console.log(array[index].tipo, "é isso");
    array[index].tipo = !array[index].tipo;
    console.log(array[index].tipo, "virou isso");

    setSearchList(array);
    InputForm();
    console.log(searchList);
  }

  /* OBSERVADORES SWITCHS */
  function handleSwitchExp1(event) {
    let array = switchExp1;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp1(array);
    InputForm();

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp2(event) {
    let array = switchExp2;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp2(array);
    InputForm();
    console.log(switchExp2);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp3(event) {
    let array = switchExp3;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp3(array);
    InputForm();
    console.log(switchExp3);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp4(event) {
    let array = switchExp4;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp4(array);
    InputForm();
    console.log(switchExp4);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp5(event) {
    let array = switchExp5;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp5(array);
    InputForm();
    console.log(switchExp5);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp6(event) {
    let array = switchExp6;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp6(array);
    InputForm();
    console.log(switchExp6);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp7(event) {
    let array = switchExp7;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp7(array);
    InputForm();
    console.log(switchExp7);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp8(event) {
    let array = switchExp8;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp8(array);
    InputForm();
    console.log(switchExp8);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp9(event) {
    let array = switchExp9;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp9(array);
    InputForm();
    console.log(switchExp9);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  function handleSwitchExp10(event) {
    let array = switchExp10;
    console.log(array, "é isso");
    array = !array;
    console.log(array, "virou isso");

    setSwitchExp10(array);
    InputForm();
    console.log(switchExp10);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/
  }

  /* FIM OBSERVADORES SWITCH */

  function handleSelecionarTodasAsMaquinas(selecao) {
    if (selecao === true) {
      let memoria = [];

      for (let i = 0; i < arrayMaquinas.length; i++) {
        memoria.push(arrayMaquinas[i].maquina);
      }

      selecaoTodasMaquinas = JSON.stringify(memoria);

      selecaoTodasMaquinas = selecaoTodasMaquinas.replace("[", "");
      selecaoTodasMaquinas = selecaoTodasMaquinas.replace("]", "");

      console.log("MAQUINAS SELECIONADAS");
      console.log(selecaoTodasMaquinas);

      window.document.querySelector("#botao").disabled = true;
      window.document.querySelector("#todos").disabled = true;
    } else {
      let memoria = [];

      selecaoTodasMaquinas = memoria;

      if (selecaoTodasMaquinas.length == 0) {
        console.log("ARRAY DE SELECAO TODAL DE MAQUINAS ZERADO!!");

        console.log("MAQUINAS SELECIONADAS");
        console.log(selecaoTodasMaquinas);

        window.document.querySelector("#botao").disabled = false;
      }
    }
  }

  function handleDelete(i) {
    let array = searchList; // make a separate copy of the array

    delete array[i];

    let aux = array.filter(function (el) {
      return el != null;
    });

    console.log(aux);

    setSearchList(aux);

    InputForm();
  }

  /* === CAPTURA O VALOR DO INPUT === */
  function handleFormInput(index, event) {
    let array = searchList;

    array[index].pesquisa = event;

    setSearchList(array);

    console.log(searchList);
  }

  /* === OBSERVADOR JOB REALIZADO === */
  function handleJob(event) {
    setSelecaoJOB(event);

    discoverySelecionado = event;

    //geraListaDeMaquinasDoJob(event);
    getDadosDiscovery(event);
  }

  /* === OBSERVADOR NOME MAQUINA === */
  function handleNomeMaquina(event) {
    setSelecaoMaquina(event);

    idJob = selecaoMaquina;

    for (let i = 0; i < arrayMaquinas.length; i++) {
      if (arrayMaquinas[i].maquina === event) {
        console.log(arrayMaquinas[i]);
        console.log(arrayMaquinas[i].computer_name);
        setSelecaoMaquinaNome(arrayMaquinas[i].computer_name);
      }
    }
  }

  function handleAddSearch() {
    let array = searchList;

    if (searchList.length < 10) {
      array.push({
        //id: searchList.length,
        pesquisa: "",
        tipo: true,
      });

      setSearchList(array);

      InputForm();
    }
  }

  /* CONTROLE PARA SELECAO DE INPUTS RADIUS */
  function handleE(event) {
    setFiltroE(!filtroE);
    setFiltroOU(filtroE);

    setArquivosQuarentena(false);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/

    //console.log("E: "+ event +"OU: "+ filtroOU);

    //document.querySelector('#e').checked = true;
    //document.querySelector('#ou').checked = false;
  }

  function handleOU(event) {
    setFiltroOU(!filtroOU);
    setFiltroE(filtroOU);

    setArquivosQuarentena(false);

    /*setTimeout(() => {
            atualizarrPesquisa(false);
        }, 1000);*/

    //console.log("OU: "+ event +"E: "+ filtroE);

    //document.querySelector('#ou').checked = true;
    //document.querySelector('#e').checked = false;
  }

  function handleArquivosQuarentena(event) {
    setFiltroOU(true);
    setFiltroE(false);

    if (event) {
      setArquivosQuarentena(true);

      setFiltroOU(false);
      setFiltroE(false);
    } else {
      setFiltroOU(true);
      setFiltroE(false);

      setArquivosQuarentena(false);
    }

    //atualizarrPesquisa(event);
  }

  /* === REALIZA PESQUISA DO DISCOVERY ATIVO === */
  function realizarPesquisa() {
    let acessToken = localStorage.getItem("@FlashSafe-token");

    setContadorClick(1);

    const arrayPesquisa = searchList;

    /*const obj = {
            posisao1: "",
            posisao2: "",
            posisao3: "",
            posisao4: "",
            posisao5: "",
            posisao6: "",
            posisao7: "",
            posisao8: "",
            posisao9: "",
            posisao10: "",
        };*/

    let construcaoWhere = "";

    let condicao = "";
    if (filtroE) {
      condicao = "and";
    } else if (filtroOU) {
      condicao = "or";
    } /*else if(arquivosQuarentena) {
            condicao = 'and quarentena is not null'
        }*/

    if (carregamentoDescoberta.exp_1 !== "" && switchExp1) {
      if (carregamentoDescoberta.exp_2 !== "") {
        // construcaoWhere = construcaoWhere + "exp_1='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_2 !== '') {
                construcaoWhere = construcaoWhere +"exp_1='1' or ";
            
            }*/ else if (switchExp1) {
        console.log("ESTADO SWITCH: " + switchExp1);
        // construcaoWhere = construcaoWhere + "exp_1='1'";
      }
    } /*else if(carregamentoDescoberta.exp_1 !== '' && !switchExp1) {
            if(carregamentoDescoberta.exp_2 !== '') {
                construcaoWhere = construcaoWhere +"exp_1='1' or ";
            
            }else if(carregamentoDescoberta.exp_2 !== '') {
                construcaoWhere = construcaoWhere +"exp_1='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_1='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_2 !== "" && switchExp2) {
      if (carregamentoDescoberta.exp_3 !== "") {
        //  construcaoWhere = construcaoWhere + "exp_2='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_3 !== '') {
                construcaoWhere = construcaoWhere +"exp_2='1' or ";
            
            }*/ else if (switchExp2) {
        // construcaoWhere = construcaoWhere + "exp_2='1'";
      }
    } /*else if(carregamentoDescoberta.exp_2 !== '' && !switchExp2) {
            if(carregamentoDescoberta.exp_3 !== '') {
                construcaoWhere = construcaoWhere +"exp_2='1' or ";
            
            }else if(carregamentoDescoberta.exp_3 !== '') {
                construcaoWhere = construcaoWhere +"exp_2='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_2='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_3 !== "" && switchExp3) {
      if (carregamentoDescoberta.exp_4 !== "") {
        // construcaoWhere = construcaoWhere + "exp_3='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_4 !== '') {
                construcaoWhere = construcaoWhere +"exp_3='1' or ";
            
            }*/ else if (switchExp3) {
        //  construcaoWhere = construcaoWhere + "exp_3='1'";
      }
    } /*else if(carregamentoDescoberta.exp_3 !== '' && !switchExp3) {
            if(carregamentoDescoberta.exp_4 !== '') {
                construcaoWhere = construcaoWhere +"exp_3='1' or ";
            
            }else if(carregamentoDescoberta.exp_4 !== '') {
                construcaoWhere = construcaoWhere +"exp_3='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_3='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_4 !== "" && switchExp4) {
      if (carregamentoDescoberta.exp_5 !== "") {
        // construcaoWhere = construcaoWhere + "exp_4='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_5 !== '') {
                construcaoWhere = construcaoWhere +"exp_4='1' or ";
            
            }*/ else if (switchExp4) {
        //  construcaoWhere = construcaoWhere + "exp_4='1'";
      }
    } /*else if(carregamentoDescoberta.exp_4 !== '' && !switchExp4) {
            if(carregamentoDescoberta.exp_5 !== '') {
                construcaoWhere = construcaoWhere +"exp_4='1' or ";
            
            }else if(carregamentoDescoberta.exp_5 !== '') {
                construcaoWhere = construcaoWhere +"exp_4='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_4='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_5 !== "" && switchExp5) {
      if (carregamentoDescoberta.exp_6 !== "") {
        //  construcaoWhere = construcaoWhere + "exp_5='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_6 !== '') {
                construcaoWhere = construcaoWhere +"exp_5='1' or ";
            
            }*/ else if (switchExp5) {
        //   construcaoWhere = construcaoWhere + "exp_5='1'";
      }
    } /*else if(carregamentoDescoberta.exp_5 !== '' && !switchExp5) {
            if(carregamentoDescoberta.exp_6 !== '') {
                construcaoWhere = construcaoWhere +"exp_5='1' or ";
            
            }else if(carregamentoDescoberta.exp_6 !== '') {
                construcaoWhere = construcaoWhere +"exp_5='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_5='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_6 !== "" && switchExp6) {
      if (carregamentoDescoberta.exp_7 !== "") {
        // construcaoWhere = construcaoWhere + "exp_6='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_7 !== '') {
                construcaoWhere = construcaoWhere +"exp_6='1' or ";
            
            }*/ else if (switchExp6) {
        //  construcaoWhere = construcaoWhere + "exp_6='1'";
      }
    } /*else if(carregamentoDescoberta.exp_6 !== '' && !switchExp6) {
            if(carregamentoDescoberta.exp_7 !== '') {
                construcaoWhere = construcaoWhere +"exp_6='1' or ";
            
            }else if(carregamentoDescoberta.exp_7 !== '') {
                construcaoWhere = construcaoWhere +"exp_6='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_6='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_7 !== "" && switchExp7) {
      if (carregamentoDescoberta.exp_8 !== "") {
        // construcaoWhere = construcaoWhere + "exp_7='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_8 !== '') {
                construcaoWhere = construcaoWhere +"exp_7='1' or ";
            
            }*/ else if (switchExp7) {
        // construcaoWhere = construcaoWhere + "exp_7='1'";
      }
    } /*else if(carregamentoDescoberta.exp_7 !== '' && !switchExp7) {
            if(carregamentoDescoberta.exp_8 !== '') {
                construcaoWhere = construcaoWhere +"exp_7='1' or ";
            
            }else if(carregamentoDescoberta.exp_8 !== '') {
                construcaoWhere = construcaoWhere +"exp_7='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_7='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_8 !== "" && switchExp8) {
      if (carregamentoDescoberta.exp_9 !== "") {
        //  construcaoWhere = construcaoWhere + "exp_8='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_9 !== '') {
                construcaoWhere = construcaoWhere +"exp_8='1' or ";
            
            }*/ else if (switchExp8) {
        //  construcaoWhere = construcaoWhere + "exp_8='1'";
      }
    } /*else if(carregamentoDescoberta.exp_8 !== '' && !switchExp8) {
            if(carregamentoDescoberta.exp_9 !== '') {
                construcaoWhere = construcaoWhere +"exp_8='1' or ";
            
            }else if(carregamentoDescoberta.exp_9 !== '') {
                construcaoWhere = construcaoWhere +"exp_8='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_8='1'";
            
            }
        }*/

    if (carregamentoDescoberta.exp_9 !== "" && switchExp9) {
      if (carregamentoDescoberta.exp_10 !== "") {
        // construcaoWhere = construcaoWhere + "exp_9='1' " + condicao + " ";
      } /*else if(carregamentoDescoberta.exp_10 !== '') {
                construcaoWhere = construcaoWhere +"exp_9='1' or ";
            
            }*/ else if (switchExp9) {
        // construcaoWhere = construcaoWhere + "exp_9='1'";
      }
    } /*else if(carregamentoDescoberta.exp_9 !== '' && !switchExp9) {
            if(carregamentoDescoberta.exp_10 !== '') {
                construcaoWhere = construcaoWhere +"exp_9='1' or ";
            
            }else if(carregamentoDescoberta.exp_10 !== '') {
                construcaoWhere = construcaoWhere +"exp_9='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_9='1'";
            
            }

        }*/

    if (carregamentoDescoberta.exp_10 !== "" && switchExp10) {
      //construcaoWhere = construcaoWhere + "exp_10='1'";
    } /*else if(carregamentoDescoberta.exp_10 !== '' && !switchExp10) {
            construcaoWhere = construcaoWhere +"exp_10='1'";
        
        }*/

    /*for(let i = 0; i < arrayPesquisa.length; i++) {
            //if(arrayPesquisa[i].pesquisa !== null) {
                switch((i + 1)) {
                case 1:
                    //obj.posisao1 = arrayPesquisa[i].pesquisa;
                    
                    if(carregamentoDescoberta.exp_1 !== '' && switchExp1) {
                        construcaoWhere = construcaoWhere +" exp_1=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_1 !== '' && !switchExp1) {
                        construcaoWhere = construcaoWhere +" exp_1=1 or ";
                    }

                break;
                case 2:
                    //obj.posisao2 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_2 !== '' && switchExp2) {
                        construcaoWhere = construcaoWhere +"exp_2=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_2 !== '' && !switchExp2) {
                        construcaoWhere = construcaoWhere +"exp_2=1 or ";
                    }

                break;
                case 3:
                    //obj.posisao3 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_3 !== '' && switchExp3) {
                        construcaoWhere = construcaoWhere +"exp_3=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_3 !== '' && !switchExp3) {
                        construcaoWhere = construcaoWhere +"exp_3=1 or ";
                    }

                break;
                case 4:
                    //obj.posisao4 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_4 !== '' && switchExp4) {
                        construcaoWhere = construcaoWhere +"exp_4=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_4 !== '' && !switchExp4) {
                        construcaoWhere = construcaoWhere +"exp_4=1 or ";
                    }

                break;
                case 5:
                    //obj.posisao5 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_5 !== '' && switchExp5) {
                        construcaoWhere = construcaoWhere +"exp_5=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_5 !== '' && !switchExp5) {
                        construcaoWhere = construcaoWhere +"exp_5=1 or ";
                    }

                break;
                case 6:
                    //obj.posisao6 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_6 !== '' && switchExp6) {
                        construcaoWhere = construcaoWhere +"exp_6=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_6 !== '' && !switchExp6) {
                        construcaoWhere = construcaoWhere +"exp_6=1 or ";
                    }

                break;
                case 7:
                    //obj.posisao7 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_7 !== '' && switchExp7) {
                        construcaoWhere = construcaoWhere +"exp_7=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_7 !== '' && !switchExp7) {
                        construcaoWhere = construcaoWhere +"exp_7=1 or ";
                    }

                break;
                case 8:
                    //obj.posisao8 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_8 !== '' && switchExp8) {
                        construcaoWhere = construcaoWhere +"exp_8=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_8 !== '' && !switchExp8) {
                        construcaoWhere = construcaoWhere +"exp_8=1 or ";
                    }

                break;
                case 9:
                    //obj.posisao9 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_9 !== '' && switchExp9) {
                        construcaoWhere = construcaoWhere +"exp_9=1 and ";
                    
                    }else if(carregamentoDescoberta.exp_9 !== '' && !switchExp9) {
                        construcaoWhere = construcaoWhere +"exp_9=1 or ";
                    }

                break;
                case 10:
                    //obj.posisao10 = arrayPesquisa[i].pesquisa;

                    if(carregamentoDescoberta.exp_10 !== '' && switchExp10) {
                        construcaoWhere = construcaoWhere +"exp_10=1";
                    
                    }else if(carregamentoDescoberta.exp_10 !== '' && !switchExp10) {
                        construcaoWhere = construcaoWhere +"exp_10=1";
                    
                    }

                break;
                }
            //}
        }*/

    //console.log('QUERY PARA PESQUISA DA DESCOBERTA: '+ construcaoWhere);
    //console.log(`maquina='${selecaoMaquina}' and (${construcaoWhere})`);

    let pesquisaMaquina = "";

    if (construcaoWhere.length == 0) {
      //pesquisaMaquina = `maquina='${selecaoMaquina}'`;

      //pesquisaMaquina = `maquina in ('${selecaoMaquina}')`;
      pesquisaMaquina = `id_discovery=${selecaoJOB}`; // and (${construcaoWhere})`;
    } else {
      //pesquisaMaquina = `maquina='${selecaoMaquina}' ${condicao} (${construcaoWhere})`;
      //pesquisaMaquina = `maquina in ('${selecaoMaquina}') ${condicao} (${construcaoWhere})`;

      //pesquisaMaquina = `maquina in ('${selecaoMaquina}') and (${construcaoWhere})`;
      pesquisaMaquina = `id_discovery=${selecaoJOB}`; // and (${construcaoWhere})`;
    }

    // console.log("QUERY PARA PESQUISA DA DESCOBERTA: " + pesquisaMaquina);

    //maquina in('VG2IPPLQHBPP','0S1R9KC96GG','77IV36R2C0P')

    /* CASO O USUARIO TENHA SELECIONADO TODAS AS MAQUINAS, E REALIZADO UM AJUSTE NA VARIAVEL PARA QUE SEJA CARREGADO TODAS AS MAQUINAS SELECIONADAS */
    // AJUSTAR ESSA PARTE
    if (selecaoTodasMaquinas.length > 2) {
      //pesquisaMaquina = `maquina in (${selecaoTodasMaquinas.replaceAll('"', '\'')}) and (${construcaoWhere})`;
      pesquisaMaquina = `id_discovery=${selecaoJOB} `; //and quarentena is not null`;
      console.log(pesquisaMaquina);
    }

    if (arquivosQuarentena) {
      //pesquisaMaquina = `maquina in (${selecaoTodasMaquinas.replaceAll('"', '\'')}) and quarentena is not null`;
      pesquisaMaquina = `id_discovery=${selecaoJOB}`; // and quarentena is not null`;
      console.log(pesquisaMaquina);
    }

    const pesquisa = {
      tabela: "map_arquivos",
      //select: "maquina='"+ selecaoMaquina +"' where"+ construcaoWhere,
      //"select": "maquina='GQQ0L3_5VW7D73' or (exp_1=1 and exp_2=1 and exp_3=1 and exp_4=1)",
      select: pesquisaMaquina,
      //"campos_select_end_point": "computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^codigo_drive",
      campos_select_end_point:
        "id_arquivo^computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^quarentena^codigo_drive^exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
      get_qt: "0",
      //"pagina": "1",
      pagina: 1,
      //"qt": "500"
      //qt: qtdPorPagina,
      qt: 10000,
    };

    //let converteJSON = JSON.stringify(pesquisa);
    //converteJSON = converteJSON.replace(',','');

    //console.log('JSON convertido em String');
    //console.log(converteJSON);

    console.log("QUERY: ");
    console.log(pesquisa);

    try {
      api
        .post("/sql/selectSql/" + acessToken + "/resp_rest", pesquisa)
        .then((response) => {
          /* let memoria = response.data.replace('"total_paginas":"',''); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
                memoria = memoria.replace(' ',''); // REMOVE O ESPEÇO QUE FICOU SOBRENDO DEVIDO AO PRIMEIRO REPLACE
                let valorMemoria = ''; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
                let contador = 1; // CONTADO PARA SABER QUANDO SAIR DO ELSE

                // LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES
                for(let i = 0; i < memoria.length; i++) {
                    if(contador === 0) {
                        valorMemoria = valorMemoria + memoria[i];

                    }else if(memoria[i] === ',' && contador === 1) {
                        contador--;
                    
                    }
                }

                valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING
                //valorMemoria = valorMemoria.replace(']','');

                valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

                //console.log('VALOR DA MEMORIA: '); // IMPRIME NA TELA O VALOR DO JSON OBTIDO
                //console.log(valorMemoria);

                //let array = valorMemoria; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE*/
          let array = response.data; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE

          let arrayAtualizado = [];
          arrayAtualizado = array;

          // console.log("DADOS CARREGADOS NO ARRAY: ");
          // console.log(arrayAtualizado);

          if (arrayAtualizado === "]") {
            toast.error(
              "Não foi localizado dados com a pesquisa especificada",
              {
                position: "top-right",
                autoClose: 4000,
                autoDismiss: true,
                hideProgressBar: false,
                pauseOnHover: true,
              }
            );
            setTableData([]);
          } else {
            setTableData(arrayAtualizado);
          }

          console.log("DADOS USE STATE TABLE DATA: ");
          console.log(tableData);

          /*for(let i = 0; i < array.length; i++) {
                    tableData.push(array[i]); // ALIMENTA O ARRAY COM OS DADOS DO JSON AJUSTADO
                }*/

          //setTableData(array);
          setIsLoading(false); // RETIRA A ANIMACAO DE LOAD
          //setOpenModalGroup(!openModalGroup); // ABRE O MODAL

          //console.log('DADOS PARA CARREGAR NA TEBELA: ');
          //console.log(tableData);

          //console.log('RESPOSTA: ');
          //console.log(response)
        })
        .catch((err) => {
          console.error("ops! ocorreu um erro" + err);
          toast.error("Não foi localizado dados com a pesquisa especificada", {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });

          setTableData("");
        });
    } catch (err) {
      history.push({ pathname: "/create-job", customNameData: true });
    }

    setOpenModalGroup(!openModalGroup); // ABRE O MODAL
    //setOpenModalGroup(!openModalGroup);
  }

  /* === REALIZA PESQUISA DO DISCOVERY ATIVO === */
  function atualizarrPesquisa(quarentena) {
    try {
      let acessToken = localStorage.getItem("@FlashSafe-token");

      const arrayPesquisa = searchList;

      console.log("ACESSOU ATUALIZAR PESQUISA!!");

      let construcaoWhere = "";

      let condicao = "";
      if (filtroE) {
        condicao = "and";
      } else if (filtroOU) {
        condicao = "or";
      } /*else if(arquivosQuarentena) {
            condicao = 'and quarentena is not null'
        }*/

      if (carregamentoDescoberta.exp_1 !== "" && switchExp1) {
        if (carregamentoDescoberta.exp_2 !== "") {
          //construcaoWhere = construcaoWhere + "exp_1='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_2 !== '') {
                construcaoWhere = construcaoWhere +"exp_1='1' or ";
            
            }*/ else if (switchExp1) {
          console.log("ESTADO SWITCH ATUALIZADO: " + switchExp1);
          //construcaoWhere = construcaoWhere + "exp_1='1'";
        }
      } /*else if(carregamentoDescoberta.exp_1 !== '' && !switchExp1 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_2 !== '') {
                construcaoWhere = construcaoWhere +"exp_1='1' or ";
            
            }else if(carregamentoDescoberta.exp_2 !== '') {
                construcaoWhere = construcaoWhere +"exp_1='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_1='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_2 !== "" && switchExp2) {
        if (carregamentoDescoberta.exp_3 !== "") {
          // construcaoWhere = construcaoWhere + "exp_2='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_3 !== '') {
                construcaoWhere = construcaoWhere +"exp_2='1' or ";
            
            }*/ else if (switchExp2) {
          // construcaoWhere = construcaoWhere + "exp_2='1'";
        }
      } /*else if(carregamentoDescoberta.exp_2 !== '' && !switchExp2 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_3 !== '') {
                construcaoWhere = construcaoWhere +"exp_2='1' or ";
            
            }else if(carregamentoDescoberta.exp_3 !== '') {
                construcaoWhere = construcaoWhere +"exp_2='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_2='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_3 !== "" && switchExp3) {
        if (carregamentoDescoberta.exp_4 !== "") {
          //construcaoWhere = construcaoWhere + "exp_3='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_4 !== '') {
                construcaoWhere = construcaoWhere +"exp_3='1' or ";
            
            }*/ else if (switchExp3) {
          // construcaoWhere = construcaoWhere + "exp_3='1'";
        }
      } /*else if(carregamentoDescoberta.exp_3 !== '' && !switchExp3 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_4 !== '') {
                construcaoWhere = construcaoWhere +"exp_3='1' or ";
            
            }else if(carregamentoDescoberta.exp_4 !== '') {
                construcaoWhere = construcaoWhere +"exp_3='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_3='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_4 !== "" && switchExp4) {
        if (carregamentoDescoberta.exp_5 !== "") {
          //construcaoWhere = construcaoWhere + "exp_4='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_5 !== '') {
                construcaoWhere = construcaoWhere +"exp_4='1' or ";
            
            }*/ else if (switchExp4) {
          //construcaoWhere = construcaoWhere + "exp_4='1'";
        }
      } /*else if(carregamentoDescoberta.exp_4 !== '' && !switchExp4 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_5 !== '') {
                construcaoWhere = construcaoWhere +"exp_4='1' or ";
            
            }else if(carregamentoDescoberta.exp_5 !== '') {
                construcaoWhere = construcaoWhere +"exp_4='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_4='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_5 !== "" && switchExp5) {
        if (carregamentoDescoberta.exp_6 !== "") {
          //construcaoWhere = construcaoWhere + "exp_5='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_6 !== '') {
                construcaoWhere = construcaoWhere +"exp_5='1' or ";
            
            }*/ else if (switchExp5) {
          //construcaoWhere = construcaoWhere + "exp_5='1'";
        }
      } /*else if(carregamentoDescoberta.exp_5 !== '' && !switchExp5 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_6 !== '') {
                construcaoWhere = construcaoWhere +"exp_5='1' or ";
            
            }else if(carregamentoDescoberta.exp_6 !== '') {
                construcaoWhere = construcaoWhere +"exp_5='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_5='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_6 !== "" && switchExp6) {
        if (carregamentoDescoberta.exp_7 !== "") {
          // construcaoWhere = construcaoWhere + "exp_6='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_7 !== '') {
                construcaoWhere = construcaoWhere +"exp_6='1' or ";
            
            }*/ else if (switchExp6) {
          //  construcaoWhere = construcaoWhere + "exp_6='1'";
        }
      } /*else if(carregamentoDescoberta.exp_6 !== '' && !switchExp6 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_7 !== '') {
                construcaoWhere = construcaoWhere +"exp_6='1' or ";
            
            }else if(carregamentoDescoberta.exp_7 !== '') {
                construcaoWhere = construcaoWhere +"exp_6='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_6='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_7 !== "" && switchExp7) {
        if (carregamentoDescoberta.exp_8 !== "") {
          // construcaoWhere = construcaoWhere + "exp_7='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_8 !== '') {
                construcaoWhere = construcaoWhere +"exp_7='1' or ";
            
            }*/ else if (switchExp7) {
          // construcaoWhere = construcaoWhere + "exp_7='1'";
        }
      } /*else if(carregamentoDescoberta.exp_7 !== '' && !switchExp7 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_8 !== '') {
                construcaoWhere = construcaoWhere +"exp_7='1' or ";
            
            }else if(carregamentoDescoberta.exp_8 !== '') {
                construcaoWhere = construcaoWhere +"exp_7='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_7='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_8 !== "" && switchExp8) {
        if (carregamentoDescoberta.exp_9 !== "") {
          // construcaoWhere = construcaoWhere + "exp_8='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_9 !== '') {
                construcaoWhere = construcaoWhere +"exp_8='1' or ";
            
            }*/ else if (switchExp8) {
          //construcaoWhere = construcaoWhere + "exp_8='1'";
        }
      } /*else if(carregamentoDescoberta.exp_8 !== '' && !switchExp8 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_9 !== '') {
                construcaoWhere = construcaoWhere +"exp_8='1' or ";
            
            }else if(carregamentoDescoberta.exp_9 !== '') {
                construcaoWhere = construcaoWhere +"exp_8='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_8='1'";
            
            }
        }*/

      if (carregamentoDescoberta.exp_9 !== "" && switchExp9) {
        if (carregamentoDescoberta.exp_10 !== "") {
          //construcaoWhere = construcaoWhere + "exp_9='1' " + condicao + " ";
        } /*else if(carregamentoDescoberta.exp_10 !== '') {
                construcaoWhere = construcaoWhere +"exp_9='1' or ";
            
            }*/ else if (switchExp9) {
          // construcaoWhere = construcaoWhere + "exp_9='1'";
        }
      } /*else if(carregamentoDescoberta.exp_9 !== '' && !switchExp9 && !arquivosQuarentena) {
            if(carregamentoDescoberta.exp_10 !== '') {
                construcaoWhere = construcaoWhere +"exp_9='1' or ";
            
            }else if(carregamentoDescoberta.exp_10 !== '') {
                construcaoWhere = construcaoWhere +"exp_9='1' and ";
            
            }else {
                construcaoWhere = construcaoWhere +"exp_9='1'";
            
            }

        }*/

      if (carregamentoDescoberta.exp_10 !== "" && switchExp10) {
        // construcaoWhere = construcaoWhere + "exp_10='1'";
      } /*else if(carregamentoDescoberta.exp_10 !== '' && !switchExp10 && !arquivosQuarentena) {
            construcaoWhere = construcaoWhere +"exp_10='1'";
        
        }*/

      let pesquisaMaquina = "";

      if (construcaoWhere.length == 0 && !arquivosQuarentena) {
        //pesquisaMaquina = `maquina='${selecaoMaquina}'`;
        pesquisaMaquina = `id_discovery=${selecaoJOB}`;
      } else if (!arquivosQuarentena) {
        //pesquisaMaquina = `maquina='${selecaoMaquina}' ${condicao} (${construcaoWhere})`;
        //pesquisaMaquina = `maquina in ('${selecaoMaquina}') ${condicao} (${construcaoWhere})`;
        pesquisaMaquina = `id_discovery=${selecaoJOB} `; //and (${construcaoWhere})`;
      }

      // console.log("QUERY PARA PESQUISA DA DESCOBERTA: " + pesquisaMaquina);

      //maquina in('VG2IPPLQHBPP','0S1R9KC96GG','77IV36R2C0P')

      /* CASO O USUARIO TENHA SELECIONADO TODAS AS MAQUINAS, E REALIZADO UM AJUSTE NA VARIAVEL PARA QUE SEJA CARREGADO TODAS AS MAQUINAS SELECIONADAS */
      // AJUSTAR ESSA PARTE
      if (selecaoTodasMaquinas.length > 2 && !arquivosQuarentena) {
        //pesquisaMaquina = `maquina in (${selecaoTodasMaquinas.replaceAll('"', '\'')}) and (${construcaoWhere})`;
        pesquisaMaquina = `id_discovery=${selecaoJOB} `; //and (${construcaoWhere})`;
        console.log(pesquisaMaquina);
      }

      console.log(`VALOR VARIAVEL QUARENTENA: ${quarentena}`);

      if (quarentena) {
        //pesquisaMaquina = `maquina in ('${selecaoMaquina}') and quarentena is not null`;
        pesquisaMaquina = `id_discovery=${selecaoJOB} `; //and quarentena is not null`;
        console.log(pesquisaMaquina);
      }

      if (selecaoTodasMaquinas.length > 2 && quarentena) {
        //pesquisaMaquina = `maquina in ('${selecaoTodasMaquinas.replaceAll('"', '\'')}') and quarentena is not null`;
        pesquisaMaquina = `id_discovery=${selecaoJOB}`; // and quarentena is not null`;
        console.log(pesquisaMaquina);
      }

      const pesquisa = {
        tabela: "map_arquivos",
        //select: "maquina='"+ selecaoMaquina +"' where"+ construcaoWhere,
        //"select": "maquina='GQQ0L3_5VW7D73' or (exp_1=1 and exp_2=1 and exp_3=1 and exp_4=1)",
        select: pesquisaMaquina,
        //"campos_select_end_point": "computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^codigo_drive",
        campos_select_end_point:
          "id_arquivo^computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^quarentena^codigo_drive^exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
        get_qt: "0",
        //"pagina": "1",
        pagina: 1,
        //"qt": "800"
        //qt: qtdPorPagina,
        qt: 10000,
      };

      console.log("CORPO PESQUISA: ");
      console.log(pesquisa);

      //let converteJSON = JSON.stringify(pesquisa);
      //converteJSON = converteJSON.replace(',','');

      //console.log('JSON convertido em String');
      //console.log(converteJSON);

      let valorRetorno = [];

      try {
        api
          .post("/sql/selectSql/" + acessToken + "/resp_rest", pesquisa)
          .then((response) => {
            /*let memoria = response.data.replace('"total_paginas":"',''); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
                memoria = memoria.replace(' ',''); // REMOVE O ESPEÇO QUE FICOU SOBRENDO DEVIDO AO PRIMEIRO REPLACE
                let valorMemoria = ''; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
                let contador = 1; // CONTADO PARA SABER QUANDO SAIR DO ELSE

                // LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES
                for(let i = 0; i < memoria.length; i++) {
                    if(contador === 0) {
                        valorMemoria = valorMemoria + memoria[i];

                    }else if(memoria[i] === ',' && contador === 1) {
                        contador--;
                    
                    }
                }

                valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING
                //valorMemoria = valorMemoria.replace(']','');

                valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

                //console.log('VALOR DA MEMORIA: '); // IMPRIME NA TELA O VALOR DO JSON OBTIDO
                //console.log(valorMemoria);*/
            /*console.log(response.data);

                let valorMemoria = '';
                valorMemoria = response.data;

                let array = valorMemoria; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE

                let arrayAtualizado = [];
                arrayAtualizado = array;

                console.log('DADOS CARREGADOS NO ARRAY: ');
                console.log(arrayAtualizado);

                setTableData(arrayAtualizado);

                console.log('DADOS USE STATE TABLE DATA: ');
                console.log(tableData);*/

            valorRetorno = response.data;
            console.log(valorRetorno);

            if (valorRetorno === "]") {
              toast.error(
                "Não foi localizado dados com a pesquisa especificada",
                {
                  position: "top-right",
                  autoClose: 4000,
                  autoDismiss: true,
                  hideProgressBar: false,
                  pauseOnHover: true,
                }
              );

              if (arquivosQuarentena) {
                setFiltroE(false);
                setFiltroOU(true);

                setArquivosQuarentena(false);
              } else {
                setFiltroE(false);
                setFiltroOU(true);

                setArquivosQuarentena(false);
              }

              setTableData([]);
            } else {
              console.log("ACESSOU O PREENCHIMENTO DA TABELA: ");
              setTableData(valorRetorno);
              console.log("VALOR TABLE: ");
              console.log(tableData);
            }

            /*for(let i = 0; i < array.length; i++) {
                    tableData.push(array[i]); // ALIMENTA O ARRAY COM OS DADOS DO JSON AJUSTADO
                }*/

            //setTableData(array);
            setIsLoading(false); // RETIRA A ANIMACAO DE LOAD

            //console.log('DADOS PARA CARREGAR NA TEBELA: ');
            //console.log(tableData);

            //console.log('RESPOSTA: ');
            //console.log(response)
          })
          .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            toast.error(
              "Não foi localizado dados com a pesquisa especificada",
              {
                position: "top-right",
                autoClose: 4000,
                autoDismiss: true,
                hideProgressBar: false,
                pauseOnHover: true,
              }
            );
            console.log("history");
            valorRetorno = [];

            setTableData("");
          });
      } catch (erro) {
        history.push({ pathname: "/create-job", customNameData: true });
      }

      //setOpenModalGroup(!openModalGroup);
    } catch (error) {
      console.log(error);
    }
  }

  /* ATUALIZACAO DE LISTA CONTROLADA (DINAMICA) */
  function atualizacaoDinamica(quarentena, acao) {
    try {
      let acessToken = localStorage.getItem("@FlashSafe-token");

      const arrayPesquisa = searchList;

      console.log("ACESSOU ATUALIZAR PESQUISA!!");

      let construcaoWhere = "";

      let condicao = "";
      if (filtroE) {
        condicao = "and";
      } else if (filtroOU) {
        condicao = "or";
      }

      if (carregamentoDescoberta.exp_1 !== "" && switchExp1) {
        if (carregamentoDescoberta.exp_2 !== "") {
          // construcaoWhere = construcaoWhere + "exp_1='1' " + condicao + " ";
        } else if (switchExp1) {
          console.log("ESTADO SWITCH ATUALIZADO: " + switchExp1);
          //construcaoWhere = construcaoWhere + "exp_1='1'";
        }
      }

      if (carregamentoDescoberta.exp_2 !== "" && switchExp2) {
        if (carregamentoDescoberta.exp_3 !== "") {
          //  construcaoWhere = construcaoWhere + "exp_2='1' " + condicao + " ";
        } else if (switchExp2) {
          //construcaoWhere = construcaoWhere + "exp_2='1'";
        }
      }

      if (carregamentoDescoberta.exp_3 !== "" && switchExp3) {
        if (carregamentoDescoberta.exp_4 !== "") {
          //construcaoWhere = construcaoWhere + "exp_3='1' " + condicao + " ";
        } else if (switchExp3) {
          //construcaoWhere = construcaoWhere + "exp_3='1'";
        }
      }

      if (carregamentoDescoberta.exp_4 !== "" && switchExp4) {
        if (carregamentoDescoberta.exp_5 !== "") {
          // construcaoWhere = construcaoWhere + "exp_4='1' " + condicao + " ";
        } else if (switchExp4) {
          //construcaoWhere = construcaoWhere + "exp_4='1'";
        }
      }

      if (carregamentoDescoberta.exp_5 !== "" && switchExp5) {
        if (carregamentoDescoberta.exp_6 !== "") {
          // construcaoWhere = construcaoWhere + "exp_5='1' " + condicao + " ";
        } else if (switchExp5) {
          // construcaoWhere = construcaoWhere + "exp_5='1'";
        }
      }

      if (carregamentoDescoberta.exp_6 !== "" && switchExp6) {
        if (carregamentoDescoberta.exp_7 !== "") {
          //  construcaoWhere = construcaoWhere + "exp_6='1' " + condicao + " ";
        } else if (switchExp6) {
          // construcaoWhere = construcaoWhere + "exp_6='1'";
        }
      }

      if (carregamentoDescoberta.exp_7 !== "" && switchExp7) {
        if (carregamentoDescoberta.exp_8 !== "") {
          //  construcaoWhere = construcaoWhere + "exp_7='1' " + condicao + " ";
        } else if (switchExp7) {
          // construcaoWhere = construcaoWhere + "exp_7='1'";
        }
      }

      if (carregamentoDescoberta.exp_8 !== "" && switchExp8) {
        if (carregamentoDescoberta.exp_9 !== "") {
          //  construcaoWhere = construcaoWhere + "exp_8='1' " + condicao + " ";
        } else if (switchExp8) {
          //  construcaoWhere = construcaoWhere + "exp_8='1'";
        }
      }

      if (carregamentoDescoberta.exp_9 !== "" && switchExp9) {
        if (carregamentoDescoberta.exp_10 !== "") {
          // construcaoWhere = construcaoWhere + "exp_9='1' " + condicao + " ";
        } else if (switchExp9) {
          // construcaoWhere = construcaoWhere + "exp_9='1'";
        }
      }

      if (carregamentoDescoberta.exp_10 !== "" && switchExp10) {
        // construcaoWhere = construcaoWhere + "exp_10='1'";
      }

      let pesquisaMaquina = "";

      if (construcaoWhere.length == 0 && !arquivosQuarentena) {
        pesquisaMaquina = `id_discovery=${selecaoJOB}`;
      } else if (!arquivosQuarentena) {
        pesquisaMaquina = `id_discovery=${selecaoJOB}`; // and (${construcaoWhere})`;
      }

      // console.log("QUERY PARA PESQUISA DA DESCOBERTA: " + pesquisaMaquina);

      //maquina in('VG2IPPLQHBPP','0S1R9KC96GG','77IV36R2C0P')

      /* CASO O USUARIO TENHA SELECIONADO TODAS AS MAQUINAS, E REALIZADO UM AJUSTE NA VARIAVEL PARA QUE SEJA CARREGADO TODAS AS MAQUINAS SELECIONADAS */
      // AJUSTAR ESSA PARTE
      if (selecaoTodasMaquinas.length > 2 && !arquivosQuarentena) {
        pesquisaMaquina = `id_discovery=${selecaoJOB}`; // and (${construcaoWhere})`;
        console.log(pesquisaMaquina);
      }

      console.log(`VALOR VARIAVEL QUARENTENA: ${quarentena}`);

      if (quarentena) {
        pesquisaMaquina = `id_discovery=${selecaoJOB} `; //and quarentena is not null`;
        console.log(pesquisaMaquina);
      }

      if (selecaoTodasMaquinas.length > 2 && quarentena) {
        pesquisaMaquina = `id_discovery=${selecaoJOB} `; //and quarentena is not null`;
        console.log(pesquisaMaquina);
      }

      if (acao == "avancar") {
        paginaAtual = paginaAtual + 1;
        console.log(acao);

        setContadorClick(contadorClick + 1);

        console.log(contadorClick);
      } else {
        paginaAtual = paginaAtual - 1;
        console.log(acao);

        setContadorClick(contadorClick - 1);

        console.log(contadorClick);
      }

      var pesquisa = {
        tabela: "",
        select: "",
        campos_select_end_point: "",
        get_qt: "",
        pagina: "",
        qt: "",
      };

      if (contadorClick - 1 == 0 && acao == "retroceder") {
        setContadorClick(1);

        pesquisa = {
          tabela: "map_arquivos",
          select: pesquisaMaquina,
          campos_select_end_point:
            "id_arquivo^computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^quarentena^codigo_drive^exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
          get_qt: "0",
          pagina: contadorClick,
          //qt: qtdPorPagina,
          qt: 10000,
        };
      } else {
        pesquisa = {
          tabela: "map_arquivos",
          select: pesquisaMaquina,
          campos_select_end_point:
            "id_arquivo^computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^quarentena^codigo_drive^exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
          get_qt: "0",
          pagina: acao == "avancar" ? contadorClick + 1 : contadorClick - 1,
          //qt: qtdPorPagina,
          qt: 10000,
        };
      }

      /*const pesquisa = {
            "tabela": "map_arquivos",
            "select": pesquisaMaquina,
            "campos_select_end_point": "id_arquivo^computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^quarentena^codigo_drive^exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
            "get_qt": "0",
            "pagina": acao == "avancar" ? (contadorClick + 1) : (contadorClick - 1),
            "qt": qtdPorPagina
        }*/

      console.log(pesquisa);

      let valorRetorno = [];

      try {
        api
          .post("/sql/selectSql/" + acessToken + "/resp_rest", pesquisa)
          .then((response) => {
            valorRetorno = response.data;
            console.log(valorRetorno);

            if (valorRetorno === "]") {
              toast.error(
                "Não foi localizado dados com a pesquisa especificada",
                {
                  position: "top-right",
                  autoClose: 4000,
                  autoDismiss: true,
                  hideProgressBar: false,
                  pauseOnHover: true,
                }
              );

              if (arquivosQuarentena) {
                setFiltroE(false);
                setFiltroOU(true);

                setArquivosQuarentena(false);
              } else {
                setFiltroE(false);
                setFiltroOU(true);

                setArquivosQuarentena(false);
              }

              setTableData([]);
            } else {
              console.log("ACESSOU O PREENCHIMENTO DA TABELA: ");
              setTableData(valorRetorno);
              console.log("VALOR TABLE: ");
              console.log(tableData);
            }

            setIsLoading(false); // RETIRA A ANIMACAO DE LOAD
          })
          .catch((err) => {
            console.error("ops! ocorreu um erro" + err);
            toast.error(
              "Não foi localizado dados com a pesquisa especificada",
              {
                position: "top-right",
                autoClose: 4000,
                autoDismiss: true,
                hideProgressBar: false,
                pauseOnHover: true,
              }
            );
            console.log("history");
            valorRetorno = [];

            setTableData("");
          });
      } catch (erro) {
        history.push({ pathname: "/create-job", customNameData: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* ============================================================================= */
  /* === QUERY PARA REALIZAR A BUSCA DOS DADOS DO JOB SELECIONADO PELO USUARIO === */
  /* ============================================================================= */
  function getDadosDiscovery(idJob) {
    let acessToken = localStorage.getItem("@FlashSafe-token");

    /*const pesquisa = {
            "tabela": "map_jobs",
            "select": "job='"+ idJob +"'",
            "campos_select_end_point": "job^maquina^exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
            "get_qt": "1",
            "pagina": "1",
            "qt": "100"
        } */

    console.log("ID DISCOVERY: " + idJob);

    const pesquisa = {
      tabela: "map_discovery",
      select: `id='${idJob}'`,
      campos_select_end_point:
        "exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
      get_qt: "1",
      pagina: "1",
      qt: "1000",
    };

    let retornoComErro = "";

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", pesquisa)
      .then((response) => {
        console.log(response);

        let memoria = response.data.replace('"total_paginas":"', ""); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
        memoria = memoria.replace(" ", ""); // REMOVE O ESPEÇO QUE FICOU SOBRENDO DEVIDO AO PRIMEIRO REPLACE
        let valorMemoria = ""; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
        let contador = 1; // CONTADO PARA SABER QUANDO SAIR DO ELSE

        /* LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES */
        for (let i = 0; i < memoria.length; i++) {
          if (contador === 0) {
            valorMemoria = valorMemoria + memoria[i];
          } else if (memoria[i] === "," && contador === 1) {
            contador--;
          }
        }

        console.log(memoria);

        retornoComErro = memoria; // TRATA CASO HAJA ALGUM ERRO NA CRIACAO DO JSON

        //valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING
        valorMemoria = valorMemoria.replace("]", "");

        valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

        let retorno = valorMemoria;

        console.log("retorno");
        console.log(valorMemoria);

        /* FORÇA O CARREGAMENTO DOS DADOS NA VARIAVEIS */
        for (let i = 0; i < 4; i++) {
          carregamentoDescoberta.exp_1 = retorno.exp_1;
          carregamentoDescoberta.exp_2 = retorno.exp_2;
          carregamentoDescoberta.exp_3 = retorno.exp_3;
          carregamentoDescoberta.exp_4 = retorno.exp_4;
          carregamentoDescoberta.exp_5 = retorno.exp_5;
          carregamentoDescoberta.exp_6 = retorno.exp_6;
          carregamentoDescoberta.exp_7 = retorno.exp_7;
          carregamentoDescoberta.exp_8 = retorno.exp_8;
          carregamentoDescoberta.exp_9 = retorno.exp_9;
          carregamentoDescoberta.exp_10 = retorno.exp_10;

          carregamentoDescoberta.exp_1 = retorno.exp_1;
          carregamentoDescoberta.exp_2 = retorno.exp_2;
          carregamentoDescoberta.exp_3 = retorno.exp_3;
          carregamentoDescoberta.exp_4 = retorno.exp_4;
          carregamentoDescoberta.exp_5 = retorno.exp_5;
          carregamentoDescoberta.exp_6 = retorno.exp_6;
          carregamentoDescoberta.exp_7 = retorno.exp_7;
          carregamentoDescoberta.exp_8 = retorno.exp_8;
          carregamentoDescoberta.exp_9 = retorno.exp_9;
          carregamentoDescoberta.exp_10 = retorno.exp_10;

          carregamentoDescoberta.exp_1 = retorno.exp_1;
          carregamentoDescoberta.exp_2 = retorno.exp_2;
          carregamentoDescoberta.exp_3 = retorno.exp_3;
          carregamentoDescoberta.exp_4 = retorno.exp_4;
          carregamentoDescoberta.exp_5 = retorno.exp_5;
          carregamentoDescoberta.exp_6 = retorno.exp_6;
          carregamentoDescoberta.exp_7 = retorno.exp_7;
          carregamentoDescoberta.exp_8 = retorno.exp_8;
          carregamentoDescoberta.exp_9 = retorno.exp_9;
          carregamentoDescoberta.exp_10 = retorno.exp_10;
        }

        setExp_1(retorno.exp_1);

        // console.log("DADOS DO JOB: ");
        console.log(carregamentoDescoberta);

        /*carregamentoDescoberta.exp_1.push(valorMemoria.exp_1);
            carregamentoDescoberta.exp_2;
            carregamentoDescoberta.exp_3;
            carregamentoDescoberta.exp_4;
            carregamentoDescoberta.exp_5;
            carregamentoDescoberta.exp_6;
            carregamentoDescoberta.exp_7;
            carregamentoDescoberta.exp_8;
            carregamentoDescoberta.exp_9;
            carregamentoDescoberta.exp_10;*/

        //console.log('INPUT EXP 1: '+ carregamentoDescoberta.exp_1);

        window.document.querySelector("#botao").disabled = false;
      })
      .catch((err) => {
        try {
          console.log("TRATANDO ERRO: ");
          console.log(retornoComErro);

          retornoComErro = retornoComErro.split("{")[1];
          retornoComErro = retornoComErro.replace("},", "}");
          retornoComErro = "{" + retornoComErro;

          console.log("ERRO TRATADO: ");
          console.log(retornoComErro);

          retornoComErro = JSON.parse(retornoComErro); // CONVERTE A STRING EM UM OBJETO JSON

          let retorno = retornoComErro;

          console.log("retorno");
          console.log(retorno);

          /* FORÇA O CARREGAMENTO DOS DADOS NA VARIAVEIS */
          for (let i = 0; i < 4; i++) {
            carregamentoDescoberta.exp_1 = retorno.exp_1;
            carregamentoDescoberta.exp_2 = retorno.exp_2;
            carregamentoDescoberta.exp_3 = retorno.exp_3;
            carregamentoDescoberta.exp_4 = retorno.exp_4;
            carregamentoDescoberta.exp_5 = retorno.exp_5;
            carregamentoDescoberta.exp_6 = retorno.exp_6;
            carregamentoDescoberta.exp_7 = retorno.exp_7;
            carregamentoDescoberta.exp_8 = retorno.exp_8;
            carregamentoDescoberta.exp_9 = retorno.exp_9;
            carregamentoDescoberta.exp_10 = retorno.exp_10;

            carregamentoDescoberta.exp_1 = retorno.exp_1;
            carregamentoDescoberta.exp_2 = retorno.exp_2;
            carregamentoDescoberta.exp_3 = retorno.exp_3;
            carregamentoDescoberta.exp_4 = retorno.exp_4;
            carregamentoDescoberta.exp_5 = retorno.exp_5;
            carregamentoDescoberta.exp_6 = retorno.exp_6;
            carregamentoDescoberta.exp_7 = retorno.exp_7;
            carregamentoDescoberta.exp_8 = retorno.exp_8;
            carregamentoDescoberta.exp_9 = retorno.exp_9;
            carregamentoDescoberta.exp_10 = retorno.exp_10;

            carregamentoDescoberta.exp_1 = retorno.exp_1;
            carregamentoDescoberta.exp_2 = retorno.exp_2;
            carregamentoDescoberta.exp_3 = retorno.exp_3;
            carregamentoDescoberta.exp_4 = retorno.exp_4;
            carregamentoDescoberta.exp_5 = retorno.exp_5;
            carregamentoDescoberta.exp_6 = retorno.exp_6;
            carregamentoDescoberta.exp_7 = retorno.exp_7;
            carregamentoDescoberta.exp_8 = retorno.exp_8;
            carregamentoDescoberta.exp_9 = retorno.exp_9;
            carregamentoDescoberta.exp_10 = retorno.exp_10;
          }

          setExp_1(retorno.exp_1);

          // console.log("DADOS DO JOB: ");
          console.log(carregamentoDescoberta);

          window.document.querySelector("#botao").disabled = false;
          window.document.querySelector("#todos").disabled = false;
        } catch (erro) {
          window.document.querySelector("#botao").disabled = true;
          window.document.querySelector("#todos").disabled = true;

          //alert('NÃO EXISTE REGISTROS NESSE DISCOVERY, SELECIONE OUTRA DESCOBERTA!!');
          console.log("OCORREU ALGUM ERRO NA PESQUISA!!");
        }
      });
  }

  /* ===================================================================== */
  /* === METODO RESPONSAVEL POR PESQUISAR AS MAQUINAS ASSOCIADAS AO JOB === */
  /* ===================================================================== */
  function geraListaDeMaquinasDoJob(job) {
    let token = localStorage.getItem("@FlashSafe-token");

    let result = [];
    let aux = [];
    let id = job; // CARREGA O ID DO ULTIMO JOB

    //console.log(`ID: ${id}`);

    /*const headers = {
            "tabela": "map_jobs",
            "select": `id_discovery='${id}'`,
            "pagina": "1",
            "qt": "100",
            "campos_select_end_point": "maquina^job^computer_name^cliente^comando^retorno^dth_inicio^dth_atualizacao^descricao^grupo_dlp",
            "get_qt":"*"
        }*/

    const headers = {
      tabela: "map_discovery",
      select: `id='${idJob}'`,
      campos_select_end_point:
        "exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
      get_qt: "1",
      pagina: "1",
      qt: "1000",
    };

    //console.log('ACESSEI AQUI!!! ');
    //console.log("ID JOB: "+ id);

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
      .then((response) => {
        result = response.data;
        //console.log(result, "teste machine")
        aux = result.map(function (item) {
          //console.log(item);
          //if(item.job === id && (item.maquina !== '' || item.maquina !== undefined)) {
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

        console.log("AUX: ");
        console.log(aux);

        setArrayMaquinas(aux);
        //console.log(aux, 'teste')

        console.log(selecaoMaquina);
        console.log(selecaoMaquinaNome);
      })
      .catch((err) => {
        result = err;
        console.log(result);
      });
  }

  function findAllFilesMaquina(maquina) {
    let id = maquina;
    console.log("JOB: " + selecaoJOB);

    const headers = {
      tabela: "map_arquivos",
      select: "maquina='" + id + "'",
      pagina: "1",
      qt: 10000,
      campos_select_end_point:
        "computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^codigo_drive",
    };

    let token = localStorage.getItem("@FlashSafe-token");

    api
      .post("/sql/selectSql/" + token + "/resp_rest", headers)
      .then((response) => {
        let array = response.data;
        // console.log(array);
        setDadosMaquina(array);
        setIsLoading(false);

        // console.log("DADOS MAQUINA: ");
        // console.log(dadosMaquina);
      })
      .catch((err) => {
        toast.error("Ocorreu um erro na requisição");

        // console.error("ops! ocorreu um erro" + err);
      });
    // result = JSON.parse(tableData)
  }

  /* === ABRIR MODAL === */
  function handleOpenModalGroup() {
    setOpenModalGroup(!openModalGroup);
  }

  /* === ABRIR MODAL ESCOLHA MAQUINAS === */
  function handleOpenModalMaquinas() {
    setOpenModalMaquinas(!openModalMaquinas);
  }

  useEffect(() => {
    if (localStorage.getItem("recargaTabela") === 1) {
      openModalGroup = false;
      atualizarrPesquisa(arquivosQuarentena);
      setOpenModalGroup(true);
    }

    /* ============================================ */
    /* === CARREGA LISTA DE JOBs DA ORGANIZACAO === */
    /* ============================================ */
    async function carregaListaDeJobsDaOrganizacao() {
      let aux = [];
      let result = [];
      let token = localStorage.getItem("@FlashSafe-token");

      // DESCRIPTOGRFA JSON PARA OBTER O GRUPO LOGADO
      let grupoDlpUsuario = atob(token);

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

        //console.log(`Grupo DLP: ${grupoDlpUsuario}`);
      } catch (erro) {
        // console.log("Nao foi localizado * na String");
      }

      const headers = { grupo_dlp: grupoDlpUsuario };

      let contadorItem = 0;

      /*api.post("/discovery/getJobs/" + acessToken + "/resp_rest", headers)
            .then((response) => {
                    result = response.data
                    //console.log(result)
                    
                    aux = result.map(function (item) {
                        if(contadorItem === 0) {
                            //setSelecaoJOB(item.job);
                            console.log("dado: "+ item.job);
                            geraListaDeMaquinasDoJob(item.job); // JOGA O VALOR DIRETAMENTE NO METODO SEM PASSAR PELA SELECAO PARA PODER INICIALIZAR AS VARIAVEIS
                            
                            getDadosDiscovery(item.job); // CARREGA OS DADOS DO JOB SELECIONADO
                        }

                        contadorItem++;
                        
                        return { 
                            "dth_inicio": item.dth_inicio, 
                            "job": item.job, 
                            "action": item.job 
                        }
                    }
                );

                //setDataMachine(aux)
                setArrayJOB(aux)
                console.log(arrayJOB)
                //idJob = arrayJOB[(arrayJOB.length - 1)].job;
                //console.log(idJob);

                //console.log('JOB SELECIOANDO ATUAL: '+ selecaoJOB);

                // CARREGA OS DADOS DA MAQUINA
                //console.log("Selecao JOB atual: "+ selecaoJOB);
                //geraListaDeMaquinasDoJob(selecaoJOB);*/

      /* =========================== */
      /* === AJUSTE CONFIGURAÇÃO === */
      /* =========================== */
      const objetoDiscovery = {
        tabela: "map_discovery",
        select: `grupo_dlp like '${Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
            .toString()
            .split("^")[1]
            .replace("*", "")
          }%'`,
        pagina: "1",
        qt: "1000",
        campos_select_end_point: "id^nome^descricao",
        get_qt: "1",
      };

      // console.log("objetoDiscovery");
      // console.log(objetoDiscovery);

      api
        .post("/sql/selectSql/" + acessToken + "/resp_rest", objetoDiscovery)
        .then((response) => {
          console.log("RESPOSTA DATA: ");
          console.log(response.data);

          let memoria = response.data.replace('"total_paginas":"', ""); // RETIRA DA STRING O VALOR TOTAL DE DADOS, POIS ELE ESTA FORA DO FORMATO OBJETO
          memoria = memoria.replace(" ", ""); // REMOVE O ESPEÇO QUE FICOU SOBRENDO DEVIDO AO PRIMEIRO REPLACE
          let valorMemoria = ""; // CRIAR UMA VARIAVEL DE MEMORIA QUE RECEBERA O OBJ JSON
          let contador = 1; // CONTADO PARA SABER QUANDO SAIR DO ELSE

          console.log(memoria);


          // LE A STRING COMPLETA FAZENDO AS DEVIDAS VALIDACOES
          for (let i = 0; i < memoria.length; i++) {
            if (contador === 0) {
              valorMemoria = valorMemoria + memoria[i];
            } else if (memoria[i] === "," && contador === 1) {
              contador--;
            }
          }

          valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING
          //valorMemoria = valorMemoria.replace(']','');

          valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

          console.log(valorMemoria);


          let array = valorMemoria; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE

          for (let i = 0; i < array.length; i++) {
            result.push(array[i]); // ALIMENTA O ARRAY COM OS DADOS DO JSON AJUSTADO
          }

          aux = result.map(function (item) {
            /*         if (contadorItem === 0) {
                      console.log("dado: " + item.id);
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

          //setDataMachine(aux)
          setArrayJOB(aux);
          // console.log("arrayJOB");
          // console.log(aux);
          //idJob = arrayJOB[(arrayJOB.length - 1)].job;
          //console.log(idJob);

          //console.log('JOB SELECIOANDO ATUAL: '+ selecaoJOB);

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

    // CARREGA OS DADOS DA MAQUINA
    //geraListaDeMaquinasDoJob(arrayJOB);

    /*console.log('Data Machine: ');
        console.log(dataMachine);

        console.log(`Ultimo JOB: ${dataMachine[(dataMachine.length - 1)].job}`);*/

    async function getFilesList() {
      // pseudo anonimizar -> criptografar

      let teste = "GQQ0L3_5VW7D73";

      const headers = {
        tabela: "map_arquivos",
        select: "1=1",
        //"select": "maquina='" + teste + "'",
        //"select":"maquina='GQQ0L3_5VW7D73' or (exp_1=1 and exp_2=1 and exp_3=1 and exp_4=1)",
        pagina: "1",
        qt: 10000,
        campos_select_end_point:
          "computer_name^md5^ult_dth^grupo_dlp^path^cliente^tipo^codigo_drive",
      };

      let token = localStorage.getItem("@FlashSafe-token");

      api
        .post("/sql/selectSql/" + token + "/resp_rest", headers)
        .then((response) => {
          let array = response.data;
          setTableData(array);
          setIsLoading(false);

          // console.log("teste post", tableData);
        })
        .catch((err) => {
          toast.error("Ocorreu um erro na requisição");

          console.error("ops! ocorreu um erro" + err);
        });
      // result = JSON.parse(tableData)
    }


    //getFilesList();

  }, [acessToken, id]);

  if (customNameData) {
    //alert('CHAMOU O METODO GET LISTA!!!');
    id = true;
  }

  function ShowTable(props) {
    //console.log(tableData)

    // console.log("JOB: " + selecaoJOB);
    // console.log("Maquina: " + selecaoMaquina);

    if (selecaoTodasMaquinas.length > 2) {
      setSelecaoMaquinaNome("Todas");
    }

    //        if (tableData.length < 2) {
    return (
      <div>
        {/* MODAL */}
        {openModalGroup ? (
          <div className="modal-find-files" >
            <div className="divider-modal">
              <h1>
                Pesquisa de Arquivo{/*}: {selecaoMaquinaNome}*/}
                {/*{tableData[0].computer_name}*/}{" "}
              </h1>

              <div className="atualizar-pesquisa">

                {/*
                <div className="inputs">
                    <label htmlFor="e">
                        <p>Fazer a seleção onde todos os itens escolhidos tem que existir</p>
                        <input type="radio" name="e" id="e" onClick={(e) => handleE(e.target.checked)} checked={filtroE} />
                    </label>
                    <label htmlFor="ou">
                        <p>Fazer a seleção onde ocorra qualquer um dos itens escolhidos</p>
                        <input type="radio" name="ou" id="ou" onClick={(e) => handleOU(e.target.checked)} checked={filtroOU} />
                    </label>
                </div>
                */}

                <button id="pesquisar-arquivos" className="button" type="button" onClick={() => atualizarrPesquisa(arquivosQuarentena)}>Pesquisar</button>
                <button className="button" type="button" onClick={() => setOpenModalGroup(false)}>Cancelar</button>

              </div>


              <div className="exps">

                <div className="line">
                  <p><strong>Exp_1:</strong> {carregamentoDescoberta.exp_1}</p>
                  <p><strong>Exp_2:</strong> {carregamentoDescoberta.exp_2}</p>
                  <p><strong>Exp_3:</strong> {carregamentoDescoberta.exp_3}</p>
                  <p><strong>Exp_4:</strong> {carregamentoDescoberta.exp_4}</p>
                  <p><strong>Exp_5:</strong> {carregamentoDescoberta.exp_5}</p>
                </div>

                <div className="line">
                  <p><strong>Exp_6:</strong> {carregamentoDescoberta.exp_6}</p>
                  <p><strong>Exp_7:</strong> {carregamentoDescoberta.exp_7}</p>
                  <p><strong>Exp_8:</strong> {carregamentoDescoberta.exp_8}</p>
                  <p><strong>Exp_9:</strong> {carregamentoDescoberta.exp_9}</p>
                  <p><strong>Exp_10:</strong> {carregamentoDescoberta.exp_10}</p>
                </div>

                {/*
                <div className="linha">
                  {carregamentoDescoberta.exp_1 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_1: {carregamentoDescoberta.exp_1}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp1(e)}
                        checked={switchExp1}
                      />
                      <p>Exp_1: {carregamentoDescoberta.exp_1}</p>
                    </>
                  )}

                  <p>Exp_1: {carregamentoDescoberta.exp_1}</p>
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_2 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_2: {carregamentoDescoberta.exp_2}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp2(e)}
                        checked={switchExp2}
                      />
                      <p>Exp_2: {carregamentoDescoberta.exp_2}</p>
                    </>
                  )}
                </div>
                
                <div className="linha">
                  {carregamentoDescoberta.exp_3 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_3: {carregamentoDescoberta.exp_3}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp3(e)}
                        checked={switchExp3}
                      />
                      <p>Exp_3: {carregamentoDescoberta.exp_3}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_4 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_4: {carregamentoDescoberta.exp_4}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp4(e)}
                        checked={switchExp4}
                      />
                      <p>Exp_4: {carregamentoDescoberta.exp_4}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_5 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_5: {carregamentoDescoberta.exp_5}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp5(e)}
                        checked={switchExp5}
                      />
                      <p>Exp_5: {carregamentoDescoberta.exp_5}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_6 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_6: {carregamentoDescoberta.exp_6}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp6(e)}
                        checked={switchExp6}
                      />
                      <p>Exp_6: {carregamentoDescoberta.exp_6}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_7 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_7: {carregamentoDescoberta.exp_7}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp7(e)}
                        checked={switchExp7}
                      />
                      <p>Exp_7: {carregamentoDescoberta.exp_7}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_8 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_8: {carregamentoDescoberta.exp_8}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp8(e)}
                        checked={switchExp8}
                      />
                      <p>Exp_8: {carregamentoDescoberta.exp_8}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_9 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_9: {carregamentoDescoberta.exp_9}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp9(e)}
                        checked={switchExp9}
                      />
                      <p>Exp_9: {carregamentoDescoberta.exp_9}</p>
                    </>
                  )}
                </div>

                <div className="linha">
                  {carregamentoDescoberta.exp_10 === "" ? (
                    <>
                      <Switch checked={false} disabled />
                      <p>Exp_10: {carregamentoDescoberta.exp_10}</p>
                    </>
                  ) : (
                    <>
                      <Switch
                        onChange={(e) => handleSwitchExp10(e)}
                        checked={switchExp10}
                      />
                      <p>Exp_10: {carregamentoDescoberta.exp_10}</p>
                    </>
                  )}
                </div>*/}



              </div>


              {/*
              <div className="inputs">
                <label htmlFor="e">
                  <p>
                    Fazer a seleção onde todos os itens escolhidos tem que
                    existir
                  </p>
                  {/*<input type="radio" name="e" id="e" onClick={(e) => handleE(e.target.checked)} checked={filtroE} />
                  <Switch onChange={(e) => handleE(e)} checked={filtroE} />
                </label>
                <label htmlFor="ou">
                  <p>
                    Fazer a seleção onde ocorra qualquer um dos itens escolhidos
                  </p>
                  {/*<input type="radio" name="ou" id="ou" onClick={(e) => handleOU(e.target.checked)} checked={filtroOU} />
                  <Switch onChange={(e) => handleOU(e)} checked={filtroOU} />
                </label>
                <label className="quarentena" htmlFor="quarentena">
                  <p>Trazer somente arquivo em quarentena</p>
                  <Switch
                    onChange={(e) => handleArquivosQuarentena(e)}
                    checked={arquivosQuarentena}
                  />
                </label>
              </div>
              */}




            </div>


            <div>
              <TableResultArchive data={tableData} />
            </div>


            {/*             <div class="botoes-paginacao">
              <div
                class="botao bota-letf"
                onClick={() =>
                  atualizacaoDinamica(arquivosQuarentena, "retroceder")
                }
                >
                <LeftArrow />
              </div>
              <div className="botao-contador">{contadorClick}</div>
              <div
                class="botao bota-right"
                onClick={() =>
                  atualizacaoDinamica(arquivosQuarentena, "avancar")
                }
                >
                <RightArrow />
              </div>
            </div> */}

          </div>
        ) : null}

        {/* MODAL ESCOLHA MAQUINAS */}
        {openModalMaquinas ? (
          <div className="modal-find-maquinas">
            <div className="divider-modal">
              <h1>Pesquisa Máquina: {selecaoMaquinaNome} </h1>
              <button
                className="button-close-modal"
                type="button"
                onClick={() => setOpenModalMaquinas(false)}
              >
                {" "}
                X{" "}
              </button>
            </div>
            <div className="pesquisa-job-e-maquina">
              <label htmlFor="maquina">
                <p>Seleção da Maquina</p>
                <select
                  className="input-reason-pesquisa"
                  name="maquina"
                  id="maquina"
                  value={selecaoMaquina}
                  onChange={(e) => handleNomeMaquina(e.target.value)}
                >
                  {arrayMaquinas.map((option) => (
                    <option value={option.maquina}>
                      {option.computer_name}
                    </option>
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
        ) : null}

        <div className="pesquisa-job-e-maquina">
          <label htmlFor="maquina">
            <p>Seleção da Descoberta </p>
            <select
              className="input-reason-pesquisa"
              name="maquina"
              id="maquina"
              value={selecaoJOB}
              onChange={(e) => handleJob(e.target.value)}
            >
              <option value="" disabled selected>Selecione a Descoberta</option>
              {arrayJOB.map((option) => (<option value={option.id}>{option.nome}</option>)).reverse()}
            </select>
          </label>
          <label className="botao-modal desabilitar" htmlFor="maquina">
            {/*<p>Seleção da Maquina</p> 
              <select className="input-reason-pesquisa"  name="maquina" id="maquina" value={selecaoMaquina} onChange={(e) => handleNomeMaquina(e.target.value)} >
               {arrayMaquinas.map((option) => (
                <option value={option.maquina}>{option.maquina}</option>
              ))}
            </select>*/}
            <button
              type="button"
              className="select-button"
              id="botao"
              name="botao"
              onClick={() => handleOpenModalMaquinas()}
            >
              Seleção da Maquina
            </button>
            <div
              style={
                {
                  /*position: "relative", top: "60px", right: "170px"*/
                }
              }
            >
              <input
                type="checkbox"
                id="todos"
                name="todos"
                onChange={(e) =>
                  handleSelecionarTodasAsMaquinas(e.target.checked)
                }
              />
              <span> selecionar todas as maquinas </span>
            </div>
          </label>
        </div>
        <div className="titulo-pesquisas">Pesquisas</div>
        <form className="form-create-job content-scroll ajuste-content-scroll">
          {/*
                        <div></div>
                        <button
                            className="button-list"
                            type="button"
                            onClick={() => handleAddSearch()}
                        >
                            {" "}
                            Adicionar{" "}
                        </button>{" "}
                        <br />
                        {array}
                        */}
          <div className="input-swith">
            {/*<label htmlFor="exp_1">Pesquisa 1</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp1(e)}
                                checked={switchExp1}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_1"
              id="exp_1"
              value={carregamentoDescoberta.exp_1}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_2">Pesquisa 2</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp2(e)}
                                checked={switchExp2}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_2"
              id="exp_2"
              value={carregamentoDescoberta.exp_2}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_3">Pesquisa 3</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp3(e)}
                                checked={switchExp3}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_3"
              id="exp_3"
              value={carregamentoDescoberta.exp_3}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_4">Pesquisa 4</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp4(e)}
                                checked={switchExp4}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_4"
              id="exp_4"
              value={carregamentoDescoberta.exp_4}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_5">Pesquisa 5</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp5(e)}
                                checked={switchExp5}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_5"
              id="exp_5"
              value={carregamentoDescoberta.exp_5}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_6">Pesquisa 6</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp6(e)}
                                checked={switchExp6}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_6"
              id="exp_6"
              value={carregamentoDescoberta.exp_6}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_7">Pesquisa 7</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp7(e)}
                                checked={switchExp7}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_7"
              id="exp_7"
              value={carregamentoDescoberta.exp_7}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_8">Pesquisa 8</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp8(e)}
                                checked={switchExp8}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_8"
              id="exp_8"
              value={carregamentoDescoberta.exp_8}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_9">Pesquisa 9</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp9(e)}
                                checked={switchExp9}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_9"
              id="exp_9"
              value={carregamentoDescoberta.exp_9}
              disabled
            />
          </div>

          <div className="input-swith">
            {/*<label htmlFor="exp_10">Pesquisa 10</label>*/}
            {/*<Switch
                                onChange={(e) => handleSwitchExp10(e)}
                                checked={switchExp10}
                            />*/}
            <input
              className="input-reason-pesquisa"
              type="text"
              name="exp_10"
              id="exp_10"
              value={carregamentoDescoberta.exp_10}
              disabled
            />
          </div>
        </form>

        <div className="botoes-opcoes">
          {/*<div className="inputs">
                            <label htmlFor="e">
                                <p>Fazer a seleção onde todos os itens escolhidos tem que existir</p>
                                <input type="radio" name="e" id="e" onClick={(e) => handleE(e.target.checked)} checked={filtroE} />
                            </label>
                            <label htmlFor="ou">
                                <p>Fazer a seleção onde ocorra qualquer um dos itens escolhidos</p>
                                <input type="radio" name="ou" id="ou" onClick={(e) => handleOU(e.target.checked)} checked={filtroOU} />
                            </label>
                        </div>*/}
          <button
            className="button"
            type="button"
            onClick={() => realizarPesquisa()}
            style={{ top: "10%" }}
          >
            Pesquisar
          </button>
        </div>

        {/*<button
            className="button-create"
            type="button"
            onClick={() => realizarPesquisa()}
          >
            Pesquisar
        </button>*/}
      </div>
    );
    //       }
    //       else
    //           return (
    //               <TableResultArchive data={tableData} />
    //           );
  }

  return (
    <div className="main-content" style={{ display: "flex", flexDirection: "row" }}>
      <MenuLeft />


      <div className="main-content-result-archive card">
        <div>
          <h1 className="card-title">Arquivos Analisados</h1>
          <div className="divider-pagina-arquivos">
            <Link to="/job-list" style={{ textDecoration: "none" }} />
          </div>

          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "150px" }} >
              <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
            </div>
          ) : (
            <ShowTable />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultArchive;
