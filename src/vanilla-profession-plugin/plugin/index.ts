import * as events from 'events';
import { ProfessionsPlugin } from './main';
import { LevelsEntry } from './ExperienceManager';
import { ProfessionScoreboardManager } from './scoreboard';

interface Config {
    isWork: boolean;
    levelsExp: LevelsEntry;
    maxLevel: number;
}

const config: Config = require('../config.json');

export const { levelsExp } = config;
export const { maxLevel } = config;

events.playerJoin((event) => {
    ProfessionScoreboardManager.removeScoreboardForPlayer(event.player);
});
