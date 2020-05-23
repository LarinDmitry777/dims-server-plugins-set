"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var TpToDeathBugFixer = (function () {
    function TpToDeathBugFixer() {
    }
    TpToDeathBugFixer.init = function () {
        if (TpToDeathBugFixer.isInit) {
            return;
        }
        TpToDeathBugFixer.isInit = true;
        events.playerJoin(TpToDeathBugFixer.playerJoinEvent);
    };
    TpToDeathBugFixer.playerJoinEvent = function (event) {
        var player = event.getPlayer();
        if (player.isDead()) {
            player.spigot().respawn();
        }
    };
    TpToDeathBugFixer.isInit = false;
    return TpToDeathBugFixer;
}());
exports.default = TpToDeathBugFixer;
