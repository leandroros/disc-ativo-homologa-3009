import React from "react";
import { MenuLeft } from "../../components";

import { xlsLimpa } from "../../services/functions";

function Anonimizar() {
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

  async function handleEnviaDadosXLS() {
    let token = localStorage.getItem("@FlashSafe-token2");

    // console.log("OBJ CRIADO!!");
    // console.log(dados);

    /*const obj = { 
        "nome": "Otávio Vinicius Aragão",
        "cpf": "905.414.442-47", 
        "email": "",
        "arquivo": "/j/cmds/relacaoRh.xlsx",
        "maquina": "30SMDWGF4VPP",
        "pseudo": true,  
    }*/

    //await xlsLimpa(token, dados);
    await xlsLimpa(token, dados);
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <MenuLeft />

        <div className="main-content ">
          <div className="card redimencionamneto">
            <h1 className="card-title"> Anonimizar</h1>
            <p className="card-subtitle">
              Preencha os campos para anonimizar os dados de uma
            </p>
            <div className="divider"></div>
            <form className="form-login">
              <input
                type="text"
                placeholder="Nome Usuario"
                onChange={(e) => nomeUsuario(e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF"
                onChange={(e) => cpfUsuario(e.target.value)}
              />
              <input
                type="text"
                placeholder="E-mail"
                onChange={(e) => emailUsuario(e.target.value)}
              />
              <input
                type="text"
                placeholder="/j/cmds/relacaoRh.xlsx"
                onChange={(e) => arquivoUsuario(e.target.value)}
              />
              <input
                type="text"
                placeholder="30SMDWGF4VPP"
                onChange={(e) => maquinaUsuario(e.target.value)}
              />
              <input
                type="text"
                placeholder="1 ou 0"
                onChange={(e) => pseudoUsuario(e.target.value)}
              />
              <button
                className="login-button"
                type="button"
                onClick={() => handleEnviaDadosXLS()}
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Anonimizar;
