import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async getToken(userId: string) {
    return await this.jwtService.signAsync({ sub: () => userId });
  }
}
