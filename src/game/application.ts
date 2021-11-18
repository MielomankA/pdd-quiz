import Control from '../common/control';
import Signal from '../common/signal';
import { Lobby } from './lobby';
import { GameField } from './gameField';
import { Victory } from './victory';
import { IGameFieldOptions } from './dto';
import { DataHolder, IQuestionInfo } from '../game/dataHolder';
import { GameModel } from '../game/gameModel';

export class Application extends Control {
  private dataHolder: DataHolder;

  constructor(parentNode: HTMLElement) {
    super(parentNode);

    this.dataHolder = new DataHolder();

    const preloader = new Control(this.node, 'div', '', 'LOADING');

    this.dataHolder.loadQuestionsInfo().then((data) => {
      preloader.destroy();
      this.startCycle();
    });
  }

  private startCycle() {
    const lobby = new Lobby(this.node, this.dataHolder.questionsInfo.length);

    lobby.onStartButtonClick = (options) => {
      lobby.destroy();
      const questionsTicket = this.dataHolder.getQuestionsTicketInfo(
        options.ticketNum
      );
      this.gameCycle(options, questionsTicket);
    };
  }

  private async gameCycle(
    options: IGameFieldOptions,
    questionsTicket: IQuestionInfo[]
  ) {
    const gameModel = new GameModel(questionsTicket);
    // await gameModel.load();

    const game = new GameField(this.node, options, gameModel);
    game.onFinish = (result) => {
      game.destroy();
      const victory = new Victory(this.node, result);
      victory.onSelect = (selection) => {
        victory.destroy();
        if (selection == true) {
          this.gameCycle(options, questionsTicket);
        } else {
          this.startCycle();
        }
      };
    };
  }
}
