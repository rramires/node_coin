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
     * @param {Blockchain} blockchain - cadeia de blocoa
     * @returns {Transaction} - transaction
     */
    createTransaction(recipient, amount, blockchain, transactionPool){
        // calcula o saldo
        this.balance = this.calculateBalance(blockchain);
        //
        if(amount > this.balance){
            console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
            return;
        }
        // busca na pool
        let transaction = transactionPool.existingTransaction(this.publicKey);
        // se existir atualiza
        if(transaction){
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

    /**
     * Retorna o saldo
     * @param {Blockchain} blockchain  
     * @returns {Number} - saldo
     */
    calculateBalance(blockchain){
        let balance = this.balance;
        let transactions = [];
        let startTime = 0;
        // percorre todos os blocos pegando todas as transações
        blockchain.chain.forEach(block => block.data.forEach(transaction => {
            transactions.push(transaction);
        }));
        // filtra pegando somente as entradas dessa wallet
        const walletInputTs = transactions.filter(
            transaction => transaction.input.address === this.publicKey
        );
        // se não houver transações dessa carteira
        if(walletInputTs.length == 0){
            // seta o balance inicial
            balance = this.balance;
        }else{
            // reduz até encontrar a transação mais recente, pelo maior timestamp
            const recentInputT = walletInputTs.reduce(
                (prev, current) => prev.input.timestamp > current.input.timestamp ? prev : current
            );
            // pega o balance mais recente
            balance = recentInputT.outputs.find(output => output.address === this.publicKey).amount;
            // pega o timestamp mais recente
            startTime = recentInputT.input.timestamp;
        }
        // percorre todas as transações
        transactions.forEach(transaction => {
            // se for depois da atual
            if (transaction.input.timestamp > startTime){
                // procura nos outputs
                transaction.outputs.find(output => {
                    // encontrando para essa carteira
                    if (output.address === this.publicKey){
                        // acrescenta o saldo
                        balance += output.amount;
                    }
                });
            }
        });
        // retorna o saldo
        return balance;
    }
}
// exportando a classe
module.exports = Wallet;