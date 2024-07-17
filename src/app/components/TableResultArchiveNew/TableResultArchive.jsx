import React, { useState } from "react";
import { useTable, useFilters, useRowSelect, useSortBy, usePagination, } from "react-table";
import "./style.scss";
import { matchSorter } from "match-sorter";
import { ArrowDropDown, ArrowDropUp, Height, Refresh } from "@material-ui/icons";
import { OptionIcon } from "../../../assets/icons/index";
import { SearchIcon } from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import { LeftArrow, RightArrow } from "../../../assets/icons/index";
import { toast } from "react-toastify";
import { MdOutlineCallToAction } from 'react-icons/md'
import { deletaFiles, moveFiles, copiaFiles, trazQuarentena, publicaQuarentena, psudoAnonimizarDados, reverterPsudoAnonimizar, } from "../../services/functions";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { red } from "@material-ui/core/colors";





const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
        <input className="checkbox-table" type="checkbox" ref={resolvedRef} {...rest} />
      </div>
    );
  }
);


function TableResultArchive({ data }) {
  /*this.state = {
    nome: '', 
    cpf: '', 
    email: '',
    arquivo: '',
    maquina: '',
    pseudo: '' 
  };*/

  const [tableData, setTableData] = useState([]);

  let dados = [
    {
      nomeDado: "",
      cpfDado: "",
      emailDado: "",
      arquivoDado: "",
      maquinaDado: "",
      pseudoDado: "",
    },
  ];

  let paginaAtual = 1;
  let qtd = 100;

  let history = useHistory();

  /* ============================================ */
  /* === METODO PARA CONSTRUCAO DO OBSERVADOR === */
  /* ============================================ */
  const [optionSelected, setOptionSelected] = useState();
  const [baixarArquivo, setBaixarArquivo] = useState(false);

  //let memoriaRetorno = '';
  const [memoriaRetorno, setMemoriaRetorno] = useState();
  let objQuarentenaRetorno = "";
  //let downloadArquivo = `http://54.207.116.254:8085/quarentena/${memoriaRetorno}`;
  //let downloadArquivo = `https://homologa.epsoft.com.br:8088/quarentena/${memoriaRetorno}`;
  //let downloadArquivo = `https://dlp.epsoft.com.br:8015/quarentena/${memoriaRetorno}`;
  let downloadArquivo = `https://dlp.epsoft.com.br:8028/quarentena/${memoriaRetorno}`;

  const [modalTexto, setModalTexto] = useState(false);

  const [nome, setNome] = useState();
  const [cpf, setCpf] = useState();
  const [email, setEmail] = useState();
  const [arquivo, setArquivo] = useState();
  const [maquina, setMaquina] = useState();
  const [pseudo, setPseudo] = useState();

  const [acao, setAcao] = useState();
  const [dadosTratar, setDadosTratar] = useState();

  /* ================ */
  /* === MAQUINAS === */
  /* ================ */
  const [selecaoMaquina, setSelecaoMaquina] = useState();
  const [arrayMaquinas, setArrayMaquinas] = useState([]);

  /* ======================= */
  /* === ARQUIVO DESTINO === */
  /* ======================= */
  const [arquivoDestino, setArquivoDestino] = useState();

  /* ====================== */
  /* === CONTROLA MODAL === */
  /* ====================== */
  const [acoesArquivo, setOpenModalAcoesArquivo] = useState(false);
  const [openModalOpcoes, setOpenModalOpcoes] = useState(false);
  const [openModalMover, setOpenModalMover] = useState(false);
  const [openModalCopiar, setOpenModalCopiar] = useState(false);
  const [openModalQuarentena, setOpenModalQuarentena] = useState(false);
  const [openModalAnonimizar, setOpenModalAnonimizar] = useState(false);
  const [openModalPseudoAnonimizar, setOpenModalPseudoAnonimizar] = useState(false);
  const [openModalReverterPseudoAnonimizar, setOpenModalReverterPseudoAnonimizar] = useState(false);
  const [openModalApagarExpressao, setOpenModalApagarExpressao] = useState(false);
  const [openModalApagarArquivo, setOpenModalApagarArquivo] = useState(false);


  let selecaoMaquinaDestino = "";

  /* ==================================================== */
  /* === OPCOES DO SELECT DE DELETAR / MOVER / COPIAR === */
  /* ==================================================== */
  const opcoesSelect = [
    /*{
    {
      label: "Selecione uma opção",
      value: "4",
    },
    },
    {
      label: "Quarentena",
      value: "0",
    },*/
    {
      label: "Mover",
      value: "1",
    },
    {
      label: "Copiar",
      value: "2",
    },
    /*{
      label: "Anonimizar",
      value: "3",
    },*/
 
    {
      label: "Deletar Arquivo",
      value: "6",
      
    },
    {
      label: "Ações de Anonimizar",
      value: "5",
    },
  ];

  /* ================================================================== */
  /* === METODO RESPONSAVEL POR OBSERVAR A OPCAO ESCOLHIDA NO SELECT === */
  /* ================================================================== */
  function minhaOpcao(event) {
    setOptionSelected(event);

    // console.log("valor opcao: ");
    // console.log(event);

    if (event === "1" || event === "2") {
      findAllMaquinas();

     // window.document.querySelector(".transparencia").display =
       // "block !important";
    } else {
      //window.document.querySelector(".transparencia").display =
        //"none !important";
    }
  }

  function nomeUsuario(event) {
    //setNome(event);
    dados.nome = event;
  }

  function cpfUsuario(event) {
    //setCpf(event);
    dados.cpf = event;
  }

  function emailUsuario(event) {
    //setEmail(event);
    dados.email = event;
  }

  function arquivoUsuario(event) {
    //setArquivo(event);
    dados.arquivo = event;
  }

  function maquinaUsuario(event) {
    //setMaquina(event);
    dados.maquina = event;
  }

  function pseudoUsuario(event) {
    //setPseudo(event);
    dados.pseudo = event;
  }

  /* ============================================== */
  /* === METODO RESPONSAVEL POR DELETAR ARQUIVOS === */
  /* ============================================== */
  async function deletarArquivos(selectedFlatRows) {
    let token = localStorage.getItem("@FlashSafe-token");

    // console.log("DATA: ");
    // console.log(data);

    console.log("ITEM SELECIONADO: " + selectedFlatRows);

    for (var i = 0; i < data.length; i++) {
      if (data[i].id_arquivo === selectedFlatRows) {
        data = data.splice(i, 1);
      }
    }

    // console.log("SELECAO: ");
    // console.log(selectedFlatRows);

    await deletaFiles(token, selectedFlatRows);

    localStorage.setItem("recargaTabela", 1);

    history.push({ pathname: "/result-archive", customNameData: true });
  }

  /* ============================================ */
  /* === METODO RESPONSAVEL POR MOVER ARQUIVOS === */
  /* ============================================ */
  async function moverArquivos(arrayIDs, arrayArquivos) {
    let token = localStorage.getItem("@FlashSafe-token");

    await moveFiles(
      token,
      arrayIDs,
      arrayArquivos,
      selecaoMaquina,
      arquivoDestino
    );

    localStorage.setItem("recargaTabela", 1);

    history.push({ pathname: "/result-archive", customNameData: true });
  }

  /* ============================================= */
  /* === METODO RESPONSAVEL POR COPIAR ARQUIVOS === */
  /* ============================================= */
  async function copiarArquivos(arrayIDs, arrayArquivos) {
    let token = localStorage.getItem("@FlashSafe-token");

    await copiaFiles(
      token,
      arrayIDs,
      arrayArquivos,
      selecaoMaquina,
      arquivoDestino
    );
    
    localStorage.setItem("recargaTabela", 1);

    history.push({ pathname: "/result-archive", customNameData: true });
  }

  function copiarFiles( idArquivo , maquinaArquivo , destinoArquivo ){
    let token = localStorage.getItem("@FlashSafe-token");
    let ids = idArquivo;
    let maquina = maquinaArquivo;
    let destino = destinoArquivo;


    copiaFiles( token , ids , maquina , destino )

    alert("Arquivo copiado com sucesso")
  }

  /* =============================================== */
  /* === METODO RESPONSAVEL POR PSEUDO ANONIMIZAR === */
  /* =============================================== */
  async function pseudoAnonimizar(arrayIDs, nomeArquivo, dados, acao) {
    let token = localStorage.getItem("@FlashSafe-token");

    await psudoAnonimizarDados(token, arrayIDs, nomeArquivo, dados, acao);

    setOpenModalAcoesArquivo(false);
    
  }

  /* ======================================================== */
  /* === METODO RESPONSAVEL POR REVERTER PSEUDO ANONIMIZAR === */
  /* ======================================================== */
  async function reverterPseudoAnonimizar(arrayIDs, nomeArquivo, dados, acao) {
    let token = localStorage.getItem("@FlashSafe-token");

    await reverterPsudoAnonimizar(token, arrayIDs, nomeArquivo, dados, acao);

    setOpenModalAcoesArquivo(false);
  }

  /* ==================== */
  /* === TRAZ ARQUIVO === */
  /* ==================== */
  async function trazArquivoParaQuarentena(arrayIDs) {
    let token = localStorage.getItem("@FlashSafe-token");

    let memoriaProcesso = [];

    await trazQuarentena(token, arrayIDs); // CARREGA O DADO SELECIONADO NA QUARENTENA

    // console.log("ITEM SELECIONADOS PELO USUARIO: ");
    // console.log("ID Arquivo: " + objQuarentenaRetorno[0].original.id_arquivo);
    // console.log("MD5: " + objQuarentenaRetorno[0].original.md5);
    // console.log("Tipo: " + objQuarentenaRetorno[0].original.tipo);

    setTimeout(() => {
      //publicaQuarentena(token, arrayIDs); // COLOCA O ARQUIVO NA PASTA PARA SER VISUALIZADA PELO DPO,

      api
        .get(`/discovery/publicaQuarentena/${token}/${arrayIDs}/resp_rest`)
        .then((resp) => {
          memoriaProcesso.push(resp.data.split(" ")[11]);

          if (objQuarentenaRetorno[0].original.tipo === "text") {
            objQuarentenaRetorno[0].original.tipo = "txt";
          }

          setMemoriaRetorno(
            memoriaProcesso[0] +
            "/" +
            objQuarentenaRetorno[0].original.md5 +
            "." +
            objQuarentenaRetorno[0].original.tipo
          );

          if (
            objQuarentenaRetorno[0].original.tipo === "txt" ||
            objQuarentenaRetorno[0].original.tipo === "pdf"
          ) {
            setModalTexto(!modalTexto); // ABRE MODAL
          } else {
            setBaixarArquivo(!baixarArquivo); // ABRE O MODAL
          }
        })
        .catch((err) => {
          // console.log(err);
          toast.error('Ocorreu um erro com o carregamento do arquivo', {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        });

      //memoriaRetorno = memoriaRetorno;
    }, 8000);
  }

  /* ================================================== */
  /* === ABRIR CONFIGURACOES DE OPCOES DE ENDPOINTS === */
  /* ================================================== */
  async function handleCapturaClick() {
    setOpenModalOpcoes(!openModalOpcoes);
  }
  function handleOpenModalMover(event) {
    setOpenModalMover(!openModalMover);
  }
  function handleOpenModalCopiar(event) {
    setOpenModalCopiar(!openModalCopiar);
  }
  function handleOpenModalQuarentena(event) {
    setOpenModalQuarentena(!openModalQuarentena);
  }
  function handleOpenModalAnonimizar(event) {
    setOpenModalAnonimizar(!openModalAnonimizar);
  }
  function handleOpenModalPseudoAnonimizar(event) {
    setOpenModalPseudoAnonimizar(!openModalPseudoAnonimizar);
  }
  function handleOpenModalReverterPseudoAnonimizar(event) {
    setOpenModalReverterPseudoAnonimizar(!openModalReverterPseudoAnonimizar);
  }
  function handleOpenModalApagarExpressao(event) {
    setOpenModalApagarExpressao(!openModalApagarExpressao);
  }
  function handleOpenModalApagarArquivo(event) {
    setOpenModalApagarArquivo(!openModalApagarArquivo);
  }

  /* ===================================================================================== */
  /* === METODO RESPONSAVEL POR CHAMAR OS METODOS QUE REALIZARAO AS ALTERAÇOES NO BANCO === */
  /* ===================================================================================== */
  function clicou(opcao, itensSelecionados) {
    // 0 - QUARENTENA || 1 - MOVER || 2- COPIAR || 3 -  || 4 -   || 5 - PSEUDOANONIMIZAR  || 6 - DELETAR
    // console.log("ITENS SELECIOANDOS!!!");
    // console.log(itensSelecionados);
    // console.log("VALOR OPCAO SELECIOANDO: " + opcao);

    objQuarentenaRetorno = itensSelecionados;

    if (opcao === "6" && itensSelecionados.length > 0) {
      //alert('Opcao Deletar');

      let memoria = [];

      memoria = itensSelecionados.map((item) => {
        // console.log(item);

        return item.original.id_arquivo;
        //return (item.original.md5);
      });

      // console.log(memoria);

      let envioMemoria = JSON.stringify(memoria);
      envioMemoria = envioMemoria.replace("[", "");
      envioMemoria = envioMemoria.replace("]", "");
      envioMemoria = envioMemoria.replaceAll('"', "");

      //deletarArquivos(JSON.stringify(memoria));
      deletarArquivos(envioMemoria);

      //history.push({pathname:'/result-archive', customNameData: true});
      //history.push({pathname:'/create-job', customNameData: true});
    } else if (opcao === "1" && itensSelecionados.length > 0) {
      //alert('Opcao Mover');

      let memoriaIdArquivos = [];
      let memoriaEderecoArquivos = [];

      memoriaIdArquivos = itensSelecionados;
      memoriaEderecoArquivos = itensSelecionados;

      memoriaIdArquivos = memoriaIdArquivos.map((item) => {
        // console.log(item);

        return item.original.id_arquivo;
        //return (item.original.md5);
      });

      memoriaEderecoArquivos = memoriaEderecoArquivos.map((item) => {
        // console.log(item);

        return item.original.path;
        //return (item.original.md5);
      });

      // console.log("IDs SELECIOANDOS!! : ");
      // console.log(memoriaIdArquivos);

      // console.log("ARQUIVOS SELECIOANDOS!! : ");
      // console.log(memoriaEderecoArquivos);

      // console.log("ITENS SELECIOADOS!! : ");
      // console.log(itensSelecionados);

      let envioMemoriaIdArquivo = JSON.stringify(memoriaIdArquivos);
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("[", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("]", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replaceAll('"', "");

      let envioMemoriaArquivos = JSON.stringify(memoriaEderecoArquivos);
      envioMemoriaArquivos = envioMemoriaArquivos.replace("[", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replace("]", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replaceAll('"', "");

      if (selecaoMaquina.length > 0 && arquivoDestino.length > 0) {
        // console.log("Valor memoria IDs: ");
        // console.log(envioMemoriaIdArquivo);

        // console.log("Valor memoria ARQUIVOS: ");
        // console.log(envioMemoriaArquivos);

        moverArquivos(envioMemoriaIdArquivo, envioMemoriaArquivos);

        data.map((opcao) => {
          if (opcao.id_arquivo == envioMemoriaIdArquivo) {
            opcao.path = arquivoDestino.replaceAll("/", "\\");
          }
        });
      } else if (selecaoMaquina.length === 0) {
        toast.error('Voce precisa selecionar uma máquina', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      } else if (arquivoDestino.length === 0) {
        toast.error('Voce precisa inserir um endereço de destino', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      } else if (selecaoMaquina.length === 0 && arquivoDestino.length === 0) {
        toast.error('Selecione uma máquina e preencha o endereço de destino', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      }
    } else if (opcao === "2" && itensSelecionados.length > 0) {
      //alert('Opcao Copiar');

      // console.log("METODO COPIAR ARQUIVO!");

      let memoriaIdArquivos = [];
      let memoriaEderecoArquivos = [];

      memoriaIdArquivos = itensSelecionados;
      memoriaEderecoArquivos = itensSelecionados;
      memoriaIdArquivos = memoriaIdArquivos.map((item) => {
        // console.log(item);

        return item.original.id_arquivo;
        //return (item.original.md5);
      });

      memoriaEderecoArquivos = memoriaEderecoArquivos.map((item) => {
        // console.log(item);

        return item.original.path;
        //return (item.original.md5);
      });

      // console.log("IDs SELECIOANDOS!! : ");
      // console.log(memoriaIdArquivos);

      // console.log("ARQUIVOS SELECIOANDOS!! : ");
      // console.log(memoriaEderecoArquivos);

      // console.log("ITENS SELECIOADOS!! : ");
      // console.log(itensSelecionados);

      let envioMemoriaIdArquivo = JSON.stringify(memoriaIdArquivos);
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("[", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("]", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replaceAll('"', "");

      let envioMemoriaArquivos = JSON.stringify(memoriaEderecoArquivos);
      envioMemoriaArquivos = envioMemoriaArquivos.replace("[", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replace("]", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replaceAll('"', "");

      if (selecaoMaquina.length > 0 && arquivoDestino.length > 0) {
        // console.log("Valor memoria IDs: ");
        // console.log(envioMemoriaIdArquivo);

        // console.log("Valor memoria ARQUIVOS: ");
        // console.log(envioMemoriaArquivos);

        copiarArquivos(envioMemoriaIdArquivo, envioMemoriaArquivos);

        data.map((opcao) => {
          if (opcao.id_arquivo == envioMemoriaIdArquivo) {
            opcao.path = arquivoDestino.replaceAll("/", "\\");
          }
        });
        
      } else if (selecaoMaquina.length === 0) {
        toast.error('Voce precisa selecionar uma máquina', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      } else if (arquivoDestino.length === 0) {
        toast.error('Voce precisa inserir um endereço de destino', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      } else if (selecaoMaquina.length === 0 && arquivoDestino.length === 0) {
        toast.error('Selecione uma máquina e preencha o endereço de destino', {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      }
    } else if (opcao === "5" && itensSelecionados.length > 0) {
      //alert('Opcao pseudo anonimizar');

      // console.log("METODO PSEUDO ANONIMIZAR ARQUIVO!");

      setOpenModalAcoesArquivo(true);
    } else if (opcao === "0" && itensSelecionados.length > 0) {
      //alert('Quarentena');

      let memoriaIdArquivos = [];
      let memoriaEderecoArquivos = [];

      memoriaIdArquivos = itensSelecionados;
      memoriaEderecoArquivos = itensSelecionados;

      memoriaIdArquivos = memoriaIdArquivos.map((item) => {
        // console.log(item);

        return item.original.id_arquivo;
        //return (item.original.md5);
      });

      memoriaEderecoArquivos = memoriaEderecoArquivos.map((item) => {
        // console.log(item);

        return item.original.path;
        //return (item.original.md5);
      });

      // console.log("IDs SELECIOANDOS!! : ");
      // console.log(memoriaIdArquivos);

      // console.log("ARQUIVOS SELECIOANDOS!! : ");
      // console.log(memoriaEderecoArquivos);

      // console.log("ITENS SELECIOADOS!! : ");
      // console.log(itensSelecionados);

      let envioMemoriaIdArquivo = JSON.stringify(memoriaIdArquivos);
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("[", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("]", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replaceAll('"', "");

      let envioMemoriaArquivos = JSON.stringify(memoriaEderecoArquivos);
      envioMemoriaArquivos = envioMemoriaArquivos.replace("[", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replace("]", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replaceAll('"', "");

      trazArquivoParaQuarentena(envioMemoriaIdArquivo);
    } else if (itensSelecionados.length === 0) {
      toast.error('Você precisa selecionar algum dado', {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    }
  }

  /* ========================================================================================== */
  /* === METODO RESPONSAVEL POR CHAMAR O METODO QUE ALTERA O DADO, PSEUDO, ANONIMIZA, DELETA === */
  /* ========================================================================================== */
  function alterarArquivoDestino(itensSelecionados) {
    // console.log("ITENS SELECIOANDOS!!!");
    // console.log(itensSelecionados);

    objQuarentenaRetorno = itensSelecionados;

    if (itensSelecionados.length > 0) {
      // console.log("METODO PSEUDO ANONIMIZAR ARQUIVO!");

      let memoriaIdArquivos = [];
      let memoriaEderecoArquivos = [];

      memoriaIdArquivos = itensSelecionados;
      memoriaEderecoArquivos = itensSelecionados;

      memoriaIdArquivos = memoriaIdArquivos.map((item) => {
        // console.log(item);

        return item.original.id_arquivo;
        //return (item.original.md5);
      });

      memoriaEderecoArquivos = memoriaEderecoArquivos.map((item) => {
        // console.log(item);

        return item.original.path;
        //return (item.original.md5);
      });

      let envioMemoriaIdArquivo = JSON.stringify(memoriaIdArquivos);
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("[", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replace("]", "");
      envioMemoriaIdArquivo = envioMemoriaIdArquivo.replaceAll('"', "");

      let envioMemoriaArquivos = JSON.stringify(memoriaEderecoArquivos);
      envioMemoriaArquivos = envioMemoriaArquivos.replace("[", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replace("]", "");
      envioMemoriaArquivos = envioMemoriaArquivos.replaceAll('"', "");

      // console.log(`DadosTratar: ${dadosTratar}`);
      // console.log(`Ação: ${acao}`);

      pseudoAnonimizar(
        envioMemoriaIdArquivo,
        envioMemoriaArquivos,
        dadosTratar,
        acao
      );

      /*
      reverterPseudoAnonimizar(
        envioMemoriaIdArquivo,
        envioMemoriaArquivos,
        dadosTratar,
        acao
      );
      */

    } else if (itensSelecionados.length === 0) {
      toast.error('Você precisa selecionar algum dado', {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    } else if (dadosTratar.length > 2) {
      toast.error('Preencha corretamente os campos', {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    }
  }

  /* ================================================================== */
  /* === METODO RESPONSAVEL POR ENVIAR OS DADOS === */
  /* ================================================================== */
  function handleEnviaDadosXLS() {
    //let token = localStorage.getItem("@FlashSafe-token");

    /*const obj = { 
          "nome": nome, 
          "cpf": cpf, 
          "email": email,
          "arquivo": arquivo,
          "maquina": maquina,
          "pseudo": pseudo,  
      };*/

    // console.log("OBJ CRIADO!!");
    // console.log(dados);

    //await xlsLimpa(token, obj);
  }

  /* ========================================================= */
  /* === BUSCA TODAS AS MAQUINAS LISTADAS NA BASE DE DADOS === */
  /* ========================================================= */
  function findAllMaquinas() {
    let token = localStorage.getItem("@FlashSafe-token");

    const objeto = {
      tabela: "map_maquinas",
      select: "1=1",
      pagina: "1",
      qt: "100",
      campos_select_end_point: "maquina^computer_name",
      get_qt: "1",
    };

    api
      .post("/sql/selectSql/" + token + "/resp_rest", objeto)
      .then((response) => {
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

        valorMemoria = "[" + valorMemoria; // ACRESCENTA UMA [ POIS A MESMA FOI IGNORADA NO FOR PARA FACILITAR O DESMENBRAMENTO DA STRING
        //valorMemoria = valorMemoria.replace(']','');

        valorMemoria = JSON.parse(valorMemoria); // CONVERTE A STRING EM UM OBJETO JSON

        //console.log('VALOR DA MEMORIA: '); // IMPRIME NA TELA O VALOR DO JSON OBTIDO
        //console.log(valorMemoria);

        let array = valorMemoria; // ARRAY RECEBE O VALOR ATUALIZADO PARA CONSTRUIR A TABELA CORRETAMENTE

        // console.log("ARRAY");
        // console.log(array);

        // const nomes = array.map((listaNomes) => (
        //   listaNomes.computer_name
        // ))
        // var semRepetidos = nomes.filter(function (el, i) {
        //   return array.indexOf(el) === i;
        // });
        //   setArrayMaquinas(semRepetidos);

        setArrayMaquinas(array);

        // console.log("DADOS MAQUINAS: ");
        // console.log(array);

        setSelecaoMaquina(array[0].maquina);

        // console.log("MAQUINA ARMAZENADA: ");
        // console.log(selecaoMaquina);
      })
      .catch((err) => {
        // console.error("ops! ocorreu um erro" + err);
      });
  }

  function handleNomeMaquina(event) {
    setSelecaoMaquina(event);
  }

  function handleAcao(event) {
    setAcao(event);
  }

  function handleDadosTratar(event) {
    setDadosTratar(event);
  }

  function handleArquivoDestino(event) {
    event.target.value = event.target.value.replaceAll("\\", "/");
    setArquivoDestino(event.target.value);
  }

  const columns = React.useMemo(
    () => [
      /*
      {
        Header: "Ação",
        accessor: "",
        Cell: ({ value }) => (
          <div className="option-three-points">
            <button type="button" onClick={() => handleCapturaClick()}>
              <MdOutlineCallToAction size={25} />
            </button>
          </div>
        ),
      },*/
      {
        Header: "Caminho",
        accessor: "path",
      },
      /*{
        Header: 'md5',
        accessor: 'md5',
      },
      {
        Header: "Quarentena",
        accessor: "quarentena",
      },*/
      {
        Header:  "Máquina",
        accessor: "computer_name",
      },

      {
        Header: "exp_1",
        accessor: "exp_1",
      },

      {
        Header: "exp_2",
        accessor: "exp_2",
      },

      {
        Header: "exp_3",
        accessor: "exp_3",
      },

      {
        Header: "exp_4",
        accessor: "exp_4",
      },

      {
        Header: "exp_5",
        accessor: "exp_5",
      },

      {
        Header: "exp_6",
        accessor: "exp_6",
      },

      {
        Header: "exp_7",
        accessor: "exp_7",
      },

      {
        Header: "exp_8",
        accessor: "exp_8",
      },

      {
        Header: "exp_9",
        accessor: "exp_9",
      },

      {
        Header: "exp_10",
        accessor: "exp_10",
      },

      /*{
        Header: 'Data',
        accessor: 'ult_dth',
      },
      {
        Header: 'Grupo_dlp',
        accessor: 'grupo_dlp',

      },      
      
      {
        Header: 'Código do drive',
        accessor: 'codigo_drive',
      },

      // {
      //   Header: 'Cliente',
      //   accessor: 'cliente',

      // },
      {
        Header: 'tipo',
        accessor: 'tipo',

      },*/

    ],
    []
  );

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row?.[id]] });
  }
  

  // Let the table remove the filter if the string is empty
  fuzzyTextFilterFn.autoRemove = (val) => !val;

  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 13 },
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              {/* TITULO COLUNA HEADER DA COLUNA (NOME) */}
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              {/* ICONE DE SELECIONAR LINHA */}
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps("teste")}
              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Define a default UI for filtering
  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <>
        {/* INPUTS DE PESQUISA DA COLUNA */}
        <TextField
          variant="outlined"
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
          }}
          placeholder={`Procurar em ${count} registros`}
          InputProps={{
            disableUnderline: true,
            className: "input-search-table",
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </>
    );
  }

  // console.log(selectedFlatRows);
  // Render the UI for your table
  // console.log("URL download: " + downloadArquivo);
  //console.log("Memoria retorno: " + memoriaRetorno);
  return (
    <>
      
      {acoesArquivo ? (
        <div className="modal-find-baixar-files tratativa-dado" style={{ width: "40%" }}>
          <h1>
            O que você deseja fazer com o arquivo?
          </h1>

          {/*<button className="button-close-modal" type="button" onClick={() => setOpenModalAcoesArquivo(false)}> X </button>*/}

          <label className="transparencia">
            Dados:
            <textarea
              type="text"
              placeholder="Digite a expressão a ser tratada"
              onChange={(e) => handleDadosTratar(e.target.value)}
            ></textarea>
          </label>

          {/* SELECT MAQUINA DESTINO */}
          <label className="transparencia">
            Ações:
            <select
              name="maquina"
              id="maquina"
              value={acao}
              onChange={(e) => handleAcao(e.target.value)}
            >
              <option disabled selected>Selecione uma opção</option>
              <option value="1">Deletar Expressão</option>
              <option value="2">Anonimizar</option>
              {/*<option value="3">Pseudo Anonimizar</option>*/}
              {/*<option value="4">Reverter Pseudo Anonimizar</option>*/}
            </select>
          </label>

          <div style={{display: "flex", justifyContent: "flex-end", margin: "20px 0", padding: "0", gap: "10px", width: "80%"}}>

            <button
              className="enviar-tratativa"
              onClick={() => alterarArquivoDestino(selectedFlatRows)}
              style={{display: "flex", justifyContent: "flex-end", margin: "0"}}
            >
              {" "}
              Enviar{" "}
            </button>
            <button
              className="enviar-tratativa"
              onClick={() => setOpenModalAcoesArquivo(false)}
              style={{display: "flex", justifyContent: "flex-end", margin: "0"}}
            >
              {" "}
              Cancelar{" "}
            </button>
          </div>
        </div>
      ) : null}

      {baixarArquivo ? (
        <div className="modal-find-baixar-files">
          <h1>Deseja realizar o download do arquivo?</h1>
          <div className="opcoes">
            <a href={downloadArquivo} target="_blank" rel="noreferrer">
              Sim
            </a>
            <button onClick={() => setBaixarArquivo(false)}>Não</button>
          </div>
        </div>
      ) : null}

      {modalTexto ? (
        <div className="modal-find-visualizar-files">
          <div className="botao-fechar">
            <button
              className="button-close-modal"
              type="button"
              onClick={() => setModalTexto(false)}
            >
              {" "}
              X{" "}
            </button>
          </div>
          <embed id="arquivo" src={downloadArquivo} />
        </div>
      ) : null}

      {/* |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |   */}

      {openModalOpcoes ? (

        <div className="modal-find-opcoes-tabela atualizar-pesquisa" style={{ width: "380px" }}>

          <div className="divider-modal">
            <h1>Ações: </h1>
          </div>
          
          <div className="list-modal">
            <ul className="list-modal-item">
              <li onClick={ () => setOpenModalMover(true) > setOpenModalOpcoes(false) }>Mover</li>
              <li onClick={ () => setOpenModalCopiar(true) > setOpenModalOpcoes(false) }>Copiar</li>
              <li onClick={ () => setOpenModalQuarentena(true) > setOpenModalOpcoes(false) }>Quarentena</li>
              <li onClick={ () => setOpenModalAnonimizar(true) > setOpenModalOpcoes(false) }>Anonimizar</li>
              <li onClick={ () => setOpenModalPseudoAnonimizar(true) > setOpenModalOpcoes(false) }>Pseudo-anonimizar</li>
              <li onClick={ () => setOpenModalReverterPseudoAnonimizar(true) > setOpenModalOpcoes(false) }>Reverter Pseudo-anonimização</li>
              <li onClick={ () => setOpenModalApagarExpressao(true) > setOpenModalOpcoes(false) }>Apagar Expressão</li>
              <li onClick={ () => setOpenModalApagarArquivo(true) > setOpenModalOpcoes(false) }>Apagar Arquivo</li>
            </ul>
            <button className="button" onClick={() => setOpenModalOpcoes(false)}>Cancelar</button>
          </div>
        </div>
      ) : null}

      {openModalMover ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa">

          <div className="divider-modal">
            <h1>Mover</h1>
          </div>

              {/* SELECT DELETA / MOVE / COPIA */}
              <select onChange={(e) => minhaOpcao(e.target.value)}>
                
                  <option value = "1">Mover</option>
                  <option value = "1">Mover</option>
                
              </select>
              <br></br>
              <div className="modal-label">

                <p className="transparencia" > Máquina de destino: </p>
                
                <select name="maquina" id="maquina" value={selecaoMaquina} onChange={(e) => handleNomeMaquina(e.target.value)} >
                  {arrayMaquinas.map((option) => (
                  <option value={option.maquina}>{option.computer_name}</option>
                   ))}
                </select>
           
              </div>



          {/*     OCULTO ATÉ CONSEGUIR TRAZER O NOME DOS ARQUIVOS NO INPUT
          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled />
            </label>
          </div>
                */}


          <div className="modal-label">
            <label>
              <p>Endereço de destino</p>
              <input type="text" id="destino" name="destino" placeholder="Insira o endereço de destino" onChange={(e) => handleArquivoDestino(e)}/>
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => clicou( "1" , selectedFlatRows )}>Enviar</button>
            <button className="button" onClick={() => setOpenModalMover(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}

      {openModalCopiar ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa">

          <div className="divider-modal">
            <h1>Copiar</h1>
          </div>

          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled />
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Máquina destino</p>
              <select name="maquina-destino" id="maquina-destino">
                <option value="value 0" disabled selected>Selecione a máquina</option>
                <option value="value 1">BENTLEY</option>
                <option value="value 2">LANDAU</option>
                <option value="value 3">OPALA</option>
              </select>
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Endereço de destino</p>
              <input type="text" placeholder="Insira o endereço de destino" />
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => copiarFiles( 'idArquivoMoc' , 'maquinaArquivoMoc' , 'destinoArquivoMoc' )}>Enviar</button>
            <button className="button" onClick={() => setOpenModalCopiar(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}

      {openModalQuarentena ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa">

          <div className="divider-modal">
            <h1>Quarentena</h1>
          </div>

          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled />
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Máquina destino</p>
              <select name="maquina-destino" id="maquina-destino">
                <option value="value 0" disabled selected>Selecione a máquina</option>
                <option value="value 1">BENTLEY</option>
                <option value="value 2">LANDAU</option>
                <option value="value 3">OPALA</option>
              </select>
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Endereço de destino</p>
              <input type="text" placeholder="Insira o endereço de destino" />
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => alert("arquivo movido para quarentena com sucesso")}>Enviar</button>
            <button className="button" onClick={() => setOpenModalQuarentena(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}

      {openModalAnonimizar ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa">

          <div className="divider-modal">
            <h1>Anonimizar</h1>
          </div>

          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled />
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Anonimizar a expressão:</p>
              <input type="text" placeholder="Palavra à anonimizar" />
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => alert("arquivo anonimizado com sucesso")}>Enviar</button>
            <button className="button" onClick={() => setOpenModalAnonimizar(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}

      {openModalPseudoAnonimizar ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa" style={{ width: "320px" }}>

          <div className="divider-modal">
            <h1>Pseudo-anonimizar</h1>
          </div>

          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled style={{ width: "280px" }} />
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Pseudo-anonimizar a expressão:</p>
              <input type="text" placeholder="Palavra à pseudo-anonimizar" style={{ width: "280px" }} />
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => alert("arquivo pseudo-anonimizado com sucesso")}>Enviar</button>
            <button className="button" onClick={() => setOpenModalPseudoAnonimizar(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}

      {openModalReverterPseudoAnonimizar ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa" style={{ width: "420px" }}>

          <div className="divider-modal">
            <h1>Reverter Pseudo-anonimizar</h1>
          </div>

          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled style={{ width: "380px" }} />
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Reverter Pseudo-anonimizar da expressão:</p>
              <input type="text" placeholder="Palavra à reverter a pseudo-anonimização" style={{ width: "380px" }} />
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => alert("arquivo pseudo-anonimizado com sucesso")}>Enviar</button>
            <button className="button" onClick={() => setOpenModalReverterPseudoAnonimizar(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}

      {openModalApagarExpressao ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa">

          <div className="divider-modal">
            <h1>Apagar Expressão</h1>
          </div>

          <div className="modal-label">
            <label>
              <p>Arquivo</p>
              <input type="text" placeholder="Trazer o arquivo aqui" disabled />
            </label>
          </div>

          <div className="modal-label">
            <label>
              <p>Apagar a expressão:</p>
              <input type="text" placeholder="Palavra à apagar" />
            </label>
          </div>

          <div className="modal-radio">
            <label>
              <p>Você realmente deseja apagar esta expressão?</p>
              <input type="radio" id="sim" name="confirma" value={"Sim"} />
              <label htmlFor="sim">Sim</label>
              <input type="radio" id="nao" name="confirma" value={"Não"} checked />
              <label htmlFor="nao">Não</label>
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => alert("expressão apagada com sucesso")}>Enviar</button>
            <button className="button" onClick={() => setOpenModalApagarExpressao(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}
      {openModalApagarArquivo ? (
        <div className="modal-find-opcoes-tabela atualizar-pesquisa">

          <div className="divider-modal">
            <h1>Apagar Arquivo</h1>
          </div>

          {/*     OCULTO ATÉ CONSEGUIR TRAZER O NOME DOS ARQUIVOS NO INPUT
          <div className="modal-label">
            <label>
              <p>Arquivo:</p>
              <input type="text" placeholder = {(selectedFlatRows)}  disabled />
            </label>
          </div>
          */}

          <div className="modal-radio">
            <label>
              <p>Você realmente deseja apagar este arquivo?</p>
              <input type="radio" id="sim" name="confirma" value={"Sim"} />
              <label htmlFor="sim">Sim</label>
              <input type="radio" id="nao" name="confirma" value={"Não"} checked />
              <label htmlFor="nao">Não</label>
            </label>
          </div>

          <div className="modal-button">
            <button className="button" onClick={() => clicou( "6" , selectedFlatRows )}>Enviar</button>
            <button className="button" onClick={() => setOpenModalApagarArquivo(false)}>Cancelar</button>
          </div>

        </div>
      ) : null}
      {/* |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |   */}


      <div className="menu-header-result-archive">
     

        <div className="atualizar-pesquisa" style={{ width: "100%"}}>

          <div className="acoes">
            <label>Ações:</label>
            <select onChange={(e) => minhaOpcao(e.target.value)}>
              <option selected disabled>Selecione a ação</option>
              {opcoesSelect.map((option) => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="acoes">
            <label className="transparencia">Máquina de Destino: </label>
            <select
              className="input-escolha transparencia"
              name="maquina"
              id="maquina"
              value={selecaoMaquina}
              onChange={(e) => handleNomeMaquina(e.target.value)}
            >
              <option selected disabled>Selecione a máquina</option>
              {arrayMaquinas.map((option) => (
                <option value={option.maquina}>{option.computer_name}</option>
              ))}
            </select>
          </div>

          <div className="acoes">
            <label className="transparencia">Endereço de Destino: </label>
            <input
              className="input-escolha transparencia"
              name="destino"
              id="destino"
              placeholder="insira o endereço do destino"
              onChange={(e) => handleArquivoDestino(e)}
            />
          </div>

          <button className="button" onClick={() => clicou(optionSelected, selectedFlatRows)} >
            Enviar
          </button>
        </div>
      </div>


      <div className="container-result-archive">
        <table className="table-result-archive" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <>
                    {/*<th {...column.getHeaderProps(column.getSortByToggleProps())}>*/}
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                      {column.render("Header")}
                      <span className="table-filters">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDropDown />
                          ) : (
                            <ArrowDropUp />
                          )
                        ) : (
                          ""
                        )}
                      </span>
                      {/* Render the columns filter UI */}
                      <div className="input-search-tabela">
                        {column.canFilter ? column.render("Filter") : null}
                      </div>
                    </th>
                  </>
                ))}
              </tr>
            ))}
          </thead>
          {/* IMPRESSAO NA TABELA DE CADA DADO */}
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    if (cell.value === "0") {
                      return (
                        <td className="celula-amarela" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    } else if (cell.value === "1") {
                      return (
                        <td className="celula-azul" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </td>
                      );
                    } else {
                      return (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/*   BOTÃO PARA ABRIR MODAL DE AÇÕES - TEMPORARIAMENTE OCULTO
      <div className="atualizar-pesquisa"  style={{ display: "flex" , justifyContent: "flex-start" , margin: "0 10px"}}>
       <button className="button" type="button" onClick={() => handleCapturaClick(selectedFlatRows.length)}>Ações</button>
      </div>
      */}

    </>
  );
}

export default TableResultArchive;


