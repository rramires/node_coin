const Transaction = require('./transaction');
const Wallet = require('./index');

describe('Transaction', () => {
    // declarações
    let transaction, wallet, recipient, amount;

    // Set's
    beforeEach(() => {
        wallet = new Wallet();
        amount = 50;
        recipient = 'r3c1p13ntAddr'; // fake addres 
        transaction = Transaction.newTransaction(wallet, recipient, amount);
    });
    // tests
    it('Valida subtração de `amount` do saldo', () => {
        // pesquisa output do remetente
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
              .toEqual(wallet.balance - amount);
    });
    it('Valida adicão de `amount` no destinatário', () => {
        // pesquisa output do destinatário
        expect(transaction.outputs.find(output => output.address === recipient).amount)
              .toEqual(amount);
    });
    //
    describe('Transação com valor maior que o saldo', () => {
        beforeEach(() => {
          amount = 50000;
          transaction = Transaction.newTransaction(wallet, recipient, amount);
        });
        it('Invalida a criação da transação', () => {
          expect(transaction).toEqual(undefined);
        });
    });
    it('Valida se o saldo de entrada é igual o saldo da carteira', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });
});

