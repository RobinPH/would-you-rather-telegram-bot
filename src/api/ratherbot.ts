import TelegramBot, { ReplyKeyboardMarkup, KeyboardButton, Message, Chat } from 'node-telegram-bot-api';
import { Questions, Question, LoadedQuestions } from '../components/Question';
import { addNewQuestion, doesChannelQuestionsExists, createChannelQuestions, addNewQuestionToChannel, getChannelQuestions } from './database';

enum EXAMPLE {
  ONE = `Example: Would you rather *be free* or *be totally safe*?`,
  TWO = `Example: *Be free* or *be totally safe*?`,
}
const FORMAT = `Format: "Option1 or Option2"`;
const SUGGEST = `*Suggest New Would Your Rather Question.* \n  ${ FORMAT } \n  ${ EXAMPLE.ONE } \n  ${ EXAMPLE.TWO } \n\n_Reply to this Message._`;
const INVALID = `*Invalid Suggestion Format* \n  ${ FORMAT } \n  ${ EXAMPLE.ONE } \n  ${ EXAMPLE.TWO }`;

let preloadedQuestions: LoadedQuestions;
const currentLoadedChannels: Set<Chat["id"]> = new Set();

export const ratherBot = (token: string, defaultQuestions: Questions) => {
  preloadedQuestions = new LoadedQuestions({ 0: defaultQuestions })

  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/^(\/WouldYouRather|\/WYR)(?!S|Suggest)/i, async(msg) => {
    const channelId = msg.chat.id;

    if (!(channelId in preloadedQuestions.getStoredQuestions())) {
      const channelQuestions = new Questions(await getChannelQuestions(channelId));
      preloadedQuestions.addChannelQuestions(channelQuestions, channelId);
    }

    const randomQuestion = preloadedQuestions.getRandomQuestion(channelId);
    const [ option1, option2 ] = randomQuestion.options

    const keyboard: ReplyKeyboardMarkup = {
      keyboard: [
        [
          { text: option1 } as KeyboardButton,
          { text: option2 } as KeyboardButton,
        ],
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    }
    bot.sendMessage(channelId, randomQuestion.getQuestionMarkup(), {
      reply_to_message_id: msg.message_id,
      reply_markup: keyboard,
      parse_mode: "Markdown",
    });
  });

  bot.onText(/^(\/WouldYouRatherSuggest|\/WYRSuggest|\/WYRS)/i, (msg) => {
    const channelId = msg.chat.id;

    bot.sendMessage(channelId, SUGGEST, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    })
  })

  bot.on('message', (msg) => {
    suggestionHandler(bot, msg, [SUGGEST, INVALID])
  })
}

async function suggestionHandler(bot: TelegramBot, msg: Message, suggestionQuestion: Array<string>) {
  if (!msg.reply_to_message) return
  if (!suggestionQuestion.some(message => msg.reply_to_message!.text === message.replace(/[\*\_]/g, ""))) return
  if (msg.reply_to_message.from!.id !== 1184795861) return

  const channelId: Chat['id'] = msg.chat.id;
  const newQuestion = new Question(msg.text!)
  let replyMessage: string = '';

  if (newQuestion.isValidQuestion()) {
    if (!(await doesChannelQuestionsExists(channelId))) {
      await createChannelQuestions(channelId);
    }

    const success = addNewQuestionToChannel(msg.text!, channelId);
    if (success) {
      if (!(channelId in preloadedQuestions.getStoredQuestions())) {
        preloadedQuestions.addChannelQuestions(new Questions([]), channelId)
      }
      preloadedQuestions.addNewQuestionToChannel(newQuestion, channelId);
    }

    replyMessage = success ? `*Added new Would You Rather question.*` : INVALID

  } else {
    replyMessage = INVALID;
  }

  bot.sendMessage(channelId, replyMessage, {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id,
  });
}