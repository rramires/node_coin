const express = require('express');
const bodyParser = require('body-parser');
const Blochchain = require('../blockchain');
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

// Porta da API, default 3001 mas pode ser alterada 
// via linha de comando na hora da execução, ex:
// http_port=3002 npm run dev
const HTTP_PORT = process.env.http_port || 3001;

// instancia da API
const app = express();
// instancia da Blockchain
const bc = new Blochchain();
// instância da wallet
const wallet = new Wallet();
// instância da pool
const tp = new TransactionPool();
// instancia do servidor p2p
const p2pServer = new P2pServer(bc, tp);
// instância do minerador
const miner = new Miner(bc, tp, wallet, p2pServer);

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
 * Use: localhost:3001/mine
 */
app.post('/mine', (req, res) => {
    // pega os dados no formato JSON e adiciona um bloco
    const block = bc.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);  
    // executa a sincronização via p2p-server
    p2pServer.syncChains();
    // redireciona para o método blocks
    res.redirect('/blocks');
});

/**
 * Retorna um JSON contendo as transações
 * Use: localhost:3001/transactions
 */
app.get('/transactions', (req, res) => {
    res.json(tp.transactions);
});

/**
 * Adiciona uma transação usando dados no formato JSON
 * Use: localhost:3001/transact - raw application/json
 * { "recipient": "foo-4dr3ss", "amount": 50 }
 */
app.post('/transact', (req, res) => {
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(recipient, amount, bc, tp);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/transactions');
});

/**
 * Retorna a chave pública
 */
app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

/**
 * Minera as transações
 */
app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    console.log(`New block added: ${block.toString()}`); 
    res.redirect('/blocks');   
});

// executando 
app.listen(HTTP_PORT, () => console.log(`App listening on port: ${HTTP_PORT}`));
p2pServer.listen();