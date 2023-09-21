import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ERole } from '../../common/enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true, enum: ERole })
  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  password: string;
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
