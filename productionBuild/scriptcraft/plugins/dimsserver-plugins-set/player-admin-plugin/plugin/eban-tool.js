"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var typePatch_1 = require("../../typePatch");
var strings_1 = require("./strings");
var EbanTool = (function () {
    function EbanTool() {
    }
    EbanTool.init = function (adminPlayers, prison, freedom) {
        if (EbanTool.isInit) {
            return;
        }
        EbanTool.isInit = true;
        EbanTool.adminPlayers = adminPlayers;
        EbanTool.prisonCoordinate = prison.x + " " + prison.y + " " + prison.z;
        EbanTool.freedomCoordinate = freedom.x + " " + freedom.y + " " + freedom.z;
        typePatch_1.commando('eban', EbanTool.banCommandHandler);
        typePatch_1.commando('neban', EbanTool.pardonCommandHandler);
    };
    EbanTool.isCommandCanUse = function (bannedPlayerName, handlerPlayer, isWantSendMessages) {
        if (EbanTool.adminPlayers.indexOf(handlerPlayer.name) === -1) {
            if (isWantSendMessages) {
                echo(handlerPlayer, strings_1.default.noRights);
            }
            return false;
        }
        if (utils_1.players().map(function (p) { return p.name; }).indexOf(bannedPlayerName) === -1) {
            if (isWantSendMessages) {
                echo(handlerPlayer, 'Игрок не найден');
            }
            return false;
        }
        return true;
    };
    EbanTool.banCommandHandler = function (args, handlerPlayer) {
        var bannedPlayerName = args[0];
        if (EbanTool.isCommandCanUse(bannedPlayerName, handlerPlayer, true)) {
            server.dispatchCommand(server.consoleSender, "tp " + bannedPlayerName + " " + EbanTool.prisonCoordinate);
        }
    };
    EbanTool.pardonCommandHandler = function (args, handlerPlayer) {
        var bannedPlayerName = args[0];
        if (EbanTool.isCommandCanUse(bannedPlayerName, handlerPlayer, true)) {
            server.dispatchCommand(server.consoleSender, "tp " + bannedPlayerName + " " + EbanTool.freedomCoordinate);
        }
    };
    EbanTool.isInit = false;
    return EbanTool;
}());
exports.default = EbanTool;
