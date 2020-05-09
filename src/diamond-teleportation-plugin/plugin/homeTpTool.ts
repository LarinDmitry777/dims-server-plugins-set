import { locationFromJSON, locationToJSON } from 'utils';
import { commando } from '../../typePatch';

import { takeDiamondAccordingToPlayerStatus } from './additional';
import strings from './strings';

export default class HomeTpTool {
    private static homesPersist = persist('homesPoints');
    private static setHomeDiamondsCost: number;
    private static tpDiamondsCost: number;
    private static isInit = false;

    static init(setHomeDiamondsCost: number, tpDiamondsCost: number) {
        if (HomeTpTool.isInit) {
            return;
        }
        HomeTpTool.isInit = true;

        HomeTpTool.tpDiamondsCost = tpDiamondsCost;
        HomeTpTool.setHomeDiamondsCost = setHomeDiamondsCost;

        commando('sethome', HomeTpTool.setHomeHandler);
        commando('home', HomeTpTool.homeHandler);
    }

    private static setHomeHandler(args: string[], player: Player): void {
        if (args.length > 0) {
            echo(player, strings.wrongSyntax);
            return;
        }

        if (!takeDiamondAccordingToPlayerStatus(player, HomeTpTool.setHomeDiamondsCost, true)) {
            return;
        }

        HomeTpTool.homesPersist[player.name] = locationToJSON(player.getLocation());
        echo(player, strings.homeCreated);
    }

    private static homeHandler(args: string[], player: Player): void {
        if (args.length > 0) {
            echo(player, strings.wrongSyntax);
            return;
        }

        if (HomeTpTool.homesPersist[player.name] === undefined) {
            echo(player, strings.playerHasNoHome);
            return;
        }

        if (!takeDiamondAccordingToPlayerStatus(player, HomeTpTool.tpDiamondsCost, true)) {
            return;
        }

        player.teleport(locationFromJSON(HomeTpTool.homesPersist[player.name]));
        echo(player, strings.playerTpToHome);
    }
}
