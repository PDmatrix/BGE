import {
  Body,
  Controller,
  HttpCode,
  Inject,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import { ShootDto } from './dto/shoot.dto';
import { StartDto } from './dto/start.dto';
import { PlayerState } from './interface/player-state.interface';
import { StateDto } from './dto/state.dto';
import { AuthService } from '../auth/auth.service';
import { ShootResponse } from './interface/shoot-response.interface';
import { SIGNALR_CONNECTION } from '../constants';
import { ApiService } from './api.service';

interface IDB {
  _id: string;
  gameToken: string;
  state: PlayerState;
  userId: string;
  ref?: string;
  turn: boolean;
}

@Controller('api')
export class ApiController {
  private db: IDB[] = [];

  constructor(
    @Inject(SIGNALR_CONNECTION) private readonly connection: HubConnection,
    private readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {}

  @HttpCode(200)
  @Post('/state')
  public async state(@Body() stateDto: StateDto) {
    const player = this.db.find(value => value.userId === stateDto.userId);
    const enemy = JSON.parse(
      JSON.stringify(this.db.find(value => value._id === player.ref)),
    );
    enemy.state = await this.connection.invoke('Cleanse', enemy.state);
    return {
      player,
      enemy,
    };
  }

  @Post('/reset')
  public async reset() {
    this.db = [];
  }

  @HttpCode(200)
  @Post('/start')
  public async start(@Body() startDto: StartDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    return await this.apiService.start(startDto);
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootDto: ShootDto) {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    const playerState = this.db.find(value => value.userId === shootDto.userId);
    if (!playerState.turn) {
      return { message: 'Not your move' };
    }

    const enemyState = this.db.find(value => value._id === playerState.ref);
    const shootResponse: ShootResponse = await this.connection.invoke(
      'Shoot',
      { x: shootDto.x, y: shootDto.y },
      {
        playerState: enemyState.state,
      },
    );
    enemyState.state = shootResponse.gameState.playerState;
    if (!shootResponse.hit) {
      enemyState.turn = true;
      playerState.turn = false;
    }
    await this.connection.send('ShootMarker', enemyState.userId);
  }
}
