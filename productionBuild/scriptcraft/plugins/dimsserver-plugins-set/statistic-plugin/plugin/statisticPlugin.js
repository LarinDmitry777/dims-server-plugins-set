"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var StatisticPlugin = (function () {
    function StatisticPlugin() {
    }
    StatisticPlugin.init = function (savePersistIntervalSec) {
        if (StatisticPlugin.isInit) {
            return;
        }
        StatisticPlugin.isInit = true;
        StatisticPlugin.initPersist();
        events.entityDeath(StatisticPlugin.entityDeathEventHandler);
        events.blockBreak(StatisticPlugin.blockBreakEventHandler);
        events.playerJoin(StatisticPlugin.playerJoinEventHandler);
        events.playerChat(StatisticPlugin.playerChatEventHandler);
        events.playerDeath(StatisticPlugin.playerDeathHandler);
        events.entityBreed(StatisticPlugin.entityBreadHandler);
        events.blockPlace(StatisticPlugin.blockPlaceEventHandler);
        events.furnaceExtract(StatisticPlugin.furnaceExtractEventHandler);
        events.playerFish(StatisticPlugin.playerFishEventHandler);
        events.enchantItem(StatisticPlugin.enchantItemHandler);
        setInterval(StatisticPlugin.savePersist, savePersistIntervalSec * 1000);
    };
    StatisticPlugin.initPersist = function (playerName) {
        var defaultValues = {
            joinCount: 0,
            chatMessagesCount: 0,
            playerDeathCount: 0,
            blockBreaksCount: 0,
            placedBlocksCount: 0,
            entitiesKillsCount: 0,
            breedAnimalsCount: 0,
            extractFurnaceCount: 0,
            fishingCount: 0,
            enchantItemsCount: 0,
            breedAnimals: {},
            entitiesKills: {},
            blocksBreak: {},
            furnaceItems: {},
            enchantItems: {},
            placedBlocks: {},
            uniquePlayers: [],
        };
        if (!playerName) {
            if (typeof StatisticPlugin.statisticPersist.players !== 'object') {
                StatisticPlugin.statisticPersist.players = {};
            }
            if (typeof StatisticPlugin.statisticPersist.uniquePlayersCount !== 'number') {
                StatisticPlugin.statisticPersist.uniquePlayersCount = 0;
            }
        }
        else if (StatisticPlugin.statisticPersist.players[playerName] === undefined) {
            StatisticPlugin.statisticPersist.players[playerName] = {};
            StatisticPlugin.statisticPersist.uniquePlayersCount++;
            StatisticPlugin.statisticPersist.uniquePlayers.push(playerName);
            server.dispatchCommand(server.consoleSender, "tp " + playerName + " -248 47 -216");
        }
        var objectForModify = playerName
            ? StatisticPlugin.statisticPersist.players[playerName]
            : StatisticPlugin.statisticPersist;
        for (var key in defaultValues) {
            if (objectForModify[key] === undefined || objectForModify[key] === null) {
                objectForModify[key] = defaultValues[key];
            }
        }
    };
    StatisticPlugin.savePersist = function () {
        var data = StatisticPlugin.statisticPersist;
        persist('statistic', data, true);
    };
    StatisticPlugin.fixBlockName = function (name) {
        return name.replace('wall_torch', 'torch')
            .replace('wall_sign', 'sign')
            .replace('wall_banner', 'banner')
            .replace('wall_head', 'head')
            .replace('wall_fan', 'fan')
            .replace('kelp_plant', 'kelp');
    };
    StatisticPlugin.isPlayerInSurvival = function (player) {
        return player.getGameMode().getValue() === 0;
    };
    StatisticPlugin.addValue = function (groupName, objectName, player, amount) {
        if (amount === void 0) { amount = 1; }
        if (!amount) {
            return;
        }
        var globalCount = StatisticPlugin.statisticPersist[groupName][objectName];
        StatisticPlugin.statisticPersist[groupName][objectName] = (globalCount === undefined || globalCount === null ? amount : globalCount + amount);
        var playerCount = StatisticPlugin.statisticPersist.players[player][groupName][objectName];
        StatisticPlugin.statisticPersist.players[player][groupName][objectName] = (playerCount === undefined || playerCount === null ? amount : playerCount + amount);
    };
    StatisticPlugin.addNumericValue = function (valueName, playerName, amount) {
        if (amount === void 0) { amount = 1; }
        if (!amount) {
            return;
        }
        StatisticPlugin.statisticPersist[valueName] += amount;
        StatisticPlugin.statisticPersist.players[playerName][valueName] += amount;
    };
    StatisticPlugin.playerJoinEventHandler = function (event) {
        var playerName = event.getPlayer().name;
        StatisticPlugin.initPersist(playerName);
        StatisticPlugin.addNumericValue('joinCount', playerName);
    };
    StatisticPlugin.entityDeathEventHandler = function (event) {
        var player = event.getEntity().getKiller();
        if (player === null
            || player === undefined
            || event.getEntity().getType().getName() === 'player') {
            return;
        }
        if (!StatisticPlugin.isPlayerInSurvival(event.getEntity().getKiller())) {
            return;
        }
        var playerName = player.name;
        var entityName = event.getEntity().getType().getName();
        StatisticPlugin.addNumericValue('entitiesKillsCount', playerName);
        StatisticPlugin.addValue('entitiesKills', entityName, playerName);
    };
    StatisticPlugin.blockBreakEventHandler = function (event) {
        var player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        var blockName = StatisticPlugin.fixBlockName(event.getBlock().type.getKey().toString());
        var playerName = player.name;
        StatisticPlugin.addNumericValue('blocksBreakCount', playerName);
        StatisticPlugin.addValue('blocksBreak', blockName, playerName);
    };
    StatisticPlugin.entityBreadHandler = function (event) {
        if (event.getBreeder() === null || event.getEntity() === null) {
            return;
        }
        var player = event.getBreeder();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        var animalName = event.getEntity()
            .getName().toLowerCase().replace(' ', '_');
        StatisticPlugin.addNumericValue('breedAnimalsCount', player.name);
        StatisticPlugin.addValue('breedAnimals', animalName, player.name);
    };
    StatisticPlugin.playerDeathHandler = function (event) {
        if (event.getEntity().getType().getName() !== 'player') {
            return;
        }
        var playerName = event.getEntity().name;
        StatisticPlugin.addNumericValue('playerDeathCount', playerName);
    };
    StatisticPlugin.playerChatEventHandler = function (event) {
        if (event.message.startsWith('/')) {
            return;
        }
        var playerName = event.getPlayer().name;
        StatisticPlugin.addNumericValue('chatMessagesCount', playerName);
    };
    StatisticPlugin.blockPlaceEventHandler = function (event) {
        var player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        var blockName = StatisticPlugin.fixBlockName(event.getBlock().type.getKey().toString());
        StatisticPlugin.addNumericValue('placedBlocksCount', player.name);
        StatisticPlugin.addValue('placedBlocks', blockName, player.name);
    };
    StatisticPlugin.furnaceExtractEventHandler = function (event) {
        if (event.getEventName() !== 'FurnaceExtractEvent') {
            return;
        }
        var player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        var itemName = event.getItemType().getKey().toString();
        var amount = event.getItemAmount();
        StatisticPlugin.addNumericValue('extractFurnaceCount', player.name);
        StatisticPlugin.addValue('furnaceItems', itemName, player.name, amount);
    };
    StatisticPlugin.playerFishEventHandler = function (event) {
        var fishState = event.getState().toString();
        if (fishState !== 'CAUGHT_FISH') {
            return;
        }
        var player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        StatisticPlugin.addNumericValue('fishingCount', player.name);
    };
    StatisticPlugin.enchantItemHandler = function (event) {
        var player = event.getEnchanter();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        var itemName = event.getItem().getType().getKey().toString();
        StatisticPlugin.addNumericValue('enchantItemsCount', player.name);
        StatisticPlugin.addValue('enchantItems', itemName, player.name);
    };
    StatisticPlugin.statisticPersist = persist('statistic');
    StatisticPlugin.isInit = false;
    return StatisticPlugin;
}());
exports.StatisticPlugin = StatisticPlugin;
