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
     */
    toString(){
        return `Block -
        Timestamp : ${this.timestamp}
        Last Hash : ${this.lastHash.substring(0, 10)}
        Hash      : ${this.hash.substring(0, 10)}
        Data      : ${this.data}`;
    }
}
// exportando a classe
module.exports = Block;
