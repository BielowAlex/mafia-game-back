import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { errorMessages } from '../common/constants/errors';
import { RequestContext } from '../common/dto/request-context.dto';
import { AppLogger } from '../common/app-logger/app-logger.service';
import { compare } from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { IJwtPayload, ITokens } from '../common/interfaces/auth.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { Tokens } from './entities/tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginOutputDto } from './dto/auth-login-output.dto';
import { AuthRegistrationDto } from './dto/auth-registration.dto';
import { ERole } from '../common/enums/role.enum';
import { isEmail } from '../common/helpers/is-email.helper';
import { isPast } from 'date-fns';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@Injectable()
export class AuthService {
  private logger = new AppLogger(AuthService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Tokens)
    private tokenRepository: Repository<Tokens>,
  ) {}

  async validateUser(
    ctx: RequestContext,
    login: string,
    password: string,
  ): Promise<User | null> {
    this.logger.debug(ctx, `${this.validateUser.name} was called`);

    this.logger.verbose(ctx, `calling ${UsersService.name}.findOneByEmail`);
    const currentUser = await this.usersService.findOneByEmail(ctx, login);

    if (!currentUser) {
      throw new UnauthorizedException(errorMessages.INCORRECT_CREDENTIALS);
    }

    this.logger.verbose(ctx, `calling ${compare.name} for validation password`);
    const isPasswordCorrect = await compare(password, currentUser.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException(
        HttpStatus.UNAUTHORIZED,
        errorMessages.INCORRECT_CREDENTIALS,
      );
    }

    delete currentUser.password;

    return currentUser;
  }

  async signIn(ctx: RequestContext, user: User): Promise<AuthLoginOutputDto> {
    this.logger.debug(ctx, `${this.signIn.name} was called`);

    const payload: IJwtPayload = {
      userId: user.id,
      sub: {
        email: user.email,
        role: user.role,
      },
    };

    const tokens: ITokens = {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_JWT_SECRET'),
        expiresIn: '2h',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('APP_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };

    const newTokens = plainToClass(Tokens, {
      ...tokens,
      user,
    });

    const oldTokens = await this.tokenRepository.findOneBy({
      user: { id: user.id },
    });

    await this.tokenRepository.remove(oldTokens);

    this.logger.verbose(
      ctx,
      `calling tokenRepository.${this.tokenRepository.save.name}`,
    );
    await this.tokenRepository.save(newTokens);

    const { password, ...rest } = user;

    return {
      user: { ...rest } as User,
      tokens: tokens,
    };
  }

  async signUp(
    ctx: RequestContext,
    signUpInput: AuthRegistrationDto,
  ): Promise<AuthLoginOutputDto> {
    this.logger.debug(ctx, `${this.signUp.name} was called`);

    const { username, email, password } = signUpInput;

    this.logger.verbose(ctx, `calling ${UsersService.name}.findOneByUsername`);
    const currentUserByName: User | null =
      await this.usersService.findOneByUsername(ctx, username);

    if (currentUserByName) {
      throw new UnauthorizedException(
        errorMessages.USER_BY_NICK_ALREADY_EXISTS,
      );
    }

    const currentUserByEmail: User | null =
      await this.usersService.findOneByEmail(ctx, email);

    if (currentUserByEmail) {
      throw new UnauthorizedException(errorMessages.USER_ALREADY_EXISTS);
    }

    const newUser = plainToClass(User, {
      ...signUpInput,
      role: signUpInput.role || ERole.USER,
    });

    this.logger.verbose(ctx, `calling ${UsersService.name}.create`);
    await this.usersService.create(ctx, newUser);

    const currentUser: User = await this.validateUser(ctx, email, password);
    return await this.signIn(ctx, currentUser);
  }

  async refreshTokens(ctx: RequestContext, refreshToken: string) {
    this.logger.debug(ctx, `${this.refreshTokens.name} was called`);

    this.logger.verbose(ctx, `calling ${JwtService.name}.verify`);
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('APP_REFRESH_SECRET'),
    });

    if (!decoded) {
      throw new BadRequestException(errorMessages.INCORRECT_REQUEST);
    }

    this.logger.verbose(ctx, `calling ${UsersService.name}.findById`);
    const currentUser = await this.usersService.findById(ctx, decoded.userId);

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }
    this.logger.verbose(
      ctx,
      `calling tokenRepository.${this.tokenRepository.findOneBy.name}`,
    );
    const userToken = await this.tokenRepository.findOne({
      where: { refreshToken },
      loadRelationIds: true,
      relations: {
        user: true,
      },
    });

    if (!userToken) {
      throw new NotFoundException(errorMessages.NOT_EXIST);
    }

    this.logger.verbose(
      ctx,
      `calling tokenRepository.${this.tokenRepository.delete.name}`,
    );
    await this.tokenRepository.delete({ id: userToken.id });

    return this.signIn(ctx, currentUser);
  }

  async getTokenForReset(ctx: RequestContext, email: string) {
    this.logger.debug(ctx, `${this.getTokenForReset.name} was called`);
    const payload = { email };

    this.logger.verbose(ctx, `calling ${UsersService.name}.findOneByEmail`);
    const isUserExist = await this.usersService.findOneByEmail(ctx, email);

    if (!isUserExist) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    this.logger.verbose(ctx, `calling ${JwtService.name}.sign`);
    const resetToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('APP_JWT_SECRET'),
      expiresIn: '15m',
    });

    return resetToken;
  }

  async resetPassword(ctx: RequestContext, password: string, token: string) {
    this.logger.debug(ctx, `${this.resetPassword.name} was called`);

    this.logger.verbose(ctx, `calling ${JwtService.name}.decode`);
    const decodedToken = this.jwtService.decode(token);

    if (isPast(decodedToken['exp'] * 1000)) {
      throw new UnauthorizedException(errorMessages.TOKEN_EXPIRED);
    }

    this.logger.verbose(ctx, `calling ${UsersService.name}.findOneByEmail`);
    const currentUser = await this.usersService.findOneByEmail(
      ctx,
      decodedToken['email'],
    );

    if (!currentUser) {
      throw new NotFoundException(errorMessages.USER_NOT_FOUND);
    }

    const updateDto = {
      password,
    } as UpdateUserDto;

    await this.usersService.update(ctx, currentUser.id, updateDto);

    return {};
  }

  async logout(ctx: RequestContext, id: string) {
    this.logger.debug(ctx, `${this.resetPassword.name} was called`);

    this.logger.verbose(ctx, `calling tokenRepository.findOne`);
    const token = await this.tokenRepository.findOne({
      where: {
        user: {
          id: id,
        },
      },
    });

    if (!token) {
      throw new NotFoundException(errorMessages.TOKEN_NOT_EXIST);
    }

    this.logger.verbose(ctx, `calling tokenRepository.removeToken`);
    await this.tokenRepository.remove(token);

    return {
      isSuccess: true,
    };
  }
}
