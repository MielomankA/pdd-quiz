import Control from '../common/control';
import { IQuestionInfo } from './dataHolder';
import { IGameFieldOptions, IGameResult } from './dto';
import { GameModel } from './gameModel';

export class GameField extends Control {
  onFinish: (result: IGameResult) => void;

  constructor(
    parentNode: HTMLElement,
    options: IGameFieldOptions,
    model: GameModel
  ) {
    super(parentNode);

    this.startGame(model, () => {
      this.onFinish({ isWin: true });
    });

    const finishButton = new Control(this.node, 'button', '', 'cancel game');
    finishButton.node.onclick = () => {
      console.log('finish');
      this.finish({ isWin: false });
    };
  }

  private finish(result: IGameResult) {
    this.onFinish(result);
  }

  // private async startGame(questions: IQuestionInfo[]) {
  //   for (let question of questions) {

  //   }
  //     const nextQuestion = () => { };
  // }

  private async startGame(
    model: GameModel,
    onFinish: (result: boolean[]) => void
  ) {
    const result: boolean[] = [];

    const askQuestion = async (index: number) => {
      await model.loadImage(index);

      if (model.questions.length - 2 > index) {
        await model.loadImage(index + 1);
      }

      const questionView = new QuestionView(
        this.node,
        model.getQuestion(index)
      );
      questionView.onAnswer = (answer) => {
        result.push(answer);
        if (model.questions.length - 1 === index) {
          onFinish(result);
        } else {
          questionView.destroy();
          askQuestion(index + 1);
        }
      };
    };

    askQuestion(0);
  }
}

export class QuestionView extends Control {
  public onAnswer: (isCorrect: boolean) => void;

  constructor(
    parentNode: HTMLElement,
    questionData: IQuestionInfo & { imageSrc: string }
  ) {
    super(parentNode);

    const title = new Control(this.node, 'div', '', questionData.title);
    const image = new Control<HTMLImageElement>(this.node, 'img');
    image.node.src = questionData.imageSrc;

    const question = new Control(this.node, 'div', '', questionData.question);

    questionData.answers.forEach((answer) => {
      const answerView = new Control(
        this.node,
        'button',
        '',
        answer.answer_text
      );

      answerView.node.onclick = () => {
        this.onAnswer(answer.is_correct);
      };
    });
  }
}
