import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../users/dto/user.dto';
import { TokensDto } from './auth-tokens.dto';
import { User } from '../../users/entities/user.entity';

export class AuthLoginOutputDto {
  @Type(() => User)
  @ValidateNested()
  user: User;

  @Type(() => TokensDto)
  @ValidateNested()
  tokens: TokensDto;
}
