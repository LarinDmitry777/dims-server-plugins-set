import { commando } from '../../typePatch';

import { takeDiamondAccordingToPlayerStatus } from './additional';
import strings from './strings';

export default class BedTpTool {
    private static diamondsCost: number;
    private static isInit = false;

    static init(diamondsCost: number) {
        if (BedTpTool.isInit) {
            return;
        }
        BedTpTool.isInit = true;

        BedTpTool.diamondsCost = diamondsCost;
        commando('bed', BedTpTool.bedCommandHandler);
    }

    private static bedCommandHandler(_args: string[], player: Player): void {
        const bedSpawnLocation = player.getBedSpawnLocation();

        if (!bedSpawnLocation) {
            echo(player, strings.playerHasNoBed);
            return;
        }

        if (!takeDiamondAccordingToPlayerStatus(player, BedTpTool.diamondsCost, true)) {
            return;
        }

        player.teleport(bedSpawnLocation);
        echo(player, strings.playerTpToBed);
    }
}
