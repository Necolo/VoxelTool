import http = require('http');
import ip = require('ip');
import path = require('path');
import ecstatic = require('ecstatic');

const WebSocketServer = require('uws').Server;
import { db } from './server/db';

import createServer = require('./server');
import {
    SocketInterface, 
    RequestId,
    MessageHandler,
} from './spec';


export class ServerSocket implements SocketInterface {
    public onmessage:MessageHandler<any>[];

    private _ws:any;

    constructor () {
        const self = this;
        this.onmessage = new Array(RequestId.LENGTH);

        wss.on('connection', function (ws) {
            self._ws = ws;
            ws.on('message', (msg) => {
                console.log('receive:', msg);
                const { id, data } = JSON.parse(msg);
                self.onmessage[id](id, data);
            })
        })
    }

    public send (id:number, data:any) {
        this._ws.send(JSON.stringify({
            id,
            data,
        }))
    }

    public sub (id:number, handler:MessageHandler<any>) {
        this.onmessage[id] = handler;
    }

    public unsub (id:number, index:number) {
        this.onmessage[id] = () => {}; 
    }
}

const PORT = 8002;

const server = http.createServer(ecstatic({
    root: path.join(__dirname, '../'),
}))

const wss = new WebSocketServer({
    server,
});
const serverSocket = new ServerSocket();

createServer(serverSocket, db);
server.listen(PORT);

console.log(`listening on: http://${ip.address()}:${PORT}`);