import "../../../styles/style.scss";
import React, { useState, useEffect } from "react";
import { MenuLeft, TableResultArchiveNew2 } from "../../components";
import api from "../../services/api";
import { toast } from "react-toastify"
import { MdManageSearch } from 'react-icons/md'



function ResultArchive() {
  let acessToken = localStorage.getItem("@FlashSafe-token");

  const [discoveryList, setDiscoveryList] = useState([]);
  const [jobId, setJobId] = useState('');
  const [jsonKey, setJsonKey] = useState('');
  const [jsonValue, setJsonValue] = useState('');
  const [expList, setExpList] = useState([{}]);
  const [archiveList, setArchiveList] = useState([{}]);
  const [selecaoMaquina, setSelecaoMaquina] = useState();
  const [arrayMaquinas, setArrayMaquinas] = useState([]);
  const [idArquivo, setIdArquivo] = useState('');
  const [enderecoArquivo, setEnderecoArquivo] = useState('');
  const [enderecoDestino, setEnderecoDestino] = useState('');
  const [changeExpressao, setChangeExpressao] = useState('');
  const [maquinaSelecionada, setMaquinaSelecionada] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  //CONTROLADORES DE MODAL
  const [isModalArquivosOpen, setIsModalArquivosOpen] = useState(false);
  const [isModalAcoesOpen, setIsModalAcoesOpen] = useState(false);
  const [isModalMoverOpen, setIsModalMoverOpen] = useState(false);
  const [isModalCopiarOpen, setIsModalCopiarOpen] = useState(false);
  const [isModalAnonimizarOpen, setIsModalAnonimizarOpen] = useState(false);
  const [isModalApagarExpressaoOpen, setIsModalApagarExpressaoOpen] = useState(false);
  const [isModalApagarArquivoOpen, setIsModalApagarArquivoOpen] = useState(false);

  //CONFIGURAÇÃO DE PAGINAÇÃO
  const dadosPorPagina = 12;
  const [paginaAtual, setPaginaAtual] = useState(1);
  const indiceInicial = (paginaAtual - 1) * dadosPorPagina;
  const indiceFinal = indiceInicial + dadosPorPagina;
  const dadosExibidos = archiveList.slice(indiceInicial, indiceFinal);


  useEffect(() => {
    getJobList()
    findAllMaquinas()
  }, []);

  /* !  
  !  oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.     .oooooo.   oooooooooooo  .oooooo..o 
  !  `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b   d8P'  `Y8b  `888'     `8 d8P'    `Y8 
  !   888          888       8   8 `88b.    8  888          888      888  888         Y88bo.      
  !   888oooo8     888       8   8   `88b.  8  888          888      888  888oooo8     `"Y8888o.  
  !   888    "     888       8   8     `88b.8  888          888      888  888    "         `"Y88b 
  !   888          `88.    .8'   8       `888  `88b    ooo  `88b    d88'  888       o oo     .d8P 
  !  o888o           `YbodP'    o8o        `8   `Y8bood8P'   `Y8bood8P'  o888ooooood8 8""88888P'  
  !   */

  const getJobList = () => {
    let payload = {
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

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", payload)
      .then((response) => {

        let jobList = response.data
        let jobListIndex = jobList.indexOf('{');

        jobList = jobList.substring(jobListIndex);
        jobList = '[' + jobList
        jobList = JSON.parse(jobList)
        console.log(jobList)
        setDiscoveryList(jobList);

      })
      .catch((err) => {

      });
  };

  const getExpList = (idDiscovery) => {
    let payload = {
      tabela: "map_discovery",
      select: `id=${idDiscovery}`,
      pagina: "1",
      qt: "1000",
      campos_select_end_point: "exp_1^exp_2^exp_3^exp_4^exp_5^exp_6^exp_7^exp_8^exp_9^exp_10",
      get_qt: "1",

    };

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", payload)
      .then((response) => {

        let expList = response.data
        let expListIndex = expList.indexOf('{');

        expList = expList.substring(expListIndex);
        expList = '[' + expList
        expList = JSON.parse(expList)

        setExpList(expList)
      })
      .catch((err) => {

      });
  };

  const handleJob = (event) => {
    setJobId(event);
    getExpList(event);
  };

  const handleCloseModals = () => {
    setAceitouTermos(false)
    setIsModalArquivosOpen(false);
    setIsModalAcoesOpen(false);
    setIsModalMoverOpen(false);
    setIsModalCopiarOpen(false);
    setIsModalAnonimizarOpen(false);
    setIsModalApagarExpressaoOpen(false);
    setIsModalApagarArquivoOpen(false);

  };

  const handleAcao = (key, value) => {

    getArchiveList(key, value)


  };

  const getArchiveList = (jsonKey, value) => {

    let payload = {
      tabela: "map_arquivos",
      select: `id_discovery='${jobId}'and ${jsonKey} = '1'`,
      pagina: "1",
      qt: "1000",
      campos_select_end_point: "id_arquivo^path^computer_name",
      get_qt: "0",
    };

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", payload)
      .then((response) => {

        if (response.data == "]" || response.data == "") {
          alert("não existem dados para sua pesquisa")
        } else {
          const archiveList = response.data
          setArchiveList(archiveList)
          console.log("archiveList")
          console.log(archiveList)

          setJsonKey(jsonKey)
          setJsonValue(value)
          setIsModalArquivosOpen(true);
        }

      })
      .catch((err) => {

      });
  };

  const findAllMaquinas = () => {
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

        let maquinaList = response.data
        let maquinaListIndex = maquinaList.indexOf('{');

        maquinaList = maquinaList.substring(maquinaListIndex);
        maquinaList = '[' + maquinaList
        maquinaList = JSON.parse(maquinaList)

        setArrayMaquinas(maquinaList);
        setSelecaoMaquina(maquinaList);

      })
      .catch((err) => {
      });
  };

  const handleChangeEnderecoDestino = (event) => {
    setEnderecoDestino(event);
  };

  const handleChangeExpressao = (event) => {
    setChangeExpressao(event);
  };

  const handleMaquinaSelecionada = (event) => {
    setMaquinaSelecionada(event)
  };

  const moverArquivo = () => {

    const headers = {
      id_arquivo_orig: idArquivo,
      maq_destino: maquinaSelecionada,
      arq_dest: enderecoDestino,
    };

    api
      .post(`/discovery/moveFile/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`O arquivo foi movido com sucesso`);

        toast.success("O arquivo foi movido", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        setIsModalMoverOpen(false);
        getArchiveList(jsonKey);
      })
      .catch((err) => {
        console.log(`O arquivo não foi movido`);
        console.log(err);

        toast.error("O arquivo não foi movido, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
        setIsModalMoverOpen(false);


      });

  };

  const copiarArquivo = () => {

    const headers = {
      id_arquivo_orig: idArquivo,
      maq_destino: maquinaSelecionada,
      arq_dest: enderecoDestino,
    };

    api
      .post(`/discovery/copyFile/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`O arquivo foi copiado com sucesso`);

        toast.success("O arquivo foi copiado", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        setIsModalCopiarOpen(false)
        getArchiveList(jsonKey);
      })
      .catch((err) => {
        console.log(`O arquivo não foi copiado`);
        console.log(err);

        toast.error("O arquivo não foi copiado, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        setIsModalCopiarOpen(false)

      });

  };

  const deletarArquivo = () => {
    api
      .get(`/discovery/deletaFile/${acessToken}/${idArquivo}/resp_rest`)
      .then((resp) => {

        console.log(`O arquivo foi deletado com sucesso`);

        toast.success("O arquivo foi deletado", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        setIsModalApagarArquivoOpen(false)
        getArchiveList(jsonKey);
      })
      .catch((err) => {
        console.log(`O arquivo não foi deletado`);
        console.log(err);

        toast.error("O arquivo não foi deletado, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
        setIsModalApagarArquivoOpen(false)


      });

  };

  const anonimizarExpressao = () => {

    const headers = {
      id_arquivo: idArquivo,
      arquivo: enderecoArquivo,
      string: changeExpressao,
      acao: "2",
    };

    api
      .post(`/discovery/anonimizaDado/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`A expressão foi anonimizada com sucesso`);

        toast.success("A expressão foi anonimizada", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        setIsModalAnonimizarOpen(false);
      })
      .catch((err) => {
        console.log(`A expressão não foi anonimizada`);
        console.log(err);

        toast.error("A expressão não foi anonimizada, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
        setIsModalAnonimizarOpen(false);


      });

  };

  const deletarExpressao = () => {

    const headers = {
      id_arquivo: idArquivo,
      arquivo: enderecoArquivo,
      string: changeExpressao,
      acao: "1",
    };

    api
      .post(`/discovery/anonimizaDado/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`A expressão foi excluída com sucesso`);

        toast.success("A expressão foi excluída", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        setIsModalApagarExpressaoOpen(false)
      })
      .catch((err) => {
        console.log(`A expressão não foi excluída`);
        console.log(err);

        toast.error("A expressão não foi excluída, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
        setIsModalApagarExpressaoOpen(false)


      });

  };

  const handleCheckboxChange = () => {
    setAceitouTermos(!aceitouTermos);
  }

  const handleConfirmaDeletarArquivo = () => {
    if (aceitouTermos) {
      deletarArquivo();
      setAceitouTermos(false)
    } else {
      alert('Por favor, confirme a intenção de excluir o arquivo.');
      setAceitouTermos(false)
    }
  }

  const handleConfirmaDeletarExpressao = () => {
    if (aceitouTermos) {
      deletarExpressao();
      setAceitouTermos(false)
    } else {
      alert('Por favor, confirme a intenção de excluir a expressão.');
      setAceitouTermos(false)
    }
  }


  /* !
  !  ooooooooo.   oooooooooooo ooooo      ooo oooooooooo.   oooooooooooo ooooooooo.   
  !  `888   `Y88. `888'     `8 `888b.     `8' `888'   `Y8b  `888'     `8 `888   `Y88. 
  !   888   .d88'  888          8 `88b.    8   888      888  888          888   .d88' 
  !   888ooo88P'   888oooo8     8   `88b.  8   888      888  888oooo8     888ooo88P'  
  !   888`88b.     888    "     8     `88b.8   888      888  888    "     888`88b.    
  !   888  `88b.   888       o  8       `888   888     d88'  888       o  888  `88b.  
  !  o888o  o888o o888ooooood8 o8o        `8  o888bood8P'   o888ooooood8 o888o  o888o 
  !   */

  return (
    <div className="main-content" style={{ display: "flex", flexDirection: "row" }}>
      <MenuLeft />

      <div className="card main-content-result-archive ">
        <h1 className="card-title">Arquivos Analisados</h1>
        <div className="divider-pagina-arquivos"></div>
        <label className="label-select-discovery" htmlFor="maquina" >
          <p>Seleção da Descoberta </p>
          <select
            className="input-reason-descoberta"
            name="maquina"
            id="maquina"
            value={jobId}
            onChange={(e) => handleJob(e.target.value)}
          >
            <option value="" disabled selected >Selecione uma Descoberta</option>

            {discoveryList.map((discovery) => (
              <option value={discovery.id}>{discovery.nome}</option>
            )).reverse()
            }
          </select>
        </label>

        <div className="tabela-expressoes">


          <table>
            <thead>
              <tr>
                <th>Arquivos</th>
                <th>Expressão</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(expList[0]).map((key, index) => {
                const value = expList[0][key];
                if (value !== null && value !== '') {
                  return (
                    <tr key={index}>
                      <td>
                        <button onClick={() => handleAcao(key, value)}><MdManageSearch size={18} /></button>
                      </td>
                      <td>{value}</td>
                    </tr>
                  );
                }
                return null;
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* !
!  ooo        ooooo   .oooooo.   oooooooooo.         .o.       ooooo  .oooooo..o 
!  `88.       .888'  d8P'  `Y8b  `888'   `Y8b       .888.      `888' d8P'    `Y8 
!   888b     d'888  888      888  888      888     .8"888.      888  Y88bo.      
!   8 Y88. .P  888  888      888  888      888    .8' `888.     888   `"Y8888o.  
!   8  `888'   888  888      888  888      888   .88ooo8888.    888       `"Y88b 
!   8    Y     888  `88b    d88'  888     d88'  .8'     `888.   888  oo     .d8P 
!  o8o        o888o  `Y8bood8P'  o888bood8P'   o88o     o8888o o888o 8""88888P'  
!  */}

      {isModalArquivosOpen && (
        <div className="modal-container">
          <div className="modal-content">
            <h1 className="card-title">Arquivos para a expressão: {jsonValue}</h1>
            <hr/>
            <div>
              <TableResultArchiveNew2 data={archiveList} />
            </div>
            <hr/>

            {/*             <table className="tabela-arquivos">
              <thead>
                <tr>
                  <th><input type="checkbox" id="selectAll" onChange={() => handleSelectAllCheckbox()} /></th>
                  <th>Nome do Computador</th>
                  <th>Caminho</th>
                </tr>
                <tr>
                  <th></th>
                  <th>
                    <input
                      type="text"
                      value={filtro}
                      onChange={(e) => setFiltro(e.target.value)}
                      placeholder="Filtrar por nome do computador"
                    /></th>
                  <th></th>

                </tr>
              </thead>
              <tbody>

                {dadosExibidos.map((item) => (
                  <tr key={item.id_arquivo}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleCheckboxChange2(item.path)}
                        class="archiveSelect"
                      />
                    </td>
                    <td>{item.computer_name}</td>
                    <td>{item.path}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}

            <div className="modal-buttons">
              <button onClick={() => handleCloseModals()}>Fechar</button>
              {/*               <button onClick={() => handleAcaoClick()}>Ação</button>
              <div>
                <button onClick={retrocederPagina}>Anterior</button>
                <span>Página {paginaAtual} de {paginas}</span>
                <button onClick={avancarPagina}>Próxima</button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      {isModalAcoesOpen && (
        <div className="modal-container">
          <div className="modal-find-opcoes-tabela atualizar-pesquisa" style={{ width: "300px" }}>

            <div className="divider-modal" style={{ width: "250px" }}>
              <h1>Ações:</h1>
            </div>

            <div className="list-modal">
              <ul className="list-modal-item">

                <li onClick={() => setIsModalMoverOpen(true) > setIsModalAcoesOpen(false)}>Mover Arquivo</li>
                <li onClick={() => setIsModalCopiarOpen(true) > setIsModalAcoesOpen(false)}>Copiar Arquivo</li>
                <li onClick={() => setIsModalApagarArquivoOpen(true) > setIsModalAcoesOpen(false)}>Apagar Arquivo</li>
                <div className="divider-modal-simples"></div>
                <li onClick={() => setIsModalAnonimizarOpen(true) > setIsModalAcoesOpen(false)}>Anonimizar Expressão</li>
                <li onClick={() => setIsModalApagarExpressaoOpen(true) > setIsModalAcoesOpen(false)}>Apagar Expressão</li>
              </ul>
              <button className="button" onClick={() => setIsModalAcoesOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalMoverOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Mover Arquivo</h1>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Origem do Arquivo: </label>
              <p id="endereco-arquivo">{enderecoArquivo}</p>
            </div>
            <div>
              <label className="label-modal" htmlFor="select-maquina-destino">Selecione a máquina de destino</label>
              <select
                id="select-maquina-destino"
                onChange={(e) => handleMaquinaSelecionada(e.target.value)}
              >
                <option value="" disabled selected>Selecione uma máquina</option>
                {selecaoMaquina.map((option) => (
                  <option key={option.computer_name} value={option.maquina}>
                    {option.computer_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-modal" htmlFor="select-maquina-destino">Selecione a máquina de destino</label>
              <input
                type="text"
                id="input-endereco-destino"
                className="input-endereco-destino"
                onChange={(e) => handleChangeEnderecoDestino(e.target.value)}
                value={enderecoDestino}
                placeholder="Digite seu endereço"
              />
            </div>
            <div className="botoes-modal">
              <button className="button" onClick={() => moverArquivo()}>Mover</button>
              <button className="button" onClick={() => setIsModalMoverOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalCopiarOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Copiar Arquivo</h1>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Origem do Arquivo: </label>
              <p id="endereco-arquivo">{enderecoArquivo}</p>
            </div>
            <div>
              <label className="label-modal" htmlFor="select-maquina-destino">Selecione a máquina de destino</label>
              <select
                id="select-maquina-destino"
                onChange={(e) => handleMaquinaSelecionada(e.target.value)}
              >
                <option value="" disabled selected>Selecione uma máquina</option>
                {selecaoMaquina.map((option) => (
                  <option key={option.computer_name} value={option.maquina}>
                    {option.computer_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-modal" htmlFor="select-maquina-destino">Selecione a máquina de destino</label>
              <input
                type="text"
                id="input-endereco-destino"
                className="input-endereco-destino"
                onChange={(e) => handleChangeEnderecoDestino(e.target.value)}
                value={enderecoDestino}
                placeholder="Digite seu endereço"
              />
            </div>
            <div className="botoes-modal">
              <button className="button" onClick={() => copiarArquivo()}>Copiar</button>
              <button className="button" onClick={() => setIsModalCopiarOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalAnonimizarOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Anonimizar Expressão</h1>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Origem do Arquivo: </label>
              <p id="endereco-arquivo">{enderecoArquivo}</p>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Insira a expressão</label>
              <input
                type="text"
                id="input-endereco-destino"
                placeholder="Digite a expressão"
                onChange={(e) => handleChangeExpressao(e.target.value)}
                value={changeExpressao}
                className="input-endereco-destino"
              />
            </div>
            <div className="botoes-modal">
              <button className="button" onClick={() => anonimizarExpressao()}>Anonimizar</button>
              <button className="button" onClick={() => setIsModalAnonimizarOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalApagarExpressaoOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Apagar Expressão</h1>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Origem do Arquivo: </label>
              <p id="endereco-arquivo">{enderecoArquivo}</p>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Insira a expressão</label>
              <input
                type="text"
                id="input-endereco-destino"
                placeholder="Digite a expressão"
                onChange={(e) => handleChangeExpressao(e.target.value)}
                value={changeExpressao}
                className="input-endereco-destino"
              />
            </div>
            <div className="confirma-exclusao">
              <input type="checkbox" checked={aceitouTermos}
                onChange={handleCheckboxChange} /> Confirmo que desejo excluir esta expressão.
            </div>
            <div className="botoes-modal">
              <button className="button" onClick={() => handleConfirmaDeletarExpressao()}>Deletar</button>
              <button className="button" onClick={() => { setIsModalApagarExpressaoOpen(false); setAceitouTermos(false) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalApagarArquivoOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Apagar Arquivo</h1>
            </div>
            <div>
              <label className="label-modal" htmlFor="input-endereco-destino">Origem do Arquivo: </label>
              <p id="endereco-arquivo">{enderecoArquivo}</p>
            </div>
            <div className="confirma-exclusao">
              <input type="checkbox" checked={aceitouTermos}
                onChange={handleCheckboxChange} /> Confirmo que desejo excluir este arquivo.
            </div>
            <div className="botoes-modal">
              <button className="button" onClick={() => handleConfirmaDeletarArquivo()}>Deletar</button>
              <button className="button" onClick={() => { setIsModalApagarArquivoOpen(false); setAceitouTermos(false) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div >


  );
}

export default ResultArchive;



