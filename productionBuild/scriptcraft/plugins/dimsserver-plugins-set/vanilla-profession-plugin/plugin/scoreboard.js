"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var strings_1 = require("./strings");
var ExperienceManager_1 = require("./ExperienceManager");
var ProfessionScoreboardManager = (function () {
    function ProfessionScoreboardManager() {
        var _a;
        this.professionsTexts = (_a = {},
            _a[ExperienceManager_1.Professions.MINER] = strings_1.strings.professionMiner,
            _a[ExperienceManager_1.Professions.FARMER] = strings_1.strings.professionFarmer,
            _a);
        this.chatColorRed = org.bukkit.ChatColor.RED;
        this.chatColorGreen = org.bukkit.ChatColor.GREEN;
        this.chatColorGold = org.bukkit.ChatColor.GOLD;
        this.chatColorBlue = org.bukkit.ChatColor.GRAY;
        this.displaySideBar = org.bukkit.scoreboard.DisplaySlot.SIDEBAR;
        this.scoreboardManager = org.bukkit.Bukkit.getScoreboardManager();
    }
    ProfessionScoreboardManager.prototype.getPlayerScoreboard = function (player) {
        var existScoreboard = player.getScoreboard();
        if (existScoreboard !== undefined && existScoreboard !== null) {
            return existScoreboard;
        }
        var newScoreboard = this.scoreboardManager.getNewScoreboard();
        player.setScoreboard(newScoreboard);
        return newScoreboard;
    };
    ProfessionScoreboardManager.prototype.getObjective = function (scoreboard) {
        var objectiveName = 'profession';
        var objective = scoreboard.getObjective(objectiveName);
        if (objective !== null) {
            objective.unregister();
        }
        var objectiveDisplayName = "" + this.chatColorRed + strings_1.strings.scoreboardProfessionsName;
        objective = scoreboard.registerNewObjective(objectiveName, '', objectiveDisplayName);
        objective.setDisplaySlot(this.displaySideBar);
        return objective;
    };
    ProfessionScoreboardManager.prototype.showPlayerProfessionsScore = function (player, scoreboardEntityes) {
        var _this = this;
        var scoreboard = this.getPlayerScoreboard(player);
        var objective = this.getObjective(scoreboard);
        scoreboardEntityes.forEach(function (entity) {
            var scoreText = "" + _this.chatColorGold + _this.professionsTexts[entity.professionName] + " " + _this.chatColorGreen + entity.lvl + _this.chatColorBlue + "(" + entity.expPercents + "%)";
            var score = objective.getScore(scoreText);
            score.setScore(0);
        });
    };
    ProfessionScoreboardManager.removeScoreboardForPlayer = function (player) {
        player.setScoreboard(org.bukkit.Bukkit.getScoreboardManager().getNewScoreboard());
    };
    return ProfessionScoreboardManager;
}());
exports.ProfessionScoreboardManager = ProfessionScoreboardManager;
