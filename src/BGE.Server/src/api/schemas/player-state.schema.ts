import { Schema } from 'mongoose';

export const PlayerStateSchema = new Schema({
  userId: String,
  opponentId: String,
  field: [[String]],
  gameStateId: { type: Schema.Types.ObjectId, ref: 'GameState' },
});
