import mongoose, { Schema } from 'mongoose';

export interface DQuestions extends mongoose.Document {
  questions: Array<string>; 
};

export const questionsSchema = new Schema({
  questions: [ String ],
}, {
  timestamps: true,
});

export const QuestionsModel = mongoose.model<DQuestions>('Question', questionsSchema);
