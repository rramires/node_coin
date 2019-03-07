const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');

describe('Wallet', () => {
    // declarações
    let wallet, tp;

    // Set's
    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
        bc = new Blockchain();
    });

    describe('Criando a transação', () => {
        // declarações
        let transaction, sendAmount, recipient;

        // Set's
        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd0m-4ddr3s';
            transaction = wallet.createTransaction(recipient, sendAmount, bc, tp);
        });

        describe('Refazendo a mesma transação, adicionando mais uma saída do mesmo valor', () => {
            // Set's
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, bc, tp);
            });
            // tests
            it('Validando se o saldo final foi debitado duas vezes', () => {
                expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                    .toEqual(wallet.balance - sendAmount * 2);
            });
            it('Validando se as duas saídas são iguais ao valor enviado', () => {
                expect(transaction.outputs.filter(output => output.address === recipient)
                    .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
            });
        });
    });
});