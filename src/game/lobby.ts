import Control from '../common/control';
import { IQuestionInfo } from './dataHolder';
import { IGameFieldOptions } from './dto';

export class Lobby extends Control {
  public onStartButtonClick: (options: IGameFieldOptions) => void;

  constructor(parentNode: HTMLElement, questionCount: number) {
    super(parentNode);

    const ticketNumberInput = new Control<HTMLInputElement>(
      this.node,
      'div',
      '',
      'Ticket number'
    );

    const ticketNum = new Control<HTMLInputElement>(this.node, 'input');
    ticketNum.node.type = 'number';
    ticketNum.node.min = '1';
    ticketNum.node.max = questionCount.toString();
    ticketNum.node.step = '1';
    ticketNum.node.value = '1';

    const startButton = new Control(this.node, 'button', '', 'start game');
    startButton.node.onclick = () => {
      this.onStartButtonClick({
        ticketNum: ticketNum.node.valueAsNumber,
      });
    };
  }
}
