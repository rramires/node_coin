const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1');
const ec = new EC('secp256k1');

class ChainUtil{

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
}
// exportando a classe
module.exports = ChainUtil;