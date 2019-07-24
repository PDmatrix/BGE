import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from '../../../auth/auth.service';
import { EngineService } from '../../engine.service';
import { GameStatus } from '../../interfaces/game-state.interface';
import { GameStateRepository } from '../../repositories/game-state.repository';
import { PlayerStateRepository } from '../../repositories/player-state.repository';
import { StartGameCommand } from '../impl/start-game.command';

@CommandHandler(StartGameCommand)
export class StartGameHandler implements ICommandHandler<StartGameCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly engineService: EngineService,
    private readonly gameStateRepository: GameStateRepository,
    private readonly playerStateRepository: PlayerStateRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: StartGameCommand) {
    const { userId, rows, cols } = command;

    const gameToken = generateRandomToken();
    await this.createGame(cols, rows, userId, gameToken);

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
      winnerId: null,
    });

    await this.playerStateRepository.create({
      userId,
      field: startResponse.field,
      gameStateId: gameState._id,
      opponentId: '',
    });
  }
}

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
