import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public getToken(userId: string) {
    const user: JwtPayload = {
      sub: userId,
    };
    return this.jwtService.signAsync(user);
  }
}
