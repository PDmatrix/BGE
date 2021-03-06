import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ShootResponse } from '../../dtos/shoot-response.dto';
import { EngineService } from '../../engine.service';
import { PlayerShotEvent } from '../../events/impl/player-shot.event';
import { GameStatus, IGameState } from '../../interfaces/game-state.interface';
import { IPlayerState } from '../../interfaces/player-state.interface';
import { GameStateRepository } from '../../repositories/game-state.repository';
import { PlayerStateRepository } from '../../repositories/player-state.repository';
import { ShootCommand } from '../impl/shoot.command';

@CommandHandler(ShootCommand)
export class ShootHandler implements ICommandHandler<ShootCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly engineService: EngineService,
    private readonly gameStateRepository: GameStateRepository,
    private readonly playerStateRepository: PlayerStateRepository,
  ) {}

  public async execute({
    userId,
    gameToken,
    x,
    y,
  }: ShootCommand): Promise<void> {
    const gameState = await this.getGameStateByToken(gameToken);
    validateTurn(gameState.userTurnId, userId);

    if (gameState.status !== GameStatus.Playing) {
      throw new BadRequestException('Wrong game status');
    }

    const userState = await this.getPlayerState(userId, gameState._id || '');
    const opponentUserState = await this.getPlayerState(
      userState.opponentId,
      gameState._id || '',
    );

    const response = await this.processShoot(
      x,
      y,
      opponentUserState.field,
      opponentUserState.userId,
      gameState._id || '',
    );

    if (response.isWinner) {
      await this.updateWinner(gameState._id, userState.userId);
    } else if (!response.isHit) {
      await this.updateNextTurn(gameState._id, opponentUserState.userId);
    }

    this.eventBus.publish(new PlayerShotEvent(userState.opponentId));
  }

  private async getGameStateByToken(gameToken: string): Promise<IGameState> {
    const gameState = await this.gameStateRepository.findByGameToken(gameToken);
    if (!gameState) {
      throw new BadRequestException('Provided gameToken is invalid');
    }

    return gameState;
  }

  private async getPlayerState(
    userId: string,
    gameStateId: string,
  ): Promise<IPlayerState> {
    const playerState = await this.playerStateRepository.find({
      userId,
      gameStateId,
    });
    if (playerState === null) {
      throw new BadRequestException('Player state is not found');
    }

    return playerState;
  }

  private async processShoot(
    x: number,
    y: number,
    field: string[][],
    userId: string,
    gameStateId: string,
  ): Promise<ShootResponse> {
    const response = await this.engineService.shoot(x, y, field);
    await this.playerStateRepository.updateOne(
      { userId, gameStateId },
      {
        field: response.field,
      },
    );

    return response;
  }

  private updateWinner(
    gameId: string | undefined,
    userId: string,
  ): Promise<IGameState> {
    return this.gameStateRepository.updateOneById(gameId, {
      winnerId: userId,
      status: GameStatus.Finished,
    });
  }

  private updateNextTurn(
    gameId: string | undefined,
    userId: string,
  ): Promise<IGameState> {
    return this.gameStateRepository.updateOneById(gameId, {
      userTurnId: userId,
    });
  }
}

function validateTurn(userTurnId: string, userId: string): void {
  if (userTurnId !== userId) {
    throw new BadRequestException('Not your turn');
  }
}
