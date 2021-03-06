import * as events from 'events';

interface Statistics {
    entitiesKills: { [key: string]: number; };
    blocksBreak: { [key: string]: number; };
    breedAnimals: { [key: string]: number; };
    furnaceItems: { [key: string]: number; };
    enchantItems: { [key: string]: number; };
    placedBlocks: { [key: string]: number; };
    enemyKills: { [key: string]: number; };
    playerKills: { [key: string]: number; };
    joinCount: number;
    chatMessagesCount: number;
    playerDeathCount: number;
    blockBreaksCount: number;
    placedBlocksCount: number;
    entitiesKillsCount: number;
    breedAnimalsCount: number
    extractFurnaceCount: number;
    fishingCount: number;
    enchantItemsCount: number;
    uniquePlayers: string[];
}

interface StatisticPersist extends Statistics{
    players: { [key: string]: Statistics};
    uniquePlayersCount: number;
}


export class StatisticPlugin {
    private static statisticPersist: StatisticPersist = persist('statistic');
    private static isInit = false;

    static init(savePersistIntervalSec: number) {
        if (StatisticPlugin.isInit) {
            return;
        }
        StatisticPlugin.isInit = true;

        StatisticPlugin.initPersist();

        events.entityDeath(StatisticPlugin.entityDeathEventHandler);
        events.blockBreak(StatisticPlugin.blockBreakEventHandler);
        events.playerJoin(StatisticPlugin.playerJoinEventHandler);
        events.playerChat(StatisticPlugin.playerChatEventHandler);
        events.playerDeath(StatisticPlugin.playerDeathHandler);
        events.entityBreed(StatisticPlugin.entityBreadHandler);
        events.blockPlace(StatisticPlugin.blockPlaceEventHandler);
        events.furnaceExtract(StatisticPlugin.furnaceExtractEventHandler);
        events.playerFish(StatisticPlugin.playerFishEventHandler);
        events.enchantItem(StatisticPlugin.enchantItemHandler);

        setInterval(StatisticPlugin.savePersist, savePersistIntervalSec * 1000);
    }

    private static initPersist(playerName?: string): void {
        const defaultValues = {
            joinCount: 0,
            chatMessagesCount: 0,
            playerDeathCount: 0,
            blockBreaksCount: 0,
            placedBlocksCount: 0,
            entitiesKillsCount: 0,
            breedAnimalsCount: 0,
            extractFurnaceCount: 0,
            fishingCount: 0,
            enchantItemsCount: 0,
            breedAnimals: {},
            entitiesKills: {},
            blocksBreak: {},
            furnaceItems: {},
            enchantItems: {},
            placedBlocks: {},
            uniquePlayers: [],
        };

        if (!playerName) {
            if (typeof StatisticPlugin.statisticPersist.players !== 'object') {
                StatisticPlugin.statisticPersist.players = {};
            }
            if (typeof StatisticPlugin.statisticPersist.uniquePlayersCount !== 'number') {
                StatisticPlugin.statisticPersist.uniquePlayersCount = 0;
            }
        } else if (StatisticPlugin.statisticPersist.players[playerName] === undefined) {
            // @ts-ignore
            StatisticPlugin.statisticPersist.players[playerName] = {};
            StatisticPlugin.statisticPersist.uniquePlayersCount++;
            StatisticPlugin.statisticPersist.uniquePlayers.push(playerName);

            //todo ПЕРЕДЕЛАТЬ ЭТО
            // @ts-ignore
            server.dispatchCommand(server.consoleSender, `tp ${playerName} -248 47 -216`);
        }

        const objectForModify = playerName
            ? StatisticPlugin.statisticPersist.players[playerName]
            : StatisticPlugin.statisticPersist;

        for (const key in defaultValues) {
            if (objectForModify[key] === undefined || objectForModify[key] === null) {
                objectForModify[key] = defaultValues[key];
            }
        }
    }

    private static savePersist() {
        const data = StatisticPlugin.statisticPersist;
        persist('statistic', data, true);
    }

    private static fixBlockName(name: string) {
        return name.replace('wall_torch', 'torch')
            .replace('wall_sign', 'sign')
            .replace('wall_banner', 'banner')
            .replace('wall_head', 'head')
            .replace('wall_fan', 'fan')
            .replace('kelp_plant', 'kelp');
    }

    private static isPlayerInSurvival(player: Player): boolean {
        return player.getGameMode().getValue() === 0;
    }

