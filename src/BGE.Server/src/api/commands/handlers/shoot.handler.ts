import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EngineService } from '../../engine.service';
import { PlayerShotEvent } from '../../events/impl/player-shot.event';
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

  async execute(command: ShootCommand) {
    const { userId, gameToken, x, y } = command;

    const gameState = await this.gameStateRepository.findByGameToken(gameToken);
    if (!gameState) {
      throw new BadRequestException('Provided gameToken is invalid');
    }

    if (gameState.userTurnId !== userId) {
      throw new BadRequestException('Not your turn');
    }

    const userState: IPlayerState | null = await this.playerStateRepository.findByUserId(
      userId,
    );

    if (userState === null) {
      throw new BadRequestException('Player state is not found');
    }

    const response = await this.engineService.shoot(x, y, userState.field);
    await this.playerStateRepository.updateOneByUserId(userState.opponentId, {
      field: response.field,
    });
    if (!response.isHit) {
      await this.gameStateRepository.updateOneById(gameState._id, {
        userTurnId: userState.opponentId,
      });
    }
    this.eventBus.publish(new PlayerShotEvent(gameState.userTurnId));
  }
}
