import * as utils from 'utils';
import { player } from 'utils';
import { commando } from '../../typePatch';

import strings from './strings';
import {
    isPlayerOnline,
    isPlayerHasEnoughDiamondsInHand,
    takeDiamondsFromHand,
    indexOfObjectFromArray,
} from './additional';

interface TpRequest {
    playerName: string;
    date: number;
}

interface TpCallsContainer {
    [key: string]: TpRequest[];
}

export default class TpToPlayerTool {
    private static tpCalls: TpCallsContainer = {};
    private static tpWaitTimeMillis = 45 * 1000;
    private static diamondsCost: number;
    private static isInit = false;

    static init(diamondsCost: number) {
        if (TpToPlayerTool.isInit) {
            return;
        }
        TpToPlayerTool.isInit = true;

        TpToPlayerTool.diamondsCost = diamondsCost;

        commando('call', TpToPlayerTool.callHandler);
        commando('tpa', TpToPlayerTool.tpaHandler);
    }

    private static createTpCallRequest(fromPlayerName: string, toPlayerName: string): boolean {
        let playersTpCalls = TpToPlayerTool.tpCalls[toPlayerName];
        if (playersTpCalls === undefined) {
            playersTpCalls = [];
            TpToPlayerTool.tpCalls[toPlayerName] = playersTpCalls;
        }

        const callRequestIndex = indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        if (callRequestIndex !== -1) {
            playersTpCalls[callRequestIndex].date = Date.now();
            return false;
        }

        playersTpCalls.push({
            playerName: fromPlayerName,
            date: Date.now(),
        });

        return true;
    }

    private static isHasTpRequest(toPlayerName: string, fromPlayerName: string): boolean {
        const playersTpCalls = TpToPlayerTool.tpCalls[toPlayerName];
        if (!Array.isArray(playersTpCalls)) {
            return false;
        }

        const tpRequestIndex = indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        if (tpRequestIndex === -1) {
            return false;
        }

        const tpRequest = playersTpCalls[tpRequestIndex];
        const tpDate = tpRequest.date;

        if (Date.now() > tpDate + TpToPlayerTool.tpWaitTimeMillis) {
            TpToPlayerTool.removeTpRequest(toPlayerName, fromPlayerName);
            return false;
        }

        return true;
    }

    private static removeTpRequest(toPlayerName: string, fromPlayerName: string): void {
        const playersTpCalls = TpToPlayerTool.tpCalls[toPlayerName];
        if (!Array.isArray(playersTpCalls)) {
            return;
        }

        const indexOfRequest = indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        playersTpCalls.splice(indexOfRequest, 1);
    }

    private static callHandler(params: string[], sender: Player) {
        const playerName = params[0];
        if (playerName === undefined) {
            echo(sender, strings.typePlayerNameForTp);
            return;
        }
        if (playerName === sender.name) {
            echo(sender, strings.tpToSelf);
            return;
        }
        if (!isPlayerOnline(playerName)) {
            echo(sender, strings.playerNotFound);
            return;
        }
        if (!isPlayerHasEnoughDiamondsInHand(sender, TpToPlayerTool.diamondsCost)) {
            echo(sender, `${strings.youNeedDiamondsInHand} ${TpToPlayerTool.diamondsCost}`);
            return;
        }

        const isPersistSend = TpToPlayerTool.createTpCallRequest(sender.name, playerName);
        if (isPersistSend) {
            echo(sender, `${strings.tpRequestSendFromPlayer} ${playerName}`);
            echo(player(playerName), `${strings.tpRequestSendToPlayer} ${sender.name}`);
        } else {
            echo(sender, strings.tpRequestAlreadySend);
        }
    }

    private static tpaHandler(params: string[], sender: Player) {
        const playerName = params[0];
        if (playerName === undefined) {
            echo(sender, strings.typePlayerNameForTp);
            return;
        }
        if (!TpToPlayerTool.isHasTpRequest(sender.name, playerName)) {
            echo(sender, strings.tpRequestNotFound);
            return;
        }
        if (!isPlayerOnline(playerName)) {
            echo(sender, strings.playerNotFound);
            return;
        }
        if (!isPlayerHasEnoughDiamondsInHand(sender, TpToPlayerTool.diamondsCost)) {
            echo(sender, `${strings.youNeedDiamondsInHand} ${TpToPlayerTool.diamondsCost}`);
            return;
        }
        if (!isPlayerHasEnoughDiamondsInHand(player(playerName), TpToPlayerTool.diamondsCost)) {
            echo(player(playerName), `${strings.tpToPlayerError} ${playerName}`);
            echo(sender, `${strings.tpToPlayerError} ${playerName}`);
            return;
        }

        TpToPlayerTool.removeTpRequest(sender.name, playerName);
        takeDiamondsFromHand(sender, TpToPlayerTool.diamondsCost);
        takeDiamondsFromHand(player(playerName), TpToPlayerTool.diamondsCost);
        player(playerName).teleport(sender);

        echo(sender, strings.tpToPlayerOk);
        echo(sender, `${strings.diamondsSpentCost} ${TpToPlayerTool.diamondsCost}`);
        echo(player(playerName), strings.tpToPlayerOk);
        echo(player(playerName), `${strings.diamondsSpentCost} ${TpToPlayerTool.diamondsCost}`);
    }
}
