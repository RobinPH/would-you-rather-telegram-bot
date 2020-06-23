# Would You Rather | Telegram Bot

[![@RatherBotBot](https://i.imgur.com/sFWzmgz.png)](https://t.me/RatherBotBot)

## Info
- 250 Default **Would You Rather** Questions. _(https://improb.com/would-you-rather-questions/)_
- Suggested questions are only visible to the channel/user where it was suggested.

## Usage
| Command                 | Alias      | Description                                                                                             |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------- |
| `/WouldYouRather`         | `/WYR`  | Send a random **Would You Rather** question                          |
| `/WouldYouRatherSuggest`  | `/WYRS /WYRSuggest`  | Sends a SUGGESTION message. Reply to that message to submit your **Would You Rather** question                                               |

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
