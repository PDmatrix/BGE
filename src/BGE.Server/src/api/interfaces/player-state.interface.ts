import { Document } from 'mongoose';
import { IGameState } from './game-state.interface';

export interface IPlayerState {
  readonly _id?: string;
  userId: string;
  opponentId: string;
  gameStateId: IGameState['_id'];
  field: string[][];
}

export type PlayerState = IPlayerState & Document;
