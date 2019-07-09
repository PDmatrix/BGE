import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { GAME_STATE_MODEL } from '../../common/constants';
import { GameState, IGameState } from '../interfaces/game-state.interface';

@Injectable()
export class GameStateRepository {
  constructor(
    @Inject(GAME_STATE_MODEL)
    private readonly gameStateModel: Model<GameState>,
  ) {}

  public create(doc: IGameState): Promise<IGameState> {
    return new this.gameStateModel(doc).save();
  }

  public findById(id: string): Promise<IGameState | null> {
    return this.gameStateModel.findOne({ _id: id }).exec();
  }

  public findByGameToken(token: string): Promise<IGameState | null> {
    return this.gameStateModel.findOne({ token }).exec();
  }

  public updateOneById(
    id: string | undefined,
    doc: Partial<IGameState>,
  ): Promise<IGameState> {
    return this.gameStateModel.updateOne({ _id: id }, doc).exec();
  }
}
