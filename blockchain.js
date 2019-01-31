const Block = require('./block');

class Blockchain{
    /**
     * Construtor do Blockchain  
     */
    constructor(){
        // array para armazenar os blocos
        // iniciado pelo bloco gênese
        this.chain = [Block.genesis()];
    }

    /**
     * Adiciona um novo Bloco no Blockchain
     * @param {string} data - qualquer tipo de dados no formato string
     * @returns {Block} new Block()
     */
    addBlock(data){
        // pega o último bloco
        const lastBlock = this.chain[this.chain.length -1];
        // cria o novo bloco
        const block = Block.mineBlock(lastBlock, data);
        // adiciona ao final do array
        this.chain.push(block);
        //
        return block;
    }

    /**
     * Valida uma cadeia de blocos
     * @param {array} chain - array de blocos
     * @returns {boolean} boolean - true = válida, false = inválida
     */
    isValidChain(chain){
        // verifica se o bloco gênese passado é válido
        if(Block.blockHash(chain[0]) !== Block.blockHash(Block.genesis())) {
            return false;
        }
        // loop para percorrer toda a chain passada verificando os blocos
        for(let i = 1; i < chain.length ; i++){
            // pega 2 blocos por iteração 
            // gênese e bloco 1, depois bloco 1 e 2, etc...
            const lastBlock = chain[i -1];
            const block = chain[i];
            // compara os hashes dos dois blocos,  
            // para ver se não foram adulterados
            if(block.lastHash !== lastBlock.hash){
                return false;
            }
            // Validação dos dados do bloco 
            // É gerado um novo hash a partir 
            // de todos os dados para ver se está 
            // igual ao hash que já foi validado acima
            if(block.hash !== Block.blockHash(block)){
                return false;
            }
        }
        return true;
    }

    /**
     * Substitui a chain, se for maior e válida
     * @param {array} newChain - array de blocos 
     */
    replaceChain(newChain){
        // Verifica se a cadeia recebida de outro client
        // é menor que a do client que está validando
        if(newChain.length <= this.chain.length){
            console.log('Received chain is not longer than the current chain!');
            // se for menor, aborta o replace
            return;
        // Verificar se a cadeia não é valida
        } else if(!this.isValidChain(newChain)){
            console.log('Received chain is not valid!');
            // se não for válida, aborta o replace
            return;
        // passando nas duas validações, faz o replace
        } else {
            console.log('Current chain, replaced!');
            // replace
            this.chain = newChain;
        }
    }
}
// exportando a classe
module.exports = Blockchain;