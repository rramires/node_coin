const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');

describe('TransactionPool', () => {
    // declarações
    let tp, wallet, transaction;

    // Set's
    beforeEach(() => {
      tp = new TransactionPool();
      wallet = new Wallet();
      // transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
      // tp.updateOrAddTransaction(transaction);
      transaction = wallet.createTransaction('r4nd-4dr355', 30, tp);
    });
    // tests
    it('Valida adição de transação na pool', () => {
        // verifica se foi adicionado
      expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
    });
    it('Valida atualização de transação na pool', () => {
      // clonando a transação
      const oldTransaction = { ... transaction };
      // atualizando
      const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
      tp.updateOrAddTransaction(newTransaction);
      // comparando para ver que está diferente da original
      expect(tp.transactions.find(t => t.id === newTransaction.id))
            .not.toEqual(oldTransaction);
    });
    describe('Misturando transações válidas e inválidas', () => {
      // declarações
      let validTransactions;
      // Set's
      beforeEach(() => {
        validTransactions = [ ...tp.transactions ]; // clona
        for(let i=0; i<6; i++) { // cria 6 transações
          wallet = new Wallet();
          transaction = wallet.createTransaction('r4nd-4dr355', 30, tp);
          if(i%2 == 0){
            transaction.input.amount = 9999; // corrompe a transação
          }else{
            validTransactions.push(transaction);
          }
        }
      });
      it('Invalida as transações corrompidas, pela diferença nos arrays', () => {
        expect(JSON.stringify(tp.transactions))
          .not.toEqual(JSON.stringify(validTransactions));
      });
      it('Valida se retorna somente as válidas', () => {
        expect(tp.validTransactions()).toEqual(validTransactions);
      });
    });
});