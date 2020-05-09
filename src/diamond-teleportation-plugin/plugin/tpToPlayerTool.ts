import * as utils from 'utils';
import { player } from 'utils';
import strings from './strings';
import {
    isPlayerOnline, isPlayerHasEnoughDiamondsInHand, takeDiamondsFromHand, indexOfObjectFromArray,
} from './additional';

import { commando } from '../../typePatch';

interface TpRequest {
    playerName: string;
    date: number;
}

interface TpCallsContainer {
    [key: string]: TpRequest[];
}

export default class TpToPlayerTool {
    private tpCalls: TpCallsContainer = {};

    private readonly tpWaitTimeMillis = 45 * 1000;

    private readonly diamondsCost: number;

    constructor(diamondsCost: number) {
        this.diamondsCost = diamondsCost;

        // Вынужденная мера, так как для MagikCraft важно название функции.
        // Если функция является членом класса, то транспиляция меняет поле name.
        this.tpto = this.tpto.bind(this);
        commando(this.tpto, utils.players().map((p) => p.name));

        this.tpa = this.tpa.bind(this);
        commando(this.tpa, utils.players().map((p) => p.name));
    }

    private createTpCallRequest(fromPlayerName: string, toPlayerName: string): boolean {
        let playersTpCalls = this.tpCalls[toPlayerName];
        if (playersTpCalls === undefined) {
            playersTpCalls = [];
            this.tpCalls[toPlayerName] = playersTpCalls;
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

    private isHasTpRequest(toPlayerName: string, fromPlayerName: string): boolean {
        const playersTpCalls = this.tpCalls[toPlayerName];
        if (!Array.isArray(playersTpCalls)) {
            return false;
        }

        const tpRequestIndex = indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        if (tpRequestIndex === -1) {
            return false;
        }

        const tpRequest = playersTpCalls[tpRequestIndex];
        const tpDate = tpRequest.date;

        if (Date.now() > tpDate + this.tpWaitTimeMillis) {
            this.removeTpRequest(toPlayerName, fromPlayerName);
            return false;
        }

        return true;
    }

    private removeTpRequest(toPlayerName: string, fromPlayerName: string): void {
        const playersTpCalls = this.tpCalls[toPlayerName];
        if (!Array.isArray(playersTpCalls)) {
            return;
        }
        const indexOfRequest = indexOfObjectFromArray(playersTpCalls, 'playerName', fromPlayerName);
        playersTpCalls.splice(indexOfRequest, 1);
    }

    private readonly tpto = function tpto(params: string[], sender: Player): void {
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

        const isPersistSend = this.createTpCallRequest(sender.name, playerName);
        if (isPersistSend) {
            echo(sender, `${strings.tpRequestSendFromPlayer} ${playerName}`);
            echo(player(playerName), `${strings.tpRequestSendToPlayer} ${sender.name}`);
        } else {
            echo(sender, strings.tpRequestAlreadySend);
        }
    }

    private readonly tpa = function tpa(params: string[], sender: Player) {
        const playerName = params[0];
        if (playerName === undefined) {
            echo(sender, strings.typePlayerNameForTp);
            return;
        }
        if (!this.isHasTpRequest(sender.name, playerName)) {
            echo(sender, strings.tpRequestNotFound);
            return;
        }
        if (!isPlayerOnline(playerName)) {
            echo(sender, strings.playerNotFound);
            return;
        }
        if (!isPlayerHasEnoughDiamondsInHand(sender, this.diamondsCost)) {
            echo(sender, `${strings.youNeedDiamondsInHand} ${this.diamondsCost}`);
            return;
        }
        if (!isPlayerHasEnoughDiamondsInHand(player(playerName), this.diamondsCost)) {
            echo(player(playerName), `${strings.tpToPlayerError} ${playerName}`);
            echo(sender, `${strings.tpToPlayerError} ${playerName}`);
            return;
        }

        this.removeTpRequest(sender.name, playerName);
        takeDiamondsFromHand(sender, this.diamondsCost);
        takeDiamondsFromHand(player(playerName), this.diamondsCost);
        player(playerName).teleport(sender);

        echo(sender, strings.tpToPlayerOk);
        echo(player(playerName), strings.tpToPlayerOk);
    }
}
