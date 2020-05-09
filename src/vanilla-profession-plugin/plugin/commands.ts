import { strings } from './strings';
import { ProfessionScoreboardManager } from './scoreboard';
import { TestersManager } from './testersManager';
import { commando } from '../../typePatch';

export class CommandPlugin {
    constructor(testersManager: TestersManager, showScoreboard: {(player: Player): void}) {
        commando('iamtester', (_args: string[], player: Player) => {
            const operationResult = testersManager.addPlayerToTesters(player);

            if (operationResult) {
                echo(player, strings.playerNowTester);
                showScoreboard(player);
            } else {
                echo(player, strings.playerAlreadyTester);
            }
        });

        commando('iamnottester', (_args: string[], player: Player) => {
            const operationResult = testersManager.removePlayerFromTesters(player);

            if (operationResult) {
                echo(player, strings.playerNowIsNotTester);
                ProfessionScoreboardManager.removeScoreboardForPlayer(player);
            } else {
                echo(player, strings.playerIsNotTester);
            }
        });

        commando('testerslist', (_args: string[], player: Player) => {
            if (!player.isOp) {
                echo(player, strings.commonPlayerExecAdminCommandException);
                return;
            }

            echo(player, `[${testersManager.getTestersNames().join(', ')}]`);
        });
    }
}
