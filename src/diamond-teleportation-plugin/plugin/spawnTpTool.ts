import { world } from 'utils';
import { commando } from '../../typePatch';
import { takeDiamondAccordingToPlayerStatus } from './additional';
import strings from './strings';

export default class SpawnTpTool {
    private static diamondsCost: number;

    static init(diamondsCost: number) {
        SpawnTpTool.diamondsCost = diamondsCost;
        commando('spawn', SpawnTpTool.spawnCommandHandler);
    }

    private static spawnCommandHandler(_args: string[], player: Player): void {
        if (!takeDiamondAccordingToPlayerStatus(player, SpawnTpTool.diamondsCost)) {
            return;
        }

        const spawnLocation: Location = world('world').getSpawnLocation();
        player.teleport(spawnLocation);
        // eslint-disable-next-line no-undef
        echo(player, strings.playerTpToSpawn);
    }
}
