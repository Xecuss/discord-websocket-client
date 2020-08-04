import { Message } from "discord.js";

interface IBaseEvent{
    type: string;
    data: any;
}

export class IChannelMsgEvent implements IBaseEvent{
    public readonly type = 'channel-msg';

    public data: any = Object.create(null);

    constructor(msg: Message){
        this.data = {
            sender: msg.author,
            channel: msg.channel,
            content: msg.content,
            reference: msg.reference
        }
    }
}