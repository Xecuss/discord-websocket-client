import { Client } from 'discord.js';
import WebSocket from 'ws';

export default class DClient{
    private wsClient: WebSocket;

    private dClient: Client;

    private token: string = '';

    constructor(address: string){
        this.wsClient = new WebSocket(address, {
            headers: {
                'user-agent': 'discordWSC/0.0.1'
            }
        });

        this.dClient = new Client();
    }

    public login(): boolean{
        this.dClient.login(this.token);
        return false;
    }

    private bindEvent(){
        let c = this.dClient;

        c.on('message', (msg) => {
            console.log(msg.content);
        });
    }
}