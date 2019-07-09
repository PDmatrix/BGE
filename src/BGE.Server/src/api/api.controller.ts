import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { SignalRGuard } from '../common/guards/signalr.guard';
import { AcceptGameCommand } from './commands/impl/accept-game.command';
import { StartGameCommand } from './commands/impl/start-game.command';
import { AcceptRequest } from './dtos/accept-request.dto';
import { StartRequest } from './dtos/start-request.dto';

@Controller('api')
//@UseGuards(SignalRGuard)
export class ApiController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(200)
  @Post('/accept')
  public accept(@Body() acceptRequest: AcceptRequest) {
    return this.commandBus.execute(
      new AcceptGameCommand(acceptRequest.userId, acceptRequest.gameToken),
    );
  }

  @HttpCode(200)
  @Post('/start')
  public start(@Body() startRequest: StartRequest) {
    return this.commandBus.execute(
      new StartGameCommand(
        startRequest.userId,
        startRequest.cols,
        startRequest.rows,
      ),
    );
  }
}
