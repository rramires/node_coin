const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');

class Wallet{

    /**
     * Construtor da Wallet  
     */
    constructor(){
        this.balance = INITIAL_BALANCE;
        this.keyPair = ChainUtil.genKeyPair();
        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    /**
     * Retorna os valores das propriedades
     * @returns {string} valores no formato string
     */
    toString(){
        return `Wallet -
        publicKey: ${this.publicKey.toString()}
        balance: ${this.balance.toString()}`;
    }
}
// exportando a classe
module.exports = Wallet;