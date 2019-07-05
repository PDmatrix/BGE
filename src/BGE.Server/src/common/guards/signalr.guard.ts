import { HubConnection, HubConnectionState } from '@aspnet/signalr';
import {
  CanActivate,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SIGNALR_CONNECTION } from '../constants';

@Injectable()
export class SignalRGuard implements CanActivate {
  constructor(
    @Inject(SIGNALR_CONNECTION) private readonly connection: HubConnection,
  ) {}

  canActivate(): boolean | Promise<boolean> {
    if (this.connection.state === HubConnectionState.Disconnected) {
      throw new InternalServerErrorException(
        'Connection with WebSocket is not established!',
      );
    }

    return true;
  }
}
