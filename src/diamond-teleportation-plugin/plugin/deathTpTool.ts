import * as events from 'events';
import { locationFromJSON, locationToJSON } from 'utils';

import { commando } from '../../typePatch';
import { takeDiamondAccordingToPlayerStatus } from './additional';
import strings from './strings';

export default class DeathTpTool {
    private static deathPointPersist = persist('deathPoints');
    private static diamondsCost: number;
    private static isInit = false;

    static init(diamondsCost: number) {
        if (DeathTpTool.isInit) {
            return;
        }
        DeathTpTool.isInit = true;

        DeathTpTool.diamondsCost = diamondsCost;
        events.playerDeath(DeathTpTool.playerDeathEventHandler);
        commando('tpdeath', DeathTpTool.tpDeathHandler);
    }

    private static tpDeathHandler(_args: string[], player: Player): void {
        const deathLocation = DeathTpTool.getPlayerDeathPoint(player);
        if (deathLocation === undefined) {
            echo(player, strings.playerHasNoDeathPoint);
            return;
        }

        if (!takeDiamondAccordingToPlayerStatus(player, DeathTpTool.diamondsCost)) {
            return;
        }

        player.teleport(deathLocation);
        echo(player, strings.playerTpToDeath);
    }

    private static getPlayerDeathPoint(player: Player): Location | undefined {
        const deathJson = DeathTpTool.deathPointPersist[player.name];
        return deathJson !== undefined ? locationFromJSON(deathJson) : undefined;
    }

    private static playerDeathEventHandler(event: PlayerDeathEvent): void {
        DeathTpTool.deathPointPersist[event.getEntity().name] = locationToJSON(event
            .getEntity().getLocation());
    }
}
