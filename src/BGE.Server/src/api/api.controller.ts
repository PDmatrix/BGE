import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SignalRGuard } from '../common/guards/signalr.guard';
import { ApiService } from './api.service';
import { AcceptRequest } from './dto/accept-request.dto';
import { ShootRequest } from './dto/shoot-request.dto';
import { StartRequest } from './dto/start-request.dto';
import { StateRequest } from './dto/state-request.dto';

@Controller('api')
@UseGuards(SignalRGuard)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @HttpCode(200)
  @Post('/state')
  public async state(@Body() stateRequest: StateRequest) {
    return await this.apiService.state(stateRequest.userId);
  }

  @HttpCode(200)
  @Post('/accept')
  public async accept(@Body() acceptRequest: AcceptRequest) {
    return await this.apiService.accept(
      acceptRequest.userId,
      acceptRequest.gameToken,
    );
  }

  @HttpCode(200)
  @Post('/start')
  public async start(@Body() startRequest: StartRequest) {
    return await this.apiService.start(
      startRequest.userId,
      startRequest.cols,
      startRequest.rows,
    );
  }

  @HttpCode(200)
  @Post('/shoot')
  public async shoot(@Body() shootRequest: ShootRequest) {
    return await this.apiService.shoot(
      shootRequest.userId,
      shootRequest.x,
      shootRequest.y,
    );
  }
}
