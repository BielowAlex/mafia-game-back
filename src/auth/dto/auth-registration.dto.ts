import { ERole } from '../../common/enums/role.enum';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthRegistrationDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'John Dou',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'movieland@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/, {
    message:
      'Password must contain at least 8 characters long, one uppercase letter, one lowercase letter, one digit, one special character (e.g., !, @, #, $, %, etc.).',
  })
  @IsString()
  password: string;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEnum(ERole)
  @IsOptional()
  role: ERole;
}
