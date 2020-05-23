"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var LostItemInCursorBugFixer = (function () {
    function LostItemInCursorBugFixer() {
    }
    LostItemInCursorBugFixer.init = function () {
        if (LostItemInCursorBugFixer.isInit) {
            return;
        }
        LostItemInCursorBugFixer.isInit = true;
        events.playerQuit(LostItemInCursorBugFixer.playerQuitEventHandler);
    };
    LostItemInCursorBugFixer.playerQuitEventHandler = function (event) {
        var player = event.player;
        var handItem = player.getItemOnCursor();
        player.getInventory().addItem(handItem);
    };
    LostItemInCursorBugFixer.isInit = false;
    return LostItemInCursorBugFixer;
}());
exports.default = LostItemInCursorBugFixer;
