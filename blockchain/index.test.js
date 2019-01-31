const Blockchain = require('./index');
const Block = require('./block');

// Descricao
describe('Blockchain', () => {
    // Declaracoes
    let bc, data;
    let bc2, data2; 
    // Set's
    beforeEach(() => {
        bc = new Blockchain();
        data = 'dataTest';
        bc2 = new Blockchain(); 
        data2 = 'dataTest2';
    });
    // Testes
    it('Validando se inicia com o `bloco gênese`', () => { 
        // Bloco zero é o gênese?
        expect(bc.chain[0]).toEqual(Block.genesis())
    });
    it('Validando o método `addBlock`', () => { 
        bc.addBlock(data); 
        // Último bloco adicionado contém os mesmos dados?
        expect(bc.chain[bc.chain.length -1].data).toEqual(data);
    });
    it('Invalidando a `chain` se o bloco gênese for corrompido', () =>{  
        bc2.chain[0].data = 'Bad data in genesis!';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });
    it('Invalidando a `chain` se ela estiver corrompida', () =>{  
        bc2.addBlock(data2);
        bc2.chain[1].data = 'Bad data in first block!';
        expect(bc.isValidChain(bc2.chain)).toBe(false);
    });   
    it('Validando se é uma `chain` válida', () =>{  
        bc2.addBlock(data2);
        expect(bc.isValidChain(bc2.chain)).toBe(true);
    });
    it('Invalidando a substituição da `chain` se for menor que a atual', () =>{
        // foi adicionado 1 bloco a cadeia bc, a bc2 tem apenas o gênese
        bc.addBlock(data); 
        bc.replaceChain(bc2.chain); 
        expect(bc.chain).not.toEqual(bc2.chain);
    });
    it('Validando a substituição da `chain` se for maior que a atual', () =>{
        // foi adicionado 1 bloco a cadeia2 a bc tem apenas o gênese
        bc2.addBlock(data2); 
        bc.replaceChain(bc2.chain);
        expect(bc.chain).toEqual(bc2.chain);
    });
});