"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var utils_1 = require("utils");
var commands_1 = require("./commands");
var ExperienceManager_1 = require("./ExperienceManager");
var PointAssigner_1 = require("./PointAssigner");
var scoreboard_1 = require("./scoreboard");
var testersManager_1 = require("./testersManager");
var ProfessionsPlugin = (function () {
    function ProfessionsPlugin(isWork) {
        if (isWork === void 0) { isWork = true; }
        if (!isWork) {
            this.notWorkHandler();
            return;
        }
        var testersManager = new testersManager_1.TestersManager();
        var scoreboardManager = new scoreboard_1.ProfessionScoreboardManager();
        var experienceManager = new ExperienceManager_1.ExperienceManager(testersManager, scoreboardManager);
        var showScoreboardFunction = experienceManager.showScoreboard.bind(experienceManager);
        this.updatePlayersScoreBoards(testersManager, showScoreboardFunction);
        events.playerJoin(function (playerJoinEvent) { return ProfessionsPlugin.playerJoinHandler(playerJoinEvent, testersManager, showScoreboardFunction); });
        new commands_1.CommandPlugin(testersManager, showScoreboardFunction);
        new PointAssigner_1.MinerPointsAssigner(testersManager, experienceManager);
        new PointAssigner_1.FarmPointsAssigner(testersManager, experienceManager);
    }
    ProfessionsPlugin.prototype.notWorkHandler = function () {
        events.playerJoin(function (event) {
            scoreboard_1.ProfessionScoreboardManager.removeScoreboardForPlayer(event.player);
        });
    };
    ProfessionsPlugin.prototype.updatePlayersScoreBoards = function (testersManager, showScoreboardFunction) {
        utils_1.players().forEach(function (player) {
            scoreboard_1.ProfessionScoreboardManager.removeScoreboardForPlayer(player);
            if (testersManager.isPlayerTester(player)) {
                showScoreboardFunction(player);
            }
        });
    };
    ProfessionsPlugin.playerJoinHandler = function (playerJoinEvent, testersManager, showScoreboardFunction) {
        scoreboard_1.ProfessionScoreboardManager.removeScoreboardForPlayer(playerJoinEvent.player);
        if (testersManager.isPlayerTester(playerJoinEvent.player)) {
            showScoreboardFunction(playerJoinEvent.player);
        }
    };
    return ProfessionsPlugin;
}());
exports.ProfessionsPlugin = ProfessionsPlugin;
