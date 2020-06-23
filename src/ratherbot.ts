import TelegramBot, { ReplyKeyboardMarkup, KeyboardButton, Message, Chat, ForceReply } from 'node-telegram-bot-api';
import { Questions, Question, LoadedQuestions } from './components/Question';
import { doesChannelQuestionsExists, createChannelQuestions, addNewQuestionToChannel, getChannelQuestions } from './api/database';
import { BotSetting, defaultSettings } from './utils/constants';
import { getDefaultQuestions } from './api/database';

let preloadedQuestions: LoadedQuestions;

export const ratherBot = async(token: string, bot_id: string, settings: BotSetting = defaultSettings) => {
  // 0 is the ID for default questions.
  // The rest are Channel ID.
  settings = { ...defaultSettings, ...settings };
  preloadedQuestions = new LoadedQuestions({ 0: { questions: await getDefaultQuestions(settings.RegExp!, settings.questionData!) } })

  const bot = new TelegramBot(token, { polling: true });

  bot.onText(/^(\/WouldYouRather|\/WYR)(?!S|Suggest)/i, async(msg) => {
    const channelId = msg.chat.id;

    if (!(channelId in preloadedQuestions.getStoredQuestions())) {
      const channelQuestions = new Questions(await getChannelQuestions(channelId), settings.RegExp!, settings.questionData!);
      preloadedQuestions.addChannelQuestions(channelQuestions, channelId);

      bot.getChat(channelId).then(channel => {
        console.log(`Serving: ${ channel.id } ${ channel.title }`)
      })
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

    bot.sendMessage(channelId, settings.messages!.SUGGESTION!, {
      parse_mode: "Markdown",
      reply_to_message_id: msg.message_id,
    })
  })

  bot.on('message', (msg) => {
    const { SUGGESTION, INVALID, ADDED_SUCCESSFUL } = settings.messages!;
    suggestionHandler(bot, msg, bot_id, settings, [SUGGESTION!, INVALID!, ADDED_SUCCESSFUL!])
  })
}

async function suggestionHandler(bot: TelegramBot, msg: Message, bot_id: string, settings: BotSetting, suggestionQuestion: Array<string>) {
  if (!msg.reply_to_message) return
  if (!suggestionQuestion.some(message => msg.reply_to_message!.text === message.replace(/[\*\_]/g, ""))) return
  if (msg.reply_to_message.from!.id !== parseInt(bot_id)) return

  const { INVALID, ADDED_SUCCESSFUL } = settings.messages!;

  const channelId: Chat['id'] = msg.chat.id;
  const newQuestion = new Question(msg.text!, settings.RegExp!, settings.questionData!)
  let replyMessage: string = '';

  if (newQuestion.isValidQuestion(settings.RegExp!, settings.questionData!)) {
    if (!(await doesChannelQuestionsExists(channelId))) {
      await createChannelQuestions(channelId);
    }

    const addedSuccessful = addNewQuestionToChannel(msg.text!, channelId);
    if (addedSuccessful) {
      if (!(channelId in preloadedQuestions.getStoredQuestions())) {
        preloadedQuestions.addChannelQuestions(new Questions([], settings.RegExp!, settings.questionData!), channelId)
      }
      preloadedQuestions.addNewQuestionToChannel(newQuestion, channelId);
    }

    replyMessage = addedSuccessful ? ADDED_SUCCESSFUL! : INVALID!
  } else {
    replyMessage = INVALID!;
  }

  bot.sendMessage(channelId, replyMessage, {
    parse_mode: "Markdown",
    reply_to_message_id: msg.message_id,
  });
}