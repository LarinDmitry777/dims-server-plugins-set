"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TestersManager = (function () {
    function TestersManager() {
        this.testersPersist = persist('testersList');
    }
    TestersManager.prototype.getTestersNames = function () {
        return this.testersPersist.names.slice();
    };
    TestersManager.prototype.createPersistDataIfNotCreated = function () {
        if (this.testersPersist.names === undefined) {
            this.testersPersist.names = [];
        }
    };
    TestersManager.prototype.isPlayerTester = function (player) {
        this.createPersistDataIfNotCreated();
        return this.testersPersist.names.indexOf(player.name) !== -1;
    };
    TestersManager.prototype.addPlayerToTesters = function (player) {
        this.createPersistDataIfNotCreated();
        if (this.isPlayerTester(player)) {
            return false;
        }
        this.testersPersist.names.push(player.name);
        return true;
    };
    TestersManager.prototype.removePlayerFromTesters = function (player) {
        this.createPersistDataIfNotCreated();
        var testerNames = this.testersPersist.names;
        var playerIdx = testerNames.indexOf(player.name);
        if (playerIdx === -1) {
            return false;
        }
        testerNames.splice(playerIdx, 1);
        return true;
    };
    return TestersManager;
}());
exports.TestersManager = TestersManager;
