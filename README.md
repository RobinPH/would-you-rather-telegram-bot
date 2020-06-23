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
| `ATLAS_URI`         | MongoDB URI  | 
| `TOKEN`         | Authorization Token `/token@BotFather`  | 
| `BOT_ID`  | First 10 numbers of `TOKEN`  |
