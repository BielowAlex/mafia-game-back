import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { RequestContext } from '../../common/dto/request-context.dto';
import { errorMessages } from '../../common/constants/errors';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    ctx: RequestContext,
    login: string,
    password: string,
  ): Promise<any> {
    const user = await this.authService.validateUser(ctx, login, password);
    if (!user) {
      throw new UnauthorizedException(errorMessages.INCORRECT_CREDENTIALS);
    }
    return user;
  }
}
