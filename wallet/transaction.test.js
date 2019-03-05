const Transaction = require('./transaction');
const Wallet = require('./index');
const { MINING_REWARD } = require('../config');

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
    it('Valida se a subtração de `amount` do saldo corresponde ao saldo restante', () => {
        // pesquisa output do remetente
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
              .toEqual(wallet.balance - amount);
    });
    it('Valida se `amount` corresponde ao amount do output', () => {
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
    it('Valida transação válida', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    }); 
    it('Invalida transação corrompida', () => {
        transaction.outputs[0].amount = 666; // alterando um valor
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    }); 
    describe('Atualização da transação para adicionar saída', () => {
        let nextAmount, nextRecipient;
        beforeEach(() => {
            nextAmount = 20;
            nextRecipient = 'n3xt4ddr355';
            transaction = transaction.update(wallet, nextRecipient, nextAmount);
        });
        
        it('Valida se a subtração de `amount` do saldo corresponde ao saldo restante', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
            .toEqual(wallet.balance - amount - nextAmount);
        });
        
        it('Valida se `amount` corresponde ao amount do output', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
            .toEqual(nextAmount);
        });
    });
    describe('Transação de recompensa', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });
        it('Verificando se a recompensa é igual ao valor definido', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(MINING_REWARD);
        });
    });
});

