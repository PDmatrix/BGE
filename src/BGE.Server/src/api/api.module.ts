import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { ApiController } from './api.controller';
import { apiProviders } from './api.providers';
import { ApiService } from './api.service';
import { GameStateRepository } from './repositories/game-state.repository';
import { PlayerStateRepository } from './repositories/player-state.repository';

@Module({
  controllers: [ApiController],
  providers: [
    ApiService,
    GameStateRepository,
    PlayerStateRepository,
    ...apiProviders,
  ],
  imports: [ConfigModule, AuthModule, DatabaseModule],
})
export class ApiModule {}
