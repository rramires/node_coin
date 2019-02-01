const Websocket = require('ws');

// Porta do WebSocket, default 5001 ou via comando 
// ex: p2p_port=5002
const P2P_PORT = process.env.p2p_port || 5001;

// lista de clients, valor default array vazio ou via comando, separados por vílgula, ex:
// peers=ws://localhost:5001,ws://localhost:5002 npm run dev
const peers = process.env.peers ? process.env.peers.split(',') : [];

class P2pServer{

    /**
     * Construtor do servidor p2p
     * @param {Blockchain} blockchain 
     */
    constructor(blockchain){
        this.blockchain = blockchain;
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
            //console.log('message->data:', data);
            // substitui a chain se passar pelos critérios
            this.blockchain.replaceChain(data);
        });
    }

    /**
     * Faz o envio
     * @param {socket} socket 
     */
    sendChain(socket){
        // envia o blockchain
        socket.send(JSON.stringify(this.blockchain.chain));
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
}
module.exports = P2pServer;