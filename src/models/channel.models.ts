import mongoose, { Schema } from 'mongoose';

export interface DChannel extends mongoose.Document {
  channelId: string,
  questions: Array<string>,
};

export const channelSchema = new Schema({
  channelId: { type: String },
  questions: [ String ],
}, {
  timestamps: true,
});

export const ChannelModel = mongoose.model<DChannel>('Channel', channelSchema);
