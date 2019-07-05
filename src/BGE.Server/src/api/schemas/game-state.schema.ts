import { Schema } from 'mongoose';

export const GameStateSchema = new Schema({
  token: String,
  status: { type: String, enum: ['NotStarted', 'Playing', 'Finished'] },
  turn: { type: Schema.Types.ObjectId, ref: 'PlayerState' },
  rows: Number,
  cols: Number,
});
