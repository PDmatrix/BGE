import { Schema } from 'mongoose';

export const GameStateSchema = new Schema({
  token: String,
  status: { type: String, enum: ['NotStarted', 'Playing', 'Finished'] },
  userTurnId: String,
  rows: Number,
  cols: Number,
});
