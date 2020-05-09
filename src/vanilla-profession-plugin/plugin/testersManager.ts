interface TestersPersist {
    names: string[];
}

export class TestersManager {
    private testersPersist: TestersPersist = persist('testersList');

    getTestersNames(): string[] {
        return this.testersPersist.names.slice();
    }

    private createPersistDataIfNotCreated(): void {
        if (this.testersPersist.names === undefined) {
            this.testersPersist.names = [];
        }
    }

    isPlayerTester(player: Player): boolean {
        this.createPersistDataIfNotCreated();
        return this.testersPersist.names.indexOf(player.name) !== -1;
    }

    addPlayerToTesters(player: Player): boolean {
        this.createPersistDataIfNotCreated();
        if (this.isPlayerTester(player)) {
            return false;
        }
        this.testersPersist.names.push(player.name);

        return true;
    }

    removePlayerFromTesters(player: Player): boolean {
        this.createPersistDataIfNotCreated();

        const testerNames = this.testersPersist.names;
        const playerIdx = testerNames.indexOf(player.name);

        if (playerIdx === -1) {
            return false;
        }
        testerNames.splice(playerIdx, 1);

        return true;
    }
}
