"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statisticPlugin_1 = require("./statisticPlugin");
var config = require('../config.json');
if (config.isWork) {
    statisticPlugin_1.StatisticPlugin.init(config.savePersistIntervalSec);
}
