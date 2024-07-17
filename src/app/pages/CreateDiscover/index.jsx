import "../../../styles/style.scss";
import React, { useState, useEffect } from "react";
import { MenuLeft, TableCreateJob } from "../../components";
import { BackIcon, ToolTipIcon } from "../../../assets/icons/index.jsx";
import api from "../../services/api";
import "./style.scss";
import ReactLoading from "react-loading";
import { Tooltip, IconButton } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import Switch from "react-switch";
import { CgClose } from "react-icons/cg";
import CreateJob from '../CreateJob/index'
import { useHistory, Link} from "react-router-dom";



function CreateDiscovery() {
  const [openModalGroup, setOpenModalGroup] = useState (false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [extensionSelected, setExtensionSelected] = useState([]);
  const [machinesResult, setMachinesResult] = useState([]);
  const [jobNome, setJobNome] = useState([]); // INPUT NOME
  const [jobDescription, setJobDescription] = useState([]); // INPUT DESCRICAO
  const [jobResponsavel, setJobResponsavel] = useState([]); // INPUT RESPONSAVEL
  const [searchList, setSearchList] = useState([
    {
      //id: 0,
      pesquisa: "",
      tipo: "",
    },
  ]);

  let history = useHistory();

  const [switchNome, setSwitchNome] = useState(false); // BOTAO SWITCH NOME
  const [switchResponsavel, setSwitchResponsavel] = useState(false); // BOTAO SWITCH RESPONSAVEL

  const [setModalActions] = useState(false);
  const [array, setArray] = useState(
    searchList.map((item, i) => (
      <div>
        <label>Pesquisa {i + 1} </label>
        {/* {console.log(`Posicao ${i}: `)} */}
        <input
          className="input-reason-pesquisa"
          type="text"
          key={i + 1}
          onChange={(e) => handleFormInput(i, e.target.value)}
        ></input>
        {/*<Switch
          onChange={(e) => handleSwitch(e, i)}
          checked={searchList[i].tipo}
        />*/}
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

  let arrayExtensionSelected = [];
  let arrayGroupSelected = [];


  //FUNÇÃO OPEN MODAL
  function handleOpenModalGroup(event) {
    setOpenModalGroup(!openModalGroup)
  }

  function handleDelete(i) {
    let array = searchList; // make a separate copy of the array

    delete array[i];

    let aux = array.filter(function (el) {
      return el != null;
    });

    // console.log(aux);

    setSearchList(aux);

    InputForm();
  }

  function handleAddSearch() {
    let array = searchList;

    if (searchList.length < 10) {
      array.push({
        //id: searchList.length,
        pesquisa: "",
        tipo: false,
      });

      setSearchList(array);

      InputForm();
    }
  }

  /* === OBSERVADOR SWITCH NOME === */
  function handleSwitchNome(event) {
    setSwitchNome(event);
  }

  /* === OBSERVADOR SWITCH RESPONSAVEL === */
  function handleSwitchResponsavel(event) {
    setSwitchResponsavel(event);
  }

  /* === CAPTURA O VALOR DO INPUT === */
  function handleFormInput(index, event) {
    let array = searchList;

    array[index].pesquisa = event;

    setSearchList(array);

   // console.log(searchList);
  }

  function handleJobNome(event) {
    setJobNome(event);
  }

  function handleJobDescription(event) {
    setJobDescription(event);
  }

  function handleJobResponsavel(event) {
    setJobResponsavel(event);
  }

  function handleSwitch(event, index) {
    let array = searchList;
    // console.log(array[index].tipo, "é isso");
    array[index].tipo = !array[index].tipo;
    // console.log(array[index].tipo, "virou isso");

    setSearchList(array);
    InputForm();
    // console.log(searchList);
  }

  function InputForm() {
    for (let i = 0; i < searchList.length; i++) {
      setArray(
        searchList.map((item, i) => (
          <div>
            <label> Pesquisa {i + 1} </label>
            {/* {console.log(`Posicao ${i}: `)} */}
            <input
              className="input-reason-pesquisa"
              type="text"
              key={i + 1}
              onChange={(e) => handleFormInput(i, e.target.value)}
            ></input>
            {/*<Switch
              onChange={(e) => handleSwitch(e, i)}
              checked={searchList[i].tipo}
            />*/}
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
  /* === REALIZA PESQUISA DO DISCOVERY ATIVO === */
  function realizarPesquisa() {
    let acessToken = localStorage.getItem("@FlashSafe-token");

    const arrayPesquisa = searchList;

    const obj = {
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
    };
    
    for(let i = 0; i < arrayPesquisa.length; i++) {
      if(arrayPesquisa[i].pesquisa !== null) {
        switch((i + 1)) {
          case 1:
            obj.posisao1 = arrayPesquisa[i].pesquisa;
          break;
          case 2:
            obj.posisao2 = arrayPesquisa[i].pesquisa;
          break;
          case 3:
            obj.posisao3 = arrayPesquisa[i].pesquisa;
          break;
          case 4:
            obj.posisao4 = arrayPesquisa[i].pesquisa;
          break;
          case 5:
            obj.posisao5 = arrayPesquisa[i].pesquisa;
          break;
          case 6:
            obj.posisao6 = arrayPesquisa[i].pesquisa;
          break;
          case 7:
            obj.posisao7 = arrayPesquisa[i].pesquisa;
          break;
          case 8:
            obj.posisao8 = arrayPesquisa[i].pesquisa;
          break;
          case 9:
            obj.posisao9 = arrayPesquisa[i].pesquisa;
          break;
          case 10:
            obj.posisao10 = arrayPesquisa[i].pesquisa;
          break;
        }
      }
    }

    const objeto = {
      nome: jobNome,
      descricao: jobDescription,
      responsavel: Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64").toString().split('-')[0],
      exp_1: obj.posisao1,
      exp_2: obj.posisao2,
      exp_3: obj.posisao3,
      exp_4: obj.posisao4,
      exp_5: obj.posisao5,
      exp_6: obj.posisao6,
      exp_7: obj.posisao7,
      exp_8: obj.posisao8,
      exp_9: obj.posisao9,
      exp_10: obj.posisao10,
      fonet: 1,
    };


  	//CRIAR DISCOVERY
    api.post("/discovery/criaDiscoveryAtivo/" + acessToken + "/resp_rest", objeto)
      .then((response) => {

	   //console.log('Discovery criado')
     //console.log(response)


      {/*
      toast.success('Discovery criado', {
        position: "top-right",
        autoClose: 2000,
        autoDismiss: true,
        hideProgressBar: false,
        pauseOnHover: true,
      });
    */}

      setOpenModalGroup(true)

      history.push({pathname:'', customNameData: true});
    })
    .catch((err) => 
      console.error("ops! ocorreu um erro" + err)
    )
  }

  function ShowTable(props) {
    if (machinesResult === "empty") {
      return (
        <div>
          {" "}
          <h1>
            {" "}
            Ops. Não existe nenhuma máquina listada no(s) grupo(s)
            selecionado(s)
          </h1>{" "}
        </div>
      );
    } else if (machinesResult?.length < 1) {
      // return <div><h1> Não há dados a serem exibidos</h1></div>;
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "150px",
          }}
        >
          {" "}
          <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
        </div>
      );
    } else
      return (
        <TableCreateJob
          data={machinesResult}
          extensions={extensionSelected}
          jobDescription={jobDescription}
          style={{ height: "200px" }}
        />
      );
  }

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <ToastContainer />

      <MenuLeft />

      {openModalGroup ? (
          <div className="modal-createjob">
              <div className="divider-modal" >     
                        <h1 className="card-title">Discovery</h1>      
              </div>
              <div style={{ display: 'flex', width: '400px', flexWrap: 'wrap', height: '200px', paddingLeft: '24px', justifyContent: 'center'}}> 
                <p style={{fontSize: 17, marginTop: '30px'}}>Descoberta criada com sucesso.</p>
                <div className="button-format-center">
                <Link to={"/create-job"}> <button className="button-list-local" type="button" onClick={() => setOpenModalGroup(false)} >Ir para JOB</button></Link>
                <button className="button-list-local" type="button" onClick={() => setOpenModalGroup(false)} >Fechar</button>
                </div>
            </div>
          </div>
        ) : null}

      <div className="main-content">
        <div className="card">
          <h1 className="card-title">Criar Nova Descoberta</h1>
          <p className="card-subtitle">Preencha todos os campos para criar uma Descoberta</p>
          <div className="divider">
            {isChecked ? (
              <button type="button" className="back-button" onClick={() => setIsChecked(false)} >
                <BackIcon /> Editar configurações{" "}
              </button>
            ) : null}
          </div>

          {isChecked ? (
              <div>
                {isLoading ? (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "150px"}}>
                    <ReactLoading type="spin" color="#055c9d" height={200} width={200} />
                  </div>
                ) : (
                  <ShowTable></ShowTable>
                )}
              </div>
          ) : (
            <form className="form-create-job content-scroll">
              
              <div className="name-discovery">
                <label>Nome</label>
                <input className="input-reason-local" onChange={(e) => handleJobNome(e.target.value)}/>
              </div>

              <div className="description-discovery">
                <label>Descrição</label>
                <textarea className="input-description-create-local" onChange={(e) => handleJobDescription(e.target.value)} rows={5} cols={5}/>
              </div>

              {/*
              <label> Responsável </label>
              <input className="input-reason" value={Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64").toString().split('-')[0]} onChange={(e) => handleJobResponsavel(e.target.value)} disabled/>
              */}




              {/*<CreateJob />*/}



              {array}

              <div className="button-format-local">
                <button className="button-list-local" type="button" onClick={() => handleAddSearch()}>Adicionar Pesquisa</button>
                <button className="button-create-local" type="button" onClick={() => realizarPesquisa()}>Criar Descoberta</button>
              </div>

            </form>

          )}

              
        </div>
      </div>
    </div>
  );
}

export default CreateDiscovery;
