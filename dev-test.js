/*
// importa Block
const Block = require('./blockchain/block');
// geração do bloco gênese e o primeiro bloco pelo mineBlock
const testBlock = Block.mineBlock(Block.genesis(), 'Bloco de Teste');
// imprime
console.log(testBlock.toString());
*/
/*
const Blockchain = require('./blockchain');

function testDifficunty(){

    const bc = new Blockchain();

    let dt = new Date();
    let startTime = dt.getTime();
    
    for(let i = 0 ; i < 10 ; i++){
        console.log(bc.addBlock(`testData_${i}`));
    }

    console.log(`Iníciado às: ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}.${dt.getMilliseconds()}`);
    dt.setTime(Date.now());
    console.log(`Finalizado às: ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}.${dt.getMilliseconds()}`);
}
testDifficunty();
*/

const Wallet = require('./wallet');
const wallet = new Wallet();
console.log(wallet.toString());

