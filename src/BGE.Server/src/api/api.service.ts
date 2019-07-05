import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ShootResponse } from './dto/shoot-response.dto';
import { EngineService } from './engine.service';
import { GameStatus, IGameState } from './interfaces/game-state.interface';
import { IPlayerState } from './interfaces/player-state.interface';
import { GameStateRepository } from './repositories/game-state.repository';
import { PlayerStateRepository } from './repositories/player-state.repository';

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
    private readonly engineService: EngineService,
    private readonly gameStateRepository: GameStateRepository,
    private readonly playerStateRepository: PlayerStateRepository,
    private readonly authService: AuthService,
  ) {}

  public async start(userId: string, cols: number, rows: number) {
    const gameToken = generateRandomToken();
    await this.createGame(cols, rows, userId, gameToken);

    const userToken = await this.authService.getToken(userId);
    return { gameToken, userToken };
  }

  public async accept(userId: string, fromUserId: string, gameToken: string) {
    const gameState = await this.gameStateRepository.findByGameToken(gameToken);
    if (!gameState) {
      throw new BadRequestException('Provided gameToken is invalid');
    }

    const startResponse = await this.engineService.startGame(
      gameState.rows,
      gameState.cols,
    );

    await this.playerStateRepository.create({
      field: startResponse.field,
      gameStateId: gameState._id,
      opponentStateId: fromUserId,
      userId,
    });

    await this.engineService.acceptMarker(fromUserId);
    const userToken = await this.authService.getToken(userId);
    return { gameToken, userToken };
  }

  public async shoot(userId: string, x: number, y: number) {
    const gameState: IGameState = await this.gameStateRepository.findByUserId(
      userId,
    );
    if (!gameState.turn) {
      throw new BadRequestException('Not your move');
    }

    const opponentGameState = await this.gameStateRepository.findById(
      gameState.opponentGameId,
    );
    const shootResponse = await this.engineService.shoot(x, y, 'field');

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

    await this.engineService.shootMarker(opponentGameState.userId);
  }

  public async state(userId: string) {
    const playerGameState = await this.gameStateRepository.findByUserId(userId);
    const opponentGameState = await this.gameStateRepository.findById(
      playerGameState.opponentGameId,
    );

    const response = await this.engineService.cleanse([['a']]);

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
    const startResponse = await this.engineService.startGame(rows, cols);
    const gameState = await this.gameStateRepository.create({
      token: gameToken,
      status: GameStatus.NotStarted,
      turn: userId,
      rows,
      cols,
    });

    await this.playerStateRepository.create({
      userId,
      field: startResponse.field,
      gameStateId: gameState._id,
      opponentStateId: undefined,
    });
  }
}
