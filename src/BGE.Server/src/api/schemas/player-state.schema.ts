import { Schema } from 'mongoose';

export const PlayerStateSchema = new Schema({
  userId: String,
  opponentStateId: { type: Schema.Types.ObjectId, ref: 'PlayerState' },
  field: [[String]],
  gameStateId: { type: Schema.Types.ObjectId, ref: 'GameState' },
});
