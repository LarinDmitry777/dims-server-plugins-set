"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var utils_1 = require("utils");
var typePatch_1 = require("../../typePatch");
var additional_1 = require("./additional");
var strings_1 = require("./strings");
var DeathTpTool = (function () {
    function DeathTpTool() {
    }
    DeathTpTool.init = function (diamondsCost) {
        if (DeathTpTool.isInit) {
            return;
        }
        DeathTpTool.isInit = true;
        DeathTpTool.diamondsCost = diamondsCost;
        events.playerDeath(DeathTpTool.playerDeathEventHandler);
        typePatch_1.commando('tpdeath', DeathTpTool.tpDeathHandler);
    };
    DeathTpTool.tpDeathHandler = function (_args, player) {
        var deathLocation = DeathTpTool.getPlayerDeathPoint(player);
        if (deathLocation === undefined) {
            echo(player, strings_1.default.playerHasNoDeathPoint);
            return;
        }
        if (!additional_1.takeDiamondAccordingToPlayerStatus(player, DeathTpTool.diamondsCost, true)) {
            return;
        }
        player.teleport(deathLocation);
        echo(player, strings_1.default.playerTpToDeath);
    };
    DeathTpTool.getPlayerDeathPoint = function (player) {
        var deathJson = DeathTpTool.deathPointPersist[player.name];
        return deathJson !== undefined
            ? utils_1.locationFromJSON(deathJson)
            : undefined;
    };
    DeathTpTool.playerDeathEventHandler = function (event) {
        if (event.getEntity().getType().getName() !== 'player') {
            return;
        }
        DeathTpTool.deathPointPersist[event.getEntity().name] = utils_1.locationToJSON(event
            .getEntity().getLocation());
    };
    DeathTpTool.deathPointPersist = persist('deathPoints');
    DeathTpTool.isInit = false;
    return DeathTpTool;
}());
exports.default = DeathTpTool;
