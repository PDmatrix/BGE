import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PLAYER_STATE_MODEL } from '../../common/constants';
import {
  IPlayerState,
  PlayerState,
} from '../interfaces/player-state.interface';

@Injectable()
export class PlayerStateRepository {
  constructor(
    @Inject(PLAYER_STATE_MODEL)
    private readonly playerStateModel: Model<PlayerState>,
  ) {}

  public create(doc: IPlayerState): Promise<IPlayerState> {
    return new this.playerStateModel(doc).save();
  }

  public findByUserId(userId: string): Promise<IPlayerState | null> {
    return this.playerStateModel.findOne({ userId }).exec();
  }

  public findById(id: string): Promise<IPlayerState | null> {
    return this.playerStateModel.findOne({ _id: id }).exec();
  }

  public updateOneById(id: string, doc: IPlayerState): Promise<IPlayerState> {
    return this.playerStateModel.updateOne({ _id: id }, doc).exec();
  }
}
