# Would You Rather | Telegram Bot

[![@RatherBotBot](https://i.imgur.com/sFWzmgz.png)](https://t.me/RatherBotBot)

## Info
- 250 Default **Would You Rather** Questions. _(https://improb.com/would-you-rather-questions/)_
- Suggested questions are only visible to the channel/user where it was suggested.

## Usage
| Command (Case-insensitive) | Alias                 | Description                                                                                                                                                                                                                                                  |
|----------------------------|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/WouldYouRather`          | `/WYR`                | Send a random **Would You Rather** question.                                                                                                                                                                                                                 |
| `/WouldYouRather`          | `/WYRSuggest` `/WYRS` | Send a **SUGGESTION** message. Replay to that message to submit your suggestion. See format in the next section.   |                                          |
## Suggestion Format
&nbsp;&nbsp;&nbsp;&nbsp;Format:&nbsp;&nbsp;&nbsp; **(Would you rather)? `Option1` or `Option2`**

&nbsp;&nbsp;&nbsp;&nbsp;Examples: **Would you rather `be free` or `be totally safe`?**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **`Be free` or `be totally safe`?**

## Clone
```sh
$ git clone https://github.com/RobinPH/would-you-rather-telegram-bot.git
$ npm i
$ npm run start
```

## Setup
| Environment Variable                 | Description      |
| -------------------- | --------- | 
| `MONGODB_URI`         | MongoDB URI  | 
| `TOKEN`         | Authorization Token `/token@BotFather`  | 
| `BOT_ID`  | First 10 numbers of `TOKEN`  |

##### Importing Default Questions
 - Make `.txt` file where each line is a question with the same format as **Suggestion Format**. _See Example at **./DefaultQuestions/questions.txt**_
 - Run `node importDefault.js [txt path] [MONGODB_URI]`. Wherein `txt path` is the path to the `.txt` file, and `MONGODB_URI` is the MongoDB URI.
 - **NOTE:** `importDefault.js` splits the `.txt` file with `\r\n`.

#### Bot Settings
```js
interface QuestionData {
  optionsIndex?: Array<number>,
}

interface BotSetting {
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
```
`EXAMPLES` Array of Examples for `/WouldYouRatherSuggest`.
`INVALID` Message when User inputted wrong format in `/WouldYouRatherSuggest`.
`FORMAT` Message for format in `/WouldYouRatherSuggest`.
`SUGGESTION` Message for `/WouldYouRatherSuggest`.
`ADDED_SUCCESSFUL` Message for `/WouldYouRatherSuggest` when new question is added successfully.

`RegExp` Used to capture `Option1` and `Option2`.

`optionsIndex` Array of number (index) of options in `RegExpMatchArray`.
