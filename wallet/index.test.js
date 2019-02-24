const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
    // declarações
    let wallet, tp;

    // Set's
    beforeEach(() => {
        wallet = new Wallet();
        tp = new TransactionPool();
    });

    describe('Criação de transação', () => {
        // declarações
        let transaction, sendAmount, recipient;

        // Set's
        beforeEach(() => {
            sendAmount = 50;
            recipient = 'r4nd0m-4ddr3s';
            transaction = wallet.createTransaction(recipient, sendAmount, tp);
        });

        describe('Adicionando mais uma saída com o mesmo destinatário', () => {
            // Set's
            beforeEach(() => {
                wallet.createTransaction(recipient, sendAmount, tp);
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