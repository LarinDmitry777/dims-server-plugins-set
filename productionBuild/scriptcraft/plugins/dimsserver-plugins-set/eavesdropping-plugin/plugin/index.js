"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatEavesdroppingTool_1 = require("./ChatEavesdroppingTool");
var conf = require('../config.json');
if (conf.isWork) {
    ChatEavesdroppingTool_1.default.init();
}
