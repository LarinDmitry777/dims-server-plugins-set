"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bedTpTool_1 = require("./bedTpTool");
var spawnTpTool_1 = require("./spawnTpTool");
var homeTpTool_1 = require("./homeTpTool");
var tpToPlayerTool_1 = require("./tpToPlayerTool");
var deathTpTool_1 = require("./deathTpTool");
var config = require('../config.json');
if (config.bedTpTool.isWork) {
    bedTpTool_1.default.init(config.bedTpTool.diamondsCost);
}
if (config.spawnTpTool.isWork) {
    spawnTpTool_1.default.init(config.spawnTpTool.diamondsCost);
}
if (config.homeTpTool.isWork) {
    homeTpTool_1.default.init(config.homeTpTool.setHomeDiamondsCost, config.homeTpTool.tpDiamondsCost);
}
if (config.tpToPlayerTool.isWork) {
    tpToPlayerTool_1.default.init(config.tpToPlayerTool.diamondsCost);
}
if (config.deathTpTool.isWork) {
    deathTpTool_1.default.init(config.deathTpTool.diamondsCost);
}
