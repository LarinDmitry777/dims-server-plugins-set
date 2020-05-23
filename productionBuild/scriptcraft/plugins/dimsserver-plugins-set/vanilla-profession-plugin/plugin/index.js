"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var scoreboard_1 = require("./scoreboard");
var config = require('../config.json');
exports.levelsExp = config.levelsExp;
exports.maxLevel = config.maxLevel;
events.playerJoin(function (event) {
    scoreboard_1.ProfessionScoreboardManager.removeScoreboardForPlayer(event.player);
});
