import * as events from 'events';
import { player } from 'utils';
import { ExperienceManager, Professions } from './ExperienceManager';
import { TestersManager } from './testersManager';

class PointAssigner {
    private readonly experienceManager: ExperienceManager;

    private readonly testersManager: TestersManager;

    constructor(testersManager: TestersManager, experienceManager: ExperienceManager) {
        this.testersManager = testersManager;
        this.experienceManager = experienceManager;

        this.furnaceExtractEventHandler = this.furnaceExtractEventHandler.bind(this);
        this.blockBreakEventHandler = this.blockBreakEventHandler.bind(this);
    }

    protected pointsIncomeHandler(player: Player, count: number, profession: Professions) {
        this.experienceManager.increaseExp(profession, player, count);
    }

    protected blockBreakEventHandler(event: BlockBreakEvent, itemsCosts: Object, profession: Professions, isSelfReplicatedItem = false) {
        if (event === undefined || event.getEventName() !== 'BlockBreakEvent') {
            return;
        }

        if (!this.testersManager.isPlayerTester(event.getPlayer())) {
            return;
        }

        const breakTool = event.getPlayer().getItemInHand();
        const droppedItems = event.block.getDrops(breakTool);
        let points = 0;

        droppedItems.forEach((droppedItem: ItemStack) => {
            const itemName = droppedItem.getType().getKey().toString();
            const pointForItem = itemsCosts[itemName];
            if (pointForItem !== undefined) {
                let itemsCount = droppedItem.getAmount();
                if (isSelfReplicatedItem) {
                    itemsCount = Math.max(0, itemsCount - 1);
                }
                points += pointForItem * itemsCount;
            }
        });

        if (points > 0) {
            this.pointsIncomeHandler(event.getPlayer(), points, profession);
        }
    }

    protected animalBreedEvent(event, pointsObject: object, profession: Professions) {
        if (event === undefined || event.getEventName() !== 'EntityBreedEvent') {
            return;
        }

        if (event.getBreeder() === null || event.getEntity() === null) {
            return;
        }

        const breederPlayer: Player = player(event.getBreeder()!.getName());
        const breededAnimalName: string = event.getEntity()!.getName();
        if (breederPlayer === null || breededAnimalName === null) {
            return;
        }
        const points = pointsObject[breededAnimalName];

        if (points !== undefined && points > 0) {
            this.pointsIncomeHandler(breederPlayer, points, profession);
        }
    }

    protected shearEntityEvent(event, pointsObject: Object, profession: Professions) {
        if (event === undefined || event.getEventName() !== 'PlayerShearEntityEvent') {
            return;
        }
        const player: Player = event.getPlayer();
        const entityName: string = event.getEntity().getName();
        console.log(entityName);
        const pointsCount = pointsObject[entityName];

        if (pointsCount !== undefined && pointsCount > 0) {
            this.pointsIncomeHandler(player, pointsCount, profession);
        }
    }

    protected furnaceExtractEventHandler(event, itemsCost: Object, profession: Professions) {
        if (event === undefined || event.getEventName() !== 'FurnaceExtractEvent') {
            return;
        }

        if (!this.testersManager.isPlayerTester(event.getPlayer())) {
            return;
        }

        const itemName: string = event.getItemType().getKey().toString();
        const pointsForOneItem: number = itemsCost[itemName];

        if (pointsForOneItem === undefined) {
            return;
        }

        const player: Player = event.getPlayer();
        const amount: number = event.getItemAmount();
        const points = pointsForOneItem * amount;

        this.pointsIncomeHandler(player, points, profession);
    }
}

export class MinerPointsAssigner extends PointAssigner {
    constructor(testersManager: TestersManager, experienceManager: ExperienceManager) {
        super(testersManager, experienceManager);

        events.blockBreak((event) => super.blockBreakEventHandler(event, this.expPerItems, Professions.MINER));
        events.furnaceExtract((event) => this.furnaceExtractEventHandler(event, this.expPerItems, Professions.MINER));
    }

    private expPerItems = {
        'minecraft:coal': 5,
        'minecraft:diamond': 75,
        'minecraft:redstone': 1,
        'minecraft:iron_ingot': 20,
        'minecraft:gold_ingot': 30,
        'minecraft:lapis_lazuli': 5,
        'minecraft:quartz': 7,
    }
}

export class FarmPointsAssigner extends PointAssigner {
    private blockBreakNotSelfReplicated = {
        'minecraft:wheat': 3,
        'minecraft:beetroot': 3,
        'minecraft:melon_slice': 2,
        'minecraft:sweet_berries': 3,
    }

    private blockBreakSelfReplicated = {
        'minecraft:carrot': 3,
        'minecraft:potato': 3,
        'minecraft:wheat_seeds': 3,
        'minecraft:nether_wart': 5,
    }

    private breedPoints = {
        Cow: 7,
        Pig: 15,
        Sheep: 15,
        Chicken: 7,
        Wolf: 40,
        Horse: 70,
        Donkey: 50,
        Rabbit: 40,
        Turtle: 100,
        Panda: 50,
        Llama: 50,
    }

    private shearPoints ={
        Sheep: 5,
        Mooshroom: 500,
    }

    constructor(testersManager: TestersManager, experienceManager: ExperienceManager) {
        super(testersManager, experienceManager);

        events.blockBreak((event) => super.blockBreakEventHandler(event, this.blockBreakNotSelfReplicated, Professions.FARMER));
        events.blockBreak((event) => super.blockBreakEventHandler(event, this.blockBreakSelfReplicated, Professions.FARMER, true));
        events.entityBreed((event) => super.animalBreedEvent(event, this.breedPoints, Professions.FARMER));
        events.playerShearEntity((event) => super.shearEntityEvent(event, this.shearPoints, Professions.FARMER));
    }
}
