import * as events from 'events';
import { players } from 'utils';

export default class ChatEavesdroppingTool {
    private static isInit = false;

    static init() {
        if (ChatEavesdroppingTool.isInit) {
            return;
        }
        ChatEavesdroppingTool.isInit = true;

        events.playerCommandPreprocess(ChatEavesdroppingTool.playerChatEventHandler);
    }

    private static playerChatEventHandler(event) {
        if (event.message.startsWith('/gamemode')) {
            return;
        }

        players()
            .filter((player: Player) => player.isOp())
            .forEach((admin) => {
                if (admin.name === event.player.name) {
                    return;
                }

                const messageText = event.message;
                if (messageText.startsWith(`/w ${admin.name}`)
            || messageText.startsWith(`/tell ${admin.name}`)
            || messageText.startsWith(`/msg ${admin.name}`)) {
                    return;
                }

                const messageSender = event.player;
                echo(admin, `[${messageSender.name}]: ${messageText}`);
            });
    }
}
