"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var strings_1 = require("./strings");
var diamondsKey = 'minecraft:diamond';
function isPlayerHasEnoughDiamondsInHand(player, count) {
    if (count <= 0) {
        return true;
    }
    var handItem = player.getItemInHand();
    return handItem.getType().getKey().toString() === diamondsKey
        && handItem.getAmount() >= count;
}
exports.isPlayerHasEnoughDiamondsInHand = isPlayerHasEnoughDiamondsInHand;
function takeDiamondsFromHand(player, count) {
    if (count <= 0) {
        return true;
    }
    if (!isPlayerHasEnoughDiamondsInHand(player, count)) {
        return false;
    }
    var itemInHand = player.getItemInHand();
    var currentDiamondsAmount = itemInHand.getAmount();
    itemInHand.setAmount(currentDiamondsAmount - count);
    return true;
}
exports.takeDiamondsFromHand = takeDiamondsFromHand;
function takeDiamondAccordingToPlayerStatus(player, diamondsCost, isWantSendMessage) {
    if (player.isOp()
        && (player.getGameMode().getValue() === 1 || player.getGameMode().getValue() === 3)) {
        return true;
    }
    if (!takeDiamondsFromHand(player, diamondsCost)) {
        if (isWantSendMessage) {
            echo(player, strings_1.default.youNeedDiamondsInHand + " " + diamondsCost);
        }
        return false;
    }
    echo(player, strings_1.default.diamondsSpentCost + " " + diamondsCost);
    return true;
}
exports.takeDiamondAccordingToPlayerStatus = takeDiamondAccordingToPlayerStatus;
function isPlayerOnline(playerName) {
    return utils_1.players().some(function (player) { return player.name === playerName; });
}
exports.isPlayerOnline = isPlayerOnline;
function indexOfObjectFromArray(arrayOfObjects, key, value) {
    var idx = -1;
    for (var i = 0; i < arrayOfObjects.length; i += 1) {
        if (arrayOfObjects[i][key] === value) {
            idx = i;
            break;
        }
    }
    return idx;
}
exports.indexOfObjectFromArray = indexOfObjectFromArray;
