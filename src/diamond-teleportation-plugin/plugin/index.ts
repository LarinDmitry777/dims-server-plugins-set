import BedTpTool from './bedTpTool';
import SpawnTpTool from './spawnTpTool';
import HomeTpTool from './homeTpTool';
import TpToPlayerTool from './tpToPlayerTool';
import DeathTpTool from './deathTpTool';


interface ConfigCommonEntry {
    isWork: boolean;
    diamondsCost: number;
}

interface ConfigHomePluginEntry {
    isWork: boolean;
    setHomeDiamondsCost: number;
    'tpDiamondsCost': 2;
}

interface Config {
    bedTpTool: ConfigCommonEntry;
    spawnTpTool: ConfigCommonEntry;
    homeTpTool: ConfigHomePluginEntry;
    tpToPlayerTool: ConfigCommonEntry;
    deathTpTool: ConfigCommonEntry;
}

const config: Config = require('../config.json');

if (config.bedTpTool.isWork) {
    BedTpTool.init(config.bedTpTool.diamondsCost);
}
if (config.spawnTpTool.isWork) {
    SpawnTpTool.init(config.spawnTpTool.diamondsCost);
}
if (config.homeTpTool.isWork) {
    HomeTpTool.init(
        config.homeTpTool.setHomeDiamondsCost,
        config.homeTpTool.tpDiamondsCost,
    );
}
if (config.tpToPlayerTool.isWork) {
    TpToPlayerTool.init(config.tpToPlayerTool.diamondsCost);
}
if (config.deathTpTool.isWork) {
    DeathTpTool.init(config.deathTpTool.diamondsCost);
}
