import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
