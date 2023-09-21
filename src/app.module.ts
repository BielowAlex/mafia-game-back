import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { dataSourceOptions } from '../db/data-source';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './auth/entities/tokens.entity';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([User, Tokens]),
    UsersModule,
    CommonModule,
    AuthModule,
    FileModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [UsersService, AuthService, JwtService],
})
export class AppModule {}
