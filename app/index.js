const express = require('express');
const bodyParser = require('body-parser')
const Blochchain = require('../blockchain');

// Porta da API, default 3001 mas pode ser alterada 
// via linha de comando na hora da execução, ex:
// port=3002 npm run dev
const HTTP_PORT = process.env.port || 3001;

// instancia da API
const app = express();
// instancia da Blockchain
const bc = new Blochchain();

/**
 * Intercepta as chamadas e transforma em JSON
 */
app.use(bodyParser.json());

/**
 * Retorna um JSON contendo os blocos
 * Use: localhost:3001/blocks
 */
app.get('/blocks', (req, res) => {
    // retorna a cadeia no formato JSON
    res.json(bc.chain);
});

/**
 * Adiciona um bloco usando dados vindos no formato JSON
 * Use: localhost:3001/blocks
 */
app.post('/mine', (req, res) => {
    // pega os dados no formato JSON e adiciona um bloco
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);    
    // redireciona para o método blocks
    res.redirect('/blocks');
});

// executando 
app.listen(HTTP_PORT, () => console.log(`App listening on port: ${HTTP_PORT}`));