import * as events from 'events';
import { players } from 'utils';
import { CommandPlugin } from './commands';
import { ExperienceManager } from './ExperienceManager';
import { FarmPointsAssigner, MinerPointsAssigner } from './PointAssigner';
import { ProfessionScoreboardManager } from './scoreboard';
import { TestersManager } from './testersManager';

export class ProfessionsPlugin {
    constructor(isWork = true) {
        if (!isWork) {
            this.notWorkHandler();
            return;
        }

        const testersManager = new TestersManager();
        const scoreboardManager = new ProfessionScoreboardManager();
        const experienceManager = new ExperienceManager(testersManager, scoreboardManager);

        const showScoreboardFunction = experienceManager.showScoreboard.bind(experienceManager);

        this.updatePlayersScoreBoards(testersManager, showScoreboardFunction);
        events.playerJoin((playerJoinEvent: PlayerJoinEvent) => ProfessionsPlugin.playerJoinHandler(playerJoinEvent, testersManager, showScoreboardFunction));

        new CommandPlugin(testersManager, showScoreboardFunction);
        new MinerPointsAssigner(testersManager, experienceManager);
        new FarmPointsAssigner(testersManager, experienceManager);
    }

    private notWorkHandler(): void {
        events.playerJoin((event) => {
            ProfessionScoreboardManager.removeScoreboardForPlayer(event.player);
        });
    }

    private updatePlayersScoreBoards(testersManager: TestersManager, showScoreboardFunction: {(player: Player): void}): void {
        players().forEach((player) => {
            ProfessionScoreboardManager.removeScoreboardForPlayer(player);
            if (testersManager.isPlayerTester(player)) {
                showScoreboardFunction(player);
            }
        });
    }

    private static playerJoinHandler(playerJoinEvent: PlayerJoinEvent,
        testersManager: TestersManager,
        showScoreboardFunction: {(player: Player): void}): void{
    // Don`touch this. It`s fix bug with incorrect raws.
        ProfessionScoreboardManager.removeScoreboardForPlayer(playerJoinEvent.player);
        if (testersManager.isPlayerTester(playerJoinEvent.player)) {
            showScoreboardFunction(playerJoinEvent.player);
        }
    }
}
