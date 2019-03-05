const Websocket = require('ws');

// Porta do WebSocket, default 5001 ou via comando 
// ex: p2p_port=5002
const P2P_PORT = process.env.p2p_port || 5001;

// lista de clients, valor default array vazio ou via comando, separados por vílgula, ex:
// peers=ws://localhost:5001,ws://localhost:5002 npm run dev
const peers = process.env.peers ? process.env.peers.split(',') : [];

// tipagem dos dados enviados via socket
const MESSAGE_TYPES = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
};


class P2pServer{

    /**
     * Construtor do servidor p2p
     * @param {Blockchain} blockchain 
     */
    constructor(blockchain, transactionPool){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.sockets = [];
    }

    /**
     * Inicia o servidor de Sockets
     */
    listen(){
        // declarando servidor
        const server = new Websocket.Server( { port: P2P_PORT } );
        // evento disparado quando o servidor estiver conectado
        server.on('connection', socket => this.connectSocket(socket));
        // chama a conexão dos peers
        this.connectToPeers();
        console.log(`Listening for p2p connections on: ${P2P_PORT}`);
    }

    /**
     * Percorre a lista de peers e os conecta
     */
    connectToPeers(){
        // peers=ws://localhost:5001,ws://localhost:5002,etc
        peers.forEach(peer => {
            // cria uma nova conexão
            const socket = new Websocket(peer);
            // evento disparado sempre que um novo socket conectar
            socket.on('open', () => this.connectSocket(socket));
        });
    }

    /**
     * Adiciona sockets dos clients na lista
     * @param {object} socket 
     */
    connectSocket(socket){
        // armazenaremos, todos que conectarem nessa lista
        this.sockets.push(socket);
        console.log('Socket connected');
        // adiciona o método ouvinte
        this.messageHandler(socket);
        // faz o envio da 1ª instância, para as que se conectarem
        this.sendChain(socket);
    }

    /**
     * Event handler do método send
     * @param {socket} socket 
     */
    messageHandler(socket){
        socket.on('message', message => {
            const data = JSON.parse(message);
            switch(data.type) {
                case MESSAGE_TYPES.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPES.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPES.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
    }

    /**
     * Faz o envio
     * @param {socket} socket 
     */
    sendChain(socket){
        // envia o blockchain
        socket.send(JSON.stringify(this.blockchain.chain));
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.chain, 
                                    chain: this.blockchain.chain }));
    }
    
    /**
     * Percorre todas as instâncias 
     */
    syncChains(){
        this.sockets.forEach(socket => {
            // faz o envio das demais instâncias
            this.sendChain(socket);
        });
    }
    
    /**
     * Faz o envio
     * @param {socket} socket 
     * @param {Transaction} transaction 
     */
    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({ type: MESSAGE_TYPES.transaction, transaction }));
    }
    
    /**
     * Percorre todas as instâncias 
     */
    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
    }

    /**
     * Percorre todas as instâncias enviando CLEAR_TRANSACTIONS
     */
    broadcastClearTransactions(){
        this.sockets.forEach(socket => socket.send(JSON.stringify({
            type: MESSAGE_TYPES.clear_transactions
        })));
    }
}
module.exports = P2pServer;