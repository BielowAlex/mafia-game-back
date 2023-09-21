import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { errorMessages } from '../common/constants/errors';
import { RequestContext } from '../common/dto/request-context.dto';
import { AppLogger } from '../common/app-logger/app-logger.service';

@Injectable()
export class UsersService {
  private logger = new AppLogger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(
    ctx: RequestContext,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    this.logger.debug(ctx, `${this.create.name} was called`);

    const newUser: User = plainToClass(User, createUserDto);

    this.logger.verbose(ctx, `calling ${this.userRepository.save.name}`);
    await this.userRepository.save(newUser);

    return newUser;
  }

  async findById(ctx: RequestContext, id: string): Promise<User> {
    this.logger.debug(ctx, `${this.findById.name} was called`);

    this.logger.verbose(ctx, `calling ${this.userRepository.findOneBy.name}`);
    const currentUser = await this.userRepository.findOneBy({
      id,
    });

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    return currentUser;
  }

  async findAll(ctx: RequestContext): Promise<User[]> {
    this.logger.debug(ctx, `${this.findAll.name} was called`);

    this.logger.verbose(ctx, `calling ${this.userRepository.find.name}`);
    return await this.userRepository.find();
  }

  async findOneByUsername(
    ctx: RequestContext,
    username: string,
  ): Promise<User> {
    this.logger.debug(ctx, `${this.findOneByUsername.name} was called`);

    this.logger.verbose(ctx, `calling ${this.userRepository.findOneBy.name}`);
    const currentUser = await this.userRepository.findOneBy({ username });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  }

  async findOneByEmail(ctx: RequestContext, email: string): Promise<User> {
    this.logger.debug(ctx, `${this.findOneByUsername.name} was called`);

    this.logger.verbose(ctx, `calling ${this.userRepository.findOneBy.name}`);
    const currentUser = await this.userRepository.findOneBy({ email });

    if (!currentUser) {
      return null;
    }

    return currentUser;
  }

  async update(ctx: RequestContext, id: string, updateUserDto: UpdateUserDto) {
    this.logger.debug(ctx, `${this.update.name} was called`);

    this.logger.verbose(ctx, `calling ${this.userRepository.findOneBy.name}`);
    const currentUser = await this.userRepository.findOneBy({ id });

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const updatedUser = plainToClass(User, {
      ...currentUser,
      ...updateUserDto,
    });

    this.logger.verbose(ctx, `calling ${this.userRepository.save.name}`);
    return await this.userRepository.save(updatedUser);
  }

  async remove(ctx: RequestContext, id: string) {
    this.logger.debug(ctx, `${this.remove.name} was called`);

    this.logger.verbose(ctx, `calling ${this.userRepository.findOneBy.name}`);
    const currentUser = await this.userRepository.findOneBy({ id });

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    this.logger.verbose(ctx, `calling ${this.userRepository.remove.name}`);
    return await this.userRepository.remove(currentUser);
  }
}
