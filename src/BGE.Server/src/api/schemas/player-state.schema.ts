import { Schema } from 'mongoose';

export const PlayerStateSchema = new Schema({
  userId: String,
  opponentStateId: Schema.Types.ObjectId,
  field: [[String]],
  gameStateId: Schema.Types.ObjectId,
});
