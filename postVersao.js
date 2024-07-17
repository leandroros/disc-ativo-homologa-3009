import fs from 'fs';
import path from 'path';
import moment from 'moment';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const pastaOrigem = process.cwd();
const pastaDestino = 'Y:\\Homologacao-8091-8088\\Discovery\\frontend-discovery-ativo';
const pastaOrigemBkp = pastaDestino;
const arquivoPackageJSON = 'package.json';
const caminhoData = 'D:\\src\\app\\services\\api.js';
const arquivosEPastasSelecionados = [
    'src',
    'public',
    'package.json',
    'package-lock.json',
    'README.md',
    'setAmbiente.js',
    'postVersao.js',
    'postVersao.bat',
];

async function confirmaAcao() {
    try {
        await solicitarConfirmacao();
        criaPastaBkp();
    } catch (erro) {
        console.error('Erro:', erro.message);
    } finally {
        rl.close();
    }
}

function solicitarConfirmacao() {
    return new Promise((resolve, reject) => {
        rl.question('Finalize o processo do REACT no servidor de homologação. Pressione Enter para confirmar', (resposta) => {
            if (resposta === '') {
                resolve();
            } else {
                reject(new Error('Usuário não confirmou a execução da função.'));
            }
        });
    });
}
function criaPastaBkp() {

    const dataHoraAtual = moment();
    const nomeDaPasta = pastaDestino + '\\' + dataHoraAtual.format('YYMMDD.HHmm');

    fs.mkdir(nomeDaPasta, (erro) => {
        if (erro) {
            console.error('Erro ao criar a pasta:', erro);
            return;
        }
        console.log('Pasta criada com sucesso!');
        bkpArquivos(nomeDaPasta)
            .then(() => {
                console.log('Todos os arquivos foram movidos com sucesso.');
                editarVersaoArquivo();
            })
            .catch(error => {
                console.error('Erro ao fazer backup de arquivos:', error);
            });
    });
}
function bkpArquivos(nomeDaPasta) {
    return new Promise((resolve, reject) => {
        const promises = [];

        arquivosEPastasSelecionados.forEach(item => {
            const origem = path.join(pastaOrigemBkp, item);
            const destino = path.join(nomeDaPasta, item);

            const promise = new Promise((resolve, reject) => {
                fs.rename(origem, destino, err => {
                    if (err) {
                        reject(`Erro ao mover ${item}: ${err}`);
                    } else {
                        console.log(`${item} movido com sucesso para ${pastaDestino}`);
                        resolve();
                    }
                });
            });

            promises.push(promise);
        });

        Promise.all(promises)
            .then(() => resolve())
            .catch(error => reject(error));
    });
}

function editarVersaoArquivo() {

    fs.readFile(caminhoData, 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }

        const linhaVersao = data.split('\n').findIndex(line => line.includes('const versao'));
        const linhaAmbiente = data.split('\n').findIndex(line => line.includes('const ambiente'));

        if (linhaVersao === -1) {
            console.error('Não foi encontrada a declaração da constante "versao" no arquivo.');
            return;
        }

        if (linhaAmbiente === -1) {
            l
            console.error('Não foi encontrada a declaração da constante "ambiente" no arquivo.');
            return;
        }

        const dataHoraAtual = moment().format('YYMMDD.HHmm');
        const ambientePost = 'HOMOLOGA'
        const URL = 'https://homologa.epsoft.com.br:8088'
        let novoConteudo = data.replace(/const versao = '.*?'/, `const versao = '${dataHoraAtual}'`);
        novoConteudo = novoConteudo.replace(/const ambiente = '.*?'/, `const ambiente = '${ambientePost}'`);
        novoConteudo = novoConteudo.replace(/const URL = '.*?'/, `const URL = '${URL}'`);


        fs.writeFile(caminhoData, novoConteudo, 'utf8', err => {
            if (err) {
                console.error('X Erro ao escrever no arquivo:', err);
                return;
            }
            console.log('> A versão no arquivo foi atualizada para:', dataHoraAtual);
            editaArquivoJSON('3009')
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
            postArquivos()
        });
    });
};

function postArquivos() {
    arquivosEPastasSelecionados.forEach(item => {
        const origem = path.join(pastaOrigem, item);
        const destino = path.join(pastaDestino, item);

        if (fs.statSync(origem).isDirectory()) {
            copiarPasta(origem, destino);
        } else {
            copiarArquivo(origem, destino);
        }
    });
}

function copiarArquivo(origem, destino) {
    fs.copyFile(origem, destino, err => {
        if (err) {
            console.error(`X Erro ao copiar o arquivo ${origem}:`, err);
            return;
        }
        console.log(`> Arquivo ${origem} copiado para ${destino}`);
    });
}

function copiarPasta(origem, destino) {
    if (!fs.existsSync(origem)) {
        console.error(`A pasta de origem ${origem} não existe.`);
        return;
    }

    if (!fs.existsSync(destino)) {
        fs.mkdirSync(destino);
    }

    const arquivos = fs.readdirSync(origem);

    arquivos.forEach(arquivo => {
        const caminhoOrigem = path.join(origem, arquivo);
        const caminhoDestino = path.join(destino, arquivo);

        if (fs.statSync(caminhoOrigem).isDirectory()) {
            copiarPasta(caminhoOrigem, caminhoDestino);
        } else {
            copiarArquivo(caminhoOrigem, caminhoDestino);
        }
    });
}

confirmaAcao();
