const ChainUtil = require('../chain-util');

class Transaction{

    /**
     * Construtor da Transaction  
     */
    constructor() {
        this.id = ChainUtil.id();
        this.input = null;
        this.outputs = [];
    }

    /**
     * Cria uma nova transação
     * @param {Wallet} senderWallet - carteira remetente
     * @param {string} recipient - endereco da carteira destino
     * @param {Number} amount - valor enviado
     * @returns {Transaction} new Transaction
     */
    static newTransaction(senderWallet, recipient, amount){

        // Interrompe execução, se não tiver saldo suficiente
        if (amount > senderWallet.balance) {
            // valor é maior que o saldo
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
       
        // insere a transação
        const transaction = new this();
        //
        transaction.outputs.push(...[
            // atualiza o saldo da carteira remetente, subtraindo
            { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
            // adiciona o valor ao destinatário
            { amount, address: recipient }
        ]);

        // assina a transação
        Transaction.signTransaction(transaction, senderWallet);
    
        return transaction;
    }

    /**
     * Assina uma transação
     * @param {Transaction} transaction 
     * @param {Wallet} senderWallet 
     */
    static signTransaction(transaction, senderWallet){
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }
}
// exportando a classe
module.exports = Transaction;