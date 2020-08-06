import { Client, TextChannel } from 'discord.js';
import WebSocket from 'ws';
import { IClientConfig } from '../interface/interface';
import { IAction } from '../interface/api.interface';
import { IChannelMsgEvent } from '../interface/event.interface';
import { decodeRawMsg } from './decodeRawMsgStruct';

class Logger{
    static d(){
        return new Date().toLocaleString();
    }
    static log(msg: any){
        console.log(`[${Logger.d()}]<discord WSC>: ${msg}`);
    }

    static error(msg: any){
        console.error(`[${Logger.d()}]<discord WSC>: ${msg}`);
    }

    static warn(msg: any){
        console.warn(`[${Logger.d()}]<discord WSC>: ${msg}`);
    }
}

export default class DClient{
    private wsClient!: WebSocket;

    private dClient: Client;

    private token: string = '';

    private address: string = '';

    constructor(config: IClientConfig){

        this.address = config.address;

        this.token = config.discordToken;

        this.dClient = new Client();

        this.bindEvent();
        
        this.login();
    }

    public async connect(){
        Logger.log('尝试连接Webscoket服务器');

        this.wsClient = new WebSocket(this.address, {
            headers: {
                'user-agent': 'discordWSC/0.0.1'
            }
        });

        this.bindWSEvent();

        Logger.log('已连接Webscoket服务器');
    }

    public async login(): Promise<void>{
        Logger.log('尝试登录discord');
        await this.dClient.login(this.token);
        Logger.log('已登录discord');
        this.connect();
    }

    private reply(msg: IAction, data: any, retcode: number = 0): void{
        let { echo } = msg;
        let replyData = {
            echo,
            retcode,
            data: data
        };
        console.log(`api reply: ${JSON.stringify(replyData)}`);
        this.wsClient.send(JSON.stringify(replyData));
    }

    private async sendMsgByChannelId(id: string, msg: any): Promise<void>{
        let guilds = this.dClient.guilds.cache;
        for(let [k, v] of guilds){
            let channel = v.channels.cache.find( x => x.id === id);
            if(channel && channel instanceof TextChannel){
                await channel.send(decodeRawMsg(channel, msg));
            }
            else{
                Logger.error(`非法channel id: ${id}`);
            }
        }
    }

    private async procAPICall(msg: IAction){
        switch(msg.action){
            case 'get-channels':{
                let channelsCache = this.dClient.channels.cache;
                let res = [];
                for(let [k, v] of channelsCache){
                    res.push(v);
                }
                this.reply(msg, res);
                break;
            }
            case 'send-channel-msg': {
                await this.sendMsgByChannelId(msg.params.channelId, msg.params.msg);
                this.reply(msg, '');
            }
        }
    }

    private bindEvent(){
        let dc = this.dClient;

        dc.on('message', (msg) => {
            //Logger.log(msg.embeds);
            let sendData = new IChannelMsgEvent(msg);
            this.wsClient.send(JSON.stringify(sendData));
        });

        dc.on('debug', (msg) => {
            Logger.log(msg);
        });
    }

    private bindWSEvent(){
        let wc = this.wsClient;

        wc.on('message', (msg) => {
            console.log(`api call: ${msg.toString()}`);

            let data: any;
            try{
                data = JSON.parse(msg.toString());
            }
            catch(e){
                data = msg;
            }
            this.procAPICall(data);
        });
    }
}