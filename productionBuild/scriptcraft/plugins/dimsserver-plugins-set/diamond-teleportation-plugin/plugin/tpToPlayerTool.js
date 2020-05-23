"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var typePatch_1 = require("../../typePatch");
var strings_1 = require("./strings");
var additional_1 = require("./additional");
var TpToPlayerTool = (function () {
    function TpToPlayerTool() {
    }
    TpToPlayerTool.init = function (diamondsCost) {
        if (TpToPlayerTool.isInit) {
            return;
        }
        TpToPlayerTool.isInit = true;
        TpToPlayerTool.diamondsCost = diamondsCost;
        typePatch_1.commando('call', TpToPlayerTool.callHandler);
        typePatch_1.commando('tpa', TpToPlayerTool.tpaHandler);
    };
    TpToPlayerTool.createTpCallRequest = function (fromPlayerName, toPlayerName) {
        var playersTpCalls = TpToPlayerTool.tpCalls[toPlayerName];
        if (playersTpCalls === undefined) {
            playersTpCalls = [];
            TpToPlayerTool.tpCalls[toPlayerName] = playersTpCalls;
        }
        var callRequestIndex = additional_1.indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        if (callRequestIndex !== -1) {
            playersTpCalls[callRequestIndex].date = Date.now();
            return false;
        }
        playersTpCalls.push({
            playerName: fromPlayerName,
            date: Date.now(),
        });
        return true;
    };
    TpToPlayerTool.isHasTpRequest = function (toPlayerName, fromPlayerName) {
        var playersTpCalls = TpToPlayerTool.tpCalls[toPlayerName];
        if (!Array.isArray(playersTpCalls)) {
            return false;
        }
        var tpRequestIndex = additional_1.indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        if (tpRequestIndex === -1) {
            return false;
        }
        var tpRequest = playersTpCalls[tpRequestIndex];
        var tpDate = tpRequest.date;
        if (Date.now() > tpDate + TpToPlayerTool.tpWaitTimeMillis) {
            TpToPlayerTool.removeTpRequest(toPlayerName, fromPlayerName);
            return false;
        }
        return true;
    };
    TpToPlayerTool.removeTpRequest = function (toPlayerName, fromPlayerName) {
        var playersTpCalls = TpToPlayerTool.tpCalls[toPlayerName];
        if (!Array.isArray(playersTpCalls)) {
            return;
        }
        var indexOfRequest = additional_1.indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        playersTpCalls.splice(indexOfRequest, 1);
    };
    TpToPlayerTool.callHandler = function (params, sender) {
        var playerName = params[0];
        if (playerName === undefined) {
            echo(sender, strings_1.default.typePlayerNameForTp);
            return;
        }
        if (playerName === sender.name) {
            echo(sender, strings_1.default.tpToSelf);
            return;
        }
        if (!additional_1.isPlayerOnline(playerName)) {
            echo(sender, strings_1.default.playerNotFound);
            return;
        }
        if (!additional_1.isPlayerHasEnoughDiamondsInHand(sender, TpToPlayerTool.diamondsCost)) {
            echo(sender, strings_1.default.youNeedDiamondsInHand + " " + TpToPlayerTool.diamondsCost);
            return;
        }
        var isPersistSend = TpToPlayerTool.createTpCallRequest(sender.name, playerName);
        if (isPersistSend) {
            echo(sender, strings_1.default.tpRequestSendFromPlayer + " " + playerName);
            echo(utils_1.player(playerName), strings_1.default.tpRequestSendToPlayer + " " + sender.name);
        }
        else {
            echo(sender, strings_1.default.tpRequestAlreadySend);
        }
    };
    TpToPlayerTool.tpaHandler = function (params, sender) {
        var playerName = params[0];
        if (playerName === undefined) {
            echo(sender, strings_1.default.typePlayerNameForTp);
            return;
        }
        if (!TpToPlayerTool.isHasTpRequest(sender.name, playerName)) {
            echo(sender, strings_1.default.tpRequestNotFound);
            return;
        }
        if (!additional_1.isPlayerOnline(playerName)) {
            echo(sender, strings_1.default.playerNotFound);
            return;
        }
        if (!additional_1.isPlayerHasEnoughDiamondsInHand(sender, TpToPlayerTool.diamondsCost)) {
            echo(sender, strings_1.default.youNeedDiamondsInHand + " " + TpToPlayerTool.diamondsCost);
            return;
        }
        if (!additional_1.isPlayerHasEnoughDiamondsInHand(utils_1.player(playerName), TpToPlayerTool.diamondsCost)) {
            echo(utils_1.player(playerName), strings_1.default.tpToPlayerError + " " + playerName);
            echo(sender, strings_1.default.tpToPlayerError + " " + playerName);
            return;
        }
        TpToPlayerTool.removeTpRequest(sender.name, playerName);
        additional_1.takeDiamondsFromHand(sender, TpToPlayerTool.diamondsCost);
        additional_1.takeDiamondsFromHand(utils_1.player(playerName), TpToPlayerTool.diamondsCost);
        utils_1.player(playerName).teleport(sender);
        echo(sender, strings_1.default.tpToPlayerOk);
        echo(sender, strings_1.default.diamondsSpentCost + " " + TpToPlayerTool.diamondsCost);
        echo(utils_1.player(playerName), strings_1.default.tpToPlayerOk);
        echo(utils_1.player(playerName), strings_1.default.diamondsSpentCost + " " + TpToPlayerTool.diamondsCost);
    };
    TpToPlayerTool.tpCalls = {};
    TpToPlayerTool.tpWaitTimeMillis = 45 * 1000;
    TpToPlayerTool.isInit = false;
    return TpToPlayerTool;
}());
exports.default = TpToPlayerTool;
