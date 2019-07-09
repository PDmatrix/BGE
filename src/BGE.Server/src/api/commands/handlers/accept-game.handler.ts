import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/auth.service';
import { EngineService } from '../../engine.service';
import { GameAcceptedEvent } from '../../events/impl/game-accepted.event';
import { GameStatus } from '../../interfaces/game-state.interface';
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

  async execute(command: AcceptGameCommand) {
    const { userId, gameToken } = command;

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

    await this.gameStateRepository.updateOneById(gameState._id, {
      status: GameStatus.Playing,
    });

    this.eventBus.publish(new GameAcceptedEvent(gameState.userTurnId));
    const userToken = await this.authService.getToken(userId);
    return { gameToken, userToken };
  }
}
