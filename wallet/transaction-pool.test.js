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
      transaction = Transaction.newTransaction(wallet, 'r4nd-4dr355', 30);
      tp.updateOrAddTransaction(transaction);
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
});