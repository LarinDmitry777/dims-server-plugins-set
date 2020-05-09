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
    private readonly statisticPersist: StatisticPersist = persist('statistic');

    constructor(savePersistIntervalSec: number) {
        this.initPersist();

        this.entityDeathEventHandler = this.entityDeathEventHandler.bind(this);
        this.blockBreakEventHandler = this.blockBreakEventHandler.bind(this);
        this.entityBreadHandler = this.entityBreadHandler.bind(this);
        this.playerDeathHandler = this.playerDeathHandler.bind(this);
        this.playerJoinEventHandler = this.playerJoinEventHandler.bind(this);
        this.playerChatEventHandler = this.playerChatEventHandler.bind(this);
        this.blockPlaceEventHandler = this.blockPlaceEventHandler.bind(this);
        this.furnaceExtractEventHandler = this.furnaceExtractEventHandler.bind(this);
        this.playerFishEventHandler = this.playerFishEventHandler.bind(this);
        this.savePersist = this.savePersist.bind(this);
        this.enchantItemHandler = this.enchantItemHandler.bind(this);
        this.addValue = this.addValue.bind(this);

        events.entityDeath(this.entityDeathEventHandler);
        events.blockBreak(this.blockBreakEventHandler);
        events.playerJoin(this.playerJoinEventHandler);
        events.playerChat(this.playerChatEventHandler);
        events.playerDeath(this.playerDeathHandler);
        events.entityBreed(this.entityBreadHandler);
        events.blockPlace(this.blockPlaceEventHandler);
        events.furnaceExtract(this.furnaceExtractEventHandler);
        events.playerFish(this.playerFishEventHandler);
        events.enchantItem(this.enchantItemHandler);

        setInterval(this.savePersist, savePersistIntervalSec * 1000);
    }

    private initPersist(playerName?: string): void {
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
            if (this.statisticPersist.players === undefined) {
                this.statisticPersist.players = {};
            }
            if (this.statisticPersist.uniquePlayersCount === undefined) {
                this.statisticPersist.uniquePlayersCount = 0;
            }
        } else if (this.statisticPersist.players[playerName] === undefined) {
        // @ts-ignore
            this.statisticPersist.players[playerName] = {};
            this.statisticPersist.uniquePlayersCount++;
            this.statisticPersist.uniquePlayers.push(playerName);
        }

        const objectForModify = playerName ? this.statisticPersist.players[playerName] : this.statisticPersist;

        for (const key in defaultValues) {
            if (objectForModify[key] === undefined) {
                objectForModify[key] = defaultValues[key];
            }
        }
    }

    private savePersist() {
        const data = this.statisticPersist;
        persist('statistic', data, true);
    }

    private static fixItemName(name: string) {
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

    private addValue(groupName: string, objectName: string, player: string, amount = 1) {
        if (!amount) {
            return;
        }

        const globalCount = this.statisticPersist[groupName][objectName];
        this.statisticPersist[groupName][objectName] = (globalCount === undefined || globalCount === null ? amount : globalCount + amount);

        const playerCount = this.statisticPersist.players[player][groupName][objectName];
        this.statisticPersist.players[player][groupName][objectName] = (playerCount === undefined || playerCount === null ? amount : playerCount + amount);
    }


    private playerJoinEventHandler(event: PlayerJoinEvent): void {
        const playerName: string = event.getPlayer().name;
        this.initPersist(playerName);

        this.statisticPersist.joinCount++;
        this.statisticPersist.players[playerName].joinCount++;
    }

    private entityDeathEventHandler(event: EntityDeathEvent): void {
        const player = event.getEntity().getKiller();
        if (player === null || player === undefined || event.getEntity().getType().getName() === 'player') {
            return;
        }

        if (!StatisticPlugin.isPlayerInSurvival(event.getEntity().getKiller())) {
            return;
        }

        const playerName = player?.name;
        const entityName: string = event.getEntity().getType().getName();

        this.statisticPersist.entitiesKillsCount++;
        this.statisticPersist.players[playerName].entitiesKillsCount++;

        this.addValue('entitiesKills', entityName, playerName);
    }

    private blockBreakEventHandler(event: BlockBreakEvent): void {
        const player: Player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const blockName = StatisticPlugin.fixItemName(event.getBlock().type.getKey().toString());
        const playerName: string = player.name;

        this.statisticPersist.blockBreaksCount++;
        this.statisticPersist.players[playerName].blockBreaksCount++;

        this.addValue('blocksBreak', blockName, playerName);
    }

    private entityBreadHandler(event) {
        if (event.getBreeder() === null || event.getEntity() === null) {
            return;
        }
        const player: Player = event.getBreeder();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        const animalName: string = event.getEntity().getName().toLowerCase().replace(' ', '_');

        this.statisticPersist.breedAnimalsCount++;
        this.statisticPersist.players[player.name].breedAnimalsCount++;

        this.addValue('breedAnimals', animalName, player.name);
    }

    private playerDeathHandler(event: PlayerDeathEvent): void {
        if (event.getEntity().getType().getName() !== 'player') {
            return;
        }

        const playerName = event.getEntity().name;

        this.statisticPersist.playerDeathCount++;
        this.statisticPersist.players[playerName].playerDeathCount++;
    }

    private playerChatEventHandler(event): void {
        if (event.message.startsWith('/')) {
            return;
        }
        const playerName: string = event.getPlayer().name;
        this.statisticPersist.chatMessagesCount++;
        this.statisticPersist.players[playerName].chatMessagesCount++;
    }

    private blockPlaceEventHandler(event: BlockPlaceEvent): void {
        const player: Player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const blockName = StatisticPlugin.fixItemName(event.getBlock().type.getKey().toString());
        this.statisticPersist.placedBlocksCount++;
        this.statisticPersist.players[player.name].placedBlocksCount++;

        this.addValue('placedBlocks', blockName, player.name);
    }

    private furnaceExtractEventHandler(event): void {
        if (event.getEventName() !== 'FurnaceExtractEvent') {
            return;
        }

        const player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        const itemName: string = event.getItemType().getKey().toString();
        const amount: number = event.getItemAmount();

        this.statisticPersist.extractFurnaceCount += amount;
        this.statisticPersist.players[player.name].extractFurnaceCount += amount;

        this.addValue('furnaceItems', itemName, player.name, amount);
    }

    private playerFishEventHandler(event): void {
        const fishState = event.getState().toString();
        if (fishState !== 'CAUGHT_FISH') {
            return;
        }

        const player: Player = event.getPlayer();
        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }
        this.statisticPersist.fishingCount++;
        this.statisticPersist.players[player.name].fishingCount++;
    }

    private enchantItemHandler(event): void {
        const player: Player = event.getEnchanter();

        if (!StatisticPlugin.isPlayerInSurvival(player)) {
            return;
        }

        this.statisticPersist.enchantItemsCount++;
        this.statisticPersist.players[player.name].enchantItemsCount++;

        const itemName = event.getItem().getType().getKey().toString();

        this.addValue('enchantItems', itemName, player.name);
    }
}
