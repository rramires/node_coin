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
}
module.exports = TransactionPool;

