import { players } from 'utils';
import { commando } from '../../typePatch';

// eslint-disable-next-line no-unused-vars
import { Coordinate } from './index';
import strings from './strings';

export default class EbanTool {
    private static adminPlayers: string[];
    private static prisonCoordinate: string;
    private static freedomCoordinate: string;
    private static isInit = false;

    static init(
        adminPlayers: string[],
        prison: Coordinate,
        freedom: Coordinate) {
        if (EbanTool.isInit) {
            return;
        }
        EbanTool.isInit = true;

        EbanTool.adminPlayers = adminPlayers;
        EbanTool.prisonCoordinate = `${prison.x} ${prison.y} ${prison.z}`;
        EbanTool.freedomCoordinate = `${freedom.x} ${freedom.y} ${freedom.z}`;

        commando('eban', EbanTool.banCommandHandler);
        commando('neban', EbanTool.pardonCommandHandler);
    }

    private static isCommandCanUse(bannedPlayerName: string, handlerPlayer: Player, isWantSendMessages: boolean): boolean {
        if (EbanTool.adminPlayers.indexOf(handlerPlayer.name) === -1) {
            if (isWantSendMessages) {
                echo(handlerPlayer, strings.noRights);
            }
            return false;
        }

        if (players().map((p) => p.name).indexOf(bannedPlayerName) === -1) {
            if (isWantSendMessages) {
                echo(handlerPlayer, 'Игрок не найден');
            }
            return false;
        }

        return true;
    }

    private static banCommandHandler(args: string[], handlerPlayer: Player): void {
        const bannedPlayerName = args[0];
        if (EbanTool.isCommandCanUse(bannedPlayerName, handlerPlayer, true)) {
            // @ts-ignore
            server.dispatchCommand(server.consoleSender, `tp ${bannedPlayerName} ${EbanTool.prisonCoordinate}`);
        }
    }

    private static pardonCommandHandler(args: string[], handlerPlayer: Player): void {
        const bannedPlayerName = args[0];
        if (EbanTool.isCommandCanUse(bannedPlayerName, handlerPlayer, true)) {
            // @ts-ignore
            server.dispatchCommand(server.consoleSender, `tp ${bannedPlayerName} ${EbanTool.freedomCoordinate}`);
        }
    }
}
