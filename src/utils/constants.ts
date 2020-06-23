import { Question } from "../components/Question";

export interface QuestionData {
  optionsIndex?: Array<number>,
}

export interface BotSetting {
  messages?: {
    EXAMPLES?: Array<string>;
    INVALID?: string;
    FORMAT?: string;
    SUGGESTION?: string,
    ADDED_SUCCESSFUL?: string,
  },
  RegExp?: RegExp;
  questionData?: QuestionData;
}


export enum EXAMPLE {
  ONE = `Example: Would you rather *be free* or *be totally safe*?`,
  TWO = `Example: *Be free* or *be totally safe*?`,
}

export const FORMAT = `Format: "Option1 or Option2"`;
export const SUGGESTION = `*Suggest Would Your Rather Question.* \n  ${ FORMAT } \n  ${ EXAMPLE.ONE } \n  ${ EXAMPLE.TWO } \n\n_Reply to this Message._`;
export const INVALID = `*Invalid Suggestion Format* \n  ${ FORMAT } \n  ${ EXAMPLE.ONE } \n  ${ EXAMPLE.TWO }`;
export const ADDED_SUCCESSFUL = `*Added new Would You Rather question.*`;

export const defaultSettings: BotSetting = {
  messages: {
    EXAMPLES: [ EXAMPLE.ONE, EXAMPLE.TWO ],
    INVALID: INVALID,
    FORMAT: FORMAT,
    SUGGESTION: SUGGESTION,
    ADDED_SUCCESSFUL: ADDED_SUCCESSFUL,
  },
  RegExp: new RegExp(/(Would\syou\srather\s)?(.+)\sor\s(.+)(\.|\?)?$/i),
  questionData: {
    optionsIndex: [2, 3],
  }
}