import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EngineService } from '../../engine.service';
import { PlayerShotEvent } from '../impl/player-shot.event';

@EventsHandler(PlayerShotEvent)
export class PlayerShotHandler implements IEventHandler<PlayerShotEvent> {
  constructor(private readonly engineService: EngineService) {}
  handle(event: PlayerShotEvent) {
    return this.engineService.shootMarker(event.userId);
  }
}
