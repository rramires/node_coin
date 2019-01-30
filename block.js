const SHA256 = require('crypto-js/sha256');
//
class Block{
    /**
     * Construtor do Bloco  
     * @param {string} timestamp - Timestamp em milisegundos
     * @param {string} lastHash -  Último Hash/Hash do bloco anterior
     * @param {string} hash - Hash desse bloco (ID)
     * @param {string} data - Qualquer tipo de dados
     */
    constructor(timestamp, lastHash, hash, data){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    /**
     * Retorna os valores das propriedades
     * @returns {string} valores no formato string
     */
    toString(){
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substr(0, 10)}
        Hash      : ${this.hash.substr(0, 10)}
        Data      : ${this.data}`;
    }

    /**
     * Cria e retorna o bloco gênese
     * @returns {Block} new Block()
     */
    static genesis(){
        // Aleatório '0bf30...', poderia ser qualquer coisa hexadecimal
        // retorna o novo bloco
        return new this('Genesis Time', '-----', '0bf30e9455d84a8c31b1', [])
    }

    /**
     * Cria e retorna um novo bloco, linkado ao anterior
     * @returns {Block} new Block()
     */
    static mineBlock(lastBlock, data){
        // pega o timestamp
        const timestamp = Date.now().toString();
        // pega o hash do bloco anterior
        const lastHash = lastBlock.hash;
        // pega o hash atual
        const hash = Block.hash(timestamp, lastHash, data);
        // retorna o novo bloco
        return new this(timestamp, lastHash, hash, data)
    }

    /**
     * Gera um hash
     * @param {string} timestamp 
     * @param {string} lastHash 
     * @param {string} data 
     * @returns {string} hash no formato string 
     */
    static hash(timestamp, lastHash, data){
        return SHA256(`${timestamp}${lastHash}${data}`).toString();
    }

    /**
     * Retorna um hash a partir de um bloco 
     * @param {Block} block
     * @returns {string} hash no formato string 
     */
    static blockHash(block){
        // destructuring para pegar as propriedades do objeto
        const {timestamp, lastHash, data} = block;
        // hash
        return Block.hash(timestamp, lastHash, data);
    }
}
// exportando a classe
module.exports = Block;