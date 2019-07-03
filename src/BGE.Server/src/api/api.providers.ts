import * as signalR from '@aspnet/signalr';
import { Provider } from '@nestjs/common';
import { Connection } from 'mongoose';
import {
  DATABASE_CONNECTION,
  GAME_STATE_MODEL,
  PLAYER_STATE_MODEL,
  SIGNALR_CONNECTION,
} from '../common/constants';
import { ConfigService } from '../config/config.service';
import { GameStateSchema } from './schemas/game-state.schema';
import { PlayerStateSchema } from './schemas/player-state.schema';

const signalRProvider: Provider = {
  provide: SIGNALR_CONNECTION,
  useFactory: async (config: ConfigService) => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(config.signalRUrl)
      .configureLogging(signalR.LogLevel.Information)
      .build();

    const start = async () => {
      try {
        await connection.start();
      } catch (err) {
        setTimeout(() => start(), 5000);
      }
    };

    await start();
    connection.onclose(async () => {
      await start();
    });
    return connection;
  },
  inject: [ConfigService],
};

const gameStateProvider: Provider = {
  provide: GAME_STATE_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('GameState', GameStateSchema),
  inject: [DATABASE_CONNECTION],
};

const playerStateProvider: Provider = {
  provide: PLAYER_STATE_MODEL,
  useFactory: (connection: Connection) =>
    connection.model('PlayerState', PlayerStateSchema),
  inject: [DATABASE_CONNECTION],
};

export const apiProviders: Provider[] = [
  signalRProvider,
  gameStateProvider,
  playerStateProvider,
];
