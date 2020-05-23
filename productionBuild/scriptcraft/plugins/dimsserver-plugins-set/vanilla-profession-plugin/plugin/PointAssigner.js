"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var events = require("events");
var utils_1 = require("utils");
var ExperienceManager_1 = require("./ExperienceManager");
var PointAssigner = (function () {
    function PointAssigner(testersManager, experienceManager) {
        this.testersManager = testersManager;
        this.experienceManager = experienceManager;
        this.furnaceExtractEventHandler = this.furnaceExtractEventHandler.bind(this);
        this.blockBreakEventHandler = this.blockBreakEventHandler.bind(this);
    }
    PointAssigner.prototype.pointsIncomeHandler = function (player, count, profession) {
        this.experienceManager.increaseExp(profession, player, count);
    };
    PointAssigner.prototype.blockBreakEventHandler = function (event, itemsCosts, profession, isSelfReplicatedItem) {
        if (isSelfReplicatedItem === void 0) { isSelfReplicatedItem = false; }
        if (event === undefined || event.getEventName() !== 'BlockBreakEvent') {
            return;
        }
        if (!this.testersManager.isPlayerTester(event.getPlayer())) {
            return;
        }
        var breakTool = event.getPlayer().getItemInHand();
        var droppedItems = event.block.getDrops(breakTool);
        var points = 0;
        droppedItems.forEach(function (droppedItem) {
            var itemName = droppedItem.getType().getKey().toString();
            var pointForItem = itemsCosts[itemName];
            if (pointForItem !== undefined) {
                var itemsCount = droppedItem.getAmount();
                if (isSelfReplicatedItem) {
                    itemsCount = Math.max(0, itemsCount - 1);
                }
                points += pointForItem * itemsCount;
            }
        });
        if (points > 0) {
            this.pointsIncomeHandler(event.getPlayer(), points, profession);
        }
    };
    PointAssigner.prototype.animalBreedEvent = function (event, pointsObject, profession) {
        if (event === undefined || event.getEventName() !== 'EntityBreedEvent') {
            return;
        }
        if (event.getBreeder() === null || event.getEntity() === null) {
            return;
        }
        var breederPlayer = utils_1.player(event.getBreeder().getName());
        var breededAnimalName = event.getEntity().getName();
        if (breederPlayer === null || breededAnimalName === null) {
            return;
        }
        var points = pointsObject[breededAnimalName];
        if (points !== undefined && points > 0) {
            this.pointsIncomeHandler(breederPlayer, points, profession);
        }
    };
    PointAssigner.prototype.shearEntityEvent = function (event, pointsObject, profession) {
        if (event === undefined || event.getEventName() !== 'PlayerShearEntityEvent') {
            return;
        }
        var player = event.getPlayer();
        var entityName = event.getEntity().getName();
        console.log(entityName);
        var pointsCount = pointsObject[entityName];
        if (pointsCount !== undefined && pointsCount > 0) {
            this.pointsIncomeHandler(player, pointsCount, profession);
        }
    };
    PointAssigner.prototype.furnaceExtractEventHandler = function (event, itemsCost, profession) {
        if (event === undefined || event.getEventName() !== 'FurnaceExtractEvent') {
            return;
        }
        if (!this.testersManager.isPlayerTester(event.getPlayer())) {
            return;
        }
        var itemName = event.getItemType().getKey().toString();
        var pointsForOneItem = itemsCost[itemName];
        if (pointsForOneItem === undefined) {
            return;
        }
        var player = event.getPlayer();
        var amount = event.getItemAmount();
        var points = pointsForOneItem * amount;
        this.pointsIncomeHandler(player, points, profession);
    };
    return PointAssigner;
}());
var MinerPointsAssigner = (function (_super) {
    __extends(MinerPointsAssigner, _super);
    function MinerPointsAssigner(testersManager, experienceManager) {
        var _this = _super.call(this, testersManager, experienceManager) || this;
        _this.expPerItems = {
            'minecraft:coal': 5,
            'minecraft:diamond': 75,
            'minecraft:redstone': 1,
            'minecraft:iron_ingot': 20,
            'minecraft:gold_ingot': 30,
            'minecraft:lapis_lazuli': 5,
            'minecraft:quartz': 7,
        };
        events.blockBreak(function (event) { return _super.prototype.blockBreakEventHandler.call(_this, event, _this.expPerItems, ExperienceManager_1.Professions.MINER); });
        events.furnaceExtract(function (event) { return _this.furnaceExtractEventHandler(event, _this.expPerItems, ExperienceManager_1.Professions.MINER); });
        return _this;
    }
    return MinerPointsAssigner;
}(PointAssigner));
exports.MinerPointsAssigner = MinerPointsAssigner;
var FarmPointsAssigner = (function (_super) {
    __extends(FarmPointsAssigner, _super);
    function FarmPointsAssigner(testersManager, experienceManager) {
        var _this = _super.call(this, testersManager, experienceManager) || this;
        _this.blockBreakNotSelfReplicated = {
            'minecraft:wheat': 3,
            'minecraft:beetroot': 3,
            'minecraft:melon_slice': 2,
            'minecraft:sweet_berries': 3,
        };
        _this.blockBreakSelfReplicated = {
            'minecraft:carrot': 3,
            'minecraft:potato': 3,
            'minecraft:wheat_seeds': 3,
            'minecraft:nether_wart': 5,
        };
        _this.breedPoints = {
            Cow: 7,
            Pig: 15,
            Sheep: 15,
            Chicken: 7,
            Wolf: 40,
            Horse: 70,
            Donkey: 50,
            Rabbit: 40,
            Turtle: 100,
            Panda: 50,
            Llama: 50,
        };
        _this.shearPoints = {
            Sheep: 5,
            Mooshroom: 500,
        };
        events.blockBreak(function (event) { return _super.prototype.blockBreakEventHandler.call(_this, event, _this.blockBreakNotSelfReplicated, ExperienceManager_1.Professions.FARMER); });
        events.blockBreak(function (event) { return _super.prototype.blockBreakEventHandler.call(_this, event, _this.blockBreakSelfReplicated, ExperienceManager_1.Professions.FARMER, true); });
        events.entityBreed(function (event) { return _super.prototype.animalBreedEvent.call(_this, event, _this.breedPoints, ExperienceManager_1.Professions.FARMER); });
        events.playerShearEntity(function (event) { return _super.prototype.shearEntityEvent.call(_this, event, _this.shearPoints, ExperienceManager_1.Professions.FARMER); });
        return _this;
    }
    return FarmPointsAssigner;
}(PointAssigner));
exports.FarmPointsAssigner = FarmPointsAssigner;
