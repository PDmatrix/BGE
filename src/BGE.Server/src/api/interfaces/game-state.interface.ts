import { Document } from 'mongoose';

export enum GameStatus {
  NotStarted = 'NotStarted',
  Playing = 'Playing',
  Finished = 'Finished',
}

export interface IGameState {
  readonly _id?: string;
  token: string;
  status: GameStatus;
  turn: string | null;
  rows: number;
  cols: number;
}

export type GameState = IGameState & Document;
