import { Chat } from 'node-telegram-bot-api';

interface storedQuestions {
  [channelId: number]: { questions: Questions; remainingQuestions?: Array<number>; },
}
export class Question {
  private rawQuestion: string;
  private question: string;
  private questionMarkup: string;
  private option1: string;
  private option2: string;
  private valid: boolean;

  constructor(rawQuestion: string, re?: RegExp) {
    this.rawQuestion = rawQuestion
    this.valid = this.isValidQuestion();

    let question: string = '';
    let questionMarkup: string = '';
    let option1: string = '';
    let option2: string = '';

    if (this.valid) {
      const { question: q, questionMarkup: qm, option1: o1, option2: o2 } = this.parseQuestion(re);
      question = q;
      questionMarkup = qm;
      option1 = o1;
      option2 = o2;
    }

    this.question = question;
    this.questionMarkup = questionMarkup;
    this.option1 = option1;
    this.option2 = option2;
  }

  private parseQuestion(re?: RegExp) {
    const captured = this.rawQuestion.match(re || /^(\d+\.\s)?(Would\syou\srather\s)?(.+)\sor\s(.+)(\.|\?)?$/i)!;
    const option2 = captured[4].replace(/(\.|\?)$/i, "");
    return {
      question: this.rawQuestion.replace(/^(\d+\.\s)/, ""),
      questionMarkup: `${ captured[2] || '' }*${ captured[3] }* or *${ option2 }*${ captured[4].replace(option2, "") }`,
      option1: captured[3],
      option2: option2,
    };
  }

  isValidQuestion(re?: RegExp) {
    const captured = this.rawQuestion.match(re || /^(\d+\.\s)?(Would\syou\srather\s)?(.+)\sor\s(.+)(\.|\?)?$/i)!;
    
    let isValid: boolean = true;

    try {
      isValid = captured[3] != null && captured[4] != null;
    } catch {
      isValid = false;
    }

    return isValid;
  }

  get options() {
    return [ this.option1, this.option2 ];
  }

  getQuestion() {
    return this.question;
  }

  getQuestionMarkup() {
    return this.questionMarkup;
  }
}

export class Questions {
  private rawQuestions: Array<string>;
  private questions: Array<Question>;

  constructor(rawQuestions: Array<string>) {
    this.rawQuestions = rawQuestions;
    this.questions = this.parseQuestions();
  }

  private parseQuestions() {
    const questions = this.rawQuestions.map(question => new Question(question)).filter(question => question.isValidQuestion());
    console.log(`Preloaded ${ questions.length } questions`);
    return questions;
  }

  addQuestion(question: Question) {
    this.questions.push(question);
  }
  
  getQuestions() {
    return this.questions;
  }

  get length() {
    return this.questions.length;
  }
}

export class LoadedQuestions {
  private storedQuestions: storedQuestions;

  constructor(storedQuestions: storedQuestions) {
    this.storedQuestions = storedQuestions;
  }

  getRandomQuestion(channelId: Chat["id"]) {
    const channelQuestions = this.storedQuestions[channelId];
    let remainingQuestions = channelQuestions.remainingQuestions!;
    let remainingQuestionsLength = remainingQuestions.length;

    if (remainingQuestionsLength === 0) {
      channelQuestions.remainingQuestions = this.generateRemainingQuestions(channelQuestions.questions);
      remainingQuestions = channelQuestions.remainingQuestions!;
      remainingQuestionsLength = channelQuestions.remainingQuestions.length;
    }

    const lengthDefault = this.storedQuestions[0].questions.length;
    const randomIndex = Math.floor(Math.random() * remainingQuestionsLength);
    const questionPosition = remainingQuestions[randomIndex];
    const isChannelQuestion = questionPosition >= lengthDefault;

    const id = isChannelQuestion ? channelId : 0;
    
    remainingQuestions.splice(randomIndex, 1)

    return this.storedQuestions[id].questions.getQuestions()[isChannelQuestion ? questionPosition - lengthDefault : questionPosition]
  }

  addNewQuestionToChannel(question: Question, channelId: Chat["id"]) {
    this.storedQuestions[channelId].questions.addQuestion(question)
  }

  addChannelQuestions(questions: Questions, channelId: Chat["id"]) {
    const remainingQuestions = this.generateRemainingQuestions(questions);

    this.storedQuestions[channelId] = { questions, remainingQuestions };
  }

  private generateRemainingQuestions(questions: Questions) {
    const remainingQuestions: Array<number> = new Array();
    const lengthCombined = this.storedQuestions[0].questions.length + questions.length;

    for (let i = 0; i < lengthCombined; i++) {
      remainingQuestions.push(i);
    }

    return remainingQuestions;
  }

  getStoredQuestions() {
    return this.storedQuestions;
  }

  length(channelId: Chat["id"]) {
    if (!this.storedQuestions[channelId]) return
    return this.storedQuestions[0].questions.length + this.storedQuestions[channelId].questions.length;
  }
}