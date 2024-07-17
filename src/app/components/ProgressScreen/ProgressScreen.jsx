import '../../../styles/style.scss'
import React from 'react';


function ProgressScreen() {
  return (
    <div className="card">
      <h1 className="card-title"> Varredura em andamento.</h1>
      <p className="card-subtitle"> Acompanhe o processo de varredura</p>
      <div className="divider">
        <div>
          <div>
            {/* teste */}
            <div className="progress">
              <div className="barOverflow">
                <div className="bar"></div>
              </div>
              <span className="progressValue">10%</span>
            </div>
          </div>
          <div className="content-result-job">
            <table className="table-result-job">
              <tr>
                <td className="tr-title">Arquivos Analisados</td>
                <td> 7.850 de 10.000</td>
              </tr>
              <tr>
                <td className="tr-title">Erros encontrados</td>
                <td>4 erros</td>
              </tr>
              <tr>
                <td className="tr-title">Tempo decorrido</td>
                <td > 02:14:30</td>
              </tr>
              <tr>
                <td className="tr-title">Tempo Estimado:</td>
                <td> 02:14:30</td>
              </tr>
              <tr>
                <td className="tr-title">Status</td>
                <td> Em andamento </td>
              </tr>
            </table>

            <div>
            </div>

          </div>

        </div>

      </div>
      <div className="menu-bottom-result">
        <button className="create-job-button"> PAUSAR VARREDURA</button>
        <button className="create-job-button-red"> CANCELAR VARREDURA</button>
      </div>

    </div>

  );
}

export default ProgressScreen;
