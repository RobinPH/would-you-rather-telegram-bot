import mongoose from "mongoose";
import { Chat } from 'node-telegram-bot-api';

import { QuestionsModel, DQuestions } from '../models/questions.models';
import { ChannelModel, DChannel } from '../models/channel.models';
import { Questions, Question } from '../components/Question';

import { QuestionData } from '../utils/constants';

export const connectDB = (URI: string) => {
  mongoose.connect(URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
  const connection = mongoose.connection;
  connection.once('open', async() => {
    console.log("MongoDB database connection established successfully");
  })
}

export const getDefaultQuestions = (re: RegExp, questionData: QuestionData) => {
  return new Promise<Questions>((resolve) => {
    QuestionsModel.find({}).sort({ _id: -1 }).limit(1)
      .then(result => {
        const { questions } = (result[0] as unknown as DQuestions);
        resolve(new Questions(questions, re, questionData));
      })
      .catch(() => { })
  })
}

const getLatestQuestions = () => {
  return new Promise<[DQuestions, string]>((resolve) => {
    QuestionsModel.find({}).sort({ _id: -1 }).limit(1)
      .then(result => {
        resolve([result[0], result[0]._id as string]);
      })
      .catch(() => { })
  })
}

export const addNewQuestion = (questionString: string) => {
  return new Promise<boolean>(async(resolve) => {
    const [{ questions }, id] = await getLatestQuestions()

    QuestionsModel.findByIdAndUpdate({ _id: id }, { questions: [...questions, questionString] })
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      });
  })
}

const getLatestQuestionsInChannel = (channelId: Chat['id']) => {
  return new Promise<[DChannel, string]>((resolve) => {
    ChannelModel.find({}).sort({ _id: -1 }).limit(1)
      .then(result => {
        resolve([result[0], result[0]._id as string]);
      })
      .catch(() => { })
  })
}

export const addNewQuestionToChannel = (questionString: string, channelId: Chat['id']) => {
  return new Promise<boolean>(async(resolve) => {
    const [{ questions }, id] = await getLatestQuestionsInChannel(channelId)
    console.log(`${ channelId }`)
    ChannelModel.findOneAndUpdate({ "channelId": channelId.toString() }, { questions: [...questions, questionString] })
      .then((res) => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      });
  })
}

export const createChannelQuestions = (channelId: Chat['id']) => {
  return new Promise<boolean>((resolve) => {
    const channelQuestions = new ChannelModel({
      channelId,
      questions: new Array(),
    })
  
    channelQuestions.save()
      .then(() => {
        resolve(true)
      })
      .catch(() => {
        resolve(false)
      })
  })
}

export const doesChannelQuestionsExists = (channelId: Chat['id']) => {
  return new Promise<boolean>((resolve) => {
    ChannelModel.find({ "channelId": channelId.toString() })
      .then(result => {
        if (result.length === 1) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
      .catch(() => {
        console.log("Channel Question does not Exists")
        resolve(false)
      })
  })
}

export const getChannelQuestions = (channelId: Chat['id']) => {
  return new Promise<DChannel["questions"]>((resolve) => {
    ChannelModel.find({ "channelId": channelId.toString() })
    .then(channelQuestions => {
      resolve(channelQuestions[0].questions)
    })
    .catch(() => {
      resolve([])
    })
  })
}