import { strings } from './strings';
import { Professions } from './ExperienceManager';

export interface ScoreboardEntity {
    professionName: Professions;
    lvl: string;
    expPercents: string;
}

export class ProfessionScoreboardManager {
    private readonly professionsTexts = {
        [Professions.MINER]: strings.professionMiner,
        [Professions.FARMER]: strings.professionFarmer,
    }

    private readonly chatColorRed = org.bukkit.ChatColor.RED;

    private readonly chatColorGreen = org.bukkit.ChatColor.GREEN;

    private readonly chatColorGold = org.bukkit.ChatColor.GOLD;

    private readonly chatColorBlue = org.bukkit.ChatColor.GRAY;

    private readonly displaySideBar = org.bukkit.scoreboard.DisplaySlot.SIDEBAR;

    private readonly scoreboardManager = org.bukkit.Bukkit.getScoreboardManager();

    private getPlayerScoreboard(player: Player): Scoreboard {
        const existScoreboard = player.getScoreboard();
        if (existScoreboard !== undefined && existScoreboard !== null) {
            return existScoreboard;
        }

        const newScoreboard = this.scoreboardManager.getNewScoreboard();
        player.setScoreboard(newScoreboard);

        return newScoreboard;
    }

    private getObjective(scoreboard: Scoreboard): Objective {
        const objectiveName = 'profession';
        let objective = scoreboard.getObjective(objectiveName);
        if (objective !== null) {
            objective.unregister();
        }

        const objectiveDisplayName = `${this.chatColorRed}${strings.scoreboardProfessionsName}`;
        objective = scoreboard.registerNewObjective(objectiveName, '', objectiveDisplayName);
        objective.setDisplaySlot(this.displaySideBar);

        return objective;
    }

    showPlayerProfessionsScore(player: Player, scoreboardEntityes: ScoreboardEntity[]): void {
        const scoreboard = this.getPlayerScoreboard(player);
        const objective = this.getObjective(scoreboard);

        scoreboardEntityes.forEach((entity) => {
            const scoreText = `${this.chatColorGold}${this.professionsTexts[entity.professionName]} ${this.chatColorGreen}${entity.lvl}${this.chatColorBlue}(${entity.expPercents}%)`;
            const score = objective.getScore(scoreText);
            score.setScore(0);
        });
    }

    static removeScoreboardForPlayer(player: Player): void {
        player.setScoreboard(org.bukkit.Bukkit.getScoreboardManager().getNewScoreboard());
    }
}
