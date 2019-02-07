const Block = require('./block');
const { DIFFICULTY } = require('../config');

// Na descrição vamo usar o nome da classe que vamos testar
describe('Block', () => {
    // Usar declarações com o let, para limitar o escopo
    let data, lastBlock, block;
    // Setar as variaveis nesse método que é chamado antes do loop
    beforeEach(() => {
        data = 'dataTest'
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, data); 
    });
    // Finalmente os testes, que serão executados na sequencia
    it('Validando se `data` corresponde ao valor de entrada', () => { 
        // faz as comparações do teste
        expect(block.data).toEqual(data);
    });
    it('Validando se `lastHash` corresponde ao hash do último bloco', () => { 
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
    it('Validando quando o hash fica equivalente a dificuldade', () => {
        expect(block.hash.substr(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
        console.log(block.toString());
    });
    it('Validando quando a dificuldade for ajustada para menos', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 3600000)).toEqual(block.difficulty -1);
    });
    it('Validando quando a dificuldade for ajustada para mais', () => {
        expect(Block.adjustDifficulty(block, block.timestamp +1)).toEqual(block.difficulty +1);
    });
});