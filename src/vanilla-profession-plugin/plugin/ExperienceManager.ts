import { ProfessionScoreboardManager, ScoreboardEntity } from './scoreboard';
import { TestersManager } from './testersManager';
import { levelsExp, maxLevel } from './index';

export enum Professions{
    'MINER'= 'MINER',
    'FARMER' = 'FARMER'
}

interface ProfessionPersist {
    [playerName: string]: ProfessionEntity;
}

interface ProfessionEntity {
    experience: number;
    level: number;
}

export interface LevelsEntry {
    [key: string]: number;
}

export class ExperienceManager {
    private readonly testersManager: TestersManager;

    private readonly scoreboardManager: ProfessionScoreboardManager;

    private readonly professionPersists = {
        [Professions.MINER]: persist(ExperienceManager.getPersistName(Professions.MINER)),
        [Professions.FARMER]: persist(ExperienceManager.getPersistName(Professions.FARMER)),
    }

    constructor(testersManager: TestersManager,
        scoreboardManager: ProfessionScoreboardManager) {
        this.testersManager = testersManager;
        this.scoreboardManager = scoreboardManager;
    }

    private static getPersistName(profession: Professions): string {
        return `experience_${profession}`;
    }

    private static createPersistEntityIfNotExist(professionPersist: ProfessionPersist, player: Player): void {
        if (professionPersist[player.name] === undefined) {
            professionPersist[player.name] = {
                experience: 0,
                level: 1,
            };
        }
    }

    increaseExp(profession: Professions, player: Player, expIncrease: number): void {
        const professionPersist: ProfessionPersist = this.professionPersists[profession];
        ExperienceManager.createPersistEntityIfNotExist(professionPersist, player);
        const professionEntity: ProfessionEntity = professionPersist[player.name];

        let { experience } = professionEntity;
        let { level } = professionEntity;

        experience += expIncrease;
        while (level !== maxLevel && experience >= levelsExp[level]) {
            experience -= levelsExp[level];
            level += 1;
        }

        professionPersist[player.name] = { experience, level };

        if (this.testersManager.isPlayerTester(player)) {
            this.showScoreboard(player);
        }
    }

    showScoreboard(player: Player): void {
        const scoreboardData: ScoreboardEntity[] = [];
        for (const persistName in this.professionPersists) {
            const persist: ProfessionPersist = this.professionPersists[persistName];
            ExperienceManager.createPersistEntityIfNotExist(persist, player);
            const professionEntity: ProfessionEntity = persist[player.name];

            const exp = professionEntity.experience;
            const lvl = professionEntity.level;
            const expPercents = lvl !== maxLevel
                ? (exp / levelsExp[lvl] * 100).toFixed(2)
                : '100';

            scoreboardData.push({
                professionName: Professions[persistName],
                expPercents,
                lvl: lvl.toString(),
            });
        }

        this.scoreboardManager.showPlayerProfessionsScore(player, scoreboardData);
    }
}
