const { readFile, writeFile } = require('fs');
const { promisify } = require('util');

//convertendo uma function/callback para promise
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

//outra forma de obter dados do json
//const dadosJson = require('./herois.json')

class Database {
    constructor() {
        this.NOME_ARQUIVO = 'herois.json'
    }

    async obterDadosArquivos(){
        const arquivo = await readFileAsync(this.NOME_ARQUIVO, 'utf8')
        return JSON.parse(arquivo.toString());
    }

    async escreverArquivos(dados){
        await writeFileAsync(this.NOME_ARQUIVO, JSON.stringify(dados));
        //se houver algum erro, automaticamente retorna uma exception
        return true;
    }

    async cadastrar(heroi){
        //dados = lista
        const dados = await this.obterDadosArquivos();
        const id = heroi.id <= 2 ? heroi.id : Date.now();

         //com os ... ele vai juntar o id que foi gerado com o heroi que veio por param
         const heroiComId = { id, ...heroi };

         //nesse caso juntou o [] de dados com o objeto heroiComId dentro do array
         const dadosFinal = [ ...dados, heroiComId ];

         const resultado = await this.escreverArquivos(dadosFinal);

         return resultado; 

    }

    async listar(id){
        const dados = await this.obterDadosArquivos();
        const dadosFiltrados = dados.filter(item => (id ? (item.id === id) : true));
        return dadosFiltrados;
    }

    async remover(id){
        if(!id){
            //senão passar id, vai limpar toda a base e retornar true
            return await this.escreverArquivos([]);
        }

        const dados = await this.obterDadosArquivos();
        const indice = dados.findIndex(item => item.id === parseInt(id));
        if(indice === -1) {
            throw Error('O usuario informado não existe');
        }
        dados.splice(indice, 1); 
        return await this.escreverArquivos(dados);

    }

    async atualizar(id, modificacoes) {
        const dados = await this.obterDadosArquivos();
        const indice = dados.findIndex(item => item.id === parseInt(id));
        if(indice === -1){
            throw Error('O heroi informado não existe');
        }
        const atual = dados[indice];
        const objetoAtualizar = {...atual, ...modificacoes }
        dados.splice(indice, 1);

        return await this.escreverArquivos([
            ...dados, objetoAtualizar
        ])

        return false;
    }

}

module.exports = new Database();