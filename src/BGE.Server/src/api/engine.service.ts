import { HubConnection } from '@aspnet/signalr';
import { Inject } from '@nestjs/common';
import { SIGNALR_CONNECTION } from '../common/constants';
import { CleanseResponse } from './dtos/cleanse-response.dto';
import { ShootResponse } from './dtos/shoot-response.dto';
import { StartResponse } from './dtos/start-response.dto';

export class EngineService {
  constructor(
    @Inject(SIGNALR_CONNECTION) private readonly connection: HubConnection,
  ) {}

  public async startGame(
    rows: number = 8,
    cols: number = 8,
  ): Promise<StartResponse> {
    return await this.connection.invoke('StartGame', {
      rows,
      cols,
    });
  }

  public async shoot(
    x: number,
    y: number,
    field: string[][],
  ): Promise<ShootResponse> {
    return await this.connection.invoke('Shoot', {
      x,
      y,
      field,
    });
  }

  public async cleanse(field: string[][]): Promise<CleanseResponse> {
    return await this.connection.invoke('Cleanse', { field });
  }

  public async acceptMarker(userId: string): Promise<void> {
    return this.connection.send('AcceptMarker', userId);
  }

  public async shootMarker(userId: string): Promise<void> {
    return this.connection.send('ShootMarker', userId);
  }
}
