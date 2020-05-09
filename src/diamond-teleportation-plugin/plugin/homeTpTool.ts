import { locationFromJSON, locationToJSON } from 'utils';
import { commando } from '../../typePatch';
import { takeDiamondAccordingToPlayerStatus } from './additional';
import strings from './strings';

export default class HomeTpTool {
    private static homesPersistName = 'homes.json';

    private static homesPersist = persist(HomeTpTool.homesPersistName);

    private static setHomeDiamondsCost: number;

    private static tpDiamondsCost: number;

    static init(setHomeDiamondsCost: number, tpDiamondsCost: number) {
        HomeTpTool.tpDiamondsCost = tpDiamondsCost;
        HomeTpTool.setHomeDiamondsCost = setHomeDiamondsCost;

        commando('sethome', HomeTpTool.setHomeHandler);
        commando('home', HomeTpTool.homeHandler);
    }

    private static setHomeHandler(_args: string[], player: Player): void {
        if (!takeDiamondAccordingToPlayerStatus(player, HomeTpTool.setHomeDiamondsCost)) {
            return;
        }

        HomeTpTool.homesPersist[player.name] = locationToJSON(player.getLocation());
        // eslint-disable-next-line no-undef
        echo(player, strings.homeCreated);
    }

    private static homeHandler(_args: string[], player: Player): void {
        if (HomeTpTool.homesPersist[player.name] === undefined) {
        // eslint-disable-next-line no-undef
            echo(player, strings.playerHasNoHome);
            return;
        }
        if (!takeDiamondAccordingToPlayerStatus(player, HomeTpTool.tpDiamondsCost)) {
            return;
        }
        player.teleport(locationFromJSON(HomeTpTool.homesPersist[player.name]));
        echo(player, strings.playerTpToHome);
    }
}
