import LostItemInCursorBugFixer from './lostItemInCursorBugFixer';
import LostVehicleAfterDisconnectBugFixer from './lostVehicleAfterDisconnectBugFixer';
import TpToDeathBugFixer from './tpToDeathBugFixer';

interface Config {
    lostItemInCursorAfterDisconnect: boolean;
    lostVehicleAfterDisconnect: boolean;
    tpToDeath: boolean;
}

const config: Config = require('../config.json');

if (config.lostItemInCursorAfterDisconnect) {
    LostItemInCursorBugFixer.init();
}

if (config.lostVehicleAfterDisconnect) {
    LostVehicleAfterDisconnectBugFixer.init();
}

if (config.tpToDeath) {
    TpToDeathBugFixer.init();
}
