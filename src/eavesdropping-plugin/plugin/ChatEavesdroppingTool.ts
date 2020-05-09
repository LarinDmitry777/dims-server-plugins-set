import * as events from 'events';
import { players } from 'utils';

export class ChatEavesdroppingTool {
    constructor() {
        events.playerCommandPreprocess((event) => {
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
        });
    }
}
