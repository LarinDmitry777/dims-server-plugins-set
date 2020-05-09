import { players } from 'utils';
import { commando } from '../../typePatch';

export default class BanTool {
  private static adminPlayers = ['eswat', 'Gidron17', 'steelbreedman'];

  static init() {
      commando('ueban', BanTool.banCommandHandler);
      commando('neueban', BanTool.pardonCommandHandler);
  }

  private static banCommandHandler(_args: string[], handlerPlayer: Player): void {
      if (BanTool.adminPlayers.indexOf(handlerPlayer.name) === -1) {
      // eslint-disable-next-line no-undef
          echo(handlerPlayer, 'У вас нет прав на использование этой команды');
          return;
      }

      const bannedPlayerName = _args[0];

      if (players().map((p) => p.name).indexOf(bannedPlayerName) === -1) {
      // eslint-disable-next-line no-undef
          echo(handlerPlayer, 'Игрок не найден');
          return;
      }

      // @ts-ignore
      server.dispatchCommand(server.consoleSender, `tp ${bannedPlayerName} -231 60 -202`);
  }

  private static pardonCommandHandler(_args: string[], handlerPlayer: Player): void {
      if (BanTool.adminPlayers.indexOf(handlerPlayer.name) === -1) {
      // eslint-disable-next-line no-undef
          echo(handlerPlayer, 'У вас нет прав на использование этой команды');
          return;
      }

      const bannedPlayerName = _args[0];

      if (players().map((p) => p.name).indexOf(bannedPlayerName) === -1) {
      // eslint-disable-next-line no-undef
          echo(handlerPlayer, 'Игрок не найден');
          return;
      }

      // @ts-ignore
      server.dispatchCommand(server.consoleSender, `tp ${bannedPlayerName} -228 60 -202`);
  }
}
