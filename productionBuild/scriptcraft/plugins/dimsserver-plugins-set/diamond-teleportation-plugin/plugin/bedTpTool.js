"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typePatch_1 = require("../../typePatch");
var additional_1 = require("./additional");
var strings_1 = require("./strings");
var BedTpTool = (function () {
    function BedTpTool() {
    }
    BedTpTool.init = function (diamondsCost) {
        if (BedTpTool.isInit) {
            return;
        }
        BedTpTool.isInit = true;
        BedTpTool.diamondsCost = diamondsCost;
        typePatch_1.commando('bed', BedTpTool.bedCommandHandler);
    };
    BedTpTool.bedCommandHandler = function (_args, player) {
        var bedSpawnLocation = player.getBedSpawnLocation();
        if (!bedSpawnLocation) {
            echo(player, strings_1.default.playerHasNoBed);
            return;
        }
        if (!additional_1.takeDiamondAccordingToPlayerStatus(player, BedTpTool.diamondsCost, true)) {
            return;
        }
        player.teleport(bedSpawnLocation);
        echo(player, strings_1.default.playerTpToBed);
    };
    BedTpTool.isInit = false;
    return BedTpTool;
}());
exports.default = BedTpTool;
