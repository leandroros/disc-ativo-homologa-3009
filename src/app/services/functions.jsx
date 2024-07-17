import { toast } from "react-toastify";
import api from "./api";
import apiDev from "./apiDev";





function getLastDiscoveryID(acessToken) {
  let result = "";

  api
    .get("/discovery/ultDiscovery/" + acessToken + "/resp_rest")
    .then((response) => {
      result = response.data;
      localStorage.setItem("Last_Discovery", result);
      console.log("#%¨&#%#%¨&", response.data);
    })
    .catch((err) => {
      result = "ERRO " + err;
    });

  return result;
}
export { getLastDiscoveryID };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function postCreateJob(acessToken, maquinas, tipoArquivo, jobDescription, idDiscovery) {
  //let lastDiscovery = localStorage.getItem("Last_Discovery");
  let result = "";
  //console.log("tipoArquivo", tipoArquivo);

  /*const headers = {
         "maquinas": maquinas,
         "grupos_dlp": "epsoft",
         "tipos_arquivo": tipoArquivo,
         "extensoes": "",
         "descricao": jobDescription,
         "id_discovery": lastDiscovery,
         "cliente":"epsoft"

        "id_discovery": lastDiscovery,
        "cliente": "epsoft",
        "computer_names": maquinas,
        "grupos_dlp":"epsoft",
        "tipos":"zip,text,pdf,rar,office,xml,x-bat,text,html,excel,ppt,rtf,message,word",
        "extensoes":"",
        "descricao": jobDescription
     }*/

  const headers = {
    //id_discovery: lastDiscovery,
    id_discovery: idDiscovery,
    cliente: Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
      .toString()
      .split("^")[1]
      .replace("*", ""), // epsoft*
    computer_names: maquinas,
    grupos_dlp: Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
      .toString()
      .split("^")[1]
      .replace("*", ""), // epsoft*
    tipos:
      "zip,text,pdf,rar,office,xml,x-bat,text,html,excel,ppt,rtf,message,word,cmd,html,java,message,office,pdf,rtf,word,xml,zip,txt",
    extensoes: "Q:/",
    descricao: jobDescription,
  };

  //console.log(headers);

  api
    .post("/discovery/criaJobAtivo/" + acessToken + "/resp_rest", headers)
    .then((response) => {
      result = response.data;
     // console.log(response.data);

      // toast.success("Job criado", {
      //   position: "top-right",
      //   autoClose: 4000,
      //   autoDismiss: true,
      //   hideProgressBar: false,
      //   pauseOnHover: true,
      // });
    })
    .catch((err) => {
      result = "ERRO " + err;
    });

  return result;
}
export { postCreateJob };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function postCreateDiscovery(acessToken) {
  let result = "";
  // const headers = {
  //   nome: "ciscovery_210909",
  //   descricao: "discovery teste epp 210909",
  //   check: "",
  // };
  api
    .post("/discovery/criaDiscoveryAtivo/" + acessToken + "/resp_rest")
    .then((response) => {
      result = response.data;
      console.log(result);

      // console.log("Discovery criado")

      // toast.success("Discovery criado", {
      //   position: "top-right",
      //   autoClose: 4000,
      //   autoDismiss: true,
      //   hideProgressBar: false,
      //   pauseOnHover: true,
      // });
    })

    .catch((err) => {
      result = err;
    });

  return result;
}
export { postCreateDiscovery };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateCreateJob(acessToken) {
  let result = "";

  const headers = {
    comando: "1-discovery",
    ult_atividade: "2021-07-17 18:05:00",
    nome_tabela: "map_jobs",
    arg_select: "job=<codigo_job>",
  };

  api
    .post("/sql/updateParcial/" + acessToken + "/resp_rest", headers)
    .then((response) => (result = response.data))
    .catch((err) => {
      result = err;
    });

  return result;
}
export { updateCreateJob };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function loadMachineList(acessToken, selectedGroups) {
  let result = [];

  console.log("os grupos selecionados são", selectedGroups);
  api
    .get(
      "/jsons/pegaMaquinas/" + acessToken + "/~" + selectedGroups + "/resp_rest"
    )
    .then((response) => {
      result = response.data;
      console.log(result, "review");
      return result;
    })
    .catch((err) => {
      console.error("ops! ocorreu um erro" + err);
    });
}
export { loadMachineList };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getMachineResultList(acessToken) {
  let result = [];

  const headers = {
    tabela: "map_maquinas",
    select: `grupo_dlp like'${
      Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
      .toString()
      .split('^')[1]
      .replace("*", "")
      }%'^order by id desc`,
    pagina: "1",
    qt: "100",
    campos_select_end_point:
      "maquina^ult_job^computer_name^cliente^qt_arqs_discovery^percentual^grupo_dlp",
    get_qt: "100",
  };

  api
    .post("/sql/selectSql/" + acessToken + "/resp_rest", headers)
    .then((response) => {
      result = response.data;
      return result;
    })
    .catch((err) => {
      result = err;
    });

  return result;
}
export { getMachineResultList };

