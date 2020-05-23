"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var utils_1 = require("utils");
var ChatEavesdroppingTool = (function () {
    function ChatEavesdroppingTool() {
    }
    ChatEavesdroppingTool.init = function () {
        if (ChatEavesdroppingTool.isInit) {
            return;
        }
        ChatEavesdroppingTool.isInit = true;
        events.playerCommandPreprocess(ChatEavesdroppingTool.playerChatEventHandler);
    };
    ChatEavesdroppingTool.playerChatEventHandler = function (event) {
        if (event.message.startsWith('/gamemode')) {
            return;
        }
        utils_1.players()
            .filter(function (player) { return player.isOp(); })
            .forEach(function (admin) {
            if (admin.name === event.player.name) {
                return;
            }
            var messageText = event.message;
            if (messageText.startsWith("/w " + admin.name)
                || messageText.startsWith("/tell " + admin.name)
                || messageText.startsWith("/msg " + admin.name)) {
                return;
            }
            var messageSender = event.player;
            echo(admin, "[" + messageSender.name + "]: " + messageText);
        });
    };
    ChatEavesdroppingTool.isInit = false;
    return ChatEavesdroppingTool;
}());
exports.default = ChatEavesdroppingTool;
