import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { SignalRGuard } from '../common/guards/signalr.guard';
import { ApiService } from './api.service';
import { AcceptRequest } from './dtos/accept-request.dto';
import { StartRequest } from './dtos/start-request.dto';

@Controller('api')
@UseGuards(SignalRGuard)
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

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
}
