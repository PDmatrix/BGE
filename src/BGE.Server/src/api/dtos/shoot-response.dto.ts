import { IsBoolean } from 'class-validator';
import { PlayerState } from '../interfaces/player-state.interface';

export class ShootResponse {
  @IsBoolean()
  isHit: boolean;

  @IsBoolean()
  isWinner: boolean;

  playerState: PlayerState;
}
