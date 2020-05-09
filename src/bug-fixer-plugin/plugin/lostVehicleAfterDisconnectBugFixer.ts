import * as events from 'events';

export default class LostVehicleAfterDisconnectBugFixer {
    private static isInit = false;

    static init() {
        if (LostVehicleAfterDisconnectBugFixer.isInit) {
            return;
        }
        LostVehicleAfterDisconnectBugFixer.isInit = true;

        events.playerQuit(LostVehicleAfterDisconnectBugFixer.playerQuitEventHandler);
    }

    private static playerQuitEventHandler(event: PlayerQuitEvent): void {
        const { player } = event;
        const vehicle = player.getVehicle();
        if (vehicle === null) {
            return;
        }
        vehicle.removePassenger(player);
    }
}
