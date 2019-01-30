// importa Block
const Block = require('./block');
// geração do bloco gênese e o primeiro bloco pelo mineBlock
const testBlock = Block.mineBlock(Block.genesis(), 'Bloco de Teste');
// imprime
console.log(testBlock.toString());

