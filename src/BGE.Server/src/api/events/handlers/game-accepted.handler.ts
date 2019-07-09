import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { EngineService } from '../../engine.service';
import { GameAcceptedEvent } from '../impl/game-accepted.event';

@EventsHandler(GameAcceptedEvent)
export class GameAcceptedHandler implements IEventHandler<GameAcceptedEvent> {
  constructor(private readonly engineService: EngineService) {}
  handle(event: GameAcceptedEvent) {
    return this.engineService.acceptMarker(event.userId);
  }
}
