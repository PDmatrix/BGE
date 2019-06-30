import { Schema } from 'mongoose';

export const GameStateSchema = new Schema({
  token: String,
  status: { type: String, enum: ['NotStarted', 'Playing', 'Finished'] },
  turn: Schema.Types.ObjectId,
});
