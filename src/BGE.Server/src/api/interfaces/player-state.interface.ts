import { Document } from 'mongoose';
import { GameState } from './game-state.interface';

export interface IPlayerState {
  userId: string;
  opponentStateId: PlayerState['userId'];
  gameStateId: GameState['_id'];
  field: string[][];
}

// Need to export model

export type PlayerState = IPlayerState & Document;
