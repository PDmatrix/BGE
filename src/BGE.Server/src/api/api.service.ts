import { HubConnection } from '@aspnet/signalr';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { SIGNALR_CONNECTION } from '../common/constants';
import { ShootResponse } from './dto/shoot-response.dto';
import { GameStatus, IGameState } from './interfaces/game-state.interface';
import { IPlayerState } from './interfaces/player-state.interface';
import { GameStateRepository } from './repositories/game-state.repository';
import { PlayerStateRepository } from './repositories/player-state.repository';
import { StartResponse } from './dto/start-response.dto';

function generateRandomToken() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

@Injectable()
export class ApiService {
  constructor(
    @Inject(SIGNALR_CONNECTION) private readonly connection: HubConnection,
    private readonly gameStateRepository: GameStateRepository,
    private readonly playerStateRepository: PlayerStateRepository,
    private readonly authService: AuthService,
  ) {}

  public async accept(userId: string, fromUserId: string, gameToken: string) {
    const gameState = await this.gameStateRepository.findByGameToken(gameToken);
    if (!gameState) {
      throw new BadRequestException('Provided gameToken is invalid');
    }

    const playerState: StartResponse = await this.connection.invoke(
      'StartGame',
      { rows: gameState.rows, cols: gameState.cols },
    );

    await this.playerStateRepository.create({
      field: playerState.field,
      gameStateId: gameState._id,
      opponentStateId: fromUserId,
      userId,
    });

    await this.connection.send('AcceptMarker', gameState.userId);
    const userToken = await this.authService.getToken(userId);
    return { gameToken, userToken };
  }

  public async start(userId: string, cols: number, rows: number) {
    const gameToken = generateRandomToken();
    await this.createGame(cols, rows, userId, gameToken);

    const userToken = await this.authService.getToken(userId);
    return { gameToken, userToken };
  }

  public async shoot(userId: string, x: number, y: number) {
    const gameState: GameState = await this.gameStateRepository.findByUserId(
      userId,
    );
    if (!gameState.turn) {
      throw new BadRequestException('Not your move');
    }

    const opponentGameState: GameState = await this.gameStateRepository.findById(
      gameState.opponentGameId,
    );
    const shootResponse: ShootResponse = await this.connection.invoke(
      'Shoot',
      { x, y },
      opponentGameState.playerState,
    );
    await this.gameStateRepository.updateOneById(opponentGameState._id, {
      playerState: shootResponse.playerState,
    });

    if (!shootResponse.isHit) {
      await this.gameStateRepository.updateOneById(opponentGameState._id, {
        turn: true,
      });
      await this.gameStateRepository.updateOneById(gameState._id, {
        turn: false,
      });
    }

    await this.connection.send('ShootMarker', opponentGameState.userId);
  }

  public async state(userId: string) {
    const playerGameState = await this.gameStateRepository.findByUserId(userId);
    const opponentGameState = await this.gameStateRepository.findById(
      playerGameState.opponentGameId,
    );

    opponentGameState.playerState = await this.connection.invoke(
      'Cleanse',
      opponentGameState.playerState,
    );

    return {
      playerGameState,
      opponentGameState,
    };
  }

  private async createGame(
    cols: number,
    rows: number,
    userId: string,
    gameToken: string,
  ) {
    const playerState: IPlayerState = await this.connection.invoke(
      'StartGame',
      {
        rows,
        cols,
      },
    );

    await this.gameStateRepository.create({
      token: gameToken,
      status: GameStatus.NotStarted,
      turn: userId,
    });
  }
}
