import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/auth.service';
import { EngineService } from '../../engine.service';
import { GameAcceptedEvent } from '../../events/impl/game-accepted.event';
import { GameStatus, IGameState } from '../../interfaces/game-state.interface';
import { IPlayerState } from '../../interfaces/player-state.interface';
import { GameStateRepository } from '../../repositories/game-state.repository';
import { PlayerStateRepository } from '../../repositories/player-state.repository';
import { AcceptGameCommand } from '../impl/accept-game.command';

@CommandHandler(AcceptGameCommand)
export class AcceptGameHandler implements ICommandHandler<AcceptGameCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly engineService: EngineService,
    private readonly gameStateRepository: GameStateRepository,
    private readonly playerStateRepository: PlayerStateRepository,
    private readonly authService: AuthService,
  ) {}

  public async execute({ userId, gameToken }: AcceptGameCommand) {
    const gameState = await this.getGameStateByToken(gameToken);
    await this.createGame(gameState, userId);
    await this.updateOpponentId(gameState.userTurnId, userId);
    await this.updateGameStatus(gameState._id);
    this.eventBus.publish(new GameAcceptedEvent(gameState.userTurnId));
    const userToken = await this.authService.getToken(userId);
    return { userToken, gameToken };
  }

  private async getGameStateByToken(gameToken: string) {
    const gameState = await this.gameStateRepository.findByGameToken(gameToken);
    if (!gameState) {
      throw new BadRequestException('Provided gameToken is invalid');
    }

    return gameState;
  }

  private async createGame(
    gameState: IGameState,
    userId: string,
  ): Promise<void> {
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
  }

  private updateOpponentId(
    userId: string,
    opponentId: string,
  ): Promise<IPlayerState> {
    return this.playerStateRepository.updateOneByUserId(userId, {
      opponentId,
    });
  }

  private updateGameStatus(
    gameStateId: string | undefined,
  ): Promise<IGameState> {
    return this.gameStateRepository.updateOneById(gameStateId, {
      status: GameStatus.Playing,
    });
  }
}
