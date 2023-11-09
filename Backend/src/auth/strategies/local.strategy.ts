// local.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' }); // Spécifiez le champ utilisé pour le nom d'utilisateur
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.signIn(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
