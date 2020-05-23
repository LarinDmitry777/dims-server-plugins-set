"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eban_tool_1 = require("./eban-tool");
var config = require('../config.json');
eban_tool_1.default.init(config.players, config.ebanTool.prison, config.ebanTool.freedom);
