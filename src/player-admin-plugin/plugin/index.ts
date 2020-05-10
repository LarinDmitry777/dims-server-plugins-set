import EbanTool from './eban-tool';

export interface Coordinate {
    x: number;
    y: number;
    z: number;
}

interface EbanToolConfig {
    isWork: boolean;
    prison: Coordinate;
    freedom: Coordinate;
}

export interface Config {
    players: string[];
    ebanTool: EbanToolConfig;
}

const config: Config = require('../config.json');

EbanTool.init(config.players, config.ebanTool.prison, config.ebanTool.freedom);
