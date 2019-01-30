const Block = require('./block');

// nome da classe que vamos testar
describe('Block', () => {
    // declarar usando let, para limitar o escopo
    let data, lastBlock, block;
    // instanciar a classe a ser testada e valores
    beforeEach(() => {
        data = 'dataTest'
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data); 
    });
    // Testes unitários
    it('Verificando se `data` corresponde ao valor de entrada', () => { 
        // faz as comparações do teste
        expect(block.data).toEqual(data);
    });
    it('Verificando se `lastHash` corresponde ao hash do último bloco', () => { 
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
})