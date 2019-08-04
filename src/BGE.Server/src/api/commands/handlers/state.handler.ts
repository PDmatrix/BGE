import { BadRequestException } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { EngineService } from '../../engine.service';
import { IPlayerState } from '../../interfaces/player-state.interface';
import { GameStateRepository } from '../../repositories/game-state.repository';
import { PlayerStateRepository } from '../../repositories/player-state.repository';
import { StateCommand } from '../impl/state.command';

@CommandHandler(StateCommand)
export class StateHandler implements ICommandHandler<StateCommand> {
  constructor(
    private readonly eventBus: EventBus,
    private readonly engineService: EngineService,
    private readonly gameStateRepository: GameStateRepository,
    private readonly playerStateRepository: PlayerStateRepository,
  ) {}

  public async execute({ userId, gameToken }: StateCommand) {
    const gameState = await this.gameStateRepository.findByGameToken(gameToken);
    if (gameState === null) {
      throw new BadRequestException('GameState is not found');
    }

    const userState = await this.playerStateRepository.find({
      userId,
      gameStateId: gameState._id,
    });
    if (userState === null) {
      throw new BadRequestException('PlayerState is not found');
    }

    const opponentState = await this.getOpponentState(
      userState.opponentId || '',
      userState.gameStateId || '',
    );
    return { user: userState, opponent: opponentState, game: gameState };
  }

  public async getOpponentState(
    userId: string,
    gameStateId: string,
  ): Promise<IPlayerState> {
    const opponentState = await this.playerStateRepository.find({
      userId,
      gameStateId,
    });
    if (opponentState === null) {
      throw new BadRequestException('Opponent state is not found');
    }

    const cleanseResponse = await this.engineService.cleanse(
      opponentState.field,
    );

    opponentState.field = cleanseResponse.field;
    return opponentState;
  }
}
