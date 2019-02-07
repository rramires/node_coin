const SHA256 = require('crypto-js/sha256');
const { DIFFICULTY, MINE_RATE } = require('../config');
//
class Block{
    /**
     * Construtor do Bloco  
     * @param {string} timestamp - Timestamp em milisegundos
     * @param {string} lastHash -  Último Hash/Hash do bloco anterior
     * @param {string} hash - Hash desse bloco (ID)
     * @param {string} data - Qualquer tipo de dados
     * @param {string} nonce - Valor único
     */
    constructor(timestamp, lastHash, hash, data, nonce, difficulty){
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
    }

    /**
     * Retorna os valores das propriedades
     * @returns {string} valores no formato string
     */
    toString(){
        return `Block -
        Timestamp  : ${this.timestamp}
        Last Hash  : ${this.lastHash.substr(0, 10)}
        Hash       : ${this.hash.substr(0, 10)}
        Nonce      : ${this.nonce}
        Difficulty : ${this.difficulty}
        Data       : ${this.data}`;
    }

    /**
     * Cria e retorna o bloco gênese
     * @returns {Block} new Block()
     */
    static genesis(){
        // Aleatório '0bf30...', poderia ser qualquer coisa hexadecimal
        // retorna o novo bloco
        return new this('Genesis Time', '-----', '0bf30e9455d84a8c31b1', [], 0, DIFFICULTY);
    }

    /**
     * Cria e retorna um novo bloco, linkado ao anterior
     * @returns {Block} new Block()
     */
    static mineBlock(lastBlock, data){
        // declaracoes
        let timestamp, hash, nonce = 0;
        // pega o hash do bloco anterior
        const lastHash = lastBlock.hash;
        // pega a dificuldade do bloco anterior
        let { difficulty } = lastBlock; // 32
        // loop
        do{
            // incremento
            nonce++;
            // pega o timestamp
            timestamp = Date.now();
            // chama método para calcular a dificuldade
            difficulty = Block.adjustDifficulty(lastBlock, timestamp); // 32
            // pega o hash atual
            hash = Block.hash(timestamp, lastHash, data, nonce, difficulty); // 32
            // Dificulty = 4 - 0 !== 0000, 00 !== 0000, 000 !== 0000, etc.
        } while(hash.substr(0, difficulty) !== '0'.repeat(difficulty)); // <<<<--------
        // retorna o novo bloco
        return new this(timestamp, lastHash, hash, data, nonce, difficulty); // <<<<--------
    }

    /**
     * Gera um hash
     * @param {string} timestamp 
     * @param {string} lastHash 
     * @param {string} data 
     * @param {string} nonce 
     * @returns {string} hash no formato string 
     */
    static hash(timestamp, lastHash, data, nonce, difficulty){
        return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
    }

    /**
     * Retorna um hash a partir de um bloco 
     * @param {Block} block
     * @returns {string} hash no formato string 
     */
    static blockHash(block){
        // destructuring para pegar as propriedades do objeto
        const {timestamp, lastHash, data, nonce, difficulty} = block;
        // hash
        return Block.hash(timestamp, lastHash, data, nonce, difficulty);
    }

    /**
     * Ajusta a dificuldade dinamicamente 
     * @param {Block} lastBlock 
     * @param {Number} currentTime 
     */
    static adjustDifficulty(lastBlock, currentTime){
        let { difficulty } = lastBlock;
        // se o tempo do último bloco passar de X ms
        // aumenta a dificuldade, senão diminui
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? 
                     difficulty + 1 : difficulty -1;
        return difficulty;
    }
}
// exportando a classe
module.exports = Block;