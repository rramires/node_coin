const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');
const ec = new EC('secp256k1');

class ChainUtil{

    /**
     * Cria um hash
     * @param {*} data 
     * @returns {string} - hash no formato string
     */
    static hash(data){
        return SHA256(JSON.stringify(data)).toString();
    }

    /**
     * Gera o par de chaves
     * @returns {KeyPair} - instância de KeyPair
     */
    static genKeyPair(){
        return ec.genKeyPair();
    }

    /**
     * Retorna um ID - formato 45745c60-7b1a-11e8-9c9c-2d42b21b1a3e
     * @returns {string} ID baseado no timestamp
     */
    static id(){
        return uuidV1();
    }

    /**
     * Verifica a assinatura de uma transação
     * @param {string} publicKey 
     * @param {string} signature 
     * @param {string} dataHash 
     * @returns {boolean} - assinatura válida ou inválida
     */
    static verifySignature(publicKey, signature, dataHash){
        return ec.keyFromPublic(publicKey, 'hex', ).verify(dataHash, signature);
    }
}
// exportando a classe
module.exports = ChainUtil;