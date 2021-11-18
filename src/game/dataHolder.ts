import questionsJSON from '../assets/questions/questions.json';
import image from '../assets/questions/images/ticket_1/1_1.jpg';

export interface IAnswer {
  answer_text: string;
  is_correct: boolean;
}

export interface IQuestionInfo {
  title: string;
  ticket_number: string;
  image: string;
  question: string;
  answers: Array<IAnswer>;
  correct_answer: string;
  answer_tip: string;
  topic: string;
}

export class DataHolder {
  public questionsInfo: IQuestionInfo[];

  constructor() {}

  loadQuestionsInfo(): Promise<IQuestionInfo[]> {
    return fetch(questionsJSON)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.questionsInfo = data;
        return data;
      });
  }

  getQuestionsTicketInfo(ticketNum: number) {
    const ticketQuestions = this.questionsInfo.filter((question) => {
      return (
        Number.parseInt(question.ticket_number.split(' ')[1]) === ticketNum
      );
    });

    return ticketQuestions;
  }
}
