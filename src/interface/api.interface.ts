interface BaseAction{
    echo: number;
    action: string;
    params?: any;
}

interface GetChannelAction extends BaseAction{
    action: 'get-channels'
}

interface SendChannelMsgAction extends BaseAction{
    action: 'send-channel-msg',
    params: {
        channelId: string;
        msg: string;
    }
}

export type IAction = GetChannelAction | SendChannelMsgAction;