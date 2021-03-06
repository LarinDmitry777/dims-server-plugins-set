import { StatisticPlugin } from './statisticPlugin';

interface Config {
    isWork: boolean;
    savePersistIntervalSec: number;
}

const config: Config = require('../config.json');

if (config.isWork) {
    StatisticPlugin.init(config.savePersistIntervalSec);
}
