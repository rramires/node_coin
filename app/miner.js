const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner{

    /**
     * Construtor do Miner
     * @param {Blockchain} blockchain 
     * @param {TransactionPool} transactionPool 
     * @param {wallet} wallet 
     * @param {P2pServer} p2pServer 
     */
    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    /**
     * Executa a mineração
     */
    mine(){
        // pega as transações válidas que estão na pool
        const validTransactions = this.transactionPool.validTransactions();
        // inclui uma transação de recompensa para o minerador
        validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
        // cria um bloco contendo as transações válidas
        const block = this.blockchain.addBlock(validTransactions);
        // sincroniza o blockchain contendo o novo bloco com os peers
        this.p2pServer.syncChains();
        // limpa a pool retirando as transações que foram adicionadas
        this.transactionPool.clear();
        // transmite para os mineradores limparem a pool também
        this.p2pServer.broadcastClearTransactions();
        //
        return block;
    }
}
module.exports = Miner;
