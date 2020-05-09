import { world } from 'utils';
import { commando } from '../../typePatch';

import { takeDiamondAccordingToPlayerStatus } from './additional';
import strings from './strings';

export default class SpawnTpTool {
    private static diamondsCost: number;
    private static isInit= false;

    static init(diamondsCost: number) {
        if (SpawnTpTool.isInit) {
            return;
        }
        SpawnTpTool.isInit = true;

        SpawnTpTool.diamondsCost = diamondsCost;
        commando('spawn', SpawnTpTool.spawnCommandHandler);
    }

    private static spawnCommandHandler(_args: string[], player: Player): void {
        if (!takeDiamondAccordingToPlayerStatus(player, SpawnTpTool.diamondsCost, true)) {
            return;
        }

        const spawnLocation: Location = world('world').getSpawnLocation();
        player.teleport(spawnLocation);
        echo(player, strings.playerTpToSpawn);
    }
}
