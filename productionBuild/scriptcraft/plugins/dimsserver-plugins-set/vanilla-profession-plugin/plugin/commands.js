"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = require("./strings");
var scoreboard_1 = require("./scoreboard");
var typePatch_1 = require("../../typePatch");
var CommandPlugin = (function () {
    function CommandPlugin(testersManager, showScoreboard) {
        typePatch_1.commando('iamtester', function (_args, player) {
            var operationResult = testersManager.addPlayerToTesters(player);
            if (operationResult) {
                echo(player, strings_1.strings.playerNowTester);
                showScoreboard(player);
            }
            else {
                echo(player, strings_1.strings.playerAlreadyTester);
            }
        });
        typePatch_1.commando('iamnottester', function (_args, player) {
            var operationResult = testersManager.removePlayerFromTesters(player);
            if (operationResult) {
                echo(player, strings_1.strings.playerNowIsNotTester);
                scoreboard_1.ProfessionScoreboardManager.removeScoreboardForPlayer(player);
            }
            else {
                echo(player, strings_1.strings.playerIsNotTester);
            }
        });
        typePatch_1.commando('testerslist', function (_args, player) {
            if (!player.isOp) {
                echo(player, strings_1.strings.commonPlayerExecAdminCommandException);
                return;
            }
            echo(player, "[" + testersManager.getTestersNames().join(', ') + "]");
        });
    }
    return CommandPlugin;
}());
exports.CommandPlugin = CommandPlugin;
