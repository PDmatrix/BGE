import { Document } from 'mongoose';

export enum GameStatus {
  NotStarted = 'NotStarted',
  Playing = 'Playing',
  Finished = 'Finished',
}

export interface IGameState {
  token: string;
  status: GameStatus;
  turn: string;
}

// Need to export model

export type GameState = IGameState & Document;
