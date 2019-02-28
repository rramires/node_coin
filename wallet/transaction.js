const ChainUtil = require('../chain-util');
const { MINING_REWARD } = require('../config');

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
     * Atualiza uma transação, adicionando mais um output
     * @param {Wallet} senderWallet - carteira remetente
     * @param {string} recipient - endereco da carteira destino
     * @param {Number} amount - valor enviado
     * @returns {Transaction} - transaction 
     */
    update(senderWallet, recipient, amount){
        // pega o output de envio
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        // Interrompe execução, se não tiver saldo suficiente
        if (amount > senderOutput.amount) {
            // valor é maior que o saldo
            console.log(`Amount: ${amount} exceeds balance.`);
            return;
        }
        // atualiza o saldo da carteira remetente, subtraindo
        senderOutput.amount = senderOutput.amount - amount;
        // adiciona o valor ao novo destinatário
        this.outputs.push({ amount, address: recipient });

        // assina a transação
        Transaction.signTransaction(this, senderWallet);

        return this;
    }

    /**
     * Cria uma transação com saídas
     * @param {Wallet} senderWallet 
     * @param {Array} outputs 
     * @returns {Transaction} new Transaction
     */
    static transactionWithOutputs(senderWallet, outputs){
        // insere a transação
        const transaction = new this();
        // adiciona as saídas
        transaction.outputs.push(...outputs);
        // assina a transação
        Transaction.signTransaction(transaction, senderWallet);
        return transaction;
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
        // cria a transação e adicionando as saídas
        return Transaction.transactionWithOutputs(senderWallet, [
                // atualiza o saldo da carteira remetente, subtraindo
                { amount: senderWallet.balance - amount, address: senderWallet.publicKey },
                // adiciona o valor ao destinatário
                { amount, address: recipient }
            ]);
    }

    /**
     * Cria a recompensa do minerador
     * @param {Wallet} minerWallet 
     * @param {Wallet} blockchainWallet 
     */
    static rewardTransaction(minerWallet, blockchainWallet){
        return Transaction.transactionWithOutputs(blockchainWallet, [{
                amount: MINING_REWARD, address: minerWallet.publicKey
            }]);
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
    
    /**
     * Verifica se a transação é válida
     * @param {Transaction} transaction 
     * @returns {boolean} - transação válida ou inválida
     */
    static verifyTransaction(transaction){
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        );
    }
}
// exportando a classe
module.exports = Transaction;