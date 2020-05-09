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
        if (!player.getBedSpawnLocation()) {
            echo(player, strings.playerHasNoBed);
            return;
        }

        if (!takeDiamondAccordingToPlayerStatus(player, BedTpTool.diamondsCost)) {
            return;
        }

        player.teleport(player.getBedSpawnLocation());
        echo(player, strings.playerTpToBed);
    }
}
