import * as events from 'events';

export default class TpToDeathBugFixer {
    private static isInit = false;

    static init() {
        if (TpToDeathBugFixer.isInit) {
            return;
        }
        TpToDeathBugFixer.isInit = true;

        events.playerJoin(TpToDeathBugFixer.playerJoinEvent);
    }

    private static playerJoinEvent(event: PlayerJoinEvent) {
        const player: Player = event.getPlayer();
        if (player.isDead()) {
            player.spigot().respawn();
        }
    }
}
