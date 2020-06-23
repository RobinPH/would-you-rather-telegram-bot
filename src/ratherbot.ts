import TelegramBot, { ReplyKeyboardMarkup, KeyboardButton, Message, Chat, ForceReply } from 'node-telegram-bot-api';
import { Questions, Question, LoadedQuestions } from './components/Question';
import { doesChannelQuestionsExists, createChannelQuestions, addNewQuestionToChannel, getChannelQuestions } from './api/database';
import { SUGGESTION, INVALID, ADDED_SUCCESSFUL } from './utils/constants';

let preloadedQuestions: LoadedQuestions;

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

    bot.sendMessage(channelId, SUGGESTION, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    })
  })

  bot.on('message', (msg) => {
    suggestionHandler(bot, msg, [SUGGESTION, INVALID, ADDED_SUCCESSFUL])
  })
}

async function suggestionHandler(bot: TelegramBot, msg: Message, suggestionQuestion: Array<string>) {
  if (!msg.reply_to_message) return
  if (!suggestionQuestion.some(message => msg.reply_to_message!.text === message.replace(/[\*\_]/g, ""))) return
  if (msg.reply_to_message.from!.id !== parseInt(process.env.BOT_ID!)) return

  const channelId: Chat['id'] = msg.chat.id;
  const newQuestion = new Question(msg.text!)
  let replyMessage: string = '';

  if (newQuestion.isValidQuestion()) {
    if (!(await doesChannelQuestionsExists(channelId))) {
      await createChannelQuestions(channelId);
    }

    const addedSuccessful = addNewQuestionToChannel(msg.text!, channelId);
    if (addedSuccessful) {
      if (!(channelId in preloadedQuestions.getStoredQuestions())) {
        preloadedQuestions.addChannelQuestions(new Questions([]), channelId)
      }
      preloadedQuestions.addNewQuestionToChannel(newQuestion, channelId);
    }

    replyMessage = addedSuccessful ? ADDED_SUCCESSFUL : INVALID
  } else {
    replyMessage = INVALID;
  }

  bot.sendMessage(channelId, replyMessage, {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id,
  });
}