import "./style.css";
import React, { useState, useEffect } from "react";
import { MenuLeft } from "../../components";
import api from "../../services/api";
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md'

function LogArchive() {
  let acessToken = localStorage.getItem("@FlashSafe-token");

  const [discoveryLogList, setDiscoveryLogList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [filteredLogList, setFilteredLogList] = useState(discoveryLogList);
  const [currentItems2, setCurrentItems2] = useState([]);


  useEffect(() => {
    getLogList()
  }, []);

  useEffect(() => {
    const filteredList = discoveryLogList.filter(item =>
      Object.values(item).some(value =>
        typeof value === 'string' &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredLogList(filteredList);
    setCurrentPage(1);
  }, [discoveryLogList, searchTerm]);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const items = filteredLogList.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentItems2(items);
  }, [currentPage, filteredLogList, itemsPerPage]);


  /* !  
  !  oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.     .oooooo.   oooooooooooo  .oooooo..o 
  !  `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b   d8P'  `Y8b  `888'     `8 d8P'    `Y8 
  !   888          888       8   8 `88b.    8  888          888      888  888         Y88bo.      
  !   888oooo8     888       8   8   `88b.  8  888          888      888  888oooo8     `"Y8888o.  
  !   888    "     888       8   8     `88b.8  888          888      888  888    "         `"Y88b 
  !   888          `88.    .8'   8       `888  `88b    ooo  `88b    d88'  888       o oo     .d8P 
  !  o888o           `YbodP'    o8o        `8   `Y8bood8P'   `Y8bood8P'  o888ooooood8 8""88888P'  
  !   */

  const getLogList = () => {
    let payload = {
      tabela: "mapda_logs",
      select: `grupo_dlp like '${Buffer.from(localStorage.getItem("@FlashSafe-token"), "base64")
        .toString()
        .split("^")[1]
        .replace("*", "")
        }%'`,
      pagina: "1",
      qt: "1000",
      campos_select_end_point: "id^log^grupo_dlp^computer_name^hora",
      get_qt: "1",
    };

    api
      .post("/sql/selectSql/" + acessToken + "/resp_rest", payload)
      .then((response) => {

        let logList = response.data
        let logListIndex = logList.indexOf('{');

        logList = logList.substring(logListIndex);
        logList = '[' + logList
        logList = JSON.parse(logList)
        console.log(logList)
        setDiscoveryLogList(logList);

      })
      .catch((err) => {
        console.log("Não foi possível carregar a lista" , err)
      });
  };

  const handlePageChange = (e) => {
    const page = parseInt(e.target.value);
    if (!isNaN(page) && page > 0 && page <= Math.ceil(filteredLogList.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogList.slice(indexOfFirstItem, indexOfLastItem);

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
        <h1 className="card-title">Registro de Log</h1>
        <div className="divider-pagina-arquivos"></div>
        <div className="tabela-expressoes">
          <div className="header-action">
            <div className="t2">
              <label for="Pesquisar">Pesquisa</label>
              <input
                type="text"
                label="Pesquisar"
                id="Pesquisar"
                variant="outlined"
                value={searchTerm}
                placeholder="Digite um trecho do nome do arquivo ou da máquina"
                style={{ fontsize: "10px !important" }}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="tabela-arquivos">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Grupo DLP</th>
                  <th>Nome da Máquina</th>
                  <th>Log</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.grupo_dlp}</td>
                    <td>{row.computer_name}</td>
                    <td>{row.log}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="paginacao">
              <div>
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}><MdArrowBackIos size={18} /></button>
                &nbsp;
                <input
                  type="number"
                  min="1"
                  max={Math.ceil(filteredLogList.length / itemsPerPage)}
                  value={currentPage}
                  onChange={handlePageChange}
                  style={{ minWidth: '2vw', width: "auto", border: "none", backgroundColor: "#eee" }}
                />
                de {Math.ceil(filteredLogList.length / itemsPerPage)}
                &nbsp;
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredLogList.length / itemsPerPage)}><MdArrowForwardIos size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default LogArchive;
