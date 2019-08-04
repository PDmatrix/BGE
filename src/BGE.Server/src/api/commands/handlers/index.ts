import { AcceptGameHandler } from './accept-game.handler';
import { ShootHandler } from './shoot.handler';
import { StartGameHandler } from './start-game.handler';
import { StateHandler } from './state.handler';

export const CommandHandlers = [
  AcceptGameHandler,
  StartGameHandler,
  ShootHandler,
  StateHandler,
];
