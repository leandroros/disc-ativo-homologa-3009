import React from "react";
import Routes from "./routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

/* FICA OBSERVANDO SEMPRE QUE A PAGINA E RECARREGADA */
// window.addEventListener('beforeunload', function(event) {
//     localStorage.removeItem('@FlashSafe-token');
//     localStorage.removeItem('@FlashSafe-token2');

// }, false);

export default function App() {
    return(
        <>
            <Routes />
            <ToastContainer />
        </>
    )
}
