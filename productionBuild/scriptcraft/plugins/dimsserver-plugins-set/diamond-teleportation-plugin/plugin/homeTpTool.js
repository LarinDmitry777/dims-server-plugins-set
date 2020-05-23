"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("utils");
var typePatch_1 = require("../../typePatch");
var additional_1 = require("./additional");
var strings_1 = require("./strings");
var HomeTpTool = (function () {
    function HomeTpTool() {
    }
    HomeTpTool.init = function (setHomeDiamondsCost, tpDiamondsCost) {
        if (HomeTpTool.isInit) {
            return;
        }
        HomeTpTool.isInit = true;
        HomeTpTool.tpDiamondsCost = tpDiamondsCost;
        HomeTpTool.setHomeDiamondsCost = setHomeDiamondsCost;
        typePatch_1.commando('sethome', HomeTpTool.setHomeHandler);
        typePatch_1.commando('home', HomeTpTool.homeHandler);
    };
    HomeTpTool.setHomeHandler = function (args, player) {
        if (args.length > 0) {
            echo(player, strings_1.default.wrongSyntax);
            return;
        }
        if (!additional_1.takeDiamondAccordingToPlayerStatus(player, HomeTpTool.setHomeDiamondsCost, true)) {
            return;
        }
        HomeTpTool.homesPersist[player.name] = utils_1.locationToJSON(player.getLocation());
        echo(player, strings_1.default.homeCreated);
    };
    HomeTpTool.homeHandler = function (args, player) {
        if (args.length > 0) {
            echo(player, strings_1.default.wrongSyntax);
            return;
        }
        if (HomeTpTool.homesPersist[player.name] === undefined) {
            echo(player, strings_1.default.playerHasNoHome);
            return;
        }
        if (!additional_1.takeDiamondAccordingToPlayerStatus(player, HomeTpTool.tpDiamondsCost, true)) {
            return;
        }
        player.teleport(utils_1.locationFromJSON(HomeTpTool.homesPersist[player.name]));
        echo(player, strings_1.default.playerTpToHome);
    };
    HomeTpTool.homesPersist = persist('homesPoints');
    HomeTpTool.isInit = false;
    return HomeTpTool;
}());
exports.default = HomeTpTool;
