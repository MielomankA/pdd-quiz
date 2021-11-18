import { IQuestionInfo } from './dataHolder';

export class GameModel {
  private cache: Map<string, Blob> = new Map();
  public questions: IQuestionInfo[];

  constructor(questions: IQuestionInfo[]) {
    this.questions = questions;
  }

  async load() {
    for (let question of this.questions) {
      const image = await fetch(question.image).then((res) => res.blob());

      this.cache.set(question.image, image);
    }
  }

  getImageSrc(url: string) {
    return URL.createObjectURL(this.cache.get(url));
  }

  getQuestion(index: number): IQuestionInfo & { imageSrc: string } {
    return {
      ...this.questions[index],
      imageSrc: this.getImageSrc(this.questions[index].image),
    };
  }

  async loadImage(index: number) {
    const url = this.questions[index].image;

    if (!this.cache.has(url)) {
      const image = await fetch(url).then((res) => res.blob());

      this.cache.set(url, image);
    } else {
      return this.cache.get(url);
    }
  }
}
