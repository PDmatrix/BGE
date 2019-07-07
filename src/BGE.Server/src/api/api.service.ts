import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { EngineService } from './engine.service';
import { GameStatus } from './interfaces/game-state.interface';
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

  public async accept(userId: string, gameToken: string) {
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
      opponentId: gameState.userTurnId,
      userId,
    });

    await this.playerStateRepository.updateOneByUserId(gameState.userTurnId, {
      opponentId: userId,
    });

    await this.engineService.acceptMarker(gameState.userTurnId);
    const userToken = await this.authService.getToken(userId);
    return { gameToken, userToken };
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
      userTurnId: userId,
      rows,
      cols,
    });

    await this.playerStateRepository.create({
      userId,
      field: startResponse.field,
      gameStateId: gameState._id,
      opponentId: null,
    });
  }
}