/* ================================================= */
/* === DELETAR UM OU VARIOS ITEM(S) SELECIONADOS === */
/* ================================================= */
async function deletaFiles(acessToken, idArquivos) {
  console.log(`Retorno Deletar Arquivos, ID arquivo: ${idArquivos}`);

  api
    .get(`/discovery/deletaFile/${acessToken}/${idArquivos}/resp_rest`)
    .then((response) => {
      console.log("O arquivo foi deletado com sucesso!!");
      console.log(response);

      toast.success("O arquivo foi deletado", {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    })
    .catch((err) => {
      console.log(err.status);
    });
}
export { deletaFiles };

/* ================================= */
/* === MOVE UM OU VARIOS ITEM(S) === */
/* ================================= */
async function moveFiles(acessToken, ids, arquivos, maquina, destino) {
  
  let result = "";
  const headers = {
    id_arquivo_orig: ids,
    maq_destino: maquina,
    arq_dest: destino, //+ arquivos.replaceAll('\\\\', '\\')
  };

  // console.log("DADOS HEADER MOVER ARQUIVO: ");
  // console.log(headers);

  api
    .post(`/discovery/moveFile/` + acessToken + `/resp_rest`, headers)
    .then((resp) => {
      result = resp.data;

      console.log("RETORNO: ");
      console.log(result);

      toast.success("O arquivo foi movido", {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });

      return result;
    })
    .catch((err) => {
      result = err;
    });

  return result;
}
export { moveFiles };

/* ================================== */
/* === COPIA UM OU VARIOS ITEM(S) === */
/* ================================== */
async function copiaFiles( acessToken , ids, arquivos, maquina, destino ) {
 
  let result = "";
  const headers = {
    id_arquivo_orig: ids,
    maq_destino: maquina,
    arq_dest: destino,
  };

  console.log("DADOS HEADER COPIAR ARQUIVO: ");
  console.log(headers);

  api.post(`/discovery/copyFile/${acessToken}/resp_rest`, headers)
    .then((resp) => {
      result = resp.data;

      console.log("RETORNO: ");
      console.log(result);

      toast.success("O arquivo foi copiado", {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });

      return result;
    })
    .catch((err) => {
      result = err;
    });

  return result;
}
export { copiaFiles };

/* ================================== */
/* === COPIA UM OU VARIOS ITEM(S) === */
/* ================================== */

async function psudoAnonimizarDados(
  acessToken,
  ids,
  nomeArquivo,
  destino,
  acao
  ) {
  // console.log(`Token: ${acessToken}`);
   console.log(`ID: ${ids}`);
   console.log(`Destino: ${destino}`);
   console.log(`Ação: ${acao}`);
   console.log(`Nome arquivo: ${nomeArquivo}`);

  let result = "";

  // RETIRAR AS BARRAS PARA OBTER SOMENTE O NOME DO ARQUIVO
  //arquivos.split('').reverse().join('');

  /*let dados = [];
    let extensao = [];

    dados.push(arquivos.split(','));

    for(let i = 0; i < dados.length; i++) {
        extensao.push(dados[i].split('.')[1]);
    }

    console.log(extensao);*/

  const headers = {
    id_arquivo: ids,
    arquivo: nomeArquivo,
    string: destino,
    acao: acao,
    
  };

  // console.log("DADOS HEADER COPIAR ARQUIVO: ");
  // console.log(headers);

  api
    .post(`/discovery/anonimizaDado/${acessToken}/resp_rest`, headers)
    .then((resp) => {
      result = resp.data;


      if(result.includes('expirado')){
        window.location.href = '/'
      }

      console.log("RETORNO: ");
      console.log(result);

      toast.success("Ação Realizada", {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });

      return result;
    })
    .catch((err) => {
      result = err.response.data;
  
      //alert(result);

      toast.error(result, {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    });

  return result;
}
export { psudoAnonimizarDados };

async function reverterPsudoAnonimizar(
  acessToken,
  ids,
  nomeArquivo,
  destino,
  acao,
  ) {
  // console.log(`Token: ${acessToken}`);
  // console.log(`ID: ${ids}`);
  // console.log(`Destino: ${destino}`);
  // console.log(`Ação: ${acao}`);
  // console.log(`Nome arquivo: ${nomeArquivo}`);

  let result = "";

  const headers = {
    id_arquivo: ids,
    arquivo: nomeArquivo,
    string: destino,
    acao: acao,
  };

  // console.log("DADOS HEADER COPIAR ARQUIVO: ");
  // console.log(headers);

  api
    .post(`/discovery/anonimizaDado/${acessToken}/resp_rest`, headers)
    .then((resp) => {
      result = resp.data;

      if(result.includes('expirado')){
        window.location.href = '/'
      }

      console.log("RETORNO: ");
      console.log(result);

      toast.success("Ação realizada", {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });

      return result;
    })
    .catch((err) => {
      result = err;
      // console.log("NÃO REVERTEU PORQUE: ")
      // console.log(result)
      // toast.error("Ocorreu um erro com o envio", {
      //   position: "top-right",
      //   autoClose: 4000,
      //   autoDismiss: true,
      //   hideProgressBar: false,
      //   pauseOnHover: true,
      // });
    });

  return result;
}
export { reverterPsudoAnonimizar };

/* =========================================================== */
/* === ANONIMIZA OU DELETA DADOS DE UM DETERMINADO ARQUIVO === */
/* =========================================================== */
async function xlsLimpa(acessToken, objeto) {
  let result = "";

  console.log(objeto);

  const headers = {
    nome: objeto.nome,
    cpf: objeto.cpf,
    email: objeto.email,
    arquivo: objeto.arquivo,
    maquina: objeto.maquina,
    pseudo: objeto.pseudo,
  };

  // console.log(headers);

  apiDev
    .post(`/lgpd/xlsLimpa/${acessToken}/resp_rest`, headers)
    .then((resp) => {
      result = resp.data;

      // console.log("Resultado OK: " + result);

      alert(resp.data);

      return result;
    })
    .catch((err) => {
      result = err;

      console.log("Resultado NOK: " + result);
    });

  console.log("RESPOSTA: " + result);

  return result;
}
export { xlsLimpa };

/* ==================== */
/* === TRAZ ARQUIVO === */
/* ==================== */
async function trazQuarentena(acessToken, ids) {
  let result = "";

  api
    .get(`/discovery/trazQuarentena/${acessToken}/${ids}/resp_rest`)
    .then((resp) => {
      result = resp.data;

      // console.log("RETORNO: ");
      // console.log(result);

      return result;
    })
    .catch((err) => {
      result = err;

      toast.error("Ocorreu um erro com a inserção do arquivo em quarentena", {
        position: "top-right",
        autoClose: 4000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    });

  return result;
}
export { trazQuarentena };

/* =========================================== */
/* === CARREGA ARQUIVO NA PASTA QUARENTENA === */
/* =========================================== */
async function publicaQuarentena(acessToken, ids) {
  let result = "";

  api
    .get(`/discovery/publicaQuarentena/${acessToken}/${ids}/resp_rest`)
    .then((resp) => {
      result = resp.data;

      if(result.includes('expirado')){
        window.location.href = '/'
      }

      // console.log("RETORNO: ");
      // console.log(result);

      return result;
    })
    .catch((err) => {
      result = err;
    });

  return result;
}
export { publicaQuarentena };

async function atualizaMaquina(objeto) {
  let token = localStorage.getItem("@FlashSafe-token");

  const headers = {
    tabela_end_point: "map_maquinas",
    campos_select_end_point: "maquina",
    maquina: objeto.maquina,
    ult_job: objeto.ult_jo,
    status: objeto.status,
    cliente: objeto.cliente,
    grupo_dlp: objeto.grupo_dlp,
    drives: objeto.drives,
    computer_name: objeto.computer_name,
    dth_inicio: objeto.dth_inicio,
    dth_atualizacao: objeto.dth_atualizacao,
    hora0: parseInt(objeto.hora0),
    hora1: parseInt(objeto.hora1),
    hora2: parseInt(objeto.hora2),
    hora3: parseInt(objeto.hora3),
    hora4: parseInt(objeto.hora4),
    hora5: parseInt(objeto.hora5),
    hora6: parseInt(objeto.hora6),
    hora7: parseInt(objeto.hora7),
    hora8: parseInt(objeto.hora8),
    hora9: parseInt(objeto.hora9),
    hora10: parseInt(objeto.hora10),
    hora11: parseInt(objeto.hora11),
    hora12: parseInt(objeto.hora12),
    hora13: parseInt(objeto.hora13),
    hora14: parseInt(objeto.hora14),
    hora15: parseInt(objeto.hora15),
    hora16: parseInt(objeto.hora16),
    hora17: parseInt(objeto.hora17),
    hora18: parseInt(objeto.hora18),
    hora19: parseInt(objeto.hora19),
    hora20: parseInt(objeto.hora20),
    hora21: parseInt(objeto.hora21),
    hora22: parseInt(objeto.hora22),
    hora23: parseInt(objeto.hora23),
  };

  //console.log(headers);

  api
    .post("/sql/updateSql/" + token + "/resp_rest", headers)
    .then((response) => {
      //setTimeout(() => window.location.reload() , 3000)
      window.location.reload()
      console.log(response.data);
    })
    .catch((err) => {
      alert("Ocorreu um erro na atualização do drive, refaça a operação")
      console.error("ops! ocorreu um erro" + err);
    });

}
export { atualizaMaquina };

async function getJson(maquina) {

  let token = localStorage.getItem("@FlashSafe-token");
  let result = "";

  const headers = {
    "filtro": maquina,
    "pg": "1",
    "qtPorPg": "100"
  };

  return api
    .post("/configs/getJsons/" + token + "/resp_rest", headers)
    .then((response) => {
      result = response.data[0];
      return result
    })
    .catch((err) => {
      alert("Ocorreu um erro na requisição, refaça a operação")
      console.error("ops! ocorreu um erro" + err);

    });
  
    
}
export { getJson };

async function putJson(maquina) {
  console.log(maquina)

  let token = localStorage.getItem("@FlashSafe-token");

  api
    .post("/configs/putJson/" + token + "/resp_rest", maquina)
    .then((response) => {
      console.log("Deu Certo!");
      console.log(response);
    })
    .catch((err) => {
      alert("Ocorreu um erro na atualização do drive, refaça a operação")
       console.error("ops! ocorreu um erro" + err);
    });
  
    
}
export { putJson };

