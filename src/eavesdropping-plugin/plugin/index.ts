import { ChatEavesdroppingTool } from './ChatEavesdroppingTool';

interface Config {
    isWork: boolean;
}

const conf: Config = require('../config.json');


if (conf.isWork) {
    new ChatEavesdroppingTool();
}
