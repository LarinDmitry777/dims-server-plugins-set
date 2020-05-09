import * as events from 'events';

export default class LostItemInCursorBugFixer {
    private static isInit = false;

    static init() {
        if (LostItemInCursorBugFixer.isInit) {
            return;
        }
        LostItemInCursorBugFixer.isInit = true;

        events.playerQuit(LostItemInCursorBugFixer.playerQuitEventHandler);
    }

    private static playerQuitEventHandler(event: PlayerQuitEvent) {
        const { player } = event;
        const handItem = player.getItemOnCursor();
        player.getInventory().addItem(handItem);
    }
}
