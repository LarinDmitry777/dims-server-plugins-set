"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var typePatch_1 = require("../../typePatch");
var additional_1 = require("./additional");
var strings_1 = require("./strings");
var SpawnTpTool = (function () {
    function SpawnTpTool() {
    }
    SpawnTpTool.init = function (diamondsCost) {
        if (SpawnTpTool.isInit) {
            return;
        }
        SpawnTpTool.isInit = true;
        SpawnTpTool.diamondsCost = diamondsCost;
        typePatch_1.commando('spawn', SpawnTpTool.spawnCommandHandler);
    };
    SpawnTpTool.spawnCommandHandler = function (_args, player) {
        if (!additional_1.takeDiamondAccordingToPlayerStatus(player, SpawnTpTool.diamondsCost, true)) {
            return;
        }
        var spawnLocation = utils_1.world('world').getSpawnLocation();
        player.teleport(spawnLocation);
        echo(player, strings_1.default.playerTpToSpawn);
    };
    SpawnTpTool.isInit = false;
    return SpawnTpTool;
}());
exports.default = SpawnTpTool;
