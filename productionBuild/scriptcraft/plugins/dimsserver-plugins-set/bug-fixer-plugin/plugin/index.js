"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lostItemInCursorBugFixer_1 = require("./lostItemInCursorBugFixer");
var lostVehicleAfterDisconnectBugFixer_1 = require("./lostVehicleAfterDisconnectBugFixer");
var tpToDeathBugFixer_1 = require("./tpToDeathBugFixer");
var config = require('../config.json');
if (config.lostItemInCursorAfterDisconnect) {
    lostItemInCursorBugFixer_1.default.init();
}
if (config.lostVehicleAfterDisconnect) {
    lostVehicleAfterDisconnectBugFixer_1.default.init();
}
if (config.tpToDeath) {
    tpToDeathBugFixer_1.default.init();
}
