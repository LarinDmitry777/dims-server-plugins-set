"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var LostVehicleAfterDisconnectBugFixer = (function () {
    function LostVehicleAfterDisconnectBugFixer() {
    }
    LostVehicleAfterDisconnectBugFixer.init = function () {
        if (LostVehicleAfterDisconnectBugFixer.isInit) {
            return;
        }
        LostVehicleAfterDisconnectBugFixer.isInit = true;
        events.playerQuit(LostVehicleAfterDisconnectBugFixer.playerQuitEventHandler);
    };
    LostVehicleAfterDisconnectBugFixer.playerQuitEventHandler = function (event) {
        var player = event.player;
        var vehicle = player.getVehicle();
        if (vehicle === null) {
            return;
        }
        vehicle.removePassenger(player);
    };
    LostVehicleAfterDisconnectBugFixer.isInit = false;
    return LostVehicleAfterDisconnectBugFixer;
}());
exports.default = LostVehicleAfterDisconnectBugFixer;
