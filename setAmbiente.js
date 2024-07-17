import fs from 'fs';
import inquirer from 'inquirer';

const arquivoPackageJSON = 'package.json';

function exibirOpcoes() {
  const opcoes = [
    'HOMOLOGACAO',
    //'HOMOLOGACAO2',
    'PRODUCAO',
    'PRODUCAO2',
    'POC',
    //'WEBINAR'
  ];

  const pergunta = [
    {
      type: 'list',
      name: 'opcaoSelecionada',
      message: 'Escolha um ambiente:',
      choices: opcoes
    }
  ];

  inquirer.prompt(pergunta).then(respostas => {
    console.log('Você selecionou:', respostas.opcaoSelecionada);
    setArquivoApi(respostas.opcaoSelecionada);
  });
}

function setArquivoApi(nomeAmbiente) {

  let url =  "";
  let porta = "";
  let ambiente = "";

  switch (nomeAmbiente) {

    case 'HOMOLOGACAO':
      url = "https://homologa.epsoft.com.br:8088";
      porta = "3009";
      ambiente = "HOMOLOGA";
    break;
    case 'HOMOLOGACAO2':
      url = "https://homologa.epsoft.com.br:8089";
      porta = "";
      ambiente = "HOMOLOGA2";
    break;
    case 'PRODUCAO':
      url = "https://dlp.epsoft.com.br:8015";
      porta = "3025";
      ambiente = "PROD";
    break;
    case 'PRODUCAO2':
      url = "https://dlp.epsoft.com.br:8011";
      porta = "3033";
      ambiente = "PROD2";
    break;
    case 'POC':
      url = "https://dlp.epsoft.com.br:8028";
      porta = "3016";
      ambiente = "POC";
    break;
    case 'WEBINAR':
      url = "https://dlp.epsoft.com.br:3026";
      porta = "";
      ambiente = "WEBINAR";
    break;
    default:
      alert('Ambiente inválido');
      break;
  }

  const nomeArquivo = `./src/app/services/api.js`;

  fs.readFile(nomeArquivo, 'utf8', (err, data) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    const linhaURL = data.split('\n').findIndex(line => line.includes('const URL'));
    const linhaAmbiente = data.split('\n').findIndex(line => line.includes('const ambiente'));

    if (linhaURL === -1) {
        console.error('Não foi encontrada a declaração da constante "URL" no arquivo.');
        return;
    }
    if (linhaAmbiente === -1) {
      console.error('Não foi encontrada a declaração da constante "ambiente" no arquivo.');
      return;
  }
    let novoConteudo = data.replace(/const URL = '.*?'/, `const URL = '${url}'`);
    novoConteudo = novoConteudo.replace(/const ambiente = '.*?'/, `const ambiente = '${ambiente}'`);

    fs.writeFile(nomeArquivo, novoConteudo, 'utf8', err => {
        if (err) {
            console.error('X Erro ao escrever no arquivo:', err);
            return;
        }
        console.log('> A URL do arquivo foi atualizada para:', url);
        editaArquivoJSON(porta)
    });
});
}

function editaArquivoJSON(porta) {

  fs.readFile(arquivoPackageJSON, 'utf8', (err, data) => {
    if (err) {
      console.error('Erro ao ler o arquivo:', err);
      return;
    }

    const json = JSON.parse(data);
    json.scripts.start = `set PORT=${porta} && PORT=${porta} react-scripts start || react-scripts start`;

    const novoConteudoJSON = JSON.stringify(json, null, 2);
    fs.writeFile(arquivoPackageJSON, novoConteudoJSON, 'utf8', (err) => {
      if (err) {
        console.error('Erro ao salvar o arquivo:', err);
        return;
      }
      console.log('Arquivo JSON atualizado com sucesso!');

    });
  });
};

exibirOpcoes();
