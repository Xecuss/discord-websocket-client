import { APIMessage, TextChannel, MessageOptions } from "discord.js";

export function decodeRawMsg(target: TextChannel, msg: any): APIMessage{
    let option: MessageOptions = Object.create(null);

    let attachments = msg.attachments;
    if(attachments){
        option.files = [];
        for(let item of attachments){
            option.files.push({
                attachment: item.url
            });
        }
    }

    let mentions = msg.mentions;
    console.log(`mentions: ${mentions}`);
    if(mentions){
        let users: Array<string> = [];
        for(let item of mentions){
            console.log(`at: ${item}`);
            if(item !== 'everyone'){
                console.log(`at: ${item}`);
                users.push(item);
            }
        }
        option.allowedMentions = {
            parse: ['users'],
            users
        };
    }

    if(msg.content) option.content = msg.content;

    let obj: APIMessage = new APIMessage(target, option);

    return obj;
}