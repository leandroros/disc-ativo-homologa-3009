import React, { Component, useEffect, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import "./style.scss";
import api from "../../services/api";
import { login, login2 } from "../../services/auth";
// import FlashSafeColor from '../../../assets/images/FlashSafeColor.png'
// import FlashSafeLogin from '../../../assets/images/FlashSafeLogin.svg'
import FlashSafeColor from "../../../assets/images/H - DATA DISCOVERY - LOGO - COLOR.png";
import FlashSafeLogin from "../../../assets/images/H - DATA DISCOVERY - LOGO.png";
import {
  LockIcon,
  UserLoginIcon,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
  WhatsappIcon,
} from "../../../assets/icons/index";
import { toast } from "react-toastify";


class SignIn extends Component {
  state = {
    username: "",
    password: "",
    error: "",
    loading: false,
  };

  handleSignIn = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;

    if (!username || !password) {
      this.setState({ error: "Preencha usuário e senha para continuar!" });
    } else {
      try {
        this.setState({ loading: true });
        const response = await api.post("/dpo/login/autentica/resp_rest", {
          usernameLogin: username,
          hash_senhaLogin: password,
        });
        const teste = await response.data;
        login(teste[0].keyAcesssSecret);

        /*
        const response2 = await api.post("/dpo/login/autentica/resp_rest", {
          usernameLogin: username,
          hash_senhaLogin: password,
        });
        const teste2 = await response2.data;
         console.log(teste2)
        login2(teste2[0].keyAcesssSecret);
        */

        //this.setState({ loading: false });
       // toast.success("Login efetuado com sucesso");
        this.props.history.push("/create-discover");
      } catch (err) {
        this.setState({ loading: false });
        this.setState({
          error: "Houve um problema com o login, verifique suas credenciais.",
        });
      }
    }
  };

  render() {
    let loader = this.state.loading ? (
      <div className="loader">
        <div className="spinner-border text-primary" style={{"width": "5rem", "height": "5rem"}} role="status"></div>
        <strong>Carregando...</strong>
      </div>
    ) : ""

    return (
      <div className="container-login">
        <div>{loader}</div>
        <div className="container-left-login">
          <img src={FlashSafeColor} className="logo-login" alt="Logo da Epsoft" />
          <h1 className="title-login "> Entrar </h1>
          <p className="subtitle-login">Entre com o usuário e senha fornecidos pelo suporte Epsoft.</p>

          <form onSubmit={this.handleSignIn} className="form-login">
            {this.state.error && (
              <p className="error-message">{this.state.error}</p>
            )}
            <div style={{ display: "inline-flex" }}>
              {" "}
              <UserLoginIcon />{" "}
              <input
                type="name"
                placeholder="E-mail"
                onChange={(e) => this.setState({ username: e.target.value })}
              />
            </div>
            <div style={{ display: "inline-flex" }}>
              {" "}
              <LockIcon />{" "}
              <input
                type="password"
                placeholder="Senha"
                onChange={(e) => this.setState({ password: e.target.value })}
              />
            </div>
            <button className="login-button" type="submit">
              Entrar
            </button>
          </form>
        </div>

        <div className="container-right-login">
          <div className="container-top-right">
            <div style={{ display: "flex", flexDirection: "row" }}>
             {/*  <a href="mailto:suporte@flashsafe.com.br?Subject=Suporte - FlashSafe" target="_blank"><EmailIcon /></a>*/}
              <a href="https://www.facebook.com/flashsafe.epsoft" target="_blank"><FacebookIcon /></a>
              <a href="https://www.linkedin.com/company/epsoft-privacy-security/mycompany/" target="_blank"><LinkedinIcon /></a>
              {/* <a href="https://google.com.br" target="_blank"><TwitterIcon /></a> */}
              <a href="https://api.whatsapp.com/send?phone=551155559914&text=Ol%C3%A1,%20tenho%20interesse%20nos%20Produtos%20Epsoft.%20Grato(a)." target="_blank"><WhatsappIcon /></a>
            </div>
          </div>
          <div className="container-logo">
            <img src={FlashSafeLogin} alt="Epsoft Logo"></img>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SignIn);