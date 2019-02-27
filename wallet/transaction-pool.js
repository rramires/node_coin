const Transaction = require('./transaction');

class TransactionPool{

    /**
     * Construtor da TransactionPool  
     */
    constructor(){
        this.transactions = [];
    }

    /**
     * Atualiza ou adiciona uma transação na lista
     * @param {Transaction} transaction 
     */
    updateOrAddTransaction(transaction){
        // procura para ver se já esiste uma transação
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        // se existir atualiza
        if (transactionWithId) {
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
            // senao insere
        } else {
            this.transactions.push(transaction);
        }
    }

    /**
     * Procura uma transação pelo endereço
     * @param {String} address 
     * @returns {Transaction} transaction
     */
    existingTransaction(address) {
        return this.transactions.find(transaction => transaction.input.address === address);
    }

    /**
     * Retorna as transações válidas
     */
    validTransactions() {
        // filtra as transações, pegando as que são válidas
        return this.transactions.filter(transaction => {
            // verifica se o total enviado, corresponde as saídas
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0); // total inicia com 0
            // se input for diferente da soma dos outputs
            if(transaction.input.amount !== outputTotal){
                console.log(`Invalid transaction from ${transaction.input.address}`);
                return; // exclui a transação do filter
            }
            // Verifica se a assinatura da transação é válida
            if(!Transaction.verifyTransaction(transaction)){
                console.log(`Invalid signature from ${transaction.input.address}`);
                return; // exclui a transação do filter
            }
            // adiciona a transação no filter
            return transaction;
        });
    }
}
module.exports = TransactionPool;

