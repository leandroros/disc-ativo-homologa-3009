import "../../../styles/style.scss";
import {
  FlashSafe,
  ResultIcon,
  CreateJobIcon,
  PeopleIcon,
  UserIcon,
  ConfigIcon,
  Status,
  NotificationIcon,
  CreateDiscoverIcon,
  StatusIcon,
  AccompanyDiscovery,
} from "../../../assets/icons/index";
import { Link } from "react-router-dom";
import { SearchIcon } from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import MD5Icon from "../../../assets/icons/MD5Icon/MD5Icon";
import logo from '../../../assets/images/H - DLP - LOGO.png'
import { MdOutlineDocumentScanner  } from 'react-icons/md'
import React from 'react';


function MenuLeft() {
  return (
    <div className="mainMenu">
      <div className="div-logo-menu">
        <img src={logo} className="logo-login" alt="Logo Epsoft"></img>
        {/* <FlashSafe></FlashSafe> */}
      </div>

      <div style={{ marginTop: "30px" }}>
        <h1 className="title-menu"> Discovery</h1>
        <div className="list-menu">
          <Link to={`/create-discover`} style={{ textDecoration: "none" }}>
            <button
              alt="Criação do Job"
              className={`
                ${window.location.pathname === "/create-discover"
                  ? "button-menu-active"
                  : "button-menu"
                } 
              `}
            >
              <CreateDiscoverIcon /> Criar Descoberta
            </button>
          </Link>


          <Link to={`/create-job`} style={{ textDecoration: "none" }}>
            <button
              alt="Criação do Job"
              className={`
                ${window.location.pathname === "/create-job"
                  ? "button-menu-active"
                  : "button-menu"
                } 
              `}
            >
              <CreateJobIcon /> Criar Job
            </button>
          </Link>

          {/*
          <Link to={`/job-list`} style={{ textDecoration: 'none' }}>
            <button className={`
                ${window.location.pathname === '/job-list'
                ? 'button-menu-active'
                : 'button-menu'
              } 

              
              `}> <ResultIcon /> Gestão do Job </button>
          </Link>

          
           
          <Link to={{ pathname: '/result-archive', id: "QI0IGLV8LZPA" }} style={{ textDecoration: 'none' }}>
            <button className={`
                ${window.location.pathname === '/result-archive'
                ? 'button-menu-active'
                : 'button-menu'
              } 
              `}> <ResultIcon /> Resultados da Varredura</button>
          </Link> */}

          {/* <Link to={`/anonimizar-dados`} style={{ textDecoration: 'none' }}>
            <button className={`
                ${window.location.pathname === '/anonimizar-dados'
                ? 'button-menu-active'
                : 'button-menu'
              } 
              `}> <StatusIcon /> Anonimizar</button>
          </Link> */}
        </div>

        <h1 className="title-menu"> Resultados</h1>

        <div className="list-menu">
          <Link to={`/accompany-discovery`} style={{ textDecoration: "none" }}>
            <button
              className={`
                  ${window.location.pathname === "/accompany-discovery"
                  ? "button-menu-active"
                  : "button-menu"
                } 
                `}
            >
              {" "}
              <ResultIcon /> Status Geral{" "}
            </button>
          </Link>
        </div>

        <div className="list-menu">
          <Link to={`/status-machine`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${window.location.pathname === "/status-machine"
                  ? "button-menu-active"
                  : "button-menu"
                } 
              `}
            >
              {" "}
              <StatusIcon /> Status por Máquina
            </button>
          </Link>
        </div>
        {/* 
        <div className="list-menu">
          <Link to={`/result-archive`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${
                  window.location.pathname === "/result-archive"
                    ? "button-menu-active"
                    : "button-menu"
                } 
              `}
            >
              {" "}
              <MD5Icon /> Arquivos Analisados
            </button>
          </Link>
        </div> */}

        <div className="list-menu">
          <Link to={`/result-archive`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${window.location.pathname === "/result-archive"
                  ? "button-menu-active"
                  : "button-menu"
                } 
              `}
            >
              {" "}
              <MD5Icon />Arquivos Analisados
            </button>
          </Link>
        </div>

        
        <div className="list-menu">
          <Link to={`/log-archive`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${window.location.pathname === "/log-archive"
                  ? "button-menu-active"
                  : "button-menu"
                } 
              `}
            >
              {" "}
              <MdOutlineDocumentScanner  style={{ fontSize: "2em" }}/>Registro de Logs
            </button>
          </Link>
        </div>


        {/*
        <div className="list-menu">
          <Link to={`/md5`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${
                  window.location.pathname === "/md5"
                    ? "button-menu-active"
                    : "button-menu"
                } 
              `}
            >
              {" "}
              <MD5Icon /> Análise MD5
            </button>
              </Link>
        </div>
        */}

        <div className="list-menu">
          {/*<Link to={`/people`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${
                  window.location.pathname === "/people"
                    ? "button-menu-active"
                    : "button-menu"
                } 
              `}
            >
              {" "}
              <PeopleIcon />
              Pessoas{" "}
            </button>
              </Link>*/}

          {/*<Link to={`/status`} style={{ textDecoration: "none" }}>
            <button
              className={`
                ${
                  window.location.pathname === "/status"
                    ? "button-menu-active"
                    : "button-menu"
                } 
              `}
            >
              {" "}
              <StatusIcon /> Status geral
            </button>
          </Link>
          */}



        </div>



      </div>

      <h1 className="title-menu">Configurações</h1>
      <div className="list-menu" style={{ marginBottom: "10px" }}>
        {/*<button className="button-menu">
          {" "}
          <UserIcon /> Usuários
        </button>*/}
        {/*<button className="button-menu">
          {" "}
          <NotificationIcon /> Notificações{" "}
        </button>*/}


        <div className="list-menu">
          <Link to={`/settings`} style={{ textDecoration: "none" }}>
            <button
              className={`
                  ${window.location.pathname === "/settings"
                  ? "button-menu-active"
                  : "button-menu"
                } 
                `}
            >
              {" "}
              <ConfigIcon /> Máquinas{" "}
            </button>
          </Link>
        </div>


        <Link to={``} style={{ textDecoration: "none" }}>
          <button
            className={`
                ${window.location.pathname === "/exit"
                ? "button-menu-active"
                : "button-menu"
              } 
              `}
          >
            {" "}
            <ConfigIcon /> SAIR{" "}
          </button>
        </Link>

        {/*<Link to={`/accompany-discovery`} style={{ textDecoration: "none" }}>
          <button
            className={`
                ${
                  window.location.pathname === "/accompany-discovery"
                    ? "button-menu-active"
                    : "button-menu"
                } 
              `}
          >
            {" "}
            <ResultIcon /> accompany{" "}
          </button>
        </Link>*/}
      </div>
    </div>
  );
}

export default MenuLeft;
