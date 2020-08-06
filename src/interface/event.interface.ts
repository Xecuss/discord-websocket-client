import { Message, MessageAttachment } from "discord.js";

interface IBaseEvent{
    type: string;
    data: any;
}

export class IChannelMsgEvent implements IBaseEvent{
    public readonly type = 'channel-msg';

    public data: any = Object.create(null);

    constructor(msg: Message){
        let { embeds, content, reference, channel, mentions, attachments } = msg;
        let attachMentsArray: Array<MessageAttachment> = [];
        attachments.forEach( v => {
            attachMentsArray.push(v);
        });

        let mentionsArray: Array<any> = [];
        if(mentions.everyone) mentionsArray.push('everyone');
        if(mentions.members){
            mentions.members.forEach( v => {
                //console.log(v);
                mentionsArray.push(v.id);
            });
        }
        
        this.data = {
            sender: msg.author,
            channel,
            content,
            reference,
            mentions: mentionsArray,
            attachments: attachMentsArray
        }
    }
}