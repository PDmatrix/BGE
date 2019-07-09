import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '../config/config.module';
import { DatabaseModule } from '../database/database.module';
import { ApiController } from './api.controller';
import { apiProviders } from './api.providers';
import { CommandHandlers } from './commands/handlers';
import { EngineService } from './engine.service';
import { EventHandlers } from './events/handlers';
import { GameStateRepository } from './repositories/game-state.repository';
import { PlayerStateRepository } from './repositories/player-state.repository';

@Module({
  controllers: [ApiController],
  providers: [
    EngineService,
    GameStateRepository,
    PlayerStateRepository,
    ...apiProviders,
    ...CommandHandlers,
    ...EventHandlers,
  ],
  imports: [ConfigModule, AuthModule, DatabaseModule, CqrsModule],
})
export class ApiModule {}
