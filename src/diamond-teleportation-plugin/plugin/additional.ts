import { players } from 'utils';

import strings from './strings';

const diamondsKey = 'minecraft:diamond';

export function isPlayerHasEnoughDiamondsInHand(player: Player, count: number): boolean {
    if (count <= 0) {
        return true;
    }

    const handItem = player.getItemInHand();
    return handItem.getType().getKey().toString() === diamondsKey
        && handItem.getAmount() >= count;
}

export function takeDiamondsFromHand(player: Player, count: number): boolean {
    if (count <= 0) {
        return true;
    }
    if (!isPlayerHasEnoughDiamondsInHand(player, count)) {
        return false;
    }
    const itemInHand = player.getItemInHand();
    const currentDiamondsAmount = itemInHand.getAmount();
    itemInHand.setAmount(currentDiamondsAmount - count);

    return true;
}

export function takeDiamondAccordingToPlayerStatus(
    player: Player,
    diamondsCost: number,
    isWantSendMessage: boolean)
  : boolean {
    if (player.isOp()
      && (player.getGameMode().getValue() === 1 || player.getGameMode().getValue() === 3)) {
        return true;
    }

    if (!takeDiamondsFromHand(player, diamondsCost)) {
        if (isWantSendMessage) {
            echo(player, `${strings.youNeedDiamondsInHand} ${diamondsCost}`);
        }
        return false;
    }
    echo(player, `${strings.diamondsSpentCost} ${diamondsCost}`);
    return true;
}

export function isPlayerOnline(playerName): boolean {
    return players().some((player) => player.name === playerName);
}

export function indexOfObjectFromArray(
    arrayOfObjects: object[],
    key: string,
    value: string,
): number {
    let idx = -1;
    for (let i = 0; i < arrayOfObjects.length; i += 1) {
        if (arrayOfObjects[i][key] === value) {
            idx = i;
            break;
        }
    }

    return idx;
}
