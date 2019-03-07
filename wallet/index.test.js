const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain');
const { INITIAL_BALANCE } = require('../config');

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
    
    describe('Cálculo do saldo', () => {
        // declarações
        let addBalance, repeatAdd, senderWallet;

        // Set's
        beforeEach(() => {
            senderWallet = new Wallet();
            addBalance = 100;
            repeatAdd = 3;
            // repete as transações
            for(let i = 0; i < repeatAdd ; i++){
                senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
            }
            // adiciona no blockchain
            bc.addBlock(tp.transactions);
        });
        it('Valida se o calculo bate na carteira destino', () => {
            expect(wallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE + (addBalance * repeatAdd));
        });
        it('Valida se o calculo bate na carteira remetente', () => {
            expect(senderWallet.calculateBalance(bc)).toEqual(INITIAL_BALANCE - (addBalance * repeatAdd));
        });
        // teste, bi direcional com 2 blocos
        describe('Criando transações bi-direcionais em diferentes blocos', () => {
            // declarações
            let subtractBalance, recipientBalance;

            // Set's
            beforeEach(() => {
                // limpa a mempool
                tp.clear();
                // pega o saldo atual
                recipientBalance = wallet.calculateBalance(bc);
                // cria uma transação do destinatário para o remetente
                subtractBalance = 60;
                wallet.createTransaction(senderWallet.publicKey, subtractBalance, bc, tp);
                bc.addBlock(tp.transactions);
            });
            
            describe('Checando se calculo bate, com mais uma transação', () => {
                beforeEach(() => {
                    // limpa a mempool
                    tp.clear();
                    // cria uma transação do remetente para o destinatário
                    senderWallet.createTransaction(wallet.publicKey, addBalance, bc, tp);
                    bc.addBlock(tp.transactions);
                });
                it('Valida se o calculo bate na carteira destino', () => {
                    expect(wallet.calculateBalance(bc)).toEqual(recipientBalance - subtractBalance + addBalance);
                });
            });
        });
    });
});