import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ERole } from '../../common/enums/role.enum';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;
}
