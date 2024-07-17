import React, { useState } from "react";
import { useTable, useFilters, useGlobalFilter, useRowSelect, useSortBy, usePagination, } from "react-table";
import "./style.scss";
import api from "../../services/api";
import { toast } from "react-toastify"
import { matchSorter } from "match-sorter";
import { ArrowDropDown, ArrowDropUp } from "@material-ui/icons";
import { SearchIcon } from "../../../assets/icons/index.jsx";
import { InputAdornment, TextField } from "@material-ui/core";
import { FaAngleDoubleRight, FaAngleRight, FaAngleDoubleLeft, FaAngleLeft } from 'react-icons/fa'

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input
          className="checkbox-table"
          type="checkbox"
          ref={resolvedRef}
          {...rest}
        />
      </div>
    );
  }
);

function TableResultArchiveNew2({ data }) {

  let acessToken = localStorage.getItem("@FlashSafe-token");

  const [changeExpressao, setChangeExpressao] = useState('');
  const [enderecoArquivo, setEnderecoArquivo] = useState('');
  const [enderecoDestino, setEnderecoDestino] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [idArquivo, setIdArquivo] = useState('');
  const [selecaoMaquina, setSelecaoMaquina] = useState();
  const [maquinaSelecionada, setMaquinaSelecionada] = useState('');
  const [jsonKey, setJsonKey] = useState('');




  //CONTROLADORES DE MODAL
  const [isModalArquivosOpen, setIsModalArquivosOpen] = useState(false);
  const [isModalAcoesOpen, setIsModalAcoesOpen] = useState(false);
  const [isModalMoverOpen, setIsModalMoverOpen] = useState(false);
  const [isModalCopiarOpen, setIsModalCopiarOpen] = useState(false);
  const [isModalAnonimizarOpen, setIsModalAnonimizarOpen] = useState(false);
  const [isModalPseudoAnonimizarOpen, setIsModalPseudoAnonimizarOpen] = useState(false);
  const [isModalReverterPseudoAnonimizarOpen, setIsModalReverterPseudoAnonimizarOpen] = useState(false);
  const [isModalApagarExpressaoOpen, setIsModalApagarExpressaoOpen] = useState(false);
  const [isModalApagarArquivoOpen, setIsModalApagarArquivoOpen] = useState(false);


  const columns = React.useMemo(
    () => [

      {
        Header: "Máquina",
        accessor: "computer_name",
      },
      {
        Header: "Caminho",
        accessor: "path",
      }
    ],
    []
  );

  function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [(row) => row?.[id]] });
  }

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
    useGlobalFilter, // useGlobalFilter!
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
                {...row.getToggleRowSelectedProps()}

              />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length;

    return (
      <>
        {/* INPUTS DE PESQUISA DA COLUNA */}
        <TextField
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

  /* !  
!  oooooooooooo ooooo     ooo ooooo      ooo   .oooooo.     .oooooo.   oooooooooooo  .oooooo..o 
!  `888'     `8 `888'     `8' `888b.     `8'  d8P'  `Y8b   d8P'  `Y8b  `888'     `8 d8P'    `Y8 
!   888          888       8   8 `88b.    8  888          888      888  888         Y88bo.      
!   888oooo8     888       8   8   `88b.  8  888          888      888  888oooo8     `"Y8888o.  
!   888    "     888       8   8     `88b.8  888          888      888  888    "         `"Y88b 
!   888          `88.    .8'   8       `888  `88b    ooo  `88b    d88'  888       o oo     .d8P 
!  o888o           `YbodP'    o8o        `8   `Y8bood8P'   `Y8bood8P'  o888ooooood8 8""88888P'  
!   */

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

        if (response.data == "]" || response.data == "") {
          alert("não foi possível carregar os dados")
        } else {

          let maquinaList = response.data
          let maquinaListIndex = maquinaList.indexOf('{');

          maquinaList = maquinaList.substring(maquinaListIndex);
          maquinaList = '[' + maquinaList
          maquinaList = JSON.parse(maquinaList)

          //setArrayMaquinas(maquinaList);
          setSelecaoMaquina(maquinaList);
        }

      })
      .catch((err) => {
      });
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////

  const handleChangeExpressao = (event) => {
    setChangeExpressao(event);
  };

  const handleCheckboxChange = () => {
    setAceitouTermos(!aceitouTermos);
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

  const handleConfirmaDeletarArquivo = () => {
    if (aceitouTermos) {
      deletarArquivo();
      setAceitouTermos(false)
    } else {
      alert('Por favor, confirme a intenção de excluir o arquivo.');
      setAceitouTermos(false)
    }
  }

  const handleMaquinaSelecionada = (event) => {
    setMaquinaSelecionada(event)
  };

  const handleChangeEnderecoDestino = (event) => {
    setEnderecoDestino(event);
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////

  const handleAcao = () => {
    findAllMaquinas()
    setIsModalAcoesOpen(true)
  };

  const anonimizarExpressao = () => {

    let newId = [];
    let newPath = [];

    selectedFlatRows.forEach(element => {
      newId.push(element.original.id_arquivo);
      newPath.push(element.original.path);
    });

    const headers = {
      id_arquivos_sep_virgula: newId.toString(),
      string_busca: changeExpressao,
      acao: "2",
    };

    console.log("HEADERS", headers);


    api
      .post(`/discovery/multiAcaoArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {
        console.log(`A expressão foi anonimizada com sucesso`);

        toast.success("A expressão foi anonimizada", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      })
      .catch((err) => {
        console.log(`A expressão não foi anonimizada`);
        console.log(err);

        if (err.response.data.includes(".doc" || ".ppt" || ".xls")) {
          toast.error(
            "Não é possível realizar ações em arquivos de extensões antigas como .doc, .xls ou .ppt. Neste caso realize a operação de forma manual no arquivo.",
            {
              position: "top-right",
              autoClose: 4000,
              autoDismiss: true,
              hideProgressBar: false,
              pauseOnHover: true,
            });
        } else if (err.response.data.includes(".pptx")) {
          toast.error(
            "Erro de incompatibilidade com a extensão, Por favor, realize o procedimento manualmente no arquivo.",
            {
              position: "top-right",
              autoClose: 4000,
              autoDismiss: true,
              hideProgressBar: false,
              pauseOnHover: true,
            });
        } else {
          toast.error("A expressão não foi anonimizada, tente novamente.", {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        }
      });

  };

  const pseudoAnonimizarExpressao = () => {

    let newId = [];
    let newPath = [];

    selectedFlatRows.forEach(element => {
      newId.push(element.original.id_arquivo);
      newPath.push(element.original.path);
    });

    const headers = {
      id_arquivos_sep_virgula: newId.toString(),
      string_busca: changeExpressao,
      acao: "3",
    };

    console.log("HEADERS", headers);


    api
      .post(`/discovery/multiAcaoArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`A expressão foi pseudo-anonimizada com sucesso`);

        toast.success("A expressão foi pseudo-anonimizada", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

      })
      .catch((err) => {
        console.log(`A expressão não foi pseudo-anonimizada`);
        console.log(err);

        if (err.response.data.includes(".doc" || ".ppt" || ".xls")) {
          toast.error(
            "Não é possível realizar ações em arquivos de extensões antigas como .doc, .xls ou .ppt. Neste caso realize a operação de forma manual no arquivo.",
            {
              position: "top-right",
              autoClose: 4000,
              autoDismiss: true,
              hideProgressBar: false,
              pauseOnHover: true,
            });
        } else if (err.response.data.includes(".pptx")) {
          toast.error(
            "Erro de incompatibilidade com a extensão, Por favor, realize o procedimento manualmente no arquivo.",
            {
              position: "top-right",
              autoClose: 4000,
              autoDismiss: true,
              hideProgressBar: false,
              pauseOnHover: true,
            });
        } else {

          toast.error("A expressão não foi pseudo-anonimizada, tente novamente.", {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        }
      });

  };

  const reverterPseudoAnonimizarExpressao = () => {

    let newId = [];
    let newPath = [];

    selectedFlatRows.forEach(element => {
      newId.push(element.original.id_arquivo);
      newPath.push(element.original.path);
    });

    const headers = {
      id_arquivos_sep_virgula: newId.toString(),
      string_busca: changeExpressao,
      acao: "4",
    };

    console.log("HEADERS", headers);


    api
      .post(`/discovery/multiAcaoArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`A expressão anonimizada foi revertida com sucesso`);

        toast.success("A expressão anonimizada foi revertida", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

      })
      .catch((err) => {
        console.log(`A expressão não foi revertida.`);
        console.log(err);

        if (err.response.data.includes(".doc" || ".ppt" || ".xls")) {
          toast.error(
            "Não é possível realizar ações em arquivos de extensões antigas como .doc, .xls ou .ppt. Neste caso realize a operação de forma manual no arquivo.",
            {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        } else if (err.response.data.includes(".pptx")) {
          toast.error(
            "Erro de incompatibilidade com a extensão, Por favor, realize o procedimento manualmente no arquivo.",
            {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        } else {

        toast.error("A expressão não foi revertida, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      }
      });



  };

  const deletarExpressao = () => {

    let newId = [];
    let newPath = [];

    selectedFlatRows.forEach(element => {
      newId.push(element.original.id_arquivo);
      newPath.push(element.original.path);
    });

    const headers = {
      id_arquivos_sep_virgula: newId.toString(),
      string_busca: changeExpressao,
      acao: "1",
    };

    console.log("HEADERS", headers);


    api
      .post(`/discovery/multiAcaoArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`A expressão foi deletada com sucesso`);

        toast.success("A expressão foi deletada", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

      })
      .catch((err) => {
        console.log(`A expressão não foi deletada`);
        console.log(err);

        if (err.response.data.includes(".doc" || ".ppt" || ".xls")) {
          toast.error(
            "Não é possível realizar ações em arquivos de extensões antigas como .doc, .xls ou .ppt. Neste caso realize a operação de forma manual no arquivo.",
            {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        } else if (err.response.data.includes(".pptx")) {
          toast.error(
            "Erro de incompatibilidade com a extensão, Por favor, realize o procedimento manualmente no arquivo.",
            {
            position: "top-right",
            autoClose: 4000,
            autoDismiss: true,
            hideProgressBar: false,
            pauseOnHover: true,
          });
        } else {

        toast.error("A expressão não foi deletada, tente novamente.", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });
      }
      });



  };

  const moverArquivo = () => {

    let newIds = [];

    selectedFlatRows.forEach(element => {
      newIds.push(element.original.id_arquivo);
    });

    const headers = {
      id_arquivos_sep_virgula: newIds.toString(),
      maq_destino: maquinaSelecionada,
      string_pasta: enderecoDestino,
      acao: "mov"
    };

    console.log("HEADERS", headers);

    api
      .post(`/discovery/multiCopiaArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`O arquivo foi movido com sucesso`);

        toast.success("O arquivo foi movido", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        window.location.reload()

        //setIsModalMoverOpen(false);
        //getArchiveList(jsonKey);
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
        // setIsModalMoverOpen(false);


      });
  };

  const copiarArquivo = () => {

    let newIds = [];

    selectedFlatRows.forEach(element => {
      newIds.push(element.original.id_arquivo);
    });

    const headers = {
      id_arquivos_sep_virgula: newIds.toString(),
      maq_destino: maquinaSelecionada,
      string_pasta: enderecoDestino,
      acao: "cop"
    };

    console.log("HEADERS", headers);

    api
      .post(`/discovery/multiCopiaArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`O arquivo foi copiado com sucesso`);

        toast.success("O arquivo foi copiado", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        window.location.reload()

        setIsModalCopiarOpen(false)
        //getArchiveList(jsonKey);
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


    let newIds = [];

    selectedFlatRows.forEach(element => {
      newIds.push(element.original.id_arquivo);
    });

    const headers = {
      id_arquivos_sep_virgula: newIds.toString(),
      maq_destino: maquinaSelecionada,
      string_pasta: enderecoDestino,
      acao: "del"
    };

    console.log("HEADERS", headers);

    api
      .post(`/discovery/multiCopiaArquivos/${acessToken}/resp_rest`, headers)
      .then((resp) => {

        console.log(`O arquivo foi deletado com sucesso`);

        toast.success("O arquivo foi deletado", {
          position: "top-right",
          autoClose: 4000,
          autoDismiss: true,
          hideProgressBar: false,
          pauseOnHover: true,
        });

        window.location.reload()

        setIsModalApagarArquivoOpen(false)
        //getArchiveList(jsonKey);
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
    <>

      <div className="container-result-archive">
        <table className="table-result-archive" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>

                {headerGroup.headers.map((column) => (
                  <>

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

      <div className="pagination">

        <div>
          <button onClick={handleAcao} className="button-action">
            Ação
          </button>
        </div>

        <div>
          <button className="botao-paginacao" onClick={() => gotoPage(0)} disabled={!canPreviousPage} >
            <FaAngleDoubleLeft />
          </button>{' '}
          <button className="botao-paginacao" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <FaAngleLeft />
          </button>{' '}
          <span style={{ fontSize: "16px" }}>
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>{' '}
          </span>
          <button className="botao-paginacao" onClick={() => nextPage()} disabled={!canNextPage}>
            <FaAngleRight />
          </button>{' '}
          <button className="botao-paginacao" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            <FaAngleDoubleRight />
          </button>{' '}
          <span style={{ fontSize: "16px" }}>
            | Ir para página:{' '}
            <input
              className="input-paginacao"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: "60px", height: "30px" }}
            />
          </span>{' '}
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


      {isModalAcoesOpen && (
        <div className="modal-container">
          <div className="modal-find-opcoes-tabela atualizar-pesquisa" style={{ width: "350px" }}>

            <div className="divider-modal" style={{ width: "300px" }}>
              <h1>Ações:</h1>
            </div>
            <div className="list-modal">
              <ul className="list-modal-item">

                <li onClick={() => setIsModalMoverOpen(true) > setIsModalAcoesOpen(false)}>Mover Arquivo</li>
                <li onClick={() => setIsModalCopiarOpen(true) > setIsModalAcoesOpen(false)}>Copiar Arquivo</li>
                <li onClick={() => setIsModalApagarArquivoOpen(true) > setIsModalAcoesOpen(false)}>Apagar Arquivo</li>
                <div className="divider-modal-simples"></div>
                <li onClick={() => setIsModalPseudoAnonimizarOpen(true) > setIsModalAcoesOpen(false)}>Pseudo-Anonimizar Expressão</li>
                <li onClick={() => setIsModalReverterPseudoAnonimizarOpen(true) > setIsModalAcoesOpen(false)}>Reverter Pseudo-Anonimizar</li>
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
              <label className="label-modal" htmlFor="select-maquina-destino">Endereço da pasta de destino</label>
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
              <button className="button" onClick={() => moverArquivo() > setIsModalMoverOpen(false)}>Mover</button>
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
              <label className="label-modal" htmlFor="select-maquina-destino">Endereço da pasta de destino</label>
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
              <button className="button" onClick={() => copiarArquivo() > setIsModalCopiarOpen(false)}>Copiar</button>
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
              <button className="button" onClick={() => anonimizarExpressao() > setIsModalAnonimizarOpen(false)}>Anonimizar</button>
              <button className="button" onClick={() => setIsModalAnonimizarOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalPseudoAnonimizarOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Pseudo-Anonimizar Expressão</h1>
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
              <button className="button" onClick={() => pseudoAnonimizarExpressao() > setIsModalPseudoAnonimizarOpen(false)}>Pseudo-Anonimizar</button>
              <button className="button" onClick={() => setIsModalPseudoAnonimizarOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {isModalReverterPseudoAnonimizarOpen && (
        <div className="modal-container">

          <div className="modal-find-opcoes-tabela atualizar-pesquisa">
            <div className="divider-modal">
              <h1>Reverter Pseudo-Anonimizar</h1>
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
              <button className="button" onClick={() => reverterPseudoAnonimizarExpressao() > setIsModalReverterPseudoAnonimizarOpen(false)}>Reverter</button>
              <button className="button" onClick={() => setIsModalReverterPseudoAnonimizarOpen(false)}>Cancelar</button>
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
              <button className="button" onClick={() => handleConfirmaDeletarExpressao() > setIsModalApagarExpressaoOpen(false)}>Deletar</button>
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
            <div className="confirma-exclusao">
              <input type="checkbox" checked={aceitouTermos}
                onChange={handleCheckboxChange} /> Confirmo que desejo excluir este arquivo.
            </div>
            <div className="botoes-modal">
              <button className="button" onClick={() => handleConfirmaDeletarArquivo() > setIsModalApagarArquivoOpen(false)}>Deletar</button>
              <button className="button" onClick={() => { setIsModalApagarArquivoOpen(false); setAceitouTermos(false) }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TableResultArchiveNew2;