    private static addValue(groupName: string, objectName: string, player: string, amount = 1) {
        if (!amount) {
            return;
        }

        let globalCount = StatisticPlugin.statisticPersist[groupName][objectName];
        StatisticPlugin.statisticPersist[groupName][objectName] = (globalCount === undefined || globalCount === null ? amount : globalCount + amount);

        let playerCount = StatisticPlugin.statisticPersist.players[player][groupName][objectName];
        StatisticPlugin.statisticPersist.players[player][groupName][objectName] = (playerCount === undefined || playerCount === null ? amount : playerCount + amount);
    }

    private static addNumericValue(valueName: string, playerName: string, amount = 1) {
        if (!amount) {
            return;
        }

        StatisticPlugin.statisticPersist[valueName] += amount;
        StatisticPlugin.statisticPersist.players[playerName][valueName] += amount;
    }


    private static playerJoinEventHandler(event: PlayerJoinEvent): void {
        const playerName: string = event.getPlayer().name;
        StatisticPlugin.initPersist(playerName);

        StatisticPlugin.addNumericValue('joinCount', playerName);
    }

    private static entityDeathEventHandler(event: EntityDeathEvent): void {
        const player = event.getEntity().getKiller();
        if (player === null
            || player === undefined
            || event.getEntity().getType().getName() === 'player') {
            return;
        }

        if (!StatisticPlugin.isPlayerInSurvival(event.getEntity().getKiller())) {
            return;
        }

        const playerName = player.name;
        const entityName: string = event.getEntity().getType().getName();

        StatisticPlugin.addNumericValue('entitiesKillsCount', playerName);
        StatisticPlugin.addValue('entitiesKills', entityName, playerName);
    }

    private static blockBreakEventHandler(event: BlockBreakEvent): void {
        const player: Player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const blockName = StatisticPlugin.fixBlockName(event.getBlock().type.getKey().toString());
        const playerName: string = player.name;

        StatisticPlugin.addNumericValue('blocksBreakCount', playerName);
        StatisticPlugin.addValue('blocksBreak', blockName, playerName);
    }

    private static entityBreadHandler(event) {
        if (event.getBreeder() === null || event.getEntity() === null) {
            return;
        }
        const player: Player = event.getBreeder();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        const animalName: string = event.getEntity()
            .getName().toLowerCase().replace(' ', '_');

        StatisticPlugin.addNumericValue('breedAnimalsCount', player.name);
        StatisticPlugin.addValue('breedAnimals', animalName, player.name);
    }

    private static playerDeathHandler(event: PlayerDeathEvent): void {
        if (event.getEntity().getType().getName() !== 'player') {
            return;
        }

        const playerName = event.getEntity().name;

        StatisticPlugin.addNumericValue('playerDeathCount', playerName);
    }

    private static playerChatEventHandler(event): void {
        if (event.message.startsWith('/')) {
            return;
        }
        const playerName: string = event.getPlayer().name;

        StatisticPlugin.addNumericValue('chatMessagesCount', playerName);
    }

    private static blockPlaceEventHandler(event: BlockPlaceEvent): void {
        const player: Player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const blockName = StatisticPlugin.fixBlockName(event.getBlock().type.getKey().toString());

        StatisticPlugin.addNumericValue('placedBlocksCount', player.name);
        StatisticPlugin.addValue('placedBlocks', blockName, player.name);
    }

    private static furnaceExtractEventHandler(event): void {
        if (event.getEventName() !== 'FurnaceExtractEvent') {
            return;
        }

        const player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const itemName: string = event.getItemType().getKey().toString();
        const amount: number = event.getItemAmount();

        StatisticPlugin.addNumericValue('extractFurnaceCount', player.name);
        StatisticPlugin.addValue('furnaceItems', itemName, player.name, amount);
    }

    private static playerFishEventHandler(event): void {
        const fishState = event.getState().toString();
        if (fishState !== 'CAUGHT_FISH') {
            return;
        }

        const player: Player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        StatisticPlugin.addNumericValue('fishingCount', player.name);
    }

    private static enchantItemHandler(event): void {
        const player: Player = event.getEnchanter();

        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const itemName = event.getItem().getType().getKey().toString();

        StatisticPlugin.addNumericValue('enchantItemsCount', player.name);
        StatisticPlugin.addValue('enchantItems', itemName, player.name);
    }
}
