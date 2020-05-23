"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Professions;
(function (Professions) {
    Professions["MINER"] = "MINER";
    Professions["FARMER"] = "FARMER";
})(Professions = exports.Professions || (exports.Professions = {}));
var ExperienceManager = (function () {
    function ExperienceManager(testersManager, scoreboardManager) {
        var _a;
        this.professionPersists = (_a = {},
            _a[Professions.MINER] = persist(ExperienceManager.getPersistName(Professions.MINER)),
            _a[Professions.FARMER] = persist(ExperienceManager.getPersistName(Professions.FARMER)),
            _a);
        this.testersManager = testersManager;
        this.scoreboardManager = scoreboardManager;
    }
    ExperienceManager.getPersistName = function (profession) {
        return "experience_" + profession;
    };
    ExperienceManager.createPersistEntityIfNotExist = function (professionPersist, player) {
        if (professionPersist[player.name] === undefined) {
            professionPersist[player.name] = {
                experience: 0,
                level: 1,
            };
        }
    };
    ExperienceManager.prototype.increaseExp = function (profession, player, expIncrease) {
        var professionPersist = this.professionPersists[profession];
        ExperienceManager.createPersistEntityIfNotExist(professionPersist, player);
        var professionEntity = professionPersist[player.name];
        var experience = professionEntity.experience;
        var level = professionEntity.level;
        experience += expIncrease;
        while (level !== index_1.maxLevel && experience >= index_1.levelsExp[level]) {
            experience -= index_1.levelsExp[level];
            level += 1;
        }
        professionPersist[player.name] = { experience: experience, level: level };
        if (this.testersManager.isPlayerTester(player)) {
            this.showScoreboard(player);
        }
    };
    ExperienceManager.prototype.showScoreboard = function (player) {
        var scoreboardData = [];
        for (var persistName in this.professionPersists) {
            var persist_1 = this.professionPersists[persistName];
            ExperienceManager.createPersistEntityIfNotExist(persist_1, player);
            var professionEntity = persist_1[player.name];
            var exp = professionEntity.experience;
            var lvl = professionEntity.level;
            var expPercents = lvl !== index_1.maxLevel
                ? (exp / index_1.levelsExp[lvl] * 100).toFixed(2)
                : '100';
            scoreboardData.push({
                professionName: Professions[persistName],
                expPercents: expPercents,
                lvl: lvl.toString(),
            });
        }
        this.scoreboardManager.showPlayerProfessionsScore(player, scoreboardData);
    };
    return ExperienceManager;
}());
exports.ExperienceManager = ExperienceManager;
