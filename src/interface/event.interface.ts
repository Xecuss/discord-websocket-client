import { Message } from "discord.js";

interface IBaseEvent{
    type: string;
    data: any;
}

export class IChannelMsgEvent implements IBaseEvent{
    public readonly type = 'channel-msg';

    public data: any = Object.create(null);

    constructor(msg: Message){
        let { embeds, content, reference, channel, mentions, attachments } = msg;
        this.data = {
            sender: msg.author,
            channel,
            content,
            reference,
            mentions,
            attachments
        }
    }
}