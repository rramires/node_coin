const ChainUtil = require('../chain-util');
const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');

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

    /**
     * Cria a assinatura
     * @param {string} dataHash 
     */
    sign(dataHash){
        return this.keyPair.sign(dataHash);
    }

    /**
     * Cria ou atualiza uma transação, se já existir na pool
     * @param {String} recipient - endereco da carteira destino 
     * @param {Number} amount - valor enviado
     * @param {TransactionPool} transactionPool - piscina de transações
     * @returns {Transaction} - transaction
     */
    createTransaction(recipient, amount, transactionPool) {
        if(amount > this.balance){
            console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
            return;
        }
        // busca na pool
        let transaction = transactionPool.existingTransaction(this.publicKey);
        // se existir atualiza
        if(transaction) {
            transaction.update(this, recipient, amount);
            // senao cria
        }else{
            transaction = Transaction.newTransaction(this, recipient, amount);
            transactionPool.updateOrAddTransaction(transaction);
        }
        return transaction;
    }

    /**
     * Cria e retorna a carteira de recompensas
     * @returns {Wallet} - wallet do blockchain
     */
    static blockchainWallet(){
        const blockchainWallet = new this();
        blockchainWallet.address = 'blockchain-wallet';
        return blockchainWallet;
    }
}
// exportando a classe
module.exports = Wallet;